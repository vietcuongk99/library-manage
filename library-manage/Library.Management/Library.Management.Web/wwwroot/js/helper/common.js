﻿/** --------------------------------------
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


    //append dữ liệu vào thẻ html
    //sử dụng trong trang index, search-result
    appendDataToHTML(data, selector) {

        var row = $(`<div class="row"></div>`)
        data.forEach(book => {

            var card = $(`<div class="col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100">
                    <a href="../page/book-detail.html" class="mx-auto"><img class="card-img-top" src="` + book.bookImageUri + `" alt="" style="width: 150px;"></a>
                    <div class="card-body">
                        <p class="card-title font-weight-bold text-truncate">` + book.bookName + `</p>
                        <p class="text-truncate">` + book.bookAuthor + `</p>
                    </div>
                </div>`)

            bookHTML.data('bookId', book.bookId)
            $(card).append(bookHTML)
            row.append(card)
        })

        $(selector).html(row)
    }
}