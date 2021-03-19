﻿using Dapper;
using Library.Management.DL.DbContext;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public class BookCategoryDL : IBookCategoryDL
    {
        private readonly IConfiguration _config;
        public BookCategoryDL(IConfiguration config)
        {
            _config = config;
        }
    }
}
