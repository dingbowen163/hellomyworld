/**
 * Created by bxk on 2016/3/21.
 */

function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'block';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
}



//跳转至筛选老师页面
function selectTeacherUrl(classID, type, className) {

    var url = window.location.href;
    var Yurl = url.substring(0, url.lastIndexOf('/') + 1);
    var urlString = Yurl + "bespeak.html?classID=" + classID + "&type=" + type + "&className=" + className;

    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('Method_PushSecPage', {'webView': urlString}, function (response) {
        })
    });


}

function mylessonUrl(){
    var url = window.location.href;
    var Yurl = url.substring(0, url.lastIndexOf('/') + 1);
    var urlString = Yurl + "myLesson.html?v=ios";

    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('Method_PushSecPage', {'webView': urlString}, function (response) {
        })
    });
}

function online(){
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('Method_backIndex', {'webView': "dddd"}, function (response) {
        })
    });

}
//返回页面
function PackageUrl() {


    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('Method_backIndex', {'webView': 'this is webView  parameter'}, function (response) {
        })
    });
    return;

    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf('/') + 1) + "bespeak.html?classID=" + classID + "&type=" + type + "&className=" + className;
}

//预约成功后给第三方发送信息
function selectSuccess(stuID) {

    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('Method_Appointment', {'studentid': stuID}, function (response) {
        })
    });

}

//获取学生ID
function getStudents_id() {


    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('Method_studentID', {'webView_success': 'post success'}, function (response) {

        })
    });


}


function getNewMessage() {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('Method_getStudentID', function (data, responseCallback) {

            localStorage.setItem("c", data.stuid);//设置b为"isaac"
            subSomething();

            var responseData = {'Javascript Says': 'Right back atcha!'}
        })
    });

}

getNewMessage();

//预约成功后给第三方发送信息
function notification() {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('getNewdate', {'webView_success': 'post success'}, function (response) {
        })
    });

}

function getStudentIDMessage() {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('getstudentID', {'webView_success': 'post success'}, function (response) {
        })
    });

}


function text(stuID){

    alert('texc'+stuID);

}
