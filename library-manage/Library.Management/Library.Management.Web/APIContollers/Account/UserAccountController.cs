using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Management.Web
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : BaseController<User>
    {
        private new readonly IBaseBL<User> _baseBL;
        private readonly IBaseMemoryCache _memoryCache;
        private readonly IUserAccountBL _userAccountBL;
        public UserAccountController(IBaseBL<User> baseBL, IBaseMemoryCache memoryCache, IUserAccountBL userAccountBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _memoryCache = memoryCache;
            _userAccountBL = userAccountBL;
        }

        [HttpPost("LoginUserAccount")]
        public async Task<ActionServiceResult> LoginUserAccount(ParameterLoginAccount param)
        {
            var res = await _userAccountBL.LoginUserAccount(param);
            if (res.Success)
            {
                HttpContext.Session.SetString("UserName", param.UserName);
            }
            return res;
        }

        /// <summary>
        /// Đổi mật khẩu bước 1, Validate gửi mail nhận OTP cho dự án
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 20/03/2021
        [HttpPost("ChangeConfirmPassWordStepOne")]
        public async Task<ActionServiceResult> ChangeConfirmPassWordStepOne(ParameterChangeConfirmPassWord param)
        {
            var res = await _userAccountBL.ChangeConfirmPassWordStepOne(param);
            if (res.Data != null && (bool)res.Data == false)
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }

        /// <summary>
        /// Đổi mật khẩu bước 2, confirm mã OTP
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 20/03/2021
        [HttpPost("ChangeConfirmPassWordStepTwo")]
        public async Task<ActionServiceResult> ChangeConfirmPassWordStepTwo(ParameterChangeConfirmOTP param)
        {
            var res = await _userAccountBL.ChangeConfirmPassWordStepTwo(param);
            return res;
        }

        [HttpPost("RegisterUserAccount")]
        public async Task<ActionServiceResult> RegisterUserAccount(ParameterRegisterAccount param)
        {
            var res = await _userAccountBL.RegisterUserAccount(param);
            return res;
        }

        [HttpPut("UpdateUserInfo")]
        public async Task<ActionServiceResult> UpdateUserInfo(ParameterUpdateUser param)
        {
            var res = await _userAccountBL.UpdateUserInfo(param);
            return res;
        }
        
        [HttpPost("ChangeUserAdmin")]
        public async Task<ActionServiceResult> ChangeUserAdmin(ParamChangeUserAdmin param)
        {
            var res = await _userAccountBL.ChangeUserAdmin(param);
            return res;
        }
    }
}
