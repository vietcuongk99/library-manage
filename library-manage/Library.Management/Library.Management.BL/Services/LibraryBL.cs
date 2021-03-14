using Library.Management.BL.Entities.Response;
using Library.Management.BL.Interfaces;
using Library.Management.BL.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL.Services
{
    public class LibraryBL : ILibraryBL
    {
        private readonly ILibraryDL _libraryDL;
        public LibraryBL(ILibraryDL libraryDL)
        {
            _libraryDL = libraryDL;
        }
        public async Task<Book> GetEntitiesByID(string id)
        {
            return await _libraryDL.GetEntitiesByID(id);
        }
    }
}
