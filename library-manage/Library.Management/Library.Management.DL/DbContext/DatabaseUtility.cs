using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Text;

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
                case ProcdureTypeName.Insert:
                    storeName = $"Proc_Insert{tableName}";
                    break;
                case ProcdureTypeName.Update:
                    storeName = $"Proc_Update{tableName}";
                    break;
                case ProcdureTypeName.UpdateAccount:
                    storeName = $"Proc_Update{tableName}Account";
                    break;
                case ProcdureTypeName.Delete:
                    storeName = $"Proc_Delete{tableName}";
                    break;
                default:
                    break;
            }
            return storeName;
        }
    }
}
