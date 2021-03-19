using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Properties;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public class BaseBL<T> : IBaseBL<T>
    {
        protected readonly IBaseDL<T> _baseDL;
        public BaseBL(IBaseDL<T> baseDL)
        {
            _baseDL = baseDL;
        }

        /// <summary>
        /// Lấy toàn bộ dữ liệu
        /// </summary>
        /// <returns></returns>
        /// CreateBy: VDDUNG(19/03/2021)
        public async virtual Task<IReadOnlyList<T>> GetEntities()
        {
            var entities = await _baseDL.GetListAsync();
            return entities;
        }


        /// <summary>
        /// Lấy ra thông tin bản ghi theo khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<T> GetEntityById(string id)
        {
            return await _baseDL.GetEntityById(id);
        }
        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<ActionServiceResult> Insert(object param)
        {
                return new ActionServiceResult
                {
                    Success = true,
                    LibraryCode = LibraryCode.Success,
                    Message = GlobalResource.Success,
                    Data = await _baseDL.AddAsync(param)
                };
        }
        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="param">Param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<ActionServiceResult> Update(object param)
        {
            return new ActionServiceResult
            {
                Success = true,
                LibraryCode = LibraryCode.Success,
                Message = GlobalResource.Success,
                Data = await _baseDL.UpdateAsync(param)
            };
        }

        /// <summary>
        /// Xóa nhiều bản ghi
        /// </summary>
        /// <param name="listID">List ID bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<int> Delete(object id)
        {
            return await _baseDL.Delete(id);
        }
    }
}
