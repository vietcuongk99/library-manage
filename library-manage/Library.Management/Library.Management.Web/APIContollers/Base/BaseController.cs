using Library.Management.BL;
using Library.Management.Entity;
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
    public abstract class BaseController<T> : ControllerBase
    {
        protected readonly IBaseBL<T> _baseBL;
        public BaseController(IBaseBL<T> baseBL)
        {
            _baseBL = baseBL;
        }
        /// <summary>
        /// Lấy ra thông tin bản ghi theo khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        [HttpGet("{id}")]
        public virtual async Task<ActionServiceResult> GetEntityByID(string id)
        {
            var res = new ActionServiceResult();
            if (string.IsNullOrEmpty(id))
            {
                res.Success = false;
                res.LibraryCode = LibraryCode.ValidateEntity;
                res.Message = GlobalResource.ValidateEntity;
            }
            else
            {
                var entity = await _baseBL.GetEntityById(id);
                if (entity == null)
                {
                    res.Success = false;
                    res.LibraryCode = LibraryCode.NotFound;
                    res.Message = GlobalResource.NotFound;
                }
                else
                {
                    res.Data = entity;
                }
            }

            return res;
        }

        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        [HttpPost]
        public virtual async Task<ActionServiceResult> Post([FromBody] T entity)
        {
            var response = new ActionServiceResult();
            // Validate dữ liệu theo các Attribure Property
            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = GlobalResource.ValidateEntity;
                response.LibraryCode = LibraryCode.ValidateEntity;
                response.Data = ModelState;
            }
            else
            {
                var result = await _baseBL.Insert(entity);
                if (result.Success == false)
                {
                    response.Success = false;
                    response.LibraryCode = LibraryCode.ErrorAddEntity;
                    response.Message = GlobalResource.ErrorAddEntity;
                }
            }
            return response;

        }

        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="param">Param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        [HttpPut]
        public virtual async Task<ActionServiceResult> Put([FromBody] T entity)
        {
            var response = new ActionServiceResult();
            if (entity == null)
            {
                response.Success = false;
                response.LibraryCode = LibraryCode.NotFound;
                response.Message = GlobalResource.NotFound;
            }
            else
            {
                response = await _baseBL.Update(entity);
            }
            return response;
        }

        /// <summary>
        /// Xóa nhiều bản ghi
        /// </summary>
        /// <param name="listID">List ID bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        [HttpDelete("GroupID")]
        public virtual async Task<ActionServiceResult> Delete([FromBody] List<string> listID)
        {
            var response = new ActionServiceResult();
            var totalVoucherGroupDeleted = 0;

            if (listID.Count == 0 || listID == null)
            {
                response.Success = false;
                response.LibraryCode = LibraryCode.ValidateEntity;
                response.Message = GlobalResource.ValidateEntity;
            }
            else
            {
                // Đặt vòng lặp xóa từng bản ghi một
                foreach (var id in listID)
                {
                    var result = await _baseBL.Delete(id);
                    totalVoucherGroupDeleted += result;
                }
                if (totalVoucherGroupDeleted == 0)
                {
                    response.Success = false;
                    response.Message = GlobalResource.ErrorDeleteEntity;
                    response.LibraryCode = LibraryCode.ErrorDeleteEntity;
                }
                else
                {
                    response.Success = true;
                    response.Message = GlobalResource.Success;
                    response.LibraryCode = LibraryCode.Success;
                    response.Data = new
                    {
                        TotalCountDelete = totalVoucherGroupDeleted
                    };
                }
            }
            return response;
        }
    }
}
