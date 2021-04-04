var domain = window.location.href;
var userObject = JSON.parse(localStorage.getItem("user"));

if (!domain.includes('admin')) {
    window.location.href = '/page/index.html';
}
else {
    //Nếu chưa đăng nhập thì redirect sang trang đăng nhập
    if (!userObject || userObject == null) {
        alert('Trước hết bạn cần đăng nhập với tài khoản admin!');
        window.location.href = '/page/login.html';
    }
    //Nếu đăng nhập rồi mà không phải là admin thì về trang trước
    else if (userObject.conditionAccount != 2 && userObject.conditionAccount != 3) {
        alert('Bạn không có quyền sử dụng chức năng này. Vui lòng đăng nhập dưới quyền admin!');
        window.history.go(-1);
    }
}