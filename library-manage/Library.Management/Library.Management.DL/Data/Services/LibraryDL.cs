using Dapper;
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
        public async Task<Book> GetEntitiesByID(string id)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = DatabaseUtility.GeneateStoreName<Book>(ProcdureTypeName.GetById);
            var entities = _db.QueryFirstOrDefault<Book>(storeName, id, commandType: CommandType.StoredProcedure);
            _db.Clone();
            return await Task.FromResult(entities);
        }
    }
}
