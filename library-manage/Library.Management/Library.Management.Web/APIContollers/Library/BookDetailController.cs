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
        /// Lấy ra dữ liệu bản ghi thông qua khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        [HttpGet("{id}")]
        public async Task<ActionServiceResult> GetEntities(string id)
        {
            var res = new ActionServiceResult();
            res.Data = await _baseBL.GetEntityById(id);
            return res;
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
            var res = new ActionServiceResult();
            res.Data = await _baseBL.Insert(param);
            return res;
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
            var res = new ActionServiceResult();
            res.Data = await _bookDetailBL.InsertBookCategory(param);
            return res;
        }
    }
}
