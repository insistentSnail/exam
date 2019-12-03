import Vue from "vue"
import router from '@/router/index'

document.addEventListener('plusready', function() {
  var webview = plus.webview.currentWebview();
  plus.key.addEventListener('backbutton', function() {
      webview.canBack(function(e) {
        
        var pathLength = router.history.current.fullPath.split("/").length;
        if(pathLength > 2) {
            webview.back();
        }else {
            webview.close(); //hide,quit
            plus.runtime.quit();
        }
      })
  });
});