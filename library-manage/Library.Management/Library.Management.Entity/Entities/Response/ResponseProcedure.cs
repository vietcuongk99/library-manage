using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ResponseProcedureUserComment
    {
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
        public Guid BookId { get; set; }
        public string Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class ResponseProcedureBookDetail
    {
        public Guid BookID { get; set; }
        public string BookName { get; set; }
        public string BookImageUri { get; set; }
        public string BookAuthor { get; set; }
    }

    /// <summary>
    /// ModifiedBy: CUONG 06/04/2021
    /// </summary>
    public class ResponseProcedureBookBorrow
    {
        public Guid BookBorrowID { get; set; }
        public Guid BookID { get; set; }
        public string BookName { get; set; }
        public string BookImageUri { get; set; }
        public string BookAuthor { get; set; }
        public DateTime BorrowDate { get; set; }
        public ulong? BorrowStatus { get; set; }
        public DateTime ReturnDate { get; set; }
        public ulong? BookBorrowStatus { get; set; }
    }

    public partial class ResponseProcedureUser
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Ward { get; set; }
        public string District { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public int ConditionAccount { get; set; }
        public ulong? Status { get; set; }
    }
    public class ResponseProcedureTotalBook
    {
        /// <summary>
        /// Tổng số sách
        /// </summary>
        public int TotalBook { get; set; }
        /// <summary>
        /// Tổng số sách được mượn
        /// </summary>
        public int TotalBookBorrow { get; set; }
    }
    public class ResponseProcedureTotalBookBorrow
    {
        /// <summary>
        /// Tổng số lượt mượn sách
        /// </summary>
        public int TotalBorrowActivated { get; set; }
        /// <summary>
        /// Tổng số lượt đang mượn
        /// </summary>
        public int TotalBookBorrowActive { get; set; }
    }
    public class ReponseProcedureListRequestBorrowActivation
    {
        public Guid BookBorrowID { get; set; }
        public Guid BookID { get; set; }
        public Guid UserID { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string BookName { get; set; }
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
