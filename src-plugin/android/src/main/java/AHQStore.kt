package com.plugin.ahqstore

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import android.os.Build
import android.webkit.WebView

import androidx.core.content.FileProvider

import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.annotation.InvokeArg
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin

import ru.solrudev.ackpine.installer.PackageInstaller
import ru.solrudev.ackpine.installer.parameters.InstallParameters
import ru.solrudev.ackpine.session.parameters.Confirmation
import ru.solrudev.ackpine.session.SessionResult
import ru.solrudev.ackpine.session.await

import java.io.File

import kotlin.coroutines.cancellation.CancellationException
import kotlinx.coroutines.*
import ru.solrudev.ackpine.uninstaller.PackageUninstaller
import ru.solrudev.ackpine.uninstaller.createSession
import ru.solrudev.ackpine.uninstaller.parameters.UninstallParameters
import java.util.Vector

@InvokeArg
class Data {
  var data: String = ""
}

val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())

@TauriPlugin
class AHQStore(private val activity: Activity): Plugin(activity) {
  private var pkgInstaller: PackageInstaller? = null
  private var pkgUninstaller: PackageUninstaller? = null

  override fun load(webView: WebView) {
    super.load(webView)

    loadAHQStoreApps()
  }

  @Command
  fun getAndroidBuild(invoke: Invoke) {
    val ret = JSObject()

    ret.put("sdk", Build.VERSION.SDK_INT)
    ret.put("release", Build.VERSION.RELEASE)

    invoke.resolve(ret)
  }

  @Command
  fun isAHQStorePackage(invoke: Invoke) {
    isAHQStorePackage(invoke.parseArgs(String::class.java))
  }

  @Command
  fun getApps(invoke: Invoke) {
    val ret = JSObject()

    val resp: List<String> = loadAHQStoreApps().map { data ->
      data.packageName
    }

    ret.put("apps", resp)

    invoke.resolve(ret)
  }

  @Command
  fun install(invoke: Invoke) {
    scope.launch {
      installInner(invoke)
    }
  }

  @Command
  fun uninstall(invoke: Invoke) {
    scope.launch {
      uninstallInner(invoke)
    }
  }

  @Command
  fun getInstalledPkgInfo(invoke: Invoke) {
    // pkgName is the package identifier
    val pkgName = invoke.parseArgs(Data::class.java).data

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

  @SuppressLint("QueryPermissionsNeeded")
  private fun loadAHQStoreApps(): Vector<PackageInfo> {
    val packageManager = activity.baseContext.packageManager

    val packages: Vector<PackageInfo> = Vector()

    for (application in packageManager.getInstalledPackages(0)) {
      val name = application!!.packageName

      if (isAHQStorePackage(name)) {
        packages.add(application)
      }
    }

    return packages
  }

  private fun isAHQStorePackage(pkg: String): Boolean {
    val packageManager = activity.baseContext.packageManager

    val source = packageManager.getInstallSourceInfo(pkg)

    val initiated = source.initiatingPackageName

    return initiated == "com.ahqstore.lite"
  }

  private suspend fun installInner(invoke: Invoke) {
    val path = invoke.parseArgs(Data::class.java).data

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

    ret.put("success", false)
    if (apk.exists()) {
      try {
        val apkUri: Uri = FileProvider.getUriForFile(
          activity.baseContext,
          activity.applicationContext.packageName + ".fileprovider",
          apk
        )

        println("Got apk Uri")

        try {
          println("pkg installer")
          when (val result = pkgInstaller!!.createSession(InstallParameters(apkUri) {
            confirmation = Confirmation.IMMEDIATE
          }).await()) {
            is SessionResult.Success -> {
              ret.put("success", true)
              ret.put("msg", "Success")
            }
            is SessionResult.Error -> {
              println("Error ${result.toString()}")
              ret.put("msg", result.toString())
            }
          }
        } catch (_: CancellationException) {
          println("Error Cancelled (u  s  e  r)")
          ret.put("msg", "The operation was cancelled")
        } catch (e: Exception) {
          println("Error $e")
          ret.put("msg", "Error: ${e.message}")
        }
      } catch (e: Throwable) {
        println("Error $e")
        ret.put("msg", e.message)
      }
    } else {
      ret.put("success", false)
      ret.put("msg", "The app path was not found!")
    }

    invoke.resolve(ret)
  }

  private suspend fun uninstallInner(invoke: Invoke) {
    val packageString = invoke.parseArgs(Data::class.java).data
    val resp = JSObject()

    resp.put("success", false)

    if (pkgUninstaller == null) {
      pkgUninstaller = PackageUninstaller.getInstance(activity.baseContext)
    }

    try {
      when (val res = pkgUninstaller!!.createSession(UninstallParameters(packageString) {
        confirmation = Confirmation.IMMEDIATE
      }).await()) {
        is SessionResult.Success -> {
          resp.put("success", true)
          resp.put("msg", "Successful")
        }
        is SessionResult.Error -> {
          resp.put("msg", res.toString())
        }
      }
    } catch (e: Throwable) {
      resp.put("msg", e.message)
    }

    invoke.resolve(resp)
  }
}
