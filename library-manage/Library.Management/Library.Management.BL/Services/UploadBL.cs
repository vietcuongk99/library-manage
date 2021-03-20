using Library.Management.BL.Interfaces;
using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL.Services
{
    public class UploadBL : IUploadBL
    {
        private readonly IBookCategoryBL _bookCategoryBL;
        private readonly IBookCategoryDL _bookCategoryDL;
        private readonly IBookDetailBL _bookDetailBL;
        private readonly IBaseDL<Book> _baseDL;
        public UploadBL(IBaseDL<Book> baseDL, IBookCategoryBL bookCategoryBL, IBookDetailBL bookDetailBL, IBookCategoryDL bookCategoryDL)
        {
            _bookCategoryBL = bookCategoryBL;
            _bookCategoryDL = bookCategoryDL;
            _bookDetailBL = bookDetailBL;
            _baseDL = baseDL;
        }
        public async Task<Dictionary<string, int>> ImportBookDataAsync(IFormFile fileImport)
        {
            string filePath = "";

            Dictionary<string, int> dicResult = new Dictionary<string, int>();

            if (fileImport.Length > 0)
            {
                filePath = Path.GetTempFileName();
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    fileImport.CopyTo(stream);
                }
            }

            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                IWorkbook workbook = WorkbookFactory.Create(fs);
                ISheet sheet = workbook.GetSheetAt(0);

                int successCategory = 0;
                int successBook = 0;

                // đọc sheet này bắt đầu từ row 1 (0 bỏ vì tiêu đề)
                for (int rowIndex = 1; rowIndex <= sheet.LastRowNum; rowIndex++)
                {
                    // lấy row hiện tại
                    var nowRow = sheet.GetRow(rowIndex);

                    if (nowRow.GetCell(1).StringCellValue != null && nowRow.GetCell(1).StringCellValue != "")
                    {
                        var categoryName = nowRow.GetCell(3).StringCellValue;
                        var newGuid = Guid.NewGuid();
                        var bookDetail = new ParameterInsertBook();

                        bookDetail.BookId = Guid.NewGuid(); 
                        bookDetail.BookCode = nowRow.GetCell(1).StringCellValue;
                        bookDetail.BookName = nowRow.GetCell(2).StringCellValue;
                        //bookDetail.BookCategoryId = nowRow.GetCell(1).StringCellValue;
                        bookDetail.BookImageUri = nowRow.GetCell(9).StringCellValue;
                        bookDetail.BookDownloadUri = nowRow.GetCell(8).StringCellValue;
                        bookDetail.BookAuthor = nowRow.GetCell(4).StringCellValue;
                        bookDetail.AmountPage = Int32.Parse(nowRow.GetCell(5).NumericCellValue.ToString());
                        bookDetail.YearOfPublication = Int32.Parse(nowRow.GetCell(6).NumericCellValue.ToString());
                        bookDetail.Description = nowRow.GetCell(7).StringCellValue;

                        var bookCategory = _bookCategoryDL.GetBookCategoryByName(categoryName).Result;

                        if (bookCategory == null)
                        {
                            bookDetail.BookCategoryId = newGuid;

                            var newCategory = new ParameterInsertBookCategory();

                            newCategory.BookCategoryId = newGuid;
                            newCategory.BookCategoryCode = RemoveUnicode(categoryName);
                            newCategory.BookCategoryName = categoryName;

                            var insertCategory = _bookCategoryBL.InsertBookCategory(newCategory);
                            if (insertCategory.Result.Success)
                            {
                                successCategory++;

                                var insertBook = _bookDetailBL.InsertBookDetail(bookDetail);

                                if (insertBook.Result.Success)
                                {
                                    successBook++;
                                }
                            }
                        }
                        else
                        {
                            bookDetail.BookCategoryId = bookCategory.BookCategoryId;

                            var insertBook = _bookDetailBL.InsertBookDetail(bookDetail);

                            if (insertBook.Result.Success)
                            {
                                successBook++;
                            }
                        }
                    }
                }

                dicResult.Add("InsertBookSuccess", successBook);
                dicResult.Add("InsertCategorySuccess", successCategory);
                dicResult.Add("TotalRecord", sheet.LastRowNum);
            }

            System.IO.File.Delete(filePath);
            return dicResult;
        }

        /// <summary>
        /// Tạo Mã code cho thể loại sách
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string RemoveUnicode(string text)
        {
            text = text.ToLower();
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
                "đ",
                "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
                "í","ì","ỉ","ĩ","ị",
                "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
                "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
                "ý","ỳ","ỷ","ỹ","ỵ", " "};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
                "d",
                "e","e","e","e","e","e","e","e","e","e","e",
                "i","i","i","i","i",
                "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
                "u","u","u","u","u","u","u","u","u","u","u",
                "y","y","y","y","y", ""};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
            }
            return text.ToUpper();
        }
    }
}
