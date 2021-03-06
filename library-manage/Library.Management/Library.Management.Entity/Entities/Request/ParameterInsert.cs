using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ParameterInsertBook
    {
        public Guid BookId { get; set; }
        public string BookCode { get; set; }
        public string BookName { get; set; }
        public Guid BookCategoryId { get; set; }
        public string BookImageUri { get; set; }
        public string BookDownloadUri { get; set; }
        public string BookAuthor { get; set; }
        public int? AmountPage { get; set; }
        public int? YearOfPublication { get; set; }
        public string Description { get; set; }
    }
    public class ParameterInsertBookCategory
    {
        public Guid BookCategoryId { get; set; }
        public string BookCategoryCode { get; set; }
        public string BookCategoryName { get; set; }
    }

    public class ParameterRegisterAccount
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ParameterLoginAccount
    {
        public string UserName { get; set; }
        public string PassWord { get; set; }
    }

    public class ParamChangeUserAdmin
    {
        public Guid UserID { get; set; }
        public int ConditionAccount { get; set; }
    }

    public class ParameterInsertBookBorrow
    {
        public Guid BookId { get; set; }
        public Guid UserId { get; set; }
    }

    public class ParameterCommentBookDetail
    {
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public string Comment { get; set; }
    }
    public class ParameterShowCommentInBookDetail
    {
        public Guid BookID { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }
}
