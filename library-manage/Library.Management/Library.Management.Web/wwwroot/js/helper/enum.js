//enum 
var Enum = {
    //format chuỗi date
    ConvertOption: {
        //năm đứng trước
        YEAR_FIRST: 1,
        //ngày đứng trước
        DAY_FIRST: 2
    },
    //lấy param từ url
    SplitOption: {
        //lấy cả chuỗi
        ALL: 1,
        //lấy một param
        ONE: 2,
    },
    //mượn trả sách
    BookBorrow: {
        //số sách được mượn tối đa
        MAX_BORROW_NUMBER: 6,
        //số ngày gia hạn
        EXTEND_BORROW_DAY: 7,
    },
    //đường dẫn host mặc định
    URL: {
        HOST_URL: "https://localhost:44328/"
    },
    //phân trang cho danh sách book
    BookPaging: {
        //số lượng bản ghi sách hiển thị trên một trang
        RECORD_PER_PAGE: 20,
        //khai báo trang hiển thị mặc định
        PAGE_DEFAULT: 1,
        //khai báo số trang hiển thị mặc định trên thanh pagination
        VISIBLE_PAGE_DEFAULT: 1
    }
}