/**
 * Created by bxk on 2016/3/19.
 */



//返回筛选页
touch.on('#back', 'tap', function (ev) {
    teacherUrl();
    dateTeacherStorage();
});
//跳转我的课表
touch.on('#clock', 'tap', function (ev) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "myLesson.html?v=teacherDetail";
});

//样式脚本
var i = 0;
$('.dbw-backIcon').click(function () {
    if (i == 0) {
        $('.dbw-commentPsg').css({
            height: 'auto'
        });
        $('.dbw-backIcon i').css({
            'transform': 'rotate(180deg)',
            'transition': '0.4s all ease'
        });
        i = 1;
    } else if (i == 1) {
        $('.dbw-commentPsg').stop().animate({
            height: '0.4rem'
        }, 200);
        $('.dbw-backIcon i').css({
            'transform': 'rotate(360deg)',
            'transition': '0.4s all ease'
        });
        i = 0;
    }
});
//    时间监控
$(".bxk_timebox").scroll(function () {
    $('.dbw-CLDDateCon').css({
        'left': -$(".bxk_timebox").scrollLeft()
    });
    if ($(".bxk_timebox").scrollLeft() > 0) {
        $(".dbw-nextPageIcon").hide();
    } else {
        $(".dbw-nextPageIcon").show();
    }

});
var nextPageIcon = $('.dbw-nextPageIcon');

$('#timebox_Wrapper').on('swipeLeft', function () {
    nextPageIcon.css({'display': 'none'});
});

var offsetTop = $('.dbw-CLDDateCon').offset().top;


$(window).scroll(function () {
    var scrollTop = $(document).scrollTop();
    var headerH = $('.bxk_header').height();
    var top = offsetTop + headerH;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    if(bIsIpad){
        var sectionH=$('.dbw-teacherFile-b').height();
        var xkH=$('.xk_style').height();
        top = offsetTop + headerH+sectionH+xkH;
        if (scrollTop >= top) {
            $('.dbw-CLDDateCon').css({
                'position': 'fixed',
                'width': '280%'
            });
            $('.dbw-CLDDateConTwin').show();

        }
        else {
            $('.dbw-CLDDateCon').css({
                'position': 'static',
                'width': '100%'
            });
            $('.dbw-CLDDateConTwin').hide();
        }
    }
    else{
        if (scrollTop >= top) {
            $('.dbw-CLDDateCon').css({
                'position': 'fixed',
                'width': '280%'
            });
            $('.dbw-CLDDateConTwin').show();

        }
        else {
            $('.dbw-CLDDateCon').css({
                'position': 'static',
                'width': '100%'
            });
            $('.dbw-CLDDateConTwin').hide();
        }
    }

});

//数据脚本
//var timeArr=['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];
if (getTeacherStorage().teacherID) {

} else {
    saveTeacherStorage();
}

//    老师ID
var teacherID = getTeacherStorage().teacherID;

//    tokenID
var tokenID = getStorage().tokenID;
//    学生ID
var stuID = getStorage().stuID;
loadPage();
// 服务器时间
var ServerTime;

//数据初始化
function loadPage() {
    //老师基本信息
    var teacherJson = "sMethod=GetTeacherInfo&jsonStr={'studentId':'" + stuID + "','ToKen':'" + tokenID + "','tId':'" + teacherID + "'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: teacherJson,
        success: function (data) {
            ServerTime = data.ServerTime;
            if (data.result == 1) {
                var resultData = data.data;
                //老师头像
                var url = window.location.href;
                var headImg = url.substring(0, url.lastIndexOf('/') + 1) + "headimages/" + resultData.ImageUrl;
                $("#teacherImg").attr("src", headImg);
                //老师名字
                $("#teacherName").text(resultData.Name);
                //    老师描述
                $("#description").text(resultData.Description);
                //    老师标签
                for (var j = 0; j < resultData.Tags.length; j++) {
                    for (var k = 0; k < $("#tahbox>li").length; k++) {
                        if (resultData.Tags[j].TContent == $($(".tagName")[k]).text()) {
                            $($("#tahbox>li")[k]).removeClass("dbw-notComment");
                        }
                    }
                }
                //    老师性别
                if (resultData.Gender == 0) {
                    $("#teaNav").text('女');
                } else {
                    $("#teaNav").text('男');
                }
                //    年龄
                $("#tAge").text(resultData.Age);
                //评分
                var teacherNum = resultData.pingfen;
                var firstNum = teacherNum.split(".")[0];
                var nextNum = teacherNum.split(".")[1];
                $("#firstNum").text(firstNum);
                $("#nextNum").text(nextNum);
                //   评分点击跳转
                $("#pfbtn").click(function () {
                    PingfenUrl(teacherID);
                });
                //评价次数
                var pjNum = resultData.PJCount;
                if (pjNum > 1000) {
                    pjNum = "1000+";
                }
                $("#penfengPag").text(pjNum + " >");

                 //    老师约课信息
                    var timeArr = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '' +
                        '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
                        '21:30', '22:00', '22:30', '23:00', '23:30'];
                    var teacherTime = '';
                    //时间点
                    var Time = '';
                    var timesHtml = '';
                    for (var i = 0; i < getDays().length; i++) {
                        if (i == 0) {
                            teacherTime += '<li><p class="dbw-date">' + getDays()[0].day + '</p>';
                            teacherTime += '<p class="dbw-day">今天</p></li>';
                        } else if (i == 4) {
                            teacherTime += '<li class="dbw-rightPos"><p class="dbw-date">' + getDays()[4].day + '</p>';
                            teacherTime += '<p class="dbw-day">' + getDays()[4].week + '</p><i class="dbw-nextPageIcon"></i></li>';
                        } else {
                            teacherTime += '<li><p class="dbw-date">' + getDays()[i].day + '</p>';
                            teacherTime += '<p class="dbw-day">' + getDays()[i].week + '</p></li>';
                        }

                        timesHtml += '<nav><ul class="dbw-F-L dbw-timeList">';
                        var timeStr = '';
                        for (var j = 0; j < timeArr.length; j++) {
                            timeStr += '<li class="dbw-time dbw-timeGrey" data-value="' + getDays()[i].yt2 + ' ' + timeArr[j] + ':00">' + timeArr[j] + '</li>';
                        }
                        timesHtml += timeStr + '</ul></nav>';
                    }
                    $("#timeFix").html(teacherTime);
                    $("#times").html(timesHtml);
                    //日期header
                    var teacherClass = "sMethod=GetTeacherLesson&jsonStr={'tId':'" + teacherID + "','ToKen':'" + tokenID + "'," +
                        "'startday':'" + GetDateStr(0) + "','endday':'" + GetDateStr(13) + "'}";
                    $.ajax({
                        url: "http://studytest.4000669696.com/StudentService.ashx",
                        type: "POST",
                        contentType: "application/json;charset=utf-8;",
                        dataType: 'JSONP',
                        jsonp: "callback",
                        data: teacherClass,
                        success: function (data) {
                            if (data.result == 1) {
                                var resultData = data.data;
                                var ttt;
                                for (var k = 0; k < resultData.length; k++) {
                                    ttt = $(".dbw-timeList li[data-value='" + resultData[k].StartTime.replace(/-/g, "/") + "']");
                                    if(CompareDate(resultData[k].StartTime.replace(/-/g, "/"),thisTime().day+" "+thisTime().time)){
                                        if (ttt != null) {
                                            $(ttt[0]).attr("id", "temp"+resultData[k].Id);
                                            $(ttt[0]).attr("class", "dbw-activeBlue dbw-time");
                                            $(ttt[0]).attr("onclick", "clickYuyue("+resultData[k].Id+",'" + resultData[k].StartTime.replace(/-/g, "/") + "')");
                                        }
                                    }
                                }
                            } else {
                                alert(data.errorMsg);
                            }
                            $("#loading").hide();
                        }
                    });

            } else {
                alert(data.errorMsg);
            }
        }
    });
   


    //var toDay = CurentTime();
    //var endDay =


}
//当前时间
function thisTime() {
    var myTime = {};
    var dayTime = new Date();
    var thisYear = dayTime.getFullYear();
    var thisM = dayTime.getMonth() + 1;
    var thisD = dayTime.getDate();

    var thisHour = dayTime.getHours() + 1;
    var thisMin = dayTime.getMinutes();
    if(thisHour == 24){
        thisHour = 0;
    }
    if (thisMin > 30) {
        thisHour = thisHour + 1;
        thisMin = "00";
    } else if (thisMin < 30) {
        thisMin = "30";
    }
    var myday = thisYear + "-" + thisM + "-" + thisD;
    var myTimes = thisHour + ":" + thisMin;
    myTime.day = myday;
    myTime.time = myTimes;
    return myTime;
}
//时间比较
function CompareDate(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
}


function diffTime(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数

    //计算出相差天数
    var days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数
    var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);

    var returnStr = seconds + "秒";
    if (minutes > 0) {
        returnStr = minutes + "分" + returnStr;
    }
    if (hours > 0) {
        returnStr = hours + "小时" + returnStr;
    }
    if (days > 0) {
        returnStr = days + "天" + returnStr;
    }
    return returnStr;
}

//点击预约
function clickYuyue(lId,dayTimes) {
    layer.open({
        style: 'width:11.725rem;height:8.125rem',
        content: "<div class=\"xk_pull\"><ul><li class=\"xk_yuyue\">预约</li><li class=\"xk_day\">时间：<span class=\"xk_shijian\">" + dayTimes + "</span></li><li class=\"xk_course\">课程：<span>" + getTeacherStorage().className + "</span></li><li class=\"xk_red\">课程两小时之内不能取消预约哦~</li><li class=\"xk_anniu2\"><a href=\"javascript:;\"class=\"xk_btn1\">取消</a><a href=\"javascript:;\"class=\"xk_btn2 orderSuccess\">确定</a></li></ul></div>",
        success: function (data, index) {
            $(data).find($(".orderSuccess")).on("click", function () {
                layer.close(index);
                var teacherJson = "sMethod=AppointmentLesson&jsonStr={'studentId':'" + stuID + "','ToKen':'" + tokenID + "'," +
                    "'classId':'" + getTeacherStorage().classID + "','type':'" + getTeacherStorage().type + "','tId':'" + teacherID + "','lessonId':'" + lId + "'}";

                $.ajax({
                    url: "http://studytest.4000669696.com/StudentService.ashx",
                    type: "POST",
                    contentType: "application/json;charset=utf-8;",
                    dataType: 'JSONP',
                    jsonp: "callback",
                    data: teacherJson,
                    success: function (data) {
                        if (data.result == 1) {
                            layer.open({
                                style: 'width:7.2rem;height:3.575rem;line-height:3.575rem;text-align:center',
                                content: '预约成功',
                                time: 2,//2秒后自动关闭
                                success:function(){
                                    $("#temp"+lId).attr("class", "dbw-time dbw-timeGrey");
                                }
                            });
                        } else {
                            alert(data.errorMsg);
                        }
                    }
                });
            });
            if ($(data).find($(".xk_btn1"))) {
                $(data).find($(".xk_btn1")).on("click", function () {
                    layer.closeAll();
                })
            }
        }
    })
}
//点击预约

//样式脚本
var el = document.querySelector('.bxk_timebox');
var startPosition, endPosition, deltaX, deltaY, moveLength;

el.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    startPosition = {
        x: touch.pageX,
        y: touch.pageY
    }
});
el.addEventListener('touchmove', function (e) {
    var touch = e.touches[0];
    endPosition = {
        x: touch.pageX,
        y: touch.pageY
    };
    deltaX = endPosition.x - startPosition.x;
    deltaY = endPosition.y - startPosition.y;

});


//跳转至筛选老师页面
function teacherUrl(teacherID) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "bespeak.html";
}
//跳转至老师评分页面
function PingfenUrl(teacherID) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "comment.html?teacherID=" + teacherID;
}
//获得周
function getWeekData() {
    var now = new Date;
    var day = now.getDay(); //2015-10-14 周三
    var oriData = '日一二三四五六'.split('');
    var rs = [];
    for (var i = 0; i < 7; i++) {
        rs.push(oriData[day]);
        ++day;
        day = day > 6 ? day - 7 : day;
    }
    return rs;
}
//console.log(getWeekData());
//获取当天以及未来一个礼拜的星期数
//["三", "四", "五", "六", "日", "一", "二"]

function getDays() {
    var now = new Date(Date.parse(ServerTime.replace(/-/g, "/")));
    var day = now.getDay();
    var week = "7123456";
    var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    var days = [];
    for (var i = 0; i < 14; i++) {
        var f = new Date(Date.parse(ServerTime.replace(/-/g, "/")));
        f.setDate(f.getDate() + i);
        var year = f.getFullYear();
        var month = parseInt(f.getMonth()) + 1;
        month = month < 10 ? '0' + month : month;
        var date = f.getDate();
        date = date < 10 ? '0' + date : date;
        var myDate = new Date(Date.parse(year + '/' + month + '/' + date));
        days.push({
            yt2: year + '/' + month + '/' + date, // 月/日
            week: weekDay[myDate.getDay()],
            day: date,
            yt3: year + '-' + month + '-' + date
        });
    }
    return days;
}

//获取14天后的日期
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getYear() + 1900;
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
    return y + "-" + m + "-" + d;
}

function hours() {
    var hour = [];
    var myDate = new Date();
    var hours = myDate.getHours();
    var min = myDate.getMinutes();
    hour.push({
        h: hours,
        m: min
    });
    return hour;
}
//获取url中的参数
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
        }
    }
    return theRequest;
}
//存储至本地
function saveTeacherStorage() {
    window.localStorage.setItem("teacherID", GetRequest().teacherID);
    window.localStorage.setItem("LessonID", GetRequest().LessonID);
}
function getTeacherStorage() {
    var Storage = {};
    Storage.teacherID = localStorage.getItem("teacherID");
    Storage.className = sessionStorage.getItem("className");
    Storage.LessonID = localStorage.getItem("LessonID");
    Storage.type = sessionStorage.getItem("type");
    Storage.classID = sessionStorage.getItem("classID");
    return Storage;
}
function dateTeacherStorage() {
    localStorage.removeItem("teacherID");
    localStorage.removeItem("LessonID");
}
//本地存储
function getStorage() {
    var Storage = {};
    Storage.stuID = localStorage.getItem("stuID");
    Storage.tokenID = localStorage.getItem("tokenID");
    return Storage;
}
