//hằng số lưu giá trị file hợp lệ
const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
//biến lưu giá trị ban đầu của user, trả về từ /api/UserAccount/{userId}
var userData = {}

$(document).ready(function() {
    //reload ngay khi truy cập trang account

    accountJS = new AccountJS()
})

//class quản lý các sự kiện trong trang account.html
class AccountJS extends BaseJS {
    constructor() {
        super();
        this.loadUserData();
        this.loadUserAvatar();
        this.loadBookBorrowList();
        this.initEvent();
    }

    ///load dữ liệu cá nhân của user
    loadUserData() {
        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID = userObject.userID;
        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/UserAccount/" + userID,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                //gán data
                userData = res.data;
                //khai báo các biến và gán giá trị từ userData object
                //tên đầy đủ của người dùng
                var userFullNameTxt = ((userData.firstName) ? userData.firstName + " " : "") + ((userData.lastName) ? userData.lastName : "");
                if (userFullNameTxt.trim().length == 0) { userFullNameTxt = "chưa có" }
                //địa chỉ người dùng
                var userAddressTxt = ((userData.ward) ? userData.ward + ", " : "") +
                    ((userData.district) ? userData.district + ", " : "") +
                    ((userData.province) ? userData.province + ", " : "") +
                    ((userData.country) ? userData.country : "").trim();
                if (userAddressTxt.length == 0) { userAddressTxt = "chưa xác định" }
                if (userAddressTxt.charAt(userAddressTxt.length - 1) == ",") { userAddressTxt = userAddressTxt.slice(0, -1) }
                //email của người dùng
                var userEmailTxt = (userData.email || userData.email.length > 0) ? userData.email : "chưa có";
                var userAge = (userData.age || userData.age > 0) ? userData.age : "chưa có";
                //gán giá trị và thuộc tính cho các thành phần thẻ p trên trang account
                $('#userFullName').text(userFullNameTxt);
                $('#userAddress').text(userAddressTxt);
                $('#userEmail').text(userEmailTxt);
                $('#userName').text(userData.userName);
                $('#userPassword').attr('value', userData.password);
                $('#userAge').text(userAge);
                //gán giá trị và thuộc tính cho các thành phần input trong modal trên trang account
                $('#firstNameInput').val(userData.firstName);
                $('#lastNameInput').val(userData.lastName);
                $('#ageInput').val(userData.age);
                $('#wardInput').val(userData.ward);
                $('#districtInput').val(userData.district);
                $('#provinceInput').val(userData.province);
                $('#countryInput').val(userData.country);
                $('#emailInput').val(userData.email);
                $('#passwordInput').val(userData.password);
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            } else {
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            //show alert
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    //load dữ liệu ảnh đại diện của user
    loadUserAvatar() {
        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID = userObject.userID,
            userAvatarURL = userObject.avatarUrl;
        //call api
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/UserAccount/GetImageFromUrl" + "?userID=" + userID + "&avatarUrl=" + userAvatarURL,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                var userData = res.data;
                //commonBaseJS.showToastMsgSuccess("Lấy dữ liệu thành công.");
                //gán giá trị cho thuộc tính của thành phần image trên trang account.html và thanh nav bar
                //cập nhật thay đổi mới nhất sau khi setUserAvatar() thực thi thành công
                if (userData.userAvatarBase64String != null) {
                    $('#userAvatar').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
                    $('#userAvatarNav').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
                }
            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    //load danh sách mượn
    loadBookBorrowList() {
        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID = userObject.userID;
        //hiện loading
        commonBaseJS.showLoadingData(1);
        //call api
        //cache: false - gọi lại ajax khi ấn back button trên browser
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookBorrow/GetPagingData?userId=" + userID,
            contentType: "application/json",
            cache: false
        }).done(function(res) {
            //nếu server xử lý thành công
            if (res.success && res.data && res.data.length > 0) {
                //gán data
                var list = res.data;
                //gọi hàm render html lên ui
                //commonJS
                commonJS.appendBorrowDataToCard(list, "#borrowListContent");
                //lưu danh sách mượn mới nhất vào localStorage
                commonJS.saveBorrowListToLocal(list);
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //gán xử lý sự kiện hover chuột vào 1 card sách
                $('#borrowListContent .card.h-100').hover(
                    accountJS.hoverHandlerIn,
                    accountJS.hoverHandlerOut);
                $('#borrowListContent .card.h-100').mousemove(function(e) {
                    $("#popUpDiv")
                        .css('width', '200px!important')
                        .css('background-color', '#fff')
                        .css('position', 'absolute')
                        .css('top', e.pageY - 25)
                        .css('left', e.pageX + 50);
                    $('#popUpDiv > .row > div > p, h5').css('font-size', '14px');
                });
            } else {
                //thêm giao diện hiển thị list rỗng
                var borrowDivHTML = $(`<div class="row d-flex justify-content-center mt-3">
                                        <button id="borrowBtn" class="btn btn-success">Mượn sách</button>
                                    </div>`);
                //gán sự kiện mở trang tìm kiếm cho button vừa tạo
                $(document).on('click', '#borrowBtn', function() {
                    window.open('search.html', "_self")
                });
                //thêm empty list html
                commonJS.addEmptyListHTML("Bạn chưa mượn cuốn sách nào", '#borrowListContent', borrowDivHTML);
                //ẩn loading
                commonBaseJS.showLoadingData(0);
            }
        }).fail(function(res) {
            //thêm empty list html
            commonJS.addEmptyListHTML("Không thể hiển thị sách", "#borrowListContent");
            //ẩn loading
            commonBaseJS.showLoadingData(0);
        })
    }

    //gán sự kiện trong trang
    initEvent() {
        this.showImgPreviewModal();
        //sự kiện khi click nút Lưu ảnh trong modal avatar
        $('#confirmImg').on('click', this.setUserAvatar);
        //sự kiện khi click nút Xác nhận trong modal cập nhật thông tin
        $('#updateInforBtn').on('click', this.updateUserInfor.bind(this));
        // sự kiện khi click nút Xác nhận trong modal cập nhật mật khẩu
        $('#updatePasswordBtn').on('click', this.updateUserPassword.bind(this));
        //sự kiện khi click nút Hủy bỏ trong modal cập nhật thông tin
        $('#modalUpdateInfor #dismissUpdateInfor').on('click', function() {
            //đóng modal
            $('#modalUpdateInfor').modal('hide')
                //xóa alert validate nếu có
            if ($('#emailAlert')) {
                $('#emailAlert').remove()
            }
            if ($('#firstNameAlert')) {
                $('#firstNameAlert').remove()
            }
            if ($('#lastNameAlert')) {
                $('#lastNameAlert').remove()
            }
            //lấy dữ liệu từ biến userData
            //gán giá trị cho các trường input trong modal
            $('#firstNameInput').val(userData.firstName);
            $('#lastNameInput').val(userData.lastName);
            $('#ageInput').val(userData.age);
            $('#wardInput').val(userData.ward);
            $('#districtInput').val(userData.district);
            $('#provinceInput').val(userData.province);
            $('#countryInput').val(userData.country);
            $('#emailInput').val(userData.email);
        });
        // sự kiện khi click nút Hủy bỏ trong modal cập nhật mật khẩu
        $('#modalUpdatePassword #dismissUpdatePass').on('click', function() {
            //đóng modal
            $('#modalUpdatePassword').modal('hide')

            //xóa alert validate nếu có
            if ($('#newPasswordAlert')) {
                $('#newPasswordAlert').remove()
            }
            if ($('#reNewPassAlert')) {
                $('#reNewPassAlert').remove()
            }
            if ($('#passwordAlert')) {
                $('#passwordAlert').remove()
            }
            //lấy dữ liệu từ input #userPassword
            //gán giá trị cho các trường input trong modal
            var userPassword = $('#userPassword').val()
            $('#passwordInput').val(userPassword);
            $('#newPasswordInput').val("");
            $('#reNewPasswordInput').val("");
        });
        //gán xử lý sự kiện khi click vào 1 card sách
        $('#borrowListContent').on('click', '.card.h-100', this.cardOnClick);
        //gán ẩn hiện mật khẩu cho input nhập mật khẩu
        $(document).on('click', '#togglePassword', function() {
            commonJS.togglePassword('#togglePassword', '#passwordInput');
        });
        $(document).on('click', '#toggleNewPassword', function() {
            commonJS.togglePassword('#toggleNewPassword', '#newPasswordInput');
        });
        $(document).on('click', '#toggleRenewPassword', function() {
            commonJS.togglePassword('#toggleRenewPassword', '#reNewPasswordInput');
        });
    }

    //xử lý sự kiện sau khi chọn file
    //tham khảo:https://tungnt.net/download-va-upload-anh-su-dung-asp-net-web-api-tren-asp-net-mvc/?fbclid=IwAR2hYsV3SOdp-E2TYrNdmFSx6I6x6pOQz88GhKu8ljKLVQ9VdzUAKA2PpMc
    showImgPreviewModal() {
        $('#chooseImg').change(function() {
            //kiểm tra file input của người dùng
            if (this.files && this.files[0]) {
                //kiểm tra file hợp lệ
                //nếu file không phải định dạng jpg, jpeg, gif, png
                if (!validImageTypes.includes(this.files[0]['type'])) {
                    commonBaseJS.showToastMsgFailed("Định dạng file không hợp lệ (gif, jpeg, jpg, png)")
                } else {
                    $('#previewImg').attr('style', 'width: 15rem; height: 15rem');
                    $('#modalUpdateAvatar').modal('show');
                    //When choose image complete using FileReader to convert image to Base64 string
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $('#previewImg').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(this.files[0])
                }
            }
        })
    }

    //xử lý sự kiện khi click nút "Đặt ảnh đại diện"
    setUserAvatar() {
        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID = userObject.userID,
            //tạo data
            data = {
                userId: userID,
                userAvatarBase64String: $("#previewImg").attr("src").split(",")[1]
            };
        commonBaseJS.showLoadingData(1);
        //call api
        $.ajax({
            method: "POST",
            url: Enum.URL.HOST_URL + "api/UserAccount/SaveImageToUrl",
            contentType: "application/json",
            data: JSON.stringify(data)
        }).done(function(res) {
            if (res.success) {
                //ẩn modal thay đổi avatar
                commonBaseJS.showLoadingData(0);
                $('#modalUpdateAvatar').modal('hide');
                commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                //cập nhật thông tin user vào localStorage
                userObject.avatarUrl = res.data
                localStorage.setItem("user", JSON.stringify(userObject));
                //gọi hàm loadUserAvatar() cập nhật ảnh mới nhất
                accountJS.loadUserAvatar();
            } else {
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showLoadingData(0);
            //show alert
            commonBaseJS.showToastMsgFailed("Cập nhật không thành công.");
        })
    }

    //validate dữ liệu nhập vào từ người dùng (modal cập nhật thông tin)
    validateUserInforInput() {
        //khai báo kết quả trả về
        var result = true,
            alertDiv,
            //lấy email input của người dùng
            emailInput = $('#emailInput').val().trim(),
            firstNameInput = $('#firstNameInput').val().trim(),
            lastNameInput = $('#lastNameInput').val().trim(),
            //validate email
            emailValid = (function validateEmail(email) {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            })(emailInput),
            //validate tên họ và tên đệm
            firstNameValid = (function validateFirstName(firstName) {
                return firstName.length > 0;
            })(firstNameInput),
            //validate tên riêng
            lastNameValid = (function validateLastName(lastName) {
                return lastName.length > 0;
            })(lastNameInput);
        //nếu email, tên họ, tên đệm chưa được validate
        //thêm thành phần html
        if (!firstNameValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="firstNameAlert" class="row mb-1">
                <small class="form-text text-danger col-12">Không được để trống trường này.</small>
            </div>`)
            if ($('#firstNameAlert')) {
                $('#firstNameAlert').remove()
            }
            $('#firstNameDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#firstNameAlert')) {
                $('#firstNameAlert').remove()
            }
        }
        if (!lastNameValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="lastNameAlert" class="row mb-1">
                <small class="form-text text-danger col-12">Không được để trống trường này.</small>
            </div>`)
            if ($('#lastNameAlert')) {
                $('#lastNameAlert').remove()
            }
            $('#lastNameDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#lastNameAlert')) {
                $('#lastNameAlert').remove()
            }
        }
        if (!emailValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="emailAlert" class="row mb-1">
                <small class="form-text text-danger col-12">Email chưa đúng định dạng.</small>
            </div>`)
            if ($('#emailAlert')) {
                $('#emailAlert').remove()
            }
            $('#emailDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#emailAlert')) {
                $('#emailAlert').remove()
            }
        }
        //trả về kết quả validate
        return result;
    }

    //validate dữ liệu nhập vào từ người dùng (modal cập nhật mật khẩu)
    validatePasswordInput() {
        //khai báo kết quả trả về
        var result = true,
            alertDiv,
            //lấy password input của người dùng
            passwordInput = $('#passwordInput').val().trim(),
            newPasswordInput = $('#newPasswordInput').val().trim(),
            reNewPasswordInput = $('#reNewPasswordInput').val().trim(),
            //password chứa tối thiểu 5 kí tự và không có khoảng trắng
            passwordValid = (function validatePassword(password) {
                if (password.includes(" ")) {
                    return false
                } else {
                    return password.length >= 5
                }
            })(passwordInput),
            //password mới chứa tối thiểu 5 kí tự và không có khoảng trắng
            newPasswordValid = (function validateNewPassword(password) {
                if (password.includes(" ")) {
                    return false
                } else {
                    return password.length >= 5
                }
            })(newPasswordInput);
        //password mới và nhập lại password mới phải trùng khớp
        if (newPasswordInput) {
            var reNewPasswordValid = (function validateRePassWord(rePassword, password) {
                return rePassword == password
            })(reNewPasswordInput, newPasswordInput)
        }
        //nếu password, password mới và nhập lại pass chưa được validate
        //thêm thành phần html
        if (!passwordValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="passwordAlert" class="row mb-1">
                <label class="col-4"></label>
                <small class="form-text text-danger col-6">Không được để trống trường này.</small>
            </div>`)
            if ($('#passwordAlert')) {
                $('#passwordAlert').remove()
            }
            $('#passwordDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#passwordAlert')) {
                $('#passwordAlert').remove()
            }
        }
        if (!newPasswordValid) {
            if ($('#newPasswordAlert')) {
                $('#newPasswordAlert').remove()
            }
            //khai báo thành phần alert
            alertDiv = $(`<div id="newPasswordAlert" class="row mb-1">
                <label class="col-4"></label>
                <small class="form-text text-danger col-6">Mật khẩu chứa tối thiểu 5 kí tự.</small>
            </div>`)
            $('#newPasswordDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#newPasswordAlert')) {
                $('#newPasswordAlert').remove()
            }
        }
        if (!reNewPasswordValid && newPasswordValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="reNewPassAlert" class="row mb-1">
                <label class="col-4"></label>
                <small class="form-text text-danger col-6">Nhập lại mật khẩu mới chưa đúng.</small>
            </div>`)
            if ($('#reNewPassAlert')) {
                $('#reNewPassAlert').remove()
            }
            $('#reNewPasswordDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#reNewPassAlert')) {
                $('#reNewPassAlert').remove()
            }
        }
        //trả về kết quả validate
        return result;
    }

    //xử lý sự kiện khi click nút Xác nhận (modal cập nhật thông tin)
    updateUserInfor() {
        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID = userObject.userID;
        //khai báo validate email input
        var validateUserInput = accountJS.validateUserInforInput();
        //nếu email được validate
        if (validateUserInput) {
            //lấy input từ người dùng
            var userFirstName = $('#firstNameInput').val().trim(),
                userLastName = $('#lastNameInput').val().trim(),
                userAge = parseInt($('#ageInput').val()),
                userWard = $('#wardInput').val().trim(),
                userDistrict = $('#districtInput').val().trim(),
                userProvince = $('#provinceInput').val().trim(),
                userCountry = $('#countryInput').val().trim(),
                userEmail = $('#emailInput').val().trim();
            //tạo data và gán trường dữ liệu
            var data = {
                userId: userID,
                email: userEmail,
                firstName: userFirstName,
                lastName: userLastName,
                age: userAge,
                ward: userWard,
                district: userDistrict,
                province: userProvince,
                country: userCountry
            };
            commonBaseJS.showLoadingData(1);
            //call api
            $.ajax({
                method: "PUT",
                url: Enum.URL.HOST_URL + "api/UserAccount/UpdateUserInfo",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).done(function(res) {
                if (res.success) {
                    //đóng modal
                    $('#modalUpdateInfor').modal('hide');
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                    //gọi loadUserData() để cập nhật dữ liệu mới nhất
                    accountJS.loadUserData()
                } else {
                    commonBaseJS.showLoadingData(0);
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showLoadingData(0);
                commonBaseJS.showToastMsgFailed("Cập nhật không thành công.");
            })
        } else {
            //commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý, cập nhật không thành công.");
        }
    }

    //xử lý sự kiện khi click nút Xác nhận thông tin (modal cập nhật mật khẩu)
    updateUserPassword() {
        // lấy user data từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user")),
            userID = userObject.userID,
            //khai báo validate email input
            validateUserInput = accountJS.validatePasswordInput();
        //nếu email được validate
        if (validateUserInput) {
            //lấy input từ người dùng
            var userPassword = $('#passwordInput').val().trim(),
                userNewPassword = $('#newPasswordInput').val().trim();
            //tạo data và gán trường dữ liệu
            var data = {
                userId: userID,
                passWordOld: userPassword,
                passWordNew: userNewPassword
            };
            commonBaseJS.showLoadingData(1);
            //call api
            $.ajax({
                method: "PUT",
                url: Enum.URL.HOST_URL + "api/UserAccount/UpdateUserPassWord",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).done(function(res) {
                if (res.success) {
                    //đóng modal
                    $('#modalUpdatePassword').modal('hide');
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                    //gọi loadUserData() để cập nhật dữ liệu mới nhất
                    accountJS.loadUserData()
                } else {
                    commonBaseJS.showLoadingData(0);
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showLoadingData(0);
                commonBaseJS.showToastMsgFailed("Cập nhật không thành công.");
            })
        } else {
            //commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý, cập nhật không thành công.");
        }
    }

    //chi tiết xử lý sự kiện khi click vào 1 card sách
    cardOnClick() {
        //lấy ra id book được click
        let selectedBookId = $(this).data('bookId');
        //tạo url với param chứa id đầu sách vừa được click
        var bookDetailStr = "book-detail.html?id=" + selectedBookId;
        //mở trang book-detail
        window.open(bookDetailStr, "_self")
    }

    //chi tiết xử lý khi hover vào 1 card sách
    hoverHandlerIn() {
        var borrowData = $(this).data("borrowData"),
            borrowStatusTxt = "",
            borrowDate = "",
            returnDate = "";
        $('#borrowWarning').children().remove();
        if (borrowData.borrowStatus == Enum.Status.VALID) {
            if (borrowData.bookBorrowStatus == Enum.Status.VALID) {
                var dateNow = new Date(),
                    dateDiff = Math.floor((new Date(borrowData.returnDate) - dateNow) / (1000 * 60 * 60 * 24)),
                    classWarning = (dateDiff >= 0) ? ((dateDiff > 2) ? 'alert-success' : 'alert-warning') : 'alert-danger',
                    txtWarning = (dateDiff >= 0) ? ("Thời hạn mượn còn " + dateDiff + " ngày") : "Quá hạn trả " + Math.abs(dateDiff) + " ngày",
                    divWarning = $(`<div class="alert ` + classWarning + `" style="font-size: 14px;">` + txtWarning + `</div>`)
                borrowStatusTxt = "Đang mượn";
                borrowDate = commonJS.getDateString(new Date(borrowData.borrowDate), Enum.ConvertOption.DAY_FIRST);
                returnDate = commonJS.getDateString(new Date(borrowData.returnDate), Enum.ConvertOption.DAY_FIRST);
                $('#borrowWarning').children().remove();
                $('#borrowWarning').append(divWarning);
            } else {
                borrowStatusTxt = "Chờ mượn sách";
                borrowDate = "Chưa có";
                returnDate = "Chưa có";
            }
        }
        $('#bookName').html(borrowData.bookName);
        $('#bookAuthor').html(borrowData.bookAuthor);
        $('#borrowStatus').html(borrowStatusTxt);
        $('#borrowDate').html(borrowDate);
        $('#returnDate').html(returnDate);
        $('#popUpDiv').show();
    }

    //chi tiết xử lý khi hover ra khỏi 1 card sách
    hoverHandlerOut() {
        $('#popUpDiv').hide();
    }
}