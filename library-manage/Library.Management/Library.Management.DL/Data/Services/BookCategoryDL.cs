using Dapper;
using Library.Management.DL.DbContext;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public class BookCategoryDL : IBookCategoryDL
    {
        private readonly IConfiguration _config;
        public BookCategoryDL(IConfiguration config)
        {
            _config = config;
        }

        public async Task<BookCategory> GetBookCategoryByName(string categoryName)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = "Proc_GetBookCategoryByName";
            var entities = _db.QueryFirstOrDefault<BookCategory>(storeName, new { categoryName }, commandType: CommandType.StoredProcedure);
            _db.Close();
            return await Task.FromResult(entities);
        }
    }
}
