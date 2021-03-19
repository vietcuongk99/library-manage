using Library.Management.Entity.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IBookCategoryBL
    {
        Task<BookCategory> GetBookCategoryByName(string categoryName);
    }
}
