using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.BL
{
    public class BaseMemoryCache : IBaseMemoryCache
    {
        protected readonly IMemoryCache _memoryCache;
        public BaseMemoryCache(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }
            /// <summary>
            /// Lấy cache dữ liệu Theo key
            /// </summary>
            /// CreatedBy:VDDUNG(14/11/2020)
            public object CacheGet(string key)
        {
            var cacheEntry = _memoryCache.Get<object>(key);
            return cacheEntry;
        }

        /// <summary>
        ///  Thực hiện cache dữ liệu
        /// </summary>
        /// <param name="key">Key</param>
        /// <param name="data">Dữ liệu cache</param>
        /// CreatedBy: VDDUNG(14/11/2020)
        public void SetCache(string key, object data)
        {
            _memoryCache.GetOrCreate(key, entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromMinutes(5);
                return data;
            });
        }
        /// <summary>
        /// Xóa key cache
        /// </summary>
        /// <param name="key"></param>
        /// CreatedBy: VDDUNG1 27/03/2021
        public void RemoveCache(string key)
        {
            _memoryCache.Remove(key);
        }
    }
}
