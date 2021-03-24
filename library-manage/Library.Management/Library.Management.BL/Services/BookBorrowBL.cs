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
        /// Thêm mới giao dịch mượn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<ActionServiceResult> InsertBookBorrow(ParameterInsertBookBorrow param)
        {
            var res = new ActionServiceResult();
            var bookBorrow = new BookBorrow();
            InsertParamBookBorrowBeforeSetEntity(param, bookBorrow);
            res.Data = await _baseDL.AddAsync(bookBorrow, ProcdureTypeName.Insert);
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
            bookBorrow.ReturnDate = param.ReturnDate;
            bookBorrow.BorrowDate = param.BorrowDate;
            //Đã mượn sách
            bookBorrow.BorrowStatus = (int)Status.Active;
            //Chưa trả sách
            bookBorrow.ReturnStatus = (int)Status.DeActive;
            bookBorrow.CreatedBy = GlobalResource.CreatedBy;
            bookBorrow.CreatedDate = DateTime.Now;
            bookBorrow.Status = (int)Status.Active;
        }

        /// <summary>
        /// Cập nhật thông tin trả sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        public async Task<ActionServiceResult> UpdateBookBorrow(ParameterUpdateBookBorrow param)
        {
            var res = new ActionServiceResult();
            var bookborrow = new BookBorrow();
            if (param.BookBorrowId != null)
            {
                var bookBorrowByID = await _baseDL.GetEntityById(param.BookBorrowId.ToString());
                if(bookBorrowByID == null)
                {
                    res.Success = false;
                    res.Message = GlobalResource.Failed;
                    res.LibraryCode = LibraryCode.Failed;
                }
                else
                {
                    bookborrow.BookBorrowId = param.BookBorrowId;
                    bookborrow.BorrowStatus = (int)Status.DeActive;
                    bookborrow.ReturnStatus = (int)Status.Active;
                    bookborrow.ModifiedBy = GlobalResource.CreatedBy;
                    bookborrow.ModifiedDate = DateTime.Now;
                    res.Data = await _baseDL.UpdateAsync(bookborrow, ProcdureTypeName.Update);
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
        public async Task<ActionServiceResult> ExtendBookBorrow(ParameterExtendBookBorrow param)
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
                    if(bookBorrowByID.BorrowStatus == (int)Status.DeActive)
                    {
                        //Không mượn sách
                        res.Success = false;
                        res.Message = GlobalResource.ErrorExtendBookBorrow;
                        res.LibraryCode = LibraryCode.ErrorExtendBookBorrow;
                    }
                    else
                    {
                        //Có mượn sách
                        //Tiến hành gia hạn
                        bookborrow.BookBorrowId = param.BookBorrowId;
                        bookborrow.ReturnDate = param.ReturnDate;
                        bookborrow.ModifiedBy = GlobalResource.CreatedBy;
                        bookborrow.ModifiedDate = DateTime.Now;
                        res.Data = await _baseDL.UpdateAsync(bookborrow, ProcdureTypeName.ExtendBookBorrow);
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
