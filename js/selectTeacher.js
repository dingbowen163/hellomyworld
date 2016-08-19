/**
 * Created by bxk on 2016/3/21.
 */
var day;//日期
var dayTime;//时间
var nav = -1;//性别
var isChinese = 0;//是否会中文
var collect = 0;//收藏的老师
var teacherID;//老师ID

//    选择性别
$(".nav").click(function () {
    $(".nav").removeClass("xk_active");
    $(this).addClass("xk_active");
    nav = $(".xk_active").attr("value");
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
        dayTimes = data;
    }
};
$("#appDate").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
var optDateTime = $.extend(opt['datetime'], opt['default']);
$("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
//    学生token
var stuId = getStorage().stuID;
//    学生ID
var tokenID = getStorage().tokenID;
alert(tokenID);
//    课程名称
var className = GetRequest().className;




//   清除选项
$("#dumpBtn").click(function () {
    $(".nav").removeClass("xk_active");
    $("#chinesebtn").removeClass("china_active");
    $("#collectbtn").removeClass("teacher_active");
    ischinesebtn = 0;
    isCollect = 0;
    nav = null;
    isChinese = null;
    collect = null;
    day = null;
    dayTime = null;
});

//  筛选按钮
$("#searchBtn").click(function () {
    var jsonTeacher = "sMethod=GetTeacherLessonByTime&jsonStr=" +
        "{'stuId':'" + stuId + "','ToKen':'" + tokenID + "','classIds':'" + GetRequest().classID + "'," +
        "'type':'" + GetRequest().type + "','iscol':'" + collect + "','timeRegion':'" + dayTime + "'," +
        "'date':'" + day + "','isch':'" + isChinese + "','sex':'" + nav + "','pageSize':'10','pageIndex':'1'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp: "callback",
        data: jsonTeacher,
        success: function (data) {
            console.log(data);

            if (data.result == 1) {
                var resultData = data.data;

                var teacherHtml = "";
//                    没有老师时显示
                if (resultData.length == 0) {
                    teacherHtml += "<div class=\"noyuyue\"><img src=\"images/no.png\"alt=\"\"/><p>目前没有合适的老师</p><p>主人要不要换一个时间哦</p></div>";
                } else {
                    for (var i = 0; i < resultData.length; i++) {
                        var teacherNav;//老师性别
                        if (resultData[i].Gender == 0) {
                            teacherNav = "images/girl.png";
                        } else if (resultData[i].Gender == 1) {
                            teacherNav = "images/man.png";
                        }
                        console.log(resultData[i].Age);
                        console.log(resultData[i].Evaluate);
                        //老师评分
                        var teacherNum = resultData[i].Evaluate;
                        var firstNum = teacherNum.split(".")[0];
                        var nextNum = teacherNum.split(".")[1];
                        var teacherImg = resultData[i].TeacherImage;
                        alert(GetRequest().className);
                        teacherHtml += "<li><ul class=\"xk_teacher\"><li class=\"xk_left\"><a href=\"javascript:;\">" +
                            "<img src='" + teacherImg + "'/></a></li><li class=\"xk_left xk_lt\" onclick=\"TeacherUrl("+resultData[i].TeacherId + ","+GetRequest().classID+",'"+GetRequest().type+"','"+className+"','"+ resultData[i].Id+"')\"><div><span class=\"xk_name\">" + resultData[i].Name + "</span>" +
                            "<p class=\"xk_age\"><img src='" + teacherNav + "'class=\"xk_left\"/><span class=\"xk_left\">年龄:<span>" + resultData[i].Age + "</span></span></p></div></li>" +
                            "<li class=\"xk_left xk_num\"><span class=\"\">"+firstNum+".</span><span class=\"xk_sp\">"+nextNum+"</span></li>" +
                            "<li class=\"xk_right xk_make\"><a href=\"javascript:;\" onclick='openOrder("+resultData[i].teacherID+","+resultData[i].Id+");'>预约</a></li></ul></li>";
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
});
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
function openOrder(teacherID,lessonID){
    layer.open({
        style:'width:11.725rem;height:7.125rem',
        content:"<div class=\"xk_pull\"><ul><li class=\"xk_yuyue\">预约</li><li class=\"xk_day\">时间:<span class=\"xk_shijian\">"+dayTimes+"</span></li><li class=\"xk_course\">课程:<span>"+className+"</span></li><li class=\"xk_red\">课程俩小时之内不能取消预约哦~</li><li class=\"xk_anniu2\"><a href=\"javascript:;\"class=\"xk_btn1\">取消</a><a href=\"javascript:;\"class=\"xk_btn2 orderSuccess\">确定</a></li></ul></div>",
        success:function(data,index){
            $(data).find($(".orderSuccess")).on("click",function(){
                layer.close(index);
                var teacherJson = "sMethod=AppointmentLesson&jsonStr={'studentId':'" + stuId + "','ToKen':'" + tokenID + "'," +
                    "'classId':'" + GetRequest().classID + "','type':'" + GetRequest().type + "','tId':'" + teacherID + "','lessonId':'" + lessonID + "'}";
                $.ajax({
                    url: "http://studytest.4000669696.com/StudentService.ashx",
                    type: "POST",
                    contentType: "application/json;charset=utf-8;",
                    dataType: 'JSONP',
                    jsonp:"callback",
                    data: teacherJson,
                    success: function (data) {
                        console.log(data);
                        if (data.result == 1) {
                            layer.open({
                                style:'width:6.9rem;height:3.575rem;line-height:3.575rem;text-align:center',
                                content: '预约成功',
                                time: 2 //2秒后自动关闭
                            });
                        } else {
                            alert(data.errorMsg);
                        }
                    }
                });
            })
            $(data).find($(".xk_btn1")).on("click",function(){
                layer.closeAll();
            })
        }
    })
}
//    确定预约
function TeacherOK(teacherID,lessonID){
    var teacherJson = "sMethod=AppointmentLesson&jsonStr={'studentId':'" + stuId + "','ToKen':'" + tokenID + "'," +
        "'classId':'" + GetRequest().classID + "','type':'" + GetRequest().type + "','tId':'" + teacherID + "','lessonId':'" + lessonID + "'}";
    $.ajax({
        url: "http://studytest.4000669696.com/StudentService.ashx",
        type: "POST",
        contentType: "application/json;charset=utf-8;",
        dataType: 'JSONP',
        jsonp:"callback",
        data: teacherJson,
        success: function (data) {
            console.log(data);
            if (data.result == 1) {
                layer.open({
                    content: '预约成功',
                    time: 2 //2秒后自动关闭
                });
            } else {
                alert(data.errorMsg);
            }
        }
    });
}
//跳转至老师详情页面

function TeacherUrl(teacherID,classID,type,className,lessonId) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "teacherDetail.html?teacherID=" + teacherID+"&classID="+classID+"&type="+type+"&className="+className+"&LessonID="+lessonId;
}

//   返回套餐页
function  PackageUrl(){
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "onlineCouse.html";
}