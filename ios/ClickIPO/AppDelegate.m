/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <Firebase.h>
#import <RNFirebaseMessaging.h>

#import "RCTPushNotificationManager.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <BuddyBuildSDK/BuddyBuildSDK.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTLinkingManager.h>
#import "Intercom/intercom.h"

#import <RNBranch.h>

// Used to the application screen being blured during it entring background mode to avoid exposing sensitve information
#define CIPO_BACKGROUND_SCREEN_TAG 9999

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  [BuddyBuildSDK setup];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  [Intercom setApiKey:@"ios_sdk-7210561af8c65cf7ebad4315ef0c6e8327901e37" forAppId:@"qzt14uk3"];
  [Intercom registerUnidentifiedUser];
  
  
  
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName:@"ClickIPO" initialProperties:nil launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  
  NSLog(@"didFinishLaunchingWithOptions");
  
  return YES;
}

//FOR Intercom
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  NSLog(@"didRegisterUserNotificationSettings : %@", notificationSettings);
  
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

//FOR Intercom
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"didRegisterForRemoteNotificationsWithDeviceToken : %@", deviceToken);
  
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  [Intercom setDeviceToken:deviceToken];
}

//FOR Intercom
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError : %@", error);
  
  
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}

-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  NSLog(@"userNotificationCenter: %@", notification);
  [RNFirebaseMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo {
  NSLog(@"userNotificationCenter: %@", userInfo);
  [RNFirebaseMessaging didReceiveRemoteNotification:userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  NSLog(@"userNotificationCenter: %@", userInfo);
  [RNFirebaseMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSLog(@"userNotificationCenter: %@", notification);
  [RNFirebaseMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"userNotificationCenter: %@", response);
  [RNFirebaseMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  if (![RNBranch.branch application:application openURL:url sourceApplication:sourceApplication annotation:annotation]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
  }
  return YES;
}

// Required for Facebook to post-process the results from actions that require the app to switch to the native Facebook app or Safari
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  
    BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
    
    if (!handled) {
      handled = [RCTLinkingManager application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
    }
    
    // Add any custom logic here.
    return handled;
 
 
}

// Required for Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
  
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  //return [RNBranch continueUserActivity:userActivity];

}

- (BOOL)application:(UIApplication *)application shouldAllowExtensionPointIdentifier:(NSString *)extensionPointIdentifier {
  if ([extensionPointIdentifier isEqualToString: UIApplicationKeyboardExtensionPointIdentifier]) {
    return NO;
  }
  return YES;
}


- (void)applicationDidEnterBackground:(UIApplication *)application
{
  // Visual effect view for blur
  UIBlurEffect *blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleDark];
  UIVisualEffectView *blurView = [[UIVisualEffectView alloc] initWithEffect:blurEffect];
  [blurView setAutoresizingMask:(UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight)];
  [blurView setFrame:self.window.frame];
  blurView.tag = CIPO_BACKGROUND_SCREEN_TAG;
  
  [self.window addSubview:blurView];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
  // remove blur view if present
  UIView *view = [self.window viewWithTag:CIPO_BACKGROUND_SCREEN_TAG];
  if (view != nil)
  {
    [UIView animateWithDuration:0.2f animations:^{
      [view setAlpha:0];
      
    } completion:^(BOOL finished) {
      [view removeFromSuperview];
    }];
  }
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

@end
