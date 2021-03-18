using Library.Management.BL;
using Library.Management.Entity.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Management.Web
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookCategoryController : BaseController<BookCategory>
    {
        private new readonly IBaseBL<BookCategory> _baseBL;
        private readonly IBookCategoryBL _bookCategoryBL;
        public BookCategoryController(IBaseBL<BookCategory> baseBL, IBookCategoryBL bookCategoryBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _bookCategoryBL = bookCategoryBL;
        }
    }
}
