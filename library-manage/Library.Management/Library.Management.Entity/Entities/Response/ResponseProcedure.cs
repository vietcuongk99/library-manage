using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.Entity
{
    public class ResponseProcedureUserComment
    {
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public Guid BookId { get; set; }
        public string Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public ulong? Status { get; set; }
    }
}
