package com.ahqstore.lite

import android.annotation.SuppressLint
import android.webkit.WebView

class MainActivity : TauriActivity() {
  private lateinit var wv: WebView;
  
  override fun onWebViewCreate(webView: WebView) {
    wv = webView;
  }
  
  @SuppressLint("MissingSuperCall")
  @Deprecated("")
  override fun onBackPressed() {
    wv.evaluateJavascript(/* script = */ """
      window.backCall();
    """.trimIndent()) {
      
    };
  }
}
