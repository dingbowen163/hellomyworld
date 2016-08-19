/**
 * Created by bxk on 2016/3/21.
 */
//		判断平台
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
// IOS
if (isiOS) {
    importScript(["js/ios.js"]);
}

if (isAndroid) {
    importScript(["js/android.js"]);
}
//    动态引入脚本库
function importScript(scriptUrls) {
    for (var i = 0, l = scriptUrls.length; i < l; i++) {
        var s = document.createElement('script');
        s.src = scriptUrls[i]+"?version="+Math.random();
        document.getElementsByTagName('head')[0].appendChild(s);
    }
}