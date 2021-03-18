using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ParameterInsertBook
    {
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
        /// <summary>
        ///Khóa chính
        /// </summary>
        public Guid BookCategoryId { get; set; }
        /// <summary>
        /// Mã thể loại sách
        /// </summary>
        public string BookCategoryCode { get; set; }
        /// <summary>
        /// Tên loại sách
        /// </summary>
        public string BookCategoryName { get; set; }
        /// <summary>
        /// Số lượng sách
        /// </summary>
        public int? Amount { get; set; }
        /// <summary>
        /// Trạng thái hoạt động 1 - On, 0 - Off
        /// </summary>
        public ulong Status { get; set; }
    }
}
