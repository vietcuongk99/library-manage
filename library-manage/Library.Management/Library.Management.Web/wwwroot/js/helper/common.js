/** --------------------------------------
 * Đối tượng js chứa các hàm sử dụng chung
 * Author: dvcuong
 * ---------------------------------------*/
var commonJS = {

    getDateStringYYYYMMdd(date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var dateString = date.getFullYear() + "-" + (month) + "-" + (day);
        return dateString;
    },


    //append dữ liệu vào thẻ card
    //sử dụng trong trang index, search-result
    appendBookDataToCard(data, selector) {

        var row = $(`<div class="row"></div>`)
        data.forEach(book => {

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
        data.forEach(comment => {

            var commentHTML = $(`<div class="media mb-4">
                        <div class="media-body">
                            <h5 class="mt-0">` + comment.userName + `</h5>
                            ` + comment.commentContent + `
                        </div>
                    </div>`);

            commentHTML.data('commentId', comment.commentId)
            $('#commentContentDiv').append(commentHTML)
        })
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