
using Dapper;
using Library.Management.Entity;
using MySql.Data.MySqlClient;
using System;
using System.Data;

namespace Library.Management.DL.DbContext
{
    public class DatabaseUtility
    {
        /// <summary>
        /// Sinh tên store theo tên bảng và kiểu thao tác dữ liệu của store
        /// </summary>
        /// <typeparam name="T">Entity truyền vào</typeparam>
        /// <param name="procdureTypeName">Kiểu thực thi của store (Thêm, sửa, xóa)</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 (14/03/2021)
        public static string GeneateStoreName<T>(ProcdureTypeName procdureTypeName)
        {
            string storeName = string.Empty;
            var tableName = (Activator.CreateInstance<T>()).GetType().Name;
            switch (procdureTypeName)
            {
                case ProcdureTypeName.Get:
                    storeName = $"Proc_Get{tableName}";
                    break;
                case ProcdureTypeName.GetById:
                    storeName = $"Proc_Get{tableName}ByID";
                    break;
                case ProcdureTypeName.GetByCode:
                    storeName = $"Proc_Get{tableName}ByCode";
                    break;
                case ProcdureTypeName.GetByUserName:
                    storeName = $"Proc_Get{tableName}ByUserName";
                    break;
                case ProcdureTypeName.GetByEmail:
                    storeName = $"Proc_Get{tableName}ByEmail";
                    break;
                case ProcdureTypeName.GetByUserAndPassWord:
                    storeName = $"Proc_Get{tableName}ByUserNameAndPassWord";
                    break;
                case ProcdureTypeName.GetByUserAndBookDetail:
                    storeName = $"Proc_Get{tableName}ByUserAndBookDetail";
                    break;
                case ProcdureTypeName.GetByUser:
                    storeName = $"Proc_Get{tableName}ByUser";
                    break;
                case ProcdureTypeName.GetByBookDetail:
                    storeName = $"Proc_Get{tableName}ByBookDetail";
                    break;
                case ProcdureTypeName.GetPagingParamBookDetail:
                    storeName = $"Proc_Get{tableName}PagingData";
                    break;
                case ProcdureTypeName.GetPagingParamUserAccount:
                    storeName = $"Proc_Get{tableName}PagingData";
                    break;
                case ProcdureTypeName.GetPagingParamBookBorrow:
                    storeName = $"Proc_Get{tableName}PagingData";
                    break;
                case ProcdureTypeName.GetBookBorrowByUser:
                    storeName = $"Proc_Get{tableName}ByUser";
                    break;
                case ProcdureTypeName.GetListRequestActivation:
                    storeName = $"Proc_GetList{tableName}RequestActivation";
                    break;
                case ProcdureTypeName.Insert:
                    storeName = $"Proc_Insert{tableName}";
                    break;
                case ProcdureTypeName.Update:
                    storeName = $"Proc_Update{tableName}";
                    break;
                case ProcdureTypeName.UpdateAvatarUrl:
                    storeName = $"Proc_Update{tableName}AvatarUrl";
                    break;
                case ProcdureTypeName.UpdateBookImageUri:
                    storeName = $"Proc_Update{tableName}ImageUri";
                    break;
                case ProcdureTypeName.UpdateBookDownloadUri:
                    storeName = $"Proc_Update{tableName}DownloadUri";
                    break;
                case ProcdureTypeName.UpdateAccount:
                    storeName = $"Proc_Update{tableName}Account";
                    break;
                case ProcdureTypeName.UpdateUserPassWord:
                    storeName = $"Proc_Update{tableName}PassWord";
                    break;
                case ProcdureTypeName.ExtendBookBorrow:
                    storeName = $"Proc_Update{tableName}Extend";
                    break;
                case ProcdureTypeName.ConfirmBorrowActivation:
                    storeName = $"Proc_Confirm{tableName}Activation";
                    break;
                case ProcdureTypeName.Delete:
                    storeName = $"Proc_Delete{tableName}";
                    break;
                default:
                    break;
            }
            return storeName;
        }

        /// <summary>
        /// Lấy ra dữ liệu dùng cho TH join nhiều bảng với nhau
        /// </summary>
        /// <param name="_db"></param>
        /// <param name="resProcedure"></param>
        /// <param name="entity"></param>
        /// <param name="storeName"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 26/03/2021
        public static object ResponseProcedure(MySqlConnection _db, string resProcedure, object entity, string storeName)
        {
            switch (resProcedure)
            {
                case "ResponseProcedureUserComment":
                    var proc_UserComment = _db.Query<ResponseProcedureUserComment>(storeName, entity, commandType: CommandType.StoredProcedure);
                    return proc_UserComment;
                case "ResponseProcedureBookDetail":
                    var proc_BookDetail = _db.Query<ResponseProcedureBookDetail>(storeName, entity, commandType: CommandType.StoredProcedure);
                    return proc_BookDetail;
                case "ResponseProcedureBookBorrow":
                    var proc_BookBorrow = _db.Query<ResponseProcedureBookBorrow>(storeName, entity, commandType: CommandType.StoredProcedure);
                    return proc_BookBorrow;
                case "User":
                    var proc_User = _db.Query<ResponseProcedureUser>(storeName, entity, commandType: CommandType.StoredProcedure);
                    return proc_User;
                default:
                    //return _db.Query<ResponseProcedureUser>(storeName, entity, commandType: CommandType.StoredProcedure);
                    break;
            }
            return null;
        }
    }
}
