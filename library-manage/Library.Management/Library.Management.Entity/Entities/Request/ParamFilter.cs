﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ParamFilterBookDetail
    {
        public string paramBookName { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string paramBookCategoryID { get; set; }
    }
    public class ParamFilterUserAccount
    {
        public string paramUserName { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public int paramConditionAccount { get; set; }
    }
    public class ParamFilterBookBorrow
    {
        public Guid userId { get; set; }
    }
}
