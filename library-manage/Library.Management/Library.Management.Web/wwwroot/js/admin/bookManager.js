$(document).ready(function () {
    var setting = new BookManager();
});

class BookManager {
    static editMode = 1;

    constructor() {
        this.loadData();
        this.initEvents();
    }

    loadData() {
        var self = this;
        
        $.ajax({
            method: "GET",
            url: "/api/BookDetail/",
            async: true,
            contentType: "application/json",
        }).done(function (res) {
            if (res.success) {

                var data = res.data.lstData
                self.appendDataToHTML(data, "#searchResultDiv")

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
                        self.loadData();
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

    appendDataToHTML(data, selector) {

        var row = $(`<div class="row"></div>`)
        data.forEach(book => {

            var card = $(`<div class="col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = `
            <div class="card h-100" bookId="${book.bookId}">
                <input type="checkbox" class="cbxBookDetail" />
                <img class="card-img-top mx-auto" src="${book.bookImageUri}" alt="" style="width: 150px; height: 200px">
                <div class="card-body">
                    <p class="card-title font-weight-bold text-truncate text-uppercase">${book.bookName}</p>
                    <p class="text-truncate">${book.bookAuthor}</p>
                </div>
            </div>`;
            
            $(bookHTML).data('bookId', book.bookId);
            card.append($(bookHTML));
            row.append(card);
        })

        $(selector).html(row)
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
                        self.loadData();
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
}