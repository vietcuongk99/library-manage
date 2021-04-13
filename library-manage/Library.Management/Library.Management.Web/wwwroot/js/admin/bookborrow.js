var lstDataBookBorrow = [];

$(document).ready(function () {
    var bookborrow = new BookBorrow();
});

class BookBorrow {
    constructor() {
        this.loadFormData(0);
        //this.initEvents();
        this.appendRequestBookHTML(lstDataBookBorrow);
    }

    initEvents() {
        $('.tab-header').on('click', this.onChangeTabHeader.bind(this));

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

    onChangeTabHeader(even) {
        var self = this,
            curentEle = $(even.target).closest('li');

        if (!curentEle.attr('class').includes('active')) {
            var lastActive = $(curentEle).parent().find('.active');

            curentEle.addClass('active');
            lastActive.removeClass('active');

            var thistab = curentEle.attr('typetab');

            switch (thistab) {
                case 'bookRequest':
                    $('.container-request-book').show();
                    $('.container-borrow-book').hide();
                    this.loadFormData(0);
                    this.appendRequestBookHTML(lstDataBookBorrow);
                    break;
                case 'bookBorrowing':
                    $('.container-request-book').hide();
                    $('.container-borrow-book').show();
                    this.loadFormData(1);
                    this.appendBorrowBookHTML(lstDataBookBorrow, true);
                    break;
                case 'bookOutDate':
                    $('.container-request-book').hide();
                    $('.container-borrow-book').show();
                    this.loadFormData(1);
                    this.appendBorrowBookHTML(lstDataBookBorrow, false);
                    break;
            }
        }
    }

    loadFormData(type) {
        var self = this,
            url = (type == 0) ? "/api/BookBorrow/GetListRequestActivation" : "/api/BookBorrow/GetListBorrowBook";
        lstDataBookBorrow = [];

        $.ajax({
            method: "GET",
            url: url,
            async: false,
            contentType: "application/json"
        }).done(function (res) {
            if (res.success) {
                var data = res.data;

                if (data.length > 0) {
                    lstDataBookBorrow = data;
                }

            } else {
                commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công")
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công")
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
                self.loadFormData(0);
                self.appendRequestBookHTML(lstDataBookBorrow);
                commonBaseJS.showToastMsgSuccess(res.message);
            } else {
                if (res.libraryCode = 620) { //TH người dùng đã hủy bỏ yêu cầu mượn sách trước đó
                    commonBaseJS.showToastMsgInfomation(res.message);
                }
                else {
                    commonBaseJS.showToastMsgFailed("Xác nhận không thành công");
                }
            }
        }).fail(function (res) {
            commonBaseJS.showToastMsgFailed("Xác nhận không thành công");
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
                                        <h3>Tài khoản <i>${request.userName}</i> gửi yêu cầu mượn cuốn sách <i>${request.bookName}</i></h3>
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
        this.initEvents();
        $('span.request').text(lstDataBookBorrow.length);
    }

    appendBorrowBookHTML(data, type) {
        var subData = [],
            nowDate = new Date();
        $('.container-borrow-book').empty();
        
        if (type) {
            subData = data.filter(function (x) {
                return new Date(x.returnDate) > nowDate
            });
        }
        else {
            subData = data.filter(function (x) {
                return new Date(x.returnDate) < nowDate
            });
        }
        
        $.each(subData, function (index, request) {
            //var dateDiff = Math.floor((new Date(request.returnDate) - nowDate) / (1000 * 60 * 60 * 24))
            var dateDiff = Math.ceil((new Date(request.returnDate) - nowDate) / (1000 * 60 * 60 * 24)),
                classWarning = (dateDiff >= 0) ? ((dateDiff > 2) ? 'alert-success' : 'alert-warning') : 'alert-danger';

            var elementHTML = `<div class="item-book-borrow" borrowID="${request.bookBorrowID}">
                                <div class="avt-item-circle">
                                    <img src="data:image/jpg;base64,${request.avatarUrl}" class="img-circle" />
                                </div>
                                <div class="content-item">
                                    <div class="title-notify">
                                        <h3>Tài khoản <i>${request.userName}</i> đang mượn cuốn sách <i>${request.bookName}</i></h3>
                                    </div>
                                    <div class="content-notify">
                                        <h5>mượn sách ngày ${commonJS.getDateTimeString(request.createdDate)}</h5>
                                    </div>
                                </div>
                                <div class="time-alert">
                                    <div class="alert ${classWarning}" role="alert">
                                        ${dateDiff < 0 ? `Quá hạn trả sách ${Math.abs(dateDiff)} ngày` : `Thời hạn còn ${dateDiff} ngày`}
                                    </div>
                                </div>
                            </div>`

            $('.container-borrow-book').append($(elementHTML))
        });
        this.initEvents();
    }
}