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
                imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryImage + "a5.jpg";
            }
            // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
            if (System.IO.File.Exists(imagePath))
            {
                using (Image img = Image.FromFile(imagePath))
                {
                    if (img != null)
                    {
                        userProfile.UserAvatarBase64String = ImageToBase64(img, ImageFormat.Jpeg);
                    }
                }
            }
            res.Data = userProfile;
            return res;
        }

        /// <summary>
        /// Convert từ Image sang Base64
        /// </summary>
        /// <param name="image"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        private string ImageToBase64(Image image, ImageFormat format)
        {
            string base64String;
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                ms.Position = 0;
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                base64String = Convert.ToBase64String(imageBytes);
            }
            return base64String;
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
                using (Image image = Base64ToImage(userProfile.UserAvatarBase64String))
                {
                    string avatarUrl = GlobalResource.DirectoryImage + userProfile.UserId + ".jpg";
                    string strFileName = Directory.GetCurrentDirectory() + avatarUrl;
                    image.Save(strFileName, ImageFormat.Jpeg);
                    var param = new { UserID = userProfile.UserId, AvatarUrl = avatarUrl };
                    await _userAccountBL.SaveImageToUrl(param);
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
        /// Convert từ Base64 sang Image
        /// </summary>
        /// <param name="base64String"></param>
        /// <returns></returns>
        private Image Base64ToImage(string base64String)
        {
            // Convert Base64 String to byte[]
            byte[] imageBytes = Convert.FromBase64String(base64String);
            Bitmap tempBmp;
            using (MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
            {
                // Convert byte[] to Image
                ms.Write(imageBytes, 0, imageBytes.Length);
                using (Image image = Image.FromStream(ms, true))
                {
                    //Create another object image for dispose old image handler
                    tempBmp = new Bitmap(image.Width, image.Height);
                    Graphics g = Graphics.FromImage(tempBmp);
                    g.DrawImage(image, 0, 0, image.Width, image.Height);
                }
            }
            return tempBmp;
        }

    }
}
