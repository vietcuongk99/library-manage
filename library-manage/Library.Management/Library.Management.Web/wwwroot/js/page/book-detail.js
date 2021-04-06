//khai báo hằng số lưu số lượng sách được mượn tối đa
//user được mượn tối đa 6 tài liệu
const MAX_BORROW_NUMBER = 6;

//khai báo hằng số lưu thời gian gia hạn
//user khi gia hạn thì thời gian mượn sách sẽ tăng thêm 7 ngày
const EXTEND_BORROW_DAY = 7;

//lấy ra id đầu sách từ url
var bookId = commonJS.getURLParameter('id');

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

        //hiện loading
        commonBaseJS.showLoadingData(1);
        //lấy ra bookId trong localStorage
        //var bookId = localStorage.getItem("bookId");
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
                        bookDetailJS.loadBookImg(bookId, data.bookImageUri)
                    }
                    //nếu đường dẫn ảnh là link online
                    else {
                        $('#imageBook').attr('src', data.bookImageUri);
                    }

                    //gán data cho $('#imageBook')
                    $('#imageBook').data('bookImageUri', data.bookImageUri);
                }
                // nếu đường dẫn ảnh không tồn tại hoặc là ""
                //đặt ảnh mặc định
                else {
                    $('#imageBook').attr('src', '../content/img/avatar-book-default.jpg');
                    //gán data cho $('#imageBook')
                    $('#imageBook').data('bookImageUri', '../content/img/avatar-book-default.jpg')
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
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                    } else {
                        $('#bookCategoryName').text("Chưa có");
                        commonBaseJS.showToastMsgFailed(res.message);
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                    }
                }).fail(function(res) {
                    $('#bookCategoryName').text("Chưa có");
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu loại sách không thành công.");
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                })

            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })


    }

    initEvent() {

        //gán sự kiện cho nút Gửi bình luận
        $('#submitCommentBtn').on('click', function() {
            bookDetailJS.sendComment();
        });


        //fix bug không nhận sự kiện on click
        //tham khảo: https://stackoverflow.com/questions/45283149/jquery-button-click-does-not-work/45283605#45283605
        //gán sự kiện cho nút Mượn sách
        $(document).on('click', '#btnBorrowBook', function() {
            bookDetailJS.borrowBookEvent()
        })

        //gán sự kiện cho nút Trả sách
        $(document).on('click', '#btnReturnBook', function() {
            bookDetailJS.returnBookEvent()
        })

        //gán sự kiện cho nút Gia hạn
        $(document).on('click', '#btnExtendDate', function() {
            bookDetailJS.extendBookEvent()
        })

        //gán sự kiện cho nút Hủy mượn sách
        $(document).on('click', '#btnCancelBorrowRes', function() {
            bookDetailJS.cancelBorrowEvent()
        })

        //gán sự kiện cho nút Mở tài liệu
        $(document).on('click', '#btnShowFile', function() {
            bookDetailJS.showFileEvent()
        })

    }

    //load ảnh bìa sách
    loadBookImg(bookID, bookImgUrl) {
        //call api lấy ảnh bìa sách (base64 string)
        $.ajax({
            method: "GET",
            url: HOST_URL + "api/BookDetail/GetImageFromUrl?bookID=" + bookID + "&bookImageUri=" + bookImgUrl,
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
        //var bookId = localStorage.getItem("bookId");
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
            //var bookId = localStorage.getItem("bookId");
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
            //lấy ra ngày hiện tại
            var dateNow = commonJS.getDateString(new Date(), Enum.ConvertOption.YEAR_FIRST);
            //lấy ra userId và bookId trong localStorage
            //var bookId = localStorage.getItem("bookId");

            //lấy ra danh sách mượn của user trong localStorage
            var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
            //lấy ra số lượng sách đang mượn
            var borrowListSize = commonJS.getBorrowListSize();

            //khai báo các thành phần html cho từng action với sách
            //button mượn sách, trả sách, gia hạn thời gian mượn, mở tài liệu
            var borrowBtnHTML = $(`<button id="btnBorrowBook" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Mượn sách</button>`);
            var returnBtnHTML = $(`<button id="btnReturnBook" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Trả sách</button>`);
            var extendBtnHTML = $(`<button id="btnExtendDate" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Gia hạn</button>`);
            var showFileBtnHTML = $(`<button id="btnShowFile" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Mở tài liệu</button>`);
            var cancelResBtnHTML = $(`<button id="btnCancelBorrowRes" type="button" class="btn btn-sm btn-outline-success mb-2" data-toggle="modal">Hủy mượn sách</button>`);

            //kiểm tra sách được mượn hay chưa
            //khai báo biến đếm
            let count = 0;
            //duyệt id sách hiện tại trong danh sách mượn
            for (let index = 0; index < borrowListSize; index++) {

                //nếu id sách hiện tại trùng với id sách có trong danh sách mượn
                if (bookId == borrowList[index].bookID) {

                    //nếu sách đang mượn
                    if (borrowList[index].status == 1) {

                        //thêm nút trả, gia hạn và mở tài liệu
                        $('#groupBookAction').children().remove();
                        $('#groupBookAction').append(returnBtnHTML, extendBtnHTML);
                        //gán data chứa id và ngày trả của bản ghi mượn hiện tại
                        //dùng cho hàm returnBookEvent() và extendBookEvent()
                        $('#groupBookAction').data('bookBorrowID', borrowList[index].bookBorrowID);
                        $('#groupBookAction').data('returnDate', borrowList[index].returnDate);
                        //gán thời gian trả hiện tại trong modal trả sách
                        var returnDateValue = commonJS.getDateString(new Date(borrowList[index].returnDate), Enum.ConvertOption.DAY_FIRST)
                        $('#returnDateValue').html(returnDateValue);
                        //gán thời gian trả sách cũ và mới trong modal gia hạn
                        $('#oldReturnDate').html(returnDateValue);
                        var newReturnDate = commonJS.addDayToDate(new Date(borrowList[index].returnDate), EXTEND_BORROW_DAY);
                        var newReturnDateVal = commonJS.getDateString(new Date(newReturnDate), Enum.ConvertOption.DAY_FIRST)
                        $('#newReturnDate').html(newReturnDateVal);

                        debugger
                        //nếu sách vẫn còn hạn mượn
                        if (borrowList[index].returnDate >= dateNow) {
                            debugger
                            //thêm nút mở tài liệu
                            showFileBtnHTML.insertAfter($('#btnExtendDate'))
                        } else {
                            showFileBtnHTML.remove()
                        }
                        //thoát vòng lặp
                        break
                    }
                    //nếu sách đang chờ xử lý
                    else {

                        //xóa nút Mượn sách
                        $('#groupBookAction').children().remove();
                        //thêm nút hủy yêu cầu mượn sách
                        $('#groupBookAction').append(cancelResBtnHTML);
                        //gán data id bản ghi mượn sách
                        $('#groupBookAction').data('bookBorrowID', borrowList[index].bookBorrowID);
                        //thoát vòng lặp
                        break

                    }


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

    //validate date input của người dùng
    //date: input từ người dùng
    //selector: form nhập thời gian
    validateDateInput(date, selector, dateCompare) {

        var result = true;
        //self - invoke
        //kiểm tra input date đầy đủ thông tin ngày, tháng, năm
        var validateDate = function(dateInput) {
            return dateInput.length > 0 && dateInput >= dateCompare
        }(date)

        //nếu input được validate
        if (validateDate) {
            //xóa alert nếu có
            if (selector.prev()) {
                selector.prev().remove()
            }
        }
        //nếu input chưa được validate
        else {
            result = false;
            //xóa alert nếu có
            if (selector.prev()) {
                selector.prev().remove()
            }
            //khai báo thành phần alert HTML
            var alertDiv = $(`<div class="alert alert-danger" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                Thời gian chưa hợp lệ
                            </div>`);

            //thêm alert vào form nhập thời gian
            alertDiv.insertBefore(selector)
        }

        return result
    }


    //sự kiện khi click nút Mượn sách
    borrowBookEvent() {
        debugger
        //lấy ra số lượng sách đang mượn
        //kiểm tra danh sách mượn hiện tại của user không vượt quá MAX_BORROW_NUMBER
        var borrowListSize = commonJS.getBorrowListSize();
        //nếu người dùng đã mượn cuốn sách hiện tại
        if (commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn đã mượn cuốn sách này. Thao tác không thành công.")
        } else if (borrowListSize >= MAX_BORROW_NUMBER) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn đã mượn quá số lượng sách quy định. Không thể thực hiện mượn sách.")
        } else {
            debugger
            //hiện modal Mượn sách
            // $('#modalBorrowBook').modal('show');
            // if ($('#confirmBorrowBtn')) {
            //     //gán sự kiện cho nút Xác nhận (modal mượn sách)
            //     $('#confirmBorrowBtn').on('click', bookDetailJS.confirmBorrowBook);
            //     //gán sự kiện cho nút Hủy (modal mượn sách)
            //     $('#modalBorrowBook #dismissBorrowBtn').on('click', function() {
            //         //đóng modal
            //         $('#modalBorrowBook').modal('hide');
            //         //xóa alert validate nếu có
            //         if ($('#returnDateDiv').prev()) {
            //             $('#returnDateDiv').prev().remove()
            //         }
            //     })
            // }

            bookDetailJS.confirmBorrowBook()
        }
    }


    //sự kiện khi click nút Xác nhận (modal mượn sách)
    confirmBorrowBook() {

        debugger
        //lấy thời gian hiện tại
        //var dateNow = commonJS.getDateString(new Date(), Enum.ConvertOption.YEAR_FIRST);

        //lấy input của người dùng
        //khai báo thành phần form nhập thời gian
        //var returnDate = $('#returnDate').val();
        //var returnDateDiv = $('#returnDateDiv');
        //khai báo kết quả validate date input
        //var validateDateResult = bookDetailJS.validateDateInput(returnDate, returnDateDiv, dateNow);

        //nếu date được validate
        // if (validateDateResult) {
        // } else {
        //     commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý")
        // }


        //lấy thông tin user hiện tại
        var userObject = JSON.parse(localStorage.getItem("user"));
        //lấy ra userId và bookId trong localStorage
        //var bookId = localStorage.getItem("bookId");
        var userID = userObject.userID;
        //khai báo thời gian mượn và trả sách
        //var dateNow = commonJS.fromDateToString(new Date())
        //var returnDateVal = new Date(returnDate).toISOString()

        //khai báo và tạo data trước khi call api
        var data = {
            bookId: bookId,
            userId: userID
                //returnDate: returnDateVal,
                //borrowDate: dateNow
        };

        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            url: HOST_URL + "api/BookBorrow/BorrowActivation",
            data: JSON.stringify(data),
            method: "POST",
            contentType: "application/json"
        }).done(function(res) {
            //nếu server xử lý thành công
            if (res.success) {

                debugger
                var data = res.data;
                //lấy danh sách mượn của người dùng
                var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");

                //tạo object lưu thông tin sách vừa mượn
                var newBorrowBook = {
                    bookBorrowID: data.bookBorrowId,
                    bookID: data.bookId,
                    status: data.status,
                    borrowDate: null,
                    returnDate: null
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

                //ẩn loading
                commonBaseJS.showLoadingData(0);

                //show alert
                commonBaseJS.showToastMsgSuccess("Đăng ký mượn sách thành công.")

            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed(res.message)
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Không thể thực hiện thao tác mượn sách.")
        })
    }


    //sự kiện khi click nút Trả sách
    returnBookEvent() {
        debugger
        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            debugger
            //hiện modal Trả sách
            $('#modalReturnBook').modal('show');
            if ($('#confirmReturnBtn')) {
                //gán sự kiện cho nút Xác nhận (modal trả sách)
                debugger
                $('#confirmReturnBtn').on('click', bookDetailJS.confirmReturnBook);
                //gán sự kiện cho nút Hủy (modal trả sách)
                $('#modalReturnBook #dismissReturnBtn').on('click', function() {
                    //đóng modal
                    $('#modalReturnBook').modal('hide')
                })
            }
        }
    }

    //sự kiện khi click nút Xác nhận (modal trả sách)
    confirmReturnBook() {
        debugger

        //lấy danh sách mượn của người dùng
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");

        //lấy id mượn sách hiện tại
        //hàm loadBookActionButton()
        var bookBorrowID = $('#groupBookAction').data('bookBorrowID')

        //tạo data trước khi call api
        var data = {
            bookBorrowId: bookBorrowID
        }

        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            url: HOST_URL + "api/BookBorrow/RestoreActivation",
            data: JSON.stringify(data),
            method: "PUT",
            contentType: "application/json",
        }).done(function(res) {


            debugger
            //nếu server xử lý thành công
            if (res.success) {
                //xóa sách muốn trả khỏi list mượn hiện tại
                for (let index = 0; index < borrowList.length; index++) {
                    if (borrowList[index].bookID == bookId) {
                        //sử dụng hàm splice()
                        //xóa 1 phần tử bắt đầu từ vị trí index
                        borrowList.splice(index, 1);
                        //đặt lại giá trị bookBorrowID
                        $('#groupBookAction').data('bookBorrowID', "");
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

                //ẩn loading
                commonBaseJS.showLoadingData(0);

                //show alert
                commonBaseJS.showToastMsgSuccess("Trả sách thành công.")


            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed(res.message)

            }


        }).fail(function(res) {
            debugger
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Không thể thực hiện thao tác trả sách.")


        })

    }

    //sự kiện khi click nút Gia hạn
    extendBookEvent() {
        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            debugger
            //hiện modal Gia hạn
            $('#modalExtendDate').modal('show');
            if ($('#confirmExtendBtn')) {
                //gán sự kiện cho nút Xác nhận (modal gia hạn)
                $('#confirmExtendBtn').on('click', bookDetailJS.confirmExtendBook);
                //gán sự kiện cho nút Hủy (modal gia hạn)
                $('#modalExtendDate #dismissExtendBtn').on('click', function() {
                    //đóng modal
                    $('#modalExtendDate').modal('hide')

                    //xóa alert validate nếu có
                    if ($('#oldReturnDateDiv').prev()) {
                        $('#oldReturnDateDiv').prev().remove()
                    }
                })
            }
        }
    }

    //sự kiện khi click nút Xác nhận (modal gia hạn)
    confirmExtendBook() {
        //khai báo thành phần form nhập thời gian
        //var oldReturnDateDiv = $('#oldReturnDateDiv');
        //lấy input của người dùng
        // var newReturnDate = $('#newReturnDate').val();

        //khai báo kết quả validate date input
        //var validateDateResult = bookDetailJS.validateDateInput(newReturnDate, oldReturnDateDiv, returnDate);

        //nếu input được validate
        // if (validateDateResult) {    
        // }
        // //nếu input chưa được validate
        // else {
        //     //show alert
        //     commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý")
        // }

        //lấy thời gian trả sách hiện tại
        //hàm loadBookActionButton()
        var returnDate = $('#groupBookAction').data('returnDate');
        //lấy id mượn sách hiện tại
        //hàm loadBookActionButton()
        var bookBorrowID = $('#groupBookAction').data('bookBorrowID');
        //khai báo thời gian trả sách mới
        var newReturnDate = commonJS.addDayToDate(new Date(returnDate), EXTEND_BORROW_DAY);

        //khai báo và tạo data trước khi call api
        var data = {
            bookBorrowId: bookBorrowID,
            returnDate: newReturnDate
        };

        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            url: HOST_URL + "api/BookBorrow/ExtendActivation",
            data: JSON.stringify(data),
            method: "PUT",
            contentType: "application/json"
        }).done(function(res) {
            //nếu server xử lý thành công
            if (res.success) {

                debugger
                //lấy danh sách mượn của người dùng trong local storage
                var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
                //lấy id sách muốn gia hạn
                //id sách hiện tại trong local storage
                // var bookId = localStorage.getItem("bookId");
                //cập nhật thời gian trả
                for (let index = 0; index < borrowList.length; index++) {
                    if (borrowList[index].bookID == bookId) {
                        //cập nhật thời gian trả mới nhất
                        borrowList[index].returnDate = commonJS.getDateString(new Date(newReturnDate), Enum.ConvertOption.YEAR_FIRST);
                        //thoát vòng lặp
                        break
                    }
                }

                //lưu danh sách mượn mới nhất vào local storage
                localStorage.setItem("borrowList", JSON.stringify(borrowList));

                //gọi hàm loadBookActionButton để cập nhật ui
                bookDetailJS.loadBookActionButton();

                //đóng modal
                $('#modalExtendDate').modal('hide');

                //ẩn loading
                commonBaseJS.showLoadingData(0);

                //show alert
                commonBaseJS.showToastMsgSuccess("Gia hạn thời gian mượn sách thành công")
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed(res.message)
            }

        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Không thể thực hiện thao tác gia hạn thời gian mượn sách.")


        })




    }

    //sự kiện khi click nút Mở tài liệu
    showFileEvent() {

        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            commonBaseJS.showToastMsgSuccess('Đang mở file, vui lòng đợi')
        }

    }

    //sự kiện khi click nút Hủy mượn sách
    cancelBorrowEvent() {
        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa đăng ký mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            debugger
            //hiện modal Hủy mượn sách
            $('#modalCancelBorrow').modal('show');
            if ($('#confirmCancelBtn')) {
                //gán sự kiện cho nút Xác nhận (modal gia hạn)
                $('#confirmCancelBtn').on('click', bookDetailJS.confirmCancelBorrow);
                //gán sự kiện cho nút Hủy (modal gia hạn)
                $('#modalCancelBorrow #dismissCancelBtn').on('click', function() {
                    //đóng modal
                    $('#modalCancelBorrow').modal('hide')
                })
            }
        }
    }

    //sự kiện khi click nút Hủy mượn sách
    confirmCancelBorrow() {

        //lấy id mượn sách hiện tại
        //hàm loadBookActionButton()
        var bookBorrowID = $('#groupBookAction').data('bookBorrowID');

        debugger
        //tạo data
        var data = [
            bookBorrowID
        ];

        //goi api
        $.ajax({
            method: "DELETE",
            url: HOST_URL + "api/BookBorrow/GroupID",
            data: JSON.stringify(data),
            contentType: "application/json",
            beforeSend: function() {
                //hiện loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //nếu thao tác thành công
            if (res.success) {
                debugger
                //lấy ra danh sách mượn của người dùng trong local storage
                var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
                for (let index = 0; index < borrowList.length; index++) {
                    if (borrowList[index].bookBorrowID == bookBorrowID) {
                        //gọi hàm splice
                        //xóa 1 phần tử từ index
                        borrowList.splice(index, 1);
                        //thoát vòng lặp
                        break
                    }
                }
                //lưu lại danh sách mượn mới nhất
                localStorage.setItem("borrowList", JSON.stringify(borrowList));

                //gọi hàm loadBookActionButton để cập nhật ui
                bookDetailJS.loadBookActionButton();

                //đóng modal
                $('#modalCancelBorrow').modal('hide');

                commonBaseJS.showToastMsgSuccess("Hủy yêu cầu mượn sách thành công.")
            }
            //nếu thao tác không thành công
            else {
                commonBaseJS.showToastMsgSuccess(res.data.message)
            }
        }).fail(function(res) {
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Không thể thực hiện thao tác.")
        })
    }

}