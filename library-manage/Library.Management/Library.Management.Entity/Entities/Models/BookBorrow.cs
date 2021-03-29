using System;
using System.Collections.Generic;

namespace Library.Management.Entity.Models
{
    public partial class BookBorrow
    {
        public Guid BookBorrowId { get; set; }
        public Guid BookId { get; set; }
        public Guid UserId { get; set; }
        public DateTime ReturnDate { get; set; }
        public DateTime BorrowDate { get; set; }
        public ulong? BorrowStatus { get; set; }
        public ulong? ReturnStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public ulong? Status { get; set; }
    }
}
