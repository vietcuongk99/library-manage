using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public interface IBookBorrowDL
    {
        public Task<IReadOnlyList<Y>> GetListRequestActivation<Y>();
    }
}
