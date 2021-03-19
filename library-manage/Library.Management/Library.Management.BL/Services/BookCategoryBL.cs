using Dapper;
using Library.Management.Entity.Models;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public class BookCategoryBL : IBookCategoryBL
    {
        private readonly IConfiguration _config;
        public BookCategoryBL(IConfiguration config)
        {
            _config = config;
        }
        /// <summary>
        /// Lấy loại sách theo tên loại sách
        /// </summary>
        /// <param name="categoryName"></param>
        /// <returns></returns>
        public async Task<BookCategory> GetBookCategoryByName(string categoryName)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            var storeName = "Proc_GetBookCategoryByName";
            var entities = _db.QueryFirstOrDefault<BookCategory>(storeName, new { categoryName }, commandType: CommandType.StoredProcedure);
            return await Task.FromResult(entities);
        }
    }
}
