using Library.Management.Entity;
using Library.Management.Entity.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public interface IBookCategoryDL
    {
        Task<BookCategory> GetBookCategoryByName(string categoryName);
        Task<IReadOnlyList<ResponseProcedureChartInfo>> GetChartInfo();
    }
}
