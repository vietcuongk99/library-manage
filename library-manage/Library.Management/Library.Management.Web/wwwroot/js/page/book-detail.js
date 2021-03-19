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

        //lấy ra bookId trong localStorage
        var bookId = localStorage.getItem("bookId");
        //call api lấy thông tin sách
        $.ajax({
            method: "GET",
            url: host + "api/BookDetail/" + bookId,
            async: true,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {

                var data = res.data

                $('#bookTitle').text(data.bookName)
                $('#imageBook').attr('src', data.bookImageUri)
                $('#bookName').text(data.bookName)
                $('#bookAuthor').text(data.bookAuthor)
                $('#bookAmountPage').text(data.amountPage)
                $('#yearPublication').text(data.yearOfPublication)
                $('#bookDescription').text(data.description)

                $.ajax({
                    method: "GET",
                    url: host + "api/BookCategory/" + data.bookCategoryId,
                    async: true,
                    contentType: "application/json"
                }).done(function(res) {
                    if (res.success) {

                        var data = res.data
                        $('#bookCategoryName').text(data.bookCategoryName);
                    } else {

                        console.log("ID không tồn tại. Lấy dữ liệu thất bại")
                    }
                }).fail(function(res) {
                    console.log("Lấy dữ liệu không thành công")
                })

            } else {

                console.log("ID không tồn tại. Lấy dữ liệu thất bại")
            }
        }).fail(function(res) {
            console.log("Lấy dữ liệu không thành công")
        })

        //call api lấy thông tin sách


    }

    initEvent() {

    }


}

//fake data