package com.ahqstore.lite

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.app.AlertDialog
import android.webkit.WebView

import androidx.fragment.app.DialogFragment

class CloseRequest : DialogFragment() {
  override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
    return activity?.let {
      // Use the Builder class for convenient dialog construction.
      val builder = AlertDialog.Builder(context)
      
      builder
        .setTitle("Exit Application")
        .setMessage("Are you sure you want to exit?")
        .setPositiveButton("No") { d, _ ->
          d.cancel()
        }
        .setNegativeButton("Yes") { _, _ ->
          requireActivity().finish()
        }
      // Create the AlertDialog object and return it.
      builder.create()
    } ?: throw IllegalStateException("Activity cannot be null")
  }
}

class MainActivity : TauriActivity() {
  private lateinit var wv: WebView
  
  override fun onWebViewCreate(webView: WebView) {
    wv = webView
  }
  
  @SuppressLint("MissingSuperCall", "SetTextI18n")
  @Deprecated("")
  override fun onBackPressed() {
    wv.evaluateJavascript(/* script = */ """
      try {
        window.backCall()
      } catch (_) {
        false
      }
    """.trimIndent()) { result ->
      if (result == "false") {
        CloseRequest().show(supportFragmentManager, "CLOSE_DIALOG")
      }
      println("BackPress: $result")
    }
  }

  @Deprecated("Deprecated in Java",
    ReplaceWith("super.onActivityResult(requestCode, resultCode, data)")
  )
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    
    if (requestCode == 30) {
      wv.evaluateJavascript("""
        try {
          window.installCode(${resultCode})
         } catch (_) {}
      """.trimIndent()) { result ->
        println("Message: $result")
      }
    }
  }
}
