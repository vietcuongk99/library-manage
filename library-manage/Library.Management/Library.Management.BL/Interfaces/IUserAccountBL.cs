using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IUserAccountBL
    {
        /// <summary>
        /// Đổi mật khẩu bước 1, Validate gửi mail nhận OTP cho dự án
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 20/03/2021
        Task<ActionServiceResult> ChangeConfirmPassWordStepOne(ParameterChangeConfirmPassWord param);
        /// <summary>
        /// Đổi mật khẩu bước 2, confirm mã OTP
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 20/03/2021
        Task<ActionServiceResult> ChangeConfirmPassWordStepTwo(ParameterChangeConfirmOTP param);

        /// <summary>
        /// Đăng ký tài khoản
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        Task<ActionServiceResult> RegisterUserAccount(ParameterRegisterAccount param);

        /// <summary>
        /// Cập nhật thông tin cá nhân
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 21/03/2021
        Task<ActionServiceResult> UpdateUserInfo(ParameterUpdateUser param);

        /// <summary>
        /// Đăng nhập
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreateBy: VDDUNG1 21/03/2021
        Task<ActionServiceResult> LoginUserAccount(ParameterLoginAccount param);
        
        Task<ActionServiceResult> ChangeUserAdmin(ParamChangeUserAdmin param);

        /// <summary>
        /// Cập nhật đường dẫn ảnh đại diện
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> SaveImageToUrl(object param);
    }
}
