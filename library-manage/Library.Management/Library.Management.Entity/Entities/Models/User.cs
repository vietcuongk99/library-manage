using System;
using System.Collections.Generic;

namespace Library.Management.Entity.Models
{
    public partial class User
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string AvatarUrl { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string District { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public ulong IsAdmin { get; set; }
        public ulong? Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
    }
}
