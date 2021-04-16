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
    public class BookDetailDL: IBookDetailDL
    {
        private readonly IConfiguration _config;
        public BookDetailDL(IConfiguration config)
        {
            _config = config;
        }
        public async Task<object> GetMonitorActivation(ProcdureTypeName procdureTypeName)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = DatabaseUtility.GeneateStoreName<Book>(procdureTypeName);
            var entities = _db.QueryMultiple(storeName, commandType: CommandType.StoredProcedure);
            var totalBook = entities.Read<ResponseProcedureTotalBook>();
            var totalBookBorrow = entities.Read<ResponseProcedureTotalBookBorrow>();
            var totalBookActived = entities.Read<ReponseProcedureTotalBorrowInBook>();
            _db.Close();
            return await Task.FromResult(new { TotalBook = totalBook, TotalBookBorrow = totalBookBorrow, TotalBookActived = totalBookActived });
        }

    }
}
