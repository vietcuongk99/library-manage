using System;
using System.Collections.Generic;

namespace Library.Management.Entity.Models
{
    public partial class BookCategory
    {
        public Guid BookCategoryId { get; set; }
        public string BookCategoryCode { get; set; }
        public string BookCategoryName { get; set; }
        public int? Amount { get; set; }
        public ulong Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

    }
}
