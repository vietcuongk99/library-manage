using Dapper;
using Library.Management.DL.Interfaces;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL.DbContext
{
    public class DapperContext : IDapper
    {
        public static string ConnectionsString = "server=47.241.69.179;port=3306;user=dev;password=12345678;database=Library_Management";
        public DapperContext()
        {
            DbConnection = new MySqlConnection(ConnectionsString);
        }

        public IDbConnection DbConnection;

        public async Task<int> Execute(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new MySqlConnection(ConnectionsString);
            var result = await db.ExecuteAsync(sp, parms);
            return result;
        }

        public async Task<T> Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.Text)
        {
            using IDbConnection db = new MySqlConnection(ConnectionsString);
            var result = await db.QueryAsync<T>(sp, parms, commandType: commandType);
            return result.FirstOrDefault();
        }

        public async Task<T> GetById<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new MySqlConnection(ConnectionsString);
            var result = await db.QueryFirstOrDefaultAsync<T>(sp, parms);
            return result;
        }

        public async Task<List<T>> GetAll<T>(string queryCommand, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new MySqlConnection(ConnectionsString);
            return (await db.QueryAsync<T>(queryCommand, parms, commandType: commandType)).ToList();
        }

        public DbConnection GetDbconnection()
        {
            return new MySqlConnection(ConnectionsString);
        }

        public async Task<T> Insert<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            T result;
            using IDbConnection db = new MySqlConnection(ConnectionsString);
            try
            {
                if (db.State == ConnectionState.Closed)
                    db.Open();

                using var tran = db.BeginTransaction();
                try
                {
                    result = (await db.QueryAsync<T>(sp, parms, commandType: commandType, transaction: tran)).FirstOrDefault();
                    tran.Commit();
                }
                catch (Exception ex)
                {
                    tran.Rollback();
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (db.State == ConnectionState.Open)
                    db.Close();
            }

            return result;
        }

        public async Task<T> Update<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            T result;
            using IDbConnection db = new MySqlConnection(ConnectionsString);
            try
            {
                if (db.State == ConnectionState.Closed)
                    db.Open();

                using var tran = db.BeginTransaction();
                try
                {
                    result = (await db.QueryAsync<T>(sp, parms, commandType: commandType, transaction: tran)).FirstOrDefault();
                    tran.Commit();
                }
                catch (Exception ex)
                {
                    tran.Rollback();
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (db.State == ConnectionState.Open)
                    db.Close();
            }

            return result;
        }

        public void Dispose()
        {

        }
    }
}
