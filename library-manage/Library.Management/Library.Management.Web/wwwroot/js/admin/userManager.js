const RECORD_PER_PAGE = 20;
//khai báo trang hiển thị mặc định
//trang đầu tiên
const PAGE_DEFAULT = 1;
//khai báo số trang hiển thị mặc định trên thanh pagination
//1 trang
const VISIBLE_PAGE_DEFAULT = 1;
//khai báo biến toàn cục lưu tổng số bản ghi sách sau tìm kiếm và số trang hiển thị
var totalBookRecord;
var totalPages;
var listID = [];

$(document).ready(function () {
    var setting = new UserManager();
    var userObject = JSON.parse(localStorage.getItem("user"));
});

class UserManager {
    constructor() {
        this.loadDataUser();
        $(".fa-search").on('click', this.onclickSearch.bind(this));
        this.initEvents();
    }

    initEvents() {
        $(".tdIsAdmin").on('change', this.changeCheckboxAdmin.bind(this));
        $(".btnDelete").on('click', this.onClickDeleteUser.bind(this));
        $("#confirmDeleteUser").on('click', this.confirmDeleteUser.bind(this));
    }

    loadDataUser() {
        var self = this,
            searchValue = $('.searchInp').val();
        debugger
        $('#lstUserGrid').empty();

        $.ajax({
            method: "GET",
            url: "/api/UserAccount/GetPagingData?paramUserName=" + searchValue.trim() + "&pageNumber=" + PAGE_DEFAULT + "&pageSize=" + RECORD_PER_PAGE,
            async: false,
            contentType: "application/json",
            beforeSend: function () {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function (res) {
            if (res.success && res.data) {
                var lstData = res.data.dataItems;
                commonBaseJS.showLoadingData(0);
                if (lstData.length > 0) {
                    $('#noUsers').hide();

                    totalBookRecord = res.data.totalRecord;

                    //tính toán số trang hiển thị và gán cho biến toàn cục
                    totalPages = Math.ceil(totalBookRecord / RECORD_PER_PAGE);

                    //gọi hàm loadPaginationSearchResult
                    //phân trang dữ liệu
                    self.loadPaginationSearchResult(totalPages, searchValue);

                    $.each(lstData, function (index, user) {
                        var userHTML = `
                            <tr userID="${user.userId}" typeUser="${user.conditionAccount}">
                                <td>${index + 1}</td>
                                <td>${user.userName}</td>
                                <td>${user.email}</td>
                                <td>${(user.firstName != null) ? user.firstName : ""} ${(user.lastName != null) ? user.lastName : ""}</td>
                                <td>${(user.age != null) ? user.age : ""}</td>
                                <td>${(user.country != null) ? user.country : ""}</td>
                                <td align="center"><input type="checkbox" class="tdIsAdmin" style="height: 25px !important;" ${user.conditionAccount == 1 ? "" : "checked"} /></td >
                                <td align="center"><button type="button" class="fa fa-trash-o btn btn-light btnDelete" title="Xóa"></button></td>
                            </tr>`

                        $(userHTML).data('userID', user.userId)

                        $('#lstUserGrid').append($(userHTML))
                    });
                }
                self.initEvents();
            } else {
                $('#noUsers').show();
                commonBaseJS.showToastMsgFailed("Lấy dữ liệu thất bại")
            }
        }).fail(function (res) {
            $('#noUsers').show();
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công")
        })
    }

    changeCheckboxAdmin(event) {
        var checkBox = event.target;
        var self = this;

        if (this.validatePermissionEdit(checkBox) && this.validateAdmin(checkBox)) {
            var data = {
                UserID: checkBox.closest('tr').getAttribute('userID'),
                ConditionAccount: (checkBox.checked) ? 2 : 1
            };

            $.ajax({
                method: "POST",
                url: "/api/UserAccount/ChangeUserAdmin/",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function () {
                    //show loading
                    commonBaseJS.showLoadingData(1);
                },
            }).done(function (res) {
                commonBaseJS.showLoadingData(0);
                if (res.success) {
                    $('#lstUserGrid').empty();
                    self.loadDataUser();
                    commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                } else {
                    commonBaseJS.showToastMsgFailed("Cập nhật thất bại")
                }
            }).fail(function (res) {
                commonBaseJS.showLoadingData(0);
                commonBaseJS.showToastMsgFailed("Cập nhật không thành công")
            })
        } else {
            checkBox.checked = !checkBox.checked;
        }
    }

    onClickDeleteUser(event) {
        var itemDel = event.target;
        var self = this;

        if (this.validatePermissionEdit(itemDel) && this.validateDelete(itemDel)) {
            listID = [];
            listID.push(itemDel.closest('tr').getAttribute('userID'));
            $('#modalConfirmDelete').modal('show'); 
        }
    }

    confirmDeleteUser() {
        var self = this;
        $.ajax({
            method: "DELETE",
            url: "/api/UserAccount/GroupID/",
            data: JSON.stringify(listID),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                //show loading
                commonBaseJS.showLoadingData(1);
            },
        }).done(function (res) {
            commonBaseJS.showLoadingData(0);
            if (res.success) {
                $('#lstUserGrid').empty();
                self.loadDataUser();
                $('.fade').hide();
                commonBaseJS.showToastMsgSuccess("Xóa người dùng thành công.");
            } else {
                commonBaseJS.showToastMsgFailed("Xóa người dùng không thành công")
            }
        }).fail(function (res) {
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Xóa người dùng không thành công")
        })
    }

    validateDelete(element) {
        //Check không được xóa chính mình khỏi danh sách
        var bvalid = true,
            thisTrId = element.closest('tr').getAttribute('userID');

        if (userObject.userID == thisTrId) {
            bvalid = false;
        }

        if (!bvalid) {
            $('.content-notify').text('Bạn không được xóa chính mình khỏi danh sách người dùng.');
            $('#modalNotification').modal('show'); 
        }

        return bvalid;
    }

    validateAdmin(element) {
        var bvalid = false,
            checkBox = $(".tdIsAdmin"),
            thisTrId = element.closest('tr').getAttribute('userID'),
            typeUser = element.closest('tr').getAttribute('typeUser');

        if (userObject.conditionAccount == 2 && typeUser == 1) {
            $('.content-notify').text('Bạn không có quyền cấp tài khoản admin cho người dùng.');
            $('#modalNotification').modal('show'); 
        }
        else {
            if (userObject.userID == thisTrId) {
                $('.content-notify').text('Bạn không được gỡ quyền admin của mình.');
                $('#modalNotification').modal('show'); 
            } else {

                if (!element.checked) {
                    $.each(checkBox, function (index, item) {
                        if (item.checked) {
                            bvalid = true;
                        }
                    });
                } else {
                    bvalid = true;
                }

                if (!bvalid) {
                    $('.content-notify').text('Phải có ít nhất 1 admin.');
                    $('#modalNotification').modal('show'); 
                }
            }
        }

        return bvalid;
    }

    validatePermissionEdit(element) {
        var bValid = true,
            typeUser = element.closest('tr').getAttribute('typeUser');

        if (userObject.conditionAccount == 3) {
            return bValid;
        }
        else if (userObject.conditionAccount == 2) {
            if (parseInt(typeUser) == 2 || parseInt(typeUser) == 3) {
                bValid = false;
                $('.content-notify').text('Bạn không có quyền thay đổi thông tin của tài khoản admin khác.');
                $('#modalNotification').modal('show'); 
            }
        }
        return bValid;
    }

    onclickSearch() {
        this.loadDataUser();
    }

    loadPaginationSearchResult(totalPages, searchValue) {
        var self = this;

        //gọi hàm twbsPagination từ twbs-pagination plugin
        $('#pagingDiv').twbsPagination({
            totalPages: totalPages,
            visiblePages: VISIBLE_PAGE_DEFAULT,
            onPageClick: function (event, page) {
                //call api
                $.ajax({
                    method: "GET",
                    url: "/api/UserAccount/GetPagingData?paramUserName=" + searchValue.trim() + "&pageNumber=" + PAGE_DEFAULT + "&pageSize=" + RECORD_PER_PAGE,
                    async: true,
                    contentType: "application/json",
                    beforeSend: function () {
                        //show loading
                        commonBaseJS.showLoadingData(1);
                    }
                }).done(function (res) {
                    if (res.success && res.data) {
                        var lstData = res.data.dataItems;

                        $('#lstUserGrid').empty();
                        $('#noUsers').show();
                        if (lstData.length > 0) {
                            $('#noUsers').hide();

                            $.each(lstData, function (index, user) {
                                var userHTML = `
                            <tr userID="${user.userId}" typeUser="${user.conditionAccount}">
                                <td>${index + 1}</td>
                                <td>${user.userName}</td>
                                <td>${user.email}</td>
                                <td>${(user.firstName != null) ? user.firstName : ""} ${(user.lastName != null) ? user.lastName : ""}</td>
                                <td>${(user.age != null) ? user.age : ""}</td>
                                <td>${(user.country != null) ? user.country : ""}</td>
                                <td align="center"><input type="checkbox" class="tdIsAdmin" style="height: 25px !important;" ${user.conditionAccount == 1 ? "" : "checked"} /></td >
                                <td align="center"><button type="button" class="fa fa-trash-o btn btn-light btnDelete" title="Xóa"></button></td>
                            </tr>`

                                $(userHTML).data('userID', user.userId)

                                $('#lstUserGrid').append($(userHTML))
                            });
                        }
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                        self.initEvents();

                    } else {
                        //ẩn loading
                        commonBaseJS.showLoadingData(0);
                        //show alert
                        commonBaseJS.showToastMsgFailed(res.message);
                    }
                }).fail(function (res) {
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
                })
            }
        })
    }
}