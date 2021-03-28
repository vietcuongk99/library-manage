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
        /// <summary>
        /// Lỗi tài khoản không tồn tại
        /// </summary>
        ErrorUserAccount = 607,

        /// <summary>
        /// Lỗi mã OTP sai
        /// </summary>
        ErrorOTPCode = 608,
        /// <summary>
        /// Tên tài khoản hoặc địa chỉ mail đã tồn tại
        /// </summary>
        IsExistUserAccount = 609,
        /// <summary>
        /// Địa chỉ mail đã tồn tại
        /// </summary>
        IsUsedEmail = 610,
        /// <summary>
        /// Tài khoản hoặc mật khẩu không chính xác
        /// </summary>
        ErrorUserAccountValidate = 611,
        /// <summary>
        /// Không thể đổi mật khẩu
        /// </summary>
        ErrorConfirmOTPPassWord = 612,
        /// <summary>
        /// Chưa mượn cuốn sách này
        /// </summary>
        ErrorExtendBookBorrow = 613,
        /// <summary>
        /// Bình luận không tồn tại
        /// </summary>
        ErrorCommentUser = 614,
        /// <summary>
        /// Mật khẩu không chính xác
        /// </summary>
        ErrorUserPassWord = 615,
        /// <summary>
        /// Mã OTP đã hết hiệu lực
        /// </summary>
        ExpiryTimeOTP = 616,
        /// <summary>
        /// Thất bại
        /// </summary>
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
        /// Lấy thông tin theo 1 trường thông tin
        /// </summary>
        GetByUserName,
        /// <summary>
        /// Lấy thông tin tài khoản qua email
        /// </summary>
        GetByEmail,
        /// <summary>
        /// Kiểm tra tài khoản và mật khẩu
        /// </summary>
        GetByUserAndPassWord,
        /// <summary>
        /// Lấy ra bình luận của 1 người dùng trên 1 cuốn sách
        /// </summary>
        GetByUserAndBookDetail,
        /// <summary>
        /// Lấy ra các bình luận của 1 người dùng
        /// </summary>
        GetByUser,
        /// <summary>
        /// Lấy ra các bình luận của 1 cuốn sách
        /// </summary>
        GetByBookDetail,
        /// <summary>
        /// Lọc dữ liệu phân trang sách
        /// </summary>
        GetPagingParamBookDetail,
        /// <summary>
        /// Lọc dữ liệu phân trang tài khoản
        /// </summary>
        GetPagingParamUserAccount,
        /// <summary>
        /// Thêm mới
        /// </summary>
        Insert,

        /// <summary>
        /// Sửa/ cập nhật dữ liệu
        /// </summary>
        Update,
        /// <summary>
        /// Cập nhật tài khoản
        /// </summary>
        UpdateAccount,
        /// <summary>
        /// Cập nhật mật khẩu
        /// </summary>
        UpdateUserPassWord,
        /// <summary>
        /// Cập nhật ảnh đại diện người dùng
        /// </summary>
        UpdateAvatarUrl,
        /// <summary>
        /// Cập nhật ảnh đại diện sách
        /// </summary>
        UpdateBookImageUri,
        /// <summary>
        /// Cập nhật link xem chi tiết sách
        /// </summary>
        UpdateBookDownloadUri,
        /// <summary>
        /// Gia hạn sách
        /// </summary>
        ExtendBookBorrow,

        /// <summary>
        /// Xóa dữ liệu
        /// </summary>
        Delete
    }

    public enum Status
    {
        /// <summary>
        /// Còn sử dụng, đã mượn sách, đã trả sách
        /// </summary>
        Active = 1,
        /// <summary>
        /// Không sử dụng, chưa mượn sách, chưa trả sách
        /// </summary>
        DeActive = 0
    }
    /// <summary>
    /// Phân quyền tài khoản
    /// </summary>
    public enum ConditionAccount
    {
        /// <summary>
        /// Người dùng
        /// </summary>
        User = 1,
        /// <summary>
        /// Quản trị viên
        /// </summary>
        Admin = 2,
        /// <summary>
        /// Quản lý
        /// </summary>
        Manage = 3
    }
}
