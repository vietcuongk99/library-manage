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
}
