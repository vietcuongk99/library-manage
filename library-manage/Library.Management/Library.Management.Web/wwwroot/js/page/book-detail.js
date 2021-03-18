const host = "https://localhost:44328/"
$(document).ready(function() {
    bookDetailJS = new BookDetailJS()
})


//class quản lý các sự kiện trong trang book-detail.html
class BookDetailJS extends BaseJS {
    constructor() {
        super();
        this.loadBookData();
        this.initEvent();

    }

    ///load dữ liệu
    loadBookData() {

        var bookId = localStorage.getItem("bookId");
        var data = {};
        //call api
        $.ajax({
            method: "GET",
            url: host + "api/BookDetail/" + bookId,
            async: true,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {

                data = res.data

                $('#bookTitle').text(data.bookName)
                $('#imageBook').attr('src', data.bookImageUri)
                $('#bookName').text(data.bookName)
                $('#bookAuthor').text(data.bookAuthor)
                $('#bookAmountPage').text(data.amountPage)
                $('#bookCategoryName').text(data.bookName)
                $('#yearPublication').text(data.yearOfPublication)
                $('#bookDescription').text(data.description)

            } else {

                console.log("ID không tồn tại. Lấy dữ liệu thất bại")
            }
        }).fail(function(res) {
            console.log("Lấy dữ liệu không thành công")
        })

    }

    initEvent() {

    }


}

//fake data