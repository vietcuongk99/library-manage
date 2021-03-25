using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public class UserAccountBL : IUserAccountBL
    {
        private readonly IUserAccountDL _userAccountDL;
        private readonly IBaseBL<User> _baseBL;
        private readonly IBaseDL<User> _baseDL;
        private readonly IBaseMemoryCache _baseMemoryCache;
        public UserAccountBL(IBaseBL<User> baseBL, IBaseDL<User> baseDL, IUserAccountDL userAccountDL, IBaseMemoryCache baseMemoryCache)
        {
            _baseBL = baseBL;
            _baseDL = baseDL;
            _userAccountDL = userAccountDL;
            _baseMemoryCache = baseMemoryCache;
        }

        /// <summary>
        /// Đổi mật khẩu bước 1, Validate gửi mail nhận OTP cho dự án
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 20/03/2021
        public async Task<ActionServiceResult> ChangeConfirmPassWordStepOne(ParameterChangeConfirmPassWord param)
        {
            var entity = new ActionServiceResult();
            //Validate kiểm tra xem tài khoản người dùng có tồn tại hay không
            var userAcountName = await _baseDL.GetEntityByProperty(new { param.Email }, ProcdureTypeName.GetByEmail);
            if (userAcountName == null)
            {
                entity.Success = false;
                entity.LibraryCode = LibraryCode.ErrorUserAccount;
                entity.Message = GlobalResource.ErrorUserAccount;
            }
            else
            {
                //Tiến hành gửi mã OTP về tài khoản người dùng
                var OTPNew = _baseBL.RandomOTPSMTP();
                var subjectMailBody = string.Format(GlobalResource.SubjectSendMail, userAcountName.UserName, OTPNew, "Đổi mật khẩu", param.Password);
                entity.Data = await _baseBL.SendMailGoogleSmtp(GlobalResource.MailSendAccount, param.Email, "[Library] Mã lấy lại mật khẩu tài khoản hệ thống",
                    subjectMailBody, GlobalResource.MailSendAccount, GlobalResource.MailSendPassWord);
                
                //Set Cache mã OTP trước khi chuyển sang bước 2
                if(entity.Data != null && (bool)entity.Data == true)
                {
                    _baseMemoryCache.SetCache(param.Email, new { 
                        Email = param.Email,
                        PassWord = param.Password,
                        OTP = OTPNew
                    });
                }
            }
            return entity;
        }

        /// <summary>
        /// Đổi mật khẩu bước 2, confirm mã OTP
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 20/03/2021
        public async Task<ActionServiceResult> ChangeConfirmPassWordStepTwo(ParameterChangeConfirmOTP param)
        {
            var entity = new ActionServiceResult();
            if (_baseMemoryCache.CacheGet(param.Email) != null)
            {
                //Đọc dữ liệu bản ghi từ Cache
                var output = JsonConvert.SerializeObject(_baseMemoryCache.CacheGet(param.Email));
                var cachevalueOTP = JsonConvert.DeserializeObject<ParameterChangeConfirmOTP>(output);
                //Check mã OTP, nếu mã chính xác thì cho phép đổi mật khẩu
                if (param.OTP == cachevalueOTP.OTP)
                {
                    var paramConfirmPassWord = new ParameterChangeConfirmPassWord();
                    paramConfirmPassWord.Email = param.Email;
                    paramConfirmPassWord.Password = param.PassWord;
                    entity.Data = await _baseDL.UpdateAsync(paramConfirmPassWord, ProcdureTypeName.UpdateAccount);
                }
                //Báo lỗi OTP
                else
                {
                    entity.Success = false;
                    entity.Message = GlobalResource.ErrorOTPCode;
                    entity.LibraryCode = LibraryCode.ErrorOTPCode;
                }
            }
            //Báo lỗi đổi mật khẩu
            else
            {
                entity.Success = false;
                entity.Message = GlobalResource.ErrorConfirmOTPPassWord;
                entity.LibraryCode = LibraryCode.ErrorConfirmOTPPassWord;
            }
            return entity;
        }

        /// <summary>
        /// Đăng ký tài khoản
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        public async Task<ActionServiceResult> RegisterUserAccount(ParameterRegisterAccount param)
        {
            var entity = new ActionServiceResult();
            var checkAccount = await _baseDL.GetEntityByProperty(new { param.UserName, param.Email}, ProcdureTypeName.GetByUserName);
            //check xem tên tài khoản hoặc mail đã được sử dụng hay chưa
            if (checkAccount != null)
            {
                entity.Success = false;
                entity.Message = GlobalResource.IsExistUserAccount;
                entity.LibraryCode = LibraryCode.IsExistUserAccount;
            }
            else
            {
                var userAcount = new User();
                InsertRequestBeforeUpdateDB(param, userAcount);
                entity.Data = await _baseDL.AddAsync(userAcount, ProcdureTypeName.Insert);
            }
            return entity;
        }

        /// <summary>
        /// Chuyển thông tin từ Param sang Entity User để cập nhật lên DB
        /// </summary>
        /// <param name="param"></param>
        /// <param name="userAcount"></param>
        /// CreatedBy: VDDUNG1 21/03/2021
        private void InsertRequestBeforeUpdateDB(ParameterRegisterAccount param, User userAcount)
        {
            userAcount.UserId = Guid.NewGuid();
            userAcount.UserName = param.UserName;
            userAcount.Email = param.Email;
            userAcount.Password = param.Password;
            userAcount.IsAdmin = 0; //0 - user, 1 - admin
            userAcount.Status = (int)Status.Active;
        }

        /// <summary>
        /// Cập nhật thông tin cá nhân
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        public async Task<ActionServiceResult> UpdateUserInfo(ParameterUpdateUser param)
        {
            var entity = new ActionServiceResult();
            param.ModifiedDate = DateTime.Now;
            if (param.UserId != null)
            {
                var checkUserAccount = await _baseDL.GetEntityById(param.UserId.ToString());
                var checkUserAccountByEmail = await _baseDL.GetEntityByProperty(new { param.Email }, ProcdureTypeName.GetByEmail);
                if(checkUserAccount == null)
                {
                    entity.Success = false;
                    entity.Message = GlobalResource.ErrorUserAccount;
                    entity.LibraryCode = LibraryCode.ErrorUserAccount;
                    return entity;
                }
                else
                {
                    if (checkUserAccountByEmail != null && checkUserAccountByEmail.UserId != param.UserId)
                    {
                        entity.Success = false;
                        entity.Message = GlobalResource.IsUsedEmail;
                        entity.LibraryCode = LibraryCode.IsUsedEmail;
                        return entity;
                    }
                    else
                    {
                        entity.Data = await _baseDL.UpdateAsync(param, ProcdureTypeName.Update);
                    }
                }
                
            }
            return entity;
        }

        /// <summary>
        /// Đổi mật khẩu
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        public async Task<ActionServiceResult> UpdateUserPassWord(ParameterUpdateUserPassWord param)
        {
            var res = new ActionServiceResult();
            if (param.UserId != null)
            {
                var userAccount = await _baseDL.GetEntityById(param.UserId.ToString());
                if(userAccount.Password != param.PassWordOld)
                {
                    res.Success = false;
                    res.Message = GlobalResource.ErrorUserPassWord;
                    res.LibraryCode = LibraryCode.ErrorUserPassWord;
                }
                else
                {
                    var pWParam = new
                    {
                        UserId = param.UserId,
                        PassWordNew = param.PassWordNew
                    };
                    await _baseDL.UpdateAsync(pWParam, ProcdureTypeName.UpdateUserPassWord);
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
        /// Đăng nhập
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        public async Task<ActionServiceResult> LoginUserAccount(ParameterLoginAccount param)
        {
            var res = new ActionServiceResult();
            var userAccount = await _baseDL.GetEntityByProperty(param, ProcdureTypeName.GetByUserAndPassWord);
            if(userAccount == null)
            {
                res.Success = false;
                res.Message = GlobalResource.ErrorUserAccountValidate;
                res.LibraryCode = LibraryCode.ErrorUserAccountValidate;
                res.Data = false;
            }
            else
            {
                res.Data = new
                {
                    UserID = userAccount.UserId,
                    UserName = userAccount.UserName,
                    AvatarUrl = userAccount.AvatarUrl,
                    IsAdmin = userAccount.IsAdmin
                };
            }
            return res;
        }

        /// <summary>
        /// Cập nhật đường dẫn ảnh đại diện
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 22/03/2021
        public async Task<ActionServiceResult> SaveImageToUrl(object param)
        {
            var res = new ActionServiceResult();
            res.Data = await _baseDL.UpdateAsync(param, ProcdureTypeName.UpdateAvatarUrl);
            return res;
        }

        public async Task<ActionServiceResult> ChangeUserAdmin(ParamChangeUserAdmin param)
        {
            var entity = new ActionServiceResult();
            entity.Data = await _userAccountDL.ChangeUserAdmin(param.UserID, param.IsAdmin);
            return entity;
        }
    }
}
