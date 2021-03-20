using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
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
            var userAcountName = await _baseDL.GetEntityByCode(param.Email);
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
            }
            else
            {
                entity.Success = false;
                entity.Message = GlobalResource.ErrorOTPCode;
                entity.LibraryCode = LibraryCode.ErrorOTPCode;
            }
            return entity;
        }
    }
}
