using Dapper;
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
    public class UserAccountDL : IUserAccountDL
    {
        private readonly IConfiguration _config;
        public UserAccountDL(IConfiguration config)
        {
            _config = config;
        }
        public async Task<object> ChangeUserAdmin(Guid userID, int conditionAccount)
        {
            var _db = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
            _db.Open();
            var storeName = "Proc_UpdateAdminUser";
            var entities = _db.QueryFirstOrDefault<User>(storeName, new { userID, conditionAccount }, commandType: CommandType.StoredProcedure);
            _db.Close();
            return await Task.FromResult(entities);
        }
    }
}
