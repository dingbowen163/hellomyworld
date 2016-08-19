/**
 * Created by bxk on 2016/3/19.
 */
$(function () {
    loadPage();
    goodPinlun();
    goodPinlunC();
    //返回筛选页
    touch.on('#backTeacher', 'tap', function (ev) {
        selectTeacherUrl();
    });
    //跳转至我的课表
    touch.on('#clock', 'tap', function (ev) {
        var url = window.location.href;
        window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "myLesson.html?v=comment";
    });
});
if(GetRequest().teacherID){
    setStorage(GetRequest().teacherID);
}else{
    
}

//老师ID
var teacherID = getStorage().teacherID;
//    tokenID
var tokenID = getStorage().tokenID;
//    学生ID
var stuID = getStorage().stuID;

function loadPage() {

    var teacherJson = "sMethod=GetTeacherInfo&jsonStr={'studentId':'" + stuID + "','ToKen':'" + tokenID + "','tId':'" + teacherID + "'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: teacherJson,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.data;
                var tagHtml = "";
                for (var i = 0; i < resultData.Tags.length; i++) {
                    if (resultData.Tags[i].count > 0) {
                        if (resultData.Tags[i].count > 999) {
                            resultData.Tags[i].count = "1000+";
                        }
                        tagHtml += "<li><span id=\"tagName\">" + resultData.Tags[i].TContent + "</span><span id=\"tagNum\">(" + resultData.Tags[i].count + ")</span></li>";
                    }
                }
                $("#tagBox").html(tagHtml);
                //评分
                $("#teacherNum").text(resultData.pingfen);
                console.log(resultData.pingfen);
            } else {
                alert(data.errorMsg);
            }
        }
    });


}

//好评
function goodPinlun() {
    var goodJson = "sMethod=GetTeacherEvaluate&jsonStr={'pageSize':'10','ToKen':'" + tokenID + "','tId':'" + teacherID + "','pageIndex':'0'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: goodJson,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.Data;
                $("#goodPJ").text(data.totalCount);
                for (var i = 0; i < resultData.length; i++) {
                    var txthtml = "<li class='dbw-CommentCon'><div class='clearfix'><div class='dbw-F-L dbw-stuName'><div class='dbw-stuNameCon'><span>学员</span><span class='dbw-stuNameName'>" + resultData[i].Name + "</span></div><div class='dbw-raty'  data-score='" + resultData[i].TeachLevel + "'>";
                    txthtml += "<span class='starNum'></span>";
                    txthtml += "</div></div><div class='dbw-F-R dbw-commentTime'><span>" + GetTimeC(resultData[i].CreateTime, data.ServerTime) + "</span></div></div><p class='dbw-commentPsg'>" + resultData[i].Remark + "</p></li>";
                    $(txthtml).appendTo($("#TeacherEvaluate"));
                    $('.dbw-raty').raty({
                        starHalf: 'images/star-half-big.png',
                        starOff: 'images/star-off.png',
                        starOn: 'images/star-on-big.png',
                        readOnly: true,
                        score: function () {
                            return $(this).attr('data-score');
                        }
                    });
                }
            } else {
                alert(data.errorMsg);
            }
        },
        error:function(){
            alert("错误")
        }
    });
}

//差评
function goodPinlunC() {
    var goodJson = "sMethod=GetTeacherEvaluateC&jsonStr={'pageSize':'10','ToKen':'" + tokenID + "','tId':'" + teacherID + "','pageIndex':'0'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: goodJson,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.Data;
                console.log(data.ServerTime);
                console.log(resultData[0]);
                $("#differencePJ").text(data.totalCount);
                var txthtml = "";
                for (var i = 0; i < resultData.length; i++) {
                    txthtml = "<li class='dbw-CommentCon'><div class='clearfix'><div class='dbw-F-L dbw-stuName'><div class='dbw-stuNameCon clearfix'><span>学员</span><span class='dbw-stuNameName'>" + resultData[i].Name + "</span></div><div class='dbw-raty'  data-score='" + resultData[i].TeachLevel + "'>";
                    txthtml += "<span class='starNum'></span>";
                    txthtml += "</div></div><div class='dbw-F-R dbw-commentTime'><span>" + GetTimeC(resultData[i].CreateTime, data.ServerTime) + "</span></div></div><p class='dbw-commentPsg'>" + resultData[i].Remark + "</p></li>";
                    $(txthtml).appendTo($("#TeacherEvaluateC"));
                    $('.dbw-raty').raty({
                        starHalf: 'images/star-half-big.png',
                        starOff: 'images/star-off.png',
                        starOn: 'images/star-on-big.png',
                        readOnly: true,
                        score: function () {
                            return $(this).attr('data-score');
                        }
                    });
                }
            } else {
                alert(data.errorMsg);
            }
        }
    });
}

function GetTimeC(time, ServerTime) {
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
function setStorage(teacherID){
    window.sessionStorage.setItem("teacherID",teacherID);
}
//本地存储
function getStorage() {
    var Storage = {};
    Storage.stuID = localStorage.getItem("stuID");
    Storage.tokenID = localStorage.getItem("tokenID");
    Storage.teacherID = localStorage.getItem("teacherID");
    return Storage;
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
//跳转至筛选老师页面
function selectTeacherUrl() {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "teacherDetail.html";
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
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始加载...';
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
                if($("#TeacherEvaluate").attr("class") == "dbw-CommentMenu dbw-active"){
                    pullUpAction();	// Execute custom function (ajax call?)
                }else{
                    pullUpAction1();	// Execute custom function (ajax call?)
                }

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
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        var pag = pagIndex ++;
        pag = pag*10;//pageIndex++; // 每上拉一次页码加一次 （就比如下一页下一页）
            Ajax(pag);
         // 运行ajax 把2传过去告诉后台我上拉一次后台要加一页数据（当然 这个具体传什么还得跟后台配合）

        myScroll.refresh();		// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!

}
var pagIndexs = 1;
function pullUpAction1() { //上拉加载更多
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        var pag = pagIndexs ++;
        pag = pag*10;//pageIndex++; // 每上拉一次页码加一次 （就比如下一页下一页）
        AjaxC(pag);
        // 运行ajax 把2传过去告诉后台我上拉一次后台要加一页数据（当然 这个具体传什么还得跟后台配合）

        myScroll.refresh();		// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!

}
function Ajax(pageIndex) { // ajax后台交互

    var goodJson = "sMethod=GetTeacherEvaluate&jsonStr={'pageSize':'10','ToKen':'" + tokenID + "','tId':'" + teacherID + "','pageIndex':'"+pageIndex+"'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: goodJson,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.Data;
                var plHtml = "";
                if(resultData.length == 0){
                    $('.pullUpLabel').html('加载完毕');
                }else {
                    for (var i = 0; i < resultData.length; i++) {
                        plHtml += "<li class='dbw-CommentCon'><div class='clearfix'><div class='dbw-F-L dbw-stuName'><div class='dbw-stuNameCon clearfix'><span>学员</span><span class='dbw-stuNameName'>" + resultData[i].Name + "</span></div><div class='dbw-raty'  data-score='" + resultData[i].TeachLevel + "'>";
                        plHtml += "<span class='starNum'></span>";
                        plHtml += "</div></div><div class='dbw-F-R dbw-commentTime'><span>" + GetTimeC(resultData[i].CreateTime, data.ServerTime) + "</span></div></div><p class='dbw-commentPsg'>" + resultData[i].Remark + "</p></li>";
                    }
                    $("#TeacherEvaluate").append(plHtml);
                    $('.dbw-raty').raty({
                        starHalf: 'images/star-half-big.png',
                        starOff: 'images/star-off.png',
                        starOn: 'images/star-on-big.png',
                        readOnly: true,
                        score: function () {
                            return $(this).attr('data-score');
                        }
                    });
                }
            } else {
                alert(data.errorMsg);
            }
        }
    });
}
function AjaxC(pageIndex){
    var goodJson = "sMethod=GetTeacherEvaluateC&jsonStr={'pageSize':'10','ToKen':'" + tokenID + "','tId':'" + teacherID + "','pageIndex':'"+pageIndex+"'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: goodJson,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.Data;
                var txthtml = "";
                if(resultData.length == 0){
                    $('.pullUpLabel').html('加载完毕');
                    setTimeout(function(){
                        $("#pullUp").hide();
                    },2000);
                }else{
                    for (var i = 0; i < resultData.length; i++) {
                        txthtml = "<li class='dbw-CommentCon'><div class='clearfix'><div class='dbw-F-L dbw-stuName'><div class='dbw-stuNameCon clearfix'><span>学员</span><span class='dbw-stuNameName'>" + resultData[i].Name + "</span></div><div class='dbw-raty'  data-score='" + resultData[i].TeachLevel + "'>";
                        txthtml += "<span class='starNum'></span>"
                        txthtml += "</div></div><div class='dbw-F-R dbw-commentTime'><span>" + GetTimeC(resultData[i].CreateTime, data.ServerTime) + "</span></div></div><p class='dbw-commentPsg'>" + resultData[i].Remark + "</p></li>";
                        $(txthtml).appendTo($("#TeacherEvaluateC"));
                        $('.dbw-raty').raty({
                            starHalf: 'images/star-half-big.png',
                            starOff: 'images/star-off.png',
                            starOn: 'images/star-on-big.png',
                            readOnly: true,
                            score: function () {
                                return $(this).attr('data-score');
                            }
                        });
                    }
                }
            } else {
                alert(data.errorMsg);
            }
        }
    });
}
