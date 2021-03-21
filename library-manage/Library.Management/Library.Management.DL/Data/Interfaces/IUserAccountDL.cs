using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public interface IUserAccountDL
    {
        Task<object> ChangeUserAdmin(Guid userID, bool isAdmin);
    }
}
