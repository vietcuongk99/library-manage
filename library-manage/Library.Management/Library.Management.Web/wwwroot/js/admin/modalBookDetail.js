var newGuid = '';

$(document).ready(function () {
    bookDetailJS = new BookDetailJS()
})

class BookDetailJS {
    constructor() {
        $('#modalAddBook').on('shown.bs.modal', this.onloadDataEdit.bind(this))
        this.loadBookData();
        this.initEvent();
    }

    loadBookData() {
        $.ajax({
            method: "GET",
            url: "/api/BookCategory",
            async: true,
            contentType: "application/json"
        }).done(function (res) {
            if (res.success) {
                var data = res.data.lstData;

                if (data.length > 0) {
                    $.each(data, function (index, category) {
                        var userHTML = `<option value="${category.bookCategoryId}">${category.bookCategoryName}</option>`

                        $('#bookCategory').append($(userHTML))
                        $('#searchSelectGroup').append($(userHTML))
                    });
                }

            } else {
                commonBaseJS.showToastMsgFailed("Load thể loại sách thất bại")
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Load thể loại sách thất bại")
        })
    }

    onloadDataEdit() {
        if (BookManager.editMode == 2) {
            var thisBookId = BookManager.getRecordSelected()[0];

            if (thisBookId) {
                $.ajax({
                    method: "GET",
                    url: `/api/BookDetail/${thisBookId}`,
                    async: true,
                    contentType: "application/json"
                }).done(function (res) {
                    if (res.success) {
                        var data = res.data;

                        $('#bookCode').val(data.bookCode);
                        $('#bookName').val(data.bookName);
                        $('#bookCategory').val(data.bookCategoryId);
                        $('#bookAuthor').val(data.bookAuthor);
                        $('#bookPage').val(data.amountPage);
                        $('#bookYear').val(data.yearOfPublication);
                        $('#bookDescription').val(data.description);

                        if (data.bookImageUri && (data.bookImageUri).trim().length > 0) {
                            //nếu đường dẫn ảnh nằm trong thư mục Temp của project
                            //gọi loadBookImg() của bookDetailJS object lấy ra base64 string
                            if (data.bookImageUri.includes("~Temp")) {
                                $.ajax({
                                    method: "GET",
                                    url: HOST_URL + "api/BookDetail/GetImageFromUrl?bookID=" + thisBookId + "&bookImageUri=" + data.bookImageUri,
                                    async: true,
                                    contentType: "application/json"
                                }).done(function (res) {
                                    if (res.success) {

                                        //lấy giá trị base64 string trả về
                                        var data = res.data;
                                        var bookImgBase64String = data.bookDetailImageUri;

                                        //kiểm tra string tồn tại
                                        //nếu string tồn tại
                                        if (bookImgBase64String) {
                                            $('#blah').attr('src', "data:image/jpg;base64," + bookImgBase64String)
                                        }
                                        //nếu string không tồn tại
                                        //đặt ảnh mặc định 
                                        else {
                                            $('#blah').attr('src', '../content/img/avatar-book-default.jpg')
                                        }

                                    } else {
                                        commonBaseJS.showToastMsgFailed(res.message);
                                    }
                                }).fail(function (res) {
                                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
                                })
                            }
                            //nếu đường dẫn ảnh là link online
                            else {
                                $('#blah').attr('src', data.bookImageUri);
                            }

                            //gán data cho $('#imageBook')
                            $('#blah').data('bookImageUri', data.bookImageUri);
                        }
                        // nếu đường dẫn ảnh không tồn tại hoặc là ""
                        //đặt ảnh mặc định
                        else {
                            $('#blah').attr('src', '../content/img/avatar-book-default.jpg');
                            //gán data cho $('#imageBook')
                            $('#blah').data('bookImageUri', '../content/img/avatar-book-default.jpg')
                        }
                    } else {
                        commonBaseJS.showToastMsgFailed("Không lấy được thông tin sách")
                    }
                }).fail(function (res) {
                    commonBaseJS.showToastMsgFailed("Không lấy được thông tin sách")
                })
            }
        }
    }

    initEvent() {
        newGuid = this.createGuid();

        $('.btn-discard').on('click', this.clearAll.bind(this));
        $('.saveDataBook').on('click', this.saveBookData.bind(this));
        $("#imgInp").on('change', this.readURL.bind(this));
        $("#bookPdf").on('change', this.readBase64Pdf.bind(this));
        $('.checkBookCode').on('blur', this.onblurBookCode.bind(this));
        $('.checkNumInput').on('blur', this.onblurNumberInput.bind(this));
        $('.checkRequire').on('blur', this.onblurCheckRequire.bind(this));
    }

    readBase64Pdf(event) {
        var input = event.currentTarget;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = {
                    BookID: newGuid,
                    BookDetailBase64String: e.target.result.split(",")[1]
                };

                if (BookManager.editMode == 2) {
                    data.BookID = BookManager.getRecordSelected()[0];
                }

                //call api
                $.ajax({
                    method: "POST",
                    url: "/api/BookDetail/SaveFileBookInfo",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).done(function (res) {
                    if (res.success) {
                        commonBaseJS.showToastMsgSuccess("Tải tài liệu lên thành công")
                    } else {
                        //show alert
                        commonBaseJS.showToastMsgFailed("Tải tài liệu lên thất bại")
                    }
                }).fail(function (res) {
                    //show alert
                    commonBaseJS.showToastMsgFailed("Tải tài liệu lên thất bại")
                })
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    readURL(event) {
        var input = event.currentTarget;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);

                var data = {
                    BookID: newGuid,
                    BookDetailImageUri: $("#blah").attr("src").split(",")[1]
                };

                if (BookManager.editMode == 2) {
                    data.BookID = BookManager.getRecordSelected()[0];
                }

                //call api
                $.ajax({
                    method: "POST",
                    url: "/api/BookDetail/SaveImageToUrl",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).done(function (res) {
                    if (res.success) {
                        commonBaseJS.showToastMsgSuccess("Tải ảnh lên thành công")
                    } else {
                        //show alert
                        commonBaseJS.showToastMsgFailed("Tải ảnh lên thất bại")
                    }
                }).fail(function (res) {
                    //show alert
                    commonBaseJS.showToastMsgFailed("Tải ảnh lên thất bại")
                })
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    saveBookData(event) {
        if (this.validateSave()) {
            var objectData = {
                BookId: newGuid,
                BookCode: $('#bookCode').val(),
                BookName: $('#bookName').val(),
                BookCategoryId: $('#bookCategory').val(),
                BookAuthor: $('#bookAuthor').val(),
                AmountPage: parseInt($('#bookPage').val()),
                YearOfPublication: parseInt($('#bookYear').val()),
                Description: $('#bookDescription').val(),
            }

            if (BookManager.editMode == 1) {
                $.ajax({
                    method: "POST",
                    url: "/api/BookDetail/InsertBookDetail",
                    async: true,
                    data: JSON.stringify(objectData),
                    contentType: "application/json"
                }).done(function (res) {
                    if (res.success) {
                        commonBaseJS.showToastMsgSuccess("Thêm mới sách thành công.")
                        $('.btn-discard').click();
                        $('.fade').hide();
                        BookManager.loadData();

                    } else {
                        commonBaseJS.showToastMsgFailed("Thêm sách thất bại")
                    }
                }).fail(function (res) {
                    commonBaseJS.showToastMsgFailed("Thêm sách thất bại")
                })
            }
            else {
                var thisBookId = BookManager.getRecordSelected()[0];

                objectData.BookId = thisBookId;
                objectData.BorrowTotal = 0;

                $.ajax({
                    method: "PUT",
                    url: "/api/BookDetail/UpdateBookDetail",
                    async: true,
                    data: JSON.stringify(objectData),
                    contentType: "application/json"
                }).done(function (res) {
                    if (res.success) {
                        commonBaseJS.showToastMsgSuccess("Cập nhật thông tin sách thành công.")
                        $('.btn-discard').click();
                        $('.fade').hide();
                        BookManager.loadData();

                    } else {
                        commonBaseJS.showToastMsgFailed("Cập nhật thông tin sách thất bại")
                    }
                }).fail(function (res) {
                    commonBaseJS.showToastMsgFailed("Cập nhật thông tin sách thất bại")
                })
            }
        }
    }

    validateSave() {
        let $modal = $('.modalBookDetail');
        $modal.find('.checkBookCode').blur();
        $modal.find('.checkNumInput').blur();
        $modal.find('.checkRequire').blur();
        let allAreValid = true;
        let $errors = $modal.find('.input-error'); // span thông báo lỗi
        $.each($errors, function (index, item) {
            if (item.innerText != '') {
                allAreValid = false;
            }
        });

        return allAreValid;
    }

    clearAll() {
        $('#bookCode').val('');
        $('#bookName').val('');
        $('#bookCategory').val('');
        $('#bookAuthor').val('');
        $("#blah").removeAttr("src");
        $('#bookPage').val('');
        $('#bookYear').val('');
        $('#bookDescription').val('');
        $('.modalBookDetail').find('.input-error').text('').hide();
    }

    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    onblurBookCode(event) {
        let me = $(event.target),
            $error = me.next();

        let validateObj = true;

        if (BookManager.editMode == 1) {
            validateObj = Validation.validateBookDetail('BookCode', me.val(), null, null);
        } else {
            validateObj = Validation.validateBookDetail('', me.val(), null, null);
        }
        if (!validateObj.idIsValid) {
            $error.show().text(validateObj.msg);
        }
        else {
            $error.text('').hide();
        }
    }

    onblurNumberInput(event) {
        let me = $(event.target),
            $error = me.next();

        let validateObj = Validation.validateBookDetail('NumberInput', parseInt(me.val()), parseInt(me.attr('min')), parseInt(me.attr('max')));
        if (!validateObj.idIsValid) {
            $error.show().text(validateObj.msg);
        }
        else {
            $error.text('').hide();
        }
    }

    onblurCheckRequire(event) {
        let me = $(event.target),
            $error = me.next();

        let validateObj = Validation.validateBookDetail('', me.val(), null, null);
        if (!validateObj.idIsValid) {
            $error.show().text(validateObj.msg);
        }
        else {
            $error.text('').hide();
        }
    }
}