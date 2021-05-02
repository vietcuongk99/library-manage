//lấy ra url hiện tại của trang
var sPageURL = window.location.search.substring(1),
    //lấy ra id đầu sách từ url
    bookId = commonJS.getURLParameter(sPageURL, Enum.SplitOption.ONE, 'id'),
    //khai báo biến toàn cục lưu đường dẫn file pdf của sách
    bookDownloadUrl;
$(document).ready(function() {
    bookDetailJS = new BookDetailJS()
})

//class quản lý các sự kiện trong trang book-detail.html
class BookDetailJS extends BaseJS {
    constructor() {
        super();
        this.loadBookData();
        this.loadBorrowList();
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
            url: Enum.URL.HOST_URL + "api/BookDetail/" + bookId,
            async: true,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                //gán data
                var data = res.data;
                //gán thông tin sách
                $('#bookTitle').text(data.bookName);
                $('#bookName').text(data.bookName);
                $('#bookAuthor').text(data.bookAuthor);
                $('#bookAmountPage').text(data.amountPage);
                $('#borrowTotal').text(data.borrowTotal);
                $('#yearPublication').text(data.yearOfPublication);
                $('#bookDescription').text(data.description);
                //gán data id loại sách
                $('#bookCategoryName').data("id", data.bookCategoryId);
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
                //lấy ra id loại sách
                var categoryID = data.bookCategoryId;
                //gọi hàm load tên loại sách và sách cùng loại
                bookDetailJS.loadBookCategoryName(categoryID);
                bookDetailJS.loadSameCategoryBooks(categoryID);
                //lấy ra đường dẫn file pdf của sách và gán cho biến toàn cục
                bookDownloadUrl = data.bookDownloadUri;
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //commonBaseJS.showToastMsgFailed(res.message);
                //load sách cùng thể loại
                commonJS.addEmptyListHTML("Chưa có sách", "#sameCategoryBookDiv")
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            commonJS.addEmptyListHTML("Không thể hiển thị sách", "#sameCategoryBookDiv")
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    //chi tiết xử lý load ảnh bìa sách
    loadBookImg(bookID, bookImgUrl) {
        //call api lấy ảnh bìa sách (base64 string)
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookDetail/GetImageFromUrl?bookID=" + bookID + "&bookImageUri=" + bookImgUrl,
            async: true,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                //lấy giá trị base64 string trả về
                var data = res.data,
                    bookImgBase64String = data.bookDetailImageUri;
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

    //load tên loại sách
    loadBookCategoryName(categoryID) {
        //call api lấy thông tin thể loại sách
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookCategory/" + categoryID,
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
    }

    //load giao diện ui nút mượn, trả, gia hạn, tải tài liệu
    loadBookActionButton() {
        //lấy ra ngày hiện tại
        var dateNow = commonJS.getDateString(new Date(), Enum.ConvertOption.YEAR_FIRST),
            //lấy ra danh sách mượn của user trong localStorage 
            borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]"),
            //lấy ra số lượng sách đang mượn
            borrowListSize = commonJS.getBorrowListSize(),
            //khai báo các thành phần html cho từng action với sách
            //button mượn sách, trả sách, gia hạn thời gian mượn, mở tài liệu
            borrowBtnHTML = $(`<button id="btnBorrowBook" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Mượn sách</button>`),
            returnBtnHTML = $(`<button id="btnReturnBook" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Trả sách</button>`),
            //var extendBtnHTML = $(`<button id="btnExtendDate" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Gia hạn</button>`);
            showFileBtnHTML = $(`<button id="btnShowFile" type="button" class="btn btn-sm btn-success mb-2" data-toggle="modal">Mở tài liệu</button>`),
            cancelResBtnHTML = $(`<button id="btnCancelBorrowRes" type="button" class="btn btn-sm btn-outline-success mb-2" data-toggle="modal">Hủy mượn sách</button>`);
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
                    // $('#groupBookAction').append(returnBtnHTML, extendBtnHTML);
                    $('#groupBookAction').append(returnBtnHTML);
                    //gán data chứa id và ngày trả của bản ghi mượn hiện tại
                    //dùng cho hàm returnBookEvent() và extendBookEvent()
                    $('#groupBookAction').data('bookBorrowID', borrowList[index].bookBorrowID);
                    $('#groupBookAction').data('returnDate', borrowList[index].returnDate);
                    //gán thời gian trả hiện tại trong modal trả sách và modal gia hạn
                    var returnDateValue = commonJS.getDateString(new Date(borrowList[index].returnDate), Enum.ConvertOption.DAY_FIRST)
                    $('#returnDateValue').html(returnDateValue);
                    $('#oldReturnDate').html(returnDateValue);
                    //nếu sách vẫn còn hạn mượn
                    if (borrowList[index].returnDate > dateNow) {
                        //thêm nút mở tài liệu
                        $('#groupBookAction').append(showFileBtnHTML)
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
            if (borrowListSize < Enum.BookBorrow.MAX_BORROW_NUMBER) {
                //thêm nút mượn sách
                $('#groupBookAction').append(borrowBtnHTML);
            }
        }
    }

    //load sách cùng thể loại
    //load dữ liệu sách mới nhất
    loadSameCategoryBooks(categoryID) {
        //call api
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookDetail/GetPagingDataV2" +
                "?pageNumber=" + Enum.BookPaging.PAGE_DEFAULT +
                "&pageSize=" + (Enum.BookPaging.RECORD_PER_PAGE + 1) + "&paramBookCategoryID=" +
                categoryID + "&maxValueType=1&orderByType=1",
            async: true,
            contentType: "application/json",
            beforeSend: function() {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function(res) {
            if (res.success) {
                //nếu response trả về có nhiều hơn 1 đầu sách
                if (res.data && res.data.dataItems.length > 1) {
                    var sameCategoryBooks = res.data.dataItems;
                    commonJS.appendSameCategoryBookToCard(sameCategoryBooks, '#sameCategoryBookDiv', bookId);
                } else {
                    //thêm ui list rỗng
                    commonJS.addEmptyListHTML("Chưa có sách", "#sameCategoryBookDiv");
                }
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            }
            //nếu response trả về chỉ có sách hiện tại
            else {
                commonJS.addEmptyListHTML("Chưa có sách", '#sameCategoryBookDiv');
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            }
        }).fail(function(res) {
            commonJS.addEmptyListHTML("Không thể hiển thị sách", "#sameCategoryBookDiv");
            //ẩn loading
            commonBaseJS.showLoadingData(0);
        })
    }

    //gán sự kiện cho các button
    initEvent() {
        //gán sự kiện cho nút Gửi bình luận
        $('#submitCommentBtn').on('click', function() {
            bookDetailJS.sendComment();
        });
        //tham khảo: https://stackoverflow.com/questions/45283149/jquery-button-click-does-not-work/45283605#45283605
        //gán sự kiện cho nút Mượn sách
        $(document).on('click', '#btnBorrowBook', function() {
            bookDetailJS.borrowBookEvent()
        });
        //gán sự kiện cho nút Trả sách
        $(document).on('click', '#btnReturnBook', function() {
            bookDetailJS.returnBookEvent()
        });
        //gán sự kiện cho nút Gia hạn
        // $(document).on('click', '#btnExtendDate', function() {
        //     bookDetailJS.extendBookEvent()
        // });
        //gán sự kiện cho nút Hủy mượn sách
        $(document).on('click', '#btnCancelBorrowRes', function() {
            bookDetailJS.cancelBorrowEvent()
        });
        //gán sự kiện cho nút Mở tài liệu
        $(document).on('click', '#btnShowFile', function() {
            bookDetailJS.showFileEvent(bookDownloadUrl)
        });
        //gán sự kiện khi chọn một card sách
        $('#sameCategoryBookDiv').on('click', 'div.card.h-100', this.cardOnClick);
        //gán sự kiện cho nút Xem thêm
        $('#showSameCategoryBook').on('click', this.showSameCategoryBook);

        //gán sự kiện trong modal Xóa bình luận
        $(document).on('click', '#dismissDeleteBtn', function() {
            //đóng modal
            $('#modalDeleteComment').modal('hide');
        });
        $(document).on('click', '#confirmDeleteBtn', function() {
            //lấy ra commentId
            var commentId = $('#modalDeleteComment').data("commentId");
            //gọi hàm thực thi xóa bình luận
            bookDetailJS.confirmDeleteComment(commentId);
        });
        //gán sự kiện trong modal Cập nhật bình luận
        $(document).on('click', '#dismissUpdateBtn', function() {
            //đóng modal
            $('#modalUpdateComment').modal('hide');
        });
        $(document).on('click', '#confirmUpdateBtn', function() {
            //lấy ra commentId
            var commentId = $('#modalUpdateComment').data("commentId");
            //lấy ra commentId
            var commentContent = $('#modalUpdateComment').data("commentContent");
            //gọi hàm thực thi cập nhật bình luận
            bookDetailJS.confirmUpdateComment(commentId, commentContent);
        })
    }

    //sự kiện khi click nút Mượn sách
    borrowBookEvent() {
        //lấy ra số lượng sách đang mượn
        //kiểm tra danh sách mượn hiện tại của user không vượt quá MAX_BORROW_NUMBER
        var borrowListSize = commonJS.getBorrowListSize();
        //nếu người dùng đã mượn cuốn sách hiện tại
        if (commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn đã mượn cuốn sách này. Thao tác không thành công.")
        } else if (borrowListSize >= Enum.BookBorrow.MAX_BORROW_NUMBER) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn đã mượn quá số lượng sách quy định. Không thể thực hiện mượn sách.")
        } else {
            bookDetailJS.confirmBorrowBook()
        }
    }

    //sự kiện khi click nút Xác nhận (modal mượn sách)
    confirmBorrowBook() {
        //lấy thông tin user hiện tại
        var userObject = JSON.parse(localStorage.getItem("user")),
            //lấy ra userId trong localStorage
            userID = userObject.userID,
            //khai báo và tạo data trước khi call api
            data = {
                bookId: bookId,
                userId: userID
            };
        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            url: Enum.URL.HOST_URL + "api/BookBorrow/BorrowActivation",
            data: JSON.stringify(data),
            method: "POST",
            contentType: "application/json"
        }).done(function(res) {
            //nếu server xử lý thành công
            if (res.success) {
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
                };
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

    //sự kiện khi click nút Hủy mượn sách
    cancelBorrowEvent() {
        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa đăng ký mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            //hiện modal Hủy mượn sách
            $('#modalCancelBorrow').modal('show');
            if ($('#confirmCancelBtn')) {
                //gán sự kiện cho nút Xác nhận (modal hủy mượn sách)
                $('#confirmCancelBtn').on('click', bookDetailJS.confirmCancelBorrow);
                //gán sự kiện cho nút Hủy (modal hủy mượn sách)
                $('#modalCancelBorrow #dismissCancelBtn').on('click', function() {
                    //đóng modal
                    $('#modalCancelBorrow').modal('hide')
                })
            }
        }
    }

    //sự kiện khi click nút Xác nhận (modal hủy mượn sách)
    confirmCancelBorrow() {
        //lấy id mượn sách hiện tại
        //hàm loadBookActionButton()
        var bookBorrowID = $('#groupBookAction').data('bookBorrowID'),
            //tạo data
            data = [
                bookBorrowID
            ];
        //goi api
        $.ajax({
            method: "DELETE",
            url: Enum.URL.HOST_URL + "api/BookBorrow/GroupID",
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
                //show alert
                commonBaseJS.showToastMsgSuccess("Hủy yêu cầu mượn sách thành công.")
            }
            //nếu thao tác không thành công
            else {
                //show alert
                commonBaseJS.showToastMsgSuccess(res.data.message)
            }
        }).fail(function(res) {
            //ẩn loading
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Không thể thực hiện thao tác.")
        })
    }

    //sự kiện khi click nút Trả sách
    returnBookEvent() {
        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            //hiện modal Trả sách
            $('#modalReturnBook').modal('show');
            if ($('#confirmReturnBtn')) {
                //gán sự kiện cho nút Xác nhận (modal trả sách)
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
        //lấy danh sách mượn của người dùng
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]"),
            //lấy id mượn sách hiện tại
            //hàm loadBookActionButton()
            bookBorrowID = $('#groupBookAction').data('bookBorrowID'),
            //tạo data trước khi call api
            data = {
                bookBorrowId: bookBorrowID
            };
        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            url: Enum.URL.HOST_URL + "api/BookBorrow/RestoreActivation",
            data: JSON.stringify(data),
            method: "PUT",
            contentType: "application/json",
        }).done(function(res) {
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
            //lấy ra ngày hiện tại
            var dateNow = commonJS.getDateString(new Date(), Enum.ConvertOption.YEAR_FIRST),
                //gán thời gian trả sách mới trong modal gia hạn
                newReturnDate = commonJS.addDayToDate(new Date(dateNow), Enum.BookBorrow.EXTEND_BORROW_DAY),
                newReturnDateVal = commonJS.getDateString(new Date(newReturnDate), Enum.ConvertOption.DAY_FIRST)
            $('#newReturnDate').html(newReturnDateVal);
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
        //lấy ra ngày hiện tại
        var dateNow = commonJS.getDateString(new Date(), Enum.ConvertOption.YEAR_FIRST);
        //lấy id mượn sách hiện tại
        //hàm loadBookActionButton()
        var bookBorrowID = $('#groupBookAction').data('bookBorrowID');
        //khai báo thời gian trả sách mới
        var newReturnDate = commonJS.addDayToDate(new Date(dateNow), Enum.BookBorrow.EXTEND_BORROW_DAY);

        //khai báo và tạo data trước khi call api
        var data = {
            bookBorrowId: bookBorrowID,
            returnDate: newReturnDate
        };

        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            url: Enum.URL.HOST_URL + "api/BookBorrow/ExtendActivation",
            data: JSON.stringify(data),
            method: "PUT",
            contentType: "application/json"
        }).done(function(res) {
            //nếu server xử lý thành công
            if (res.success) {
                //lấy danh sách mượn của người dùng trong local storage
                var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
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
    showFileEvent(bookDownloadUrl) {
        //nếu người dùng chưa mượn cuốn sách hiện tại
        if (!commonJS.checkValidBookBorrow(bookId)) {
            //show alert
            commonBaseJS.showToastMsgFailed("Bạn chưa mượn cuốn sách này. Thao tác không thành công.")
        }
        //nếu người dùng đã mượn cuốn sách hiện tại
        else {
            $.ajax({
                url: Enum.URL.HOST_URL + "api/BookDetail/OpenFileBookInfo?BookID=" + bookId,
                method: "POST",
                contentType: "application/json"
            }).done(function(res) {
                if (res.success) {
                    if (bookDownloadUrl && bookDownloadUrl.trim().length > 0) {
                        //tạo url cho trang hiển thị file pdf
                        var showFileUrl = Enum.URL.HOST_URL + bookDownloadUrl;
                        //mở tab với url trên
                        window.open(showFileUrl, "blank")
                    }
                } else {
                    //show alert
                    commonBaseJS.showToastMsgInfomation('Sách chưa được bổ sung tài liệu.')
                }
            }).fail(function(res) {
                //show alert
                commonBaseJS.showToastMsgInfomation('Mở tài liệu sách không thành công.')
            })
        }
    }

    //load nội dung bình luận
    loadBookComment() {
        if (bookId) {
            //call api
            $.ajax({
                method: "GET",
                url: Enum.URL.HOST_URL + "api/UserComment/GetCommentByBookDetail" +
                    "?BookID=" + bookId + "&pageNumber=" + Enum.CommentPaging.PAGE_DEFAULT +
                    "&pageSize=" + Enum.CommentPaging.RECORD_PER_PAGE,
                contentType: "application/json"
            }).done(function(res) {
                //lấy res từ api
                if (res.success) {
                    if (res.data && res.data.totalRecord > 0) {
                        //lấy ra tổng số bình luận
                        var totalRecord = res.data.totalRecord;
                        //tính toán số trang có thể hiển thị khi phân trang
                        var totalPages = Math.ceil(totalRecord / Enum.CommentPaging.RECORD_PER_PAGE);
                        //gọi hàm loadBookComment của commonJS object
                        //commonJS.appendCommentData(data);
                        bookDetailJS.loadCommentPagination(totalPages, res.data.dataItems)
                    } else {
                        commonJS.addEmptyListHTML("Chưa có bình luận nào", "#commentContentDiv")
                    }
                } else {
                    //commonBaseJS.showToastMsgFailed(res.message);
                    commonJS.addEmptyListHTML("Chưa có bình luận nào", "#commentContentDiv")
                }
            }).fail(function(res) {
                //commonBaseJS.showToastMsgFailed("Lấy dữ liệu bình luận không thành công.");
                commonJS.addEmptyListHTML("Không thể hiển thị bình luận", "#commentContentDiv")
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
        }(commentContent);
        //nếu comment chưa validate
        if (!commentValidate) {
            //khai báo thành phần html
            commonBaseJS.showToastMsgInfomation("Bạn cần nhập nội dung bình luận.");
            //gán result = false
            result = false
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
            //lấy ra userId trong localStorage
            var userID = userObject.userID,
                //lấy giá trị validate comment
                validateCommentRes = bookDetailJS.validateCommentInput();
            //nếu nội dung comment được validate
            if (validateCommentRes) {
                //lấy ra nội dung comment của người dùng
                var commentContent = $('#commentInput').val().trim(),
                    //khai báo data
                    data = {
                        userId: userID,
                        bookId: bookId,
                        comment: commentContent
                    };
                //call api
                $.ajax({
                    method: "POST",
                    url: Enum.URL.HOST_URL + "api/UserComment/CommentBookDetailActivation",
                    async: true,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    beforeSend: function() {
                        //hiện loading
                        commonBaseJS.showLoadingData(1);
                    }
                }).done(function(res) {
                    if (res.success) {
                        //reset nội dung comment
                        $('#commentInput').val("");
                        //gọi hàm loadBookComment cập nhật nội dung mới nhất
                        bookDetailJS.loadBookComment();
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                        //show alert
                        commonBaseJS.showToastMsgSuccess(res.message);
                    } else {
                        commonBaseJS.showLoadingData(0);
                        commonBaseJS.showToastMsgFailed(res.message);
                    }
                }).fail(function(res) {
                    commonBaseJS.showLoadingData(0);
                    commonBaseJS.showToastMsgFailed("Không thể gửi bình luận.");
                })
            }
        }
    }

    //chi tiết xử lý xóa bình luận
    confirmDeleteComment(commentID) {
        //đóng modal
        $('#modalDeleteComment').modal('hide');
        //hiện loading
        commonBaseJS.showLoadingData(1);
        //tạo data
        var data = JSON.stringify([commentID]);
        //call api
        $.ajax({
            url: Enum.URL.HOST_URL + "api/UserComment/GroupID",
            contentType: "application/json",
            data: data,
            method: "DELETE"
        }).done(function(res) {
            //đóng loading
            commonBaseJS.showLoadingData(0);
            //nếu res báo thành công
            if (res.success) {
                //cập nhật bình luận mới nhất
                bookDetailJS.loadBookComment();
            }
            //nếu res báo không thành công
            else {
                //hiện thông báo
                commonBaseJS.showToastMsgInfomation(res.message);
            }
        }).fail(function(res) {
            //đóng loading
            commonBaseJS.showLoadingData(0);
            //hiện thông báo
            commonBaseJS.showToastMsgFailed(res.message);
        })
    }

    //chi tiết xử lý cập nhật bình luận
    confirmUpdateComment(commentID, commentContent) {
        //đóng modal
        $('#modalUpdateComment').modal('hide');
        //hiện loading
        commonBaseJS.showLoadingData(1);
        //tạo data
        var data = {
            commentId: commentID,
            comment: commentContent
        };
        //call api
        $.ajax({
            url: Enum.URL.HOST_URL + "api/UserComment/ModifyCommentBookDetail",
            contentType: "application/json",
            data: JSON.stringify(data),
            method: "PUT"
        }).done(function(res) {
            //đóng loading
            commonBaseJS.showLoadingData(0);
            //nếu res báo thành công
            if (res.success) {
                //cập nhật bình luận mới nhất
                bookDetailJS.loadBookComment();
            }
            //nếu res báo không thành công
            else {
                //hiện thông báo
                commonBaseJS.showToastMsgInfomation(res.message);
            }
        }).fail(function(res) {
            //đóng loading
            commonBaseJS.showLoadingData(0);
            //hiện thông báo
            commonBaseJS.showToastMsgFailed(res.message);
        })
    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {
        //lấy ra id của sách được chọn
        let selectedBookId = $(this).data('bookId');
        //tạo url với param chứa id đầu sách vừa được click
        var bookDetailStr = "book-detail.html?id=" + selectedBookId;
        //mở trang book-detail
        window.open(bookDetailStr, "_self")
    }

    //chi tiết xử lý khi click nút Xem thêm
    showSameCategoryBook() {
        //lấy ra id loại sách hiện tại và tạo url tìm kiếm
        var categoryID = $('#bookCategoryName').data("id"),
            searchURL = "&paramBookCategoryID=" + categoryID;
        //lưu url tìm kiếm trong local storage
        localStorage.setItem("searchURL", searchURL);
        //mở trang search.html
        window.open("search.html", "_self");
    }

    //chi tiết xử lý phân trang danh sách bình luận
    loadCommentPagination(totalPages, defaultList) {
        //lấy id của user hiện tại
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID;
        (userObject) ? (userID = userObject.userID) : ("");
        //hủy pagination từ twbs-paginaton plugin
        $('#pagingDiv').twbsPagination('destroy');
        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: Enum.CommentPaging.VISIBLE_PAGE_DEFAULT,
            onPageClick: function(event, page) {
                //xóa danh sách bình luận
                $('#commentContentDiv').children().remove();
                if (page > Enum.CommentPaging.PAGE_DEFAULT) {
                    //call api
                    $.ajax({
                        method: "GET",
                        url: Enum.URL.HOST_URL + "api/UserComment/GetCommentByBookDetail" +
                            "?BookID=" + bookId + "&pageNumber=" + page +
                            "&pageSize=" + Enum.CommentPaging.RECORD_PER_PAGE,
                        async: true,
                        contentType: "application/json",
                        beforeSend: function() {
                            //show loading
                            commonBaseJS.showLoadingData(1);
                        }
                    }).done(function(res) {
                        if (res.success && res.data) {
                            //lấy ra danh sách bình luận
                            var data = res.data.dataItems;
                            //gán dữ liệu lên ui
                            commonJS.appendCommentData(data, userID);
                        } else {
                            commonJS.addEmptyListHTML("Chưa có bình luận nào", "#commentContentDiv")
                        }
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                    }).fail(function(res) {
                        commonJS.addEmptyListHTML("Không thể hiển thị bình luận", "#commentContentDiv");
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                    })
                } else {
                    commonJS.appendCommentData(defaultList, userID);
                }
            }
        })


    }

    //lấy ra danh sách mượn mới nhất của user
    loadBorrowList() {
        var userData = JSON.parse(localStorage.getItem("user"));
        //nếu user là khách hoặc có quyền admin
        //không hiển thị button mượn, trả, gia hạn, tải tài liệu
        if (!userData || userData.conditionAccount == 0) {
            $('#groupBookAction').children().remove();
        }
        //nếu user có tài khoản không phải admin
        else {
            // lấy userId từ localStorage
            var userID = userData.userID;
            //hiện loading
            commonBaseJS.showLoadingData(1);
            //call api
            //cache: false
            $.ajax({
                method: "GET",
                url: Enum.URL.HOST_URL + "api/BookBorrow/GetPagingData?userId=" + userID,
                contentType: "application/json",
                cache: false
            }).done(function(res) {
                //nếu server xử lý thành công
                if (res.success && res.data) {
                    //gán data
                    var list = res.data;
                    //lưu danh sách mượn mới nhất vào localStorage
                    commonJS.saveBorrowListToLocal(list);
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                    //gọi hàm load ui button mượn trả
                    bookDetailJS.loadBookActionButton();
                } else {
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                }
            }).fail(function(res) {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            })
        }
    }
}