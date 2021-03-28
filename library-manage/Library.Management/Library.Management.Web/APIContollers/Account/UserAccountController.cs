using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
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

        /// <summary>
        /// Đăng nhập
        /// </summary>
        /// <param name="param"></param>h
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
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
        /// Quên mật khẩu bước 1, Validate gửi mail nhận OTP cho dự án
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
        /// Quên mật khẩu bước 2, confirm mã OTP
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

        /// <summary>
        /// Đăng ký tài khoản
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        [HttpPost("RegisterUserAccount")]
        public async Task<ActionServiceResult> RegisterUserAccount(ParameterRegisterAccount param)
        {
            var res = await _userAccountBL.RegisterUserAccount(param);
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin cá nhân
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        [HttpPut("UpdateUserInfo")]
        public async Task<ActionServiceResult> UpdateUserInfo(ParameterUpdateUser param)
        {
            var res = await _userAccountBL.UpdateUserInfo(param);
            return res;
        }

        /// <summary>
        /// Thay đổi mật khẩu
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// VDDUNG1 25/03/2021
        [HttpPut("UpdateUserPassWord")]
        public async Task<ActionServiceResult> UpdateUserPassWord(ParameterUpdateUserPassWord param)
        {
            var res = await _userAccountBL.UpdateUserPassWord(param);
            return res;
        }


        /// <summary>
        /// Lấy ra ảnh từ đường dẫn
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 22/03/2021
        [HttpGet("GetImageFromUrl")]
        public ActionServiceResult GetImageFromUrl(string userId, string avatarUrl)
        {
            var res = new ActionServiceResult();
            var userProfile = new UserProfile();
            userProfile.UserId = userId;
            string imagePath;
            if (avatarUrl != null)
            {
                imagePath = Directory.GetCurrentDirectory() + avatarUrl;
            }
            else
            {
                imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryImage + GlobalResource.AvatarUserDefault;
            }
            // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
            if (System.IO.File.Exists(imagePath))
            {
                using (Image img = Image.FromFile(imagePath))
                {
                    if (img != null)
                    {
                        userProfile.UserAvatarBase64String = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                    }
                }
            }
            res.Data = userProfile;
            return res;
        }

        /// <summary>
        /// Save image to Folder's Avatar
        /// </summary>
        /// <param name="userProfile"></param>
        /// CreatedBy: VDDUNG1 22/03/2021
        [HttpPost("SaveImageToUrl")]
        public async Task<ActionServiceResult> SaveImageToUrl(UserProfile userProfile)
        {
            var res = new ActionServiceResult();
            //For demo purpose I only use jpg file and save file name by userId
            if (!string.IsNullOrEmpty(userProfile.UserAvatarBase64String))
            {
                using (Image image = _baseBL.Base64ToImage(userProfile.UserAvatarBase64String))
                {
                    string avatarUrl = GlobalResource.DirectoryImage + userProfile.UserId + ".jpg";
                    string strFileName = Directory.GetCurrentDirectory() + avatarUrl;
                    image.Save(strFileName, ImageFormat.Jpeg);
                    if (System.IO.File.Exists(strFileName))
                    {
                        var param = new { UserID = userProfile.UserId, AvatarUrl = avatarUrl };
                        await _userAccountBL.SaveImageToUrl(param);
                        res.Data = avatarUrl;
                    }
                    else
                    {
                        res.Success = false;
                        res.Message = GlobalResource.Failed;
                        res.LibraryCode = LibraryCode.Failed;
                    }
                }
            }
            else
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }
        
        /// <summary>
        /// Xét phần quyền cho tài khoản
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost("ChangeUserAdmin")]
        public async Task<ActionServiceResult> ChangeUserAdmin(ParamChangeUserAdmin param)
        {
            var res = await _userAccountBL.ChangeUserAdmin(param);
            return res;
        }
    }
}
