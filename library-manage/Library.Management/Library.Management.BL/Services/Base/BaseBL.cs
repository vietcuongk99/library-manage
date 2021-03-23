using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Properties;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public class BaseBL<T> : IBaseBL<T>
    {
        protected readonly IBaseDL<T> _baseDL;
        public BaseBL(IBaseDL<T> baseDL)
        {
            _baseDL = baseDL;
        }

        /// <summary>
        /// Lấy toàn bộ dữ liệu
        /// </summary>
        /// <returns></returns>
        /// CreateBy: VDDUNG(19/03/2021)
        public async virtual Task<IReadOnlyList<T>> GetEntities()
        {
            var entities = await _baseDL.GetListAsync();
            return entities;
        }


        /// <summary>
        /// Lấy ra thông tin bản ghi theo khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<T> GetEntityById(string id)
        {
            return await _baseDL.GetEntityById(id);
        }

        /// <summary>
        /// Lấy ra thông tin bản ghi theo mã bản ghi
        /// </summary>
        /// <param name="code">mã bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<T> GetEntityByCode(string code)
        {
            return await _baseDL.GetEntityByCode(code, ProcdureTypeName.GetByCode);
        }

        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<ActionServiceResult> Insert(object param)
        {
                return new ActionServiceResult
                {
                    Success = true,
                    LibraryCode = LibraryCode.Success,
                    Message = GlobalResource.Success,
                    Data = await _baseDL.AddAsync(param, ProcdureTypeName.Insert)
                };
        }
        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="param">Param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<ActionServiceResult> Update(object param)
        {
            return new ActionServiceResult
            {
                Success = true,
                LibraryCode = LibraryCode.Success,
                Message = GlobalResource.Success,
                Data = await _baseDL.UpdateAsync(param, ProcdureTypeName.Update)
            };
        }

        /// <summary>
        /// Xóa nhiều bản ghi
        /// </summary>
        /// <param name="listID">List ID bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        public async virtual Task<int> Delete(object id)
        {
            return await _baseDL.Delete(id);
        }

        /// <summary>
        /// Gửi email sử dụng máy chủ SMTP Google (smtp.gmail.com)
        /// </summary>
        public async Task<bool> SendMailGoogleSmtp(string _from, string _to, string _subject,
                                                            string _body, string _gmailsend, string _gmailpassword)
        {
            // Tạo SmtpClient kết nối đến smtp.gmail.com
            using (SmtpClient client = new SmtpClient("smtp.gmail.com"))
            {
                client.Port = 587;
                client.Credentials = new NetworkCredential(_gmailsend, _gmailpassword);
                client.EnableSsl = true;
                return await SendMail(_from, _to, _subject, _body, client);
            }

        }

        /// <summary>
        /// Gửi mail thông qua gmail
        /// </summary>
        /// <param name="_from"></param>
        /// <param name="_to"></param>
        /// <param name="_subject"></param>
        /// <param name="_body"></param>
        /// <param name="client"></param>
        /// <returns></returns>
        public async Task<bool> SendMail(string _from, string _to, string _subject, string _body, SmtpClient client)
        {
            // Tạo nội dung Email
            MailMessage message = new MailMessage(
                from: _from,
                to: _to,
                subject: _subject,
                body: _body
            );
            message.BodyEncoding = System.Text.Encoding.UTF8;
            message.SubjectEncoding = System.Text.Encoding.UTF8;
            message.IsBodyHtml = true;
            message.ReplyToList.Add(new MailAddress(_from));
            message.Sender = new MailAddress(_from);


            try
            {
                await client.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        /// <summary>
        /// Hàm sinh mã OTP
        /// </summary>
        /// <returns></returns>
        public int RandomOTPSMTP()
        {
            Random r = new Random();
            int num =  r.Next(100000, 999999);
            return num;
        }

        /// <summary>
        /// Convert từ Image sang Base64
        /// </summary>
        /// <param name="image"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public string ImageToBase64(Image image, ImageFormat format)
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
        /// Convert từ Base64 sang Image
        /// </summary>
        /// <param name="base64String"></param>
        /// <returns></returns>
        public Image Base64ToImage(string base64String)
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
