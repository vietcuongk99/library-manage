using System;
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
    }
    public class ParamFilterBookBorrow
    {
        public Guid userId { get; set; }
    }
    /// <summary>
    /// ModifiedBy: Cuong 07/04/2021
    /// </summary>
    public class ParamFilterBookDetailV2
    {
        //public string paramName { get; set; }
        public string searchValue { get; set; }
        public int searchType { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string paramBookCategoryID { get; set; }
        public int? startYear { get; set; }
        public int? finishYear { get; set; }
        public int maxValueType { get; set; }
        public int orderByType { get; set; }

    }
}
