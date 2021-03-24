using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Management.Web
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookBorrowController : BaseController<BookBorrow>
    {
        private new readonly IBaseBL<BookBorrow> _baseBL;
        private readonly IBookBorrowBL _bookBorrowBL;
        public BookBorrowController(IBaseBL<BookBorrow> baseBL, IBookBorrowBL bookBorrowBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _bookBorrowBL = bookBorrowBL;
        }

        /// <summary>
        /// Tạo mới giao dịch mượn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPost("InsertBookBorrow")]
        public async Task<ActionServiceResult> InsertBookBorrow(ParameterInsertBookBorrow param)
        {
            var res = new ActionServiceResult();
            res = await _bookBorrowBL.InsertBookBorrow(param);
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin trả sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPost("UpdateBookBorrow")]
        public async Task<ActionServiceResult> UpdateBookBorrow(ParameterUpdateBookBorrow param)
        {
            var res = new ActionServiceResult();
            res = await _bookBorrowBL.UpdateBookBorrow(param);
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin gia hạn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPost("ExtendBookBorrow")]
        public async Task<ActionServiceResult> ExtendBookBorrow(ParameterExtendBookBorrow param)
        {
            var res = new ActionServiceResult();
            res = await _bookBorrowBL.ExtendBookBorrow(param);
            return res;
        }
    }
}
