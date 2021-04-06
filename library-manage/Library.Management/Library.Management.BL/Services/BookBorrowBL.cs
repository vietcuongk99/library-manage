using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public class BookBorrowBL : IBookBorrowBL
    {

        private readonly IBookBorrowDL _bookBorrowDL;
        private readonly IBaseDL<BookBorrow> _baseDL;

        public BookBorrowBL(IBaseDL<BookBorrow> baseDL, IBookBorrowDL bookBorrowDL)
        {
            _baseDL = baseDL;
            _bookBorrowDL = bookBorrowDL;
        }

        /// <summary>
        /// Lấy danh sách sách đã mượn và yêu cầu mượn sách của người dùng
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 29/03/2021
        /// ModifiedBy: CUONG 06/04/2021
        public async Task<ActionServiceResult> GetPagingData(ParamFilterBookBorrow param)
        {
            var res = new ActionServiceResult();
            res.Data = await _baseDL.GetEntityByMultipleTable<ResponseProcedureBookBorrow>(param, ProcdureTypeName.GetPagingParamUserAccount);
            return res;
        }

        /// <summary>
        /// Gửi danh sách các yêu cầu mượn sách
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 04/04/2021
        public async Task<ActionServiceResult> GetListRequestActivation()
        {
            var res = new ActionServiceResult();
            res.Data = await _baseDL.GetListAsyncV2<ReponseProcedureListRequestBorrowActivation>(ProcdureTypeName.GetListRequestActivation);
            return res;
        }

        /// <summary>
        /// Thêm mới giao dịch mượn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<ActionServiceResult> BorrowActivation(ParameterInsertBookBorrow param)
        {
            var res = new ActionServiceResult();
            var bookBorrow = new BookBorrow();
            //Lấy ra sách đã mượn của 1 tài khoản (không tính sách đã trả lại)
            var bookborrowbyuser = await _baseDL.GetListAsyncByEntity(new { param.UserId }, ProcdureTypeName.GetBookBorrowByUser);
            //Nếu số lượng đang mượn và đang gửi yêu cầu vượt quá maxtotal thì thông báo
            if (bookborrowbyuser.Count > int.Parse(GlobalResource.TotalCountBookBorrowMax))
            {
                res.Success = false;
                res.Message = GlobalResource.OverCountBookBorrow;
                res.LibraryCode = LibraryCode.OverCountBookBorrow;
            }
            else
            {
                InsertParamBookBorrowBeforeSetEntity(param, bookBorrow);
                await _baseDL.AddAsync(bookBorrow, ProcdureTypeName.Insert);
                res.Data = bookBorrow;
            }
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin trước khi thêm mới giao dịch và cập nhật lên DB
        /// </summary>
        /// <param name="param"></param>
        /// <param name="bookBorrow"></param>
        /// CreatedBy: VDDUNG1 24/03/2021
        private void InsertParamBookBorrowBeforeSetEntity(ParameterInsertBookBorrow param, BookBorrow bookBorrow)
        {
            bookBorrow.BookBorrowId = Guid.NewGuid();
            bookBorrow.BookId = param.BookId;
            bookBorrow.UserId = param.UserId;
            //Đã mượn sách
            bookBorrow.BorrowStatus = (int)Status.Active;
            //Chưa trả sách
            bookBorrow.ReturnStatus = (int)Status.DeActive;
            bookBorrow.CreatedBy = GlobalResource.CreatedBy;
            bookBorrow.CreatedDate = DateTime.Now;
            bookBorrow.Status = (int)Status.DeActive; //vddung1 sửa trạng thái thành chưa active để bên admin confirm
        }

        /// <summary>
        /// Xác nhận các yêu cầu mượn sách Admin
        /// </summary>
        /// <param name="id"></param>
        /// <param name="statusActivate"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 04/04/2021
        public async Task<ActionServiceResult> ConfirmBorrowActivation(string id, int statusActivate)
        {
            var res = new ActionServiceResult();
            var requestBorrow = await _baseDL.GetEntityById(id);
            if (requestBorrow == null)
            {
                res.Success = false;
                res.Message = GlobalResource.CancelRequestBorrow;
                res.LibraryCode = LibraryCode.CancelRequestBorrow;
            }
            else
            {
                if (statusActivate == (int)StatusActivate.Remove)
                {
                    await _baseDL.Delete(id);
                    res.Data = 1; // thành công
                }
                else if (statusActivate == (int)StatusActivate.Confirm)
                {
                    var param = new
                    {
                        BookBorrowID = id,
                        BorrowDate = DateTime.Now,
                        ReturnDate = DateTime.Now.AddDays(int.Parse(GlobalResource.TotalMaxReturnDate)),
                        Status = (int)Status.Active
                    };

                    await _baseDL.UpdateAsync(param, ProcdureTypeName.ConfirmBorrowActivation);
                    res.Data = 1; // thành công
                }
            }
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin trả sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        public async Task<ActionServiceResult> RestoreActivation(ParameterUpdateBookBorrow param)
        {
            var res = new ActionServiceResult();
            var bookborrow = new BookBorrow();
            if (param.BookBorrowId != null)
            {
                var bookBorrowByID = await _baseDL.GetEntityById(param.BookBorrowId.ToString());
                if (bookBorrowByID == null)
                {
                    res.Success = false;
                    res.Message = GlobalResource.Failed;
                    res.LibraryCode = LibraryCode.Failed;
                }
                else
                {
                    bookborrow.BookBorrowId = param.BookBorrowId;
                    bookborrow.BookId = bookBorrowByID.BookId;
                    bookborrow.UserId = bookBorrowByID.UserId;
                    bookborrow.BorrowDate = bookBorrowByID.BorrowDate;
                    bookborrow.ReturnDate = DateTime.Now;
                    bookborrow.BorrowStatus = (int)Status.DeActive;
                    bookborrow.ReturnStatus = (int)Status.Active;
                    bookborrow.CreatedDate = bookBorrowByID.CreatedDate;
                    bookborrow.CreatedBy = bookBorrowByID.CreatedBy;
                    bookborrow.ModifiedBy = GlobalResource.CreatedBy;
                    bookborrow.ModifiedDate = DateTime.Now;
                    bookborrow.Status = (int)Status.DeActive; //vddung sửa lại thành trả sách thì trạng thái chuyển thành DeActive
                    await _baseDL.UpdateAsync(bookborrow, ProcdureTypeName.Update);
                    res.Data = bookborrow;
                }
            }
            else
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin gia hạn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        public async Task<ActionServiceResult> ExtendActivation(ParameterExtendBookBorrow param)
        {
            var res = new ActionServiceResult();
            var bookborrow = new BookBorrow();
            if (param.BookBorrowId != null)
            {
                var bookBorrowByID = await _baseDL.GetEntityById(param.BookBorrowId.ToString());
                if (bookBorrowByID == null)
                {
                    res.Success = false;
                    res.Message = GlobalResource.Failed;
                    res.LibraryCode = LibraryCode.Failed;
                }
                else
                {
                    if (bookBorrowByID.BorrowStatus == (int)Status.DeActive)
                    {
                        //Không mượn sách
                        res.Success = false;
                        res.Message = GlobalResource.ErrorExtendBookBorrow;
                        res.LibraryCode = LibraryCode.ErrorExtendBookBorrow;
                    }
                    //Nếu chưa hết hạn và ngày gia hạn mới lớn hơn ngày hết hạn cũ + maxExtend ngày
                    else if (DateTime.Now < bookBorrowByID.ReturnDate
                        && param.ReturnDate > bookBorrowByID.ReturnDate.AddDays(int.Parse(GlobalResource.TotalMaxReturnDateExtend)))
                    {
                        res.Success = false;
                        res.Message = string.Format(GlobalResource.OverMaxReturnDate, GlobalResource.TotalMaxReturnDateExtend);
                        res.LibraryCode = LibraryCode.OverMaxReturnDate;
                    }

                    //Nếu đã hết hạn và ngày gia hạn mới lớn hơn ngày hôm nay + maxExtend ngày
                    else if (DateTime.Now > bookBorrowByID.ReturnDate
                        && param.ReturnDate > DateTime.Now.AddDays(int.Parse(GlobalResource.TotalMaxReturnDateExtend)))
                    {
                        res.Success = false;
                        res.Message = string.Format(GlobalResource.OverMaxReturnDate, GlobalResource.TotalMaxReturnDateExtend);
                        res.LibraryCode = LibraryCode.OverMaxReturnDate;
                    }
                    else
                    {
                        //Có mượn sách
                        //Tiến hành gia hạn
                        bookborrow.BookBorrowId = param.BookBorrowId;
                        bookborrow.BookId = bookBorrowByID.BookId;
                        bookborrow.UserId = bookBorrowByID.UserId;
                        bookborrow.BorrowDate = bookBorrowByID.BorrowDate;
                        bookborrow.ReturnDate = param.ReturnDate;
                        bookborrow.BorrowStatus = bookBorrowByID.BorrowStatus;
                        bookborrow.ReturnStatus = bookBorrowByID.ReturnStatus;
                        bookborrow.CreatedDate = bookBorrowByID.CreatedDate;
                        bookborrow.CreatedBy = bookBorrowByID.CreatedBy;
                        bookborrow.ModifiedBy = GlobalResource.CreatedBy;
                        bookborrow.ModifiedDate = DateTime.Now;
                        bookborrow.Status = bookBorrowByID.Status;
                        await _baseDL.UpdateAsync(bookborrow, ProcdureTypeName.ExtendBookBorrow);
                        res.Data = bookborrow;
                    }
                }
            }
            else
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }
    }
}
