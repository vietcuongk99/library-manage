using System;
using System.Collections.Generic;

namespace Library.Management.BL.Models
{
    public partial class BookCategory
    {
        public BookCategory()
        {
            Book = new HashSet<Book>();
        }

        public Guid BookCategoryId { get; set; }
        public string BookCategoryName { get; set; }
        public int? Amount { get; set; }
        public ulong Status { get; set; }

        public virtual ICollection<Book> Book { get; set; }
    }
}
