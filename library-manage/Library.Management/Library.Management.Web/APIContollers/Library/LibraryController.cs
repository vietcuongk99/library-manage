using Library.Management.BL.Entities.Response;
using Library.Management.BL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Management.Web.Controllers.Library
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly ILibraryBL _libraryBL;
        public LibraryController(ILibraryBL libraryBL)
        {
            _libraryBL = libraryBL;
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
            res.Data = await _libraryBL.GetEntitiesByID(id);
            return res;
        }
    }
}
