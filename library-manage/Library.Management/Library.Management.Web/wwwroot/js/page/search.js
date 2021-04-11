$(document).ready(function() {
    searchBookJS = new SearchBookJS()
})

//class quản lý các sự kiện trong trang search.html
class SearchBookJS extends BaseJS {
    constructor() {
        super();
        this.loadCategoryData();
        this.loadSearchResult();
        this.initEvent();
    }

    //gán sự kiện trong trang search-result.html
    initEvent() {
        //gán xử lý sự kiện khi click nút Tìm kiếm
        $('#searchBtn').on('click', function() {
            //xóa chuỗi tìm kiếm cũ
            localStorage.removeItem("searchURL");
            searchBookJS.loadSearchResult();
        });
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#searchResultDiv').on('click', '.card.h-100', this.cardOnClick);
        //gán xử lý khi chọn option lọc
        //dùng change()
        $('#categorySelect').on('change', function() {
            //xóa chuỗi tìm kiếm cũ
            localStorage.removeItem("searchURL");
            searchBookJS.loadSearchResult();
        });
        $('#sortNameSelect').on('change', function() {
            //xóa chuỗi tìm kiếm cũ
            localStorage.removeItem("searchURL");
            searchBookJS.loadSearchResult();
        });
        $('#sortTypeSelect').on('change', function() {
            //xóa chuỗi tìm kiếm cũ
            localStorage.removeItem("searchURL");
            searchBookJS.loadSearchResult();
        });
        //gán xử lý khi nhập năm xuất bản
        //dùng blur()
        $('#startYearInput').blur(function(event) {
            searchBookJS.blurEvent(event, 'finishYearInput')
        });
        $('#finishYearInput').blur(function(event) {
            searchBookJS.blurEvent(event, 'startYearInput')
        });
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
    loadSearchResult() {
        //xóa kết quả tìm kiếm và thanh phân trang 
        $('#searchResultDiv').children().remove();
        $('#pagingDiv').children().remove();
        //lấy ra string searchURL từ localStorage
        var searchURL = localStorage.getItem("searchURL");
        //nếu string searchURL không tồn tại
        if (!searchURL) {
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
            searchURL = commonJS.buildUrlSearchPage(searchValue, searchType, categoryID, startYear, finishYear, sortName, sortType);
            //lưu chuỗi searchURL mới
            localStorage.setItem("searchURL", searchURL);
        }
        //call api tìm kiếm sách phù hợp trong csdl
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
            //xóa string searchURL trong localStorage
            //localStorage.removeItem("searchURL");
            //nếu response trả về báo thành công và có data
            if (res.success && res.data) {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //gán tổng số bản ghi cho biến toàn cục
                var totalBookRecord = res.data.totalRecord;
                //tính toán số trang hiển thị và gán cho biến toàn cục
                var totalPages = Math.ceil(totalBookRecord / Enum.BookPaging.RECORD_PER_PAGE);
                //gán dữ liệu lên ui
                //commonJS.appendBookDataToCard(res.data.dataItems, "#searchResultDiv");
                //gọi hàm loadPaginationSearchResult
                //phân trang dữ liệu
                searchBookJS.loadPaginationSearchResult(totalPages, searchURL, res.data.dataItems)
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgInfomation("Không tìm thấy sách phù hợp");
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Tìm kiếm không thành công.");
        })
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

    //phân trang và hiển thị kết quả tìm kiếm
    loadPaginationSearchResult(totalPages, searchURL, pageDefaultData) {
        //hủy pagination từ twbs-paginaton plugin
        $('#pagingDiv').twbsPagination('destroy');
        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: Enum.BookPaging.VISIBLE_PAGE_DEFAULT,
            onPageClick: function(event, page) {
                if (page > Enum.BookPaging.PAGE_DEFAULT) {
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
                            commonBaseJS.showToastMsgInfomation("Không tìm thấy sách phù hợp");
                        }
                    }).fail(function(res) {
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                        //show alert
                        commonBaseJS.showToastMsgFailed("Tìm kiếm không thành công.");
                    })
                } else {
                    commonJS.appendBookDataToCard(pageDefaultData, "#searchResultDiv");
                }

            }
        })
    }

    //chi tiết xử lý cho sự kiện lose focus của input nhập năm xuất bản
    blurEvent(event, relatedSelectorID) {
        //lấy ra id của element được focus ngay sau khi input nhập năm xuất bản lose focus
        var focusTargetID = $(event.relatedTarget).attr("id");
        //nếu như id trên không phải id của input nhập năm bắt đầu/kết thúc
        //element được focus không phải input nhập năm bắt đầu/kết thúc
        if (focusTargetID != relatedSelectorID) {
            //lấy ra giá trị năm bắt đầu và năm kết thúc
            var startYear = parseInt($('#startYearInput').val());
            var finishYear = parseInt($('#finishYearInput').val());
            //nếu giá trị năm > 0
            if (startYear > 0 || finishYear > 0) {
                //hiện alert nếu giá trị năm không hợp lệ
                if (startYear > 0 && finishYear > 0 && startYear > finishYear) {
                    commonBaseJS.showToastMsgInfomation("Giá trị năm xuất bản chưa hợp lệ, vui lòng xem lại");
                }
                //nếu giá trị năm hợp lệ
                //gọi hàm tìm kiếm
                else {
                    searchBookJS.loadSearchResult();
                }
            }
        }
    }
}