$(document).ready(function () {
    var monitor = new Monitor();
});

class Monitor {
    constructor() {
        this.loadData();
        this.loadChart();
    }

    loadData() {
        $.ajax({
            method: "GET",
            url: "/api/BookDetail/GetMonitorActivation",
            async: true,
            contentType: "application/json",
            beforeSend: function () {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function (res) {
            commonBaseJS.showLoadingData(0);
            if (res.success) {
                if (res.data) {
                    $('#total-books').text(res.data.totalBook[0].totalBook);
                    $('#total-borrows').text(res.data.totalBookBorrow[0].totalBorrowActivated);
                    $('.book-borrow-active').text(res.data.totalBookBorrow[0].totalBookBorrowActive);
                }
            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function (res) {
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }

    loadChart() {
        $.ajax({
            method: "GET",
            url: "/api/BookCategory/GetChartInfomation",
            async: true,
            contentType: "application/json",
            beforeSend: function () {
                //show loading
                commonBaseJS.showLoadingData(1);
            }
        }).done(function (res) {
            commonBaseJS.showLoadingData(0);
            if (res.success) {
                if (res.data) {
                    var dataChart = [];

                    res.data.forEach(function (item) {
                        var temp = {
                            label: item.bookCategoryName,
                            y: item.totalBook
                        }
                        dataChart.push(temp);
                    })
                    debugger
                    var options = {
                        animationEnabled: true,
                        title: {
                            text: ""
                        },
                        axisY: {
                            title: "Số lượng sách",
                            //suffix: "%"
                        },
                        axisX: {
                            title: "Danh mục sách"
                        },
                        data: [{
                            type: "column",
                            //yValueFormatString: "#,##0.0#" % "",
                            dataPoints: dataChart
                        }]
                    };
                    $("#chartContainer").CanvasJSChart(options);
                }
            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function (res) {
            commonBaseJS.showLoadingData(0);
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })
    }
}