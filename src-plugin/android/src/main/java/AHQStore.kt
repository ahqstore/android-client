package com.plugin.ahqstore

import android.app.Activity
import android.content.Intent
import android.net.Uri

import androidx.core.content.ContextCompat.startActivity
import androidx.core.content.FileProvider

import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin

import java.io.File

@TauriPlugin
class AHQStore(private val activity: Activity): Plugin(activity) {
  @Command
  fun close() {
    activity.finish()
  }

  @Command
  fun install(invoke: Invoke) {
    val path = invoke.parseArgs(String::class.java)

    val apk = File(path)

    val ret = JSObject()

    if (apk.exists()) {
      try {
        val apkUri: Uri = FileProvider.getUriForFile(
          activity.baseContext,
          activity.applicationContext.packageName + ".fileprovider",
          apk
        )

        val intent = Intent(Intent.ACTION_VIEW)
        intent.setDataAndType(apkUri, "application/vnd.android.package-archive")
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION) // Permission for the URI
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) // Required for starting the intent

        startActivity(activity.baseContext, intent, null)

        ret.put("success", true)
        ret.put("msg", "App installed successfully")
      } catch (e: Exception) {
        ret.put("success", false)
        ret.put("msg", e.toString())
      }
    } else {
      ret.put("success", false)
      ret.put("msg", "The app path was not found!")
    }

    invoke.resolve(ret)
  }
}
