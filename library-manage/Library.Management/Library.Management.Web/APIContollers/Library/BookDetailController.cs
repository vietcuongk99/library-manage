using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
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
    public class BookDetailController : BaseController<Book>
    {
        private new readonly IBaseBL<Book> _baseBL;
        private readonly IBookDetailBL _bookDetailBL;
        public BookDetailController(IBaseBL<Book> baseBL, IBookDetailBL bookDetailBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _bookDetailBL = bookDetailBL;
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        [HttpPost("InsertBookDetail")]
        public async Task<ActionServiceResult> InsertBookDetail(ParameterInsertBook param)
        {
            //Khai báo lại ID vì bên client không cần truyền lên ID, ID tự sinh
            param.BookId = Guid.NewGuid();
            var res = await _bookDetailBL.InsertBookDetail(param);
            return res;
        }

        /// <summary>
        /// Cập nhật 1 cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 19/03/2021
        [HttpPut("UpdateBookDetail")]
        public async Task<ActionServiceResult> UpdateBookDetail(ParameterUpdateBook param)
        {
            var res = await _bookDetailBL.UpdateBookDetail(param);
            return res;
        }
    }
}
