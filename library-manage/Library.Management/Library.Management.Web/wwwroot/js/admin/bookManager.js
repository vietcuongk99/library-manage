const RECORD_PER_PAGE = 20;
//khai báo trang hiển thị mặc định
//trang đầu tiên
const PAGE_DEFAULT = 1;
//khai báo số trang hiển thị mặc định trên thanh pagination
//1 trang
const VISIBLE_PAGE_DEFAULT = 1;
//khai báo biến toàn cục lưu tổng số bản ghi sách sau tìm kiếm và số trang hiển thị
var totalBookRecord;
var totalPages;

$(document).ready(function () {
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
            searchValue = $('.searchInp').val();

        $('#searchResultDiv').empty();

        $.ajax({
            method: "GET",
            url: "/api/BookDetail/GetPagingData?paramBookName=" + searchValue.trim() + "&pageNumber=" + PAGE_DEFAULT + "&pageSize=" + RECORD_PER_PAGE,
            async: true,
            contentType: "application/json",
        }).done(function (res) {
            if (res.success) {
                if (res.data) {
                    BookManager.appendDataToHTML(res.data.dataItems, "#searchResultDiv");

                    totalBookRecord = res.data.totalRecord;

                    //tính toán số trang hiển thị và gán cho biến toàn cục
                    totalPages = Math.ceil(totalBookRecord / RECORD_PER_PAGE);

                    //gọi hàm loadPaginationSearchResult
                    //phân trang dữ liệu
                    BookManager.loadPaginationSearchResult(totalPages, searchValue);
                }
                else {
                    var row = $(`<div class="row mt-2"><h2>Không tìm thấy dữ liệu</h2></div>`);
                    $("#searchResultDiv").html(row)
                }

            } else {

                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    initEvents() {
        $(".downloadTemplateFile").on('click', this.downloadTemplateFile.bind(this));
        $("#btn-import").on('click', this.uploadFileImport.bind(this));
        $(".btnDelete").on('click', this.onClickDelete.bind(this));
        $(".btnAdd").on('click', this.onShowModal.bind(this));
        $(".fa-search").on('click', this.onclickSearch.bind(this));
        $(".check-file-upload").on("change", function () {
            let filename = $(this).val().split("\\").pop();
            if (filename == '') {
                $(this).next().text("Chọn file nhập khẩu");
            }
            else {
                $(this).next().text(filename);
            }
            $(this).blur();
        });
        $('#searchResultDiv').on('dblclick', '.card.h-100', this.handleDbClickBook.bind(this))
    }

    downloadTemplateFile(event) {
        var url = `api/Upload/downloadTemplateFile`;

        $.ajax({
            type: "GET",
            url: url,
            success: function (res) {
                window.open(url, '_blank');
            },
            error: function (e) { debugger }
        });
    }

    uploadFileImport() {
        var self = this;
        var fileNew = $('#fileNewupload').val();
        
        if (this.checkFile(fileNew)) {
            var fdata = new FormData();
            var fileNewUpload = $("#fileNewupload").get(0);
            fdata.append(fileNewUpload.files[0].name, fileNewUpload.files[0]);

            $('#loader').show();
            $('.main-container').addClass("loading");

            $.ajax({
                type: "POST",
                url: `api/Upload/uploadFileImport`,
                data: fdata,
                contentType: false,
                processData: false,
                success: function (response) {
                    var result = response.data.result;

                    if (result) {
                        $('#loader').hide();
                        $('.main-container').removeClass("loading");

                        alert(`Nhập khẩu thành công ${result.InsertCategorySuccess} thể loại mới và ${result.InsertBookSuccess} / ${result.TotalRecord} cuốn sách.`);
                        $(".check-file-upload").val('');
                        $(".check-file-upload").next().text("Chọn file nhập khẩu");
                        $('.close').click();
                        $('.fade').hide();
                        $('#searchResultDiv').empty();
                        BookManager.loadData();
                    }
                    else {
                        $('#loader').hide();
                        $('.main-container').removeClass("loading");
                        alert('Nhập khẩu thất bại');
                    }
                },
                error: function (e) {
                    $('#loader').hide();
                    $('.main-container').removeClass("loading");
                    alert('Nhập khẩu thất bại');
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
            alert("Vui lòng chọn file");
            return false;
        }
        else {
            var extension = filename.replace(/^.*\./, '');
            if ($.inArray(extension, fileExtension) == -1) {
                alert("Vui lòng chọn file Excel");
                return false;
            }
        }
        return true;
    }

    static appendDataToHTML(data, selector) {

        var row = $(`<div class="row mt-2"></div>`)
        data.forEach(book => {

            var bookImgBase64String = "data:image/jpg;base64," + book.bookImageUriBase64String;
            var card = $(`<div class="col-6 col-md-6 col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100" bookId="${book.bookID}">
                <input type="checkbox" class="cbxBookDetail" />
                <img class="card-img-top w-100 pt-1 px-1 mx-auto" src="` + bookImgBase64String + `" alt="" style="height: 23rem;">
                    <div class="card-body">
                        <p class="card-title text-truncate text-uppercase text-center">` + book.bookName + `</b>
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
            var conf = confirm("Bạn có thực sự muốn những cuốn sách này không?");
            if (conf == true) {

                $.ajax({
                    method: "DELETE",
                    url: "/api/BookDetail/GroupID",
                    data: JSON.stringify(listID),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                }).done(function (res) {
                    if (res.success) {
                        $('#searchResultDiv').empty();
                        BookManager.loadData();
                        commonBaseJS.showToastMsgSuccess("Bạn đã xóa sách thành công.");
                    } else {
                        commonBaseJS.showToastMsgFailed("Xóa sách không thành công")
                    }
                }).fail(function (res) {
                    commonBaseJS.showToastMsgFailed("Xóa sách không thành công")
                })
            }
        }
        else {
            alert("Vui lòng chọn sách cần xóa");
        }
    }

    static getRecordSelected() {
        var lstBookId = [],
            lstChecked = $('.cbxBookDetail:checkbox:checked');

        if (lstChecked.length > 0) {
            for (var i = 0; i < lstChecked.length; i++) {
                var a = $(lstChecked[i]).parent(),
                    bookId = a.get(0).getAttribute('bookId');

                lstBookId.push(bookId);
            }
        }

        return lstBookId;
    }

    onShowModal(event) {
        BookManager.editMode = 1;
        $('#modalAddBook').modal('show'); 
    }

    handleDbClickBook(event) {
        var thisCard = event.target.closest('.portfolio-item'),
            lstChecked = $('.cbxBookDetail:checkbox:checked');

        if (lstChecked.length > 0) {
            for (var i = 0; i < lstChecked.length; i++) {
                lstChecked[i].checked = false;
            }
        }

        thisCard.querySelector('.cbxBookDetail').checked = true;
        
        BookManager.editMode = 2;
        $('#modalAddBook').modal('show'); 
    }

    static loadPaginationSearchResult(totalPages, searchValue) {

        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: VISIBLE_PAGE_DEFAULT,
            onPageClick: function (event, page) {
                //call api
                $.ajax({
                    method: "GET",
                    url: "api/BookDetail/GetPagingData?paramBookName=" + searchValue.trim() + "&pageNumber=" + page + "&pageSize=" + RECORD_PER_PAGE,
                    async: true,
                    contentType: "application/json",
                    beforeSend: function () {
                        //show loading
                        commonBaseJS.showLoadingData(1);
                    }
                }).done(function (res) {
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
                }).fail(function (res) {
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
                })
            }
        })
    }
}