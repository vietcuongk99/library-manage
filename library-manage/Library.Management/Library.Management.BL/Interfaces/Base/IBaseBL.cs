using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IBaseBL<T>
    {

        /// <summary>
        /// Lấy toàn bộ dữ liệu
        /// </summary>
        /// <returns></returns>
        /// CreateBy: VDDUNG(19/03/2021)
        Task<IReadOnlyList<T>> GetEntities();

        /// <summary>
        /// Lấy ra thông tin bản ghi theo khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<T> GetEntityById(string id);

        /// <summary>
        /// Lấy ra thông tin bản ghi theo mã bản ghi
        /// </summary>
        /// <param name="code">mã bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<T> GetEntityByCode(string code);

        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<ActionServiceResult> Insert(object param);

        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="param">Param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<ActionServiceResult> Update(object param);

        /// <summary>
        /// Xóa nhiều bản ghi
        /// </summary>
        /// <param name="listID">List ID bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<int> Delete(object id);

        /// <summary>
        /// Gửi mail sử dụng máy chủ SMTP của Google
        /// </summary>
        /// <param name="_from"></param>
        /// <param name="_to"></param>
        /// <param name="_subject"></param>
        /// <param name="_body"></param>
        /// <param name="_gmailsend"></param>
        /// <param name="_gmailpassword"></param>
        /// <returns></returns>
        Task<bool> SendMailGoogleSmtp(string _from, string _to, string _subject,
                                                           string _body, string _gmailsend, string _gmailpassword);
        /// <summary>
        /// Gửi mail bước 2
        /// </summary>
        /// <param name="_from"></param>
        /// <param name="_to"></param>
        /// <param name="_subject"></param>
        /// <param name="_body"></param>
        /// <param name="client"></param>
        /// <returns></returns>
        Task<bool> SendMail(string _from, string _to, string _subject, string _body, SmtpClient client);
        /// <summary>
        /// Sinh mã OTP
        /// </summary>
        /// <returns></returns>
        int RandomOTPSMTP();
    }
}
