//khai báo hằng số lưu số lượng sách được mượn tối đa
const MAX_BORROW_NUMBER = 6;

$(document).ready(function() {
    bookDetailJS = new BookDetailJS()
})


//class quản lý các sự kiện trong trang book-detail.html
class BookDetailJS extends BaseJS {
    constructor() {
        super();
        this.loadBookActionButton();
        this.loadBookData();
        this.loadBookComment();
        this.initEvent();

    }

    ///load thông tin sách
    loadBookData() {

        //lấy ra bookId trong localStorage
        var bookId = localStorage.getItem("bookId");
        //call api lấy thông tin sách
        $.ajax({
            method: "GET",
            url: HOST_URL + "api/BookDetail/" + bookId,
            async: true,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {

                var data = res.data;

                //gán thông tin sách
                $('#bookTitle').text(data.bookName)
                $('#bookName').text(data.bookName)
                $('#bookAuthor').text(data.bookAuthor)
                $('#bookAmountPage').text(data.amountPage)
                $('#yearPublication').text(data.yearOfPublication)
                $('#bookDescription').text(data.description)

                //load ảnh bìa sách
                //kiểm tra nếu đường dẫn ảnh tồn tại và không phải ""
                if (data.bookImageUri && (data.bookImageUri).trim().length > 0) {
                    //nếu đường dẫn ảnh nằm trong thư mục Temp của project
                    //gọi loadBookImg() của bookDetailJS object lấy ra base64 string
                    if (data.bookImageUri.includes("~Temp")) {
                        bookDetailJS.loadBookImg(data.bookImageUri)
                    }
                    //nếu đường dẫn ảnh là link online
                    else {
                        $('#imageBook').attr('src', data.bookImageUri)
                    }
                }
                // nếu đường dẫn ảnh không tồn tại hoặc là ""
                //đặt ảnh mặc định
                else {
                    $('#imageBook').attr('src', '../content/img/avatar-book-default.jpg')
                }

                //call api lấy thông tin thể loại sách
                $.ajax({
                    method: "GET",
                    url: HOST_URL + "api/BookCategory/" + data.bookCategoryId,
                    async: true,
                    contentType: "application/json"
                }).done(function(res) {
                    if (res.success) {
                        var data = res.data;
                        //gán giá trị
                        $('#bookCategoryName').text(data.bookCategoryName);
                    } else {
                        $('#bookCategoryName').text("Chưa có");
                        commonBaseJS.showToastMsgFailed(res.message);
                    }
                }).fail(function(res) {
                    $('#bookCategoryName').text(data.bookCategoryName);
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu loại sách không thành công.");
                })

            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })


    }

    initEvent() {

        //gán sự kiện cho nút Gửi bình luận
        $('#submitCommentBtn').on('click', this.sendComment.bind(this));

        if ($('#confirmBorrowBtn')) {
            //gán sự kiện cho nút Xác nhận (modal mượn sách)
            $('#confirmBorrowBtn').on('click', this.borrowBookEvent.bind(this))
        }

        if ($('#confirmReturnBtn')) {
            //gán sự kiện cho nút Xác nhận (modal mượn sách)
            $('#confirmReturnBtn').on('click', this.returnBookEvent.bind(this))
        }

    }

    //load ảnh bìa sách
    loadBookImg(bookImgUrl) {

        //call api lấy ảnh bìa sách (base64 string)
        $.ajax({
            method: "GET",
            url: HOST_URL + "api/BookDetail/GetImageFromUrl",
            async: true,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {

                //lấy giá trị base64 string trả về
                var data = res.data;
                var bookImgBase64String = data.bookDetailImageUri;

                //kiểm tra string tồn tại
                //nếu string tồn tại
                if (bookImgBase64String) {
                    $('#imageBook').attr('src', "data:image/jpg;base64," + bookImgBase64String)
                }
                //nếu string không tồn tại
                //đặt ảnh mặc định 
                else {
                    $('#imageBook').attr('src', '../content/img/avatar-book-default.jpg')
                }

            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    //load nội dung bình luận
    //chưa có api
    loadBookComment() {

        //lấy ra id book hiện tại từ local storage
        var bookId = localStorage.getItem("bookId");
        if (bookId) {
            //call api
            $.ajax({
                method: "GET",
                url: HOST_URL + "api/UserComment/GetCommentByBookDetail" + "?BookId=" + bookId,
                contentType: "application/json"
            }).done(function(res) {

                //lấy res từ api
                if (res.success) {
                    var data = res.data;
                    //gọi hàm loadBookComment của commonJS object
                    commonJS.appendCommentData(data);

                } else {
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showToastMsgFailed("Lấy dữ liệu bình luận không thành công.");
            })
        }
    }

    //validate nội dung comment của người dùng
    validateCommentInput() {
        //khai báo kết quả trả về
        var result = true;
        //lấy nội dung comment của người dùng
        var commentContent = $('#commentInput').val().trim();

        //giá trị validate của comment
        //comment chứa ít nhất 1 kí tự
        var commentValidate = function(comment) {
            return comment.length > 0;
        }(commentContent)

        //nếu comment chưa validate
        if (!commentValidate) {
            //khai báo thành phần html
            var alertDiv = $(`<p class="text-danger my-auto ml-4">Bạn cần nhập nội dung bình luận.</p>`)
            if ($('#submitCommentBtn').next()) {
                $('#submitCommentBtn').next().remove()
            }
            $('#submitDiv').append(alertDiv);
            //gán result = false
            result = false
        } else {
            if ($('#submitCommentBtn').next()) {
                $('#submitCommentBtn').next().remove()
            }
        }

        return result;
    }

    //thêm nội dung bình luận
    sendComment() {


        //lấy thông tin user hiện tại
        var userObject = JSON.parse(localStorage.getItem("user"));

        //nếu user là khách (user = null)
        if (!userObject) {
            commonBaseJS.showToastMsgFailed("Bạn cần đăng nhập để có thể gửi bình luận.");

        } else {
            //lấy ra userId và bookId trong localStorage
            var bookId = localStorage.getItem("bookId");
            var userID = userObject.userID;

            //lấy giá trị validate comment
            var validateCommentRes = bookDetailJS.validateCommentInput();
            //nếu nội dung comment được validate
            if (validateCommentRes) {

                //lấy ra comment của người dùng
                var commentContent = $('#commentInput').val().trim();

                //khai báo data
                var data = {
                    userId: userID,
                    bookId: bookId,
                    comment: commentContent
                };
                //call api
                $.ajax({
                    method: "POST",
                    url: HOST_URL + "api/UserComment/CommentBookDetailActivation",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).done(function(res) {
                    if (res.success) {
                        //reset nội dung comment
                        $('#commentInput').val("");
                        //show alert
                        commonBaseJS.showToastMsgSuccess(res.message);
                        //gọi hàm loadBookComment cập nhật nội dung mới nhất
                        bookDetailJS.loadBookComment();
                    } else {
                        commonBaseJS.showToastMsgFailed(res.message);
                    }
                }).fail(function(res) {
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
                })
            }

        }

    }

    //thay đổi giao diện ui nút mượn, trả, gia hạn, tải tài liệu với từng trang thông tin sách
    loadBookActionButton() {

        var userData = JSON.parse(localStorage.getItem("user"));
        //nếu user là khách, không có tài khoản
        //không hiển thị button mượn, trả, gia hạn, tải tài liệu
        if (!userData) {
            $('#groupBookAction').children().remove();
        }
        //nếu user có tài khoản
        else {
            //lấy ra userId và bookId trong localStorage
            var bookId = localStorage.getItem("bookId");

            //lấy ra danh sách mượn của user trong localStorage
            var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
            //lấy ra số lượng sách đang mượn
            var borrowListSize = borrowList.length;

            //khai báo các thành phần html cho từng action với sách
            //button mượn sách, trả sách, gia hạn thời gian mượn, mở tài liệu
            var borrowBtnHTML = $(`<button id="btnBorrowBook" class="btn btn-sm btn-primary mb-2" data-toggle="modal" data-target="#modalBorrowBook">Mượn sách</button>`);
            var returnBtnHTML = $(`<button id="btnReturnBook" class="btn btn-sm btn-primary mb-2" data-toggle="modal" data-target="#modalReturnBook">Trả sách</button>`);
            var extendBtnHTML = $(`<button id="btnExtendDate" class="btn btn-sm btn-primary mb-2" data-toggle="modal" data-target="#modalExtendDate">Gia hạn</button>`)
            var showFileBtnHTML = $(`<button id="btnShowFile" class="btn btn-sm btn-primary mb-2" data-toggle="modal" data-target="#">Mở tài liệu</button>`)

            //kiểm tra sách được mượn hay chưa
            //khai báo biến đếm
            let count = 0;
            //duyệt id sách hiện tại trong danh sách mượn
            for (let index = 0; index < borrowListSize; index++) {

                //nếu id sách hiện tại trùng với id sách có trong danh sách mượn
                if (bookId == borrowList[index].bookId) {

                    //thêm nút trả, gia hạn và mở tài liệu
                    $('#groupBookAction').children().remove();
                    $('#groupBookAction').append(returnBtnHTML, extendBtnHTML, showFileBtnHTML);
                    //thoát vòng lặp
                    break
                }
                //nếu id sách hiện tại không trùng với id sách có trong danh sách mượn
                //duyệt tiếp danh sách
                else {
                    //tăng biến đếm
                    count++;
                }
            }

            //nếu duyệt hết danh sách mượn (count == borrowListSize) => sách chưa được mượn
            //nếu sách này chưa được mượn
            if (count == borrowListSize) {
                //loại bỏ ui của các button mượn, trả, gia hạn, mở tài liệu
                $('#groupBookAction').children().remove();
                //nếu số sách đang mượn không vượt quá MAX_BORROW_NUMBER = 6
                if (borrowListSize < MAX_BORROW_NUMBER) {
                    //thêm nút mượn sách
                    $('#groupBookAction').append(borrowBtnHTML);
                }

            }
        }


    }

    //sự kiện khi click nút Xác nhận (modal mượn sách)
    borrowBookEvent() {
        //lấy danh sách mượn của người dùng
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");

        //tạo object lưu thông tin sách vừa mượn
        var newBorrowBook = {
            bookId: localStorage.getItem("bookId"),
            returnDate: "30/3/2021",
            borrowDate: "1/3/2021",
            borrowStatus: 1,
            bookName: $('#bookName').html(),
            bookAuthor: $('#bookAuthor').html(),
            bookImageUri: "../content/img/avatar-book-default.jpg"
        }


        //thêm dữ liệu vào danh sách mượn
        //fake data
        borrowList.push(newBorrowBook);

        //lưu danh sách mượn mới nhất vào local storage
        localStorage.setItem("borrowList", JSON.stringify(borrowList));

        //gọi hàm loadBookActionButton để cập nhật ui
        bookDetailJS.loadBookActionButton();

        //đóng modal
        $('#modalBorrowBook').modal('hide');

        //show alert
        commonBaseJS.showToastMsgSuccess("Mượn sách thành công")
    }


    //sự kiện khi click nút Xác nhận (modal trả sách)
    returnBookEvent() {
        //lấy danh sách mượn của người dùng
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");

        //lấy id sách muốn trả
        //id sách hiện tại trong local storage
        var bookId = localStorage.getItem("bookId");

        //xóa sách muốn trả khỏi list mượn hiện tại
        for (let index = 0; index < borrowList.length; index++) {
            if (borrowList[index].bookId == bookId) {
                //sử dụng hàm splice()
                //xóa 1 phần tử bắt đầu từ vị trí index
                borrowList.splice(index, 1)

                //thoát vòng lặp
                break
            }
        }

        //lưu danh sách mượn mới nhất vào local storage
        localStorage.setItem("borrowList", JSON.stringify(borrowList));

        //gọi hàm loadBookActionButton để cập nhật ui
        bookDetailJS.loadBookActionButton();

        //đóng modal
        $('#modalReturnBook').modal('hide');

        //show alert
        commonBaseJS.showToastMsgSuccess("Trả sách thành công")
    }

}