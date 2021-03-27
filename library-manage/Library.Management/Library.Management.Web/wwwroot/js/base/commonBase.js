commonBaseJS = {
    showToastMsgSuccess: function (text) {
        $('.toastMsg-text').text(text);
        $('.toastMsg').show();
        setTimeout(function () {
            $('.toastMsg').hide();
        }, 3000);
    },
    showToastMsgFailed: function (text) {
        $('.toastMsgFailed-text').text(text);
        $('.toastMsgFailed').show();
        setTimeout(function () {
            $('.toastMsgFailed').hide();
        }, 3000);
    },
    showLoadingData: function (isLoading) {
        if (isLoading == 1) {
            $(".loader").show();
        }
        else {
            $(".loader").hide();
        }
    }
}