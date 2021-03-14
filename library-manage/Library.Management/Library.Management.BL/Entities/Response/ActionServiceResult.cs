using Library.Management.BL.Enums;
using Library.Management.BL.Properties;
using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.BL.Entities.Response
{
    public class ActionServiceResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public LibraryCode LibraryCode { get; set; }
        public object Data { get; set; }

        /// <summary>
        /// Hàm khởi tạo mặc định
        /// </summary>
        public ActionServiceResult()
        {
            Success = true;
            Message = GlobalResource.Success;
            LibraryCode = LibraryCode.Success;
            Data = null;
        }

        public ActionServiceResult(bool success, string message, LibraryCode librarycode, object data)
        {
            Success = success;
            Message = message;
            LibraryCode = librarycode;
            Data = data;
        }
    }
}
