//lấy ra đường dẫn chứa tham số từ url
var searchURL = commonJS.getURLParameter(Enum.SplitOption.ALL);

$(document).ready(function() {
    searchBookJS = new SearchBookJS()
})

//class quản lý các sự kiện trong trang search.html
class SearchBookJS extends BaseJS {
    constructor() {
        super();
        this.loadCategoryData();
        this.loadSearchResult(searchURL);
        this.initEvent();
    }

    //gán sự kiện trong trang search-result.html
    initEvent() {
        //gán xử lý sự kiện khi click nút Tìm kiếm
        $('#searchBtn').on('click', this.searchEvent.bind(this));
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#searchResultDiv').on('click', '.card.h-100', this.cardOnClick)
    }

    //load dữ liệu loại sách
    loadCategoryData() {
        //gọi api
        $.ajax({
            url: Enum.URL.HOST_URL + "api/BookCategory",
            contentType: "application/json",
            method: "GET"
        }).done(function(res) {
            //nếu response trả về thành công
            if (res.success) {
                var categoryList = res.data.lstData;
                //gán dữ liệu lên ui
                commonJS.appendCategoryListToHTML(categoryList, '#categorySelect');
            }
            //nếu response trả về không thành công
            else {
                // show alert
                commonBaseJS.showToastMsgFailed(res.message)
            }
        }).fail(function(res) {
            // show alert
            commonBaseJS.showToastMsgFailed(res.message)
        })
    }

    ///load kết quả tìm kiếm
    loadSearchResult(searchURL) {
        if (searchURL.trim().length > 0) {
            //lấy ra đầu sách phù hợp trong csdl
            $.ajax({
                method: "GET",
                url: Enum.URL.HOST_URL + "api/BookDetail/GetPagingDataV2" +
                    "?pageNumber=" + Enum.BookPaging.PAGE_DEFAULT +
                    "&pageSize=" + Enum.BookPaging.RECORD_PER_PAGE + searchURL,
                async: true,
                contentType: "application/json",
                beforeSend: function() {
                    //show loading
                    commonBaseJS.showLoadingData(1);
                }
            }).done(function(res) {
                if (res.success && res.data) {
                    //gán tổng số bản ghi cho biến toàn cục
                    var totalBookRecord = res.data.totalRecord;
                    //tính toán số trang hiển thị và gán cho biến toàn cục
                    var totalPages = Math.ceil(totalBookRecord / Enum.BookPaging.RECORD_PER_PAGE);
                    //gọi hàm loadPaginationSearchResult
                    //phân trang dữ liệu
                    searchBookJS.loadPaginationSearchResult(totalPages, searchURL)
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
        //tạo url với param chứa id đầu sách vừa được click
        var bookDetailStr = "book-detail.html?id=" + bookId;
        //mở trang book-detail
        window.open(bookDetailStr, "_self")
    }

    //chi tiết xử lý sự kiện khi click vào nút Tìm kiếm
    searchEvent() {
        //lấy thông tin tìm kiếm hiện tại
        var searchValue = $('#searchInput').val().trim();
        //lấy lựa chọn tìm kiếm hiện tại
        var searchType = $('#searchTypeSelect option:selected').val();
        //lấy id loại sách cần lọc
        var categoryID = $('#categorySelect option:selected').data('id');
        //lấy khoảng năm xuất bản cần lọc
        var startYear = $('#startYearInput').val();
        var finishYear = $('#finishYearInput').val();
        //lấy lựa chọn sắp xếp cần lọc
        var sortName = $('#sortNameSelect option:selected').val();
        //lấy kiểu sắp xếp cần lọc
        var sortType = $('#sortTypeSelect option:selected').val();
        //tạo url với param chứa giá trị cần tìm kiếm
        var searchPageStr = commonJS.buildUrlSearchPage(searchValue, searchType, categoryID, startYear, finishYear, sortName, sortType);
        //mở trang search-result.html
        window.open("search.html?" + searchPageStr, "_self")
    }

    //phân trang và hiển thị kết quả tìm kiếm
    loadPaginationSearchResult(totalPages, searchURL) {

        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: Enum.BookPaging.VISIBLE_PAGE_DEFAULT,
            onPageClick: function(event, page) {
                //call api
                $.ajax({
                    method: "GET",
                    url: Enum.URL.HOST_URL + "api/BookDetail/GetPagingDataV2" +
                        "?pageNumber=" + page +
                        "&pageSize=" + Enum.BookPaging.RECORD_PER_PAGE + searchURL,
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