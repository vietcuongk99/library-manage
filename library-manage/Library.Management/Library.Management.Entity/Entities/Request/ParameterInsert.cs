using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ParameterInsertBook
    {
        /// <summary>
        /// Khóa chính
        /// </summary>
        public Guid BookId { get; set; }
        /// <summary>
        /// Mã sách
        /// </summary>
        public string BookCode { get; set; }
        /// <summary>
        /// Tên sách
        /// </summary>
        public string BookName { get; set; }
        /// <summary>
        /// Mã thể loại sách
        /// </summary>
        public Guid BookCategoryId { get; set; }
        /// <summary>
        /// Số lượng
        /// </summary>
        public int Amount { get; set; }
        /// <summary>
        /// Số sách đã mượn
        /// </summary>
        public int? ActivedBook { get; set; }
        /// <summary>
        /// Trạng thái 1 - còn sử dụng; 0 - không sử dụng
        /// </summary>
        public ulong? Status { get; set; }
        /// <summary>
        /// Tác giả
        /// </summary>
        public string BookAuthor { get; set; }
        /// <summary>
        /// Tổng số trang
        /// </summary>
        public int? AmountPage { get; set; }
        /// <summary>
        /// Năm xuất bản
        /// </summary>
        public int? YearOfPublication { get; set; }
        /// <summary>
        /// Mô tả chi tiết
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        /// Ngày tạo thông tin
        /// </summary>
        public DateTime CreatedDate { get; set; }
        /// <summary>
        /// Người tạo
        /// </summary>
        public string CreatedBy { get; set; }
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
