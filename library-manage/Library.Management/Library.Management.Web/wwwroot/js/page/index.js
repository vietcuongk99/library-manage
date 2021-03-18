$(document).ready(function() {
    //xóa thông tin tìm kiếm cũ trong localStorage
    localStorage.removeItem("fieldValue")
    localStorage.removeItem("searchContent")
    localStorage.removeItem("showHotBook")
    localStorage.removeItem("showNewBook")

    indexJS = new IndexJS()
})


//class quản lý các sự kiện trong trang index.html
class IndexJS extends BaseJS {
    constructor() {
        super();
        this.loadBookData();
        this.initEvent();

    }


    ///load dữ liệu
    loadBookData() {

        var data = newBookList;
        var data2 = hotBookList;

        //load dữ liệu Sách Mới
        data.forEach(book => {

            var card = $(`<div class="col-lg-3 col-sm-6 portfolio-item">
                            </div>`)

            var newBookHTML = $(`
            <div class="card h-100">                
            <img class="mx-auto card-img-top" src="` + book.url + `" alt="" style="width: 150px;"></a>
            <div class="card-body">
                <p class="card-title font-weight-bold text-truncate">` + book.bookTitle + `</p>
                <p class="text-truncate">` + book.bookAuthor + `</p>
            </div></div>`)

            $(newBookHTML).data('bookId', book.id)
            $(card).append(newBookHTML)

            $('#newBookRow').append(card)
        })

        //load dữ liệu Sách HOT
        data2.forEach(book => {
            var card = $(`<div class="col-lg-3 col-sm-6 portfolio-item">
                            </div>`)

            var hotBookHTML = $(`
            <div class="card h-100">                
            <img class="mx-auto card-img-top" src="` + book.url + `" alt="" style="width: 150px;"></a>
            <div class="card-body">
                <p class="card-title font-weight-bold text-truncate">` + book.bookTitle + `</p>
                <p class="text-truncate">` + book.bookAuthor + `</p>
            </div></div>`)

            hotBookHTML.data('bookId', book.id)
            $(card).append(hotBookHTML)
            $('#hotBookRow').append(card)
        })

    }


    //gọi hàm xử lý tất cả các sự kiện trong trang index.html
    initEvent() {

        //gán xử lý sự kiện khi click nút Tìm kiếm
        $('#searchBtn').on('click', this.searchEvent.bind(this));
        //gán xử lý sự kiện khi click nút Xem thêm Sách HOT
        $('#showHotBookBtn').on('click', this.getAllHotBookEvent.bind(this));
        //gán xử lý sự kiện khi click nút Xem thêm Sách Mới
        $('#showNewBookBtn').on('click', this.getAllNewBookEvent.bind(this));
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#newBookRow').children('div').on('click', 'div.card.h-100', this.cardOnClick)
        $('#hotBookRow').children('div').on('click', 'div.card.h-100', this.cardOnClick)

    }




    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {

        let bookId = $(this).data('bookId')
        console.log(bookId)
        console.log(this)
    }

    //chi tiết xử lý sự kiện khi click nút xem thêm SÁCH HOT
    getAllHotBookEvent() {
        localStorage.setItem("showHotBook", true)
        window.open("search-result.html", "_self")
    }


    //chi tiết xử lý sự kiện khi click nút xem thêm SÁCH HOT
    getAllNewBookEvent() {
        localStorage.setItem("showNewBook", true)
        window.open("search-result.html", "_self")
    }

    //chi tiết xử lý sự kiện khi click vào nút Tìm kiếm
    searchEvent() {

        //lấy thông tin tìm kiếm hiện tại
        var fieldValue = $('#searchSelectGroup').val()
        var fieldHTML = $('#searchSelectGroup option:selected').text()
        var searchContent = $('#searchInput').val().trim()

        if (!searchContent) {
            alert("Hiển thị tất cả đầu sách có trong cơ sở dữ liệu")
            window.open("search-result.html", "_self")
        } else {

            //lưu thông tin tìm kiếm vào localStorage
            //hiển thị tại trang search-result.html
            localStorage.setItem("fieldValue", fieldHTML)
            localStorage.setItem("searchContent", searchContent)
            window.open("search-result.html", "_self")
        }

    }


}

//fake data
var newBookList = [{
        id: 1,
        url: "../content/img/clean-code.jpg",
        bookTitle: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 2,
        url: "../content/img/clean-code.jpg",
        bookTitle: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 3,
        url: "../content/img/clean-code.jpg",
        bookTitle: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 4,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    }
]


var hotBookList = [{
        id: 1,
        url: "../content/img/clean-code.jpg",
        bookTitle: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 2,
        url: "../content/img/clean-code.jpg",
        bookTitle: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 3,
        url: "../content/img/clean-code.jpg",
        bookTitle: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 4,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    }
]