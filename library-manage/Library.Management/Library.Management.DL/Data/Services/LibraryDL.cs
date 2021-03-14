using Dapper;
using Library.Management.BL.Entities.Request;
using Library.Management.BL.Entities.Response;
using Library.Management.BL.Enums;
using Library.Management.BL.Interfaces;
using Library.Management.BL.Models;
using Library.Management.DL.DbContext;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL.Data.Services
{
    public class LibraryDL: ILibraryDL
    {
        private readonly IConfiguration _config;
        public LibraryDL(IConfiguration config)
        {
            _config = config;
        }
        /// <summary>
        /// Lấy ra dữ liệu bản ghi thông qua khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<Book> GetEntitiesByID(string id)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = DatabaseUtility.GeneateStoreName<Book>(ProcdureTypeName.GetById);
            var entities = _db.QueryFirstOrDefault<Book>(storeName, new { id }, commandType: CommandType.StoredProcedure);
            _db.Clone();
            return await Task.FromResult(entities);
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<object> InsertBookDetail(ParameterInsertBook param)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = DatabaseUtility.GeneateStoreName<Book>(ProcdureTypeName.Insert);
            var entities = _db.Query<Book>(storeName, param, commandType: CommandType.StoredProcedure);
            _db.Clone();
            return await Task.FromResult(entities);
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<object> InsertBookCategory(ParameterInsertBookCategory param)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = DatabaseUtility.GeneateStoreName<BookCategory>(ProcdureTypeName.Insert);
            var entities = _db.Query<BookCategory>(storeName, param, commandType: CommandType.StoredProcedure);
            _db.Clone();
            return await Task.FromResult(entities);
        }
    }
}
