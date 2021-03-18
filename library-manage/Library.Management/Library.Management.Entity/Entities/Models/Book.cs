using System;
using System.Collections.Generic;

namespace Library.Management.Entity.Models
{
    public partial class Book
    {
        public Guid BookId { get; set; }
        public string BookCode { get; set; }
        public string BookName { get; set; }
        public Guid BookCategoryId { get; set; }
        public string BookImageUri { get; set; }
        public string BookDownloadUri { get; set; }
        public int? BorrowTotal { get; set; }
        public ulong? Status { get; set; }
        public string BookAuthor { get; set; }
        public int? AmountPage { get; set; }
        public int? YearOfPublication { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
