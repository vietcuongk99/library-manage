$(document).ready(function() {
    searchResultJS = new SearchResultJS()
})


//class quản lý các sự kiện trong trang search-result.html
class SearchResultJS extends BaseJS {
    constructor() {
        super();
        this.loadData();
        this.initEvent();

    }

    //gán sự kiện trong trang search-result.html
    initEvent() {
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#searchResultDiv').on('click', '.card.h-100', this.cardOnClick)

    }

    ///load dữ liệu
    loadData() {

        //khai báo và gán giá trị trong localStorage
        var fieldValue = localStorage.getItem("fieldValue")
        var fieldText = localStorage.getItem("fieldText")
        var searchValue = localStorage.getItem("searchValue");
        var showNewBook = localStorage.getItem("showNewBook")
        var showHotBook = localStorage.getItem("showHotBook");
        var showAllBook = localStorage.getItem("showAllBook");

        //load dữ liệu các thành phần HTML
        //dữ liệu thay đổi phụ thuộc event trên trang index
        //nếu user ấn button 'xem thêm' sách hot trên trang index
        if (showHotBook) {

            //load dữ liệu
            var fieldHTML = $(`<li class="breadcrumb-item">Sách HOT</li>`)
            $('#breadcrumbDiv').append(fieldHTML)
            commonJS.appendBookDataToCard(fakeData, "#searchResultDiv")
            paginationHTML.insertBefore('footer')


        }

        //nếu user ấn button 'xem thêm' sách mới trên trang index
        if (showNewBook) {

            //load dữ liệu
            var fieldHTML = $(`<li class="breadcrumb-item">Sách Mới</li>`)
            $('#breadcrumbDiv').append(fieldHTML)
            commonJS.appendBookDataToCard(fakeData, "#searchResultDiv")
            paginationHTML.insertBefore('footer')
        }

        //nếu user ấn nút tìm kiếm trên trang index
        //chưa có dữ liệu tìm kiếm
        if (showAllBook) {
            //lấy ra tất cả đầu sách trong csdl
            $.ajax({
                method: "GET",
                url: host + "api/BookDetail/",
                async: true,
                contentType: "application/json",
                beforeSend: function() {
                    $('#searchResultDiv').html(`<div class="loader mx-auto mb-5"></div>`);
                    $('footer').addClass("fixed-bottom")
                }
            }).done(function(res) {
                if (res.success) {

                    //load kết quả tìm kiếm
                    $(`<div class="loader mx-auto my-auto"></div>`).remove()

                    //thay đổi giao diện
                    $('footer').removeClass("fixed-bottom")
                    var data = res.data.lstData
                    commonJS.appendBookDataToCard(data, "#searchResultDiv")
                    paginationHTML.insertBefore('footer')

                } else {

                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
            })
        }

        //nếu user ấn nút tìm kiếm trên trang index
        //đã có dữ liệu tìm kiếm
        if (searchValue && fieldValue) {

            var fieldHTML = $(`<li class="breadcrumb-item">` + fieldText + `</li><li class="breadcrumb-item">` + searchValue.trim() + `</li>`)
            $('#breadcrumbDiv').append(fieldHTML)
        }


    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {

        let bookId = $(this).data('bookId')
        console.log(bookId)
        console.log(this)
        localStorage.setItem("bookId", bookId)
        window.open("book-detail.html", "_self")
    }

}

var paginationHTML = $(`<ul class="pagination justify-content-center">
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#">2</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#">3</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
        `)

//fake data
var fakeData = [{
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        bookImageUri: "../content/img/clean-code.jpg",
        bookName: "CLEAN CODE: A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP",
        bookAuthor: "Robert C.Martin"
    }
]