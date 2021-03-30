/** --------------------------------------
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
        debugger
        var timeMinutes = ("0" + timeComment.getMinutes()).slice(-2);
        var timeCommentConvert = timeComment.getUTCDate() + "/" +
            (timeComment.getMonth() + 1) + "/" +
            timeComment.getUTCFullYear() +
            " lúc " + timeComment.getHours() + ":" + timeMinutes;

        return timeCommentConvert
    },


    //append dữ liệu vào thẻ card
    //sử dụng trong trang index, search-result, account
    appendBookDataToCard(data, selector) {

        var row = $(`<div class="row mt-2"></div>`)
        data.forEach(book => {

            if (book.bookImageUri.includes("~Temp") || book.bookImageUri.trim().length == 0) {
                book.bookImageUri = "../content/img/avatar-book-default.jpg"
            }
            var card = $(`<div class="col-md-6 col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100">
                    <a href="../page/book-detail.html" class="mx-auto"><img class="card-img-top" src="` + book.bookImageUri + `" alt="" style="width: 150px; height: 200px"></a>
                    <div class="card-body">
                        <p class="card-title text-truncate text-uppercase">` + book.bookName + `</b>
                        <p class="text-truncate">` + book.bookAuthor + `</p>
                    </div>
                </div>`)

            bookHTML.data('bookId', book.bookId)
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
    }
}