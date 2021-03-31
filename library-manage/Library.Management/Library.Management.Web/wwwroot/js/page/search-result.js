//số lượng bản ghi sách hiển thị trên một trang
const RECORD_PER_PAGE = 8;
//khai báo trang hiển thị mặc định
const PAGE_DEFAULT = 1;
//khai báo số trang hiển thị mặc định
const VISIBLE_PAGE_DEFAULT = 1;
//khai báo biến toàn cục lưu tổng số bản ghi sách sau tìm kiếm và số trang hiển thị
var totalRecord;
var totalPages;

$(document).ready(function() {
    searchResultJS = new SearchResultJS()
})


//class quản lý các sự kiện trong trang search-result.html
class SearchResultJS extends BaseJS {
    constructor() {
        super();
        this.loadData();
        this.initEvent();

    }

    //gán sự kiện trong trang search-result.html
    initEvent() {
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#searchResultDiv').on('click', '.card.h-100', this.cardOnClick)

    }

    ///load dữ liệu
    loadData() {

        //khai báo và gán giá trị trong localStorage
        // var fieldValue = localStorage.getItem("fieldValue")
        // var fieldText = localStorage.getItem("fieldText")
        var searchValue = localStorage.getItem("searchValue");
        var showNewBook = localStorage.getItem("showNewBook")
        var showHotBook = localStorage.getItem("showHotBook");

        //load dữ liệu các thành phần HTML
        //dữ liệu thay đổi phụ thuộc event trên trang index
        //nếu user ấn button 'xem thêm' sách hot trên trang index
        if (showHotBook) {

            //load dữ liệu
            var fieldHTML = $(`<li class="breadcrumb-item">Sách HOT</li>`)
            $('#breadcrumbDiv').append(fieldHTML);
            //gán dữ liệu lên ui
            //đợi api
            commonJS.appendBookDataToCard(fakeData, "#searchResultDiv")

            //thay đổi giao diện footer
            $('footer').removeClass("fixed-bottom")

        }

        //nếu user ấn button 'xem thêm' sách mới trên trang index
        if (showNewBook) {

            //load dữ liệu
            var fieldHTML = $(`<li class="breadcrumb-item">Sách Mới</li>`)
            $('#breadcrumbDiv').append(fieldHTML);
            //gán dữ liệu lên ui
            //đợi api
            commonJS.appendBookDataToCard(fakeData, "#searchResultDiv")

            //thay đổi giao diện footer
            $('footer').removeClass("fixed-bottom")
        }

        //nếu user ấn nút tìm kiếm trên trang index
        if (searchValue || searchValue == "") {

            if (searchValue.trim().length > 0) {
                //thay đổi giao diện breadcrumb
                var fieldHTML = $(`<li class="breadcrumb-item">Tên sách</li><li class="breadcrumb-item">` + searchValue.trim() + `</li>`)
                $('#breadcrumbDiv').append(fieldHTML)
            }
            //lấy ra đầu sách phù hợp trong csdl
            $.ajax({
                method: "GET",
                url: HOST_URL + "api/BookDetail/GetPagingData?paramBookName=" + searchValue.trim() + "&pageNumber=" + PAGE_DEFAULT + "&pageSize=" + RECORD_PER_PAGE,
                async: true,
                contentType: "application/json",
                beforeSend: function() {
                    //show loading
                    commonBaseJS.showLoadingData(1);
                }
            }).done(function(res) {
                if (res.success && res.data) {
                    //gán tổng số bản ghi cho biến toàn cục
                    totalRecord = res.data.totalRecord;

                    //tính toán số trang hiển thị và gán cho biến toàn cục
                    totalPages = Math.ceil(totalRecord / RECORD_PER_PAGE);

                    //gọi hàm loadPaginationSearchResult
                    //phân trang dữ liệu
                    searchResultJS.loadPaginationSearchResult(totalPages, searchValue)
                } else {
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgFailed("Không tìm thấy sách phù hợp.");
                }
            }).fail(function(res) {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
            })
        }

    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {

        //lấy ra id book được click
        let bookId = $(this).data('bookId');

        //lưu id vào local storage
        //mở trang book-detail
        localStorage.setItem("bookId", bookId)
        window.open("book-detail.html", "_self")
    }


    //phân trang và hiển thị kết quả tìm kiếm
    loadPaginationSearchResult(totalPages, searchValue) {

        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: VISIBLE_PAGE_DEFAULT,
            onPageClick: function(event, page) {
                //call api
                $.ajax({
                    method: "GET",
                    url: HOST_URL + "api/BookDetail/GetPagingData?paramBookName=" + searchValue.trim() + "&pageNumber=" + page + "&pageSize=" + RECORD_PER_PAGE,
                    async: true,
                    contentType: "application/json",
                    beforeSend: function() {
                        //show loading
                        commonBaseJS.showLoadingData(1);
                    }
                }).done(function(res) {
                    if (res.success && res.data) {

                        //gán dữ liệu lên ui
                        commonJS.appendBookDataToCard(res.data.dataItems, "#searchResultDiv");
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);


                    } else {
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                        //show alert
                        commonBaseJS.showToastMsgFailed(res.message);
                    }
                }).fail(function(res) {
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
                })
            }
        })
    }

}