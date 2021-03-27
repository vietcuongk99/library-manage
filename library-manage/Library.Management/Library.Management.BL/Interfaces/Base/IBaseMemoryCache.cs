using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.BL
{ 
    public interface IBaseMemoryCache
    {
        /// <summary>
        /// Lấy cache theo key
        /// </summary>
        /// <param name="key">Khóa cache</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG(14/11/2020)
        public object CacheGet(string key);

        /// <summary>
        /// Lưu cache
        /// </summary>
        /// <param name="key">Khóa cache</param>
        /// <param name="data">Dữ liệu muốn cache</param>
        /// CreatedBy: VDDUNG(14/11/2020)
        public void SetCache(string key, object data);

        /// <summary>
        /// Xóa cache khỏi memory
        /// </summary>
        /// <param name="key"></param>
        /// CreatedBy: VDDUNG1 27/03/2021
        public void RemoveCache(string key);
    }
}
