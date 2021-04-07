$(document).ready(function() {
    indexJS = new IndexJS()
})

//class quản lý các sự kiện trong trang index.html
class IndexJS extends BaseJS {
    constructor() {
        super();
        this.loadBookData();
        this.initEvent();
    }

    //load dữ liệu
    loadBookData() {

        //load dữ liệu Sách Mới
        //commonJS.appendBookDataToCard(fakeData, "#newBookRow")

        //load dữ liệu Sách HOT
        //commonJS.appendBookDataToCard(fakeData, "#hotBookRow")
    }

    //gọi hàm xử lý tất cả các sự kiện trong trang index.html
    initEvent() {

        //gán xử lý sự kiện khi click nút Tìm kiếm
        //$('#searchBtn').on('click', this.searchEvent.bind(this));
        //gán xử lý sự kiện khi click nút Xem thêm Sách HOT
        //$('#showHotBookBtn').on('click', this.getAllHotBookEvent.bind(this));
        //gán xử lý sự kiện khi click nút Xem thêm Sách Mới
        // $('#showNewBookBtn').on('click', this.getAllNewBookEvent.bind(this));
        //gán xử lý sự kiện khi click vào 1 card sách
        //$('#newBookRow').children('div').on('click', 'div.card.h-100', this.cardOnClick)
        //$('#hotBookRow').children('div').on('click', 'div.card.h-100', this.cardOnClick)

    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {
        let bookId = $(this).data('bookId')
        console.log(bookId)
        console.log(this)
        window.open("book-detail.html", "_self")
    }

    //chi tiết xử lý sự kiện khi click nút xem thêm SÁCH HOT
    getAllHotBookEvent() {
        localStorage.setItem("showHotBook", true)
        window.open("search-result.html", "_self")
    }

    //chi tiết xử lý sự kiện khi click nút xem thêm SÁCH HOT
    getAllNewBookEvent() {
        localStorage.setItem("showNewBook", true)
        window.open("search-result.html", "_self")
    }
}