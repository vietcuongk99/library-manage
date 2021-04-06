﻿/** --------------------------------------
 * Đối tượng js chứa các hàm sử dụng chung
 * Author: dvcuong
 * ---------------------------------------*/

var commonJS = {

    //fix timezone
    //convert từ date sang kiểu datetime (sql)
    fromDateToString(date) {
        date = new Date(+date);
        date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
        let dateAsString = date.toISOString().substr(0, 19);
        return dateAsString;
    },

    //thêm ngày cho thời gian hiện tại
    addDayToDate(date, day) {

        if (day > 0) {
            date.setDate(date.getDate() + day);
        } else {
            date.setDate(date.getDate);
        }
        return new Date(date);

    },

    //convert từ date sang string chứa ngày-tháng-năm
    getDateString(date, option) {
        // slice(-2) chọn hai phần tử cuối cùng của mảng.
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);

        switch (option) {
            case Enum.ConvertOption.YEAR_FIRST:
                var dateString = date.getFullYear() + "-" + (month) + "-" + (day);
                break;
            case Enum.ConvertOption.DAY_FIRST:
                var dateString = (day) + "-" + (month) + "-" + date.getFullYear();
                break;
        }

        return dateString;
    },

    //convert từ date sang string chứa ngày-tháng-năm và giờ-phút
    getDateTimeString(date) {
        //convert datetime
        var timeComment = new Date(date);
        var timeMinutes = ("0" + timeComment.getMinutes()).slice(-2);
        var timeCommentConvert = timeComment.getUTCDate() + "/" +
            (timeComment.getMonth() + 1) + "/" +
            timeComment.getUTCFullYear() +
            " lúc " + timeComment.getHours() + ":" + timeMinutes;

        return timeCommentConvert
    },


    //append dữ liệu vào thẻ card
    //sử dụng trong trang search-result
    appendBookDataToCard(data, selector) {

        var row = $(`<div class="row mt-2"></div>`)
        data.forEach(book => {

            var bookImgBase64String = "data:image/jpg;base64," + book.bookImageUriBase64String;
            var card = $(`<div class="col-6 col-md-6 col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100">
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
    },

    //append dữ liệu sách đang mượn vào thẻ card
    //sử dụng trong trang account
    appendBorrowDataToCard(data, selector) {
        //lấy ra ngày hiện tại
        var dateNow = commonJS.getDateString(new Date(), Enum.ConvertOption.YEAR_FIRST);
        var row = $(`<div class="row mt-2"></div>`)
        data.forEach(book => {
            // var checkDateHTML = (book.returnDate >= dateNow) ?
            //     `<div class="text-success text-center">Còn hạn</div>` :
            //     `<div class="text-danger text-center">Quá hạn</div>`
            var bookImgBase64String = "data:image/jpg;base64," + book.bookImageUriBase64String;
            var card = $(`<div class="col-6 col-md-4 col-sm-4 col-xl-4 col-lg-4 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100">
                    <img class="card-img-top w-100 pt-1 px-1 mx-auto" src="` + bookImgBase64String + `" alt="" style="height: 22rem">
                    <div class="card-body">
                        <p class="card-title text-truncate text-uppercase text-center">` + book.bookName + `</b>
                        <p class="text-truncate text-center">` + book.bookAuthor + `</p>
                    </div>
                </div>`)
                // ` + checkDateHTML + `

            bookHTML.data('bookId', book.bookID)
            $(card).append(bookHTML)
            row.append(card)
        })
        $(selector).html(row)
    },

    //append dữ liệu comment
    //sử dụng trong trang book-detail
    appendCommentData(data) {
        var commentGroupDiv = $(`<div></div>`);

        data.forEach(comment => {
            //convert datetime
            var timeComment = this.getDateTimeString(comment.createdDate);

            var commentHTML = $(`<div class="media mb-4">
                                    <img class="d-flex mr-3 rounded-circle avatar-comment" src="../content/img/avatar-sample.png" alt="">
                                    <div class="media-body">
                                        <h5 class="mt-0">` + comment.userName + `</h5>
                                        ` + comment.comment + `<br><small class="mt-1">` + timeComment + `</small>
                                    </div>
                                <div>`);

            commentHTML.data('commentId', comment.commentId)
            commentGroupDiv.append(commentHTML);
        })
        $('#commentContentDiv').html(commentGroupDiv);
    },


    //gán sự kiện khi ấn nút enter
    addEnterEvent(action) {
        var enterClicked = false

        $(document).on("keyup", function(event) {
            if (event.keyCode == 13) {

                //alert("Enter clicked");
                enterClicked = true
                event.preventDefault()
                action()
            }

        });
    },

    //lấy giá trị param trên url
    getURLParameter(sParam) {

        var sPageURL = window.location.search.substring(1);

        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                //decodeUriComponent giúp giải mã chuỗi có kí tự đặc biệt, ví dụ "%20" -> " "
                return decodeURIComponent(sParameterName[1]);
            }
        }
    },

    //lấy số sách đang mượn hiện tại của người dùng
    getBorrowListSize() {
        //lấy ra danh sách mượn của user trong localStorage
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
        //lấy ra số lượng sách đang mượn
        return borrowList.length;
    },

    //kiểm tra sách hiện tại có đang mượn hay không
    checkValidBookBorrow(bookId) {

        //khai báo kết quả trả về
        var result = true;
        //lấy ra danh sách mượn của user trong localStorage
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");

        if (borrowList.length > 0) {
            //kiểm tra id sách hiện tại trong danh sách mượn
            for (let index = 0; index < borrowList.length; index++) {
                if (bookId == borrowList[index].bookID) {
                    result = true;
                    break
                } else {
                    result = false;
                }
            }
        } else {
            result = false;
        }



        return result;

    },

    //lưu danh sách mượn của người dùng vào localStorage
    saveBorrowListToLocal(bookBorrowList, data) {
        data.forEach(item => {
            debugger
            var borrowItem = {};
            borrowItem.bookBorrowID = item.bookBorrowID;
            borrowItem.bookID = item.bookID;
            borrowItem.borrowDate = commonJS.getDateString(new Date(item.borrowDate), Enum.ConvertOption.YEAR_FIRST);
            borrowItem.returnDate = commonJS.getDateString(new Date(item.returnDate), Enum.ConvertOption.YEAR_FIRST);
            borrowItem.status = item.bookBorrowStatus;
            bookBorrowList.push(borrowItem)
        });

        //lưu borrowList vào local storage
        localStorage.setItem("borrowList", JSON.stringify(bookBorrowList));
    }
}