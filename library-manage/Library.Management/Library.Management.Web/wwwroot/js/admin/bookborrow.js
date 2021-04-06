var lstDataBookBorrow = [];

$(document).ready(function () {
    var bookborrow = new BookBorrow();
});

class BookBorrow {
    constructor() {
        this.loadFormData();
        this.initEvents();
    }

    initEvents() {
        $('.img-circle').hover(function (e) {
            $('div#pop-up').show();
            var curentUser = $(e.target),
                borrowId = curentUser.parent().parent().attr('borrowID'),
                horverUser = lstDataBookBorrow.find(x => x.bookBorrowID == borrowId);
            
            $('#pop-up > .avt-item-circle >.img-circle').attr('src', curentUser.attr('src'));
            $('#pop-up > .avt-item-circle >.user-inf').text(horverUser.userName);
            $('#pop-up > .info-user >.userFullName').html(`<strong>Họ tên: </strong>${horverUser.firstName} ${horverUser.lastName}`)
            $('#pop-up > .info-user >.userAge').html(`<strong>Tuổi: </strong>${horverUser.age}`)
            $('#pop-up > .info-user >.userEmail').html(`<strong>Email: </strong>${horverUser.email}`)
            $('#pop-up > .info-user >.userAddress').html(`<strong>Địa chỉ: </strong>${horverUser.createdBy}`)

        }, function () {
            $('div#pop-up').hide();
        });

        $('.img-circle').mousemove(function (e) {
            $("div#pop-up").css('top', e.pageY - 80).css('left', e.pageX - 180);
        });

        $('.btn-action').on('click', this.confirmRequestBorrow.bind(this));
    }

    loadFormData() {
        var self = this;
        $.ajax({
            method: "GET",
            url: "/api/BookBorrow/GetListRequestActivation",
            async: true,
            contentType: "application/json"
        }).done(function (res) {
            if (res.success) {
                var data = res.data;

                if (data.length > 0) {
                    $('span.request').text(data.length);
                    lstDataBookBorrow = data;
                    self.appendRequestBookHTML(data);
                    self.initEvents();
                }

            } else {
                commonBaseJS.showToastMsgFailed("Load danh sách sách thất bại")
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Load danh sách thất bại")
        })
    }

    confirmRequestBorrow(event) {
        var self = this,
            curent = $(event.target),
            statusAccept = curent.attr('class').includes('btn-cancel') ? 0 : 1;

        var listID = [];
        listID.push(curent.parent().parent().attr('borrowID'));

        $.ajax({
            method: "POST",
            url: "/api/BookBorrow/ConfirmBorrowActivation?statusActivate=" + statusAccept,
            data: JSON.stringify(listID),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
        }).done(function (res) {
            if (res.success) {
                self.loadFormData();
                commonBaseJS.showToastMsgSuccess("Xác nhận thành công.");
            } else {
                commonBaseJS.showToastMsgFailed("Xác nhận không thành công")
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Xác nhận không thành công")
        })
    }

    appendRequestBookHTML(data) {
        $('.container-request-book').empty();

        $.each(data, function (index, request) {
            var elementHTML = `<div class="item-book-borrow" borrowID="${request.bookBorrowID}">
                                <div class="avt-item-circle">
                                    <img src="data:image/jpg;base64,${request.avatarUrl}" class="img-circle" />
                                </div>
                                <div class="content-item">
                                    <div class="title-notify">
                                        <h3><b>${request.userName} </b>yêu cầu mượn cuốn sách ${request.bookName}</h3>
                                    </div>
                                    <div class="content-notify">
                                        <h5>vào ${commonJS.getDateTimeString(request.createdDate)}</h5>
                                    </div>
                                </div>
                                <div class="actions-item">
                                    <button type="button" class="btn btn-danger btn-action btn-cancel">Hủy bỏ</button>
                                </div>
                                <div class="actions-item">
                                    <button type="button" class="btn btn-primary btn-action btn-confirm">Xác nhận</button>
                                </div>
                            </div>`

            $('.container-request-book').append($(elementHTML))
        });
    }
}