package com.clickipo.clickipo;

import android.app.Application;

import com.clickipo.clickipo.BuildConfig;
import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.keychain.KeychainPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import io.intercom.android.sdk.Intercom;
import ga.piroro.rnt.RNTPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.BV.LinearGradient.LinearGradientPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging



import java.util.Arrays;
import java.util.List;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
@SuppressWarnings("deprecation")
public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            BugsnagReactNative.getPackage(),
            new AsyncStoragePackage(),
            new KeychainPackage(),
            new FingerprintAuthPackage(),
              new RNExitAppPackage(),
              new RNBranchPackage(),
              new RNFirebasePackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNDeviceInfo(),
              new RNFirebaseMessagingPackage(),
              new IntercomPackage(),
              new CustomTabsPackage(),
              new FBSDKPackage(mCallbackManager),
              new RNTPackage(),
              new LinearGradientPackage(),
              new RNI18nPackage(),
              new RNSpinkitPackage(),
              new VectorIconsPackage(),
              new ReactNativeConfigPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Intercom.initialize(this, "android_sdk-16ee745c2a9684923b2037ef881ebe82c88321d8", "qzt14uk3");
    Intercom.client().registerUnidentifiedUser();
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
    Branch.getAutoInstance(this);
  }

}
