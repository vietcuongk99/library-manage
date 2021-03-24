var newGuid = '';

$(document).ready(function () {
    bookDetailJS = new BookDetailJS()
})

class BookDetailJS {
    constructor() {
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
                    });
                }

            } else {
                commonBaseJS.showToastMsgFailed("Load thể loại sách thất bại")
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Load thể loại sách thất bại")
        })
    }

    initEvent() {
        newGuid = this.createGuid();

        $('.btn-discard').on('click', this.clearAll.bind(this));
        $('.saveDataBook').on('click', this.saveBookData.bind(this));
        $("#imgInp").on('change', this.readURL.bind(this));
        $('.checkBookCode').on('blur', this.onblurBookCode.bind(this));
        $('.checkNumInput').on('blur', this.onblurNumberInput.bind(this));
        $('.checkRequire').on('blur', this.onblurCheckRequire.bind(this));
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
                BookDownloadUri: $('#bookDownLink').val(),
                BookAuthor: $('#bookAuthor').val(),
                AmountPage: parseInt($('#bookPage').val()),
                YearOfPublication: parseInt($('#bookYear').val()),
                Description: $('#bookDescription').val(),
            }

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

                } else {
                    commonBaseJS.showToastMsgFailed("Thêm sách thất bại")
                }
            }).fail(function (res) {
                commonBaseJS.showToastMsgFailed("Thêm sách thất bại")
            })
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
        $('#bookDownLink').val('');
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

        let validateObj = Validation.validateBookDetail('BookCode', me.val(), null, null);
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