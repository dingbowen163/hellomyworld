/**
 * Created by bxk on 2016/3/21.
 */

//跳转至筛选老师页面
function selectTeacherUrl(classID,type,className) {

    var Url = window.location.href;
    var webUrl = Url.substring(0, Url.lastIndexOf('/') + 1) + "bespeak.html?classID="+classID+"&type="+type+"&className="+className;


    testClick1(webUrl);


//    var url = window.location.href;

}


function testDiv() {
    document.getElementById("show").innerHTML = document.getElementsByTagName("html")[0].innerHTML;
}
//发送消息给Native
function testClick() {
    var str1 = document.getElementById("text1").value;
    var str2 = document.getElementById("text2").value;

    //send message to native
    var data = {id: 1, content: "这是一个图片 <img src=\"a.png\"/> test\r\nhahaha"};
    window.WebViewJavascriptBridge.send(
        data
        , function(responseData) {
            document.getElementById("show").innerHTML = "repsonseData from java, data = " + responseData
        }
    );

}

function testClick1(url) {

    //call native method
    window.WebViewJavascriptBridge.callHandler(
        'Method_PushSecPage'
        , {'url': url}
        , function(responseData) {
        }
    );


}


//   返回套餐页
function PackageUrl() {

    //window.WebViewJavascriptBridge.callHandler(
    //    'submitFromWebBack'
    //    , {'url': "返回"}
    //    , function(responseData) {
    //    }
    //);

    function bridgeLog(logContent) {
        //document.getElementById("show").innerHTML = logContent;
    }



    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            //console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            //console.log('JS responding with', data);
            responseCallback(data);
        });

        bridge.registerHandler("functionInJs", function(data, responseCallback) {
            // document.getElementById("show").innerHTML = ("data from Java: = " + data);
            //var responseData = "Javascript Says Right back aka!";
            //responseCallback(responseData);
        });
    })

}


//   返回套餐页
function PackageUrl1() {


    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            //console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            //console.log('JS responding with', data);
            responseCallback(data);
        });

        bridge.registerHandler("functionInJs", function(data, responseCallback) {
            // document.getElementById("show").innerHTML = ("data from Java: = " + data);
            //var responseData = "Javascript Says Right back aka!";
            //responseCallback(responseData);
        });
    })

}

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false

        );
    }
}

//   发送预约短信
function Method_Appointment() {

    window.WebViewJavascriptBridge.callHandler(
        'Method_Appointment'
        , {'url': "返回"}
        , function(responseData) {

        }
    );

    function bridgeLog(logContent) {
        //document.getElementById("show").innerHTML = logContent;
    }



    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            //console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            //console.log('JS responding with', data);
            responseCallback(data);
        });

    })


}

function getStudentID(){

    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            console.log('JS responding with', data);
            responseCallback(data);
        });

        bridge.registerHandler("Method_getStudentID", function(data, responseCallback) {

            localStorage.setItem("c",data);//设置b为"isaac"
            subSomething();
            responseCallback(responseData);
        });
    })
}
getStudentID();







//   发送StudentID
function getStudents_id() {

    window.WebViewJavascriptBridge.callHandler(
        'Method_getStudentID'
        , {'url': "返回"}
        , function(responseData) {

        }
    );

    function bridgeLog(logContent) {
        //document.getElementById("show").innerHTML = logContent;
    }

    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            //console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            //console.log('JS responding with', data);
            responseCallback(data);
        });

    })


}

function mylessonUrl(){
    var url = window.location.href;
    var Yurl = url.substring(0, url.lastIndexOf('/') + 1);
    var urlString = Yurl + "myLesson.html?v=ios";
           window.WebViewJavascriptBridge.callHandler(
               'Method_PushSecPage'
               , {'url':urlString}
               , function(responseData) {
               }
           );


}


//预约成功后给第三方发送信息
function selectSuccess(stuID) {

alert('selectSuccess');
    window.WebViewJavascriptBridge.callHandler(
        'Method_Appointment'
        , {'url': "返回"}
        , function(responseData) {

        }
    );

    function bridgeLog(logContent) {
        //document.getElementById("show").innerHTML = logContent;
    }



    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            //console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            //console.log('JS responding with', data);
            responseCallback(data);
        });

    })
}


function  online(){
PackageUrl();
}


