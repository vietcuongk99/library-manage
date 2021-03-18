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
        var data = searchResult;
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