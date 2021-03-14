using Library.Management.BL.Entities.Response;
using Library.Management.BL.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL.Interfaces
{
    public interface ILibraryBL
    {
        Task<Book> GetEntitiesByID(string id);
    }
}
