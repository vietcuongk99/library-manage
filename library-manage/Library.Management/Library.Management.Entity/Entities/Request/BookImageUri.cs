using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class BookImageUri
    {
        public string BookID { get; set; }
        public string BookDetailImageUri { get; set; }
    }

    public class BookDetailDownloadInfo
    {
        public string BookID { get; set; }
        public string BookDetailBase64String { get; set; }
    }

    public class ResponseBookDetailDownloadInfo
    {
        public Guid BookID { get; set; }
        public string BookName { get; set; }
        public string BookImageUriBase64String { get; set; }
        public string BookAuthor { get; set; }
    }
    /// <summary>
    /// ModifiedBy: CUONG 06/04/2021
    /// </summary>
    public class ResponseBookBorrowDownloadInfo
    {
        public Guid BookBorrowID { get; set; }
        public Guid BookID { get; set; }
        public string BookName { get; set; }
        public string BookImageUriBase64String { get; set; }
        public string BookAuthor { get; set; }
        public DateTime BorrowDate { get; set; }
        public ulong? BorrowStatus { get; set; }
        public DateTime ReturnDate { get; set; }
        public ulong? BookBorrowStatus { get; set; }
    }
}
