$(document).ready(function() {
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

            $(hotBookHTML).data('bookId', book.id)
            $(card).append(hotBookHTML)
            $('#hotBookRow').append(card)
        })

    }


    //gọi hàm xử lý tất cả các sự kiện trong trang index.html
    initEvent() {

        //xử lý sự kiện khi click vào 1 card sách
        $('#newBookRow').children('div').on('click', 'div.card.h-100', this.cardOnClick)
        $('#hotBookRow').children('div').on('click', 'div.card.h-100', this.cardOnClick)

    }


    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {

        let bookId = $(this).data('bookId')
        console.log(bookId)
        console.log(this)
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