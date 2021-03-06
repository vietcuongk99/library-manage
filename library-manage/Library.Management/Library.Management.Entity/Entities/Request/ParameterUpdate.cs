using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ParameterUpdateBook
    {
        public Guid BookId { get; set; }
        public string BookCode { get; set; }
        public string BookName { get; set; }
        public Guid? BookCategoryId { get; set; }
        public string BookImageUri { get; set; }
        public string BookDownloadUri { get; set; }
        public int? BorrowTotal { get; set; }
        public ulong? Status { get; set; }
        public string BookAuthor { get; set; }
        public int? AmountPage { get; set; }
        public int? YearOfPublication { get; set; }
        public string Description { get; set; }
    }
    public class ParameterUpdateBookCategory
    {
        public Guid BookCategoryId { get; set; }
        public string BookCategoryCode { get; set; }
        public string BookCategoryName { get; set; }
        public int? Amount { get; set; }
        public ulong? Status { get; set; }
    }

    public class ParameterChangeConfirmPassWord
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class ParameterChangeConfirmOTP
    {
        public string Email { get; set; }
        public string PassWord { get; set; }
        public int OTP { get; set; }
        public DateTime ExpiryTime { get; set; }
    }

    public class ParameterUpdateUser
    {
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Ward { get; set; }
        public string District { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }

    public class ParameterUpdateBookBorrow
    {
        public Guid BookBorrowId { get; set; }
    }
    
    public class ParameterExtendBookBorrow
    {
        public Guid BookBorrowId { get; set; }
        public DateTime ReturnDate { get; set; }
    }
    public class ParameterModifyComment
    {
        public Guid CommentId { get; set; }
        public string Comment { get; set; }
    }
    public class ParameterUpdateUserPassWord
    {
        public Guid UserId { get; set; }
        public string PassWordOld { get; set; }
        public string PassWordNew { get; set; }
    }
}
