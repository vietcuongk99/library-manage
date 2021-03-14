using System;
using System.Collections.Generic;

namespace Library.Management.BL.Models
{
    public partial class UserComment
    {
        public string CommentId { get; set; }
        public string UserId { get; set; }
        public string Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public ulong? Status { get; set; }
    }
}
