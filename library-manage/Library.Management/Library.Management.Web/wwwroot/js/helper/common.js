/** --------------------------------------
 * Đối tượng js chứa các hàm sử dụng chung
 * Author: dvcuong
 * ---------------------------------------*/

var commonJS = {

    //fix timezone
    //convert từ date sang kiểu datetime (sql)
    //sử dụng trong trang book-detail
    fromDateToString(date) {
        date = new Date(+date);
        date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
        let dateAsString = date.toISOString().substr(0, 19);
        return dateAsString;
    },
    //thêm ngày cho thời gian hiện tại
    //sử dụng trong trang book-detail
    addDayToDate(date, day) {
        if (day > 0) {
            date.setDate(date.getDate() + day);
        } else {
            date.setDate(date.getDate);
        }
        return new Date(date);
    },
    //convert từ date sang string chứa ngày-tháng-năm
    //sử dụng trong trang book-detail
    getDateString(date, option) {
        // slice(-2) chọn hai phần tử cuối cùng của mảng.
        var day = ("0" + date.getDate()).slice(-2),
            month = ("0" + (date.getMonth() + 1)).slice(-2);
        switch (option) {
            case Enum.ConvertOption.YEAR_FIRST:
                var dateString = date.getFullYear() + "-" + (month) + "-" + (day);
                break;
            case Enum.ConvertOption.DAY_FIRST:
                var dateString = (day) + "-" + (month) + "-" + date.getFullYear();
                break;
        }
        return dateString;
    },
    //convert từ date sang string chứa ngày-tháng-năm và giờ-phút
    //sử dụng trong trang book-detail
    getDateTimeString(date) {
        //convert datetime
        var timeComment = new Date(date),
            minutes = ("0" + timeComment.getMinutes()).slice(-2),
            hour = ("0" + timeComment.getHours()).slice(-2),
            day = ("0" + timeComment.getDate()).slice(-2),
            month = ("0" + (timeComment.getMonth() + 1)).slice(-2),
            year = timeComment.getUTCFullYear(),
            timeCommentConvert = day + "-" + month + "-" + year +
            " lúc " + hour + ":" + minutes;
        return timeCommentConvert;
    },
    //append dữ liệu vào thẻ card
    //sử dụng trong trang index, search
    appendBookDataToCard(data, selector) {
        var row = $(`<div class="row mt-2"></div>`);
        data.forEach(book => {
            var bookImgBase64String = "data:image/jpg;base64," + book.bookImageUriBase64String,
                card = $(`<div class="col-6 col-md-6 col-lg-3 col-sm-6 portfolio-item">
                            </div>`),
                bookHTML = $(`<div class="card h-100 rounded shadow">
                                <img class="card-img-top w-100 pt-1 px-1 mx-auto" src="` + bookImgBase64String + `" alt="" style="height: 20rem;">
                                <div class="card-body">
                                    <p class="card-title text-truncate text-uppercase text-center" style="font-weight: 600">` + book.bookName + `</p>
                                </div>
                            </div>`);
            bookHTML.data('bookId', book.bookID);
            $(card).append(bookHTML);
            row.append(card);
        })
        $(selector).html(row);
    },
    //append dữ liệu sách cùng thể loại vào thẻ card
    //sử dụng trong trang book-detail
    appendSameCategoryBookToCard(data, selector, currentBookID) {
        var row = $(`<div class="row mt-2"></div>`),
            totalItem = 0;
        for (let index = 0; index < data.length; index++) {
            if (totalItem < 4) {
                if (data[index].bookID != currentBookID) {
                    var bookImgBase64String = "data:image/jpg;base64," + data[index].bookImageUriBase64String;
                    var card = $(`<div class="col-6 col-md-6 col-lg-3 col-sm-6 portfolio-item">
                                    </div>`)
                    var bookHTML = $(`
                    <div class="card h-100 rounded shadow">
                    <img class="card-img-top w-100 pt-1 px-1 mx-auto" src="` + bookImgBase64String + `" alt="" style="height: 20rem;">
                            <div class="card-body">
                                <p class="card-title text-truncate text-uppercase text-center" style="font-weight: 600">` + data[index].bookName + `</p>
                            </div>
                        </div>`)
                        // <p class="text-truncate text-center">` + data[index].bookAuthor + `</p>
                    bookHTML.data('bookId', data[index].bookID);
                    $(card).append(bookHTML);
                    row.append(card);
                    totalItem++;
                }
            } else {
                break
            }
        }
        $(selector).html(row);
    },
    //append dữ liệu sách đang mượn vào thẻ card
    //sử dụng trong trang account
    appendBorrowDataToCard(data, selector) {
        //lấy ra ngày hiện tại
        var row = $(`<div class="row mt-2"></div>`);
        data.forEach(book => {
            var bookImgBase64String = "data:image/jpg;base64," + book.bookImageUriBase64String;
            var card = $(`<div class="col-6 col-md-4 col-sm-4 col-xl-4 col-lg-4 portfolio-item">
                            </div>`)
            var bookHTML = $(`
            <div class="card h-100 rounded shadow">
                    <img class="card-img-top w-100 p-1 mx-auto" src="` + bookImgBase64String + `" alt="" style="height: 20.5rem">
                    <div class="card-body">
                        <p class="card-title text-truncate text-uppercase text-center" style="font-weight: 600">` + book.bookName + `</p>
                    </div>
                </div>`)
                // ` + checkDateHTML + `
                // <div class="card-body">
                //     <p class="text-truncate text-center">` + book.bookAuthor + `</p>
                //     <p class="card-title text-truncate text-uppercase text-center" style="font-weight: 600">` + book.bookName + `</p>
                // </div>
            bookHTML.data('bookId', book.bookID);
            bookHTML.data('borrowData', book);
            $(card).append(bookHTML);
            row.append(card);
        })
        $(selector).html(row);
    },
    //append dữ liệu comment
    //sử dụng trong trang book-detail
    appendCommentData(data, userID) {
        var commentGroupDiv = $(`<div></div>`);
        data.forEach(comment => {
            //convert datetime
            var timeComment = this.getDateTimeString(comment.createdDate);
            //lấy string biểu diễn avatar
            var avatarBase64String = "data:image/jpg;base64," + comment.avatarUrl;
            //tạo nội dung ảnh đại diện
            var commentHTML = $(`<div class="media mb-4">
                                    <img class="d-flex mr-3 rounded-circle avatar-comment" src=` + avatarBase64String + ` alt="">
                                </div>`);
            //tạo nội dung gồm tên user, thời gian và nội dung bình luận
            var commentContentHTML = $(`<div class="media-body">
                                            <div class="row">
                                                <h5 class="mt-0 mx-3">` + comment.userName + `</h5>
                                                <small class="mt-1">` + timeComment + `</small>
                                            </div>
                                            <div class="row">
                                                <div class="col-8 text-break">
                                                    <p>` + comment.comment + `</p>
                                                </div>
                                                <div class="col-4">
                                                </div>
                                            </div>
                                        </div>`);
            //tạo nội dung gồm button sửa và xóa                                
            var commentActionHTML = $(`<div class="bg-white">
                                            <button class="btn btn-outline-success" type="button">Cập nhật</button>
                                            <button class="btn btn-outline-danger" type="button">Xóa</button>
                                            <button class="btn btn-outline-secondary" type="button">Hủy bỏ</button>
                                    </div>`);
            //nếu bình luận thuộc về user hiện tại
            if (comment.userId == userID) {
                //ẩn button cho bình luận của user hiện tại nếu có
                commentContentHTML.children('.row').children('.col-4').html(commentActionHTML).hide();
                //khai báo object chứa btn sửa bình luận
                var updateCommentBtn = $(commentActionHTML.children())[0],
                    //khai báo object chứa btn xóa bình luận
                    deleteCommentBtn = $(commentActionHTML.children())[1],
                    //khai báo object chứa btn xóa bình luận
                    dismissCommentBtn = $(commentActionHTML.children())[2];
                //gán id bình luận cho data
                commentActionHTML.data('commentId', comment.commentId);
                //gán nội dung bình luận cho data
                commentActionHTML.data('commentContent', comment.comment);
                //gán sự kiện khi click vào bình luận của user hiện tại
                commentContentHTML.children('.row').children('.col-8').on('click', 'p', function() {
                    //hiện button sửa, xóa, hủy
                    commentContentHTML.children('.row').children('.col-4').show();
                    //khai báo biến lưu nội dung bình luận
                    var commentContent = commentActionHTML.data('commentContent');
                    //thay đổi ui bình luận
                    var inputCommentHTML = $(`<textarea class="form-control w-100">` + commentContent + `</textarea>`);
                    commentContentHTML.children('.row').children('.col-8').html(inputCommentHTML);
                });
                //gán sự kiện cho nút xóa bình luận
                $(deleteCommentBtn).on('click', function(event) {
                    //lấy ra commentId
                    var commentId = $(event.target).parent().data("commentId");
                    //gọi hàm thực thi khi nút xóa bình luận được click
                    commonJS.deleteCommentEvent(commentId);
                });
                //gán sự kiện cho nút sửa bình luận
                $(updateCommentBtn).on('click', function(event) {
                    //lấy ra id bình luận
                    var commentId = $(event.target).parent().data("commentId");
                    //lấy ra input bình luận của người dùng
                    var newCommentVal = $(commentContentHTML.children('.row').children('.col-8').children('textarea')).val();
                    if (newCommentVal.trim().length > 0) {
                        //gọi hàm thực thi khi nút xóa bình luận được click
                        commonJS.updateCommentEvent(commentId, newCommentVal);
                    } else {}
                });
                //gán sự kiện cho nút hủy
                $(dismissCommentBtn).on('click', function(event) {
                    //khai báo biến lưu nội dung bình luận
                    var commentContent = $(event.target).parent().data('commentContent');
                    //tạo ui cho bình luận
                    var commentContentDiv = $(`<p>` + commentContent + `</p>`);
                    //thay đổi ui bình luận
                    commentContentHTML.children('.row').children('.col-8').html(commentContentDiv);
                    //ẩn button sửa, xóa, hủy
                    commentContentHTML.children('.row').children('.col-4').hide();
                });
            }
            //nếu bình luận không phải của user hiện tại 
            else {}
            //gán nội dung bình luận
            commentHTML.append(commentContentHTML);
            commentGroupDiv.append(commentHTML);
        });
        //gán list bình luận
        $('#commentContentDiv').html(commentGroupDiv);
    },
    //xử lý sự kiện cho nút xóa bình luận
    //sử dụng trong màn book-detail
    deleteCommentEvent(commentId) {
        //alert(commentId);
        //gán commentId vào modal xóa bình luận
        $('#modalDeleteComment').data('commentId', commentId);
        //hiện modal Gia hạn
        $('#modalDeleteComment').modal('show');
    },
    //xử lý sự kiện cho nút xóa bình luận
    //sử dụng trong màn book-detail
    updateCommentEvent(commentId, commentContent) {
        //alert(commentId);
        //gán commentId vào modal cập nhật bình luận
        $('#modalUpdateComment').data('commentId', commentId);
        //gán commentId vào modal cập nhật bình luận
        $('#modalUpdateComment').data('commentContent', commentContent);
        //hiện modal Gia hạn
        $('#modalUpdateComment').modal('show');
    },
    //gán sự kiện khi ấn nút enter
    //sử dụng trong trang login, signup, change-pass
    addEnterEvent(action) {
        var enterClicked = false;
        $(document).on("keyup", function(event) {
            if (event.keyCode == 13) {
                //alert("Enter clicked");
                enterClicked = true
                event.preventDefault()
                action()
            }
        });
    },
    //lấy giá trị tham số trên url
    //sử dụng trong trang book-detail, search
    getURLParameter(sPageURL, option, sParam) {
        //nếu lấy chuỗi chứa tất cả tham số từ url
        if (option == Enum.SplitOption.ALL) {
            return sPageURL;
        }
        //ngược lại, tìm tham số phù hợp trong url
        else {
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    //decodeUriComponent giúp giải mã chuỗi có kí tự đặc biệt, ví dụ "%20" -> " "
                    return decodeURIComponent(sParameterName[1]);
                }
            }
        }
    },
    //lấy số sách đang mượn hiện tại của người dùng
    //sử dụng trong trang book-detail
    getBorrowListSize() {
        //lấy ra danh sách mượn của user trong localStorage
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
        //lấy ra số lượng sách đang mượn
        return borrowList.length;
    },
    //kiểm tra sách hiện tại có đang mượn hay không
    //sử dụng trong trang book-detail
    checkValidBookBorrow(bookId) {
        //khai báo kết quả trả về
        var result = true;
        //lấy ra danh sách mượn của user trong localStorage
        var borrowList = JSON.parse(localStorage.getItem("borrowList") || "[]");
        //kiểm tra id sách hiện tại có nằm trong danh sách mượn hay không
        if (borrowList.length > 0) {
            //kiểm tra id sách hiện tại trong danh sách mượn
            for (let index = 0; index < borrowList.length; index++) {
                //nếu id sách có trong danh sách
                if (bookId == borrowList[index].bookID) {
                    result = true;
                    //thoát vòng lặp
                    break
                }
                //nếu không
                else {
                    result = false;
                }
            }
        } else {
            result = false;
        }
        return result;
    },
    //lưu danh sách mượn của người dùng vào localStorage
    //sử dụng trong trang book-detail, account
    saveBorrowListToLocal(data) {
        var bookBorrowList = [];
        data.forEach(item => {
            var borrowItem = {};
            borrowItem.bookBorrowID = item.bookBorrowID;
            borrowItem.bookID = item.bookID;
            borrowItem.borrowDate = commonJS.getDateString(new Date(item.borrowDate), Enum.ConvertOption.YEAR_FIRST);
            borrowItem.returnDate = commonJS.getDateString(new Date(item.returnDate), Enum.ConvertOption.YEAR_FIRST);
            borrowItem.status = item.bookBorrowStatus;
            bookBorrowList.push(borrowItem);
        });
        //lưu borrowList vào local storage
        localStorage.setItem("borrowList", JSON.stringify(bookBorrowList));
    },
    //gán danh sách loại sách vào thành phần HTML
    //sử dụng trong trang search
    appendCategoryListToHTML(list, selectorID) {
        var selector = $(selectorID);
        list.forEach(item => {
            //khai báo và gán giá trị cho thẻ option
            var optionHTML = $(`<option value=` + item.bookCategoryCode + `>` + item.bookCategoryName + `</option>`);
            //gán id cho data thẻ option
            optionHTML.data("id", item.bookCategoryId);
            selector.append(optionHTML);
        });
    },
    //build url
    //sử dụng cho trang search
    buildUrlSearchPage(searchValue, searchType, categoryID, startYear, finishYear, sortName, sortType) {
        var url = "";
        if (searchValue.trim().length > 0) {
            url = "&searchValue=" + searchValue;
        }
        if (searchType > 0) {
            url = url + "&searchType=" + searchType;
        }
        if (categoryID && categoryID.trim().length > 0) {
            url = url + "&paramBookCategoryID=" + categoryID;
        }
        if (startYear > 0) {
            url = url + "&startYear=" + startYear;
        }
        if (finishYear > 0) {
            url = url + "&finishYear=" + finishYear;
        }
        if (sortName > 0) {
            url = url + "&maxValueType=" + sortName;
        }
        if (sortType > 0) {
            url = url + "&orderByType=" + sortType;
        }
        return url;
    },
    //thêm ui hiển thị danh sách rỗng
    //sử dụng ở trang index, search, account, book-detail
    addEmptyListHTML(title, parentElementID, subElement) {
        $(parentElementID).empty();
        var emptyDiv = $(`<div class="my-5">
                            <div class="row d-flex justify-content-center">
                                <img class="empty-list-image" src="../content/img/empty-list.png">
                            </div>
                            <div class="row d-flex justify-content-center mt-3">
                                <p class="empty-list-title">` + title + `</p>
                            </div>
                        </div>`);
        $(parentElementID).html(emptyDiv);
        if (subElement) {
            $(emptyDiv).append(subElement);
        }
    },
    //thêm ẩn hiện mật khẩu
    //sử dụng ở trang login, signup, account
    togglePassword(eye, passwordInput) {
        ($(passwordInput).attr("type") == "password") ? ($(passwordInput).prop("type", "text")) : ($(passwordInput).prop("type", "password"));
        $(eye).toggleClass('fa-eye-slash');
    }
}