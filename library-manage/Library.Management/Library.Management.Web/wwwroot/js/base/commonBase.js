commonBaseJS = {
    showToastMsgSuccess: function (text) {
        $('.toastMsg-text').text(text);
        $('.toastMsg').show();
        setTimeout(function () {
            $('.toastMsg').hide();
        }, 4000);
    },
    showToastMsgFailed: function (text) {
        $('.toastMsgFailed-text').text(text);
        $('.toastMsgFailed').show();
        setTimeout(function () {
            $('.toastMsgFailed').hide();
        }, 4000);
    },
}