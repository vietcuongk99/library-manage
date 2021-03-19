using Dapper;
using Library.Management.DL.DbContext;
using Library.Management.Entity;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public class BaseDL<T> : IBaseDL<T>
    {
        private readonly IConfiguration _config;
        public BaseDL(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Lấy toàn bộ danh sách các bản ghi của bảng có trong Database
        /// </summary>
        /// <returns></returns>
        /// CreateBy: VDDUNG(19/03/2021)
        public async Task<IReadOnlyList<T>> GetListAsync()
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            var storeName = DatabaseUtility.GeneateStoreName<T>(ProcdureTypeName.Get);
            var entities = _db.Query<T>(storeName, commandType: CommandType.StoredProcedure);
            return (IReadOnlyList<T>)await Task.FromResult(entities);
        }

        /// <summary>
        /// Lấy ra thông tin bản ghi theo khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async Task<T> GetEntityById(string id)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            var storeName = DatabaseUtility.GeneateStoreName<T>(ProcdureTypeName.GetById);
            var entities = _db.QueryFirstOrDefault<T>(storeName, new { id }, commandType: CommandType.StoredProcedure);
            return await Task.FromResult(entities);
        }
        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async Task<object> AddAsync(object param)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            var storeName = DatabaseUtility.GeneateStoreName<T>(ProcdureTypeName.Insert);
            var entities = _db.Query<T>(storeName, param, commandType: CommandType.StoredProcedure);
            return await Task.FromResult(entities);
        }
        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="param">Param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async Task<object> UpdateAsync(object param)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            var storeName = DatabaseUtility.GeneateStoreName<T>(ProcdureTypeName.Update);
            var entities = _db.Query<T>(storeName, param, commandType: CommandType.StoredProcedure);
            return await Task.FromResult(entities);
        }

        /// <summary>
        /// Xóa nhiều bản ghi
        /// </summary>
        /// <param name="listID">List ID bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async Task<int> Delete(object id)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            var storeName = DatabaseUtility.GeneateStoreName<T>(ProcdureTypeName.Delete);
            var entities = _db.Query<T>(storeName, new { id }, commandType: CommandType.StoredProcedure);
            if (entities != null)
            {
                return 1;
            }
            return 0;
        }
    }
}
