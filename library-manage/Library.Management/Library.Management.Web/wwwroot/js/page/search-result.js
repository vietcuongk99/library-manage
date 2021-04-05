//số lượng bản ghi sách hiển thị trên một trang
//20 sách
const RECORD_PER_PAGE = 20;
//khai báo trang hiển thị mặc định
//trang đầu tiên
const PAGE_DEFAULT = 1;
//khai báo số trang hiển thị mặc định trên thanh pagination
//1 trang
const VISIBLE_PAGE_DEFAULT = 1;

//lấy ra giá trị tìm kiếm từ url
var searchValue = commonJS.getURLParameter('searchValue')

$(document).ready(function() {
    searchResultJS = new SearchResultJS()
})


//class quản lý các sự kiện trong trang search-result.html
class SearchResultJS extends BaseJS {
    constructor() {
        super();
        this.loadSearchResult(searchValue);
        this.initEvent();

    }

    //gán sự kiện trong trang search-result.html
    initEvent() {
        //gán xử lý sự kiện khi click nút Tìm kiếm
        $('#searchBtn').on('click', this.searchEvent.bind(this));
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#searchResultDiv').on('click', '.card.h-100', this.cardOnClick)

    }

    ///load dữ liệu
    loadSearchResult(searchValue) {

        //khai báo và gán giá trị trong localStorage
        // var fieldValue = localStorage.getItem("fieldValue")
        // var fieldText = localStorage.getItem("fieldText")
        //var searchValue = localStorage.getItem("searchValue");
        //var showNewBook = localStorage.getItem("showNewBook")
        //var showHotBook = localStorage.getItem("showHotBook");

        //load dữ liệu các thành phần HTML
        //dữ liệu thay đổi phụ thuộc event trên trang index
        //nếu user ấn button 'xem thêm' sách hot trên trang index
        // if (showHotBook) {

        //     //load dữ liệu
        //     var fieldHTML = $(`<li class="breadcrumb-item">Sách HOT</li>`)
        //     $('#breadcrumbDiv').append(fieldHTML);
        //     //gán dữ liệu lên ui
        //     //đợi api
        //     commonJS.appendBookDataToCard(fakeData, "#searchResultDiv")

        //     //thay đổi giao diện footer
        //     // $('footer').removeClass("fixed-bottom")

        // }

        //nếu user ấn button 'xem thêm' sách mới trên trang index
        // if (showNewBook) {

        //     //load dữ liệu
        //     var fieldHTML = $(`<li class="breadcrumb-item">Sách Mới</li>`)
        //     $('#breadcrumbDiv').append(fieldHTML);
        //     //gán dữ liệu lên ui
        //     //đợi api
        //     commonJS.appendBookDataToCard(fakeData, "#searchResultDiv")

        //     //thay đổi giao diện footer
        //     //$('footer').removeClass("fixed-bottom")
        // }



        //nếu user ấn nút tìm kiếm trên trang index
        if (searchValue || searchValue == "") {
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
                    debugger
                    //gán tổng số bản ghi cho biến toàn cục
                    var totalBookRecord = res.data.totalRecord;

                    //tính toán số trang hiển thị và gán cho biến toàn cục
                    var totalPages = Math.ceil(totalBookRecord / RECORD_PER_PAGE);

                    debugger
                    //gọi hàm loadPaginationSearchResult
                    //phân trang dữ liệu
                    debugger
                    searchResultJS.loadPaginationSearchResult(totalPages, searchValue)
                } else {
                    debugger
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
        //localStorage.setItem("bookId", bookId)

        //tạo url với param chứa id đầu sách vừa được click
        var bookDetailStr = "book-detail.html?id=" + bookId;
        //mở trang book-detail
        window.open(bookDetailStr, "_self")
    }

    //chi tiết xử lý sự kiện khi click vào nút Tìm kiếm
    searchEvent() {

        //lấy thông tin tìm kiếm hiện tại
        var searchValue = $('#searchInput').val().trim()

        //lưu thông tin tìm kiếm vào localStorage
        //localStorage.setItem("searchValue", searchValue);

        debugger
        //tạo url với param chứa giá trị cần tìm kiếm
        var searchPageStr = "search-result.html?searchValue=" + searchValue;
        //mở trang search-result.html
        window.open(searchPageStr, "_self")
            // $('#pagingDiv').children().remove();
            // $('#searchResultDiv').children().remove();


    }


    //phân trang và hiển thị kết quả tìm kiếm
    loadPaginationSearchResult(totalPages, searchValue) {
        debugger
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