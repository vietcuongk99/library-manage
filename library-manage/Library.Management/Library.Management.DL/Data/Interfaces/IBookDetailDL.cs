using Library.Management.Entity;
using Library.Management.Entity.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public interface IBookDetailDL
    {
        Task<object> GetMonitorActivation(ProcdureTypeName procdureTypeName);
    }
}
