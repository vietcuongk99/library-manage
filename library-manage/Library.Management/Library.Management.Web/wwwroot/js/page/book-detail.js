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

    ///load thông tin sách
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
                    url: host + "api/BookCategory/" + data.bookCategoryId,
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

        $('#submitCommentBtn').on('click', this.sendComment.bind(this))
    }

    //load ảnh bìa sách
    loadBookImg(bookImgUrl) {

        //call api lấy ảnh bìa sách (base64 string)
        $.ajax({
            method: "GET",
            url: host + "api/BookDetail/GetImageFromUrl",
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
                    debugger
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
    loadBookComment() {

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
        debugger

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
                    url: host + "api/UserComment/CommentBookDetailActivation",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).done(function(res) {
                    if (res.success) {
                        //show alert
                        commonBaseJS.showToastMsgSuccess(res.message);
                        //gọi hàm loadBookComment cập nhật nội dung mới nhất
                        bookDetailJS.loadBookComment()
                    } else {
                        commonBaseJS.showToastMsgFailed(res.message);
                    }
                }).fail(function(res) {
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
                })
            }

        }

    }


}