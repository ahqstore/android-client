# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class com.ahqstore.lite.* {
  native <methods>;
}

-keep class com.ahqstore.lite.WryActivity {
  public <init>(...);

  void setWebView(com.ahqstore.lite.RustWebView);
  java.lang.Class getAppClass(...);
  java.lang.String getVersion();
}

-keep class com.ahqstore.lite.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class com.ahqstore.lite.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void loadHTMLMainThread(...);
  void setAutoPlay(...);
  void setUserAgent(...);
  void evalScript(...);
}

-keep class com.ahqstore.lite.RustWebChromeClient,com.ahqstore.lite.RustWebViewClient {
  public <init>(...);
}