﻿using Library.Management.Entity;
using Library.Management.Entity.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IBookDetailBL
    {

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        Task<ActionServiceResult> InsertBookDetail(ParameterInsertBook param);

        /// <summary>
        /// Thêm 1 bản ghi thông tin thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        Task<ActionServiceResult> InsertBookCategory(ParameterInsertBookCategory param);
    }
}