/**
 * Created by bxk on 2016/3/19.
 */
lessonLoad();
//    tokenID
var tokenID;

//    学生ID
var stuID;
//系统时间
var ct;
//课程ID
var LessonId;

touch.on('#myLessonBack', 'tap', function (ev) {
    if (GetRequest().v == "ios") {
        online();
    } else {
        backUrl(GetRequest().v);
    }
});

function lessonLoad() {
    tokenID = getStorage().tokenID;
    stuID = getStorage().stuID;
    var lessonData = "sMethod=MySchedule&jsonStr={'studentId':'" + stuID + "','ToKen':'" + tokenID + "','pageIndex':'1','pageSize':'10'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: lessonData,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.data;
                    ct= data.ServerTime;
                
                var myLesson = "";
                if(resultData.length >=1 && resultData.length <=5){
                    $("#pullUp").hide();
                }
                if(resultData.length == 0){
                    myLesson += "<div class=\"noyuyue\"><img src=\"images/no.png\"alt=\"\"/><p>还没有课程哦，赶快去预约吧</p></div>";
                }else {
                    for (var i = 0; i < resultData.length; i++) {
                        var day = new Date(Date.parse(resultData[i].StartTime.replace(/-/g, "/"))); //开始上课时间

                        var todaystr = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

                        var classYear = day.getFullYear();
                        var classMonth = day.getMonth() + 1;
                        var classDay = day.getDate();
                        var classHour = day.getHours();
                        var classMIn = day.getMinutes();
                        var classSen = day.getSeconds();

                        if (resultData[i].State == 1) {
                            myLesson += '<div class="bxk_classModal NO">';
                            myLesson += '<div class="bxk_classImg dbw-classImg"><img src="./images/classImg.png"alt=""><span class="dbw-posIcon">' + classMonth + '月' + classDay + '日' + classHour + '时' + classMIn + '分</span></div>';
                            myLesson += '<div class="bxk_classFont">';

                            myLesson += '<div class="bxk_fonttime"><span>' + GetTimeC(resultData[i].StartTime,ct) + '</span></div>';
                            if (jsDateDiff_2(day)) {
                                myLesson += '<a href="javascript:;" class="bxk_closed" onclick="closeClass(' + resultData[i].Id + ');">取消预约</a>';
                            }
                            myLesson += '</div></div>';
                        }else{
                            myLesson += '<div class="bxk_classModal NO">';
                            myLesson += '<div class="bxk_classImg dbw-classImg"><img src="./images/classImg.png"alt=""><span class="dbw-posIcon">' + classMonth + '月' + classDay + '日' + classHour + '时' + classMIn + '分</span></div>';
                            myLesson += '<div class="bxk_classFont">';

                            myLesson += '<div class="bxk_fonttime">本节课程已结束或您未进入教室</div>';
                            myLesson += '</div></div>';
                        }
                    }
                }
                $("#myLessonbox").append(myLesson);
                
            } else {
                alert(data.errorMsg);
            }
        }
    });
}

//本地存储
function getStorage() {
    var Storage = {};
    Storage.stuID = localStorage.getItem("stuID");
    Storage.tokenID = localStorage.getItem("tokenID");
    return Storage;
}
// 开课时间差
function GetTimeC(time,ServerTime){
    var Pjday = new Date(Date.parse(time.replace(/-/g, "/")));
    var ServerDay = new Date(Date.parse(ServerTime.replace(/-/g, "/")));
        var date1 = new Date(Pjday);
    var date2 = new Date(ServerDay);

    var s1 = date1.getTime(),s2 = date2.getTime();
    var total = (s1 - s2)/1000;
    var day = parseInt(total / (24*60*60));//计算整数天数
    var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
    var hour = parseInt(afterDay/(60*60));//计算整数小时数
    var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
    var min = parseInt(afterHour/60);//计算整数分
    var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数
    if(s1 == s2){
        return "已到上课时间";
    }
    if(day >= 1){
        return "距离上课"+ day + "天" + hour + "小时";
    }
    if(day == 0){
        return "距离上课"+ hour  + "小时" + min + "分";
    }
}
function GetTimeC1(time, ServerTime) {
    var d_minutes, d_hours, d_days;
    var Pjday = new Date(Date.parse(time.replace(/-/g, "/")));
    var ServerDay = new Date(Date.parse(ServerTime.replace(/-/g, "/")));

    Pjday = parseInt(new Date(Pjday.getFullYear(),
            (Pjday.getMonth()), Pjday.getDate(),
            Pjday.getHours(), Pjday.getMinutes()).getTime() / 1000);

    ServerDay = parseInt(new Date(ServerDay.getFullYear(),
            (ServerDay.getMonth()), ServerDay.getDate(),
            ServerDay.getHours(), ServerDay.getMinutes()).getTime() / 1000);

    var d;
    d = ServerDay - Pjday;
    d_days = parseInt(d / 86400);

    d_hours = parseInt(d / 3600);
    //d_hours_1 = d_hours - d_days * 24;

    d_minutes = parseInt(d / 60);
    //d_minutes_1 = d_minutes - d_hours * 60;

    var result = "";

    if(d >=0 &&d_minutes <= 0 && d_hours <= 0 && d_days <= 0){
        return result +="刚刚";
    }

    if(d_minutes > 0 && d_hours <= 0 && d_days <= 0){
        return result += d_minutes + "分钟之前";
    }
    if(d_hours > 0 && d_days <= 0){
        return result += d_hours + "小时之前";
    }
    if(d_days >= 1){
        return time.substr(0,10)
    }

}
//倒计时
function timer(year, month, day, h, m, s) {
    var ts = (new Date(year, month-1, day, h, m, s)) - (new Date());//计算剩余的毫秒数
    var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
    var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
    var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
    var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
    if(ts>=0){
        if(dd >= 1){
            return "距离上课"+ dd + "天" + hh + "小时";
        }
        if(dd == 0){
            return "距离上课"+ hh  + "小时" + mm + "分";
        }
    }else{
        return "已到上课时间";
    }
}

//现在距离上课时间是否大于2小时
function jsDateDiff_2(publishTime) {
    var d_minutes, d_hours, d_days;
    var ctt = ct.split(" ");
    var cdt = ctt[0].split("-");
    var cht = ctt[1].split(":");

    var timeNow = parseInt(new Date(cdt[0], cdt[1], cdt[2], cht[0], cht[1]).getTime() / 1000);
    publishTime = parseInt(new Date(publishTime.getFullYear(), (publishTime.getMonth() + 1), publishTime.getDate(), publishTime.getHours(), publishTime.getMinutes()).getTime() / 1000);

    var d;
    d = publishTime - timeNow;
    d_days = parseInt(d / 86400);

    d_hours = parseInt(d / 3600);
    d_hours_1 = d_hours - d_days * 24;

    d_minutes = parseInt(d / 60);
    d_minutes_1 = d_minutes - d_hours * 60;

    if (d_days == 0 && d_hours_1 < 2) {
        return false;
    } else {
        return true;
    }
}
function closeClass(LessonId) {
    layer.open({
        style: 'width:11.725rem;height:7.125rem',
        content: "<div class=\"xk_pull2\"><ul><li class=\"xk_yesorno\">是否取消预约</li><li><a href=\"\"class=\"xk_no\">取消</a><a href=\"\"class=\"xk_yes\"id='closeBtn'>确定</a></li></ul></div>",
        success: function (data, index) {
            $(data).find($("#closeBtn")).on("click", function () {
                layer.close(index);
                var classJson = "sMethod=cancelLesson&jsonStr={'studentId':'" + stuID + "','ToKen':'" + tokenID + "','LessonId':'" + LessonId + "'}";
                console.log(classJson);
                $.ajax({
                    url: "http://studytest.4000669696.com/StudentService.ashx",
                    type: "POST",
                    contentType: "application/json;charset=utf-8;",
                    dataType: 'JSONP',
                    jsonp: "callback",
                    data: classJson,
                    success: function (data) {
                        location.reload();
                    }
                });
            })
        }
    })
}

var myScroll,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

/**
 * 下拉刷新 （自定义实现此方法）
 * myScroll.refresh();        // 数据加载完成后，调用界面更新方法
 */


/**
 * 初始化iScroll控件
 */
function loaded() {

    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;


    myScroll = new iScroll('wrapper', {
        scrollbarClass: 'myScrollbar', /* 重要样式 */
        useTransition: false, /* 此属性不知用意，本人从true改为false */
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                    pullUpAction();	// Execute custom function (ajax call?)


            }
        }
    });

    setTimeout(function () {
        document.getElementById('wrapper').style.left = '0';
    }, 800);
}

//初始化绑定iScroll控件
addEventListener('touchstart',function(){
    myScroll.refresh();
},false);
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);
document.addEventListener('DOMContentLoaded', loaded, false);
//准备就绪后
//就应该执行了


/**
 * 滚动翻页 （自定义实现此方法）
 * myScroll.refresh();        // 数据加载完成后，调用界面更新方法
 */

var pagIndex = 1;
function pullUpAction() { //上拉加载更多
    console.log("好评上拉");
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        var pag = pagIndex ++;
        pag = pag*10;//pageIndex++; // 每上拉一次页码加一次 （就比如下一页下一页）
        Ajax(pag);
        // 运行ajax 把2传过去告诉后台我上拉一次后台要加一页数据（当然 这个具体传什么还得跟后台配合）

        myScroll.refresh();		// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!

}

function Ajax(pageIndex) { // ajax后台交互
    console.log(pageIndex);

    tokenID = getStorage().tokenID;
    stuID = getStorage().stuID;
    var lessonData = "sMethod=MySchedule&jsonStr={'studentId':'" + stuID + "','ToKen':'" + tokenID + "','pageIndex':'"+pageIndex+"','pageSize':'10'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: lessonData,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.data;
                ct = data.ServerTime;
                console.log(resultData);

                var myLesson = "";
                if(resultData.length == 0){
                    $('.pullUpLabel').html('加载完毕');
                }else {
                    for (var i = 0; i < resultData.length; i++) {
                        var day = new Date(Date.parse(resultData[i].StartTime.replace(/-/g, "/"))); //开始上课时间

                        var todaystr = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

                        var classYear = day.getFullYear();
                        var classMonth = day.getMonth() + 1;
                        var classDay = day.getDate();
                        var classHour = day.getHours();
                        var classMIn = day.getMinutes();
                        var classSen = day.getSeconds();
                        if (resultData[i].State == 1) {
                            myLesson += '<div class="bxk_classModal NO">';
                            myLesson += '<div class="bxk_classImg dbw-classImg"><img src="./images/classImg.png"alt=""class="dbw-lazy"><span class="dbw-posIcon">' + classMonth + '月' + classDay + '日' + classHour + '时' + classMIn + '分</span></div>';
                            myLesson += '<div class="bxk_classFont">';

                            myLesson += '<div class="bxk_fonttime"><span>' + timer(classYear, classMonth, classDay, classHour, classMIn, classSen) + '</span></div>';
                            if (jsDateDiff_2(day)) {
                                myLesson += '<a href="javascript:;" class="bxk_closed" onclick="closeClass(' + resultData[i].Id + ');">取消预约</a>';
                            }
                            myLesson += '</div></div>';
                        }else{
                            myLesson += '<div class="bxk_classModal NO">';
                            myLesson += '<div class="bxk_classImg dbw-classImg"><img src="./images/classImg.png"alt=""><span class="dbw-posIcon">' + classMonth + '月' + classDay + '日' + classHour + '时' + classMIn + '分</span></div>';
                            myLesson += '<div class="bxk_classFont">';

                            myLesson += '<div class="bxk_fonttime">本节课程已结束或您未进入教室</div>';
                            myLesson += '</div></div>';
                        }
                    }
                }
                $("#myLessonbox").append(myLesson);
            } else {
                alert(data.errorMsg);
            }
        }
    });
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
//返回上一级页面
function backUrl(html) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + html +".html";
}
