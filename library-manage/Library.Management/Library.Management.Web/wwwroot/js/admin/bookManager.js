//khai báo biến toàn cục lưu tổng số bản ghi sách sau tìm kiếm và số trang hiển thị
var totalBookRecord;
var totalPages;
var DELAY = 300,
    clicks = 0,
    timer = null;

$(document).ready(function() {
    var setting = new BookManager();
});

class BookManager {
    static editMode = 1;

    constructor() {
        BookManager.loadData();
        this.initEvents();
    }

    static loadData() {
        var self = this,
            searchValue = $('.searchInp').val().trim(),
            //lấy lựa chọn tìm kiếm hiện tại
            searchType = $('#searchTypeSelect option:selected').val(),
            //lấy id loại sách cần lọc
            categoryID = $('#searchSelectGroup option:selected').data('id'),
            //lấy khoảng năm xuất bản cần lọc
            startYear = $('#startYearInput').val(),
            finishYear = $('#finishYearInput').val(),
            //lấy lựa chọn sắp xếp cần lọc
            sortName = $('#sortNameSelect option:selected').val(),
            //lấy kiểu sắp xếp cần lọc
            sortType = $('#sortTypeSelect option:selected').val(),
            searchURL = commonJS.buildUrlSearchPage(searchValue, searchType, categoryID, startYear, finishYear, sortName, sortType);

        $('#searchResultDiv').empty();

        $.ajax({
            method: "GET",
            url: "api/BookDetail/GetPagingDataV2" +
                "?pageNumber=" + Enum.BookPaging.PAGE_DEFAULT +
                "&pageSize=" + Enum.BookPaging.RECORD_PER_PAGE + searchURL,
            async: true,
            contentType: "application/json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            commonBaseJS.showLoadingData(0);
            if (res.success) {
                if (res.data) {
                    totalBookRecord = res.data.totalRecord;
                    //tính toán số trang hiển thị và gán cho biến toàn cục
                    totalPages = Math.ceil(totalBookRecord / Enum.BookPaging.RECORD_PER_PAGE);
                    //gọi hàm loadPaginationSearchResult
                    //phân trang dữ liệu
                    BookManager.loadPaginationSearchResult(totalPages, searchURL, res.data.dataItems)
                } else {
                    commonBaseJS.showToastMsgInfomation("Không tìm thấy sách phù hợp")
                    var row = $(`<div class="row mt-2"><h2>Không tìm thấy sách phù hợp</h2></div>`);
                    $("#searchResultDiv").html(row)
                }

            } else {

                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    initEvents() {
        $(".downloadTemplateFile").on('click', this.downloadTemplateFile.bind(this));
        $("#btn-import").on('click', this.uploadFileImport.bind(this));
        $(".btnDelete").on('click', this.onClickDelete.bind(this));
        $("#confirmDeleteBook").on('click', this.confirmDeleteBook.bind(this));
        $(".btnAdd").on('click', this.onShowModal.bind(this));
        $(".fa-search").on('click', this.onclickSearch.bind(this));
        $(".check-file-upload").on("change", function() {
            let filename = $(this).val().split("\\").pop();
            if (filename == '') {
                $(this).next().text("Chọn file nhập khẩu");
            } else {
                $(this).next().text(filename);
            }
            $(this).blur();
        });
        //$('#searchResultDiv').on('dblclick', '.card.h-100', )
        $('#searchResultDiv').on('click', '.card.h-100', function(e) {

                clicks++; //count clicks

                if (clicks === 1) {

                    timer = setTimeout(function() {
                        clicks = 0; //after action performed, reset counter
                        BookManager.onclickChooseBook(e);

                    }, DELAY);

                } else {

                    clearTimeout(timer); //prevent single-click action
                    clicks = 0; //after action performed, reset counter
                    BookManager.handleDbClickBook(e);
                }

            })
            .on("dblclick", function(e) {
                e.preventDefault(); //cancel system double-click event
            });

        $('.btn-more-search').on('click', function(e) {
            $("div#pop-up-search").css('top', e.target.getBoundingClientRect().top - 28).css('left', e.target.getBoundingClientRect().left - 220);
            $('div#pop-up-search').show();
        });

        $('.btnClose').on('click', function() {
            $('div#pop-up-search').hide();
        });

        $('.btnCancel').on('click', function() {
            $('#searchSelectGroup').val(0);
            $('#searchTypeSelect').val(1);
            $('#startYearInput').val('');
            $('#finishYearInput').val('');
            $('#sortNameSelect').val(0);
            $('#sortTypeSelect').val(0);
        });

        $('.btnApply').on('click', function() {
            $('div#pop-up-search').hide();
            BookManager.loadData();
        });

        $(".searchInp").keyup(function (event) {
            if (event.keyCode === 13) {
                $('div#pop-up-search').hide();
                BookManager.loadData();
            }
        });
    }

    downloadTemplateFile(event) {
        var url = `api/Upload/downloadTemplateFile`;

        $.ajax({
            type: "GET",
            url: url,
            success: function(res) {
                window.open(url, '_blank');
            },
            error: function(e) { debugger }
        });
    }

    uploadFileImport() {
        var self = this;
        var fileNew = $('#fileNewupload').val();

        if (this.checkFile(fileNew)) {
            var fdata = new FormData();
            var fileNewUpload = $("#fileNewupload").get(0);
            fdata.append(fileNewUpload.files[0].name, fileNewUpload.files[0]);

            $.ajax({
                type: "POST",
                url: `api/Upload/uploadFileImport`,
                data: fdata,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    //show loading
                    commonBaseJS.showLoadingData(1);
                },
                success: function(response) {
                    var result = response.data.result;

                    commonBaseJS.showLoadingData(0);

                    if (result) {

                        $('.content-notify').text(`Nhập khẩu thành công ${result.InsertCategorySuccess} thể loại mới và ${result.InsertBookSuccess} / ${result.TotalRecord} cuốn sách.`);
                        $('#modalNotification').modal('show'); 
                        $(".check-file-upload").val('');
                        $(".check-file-upload").next().text("Chọn file nhập khẩu");
                        $('.close').click();
                        $('.fade').hide();
                        $('#searchResultDiv').empty();
                        BookManager.loadData();
                    } else {
                        commonBaseJS.showToastMsgFailed('Nhập khẩu thất bại');
                    }
                },
                error: function(e) {
                    commonBaseJS.showLoadingData(0);
                    commonBaseJS.showToastMsgFailed('Nhập khẩu thất bại');
                }
            });
        }
    }

    /**
     * Kiểm tra extention của file có phù hợp không
     * @param {any} filename
     * Created by bvbao (20/7/2020)
     */
    checkFile(filename) {
        var fileExtension = ['xls', 'xlsx'];
        if (filename.length == 0 || !filename || filename == null) {
            commonBaseJS.showToastMsgWarning("Vui lòng chọn file");
            return false;
        } else {
            var extension = filename.replace(/^.*\./, '');
            if ($.inArray(extension, fileExtension) == -1) {
                commonBaseJS.showToastMsgWarning("Vui lòng chọn file Excel");
                return false;
            }
        }
        return true;
    }

    static appendDataToHTML(data, selector) {

        var row = $(`<div class="row mt-2 mb-3"></div>`)
        data.forEach(book => {

            var bookImgBase64String = "data:image/jpg;base64," + book.bookImageUriBase64String;
            var card = $(`<div class="col-6 col-md-6 col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100" bookId="${book.bookID}">
                <img class="card-img-top w-100 pt-1 px-1 mx-auto" src="` + bookImgBase64String + `" alt="" style="height: 23rem;">
                    <div class="card-body">
                        <p class="card-title text-truncate text-uppercase text-center">` + `<b>` + book.bookName + `</b>` + `</b>
                        <p class="text-truncate text-center">` + book.bookAuthor + `</p>
                    </div>
                </div>`)

            bookHTML.data('bookId', book.bookID)
            $(card).append(bookHTML)
            row.append(card)
        })
        $(selector).html(row)
    }

    onclickSearch() {
        BookManager.loadData();
    }

    onClickDelete() {
        var self = this,
            listID = BookManager.getRecordSelected();

        if (listID.length > 0) {
            $('#modalConfirmDelete').modal('show');
        } else {
            commonBaseJS.showToastMsgWarning("Vui lòng chọn sách cần xóa");
        }
    }

    confirmDeleteBook() {
        var self = this,
            listID = BookManager.getRecordSelected();

        $.ajax({
            method: "DELETE",
            url: "/api/BookDetail/GroupID",
            data: JSON.stringify(listID),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            },
        }).done(function(res) {
            commonBaseJS.showLoadingData(0);
            if (res.success) {
                $('#searchResultDiv').empty();
                BookManager.loadData();
                $('.fade').hide();
                commonBaseJS.showToastMsgSuccess("Bạn đã xóa sách thành công.");
            } else {
                commonBaseJS.showToastMsgFailed("Xóa sách không thành công")
            }
        }).fail(function(res) {
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Xóa sách không thành công")
        })
    }

    static getRecordSelected() {
        var lstBookId = [],
            lstChecked = $('.checkedBook');

        if (lstChecked.length > 0) {
            for (var i = 0; i < lstChecked.length; i++) {
                var bookId = $(lstChecked[i]).attr('bookId');

                lstBookId.push(bookId);
            }
        }

        return lstBookId;
    }

    onShowModal(event) {
        $('#blah').attr('src', "/content/img/avatar-book-default.jpg");
        BookManager.editMode = 1;
        $('#modalAddBook').modal('show');
    }

    static handleDbClickBook(event) {
        var thisCard = event.target.closest('.portfolio-item'),
            lstChecked = $('.checkedBook');

        if (lstChecked.length > 0) {
            for (var i = 0; i < lstChecked.length; i++) {
                $(lstChecked[i]).removeClass('checkedBook');
            }
        }

        $(thisCard).children().addClass('checkedBook');

        BookManager.editMode = 2;
        $('#modalAddBook').modal('show');
    }

    static onclickChooseBook(event) {
        var thisCard = $(event.target.closest('.h-100'));

        if (thisCard.attr('class').includes('checkedBook')) {
            thisCard.removeClass('checkedBook');
        } else {
            thisCard.addClass('checkedBook');
        }
    }

    static loadPaginationSearchResult(totalPages, searchURL, pageDataDefault) {
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
                        url: "api/BookDetail/GetPagingDataV2" +
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
                            $('#searchResultDiv').empty();
                            //gán dữ liệu lên ui
                            BookManager.appendDataToHTML(res.data.dataItems, "#searchResultDiv");
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
                } else {
                    BookManager.appendDataToHTML(pageDataDefault, "#searchResultDiv");
                }

            }
        })
    }
}