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
    public class BookBorrowDL : IBookBorrowDL
    {
        private readonly IConfiguration _config;
        public BookBorrowDL(IConfiguration config)
        {
            _config = config;
        }
        public async Task<IReadOnlyList<Y>> GetListRequestActivation<Y>()
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = "GetListBorrowBook";
            var entities = _db.Query<Y>(storeName, commandType: CommandType.StoredProcedure);
            _db.Close();
            return (IReadOnlyList<Y>)await Task.FromResult(entities);
        }
    }
}
