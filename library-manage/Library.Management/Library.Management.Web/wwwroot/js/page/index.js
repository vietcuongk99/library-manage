$(document).ready(function() {
    indexJS = new IndexJS()
})

//class quản lý các sự kiện trong trang index.html
class IndexJS extends BaseJS {
    constructor() {
        super();
        //load dữ liệu Sách Mới
        this.loadNewBookData();
        //load dữ liệu Sách HOT
        this.loadHotBookData();
        this.initEvent();
    }

    //load dữ liệu sách mới nhất
    loadNewBookData() {
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookDetail/GetPagingDataV2" +
                "?pageNumber=" + Enum.BookPaging.PAGE_DEFAULT +
                "&pageSize=4" + "&maxValueType=1&orderByType=1",
            async: true,
            contentType: "application/json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            if (res.success && res.data) {
                var newBooks = res.data.dataItems;
                commonJS.appendBookDataToCard(newBooks, '#newBookRow');
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                //commonBaseJS.showToastMsgFailed("Không tìm thấy sách phù hợp.");
                commonJS.addEmptyListHTML("Chưa có sách", '#newBookRow')
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            //commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
            commonJS.addEmptyListHTML("Không thể hiển thị sách", '#newBookRow')
        })
    }

    //load dữ liệu sách hot nhất
    loadHotBookData() {
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookDetail/GetPagingDataV2" +
                "?pageNumber=" + Enum.BookPaging.PAGE_DEFAULT +
                "&pageSize=4" + "&maxValueType=2&orderByType=1",
            async: true,
            contentType: "application/json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            if (res.success && res.data) {
                var hotBooks = res.data.dataItems;
                commonJS.appendBookDataToCard(hotBooks, '#hotBookRow');
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                //commonBaseJS.showToastMsgFailed("Không tìm thấy sách phù hợp.");
                commonJS.addEmptyListHTML("Chưa có sách", '#hotBookRow')
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            //commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
            commonJS.addEmptyListHTML("Không thể hiển thị sách", '#hotBookRow')
        })
    }

    //gọi hàm xử lý tất cả các sự kiện trong trang index.html
    initEvent() {
        //gán xử lý sự kiện khi click nút Xem thêm Sách HOT
        $('#showHotBookBtn').on('click', this.getAllHotBookEvent.bind(this));
        //gán xử lý sự kiện khi click nút Xem thêm Sách Mới
        $('#showNewBookBtn').on('click', this.getAllNewBookEvent.bind(this));
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#newBookRow').on('click', 'div.card.h-100', this.cardOnClick);
        $('#hotBookRow').on('click', 'div.card.h-100', this.cardOnClick);
        $('#searchBtn').on('click', function() {
            window.open("search.html", "_self")
        });
    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {
        var selectedBookId = $(this).data('bookId');
        // console.log(bookId)
        // console.log(this);
        window.open("book-detail.html?id=" + selectedBookId, "_self");
    }

    //chi tiết xử lý sự kiện khi click nút xem thêm SÁCH HOT
    getAllHotBookEvent() {
        localStorage.setItem("searchURL", "&maxValueType=2&orderByType=1");
        window.open("search.html", "_self")
    }

    //chi tiết xử lý sự kiện khi click nút xem thêm SÁCH HOT
    getAllNewBookEvent() {
        localStorage.setItem("searchURL", "&maxValueType=1&orderByType=1");
        window.open("search.html", "_self")
    }
}