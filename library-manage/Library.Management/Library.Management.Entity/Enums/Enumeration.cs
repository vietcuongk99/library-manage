using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    /// <summary>
    /// Kiểu phương thức
    /// CreatedBy: VDDUNG1
    /// </summary>
    public enum EntityState
    {
        /// <summary>
        /// Lấy dữ liệu
        /// </summary>
        GET,

        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        INSERT,

        /// <summary>
        /// Sửa dữ liệu
        /// </summary>
        UPDATE,

        /// <summary>
        /// Xóa dữ liệu
        /// </summary>
        DELETE
    }

    /// <summary>
    /// Các mã lỗi
    /// CreatedBy: VDDUNG1(14/03/2021)
    /// </summary>
    public enum LibraryCode
    {
        Success = 200,
        /// <summary>
        /// Lỗi validate dữ liệu chung
        /// </summary>
        Validate = 400,

        /// <summary>
        /// Lỗi validate dữ liệu không hợp lệ
        /// </summary>
        ValidateEntity = 401,

        /// <summary>
        /// Lỗi không tìm thấy dữ liệu
        /// </summary>
        NotFound = 404,

        /// <summary>
        /// Lỗi Exception
        /// </summary>
        Exception = 500,
        /// <summary>
        /// Thêm mới không thành công
        /// </summary>
        ErrorAddEntity = 600,
        /// <summary>
        /// Xóa bản ghi không thành công
        /// </summary>
        ErrorDeleteEntity = 601,
        /// <summary>
        /// Thể loại sách không tồn tại
        /// </summary>
        ErrorBookCategory = 602,
        /// <summary>
        /// Mã sách đã tồn tại
        /// </summary>
        ErrorBookExist = 603,
        /// <summary>
        /// Mã loại sách đã tồn tại
        /// </summary>
        ErrorBookCategoryExist = 604,
        /// <summary>
        /// Cập nhật không thành công
        /// </summary>
        ErrorUpdateEntity = 605,
        /// <summary>
        /// Lỗi không tìm thấy dữ liệu
        /// </summary>
        ErrorNotIDEntity = 606,

        ErrorUserAccount = 607,

        Failed = 1000
    }

    /// <summary>
    /// Tên kiểu store sẽ thực thi
    /// </summary>
    /// CreatedBy: VDDUNG1 (14/03/2021)
    public enum ProcdureTypeName
    {
        /// <summary>
        ///  Lấy dữ liệu
        /// </summary>
        Get,

        /// <summary>
        /// Lấy dữ liệu theo khóa chính
        /// </summary>
        GetById,
        /// <summary>
        /// Lấy dữ liệu theo mã code
        /// </summary>
        GetByCode,
        /// <summary>
        /// Thêm mới
        /// </summary>
        Insert,

        /// <summary>
        /// Sửa/ cập nhật dữ liệu
        /// </summary>
        Update,

        /// <summary>
        /// Xóa dữ liệu
        /// </summary>
        Delete
    }

    public enum StatusBook
    {
        /// <summary>
        /// Còn sử dụng
        /// </summary>
        Active = 1,
        /// <summary>
        /// Không sử dụng
        /// </summary>
        DeActive = 0
    }
}
