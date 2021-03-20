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
    public class BookCategoryController : BaseController<BookCategory>
    {
        private new readonly IBaseBL<BookCategory> _baseBL;
        private readonly IBookCategoryBL _bookCategoryBL;
        public BookCategoryController(IBaseBL<BookCategory> baseBL, IBookCategoryBL bookCategoryBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _bookCategoryBL = bookCategoryBL;
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        [HttpPost("InsertBookCategory")]
        public async Task<ActionServiceResult> InsertBookCategory(ParameterInsertBookCategory param)
        {
            //Khai báo lại ID vì bên client không cần truyền lên ID, ID tự sinh
            param.BookCategoryId = Guid.NewGuid();
            var res = await _bookCategoryBL.InsertBookCategory(param);
            return res;
        }

        /// <summary>
        /// Cập nhật thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 19/03/2021
        [HttpPut("UpdateBookCategory")]
        public async Task<ActionServiceResult> UpdateBookCategory(ParameterUpdateBookCategory param)
        {
            var res = await _bookCategoryBL.UpdateBookCategory(param);
            return res;
        }
    }
}
