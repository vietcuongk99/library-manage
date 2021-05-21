$(document).ready(function() {
    indexJS = new IndexJS()
})

//class quản lý các sự kiện trong trang index.html
class IndexJS extends BaseJS {
    constructor() {
        super();
        this.loadCategoryList();
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
                "&pageSize=1" + "&maxValueType=1&orderByType=1",
            async: true,
            contentType: "application/json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            if (res.success && res.data) {
                var newBooks = res.data.dataItems;
                commonJS.appendBookDataToCardV2(newBooks, '#newBookContent');
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                //commonBaseJS.showToastMsgFailed("Không tìm thấy sách phù hợp.");
                commonJS.addEmptyListHTML("Chưa có sách", '#newBookContent')
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            //commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
            commonJS.addEmptyListHTML("Không thể hiển thị sách", '#newBookContent')
        })
    }

    //load dữ liệu sách hot nhất
    loadHotBookData() {
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookDetail/GetPagingDataV2" +
                "?pageNumber=" + Enum.BookPaging.PAGE_DEFAULT +
                "&pageSize=1" + "&maxValueType=2&orderByType=1",
            async: true,
            contentType: "application/json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            if (res.success && res.data) {
                var hotBooks = res.data.dataItems;
                commonJS.appendBookDataToCardV2(hotBooks, '#hotBookContent');
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                //commonBaseJS.showToastMsgFailed("Không tìm thấy sách phù hợp.");
                commonJS.addEmptyListHTML("Chưa có sách", '#hotBookContent')
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            //commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
            commonJS.addEmptyListHTML("Không thể hiển thị sách", '#hotBookContent')
        })
    }

    //gọi hàm xử lý tất cả các sự kiện trong trang index.html
    initEvent() {
        //gán xử lý sự kiện khi click nút Xem thêm Sách HOT
        $('#getHotBook').on('click', this.getAllHotBookEvent.bind(this));
        //gán xử lý sự kiện khi click nút Xem thêm Sách Mới
        $('#getNewBook').on('click', this.getAllNewBookEvent.bind(this));
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#newBookContent').on('click', 'div.card', this.cardOnClick);
        $('#hotBookContent').on('click', 'div.card', this.cardOnClick);
        //gán xử lý sự kiện khi click vào 1 card loại sách
        $('#categoryRow1').on('click', '.col-lg-3', this.categoryCardOnClick);
        $('#categoryRow2').on('click', '.col-lg-3', this.categoryCardOnClick);
        //gán xử lý cho button Danh mục sách
        $('#searchBtn').on('click', this.openSearchPage);
        $('#searchLink').on('click', this.openSearchPage);
    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {
        var selectedBookId = $(this).data('bookId');
        // console.log(bookId)
        // console.log(this);
        window.open("book-detail.html?id=" + selectedBookId, "_self");
    }

    //chi tiết xử lý sự kiện khi click vào 1 card loại sách
    categoryCardOnClick() {
        debugger
        let categoryID = $(this).data("id");
        localStorage.setItem('searchURL', "&paramBookCategoryID=" + categoryID);
        window.open("search.html", "_self");
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

    //load danh sách các thể loại sách
    loadCategoryList() {
        const categoryList = [{
                categoryID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                categoryName: "Sách công nghệ",
                categoryImg: "../content/img/categories/computer-science.jpg"
            },
            {
                categoryID: "4c5fcc85-2240-4c78-86b4-e8cec8676010",
                categoryName: "Tiểu thuyết",
                categoryImg: "../content/img/categories/novel.jpg"
            },
            {
                categoryID: "308b1678-3fba-45b2-b00f-c609fb270baa",
                categoryName: "Truyện ngắn",
                categoryImg: "../content/img/categories/short-story.jpg"
            },
            {
                categoryID: "76754db7-9cfe-4aef-9746-ef8304ab1888",
                categoryName: "Tài liệu nghiên cứu",
                categoryImg: "../content/img/categories/research.jpg"
            },
            {
                categoryID: "6db28ff1-4018-4b87-8dd8-02447b640f5b",
                categoryName: "Sách trinh thám",
                categoryImg: "../content/img/categories/detective.jpg"
            },
            {
                categoryID: "76754db7-9cfe-4aef-9746-ef8304ab174f",
                categoryName: "Sách thiếu nhi",
                categoryImg: "../content/img/categories/kid.jpg"
            },
            {
                categoryID: "308b1732-3fba-45b2-b00f-c609fb270bb1",
                categoryName: "Truyện dài",
                categoryImg: "../content/img/categories/long-story.jpg"
            },
            {
                categoryID: "870abb9a-8d25-4c7f-a375-3b2ba9b41ea4",
                categoryName: "Truyện dân gian",
                categoryImg: "../content/img/categories/old-story.jpg"
            }
        ];
        let categoryDiv;
        let categoryRow1 = $('#categoryRow1');
        let categoryRow2 = $('#categoryRow2');
        for (let i = 0; i < categoryList.length; i++) {
            let item = categoryList[i];
            categoryDiv = $(`<div class="col-lg-3 col-xs-12 col-sm-6 border-0 mb-2">
                                <div class="card border-0 rounded-0">
                                    <div class="card-body border-0">
                                        <div class="card-title">
                                            <h5>${item.categoryName}</h5>
                                        </div>
                                        <img class="w-100 mx-auto" src="${item.categoryImg}" style="height: 15rem;">
                                    </div>
                                </div>
                            </div>`);
            categoryDiv.data("id", item.categoryID);
            if (i < 4) {
                categoryRow1.append(categoryDiv);
            } else {
                categoryRow2.append(categoryDiv);
            }
        }
    }

    //chi tiết xử lý sự kiện mở trang tìm kiếm
    openSearchPage() {
        localStorage.removeItem("searchURL");
        window.open("search.html", "_self");
    }
}