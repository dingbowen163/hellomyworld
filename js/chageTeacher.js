/**
 * Created by bxk on 2016/3/18.
 */
//  
  //                loading层
    jQuery(window).ajaxStart(function () {
        alert(1);
        layer.open({type: 2})
    }).ajaxStop(function () {
        layer.closeAll();
    })
// $(window).ajaxStart(function(){
//     layer.open({type: 2});
//  });
touch.on('#back', 'tap', function (ev) {
    PackageUrl();
    deteUrl();
    deteTeacher();//删除缓存
    sessionStorage.removeItem("inputTime");
});

touch.on('#clock', 'tap', function (ev) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "myLesson.html?v=bespeak";
});

//向上滑动swipeup
touch.on('.xk_content2', 'swipeup', function (ev) {
    $(".xk_shaixuankuang").show();
    $(".xk_content").css("height", 0).hide();
});

//
touch.on('#chage', 'tap', function (ev) {
    $(".xk_shaixuankuang").hide();
    $(".xk_content").show().css("height", "auto");
});

var day;//日期
var dayTimes;//时间
var nav = -1;//性别
var isChinese = 0;//是否会中文
var collect = 0;//收藏的老师
var teacherID;//老师ID
//    学生token
var stuId = getStorage().stuID;
//    学生ID
var tokenID = getStorage().tokenID;
var ServerTime;

// 获取服务器时间 
    var teacherJson = "sMethod=GetTime";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data:teacherJson,
        success: function (data) {
           ServerTime = data.ServerTime;
            // 默认加载数据
            if(sessionStorage.getItem("inputTime")){
                LoadPage();
                $('#appDateTime').attr('value',sessionStorage.getItem("inputTime"));
                $('#selectDate').text(sessionStorage.getItem("inputTime"));
            }else{
                //没有筛选条件，自动选出老师
                autoLoadTeacher();
                $('#appDateTime').attr('value', dbwClassTime(ServerTime));
            }
        }
    });

//保存从url中获取的参数

if (getUrl().classID) {

} else {
    saveUrl(GetRequest().classID, GetRequest().type, GetRequest().className);
}

//    课程名称
var className = getUrl().className;



function autoLoadTeacher() {
    var autoDay = thisTime().day;
    var autoTime = thisTime().time;

//判断缓存性别
    if(getTeacher().nav){
    if (getTeacher().nav == -1) {
        $(".xk_unlimited").addClass("xk_active");
    } else if(getTeacher().nav == 1){
        $(".xk_man").addClass("xk_active");
    } else if(getTeacher().nav == 0){
        $(".xk_girl").addClass("xk_active");
    }

    if(getTeacher().chinese == 1){
        $(".xk_china").addClass("china_active");
        ischinesebtn = 1;
    }
    if(getTeacher().colect == 1){
        $(".xk_teacherx").addClass("teacher_active");
        ischinesebtn = 1;
    }
}else{
    if (nav == -1) {
        $(".xk_unlimited").addClass("xk_active");
        isCollect = 1;
    } else if(nav == 1){
        $(".xk_man").addClass("xk_active");
        isCollect = 1;
    } else if(nav == 0){
        $(".xk_girl").addClass("xk_active");
        isCollect = 1;
    }
}

    var autoTeacher = "sMethod=GetTeacherLessonByTime&jsonStr=" +
        "{'stuId':'" + stuId + "','ToKen':'" + tokenID + "','classIds':'" + getUrl().classID + "'," +
        "'type':'" + getUrl().type + "','iscol':'" + collect + "','timeRegion':'" + autoTime + "'," +
        "'date':'" + autoDay + "','isch':'" + isChinese + "','sex':'" + nav + "','pageSize':'10','pageIndex':'1'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: autoTeacher,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.data;
                //saveTeacher(resultData, nav, isChinese, collect);
                var teacherHtml = "";
//                    没有老师时显示
                if (resultData.length == 0) {
                    teacherHtml += "<div class=\"noyuyue\"><img src=\"images/no.png\"alt=\"\"/><p>抱歉sorry</p><p>该时间段没有教师请重新选择时间</p></div>";
                } else {
                    for (var i = 0; i < resultData.length; i++) {
                        var teacherNav;//老师性别
                        if (resultData[i].Gender == 0) {
                            teacherNav = "images/girl.png";
                        } else if (resultData[i].Gender == 1) {
                            teacherNav = "images/man.png";
                        }
                        //老师评分
                        var teacherNum = resultData[i].Evaluate;
                        var firstNum = teacherNum.split(".")[0];
                        var nextNum = teacherNum.split(".")[1];
                        var teacherImg = resultData[i].TeacherImage;
                        teacherHtml += "<li><ul class=\"xk_teacher\"><li class=\"xk_left\"><a href=\"javascript:;\"onclick=\"TeacherUrl(" + resultData[i].TeacherId + "," + getUrl().classID + ",'" + getUrl().type + "','" + className + "','" + resultData[i].Id + "')\">" +
                            "<span><img src='" + teacherImg + "'/></span></a></li><li class=\"xk_left xk_lt\" onclick=\"TeacherUrl(" + resultData[i].TeacherId + "," + getUrl().classID + ",'" + getUrl().type + "','" + className + "','" + resultData[i].Id + "')\"><div><span class=\"xk_name\">" + resultData[i].Name + "</span>" +
                            "<p class=\"xk_age\"><img src='" + teacherNav + "'class=\"xk_left\"/><span class=\"xk_left\">年龄:<span>" + resultData[i].Age + "</span></span></p></div></li>" +
                            "<li class=\"xk_left xk_num\"><span class=\"\">" + firstNum + ".</span><span class=\"xk_sp\">" + nextNum + "</span></li>" +
                            "<li class=\"xk_right xk_make\"><a href=\"javascript:;\" onclick='TeacherOK(" + resultData[i].TeacherId + "," + resultData[i].Id + ");'>预约</a></li></ul></li>";
                    }
                    //此处填写html页面中放置目录的div标签的ID
                    //$.each(resData.data, function (i, n) {
                    //    $(panelHtml).appendTo(dvMenu);
                }
                $("#teahcerbox").html(teacherHtml);

                //});
            } else {
                alert(data.errorMsg);
            }
        }
    });
}

//当前时间
function thisTime() {
    var myTime = {};
    var dayTime = new Date(Date.parse(ServerTime.replace(/-/g, "/")));
    var thisYear = dayTime.getFullYear();
    var thisM = dayTime.getMonth() + 1;
    var thisD = dayTime.getDate();
    //var week = date.getDay();
    //var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
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

//    选择性别
$(".nav").click(function () {
    $(".nav").removeClass("xk_active");
    $(this).addClass("xk_active");
    nav = $(".xk_active").attr("value");
    window.sessionStorage.setItem("nav", nav);
});

//   选择会中文
var ischinesebtn = 0;
$("#chinesebtn").click(function () {
    if (ischinesebtn == 0) {
        $(this).addClass("china_active");
        isChinese = 1;
        ischinesebtn = 1;
    } else if (ischinesebtn == 1) {
        $(this).removeClass("china_active");
        isChinese = 0;
        ischinesebtn = 0;
    }
    window.sessionStorage.setItem("chinese", isChinese);
});

var isCollect = 0;
//    收藏的老师
$("#collectbtn").click(function () {
    if (isCollect == 0) {
        $(this).addClass("teacher_active");
        collect = 1;
        isCollect = 1;
    } else if (isCollect == 1) {
        $(this).removeClass("teacher_active");
        collect = 0;
        isCollect = 0;
    }
    window.sessionStorage.setItem("colect", collect);
});


//    日期插件
var currYear = (new Date()).getFullYear();
var opt = {};
opt.datetime = {preset: 'time'};
opt.default = {
    theme: 'android-ics light', //皮肤样式
    display: 'bottom', //显示方式
    mode: 'scroller', //日期选择模式
    lang: 'zh',
    timeWheels: 'HHii',
    timeFormat: 'HH:ii',
    startYear: currYear, //开始年份
    endYear: currYear + 4, //结束年份
    minDate: new Date(),
    onSelect: function (data) {
        //获取日期
        day = data.split(" ")[0];
        dayTime = data.split(" ")[1];
        dayTimes = dayTime;
        days = day.split("-");
        var dt = new Date(days[0], days[1]-1, days[2]);
        var weekDay = ["星期天", "星期一", "星期二", "星期三","星期四","星期五", "星期六"];
        var getDays = weekDay[dt.getDay()];
        var x= days[1]+"月"+days[2]+"日"+"("+getDays+")"+dayTimes;
        $("#appDateTime").val(x);
        window.sessionStorage.setItem("inputTime", x);
        $("#selectDate").text(x);
    }
};
$("#appDate").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
var optDateTime = $.extend(opt['datetime'], opt['default']);
$("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);


function dataTime() {
    var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var Stamp = new Date();
    return Stamp.getMonth() + 1 + "月" + Stamp.getDate() + "日" + " (" + dayNames[Stamp.getDay()] + ")";
}


function LoadPage() {
    //判断缓存性别
    var backNav = getTeacher().nav;
    if (backNav == 0) {
        $(".xk_girl").addClass("xk_active");
    } else if (backNav == 1) {
        $(".xk_man").addClass("xk_active");
    } else if (backNav == -1) {
        $(".xk_unlimited").addClass("xk_active");
    } else {
        $(".nav").removeClass("xk_active");
    }
    //会中文
    var isChinese = getTeacher().chinese;
    if (isChinese == 1) {
        $(".xk_china").addClass("china_active");
        ischinesebtn = 1;
    }
//是否收藏
    var Colect = getTeacher().colect;
    if (Colect == 1) {
        $(".xk_teacherx").addClass("teacher_active");
        isCollect = 1;
    }
    var jsonTeacher = "sMethod=GetTeacherLessonByTime&jsonStr=" +
        "{'stuId':'" + stuId + "','ToKen':'" + tokenID + "','classIds':'" + getUrl().classID + "'," +
        "'type':'" + getUrl().type + "','iscol':'" + getTeacher().colect + "','timeRegion':'" + getTeacher().times + "'," +
        "'date':'" + getTeacher().day + "','isch':'" + getTeacher().chinese + "','sex':'" + getTeacher().nav + "','pageSize':'10','pageIndex':'1'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: jsonTeacher,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.data;
                var teacherHtml = "";
//                    没有老师时显示
                if (resultData.length == 0) {
                    teacherHtml += "<div class=\"noyuyue\"><img src=\"images/no.png\"alt=\"\"/><p>抱歉sorry</p><p>该时间段没有教师请重新选择时间</p></div>";
                } else {
                    for (var i = 0; i < resultData.length; i++) {
                        var teacherNav;//老师性别
                        if (resultData[i].Gender == 0) {
                            teacherNav = "images/girl.png";
                        } else if (resultData[i].Gender == 1) {
                            teacherNav = "images/man.png";
                        }
                        //console.log(resultData[i].Age);
                        //console.log(resultData[i].Evaluate);
                        //老师评分
                        var teacherNum = resultData[i].Evaluate;
                        var firstNum = teacherNum.split(".")[0];
                        var nextNum = teacherNum.split(".")[1];
                        var teacherImg = resultData[i].TeacherImage;
                        teacherHtml += "<li><ul class=\"xk_teacher\"><li class=\"xk_left\"><a href=\"javascript:;\"onclick=\"TeacherUrl(" + resultData[i].TeacherId + "," + getUrl().classID + ",'" + getUrl().type + "','" + className + "','" + resultData[i].Id + "')\">" +
                            "<span><img src='" + teacherImg + "'/></span></a></li><li class=\"xk_left xk_lt\" onclick=\"TeacherUrl(" + resultData[i].TeacherId + "," + getUrl().classID + ",'" + getUrl().type + "','" + className + "','" + resultData[i].Id + "')\"><div><span class=\"xk_name\">" + resultData[i].Name + "</span>" +
                            "<p class=\"xk_age\"><img src='" + teacherNav + "'class=\"xk_left\"/><span class=\"xk_left\">年龄:<span>" + resultData[i].Age + "</span></span></p></div></li>" +
                            "<li class=\"xk_left xk_num\"><span class=\"\">" + firstNum + ".</span><span class=\"xk_sp\">" + nextNum + "</span></li>" +
                            "<li class=\"xk_right xk_make\"><a href=\"javascript:;\" onclick='openOrder(" + resultData[i].TeacherId + "," + resultData[i].Id + ");'>预约</a></li></ul></li>";
                    }
                    //此处填写html页面中放置目录的div标签的ID
                    //$.each(resData.data, function (i, n) {
                    //    $(panelHtml).appendTo(dvMenu);
                }
                $("#teahcerbox").html(teacherHtml);

                //});
            } else {
                alert(data.errorMsg);
            }
        }
    });
}


//  筛选按钮
$("#searchBtn").click(function () {
    teacherList();
});

//老师筛选
function teacherList(){
    if(dayTimes == undefined ||day== undefined){
        dayTimes =thisTime().time;
        day = thisTime().day;
    }
    collect = getTeacher().colect || "0";
    nav = getTeacher().nav || "-1";
    isChinese = getTeacher().chinese || "0";

    var jsonTeacher = "sMethod=GetTeacherLessonByTime&jsonStr=" +
        "{'stuId':'" + stuId + "','ToKen':'" + tokenID + "','classIds':'" + getUrl().classID + "'," +
        "'type':'" + getUrl().type + "','iscol':'" + collect + "','timeRegion':'" + dayTimes + "'," +
        "'date':'" + day + "','isch':'" + isChinese + "','sex':'" + nav + "','pageSize':'10','pageIndex':'1'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: jsonTeacher,
        success: function (data) {
            if (data.result == 1) {
                var resultData = data.data;
                console.log(resultData);
                saveTeacher(day, dayTimes, nav, isChinese, collect);
                var teacherHtml = "";
//                    没有老师时显示
                if (resultData.length == 0) {
                    teacherHtml += "<div class=\"noyuyue\"><img src=\"images/no.png\"alt=\"\"/><p>抱歉sorry</p><p>该时间段没有教师请重新选择时间</p></div>";
                } else {
                    for (var i = 0; i < resultData.length; i++) {
                        var teacherNav;//老师性别
                        if (resultData[i].Gender == 0) {
                            teacherNav = "images/girl.png";
                        } else if (resultData[i].Gender == 1) {
                            teacherNav = "images/man.png";
                        }
                        //老师评分
                        var teacherNum = resultData[i].Evaluate;
                        var firstNum = teacherNum.split(".")[0];
                        var nextNum = teacherNum.split(".")[1];
                        var teacherImg = resultData[i].TeacherImage;
                        teacherHtml += "<li><ul class=\"xk_teacher\"><li class=\"xk_left\"><a href=\"javascript:;\" onclick=\"TeacherUrl(" + resultData[i].TeacherId + "," + getUrl().classID + ",'" + getUrl().type + "','" + className + "','" + resultData[i].Id + "')\">" +
                            "<span><img src='" + teacherImg + "'/></span></a></li><li class=\"xk_left xk_lt\" onclick=\"TeacherUrl(" + resultData[i].TeacherId + "," + getUrl().classID + ",'" + getUrl().type + "','" + className + "','" + resultData[i].Id + "')\"><div><span class=\"xk_name\">" + resultData[i].Name + "</span>" +
                            "<p class=\"xk_age\"><img src='" + teacherNav + "'class=\"xk_left\"/><span class=\"xk_left\">年龄:<span>" + resultData[i].Age + "</span></span></p></div></li>" +
                            "<li class=\"xk_left xk_num\"><span class=\"\">" + firstNum + ".</span><span class=\"xk_sp\">" + nextNum + "</span></li>" +
                            "<li class=\"xk_right xk_make\"><a href=\"javascript:;\" onclick='openOrder(" + resultData[i].TeacherId + "," + resultData[i].Id + ");'>预约</a></li></ul></li>";
                    }
                    //此处填写html页面中放置目录的div标签的ID
                    //$.each(resData.data, function (i, n) {
                    //    $(panelHtml).appendTo(dvMenu);
                }
                $("#teahcerbox").html(teacherHtml);

                //});
            } else {
                alert(data.errorMsg);
            }
        }
    });
}
function getStorage() {
    var Storage = {};
    Storage.stuID = localStorage.getItem("stuID");
    Storage.tokenID = localStorage.getItem("tokenID");
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

//    确定预约
function openOrder(teacherID, lessonID) {
    layer.open({
        style: 'width:11.725rem;height:8.125rem',
        content: "<div class=\"xk_pull\"><ul><li class=\"xk_yuyue\">预约</li><li class=\"xk_day\">时间：<span class=\"xk_shijian\">"+getTeacher().day +" "+ getTeacher().times + "</span></li><li class=\"xk_course\">课程:<span>" + className + "</span></li><li class=\"xk_red\">课程两小时之内不能取消预约哦~</li><li class=\"xk_anniu2\"><a href=\"javascript:;\"class=\"xk_btn1\">取消</a><a href=\"javascript:;\"class=\"xk_btn2 orderSuccess\">确定</a></li></ul></div>",
        success: function (data, index) {
            $(data).find($(".orderSuccess")).on("click", function () {
                layer.close(index);
                var teacherJson = "sMethod=AppointmentLesson&jsonStr={'studentId':'" + stuId + "','ToKen':'" + tokenID + "'," +
                    "'classId':'" + getUrl().classID + "','type':'" + getUrl().type + "','tId':'" + teacherID + "','lessonId':'" + lessonID + "'}";
                $.ajax({
                    url: "http://studytest.4000669696.com/StudentService.ashx",
                    type: "POST",
                    contentType: "application/json;charset=utf-8;",
                    dataType: 'JSONP',
                    jsonp: "callback",
                    data: teacherJson,
                    success: function (data) {
                        if (data.result == 1) {
                            layer.close(index);
                            layer.open({
                                style: 'width:6.9rem;height:3.575rem;line-height:3.575rem;text-align:center',
                                content: '预约成功',
                                time: 2,//2秒后自动关闭
                                success: function () {
                                    LoadPage();
                                }
                            });
                        } else {
                            alert(data.errorMsg);
                        }
                    }
                });
            });
            $(data).find($(".xk_btn1")).on("click", function () {
                layer.closeAll();
            })
        }
    })
}

//    确定预约
function TeacherOK(teacherID, lessonID) {
    layer.open({
        style: 'width:11.725rem;height:8.125rem',
        content: "<div class=\"xk_pull\"><ul><li class=\"xk_yuyue\">预约</li><li class=\"xk_day\">时间：<span class=\"xk_shijian\">" + thisTime().day +" "+ thisTime().time + "</span></li><li class=\"xk_course\">课程：<span>" + className + "</span></li><li class=\"xk_red\">课程两小时之内不能取消预约哦~</li><li class=\"xk_anniu2\"><a href=\"javascript:;\"class=\"xk_btn1\">取消</a><a href=\"javascript:;\"class=\"xk_btn2 orderSuccess\">确定</a></li></ul></div>",
        success: function (data, index) {
            $(data).find($(".orderSuccess")).on("click", function () {
                layer.close(index);
                var teacherJson = "sMethod=AppointmentLesson&jsonStr={'studentId':'" + stuId + "','ToKen':'" + tokenID + "'," +
                    "'classId':'" + getUrl().classID + "','type':'" + getUrl().type + "','tId':'" + teacherID + "','lessonId':'" + lessonID + "'}";
                $.ajax({
                    url: "http://studytest.4000669696.com/StudentService.ashx",
                    type: "POST",
                    contentType: "application/json;charset=utf-8;",
                    dataType: 'JSONP',
                    jsonp: "callback",
                    data: teacherJson,
                    success: function (data) {
                        if (data.result == 1) {
                            layer.close(index);
                            layer.open({
                                style: 'width:6.9rem;height:3.575rem;line-height:3.575rem;text-align:center',
                                content: '预约成功',
                                time: 2,//2秒后自动关闭
                                success: function () {
                                    if(getTeacher().day){
                                        LoadPage();
                                    }else{
                                        autoLoadTeacher();
                                    }
                                }
                            });
                        } else {
                            alert(data.errorMsg);
                        }
                    }
                });
            });
            $(data).find($(".xk_btn1")).on("click", function () {
                layer.closeAll();
            })
        }
    })
}
//跳转至老师详情页面

function TeacherUrl(teacherID, classID, type, className, lessonId) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "teacherDetail.html?teacherID=" + teacherID + "&classID=" + classID + "&type=" + type + "&className=" + className + "&LessonID=" + lessonId;
}


function PackageUrl() {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "onlineCouse.html";
}

//保存至详情页的信息
function savrTeacherUrl(teacherID,LessonID){
    window.sessionStorage.setItem("teacherID", teacherID);
    window.sessionStorage.setItem("LessonID", LessonID);
}

// 保存url参数
function saveUrl(classID, type, className) {
    window.sessionStorage.setItem("classID", classID);
    window.sessionStorage.setItem("type", type);
    window.sessionStorage.setItem("className", className);
}

//获取url的参数
function getUrl() {
    var teacherData = {};
    teacherData.classID = sessionStorage.getItem("classID");
    teacherData.type = sessionStorage.getItem("type");
    teacherData.className = sessionStorage.getItem("className");
    return teacherData;
}
//删除url参数
function deteUrl() {
    sessionStorage.removeItem("classID");
    sessionStorage.removeItem("type");
    sessionStorage.removeItem("className");
}


//存储筛选出老师saveTeacher(day,dayTimes, nav, isChinese, collect);

function saveTeacher(day, dayTimes, nav, chinese, colect) {

    window.sessionStorage.setItem("nav", nav);
    window.sessionStorage.setItem("chinese", chinese);
    window.sessionStorage.setItem("colect", colect);
    window.sessionStorage.setItem("day", day);
    window.sessionStorage.setItem("dayTimes", dayTimes);
}
function getTeacher() {
    var teacherData = {};
    teacherData.nav = sessionStorage.getItem("nav");
    teacherData.chinese = sessionStorage.getItem("chinese");
    teacherData.colect = sessionStorage.getItem("colect");
    teacherData.times = sessionStorage.getItem("dayTimes");
    teacherData.day = sessionStorage.getItem("day");
    return teacherData;
}

function deteTeacher() {
    sessionStorage.removeItem("nav");
    sessionStorage.removeItem("chinese");
    sessionStorage.removeItem("colect");
    sessionStorage.removeItem("day");
    sessionStorage.removeItem("dayTimes");
}


function toDub(n) {
    return n < 10 ? '0' + n : '' + n;
}
function dbwClassTime(ServerTime) {
// Date.parse(ServerTime.replace(/-/g, "/"))
    var date = new Date(Date.parse(ServerTime.replace(/-/g, "/")));
    var week = date.getDay();
    var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    date.setHours(date.getHours() + 1);
    var m = date.getMonth() + 1;
    //m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    //d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    //h = h < 10 ? "0" + h : h;
    var mm = date.getMinutes();
    if (mm > 30) {
        h = h + 1;
        mm = "00";
        //h = h < 10?"0"+h: h;
    } else if (mm <= 30) {
        mm = 30;
    }

    var classTime2 ="0"+ m + "月" + d + "日" + "(" + dayNames[week] + ")" + h + ":" + mm;
    $("#selectDate").text(classTime2);
    return classTime2;
}


