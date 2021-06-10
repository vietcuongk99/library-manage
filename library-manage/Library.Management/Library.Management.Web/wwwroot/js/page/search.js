$(document).ready(function() {
    searchBookJS = new SearchBookJS()
})

//class quản lý các sự kiện trong trang search.html
class SearchBookJS extends BaseJS {
    constructor() {
        super();
        this.loadCategoryData();
        this.loadUserSearchInput();
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
        // xử lý với nút Enter
        $("#searchInput").keyup(function (event) {
            if (event.keyCode === 13) {
                localStorage.removeItem("searchURL");
                searchBookJS.loadSearchResult();
            }
        });
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#searchResultDiv').on('click', '.card', this.cardOnClick);
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
            localStorage.removeItem("searchURL");
            searchBookJS.blurEvent(event, 'finishYearInput')
        });
        $('#finishYearInput').blur(function(event) {
            localStorage.removeItem("searchURL");
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
                //gán option loại sách lên ui
                commonJS.appendCategoryListToHTML(categoryList, '#categorySelect');
                //lấy ra chuỗi tìm kiếm trong local storage
                var searchURL = localStorage.getItem("searchURL");
                //nếu có chuỗi tìm kiếm
                if (searchURL) {
                    //lấy ra id loại sách hiện tại đang tìm kiếm
                    var categoryID = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'paramBookCategoryID'),
                        //duyệt list loại sách và gán option loại sách hiện tại lên ui
                        categoryList = $('#categorySelect option');
                    for (let index = 0; index < categoryList.length; index++) {
                        var optionObj = categoryList[index];
                        if ($(optionObj).data("id") == categoryID) {
                            $('#categorySelect option')
                                .removeAttr('selected')
                                .filter('[value=' + optionObj.value + ']')
                                .prop('selected', true);
                            //thoát vòng lặp
                            break
                        }
                    }
                }
            }
            //nếu response trả về không thành công
            else {
                // show alert
                //commonBaseJS.showToastMsgFailed(res.message)
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
            var searchValue = $('#searchInput').val().trim(),
                //lấy lựa chọn tìm kiếm hiện tại
                searchType = $('#searchTypeSelect option:selected').val(),
                //lấy id loại sách cần lọc
                categoryID = $('#categorySelect option:selected').data('id'),
                //lấy khoảng năm xuất bản cần lọc
                startYear = $('#startYearInput').val(),
                finishYear = $('#finishYearInput').val(),
                //lấy lựa chọn sắp xếp cần lọc
                sortName = $('#sortNameSelect option:selected').val(),
                //lấy kiểu sắp xếp cần lọc
                sortType = $('#sortTypeSelect option:selected').val(),
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
            //nếu response trả về báo thành công và có data
            if (res.success && res.data) {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //gán tổng số bản ghi cho biến toàn cục
                var totalBookRecord = res.data.totalRecord;
                //tính toán số trang hiển thị và gán cho biến toàn cục
                var totalPages = Math.ceil(totalBookRecord / Enum.BookPaging.RECORD_PER_PAGE);
                //gọi hàm loadPaginationSearchResult
                //phân trang dữ liệu
                searchBookJS.loadPaginationSearchResult(totalPages, searchURL, res.data.dataItems);
            } else {
                $('#pageNumberDiv').empty();
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgInfomation("Không tìm thấy sách phù hợp");
                //thêm empty list html
                commonJS.addEmptyListHTML("Không tìm thấy sách phù hợp", "#searchResultDiv")
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Tìm kiếm không thành công.");
            //thêm empty list html
            commonJS.addEmptyListHTML("Không thể hiển thị sách", "#searchResultDiv")
        })
    }

    //phân trang và hiển thị kết quả tìm kiếm
    loadPaginationSearchResult(totalPages, searchURL, pageDefaultData) {
        //hủy pagination từ twbs-paginaton plugin
        $('#pagingDiv').twbsPagination('destroy');
        $('#pageNumberDiv').empty();
        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: 0,
            onPageClick: function(event, page) {
                $('#pageNumberDiv').html(`<p style="font-size: 14px;" class="my-auto p-custom">Trang: ` + page + `/` + totalPages + `</p>`);
                if (page > Enum.BookPaging.PAGE_DEFAULT) {
                    //xóa kết quả tìm kiếm
                    $('#searchResultDiv').children().remove();
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
                            //thêm empty list html
                            commonJS.addEmptyListHTML("Không tìm thấy sách phù hợp", "#searchResultDiv")
                        }
                    }).fail(function(res) {
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                        //show alert
                        commonBaseJS.showToastMsgFailed("Tìm kiếm không thành công.");
                        //thêm empty list html
                        commonJS.addEmptyListHTML("Không thể hiển thị sách", "#searchResultDiv")
                    })
                } else {
                    commonJS.appendBookDataToCard(pageDefaultData, "#searchResultDiv");
                }

            }
        })
    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {
        //lấy ra id book được click
        var selectedBookId = $(this).data('bookId'),
            //tạo url với param chứa id đầu sách vừa được click
            bookDetailStr = "book-detail.html?id=" + selectedBookId;
        //mở trang book-detail
        window.open(bookDetailStr, "_self")
    }

    //chi tiết xử lý cho sự kiện lose focus của input nhập năm xuất bản
    blurEvent(event, relatedSelectorID) {
        //lấy ra id của element được focus ngay sau khi input nhập năm xuất bản lose focus
        var focusTargetID = $(event.relatedTarget).attr("id");
        //nếu như id trên không phải id của input nhập năm bắt đầu/kết thúc
        //element được focus không phải input nhập năm bắt đầu/kết thúc
        if (focusTargetID != relatedSelectorID) {
            //lấy ra giá trị năm bắt đầu và năm kết thúc
            var startYear = parseInt($('#startYearInput').val()),
                finishYear = parseInt($('#finishYearInput').val());
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

    //load dữ liệu tìm kiếm của người dùng (không tính loại sách)
    loadUserSearchInput() {
        //lấy ra chuỗi tìm kiếm trong local storage
        var searchURL = localStorage.getItem("searchURL");
        if (searchURL) {
            //lấy ra giá trị tìm kiếm
            var searchType = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'searchType'),
                //lấy ra loại tìm kiếm
                searchValue = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'searchValue'),
                //lấy ra năm bắt đầu xuất bản
                startYear = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'startYear'),
                //lấy ra năm kết thúc xuất bản
                finishYear = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'finishYear'),
                //lấy ra giá trị sắp xếp
                maxValueType = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'maxValueType'),
                //lấy ra cấp độ sắp xếp
                orderByType = commonJS.getURLParameter(searchURL, Enum.SplitOption.ONE, 'orderByType');
            //gán giá trị tìm kiếm và năm xuất bản lên ui
            (searchValue && searchValue.trim().length > 0) ? ($('#searchInput').val(searchValue)) : ($('#searchInput').val(""));
            (startYear) ? ($('#startYearInput').val(startYear)) : ($('#startYearInput').val(""));
            (finishYear) ? ($('#finishYearInput').val(finishYear)) : ($('#finishYearInput').val(""));
            //gán option loại tìm kiếm
            (searchType) ? (
                $('#searchTypeSelect option')
                .removeAttr('selected')
                .filter('[value=' + searchType + ']')
                .prop('selected', true)) : (
                $('#searchTypeSelect option').removeAttr('selected').filter('[value=' + '1' + ']').prop('selected', true));
            //gán option sắp xếp
            (maxValueType) ? (
                $('#sortNameSelect option')
                .removeAttr('selected')
                .filter('[value=' + maxValueType + ']')
                .prop('selected', true)) : (
                $('#sortNameSelect option').removeAttr('selected').filter('[innerText=' + '"Sắp xếp theo"' + ']').prop('selected ', true));
            //gán option cấp độ
            (orderByType && orderByType >= 1 && orderByType <= 2) ? (
                $('#sortTypeSelect option')
                .removeAttr('selected')
                .filter('[value=' + orderByType + ']')
                .prop('selected', true)) : (
                $('#sortTypeSelect option').removeAttr('selected').filter('[innerText=' + '"Cấp độ"' + ']').prop('selected', true));
        }
    }
}