package com.plugin.ahqstore

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import androidx.core.content.FileProvider

import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin

import ru.solrudev.ackpine.installer.PackageInstaller
import ru.solrudev.ackpine.installer.parameters.InstallParameters
import ru.solrudev.ackpine.session.SessionResult
import ru.solrudev.ackpine.session.await

import java.io.File
import kotlin.coroutines.cancellation.CancellationException

//fun getPkgFromFile(path: String, activity: Activity): PackageInfo? {
//  try {
//    val pkg = activity.baseContext.packageManager
//
//    val archive = pkg.getPackageArchiveInfo(path, PackageManager.GET_ACTIVITIES)
//
//    return archive
//  } catch (e: Throwable) {
//    return null
//  }
//}

@TauriPlugin
class AHQStore(private val activity: Activity): Plugin(activity) {
  private var pkgInstaller: PackageInstaller? = null

  @Command
  fun getInstalledPkgInfo(invoke: Invoke) {
    // pkgName is the package identifier
    val pkgName = invoke.parseArgs(String::class.java)

    try {
      val pkgMan = activity.baseContext.packageManager
      val info = pkgMan.getPackageInfo(pkgName, PackageManager.GET_ACTIVITIES)

      val ret = JSObject()

      ret.put("package", info.packageName)
      ret.put("version", info.versionName)
      ret.put("json", info.toString())

      invoke.resolve(ret)
    } catch (e: PackageManager.NameNotFoundException) {
      invoke.resolve()
    }
  }

  @Command
  suspend fun install(invoke: Invoke) {
    val path = invoke.parseArgs(String::class.java)

    val apk = File(path)

    val pkgMan = activity.packageManager

    if (pkgInstaller == null) {
      pkgInstaller = PackageInstaller.getInstance(activity.baseContext)
    }
    if (!pkgMan.canRequestPackageInstalls()) {
      activity.startActivity(
        Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES)
          .setData(Uri.parse(String.format("package:%s", activity.baseContext.packageName))),
      )
    }

    val ret = JSObject()

    if (apk.exists()) {
      try {
        val apkUri: Uri = FileProvider.getUriForFile(
          activity.baseContext,
          activity.applicationContext.packageName + ".fileprovider",
          apk
        )

        ret.put("success", false)

        try {
          when (val result = pkgInstaller!!.createSession(InstallParameters(apkUri) {}).await()) {
            is SessionResult.Success -> {
              ret.put("success", true)
              ret.put("msg", "Success")
            }
            is SessionResult.Error -> {
              ret.put("msg", result.toString())
            }
          }
        } catch (_: CancellationException) {
          ret.put("msg", "The operation was cancelled")
        } catch (e: Exception) {
          ret.put("msg", "Error: ${e.message}")
        }
      } catch (e: Throwable) {
        ret.put("msg", e.message)
      }
    } else {
      ret.put("success", false)
      ret.put("msg", "The app path was not found!")
    }

    invoke.resolve(ret)
  }
}
