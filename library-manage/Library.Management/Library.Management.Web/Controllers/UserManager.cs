﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Library.Management.Web.Controllers
{
    public class UserManager : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
