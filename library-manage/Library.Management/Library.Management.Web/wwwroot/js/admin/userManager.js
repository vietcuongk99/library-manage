$(document).ready(function () {
    var setting = new UserManager();
    var userObject = JSON.parse(localStorage.getItem("user"));
});

class UserManager {
    constructor() {
        this.loadDataUser();
    }

    initEvents() {
        $(".tdIsAdmin").on('change', this.changeCheckboxAdmin.bind(this));
        $(".btnDelete").on('click', this.onClickDeleteUser.bind(this));
    }

    loadDataUser() {
        var self = this;
        $.ajax({
            method: "GET",
            url: "/api/UserAccount/",
            async: false,
            contentType: "application/json",
        }).done(function (res) {
            if (res.success) {
                var lstData = res.data.lstData;

                if (lstData.length > 0) {
                    $('#noUsers').hide();

                    $.each(lstData, function (index, user) {
                        var userHTML = `
                            <tr userID="${user.userId}">
                                <td>${index + 1}</td>
                                <td>${user.userName}</td>
                                <td>${user.email}</td>
                                <td>${(user.firstName != null) ? user.firstName : ""} ${(user.lastName != null) ? user.lastName : ""}</td>
                                <td>${(user.age != null) ? user.age : ""}</td>
                                <td>${(user.country != null) ? user.country : ""}</td>
                                <td align="center"><input type="checkbox" class="tdIsAdmin" style="height: 25px !important;" ${user.isAdmin ? "checked" : ""} /></td >
                                <td align="center"><button type="button" class="fa fa-trash-o btn btn-light btnDelete" title="Xóa"></button></td>
                            </tr>`

                        $(userHTML).data('userID', user.userId)

                        $('#lstUserGrid').append($(userHTML))
                    });

                    self.initEvents();
                }
            } else {
                $('#noUsers').show();
                alert("Lấy dữ liệu thất bại")
            }
        }).fail(function (res) {
            $('#noUsers').show();
            alert("Lấy dữ liệu không thành công")
        })
    }

    changeCheckboxAdmin(event) {
        var checkBox = event.target;
        var self = this;

        if (this.validateAdmin(checkBox)) {
            var data = {
                UserID: checkBox.closest('tr').getAttribute('userID'),
                IsAdmin: checkBox.checked
            };

            $.ajax({
                method: "POST",
                url: "/api/UserAccount/ChangeUserAdmin/",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
            }).done(function (res) {
                if (res.success) {
                    $('#lstUserGrid').empty();
                    self.loadDataUser();
                    commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                } else {
                    commonBaseJS.showToastMsgFailed("Cập nhật thất bại")
                }
            }).fail(function (res) {
                commonBaseJS.showToastMsgFailed("Cập nhật không thành công")
            })
        } else {
            checkBox.checked = true;
        }
    }

    onClickDeleteUser(event) {
        var itemDel = event.target;
        var self = this;

        if (this.validateDelete(itemDel)) {

            var conf = confirm("Bạn có thực sự muốn xóa người dùng này?");
            if (conf == true) {

                var listID = [];
                listID.push(itemDel.closest('tr').getAttribute('userID'));

                $.ajax({
                    method: "DELETE",
                    url: "/api/UserAccount/GroupID/",
                    data: JSON.stringify(listID),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                }).done(function (res) {
                    if (res.success) {
                        $('#lstUserGrid').empty();
                        self.loadDataUser();
                        commonBaseJS.showToastMsgSuccess("Xóa người dùng thành công.");
                    } else {
                        commonBaseJS.showToastMsgFailed("Xóa người dùng không thành công")
                    }
                }).fail(function (res) {
                    commonBaseJS.showToastMsgFailed("Xóa người dùng không thành công")
                })
            }
        } else {
            alert('Bạn không được xóa chính mình khỏi danh sách người dùng.');
        }

    }

    validateDelete(element) {
        //Check không được xóa chính mình khỏi danh sách
        var bvalid = true,
            thisTrId = element.closest('tr').getAttribute('userID');

        if (userObject.userID == thisTrId) {
            bvalid = false;
        } 

        return bvalid;
    }

    validateAdmin(element) {
        var bvalid = false,
            checkBox = $(".tdIsAdmin"),
            thisTrId = element.closest('tr').getAttribute('userID');
        
        if (userObject.userID == thisTrId) {
            alert('Bạn không được gỡ quyền admin của mình.');
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
                alert('Phải có ít nhất 1 admin.');
            }
        }
        return bvalid;
    }
}