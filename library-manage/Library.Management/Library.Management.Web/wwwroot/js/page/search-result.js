$(document).ready(function() {
    searchResultJS = new SearchResultJS()
})


//class quản lý các sự kiện trong trang search-result.html
class SearchResultJS extends BaseJS {
    constructor() {
        super();
        this.loadData();

    }


    ///load dữ liệu
    loadData() {

        //khai báo và gán giá trị trong localStorage
        var fieldValue = localStorage.getItem("fieldValue")
        var searchContent = localStorage.getItem("searchContent");
        var showNewBook = localStorage.getItem("showNewBook")
        var showHotBook = localStorage.getItem("showHotBook");
        var fieldHTML

        //load dữ liệu các thành phần HTML
        //dữ liệu thay đổi phụ thuộc event trên trang index
        //nếu user tìm kiếm theo một trường xác định
        if (fieldValue && searchContent) {
            fieldHTML = $(`<li class="breadcrumb-item">` + fieldValue + `</li><li class="breadcrumb-item">` + searchContent + `</li>`)
            $('#breadcrumbDiv').append(fieldHTML)
        } else {
            //nếu user ấn button 'xem thêm' sách hot
            if (showHotBook) {
                fieldHTML = $(`<li class="breadcrumb-item">Sách HOT</li>`)
                $('#breadcrumbDiv').append(fieldHTML)
            }

            //nếu user ấn button 'xem thêm' sách mới
            if (showNewBook) {
                fieldHTML = $(`<li class="breadcrumb-item">Sách Mới</li>`)
                $('#breadcrumbDiv').append(fieldHTML)
            }
        }


        //load kết quả tìm kiếm
        var data = searchResult;
        data.forEach(book => {

            var card = $(`<div class="col-lg-3 col-sm-6 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100">
                    <a href="../page/book-detail.html" class="mx-auto"><img class="card-img-top" src="` + book.url + `" alt="" style="width: 150px;"></a>
                    <div class="card-body">
                        <p class="card-title font-weight-bold text-truncate">` + book.bookTitle + `</p>
                        <p class="text-truncate">` + book.bookAuthor + `</p>
                    </div>
                </div>`)

            bookHTML.data('bookId', book.id)
            $(card).append(bookHTML)
            $('#searchResultDiv').append(card)
        });

    }


}

//fake data
var searchResult = [{
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
    },
    {
        id: 5,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 6,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 7,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 8,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 9,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    },
    {
        id: 10,
        url: "../content/img/clean-code.jpg",
        bookTitle: "Clean Code",
        bookAuthor: "Robert C.Martin"
    }
]