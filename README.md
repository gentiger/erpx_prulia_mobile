# erpx_prulia_mobile
### Mobile app for PRULIA ERPX Client

This is a Cordova based container for PRULIA ERPX Client

This provides login and desk pages that will load application files (HTML/JS/CSS) from the server.

Compatible with Frappe version 6/7+

#### Requirements

Cordova

#### Install Platforms

```
$ cordova platform add ios
$ cordova platform add android
```

#### Install Plugins:

```
$ cordova plugin add cordova-plugin-statusbar
$ cordova plugin add cordova-plugin-inappbrowser
$ cordova plugin add cordova-plugin-file
```

#### Build iOS

Install and update the latest XCode

```
$ cordova build ios && cordova emulate ios && open -a "ios simulator"
```

Release for iOS is via XCode

#### Build Android

Install Android SDK

Tip: Try Android Studio

```
$ cordova build android
$ cordova build android --release
```

#### Adding Android Keys

For debug, you don't need to add any keystore.

For release, generate a `release.keystore` using this [link](https://developer.android.com/studio/publish/app-signing.html). Put the file in the `build` directory and add this to your `build.json`
```
{
    "android": {
        "debug": {
            "keystore": "build/debug.keystore",
            "storePassword": "debug123",
            "alias": "alias_name",
            "password" : "debug123",
            "keystoreType": ""
        },
        // add your release key configuration
        "release": {
            "keystore": "build/release.keystore",
            "storePassword": "password",
            "alias": "alias_name",
            "password" : "password",
            "keystoreType": ""
        }
    }
}
```

#### License
