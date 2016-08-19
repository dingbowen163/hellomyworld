/**
 * Created by bxk on 2016/3/17.
 */
//接口调用
var jsonStr = "sMethod=GetToken&jsonStr={'orgName':'dashan','PassWord':'dashan3210'}";

//js调用接口获取目录内容并加载
getNewDate();
function getNewDate(){
    $.ajax({

    url: "http://studytest.4000669696.com/StudentService.ashx",
    type: "POST",
    contentType: "application/json;charset=utf-8;",
    dataType: 'JSONP',
    data: jsonStr,
    jsonp: "callback",
    jsonpCallback: "success_jsonp",
    success: function (data) {
        var studentId = 2523;//学生信息ID
        var tokenID = data.ToKen;
        //保存stuID tokenID
        saveStorage(studentId, tokenID);
        var jsonData = "sMethod=GetUserLesson&jsonStr={'stuId':'" + studentId + "','ToKen':'" + tokenID + "'}";

        //{studentId:"1",pageIndex:"1",pageSize:"3",ToKen:"bi6Zmpl6XAYuQBoPJT8TO7TeLp4zNWtg"}
        if (data.result == 1) {
            // 验证token成功
            $.ajax({
                url: "http://studytest.4000669696.com/StudentService.ashx",
                type: "POST",
                contentType: "application/json;charset=utf-8;",
                dataType: 'JSONP',
                jsonp: "callback",
                data: jsonData,
                success: function (data) {
                    
                    if (data.result == 1) {
                        var resultData = data.data;
                        console.log(resultData[1]);
                        var panelHtml = "";
                        for (var i = 0; i < resultData.length; i++) {
                            var num = resultData[i].classCount- resultData[i].stuCount;
                            if(num == 0 ){
                                panelHtml += "<li class=\"xk_left xk_panel\" onclick=\"noTeacherUrl();\"><ul><li class=\"xk_left\"><div class=\"xk_jQsmall\">";
                            }else {
                                panelHtml += "<li class=\"xk_left xk_panel\" onclick=\"selectTeacherUrl('" + resultData[i].id + "','" + resultData[i].type + "','" + resultData[i].specialtyName2 + "');\"><ul><li class=\"xk_left\"><div class=\"xk_jQsmall\">";
                            }
                            panelHtml += "<img src=\"images/jqEnglish-1.png\"alt=\"\"/></div></li>";
                            panelHtml += "<li class=\"xk_left\"><ul><li class=\"xk_cook1\">" + resultData[i].specialtyName2 + "</li>";
                            panelHtml += "<li class=\"xk_cook2\">有效时间：<a href=\"javascript:;\">" + timeChage(resultData[i].endDate) + "</a></li>";
                            panelHtml += "<li class=\"xk_cook2\">课程进度：<a href=\"javascript:;\">" + resultData[i].stuCount + " / " + resultData[i].classCount + "</a></li></ul></li></ul></li>";
                        }

                        $("#panelbox").html(panelHtml);//此处填写html页面中放置目录的div标签的ID
                            
                        //$.each(resData.data, function (i, n) {
                        //    $(panelHtml).appendTo(dvMenu);
                        //});
                    } else {
                        alert(data.errorMsg);
                    }
                }
            });
        } else {
            alert(data.errorMsg);
        }
    }
});
}

deteTeacher();
deteUrl();
//123456
// var count = 0;
// window.onload = subSomething;//当页面加载状态改变的时候执行这个方法.
// function subSomething() {

//    if (count == 5) {
//        alert('获取学员信息失败，请重新请求');
//        return false;
//    } else {
//        var b = localStorage.getItem("c");
//        if (b != null) {
//            studentIDStr = b;
//            getNewDate();
//        } else {
//            getStudents_id()
//        }
//    }
//    //当页面加载状态
// }

$("#myLessonBtbn").click(function(){
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "myLesson.html?v=onlineCouse";
});
//没有套餐时弹出提示
function noTeacherUrl(){
    layer.open({
        style: 'width:10rem;height:3.575rem;line-height:3.575rem;text-align:center',
        content: '该套餐的课时已用完',
        time: 3 //2秒后自动关闭
    });
}
// 跳转至筛选老师页面
function selectTeacherUrl(classID,type,className) {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "bespeak.html?classID="+classID+"&type="+type+"&className="+className;
}
//时间格式转换
function timeChage(time){
    var time = time || "-";
    var timeArr = time.split("-");
    return timeArr[0]+" / "+timeArr[1]+" / "+timeArr[2];
}

function saveStorage(stuID, tokenID) {
    localStorage.removeItem("stuID");
    localStorage.removeItem("tokenID");
    localStorage.setItem("stuID", stuID);
    localStorage.setItem("tokenID", tokenID);
}

function deteTeacher() {
    sessionStorage.removeItem("nav");
    sessionStorage.removeItem("chinese");
    sessionStorage.removeItem("colect");
    sessionStorage.removeItem("day");
    sessionStorage.removeItem("dayTimes");
}
//删除url参数
function deteUrl() {
    sessionStorage.removeItem("classID");
    sessionStorage.removeItem("type");
    sessionStorage.removeItem("className");
}


