import React, { Component } from "react";
import { Platform, Linking, Image } from "react-native";
import { connect } from "react-redux";
import {
  Scene,
  Reducer,
  Router,
  Switch,
  Modal,
  Actions,
  ActionConst,
  Overlay,
  Tabs,
  Drawer,
  Stack,
  Lightbox
} from "react-native-router-flux";
import styles from "./Styles/NavigationContainerStyle";
import NavigationDrawer from "./NavigationDrawer";
import NavItems from "./NavItems";
import crossroads from "crossroads";

import NavBar from "../Components/NavBar";
import StartupActions from "../Redux/StartupRedux";

// import { customPanHandlers, iosOnlyPanHandlers } from "./CustomPanHandlers";

// screens identified by the router

import InitialViewController from "../Containers/InitialViewController";
import PrivacyView from "../Containers/PrivacyView";
import ErrorView from "../Containers/ErrorView";
import OauthView from "../Containers/OauthView";
import OauthSocialView from "../Containers/OauthSocialView";

import IntroScreen from "../Containers/IntroScreen";

import LoginScreen from "../Containers/LoginScreen";
import LoginContinueScreen from "../Containers/LoginContinueScreen";


import RegisterProfileScreen from "../Containers/RegisterProfileScreen";

import RegisterTermsConditionsScreen from "../Containers/RegisterTermsConditionsScreen";

import ForgotPasswordView from "../Containers/ForgotPasswordView";
import VerifyEmailScreen from "../Containers/VerifyEmailScreen";

import InitSessionController from "../Containers/InitSessionController";
import EnableTouchIdView from "../Containers/EnableTouchIdView";
import EnableNotificationsView from "../Containers/EnableNotificationsView";
import ServerMaintenance from "../Containers/ServerMaintenance";

// import OfferingsView from '../Containers/OfferingsView'

import OfferingsScreen from "../Containers/OfferingsScreen";
import OfferingDetailsScreen from "../Containers/OfferingDetailsScreen";
import OfferingDetailsNotification from "../Containers/OfferingDetailsNotification";
import ProspectusScreen from "../Containers/ProspectusScreen";

import OfferingsSearchScreen from "../Containers/OfferingsSearchScreen";

import OrderDetailsScreen from "../Containers/OrderDetailsScreen";
import OrderCreateScreen from "../Containers/OrderCreateScreen";
import FakeOrderCreateScreen from "../Containers/FakeOrderCreateScreen";
import OrderAcceptedScreen from "../Containers/OrderAcceptedScreen";
import OrderModifyScreen from "../Containers/OrderModifyScreen";
import OrderCancelConfirmScreen from "../Containers/OrderCancelConfirmScreen";
import OrderCanceledScreen from "../Containers/OrderCanceledScreen";
import OrderReconfirmation from "../Containers/OrderReconfirmation";
import OrderModificationSuccess from "../Containers/OrderModificationSuccess";

import AccountView from "../Containers/AccountView";
import ProfileView from "../Containers/ProfileView";
import ProfileEditView from "../Containers/ProfileEditView";
import ProfileChangePasswordView from "../Containers/ProfileChangePasswordView";
import BrokerConnectView from "../Containers/BrokerConnectView";
import ProfileNotificationsView from "../Containers/ProfileNotificationsView";

import InvestorScoreView from "../Containers/InvestorScoreView";

import EducationScreen from "../Containers/EducationScreen";
import ArticleScreen from "../Containers/ArticleScreen";
import TermDetailsScreen from "../Containers/TermDetailsScreen";

import FinraView from "../Containers/FinraView";
import HelpWebView from "../Containers/HelpWebView";
import ContactUsWebView from "../Containers/ContactUsWebView";


import SocialShareMessageView from "../Containers/SocialShareMessageView";
import DetailViewModal from "../Containers/DetailViewModal";
import NewOfferingsView from "../Containers/NewOfferingsView";
import NewOfferingView from "../Containers/NewOfferingView";
import firebase from "../Config/FirebaseConfig";
import UserActions from "../Redux/UserRedux";
import moment from "moment";

import AppUpdateScreen from "../Containers/AppUpdateScreen";

import BrokerView from "../Containers/BrokerView";
import ProfileSocialView from "../Containers/ProfileSocialView";

import PasswordResetNoticeScreen from "../Containers/PasswordResetNoticeScreen";
import PasswordResetScreen from "../Containers/PasswordResetScreen";

//import NotificationActions from '../Redux/NotificationRedux'

import Images from "../Themes/Images";

import Logger from "../Lib/Logger";

import branch from "react-native-branch";
// import OfferingDetailsNotification from "../Containers/OfferingDetailsNotification";

/***************************
 * Documentation:
 *   react-native-router-flux - https://github.com/aksonov/react-native-router-flux
 *   deep linking - https://github.com/aksonov/react-native-router-flux/issues/704, https://developer.android.com/training/app-indexing/deep-linking.html
 ***************************/

// connect the router to redux
const RouterWithRedux = connect()(Router);

// define URL schemes
crossroads.addRoute("deeplinks/offering-details/{id}");
crossroads.addRoute("deeplinks/new-offerings/");

const getSceneStyle = (
  /* NavigationSceneRendererProps */ props,
  computedProps
) => {
  // Logger.log({ function: 'NavigationRouter.getSceneStyle', props: props, computedProps: computedProps })

  const style = {
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null
  };
  // if (computedProps.isActive) {
  //   style.marginTop = computedProps.hideNavBar
  //     ? 0
  //     : Platform.OS == "android" ? 54 : 82;
  //   style.marginBottom = computedProps.hideTabBar
  //     ? 0
  //     : Platform.OS == "android" ? 54 : 82;
  // }

  return style;
};

class NavigationRouter extends Component {
  state: {
    navBarImage: Image.propTypes.source
  };

  _unsubscribeFromBranch = null;

  drawerChildrenWrapper: Scene;

  constructor(props) {
    super(props);

    this.handleOpenURL = this.handleOpenURL.bind(this);
    this.openDeeplink = this.openDeeplink.bind(this);

    this.drawerChildrenWrapper = null;

    if (Platform.OS === "android") {
      this.state = {
        navBarImage: props.navBarImage
      };
    } else {
      this.state = {
        navBarImage: null
      };
    }
  }

  componentDidMount = () => {
    this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {

      if (error) {
        return;
      }

      if (params["+non_branch_link"]) {
        const non_branch_link = params["+non_branch_link"]
        const branch_scheme = "https://go.clickipo.com/";

        if (non_branch_link && non_branch_link.indexOf(branch_scheme) === 0) {

          const url = non_branch_link.slice(branch_scheme.length);
          const deeplink = { route: url };

          // console.warn('1', deeplink)
          this.openDeeplink(deeplink, null);

          this.props.startupWithDeeplink({
            linkType: url,
            id: null,
            notification: null
          });

        } else {
          this.handleOpenURL({ url: params["+non_branch_link"] })
        }

      }

      if (params["+clicked_branch_link"]) {
        var url_complete = params["~referring_link"];

        const branch_scheme = "https://go.clickipo.com/";
        const url = url_complete.slice(branch_scheme.length);
        const deeplink = { route: url };

        // console.warn('2', deeplink)
        this.openDeeplink(deeplink, null);

        this.props.startupWithDeeplink({
          linkType: url,
          id: null,
          notification: null
        });

        return;
      }
    });

    Linking.getInitialURL()
      .then(url => this.handleOpenURL({ url }))
      .catch(error => console.error(error));

    Linking.addEventListener("url", this.handleOpenURL);

    //this.props.requestPermissions()

    //firebase.messaging().requestPermissions();

    //for when app is killed / not running and notification is clicked
    firebase
      .messaging()
      .getInitialNotification()
      .then(notification => {
        if (notification) {
          this.handleNotification(notification);
        }
      });

    //for when app is opened / in background and notification received
    firebase.messaging().onMessage(notification => {
      if (notification) {
        if (Platform.OS == "android") {
          if (
            notification._notificationType == null &&
            notification.fcm &&
            notification.fcm.body &&
            notification.fcm.title
          ) {
            firebase.messaging().createLocalNotification({
              body: notification.fcm.body,
              title: notification.fcm.title,
              link: notification.link,
              id: "" + new Date().getTime(),
              local_notification: true,
              show_in_foreground: true,
              _notificationType: "local_notification",
              "google.sent_time": new Date().getTime(),
              to: notification.to,
              offering_id: notification.offering_id
            });
          } else if (notification.opened_from_tray) {
            this.handleNotification(notification);
          }
        }

        if (Platform.OS == "ios") {
          this.handleNotification(notification);

          // if(!notification.opened_from_tray && notification.aps && notification.aps.alert && notification.aps.alert.body && notification.aps.alert.title){
          //   firebase.messaging().createLocalNotification({
          //     fire_date: new Date().getTime() + 100,
          //     body: notification.aps.alert.body,
          //     title: notification.aps.alert.title,
          //     link: notification.link,
          //     id: '' + new Date().getTime(),
          //     local_notification: true,
          //     show_in_foreground: true,
          //     _notificationType: 'local_notification',
          //   })
          // } else if (notification.opened_from_tray){
          //   this.handleNotification(notification)
          // }
        }
      }
    });
  };

  handleNotification = notification => {
    const scheme = "clickipo";
    if (notification.link && notification.link.indexOf(scheme + "://") === 0) {
      const url = notification.link.slice(scheme.length + 3);
      const deeplink = { route: url };

      this.openDeeplink(deeplink, notification);
    }
  };

  componentWillReceiveProps = newProps => {
    if (Platform.OS === "android") {
      this.setState({ navBarImage: newProps.navBarImage });
    }
  };

  componentWillUnmount = () => {
    Linking.removeEventListener("url", this.handleOpenURL);
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch();
      this._unsubscribeFromBranch = null;
    }
  };

  handleOpenURL = event => {
    const scheme = "clickipo://";
    const branch_scheme = "https://go.clickipo.com/";

    if (event.url && event.url.indexOf(scheme) === 0) {

      // remove "clickipo://" and try to match
      //crossroads.parse(event.url.slice(scheme.length + 3));

      const url = event.url.slice(scheme.length);
      const deeplink = { route: url };

      this.openDeeplink(deeplink, null);
    } else if (event.url && event.url.indexOf(branch_scheme) === 0) {

      const url = event.url.slice(branch_scheme.length);
      const deeplink = { route: url };


      this.openDeeplink(deeplink, null);

      branch.openURL(scheme + url);
    }
  };

  logNotificationRequest = notification => {
    const notification_data = {
      to: notification.to,
      notification: { body: notification.body, title: notification.title },
      data: {
        offering_id: notification.offering_id,
        link: notification.link,
        to: notification.to,
        body: notification.body,
        title: notification.title
      }
    };
    const data = {
      offering_id: notification.offering_id,
      notification_data: JSON.stringify(notification_data),
      notification_received_time: moment(
        notification["google.sent_time"]
      ).format("YYYY-MM-DD HH:mm:ss ZZ"),
      notification_viewed_time: moment().format("YYYY-MM-DD HH:mm:ss ZZ")
    };
   this.props.logNotificationOpen(data);
  };

  openDeeplink = (deeplink, notification) => {
    // startupComplete always false when app is opened
    /***
  this.props.startupWithDeeplink({linkType: deeplink.route, id: null})
  ***/

    
    if (notification) {
      this.logNotificationRequest(notification);
    }
    
    if (this.props.startupComplete) {
      const url = deeplink.route;
      const urlArray = url.split("/");
      //why are we setting route to equal the last index in the urlArray? shouldnt it be the first
      const route = urlArray[urlArray.length - 1];
      // const route = urlArray[0];
      const urlArraySize = urlArray.length;

      if (route.includes("forgot-password")) {
        var routeArr = route.split("=");
        var reset_password_token = routeArr[routeArr.length - 1];
        
        Actions.passwordResetScreen({ reset_password_token: reset_password_token });
        
      } else if (route.includes("email-verify")) {

        const routeArr = route.split("=");
        const verifyEmailToken = routeArr[routeArr.length -1];
        Actions.verifyEmailScreen({ verifyEmailToken })
      } else if (route === "onboarding") {
        const subRoute = urlArray[1];

        if (subRoute === "carousel1") {
          Actions.initSession({ onboarding: true, id: 0 });
        } else if (subRoute === "carousel2") {
          Actions.initSession({ onboarding: true, id: 1 });
        } else if (subRoute === "carousel3") {
          Actions.initSession({ onboarding: true, id: 2 });
        } else if (subRoute === "carousel4") {
          Actions.initSession({ onboarding: true, id: 3 });
        } else if (subRoute === "carousel5") {
          Actions.initSession({ onboarding: true, id: 4 });
        } else if (subRoute === "carousel6") {
          Actions.initSession({ onboarding: true, id: 5 });
        } else if (subRoute === "enable-notifs") {
          Actions.initSession({ notificationsPrompt: true });
        } else if (subRoute === "enable-touchid") {
          Actions.initSession({ touchIdPrompt: true });
        }
      } else if (route === "login") {
        Actions.login();
      } else if (route === "register") {
        Actions.register();
      } else if (route === "brokerages") {
        Actions.account({ brokerages: true });
      } else if (route === "social") {
        Actions.account({ social: true });
      } else if (route === "nav") {
      } else if (route === "search") {
      } else if (route === "order_reconfirmation") {
        Actions.orderReconfirmation({ orderId: urlArray[1] });
      } else if (route === 'update-offerings') {
        const arrOfExtIDs = JSON.parse(notification.offering_ext_id)
        Actions.newOfferingView({offeringExtID: arrOfExtIDs[0]});
      } else if (route === "new-offerings") {
        Actions.newOfferingsView();
        //checking to see if the first index in the urlArray is equal to offerings -- why is route == last index in the urlArray
      } else if (urlArray[0] === "offerings") {
        if (urlArray[1].includes('offer_id')) {
          const subRouteArray = urlArray[1].split('=');
          // if subRouteArray has the ampersand sign split by that and only send the ext_id to the offeringDetailsNotification component
          if(subRouteArray[1].includes('&')) {
            const extIDSeparated = subRouteArray[1].split('&');
            Actions.offeringDetailsNotification({ offering_ext_id: extIDSeparated[0] });  
          } else {
            Actions.offeringDetailsNotification({ offering_ext_id: subRouteArray[1] });  
          }
        } else {
          Actions.offeringDetailsNotification({offering_ext_id: urlArray[1]});
        }
      } else if (route === "offering") {
        if (urlArraySize === 1) {
          Actions.offerings();
        } else if (urlArraySize === 2) {
          const subRoute = urlArray[1];

          if (subRoute === "following") {
            Actions.offerings({ following: true });
          } else if (subRoute === "orders") {
          } else {
            Actions.offerings({ id: urlArray[1] });
          }
        } else if (urlArraySize === 3) {
          const subRoute = urlArray[1];

          if (subRoute === "following") {
          } else if (subRoute === "orders") {
          } else {
            const subRoute2 = urlArray[2];
            if (subRoute2 === "prospectus") {
              Actions.offeringDetails({ id: urlArray[1], prospectus: true });
            } else if (subRoute2 === "share-st") {
              Actions.offeringDetails({ id: urlArray[1], startShare: "st" });
            } else if (subRoute2 === "share-fb") {
              Actions.offeringDetails({ id: urlArray[1], startShare: "fb" });
            } else if (subRoute2 === "share-tw") {
              Actions.offeringDetails({ id: urlArray[1], startShare: "tw" });
            } else if (subRoute2 === "order") {
              Actions.orderCreate({ id: urlArray[1], placeOrder: true });
            }
          }
        }
      } else if (route === "support") {
        if (urlArraySize === 2) {
          const subRoute = urlArray[1];

          if (subRoute === "waitlist") {
            Actions.detailViewModal({ content: "waitlist" });
          }
        } else if (urlArraySize === 3) {
          const subRoute = urlArray[1];

          if (subRoute === "investor-score") {
            const subRoute2 = urlArray[2];

            if (subRoute2 === "how-it-works") {
              Actions.investorScore();
            } else if (subRoute2 === "faq") {
              Actions.investorScore({ faq: true });
            }
          } else if (subRoute === "edu") {
            const subRoute2 = urlArray[2];
            if (subRoute2 === "glossary") {
              Actions.education();
            } else if (subRoute2 === "article") {
              Actions.education({ article: true });
            } else if (subRoute2 === "faq") {
              Actions.education({ faq: true });
            }
          }
        } else if (urlArraySize === 4) {
          const subRoute = urlArray[1];

          if (subRoute === "edu") {
            const subRoute2 = urlArray[2];

            if (subRoute2 === "article") {
              Actions.articleDetails({ article: { id: urlArray[3] } });
            } else if (subRoute2 === "glossary") {
            }
          }
        }
      }
    } else {
      this.props.startupWithDeeplink({
        linkType: deeplink.route,
        id: null,
        notification: notification
      });
    }
  };

  render = () => {
    const platformBasedConfigs = Platform.select({
      ios: {
        // getPanHandlers: customPanHandlers({
        //   horizontalPanRatio: 0.5,
        //   horizontalOnBack: () => Actions.pop()
        // })
      },
      android: {
        panHandlers: null
      }
    });

    return (
      <RouterWithRedux
        getSceneStyle={getSceneStyle}
        titleStyle={{ fontSize: 16 }}
      >
      <Scene key="root" hideTabBar hideNavBar>
        <Scene
          initial={true}
          key="initialViewController"
          component={InitialViewController}
          hideNavBar
          hideTabBar
        />

        <Scene
          key="privacy"
          component={PrivacyView}
          hideNavBar
          hideTabBar
        />

        <Scene
          key="intro"
          component={IntroScreen}
          hideNavBar
          hideTabBar
        />

        <Scene
          key="appUpdate"
          component={AppUpdateScreen}
          hideNavBar
          hideTabBar
        />

        <Scene
          key="register"
          component={RegisterProfileScreen}
          renderTitle={NavItems.title}
          title="Create account password"
          renderBackButton={NavItems.backButton}
          {...platformBasedConfigs}
          hideNavBar={false}
          hideTabBar
        />

        <Scene
          key="registerTermsConditions"
          component={RegisterTermsConditionsScreen}
          renderTitle={NavItems.title}
          title="Terms & conditions"
          renderBackButton={NavItems.backButton}
          {...platformBasedConfigs}
          hideNavBar={false}
          hideTabBar
        />

        <Scene
          key="login"
          component={LoginScreen}
          type={ActionConst.RESET}
          hideNavBar
          hideTabBar
        />

        <Scene
          key="loginContinue"
          component={LoginContinueScreen}
          renderBackButton={NavItems.backButton}
          renderTitle={NavItems.title}
          title="Log in"
          {...platformBasedConfigs}
          hideNavBar={false}
          hideTabBar
        />

        <Scene
          key="passwordResetNotice"
          component={PasswordResetNoticeScreen}
          renderBackButton={NavItems.backButton}
          renderTitle={NavItems.title}
          title="Update password"
          {...platformBasedConfigs}
          hideNavBar={false}
          hideTabBar
        />

        <Scene
          key="passwordResetScreen"
          component={PasswordResetScreen}
          renderBackButton={NavItems.backButton}
          renderTitle={NavItems.title}
          title="Update password"
          {...platformBasedConfigs}
          hideNavBar={false}
          hideTabBar
        />

        <Scene
          key="verifyEmailScreen"
          component={VerifyEmailScreen}
          renderTitle={NavItems.title}
          title="Email Verification"
          {...platformBasedConfigs}
          hideNavBar={false}
          gesturesEnabled={false}
          panHandlers={null}
          hideTabBar
        />

        <Scene
          key="forgotPassword"
          component={ForgotPasswordView}
          renderTitle={NavItems.logo}
          hideNavBar={false}
          renderBackButton={NavItems.backButton}
          {...platformBasedConfigs}
          hideTabBar
        />

        <Scene
          key="initSession"
          component={InitSessionController}
          type={ActionConst.RESET}
          renderTitle={NavItems.title}
          title=""
          hideNavBar={false}
          hideTabBar
        />

        <Scene
          key="enableTouchId"
          component={EnableTouchIdView}
          type={ActionConst.RESET}
          hideNavBar
          hideTabBar
        />

        <Scene
          key="enableNotificationsView"
          component={EnableNotificationsView}
          type={ActionConst.RESET}
          renderTitle={NavItems.title}
          title="Stay updated"
        />

        <Scene
          key="serverMaintenance"
          component={ServerMaintenance}
          renderTitle={NavItems.logo}
          {...platformBasedConfigs}
          hideTabBar
        />

        <Scene key="drawer" component={NavigationDrawer} open={false}>
          <Scene
            key="drawerChildrenWrapper"
            navBar={NavBar}
            navigationBarBackgroundImage={this.props.navBarImage}
            navigationBarStyle={styles.navBar}
          >
            <Scene
              key="offerings"
              component={OfferingsScreen}
              type={ActionConst.RESET}
              hideNavBar={false}
              renderTitle={NavItems.logo}
              renderLeftButton={NavItems.menuButton}
              renderRightButton={NavItems.commonRightButtons}
              duration={300}
              {...platformBasedConfigs}
              hideTabBar
            />
          </Scene>
        </Scene>
      </Scene>
        {/* <Scene key="modal" component={Modal}> */}
          {/* <Scene key="root" hideNavBar hideTabBar>
            <Scene key="drawer" component={NavigationDrawer} open={false}>
              <Scene
                key="drawerChildrenWrapper"
                navBar={NavBar}
                navigationBarBackgroundImage={this.props.navBarImage}
                navigationBarStyle={styles.navBar}
              >
                <Scene
                  key="offerings"
                  component={OfferingsScreen}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderLeftButton={NavItems.menuButton}
                  renderRightButton={NavItems.commonRightButtons}
                  duration={300}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="offeringDetails"
                  changeNavBarImage={navBarImage => {
                    this.props.changeNavBarImage(navBarImage);
                  }}
                  navigationBarBackgroundImage={this.props.navigationBackground}
                  changeStatusBarColor={statusBarColor => {
                    this.props.changeStatusBarColor(statusBarColor);
                  }}
                  component={OfferingDetailsScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.offeringDetails}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="prospectusScreen"
                  component={ProspectusScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />

                <Scene
                  key="offeringsSearch"
                  component={OfferingsSearchScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.search}
                  renderBackButton={NavItems.backButton}
                  hideTabBar
                />

                <Scene
                  key="orderDetails"
                  component={OrderDetailsScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Order details"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="orderCreate"
                  component={OrderCreateScreen}
                  changeNavBarImage={navBarImage => {
                    this.props.changeNavBarImage(navBarImage);
                  }}
                  navigationBarBackgroundImage={this.state.navigationBackground}
                  changeStatusBarColor={statusBarColor => {
                    this.props.changeStatusBarColor(statusBarColor);
                  }}
                  hideNavBar={false}
                  renderTitle={NavItems.titleWithSubtitle}
                  title="Place order"
                  renderBackButton={NavItems.closeButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="fakeOrderCreate"
                  component={FakeOrderCreateScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="orderAccepted"
                  component={OrderAcceptedScreen}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Order complete"
                  hideTabBar
                />
                <Scene
                  key="orderModifySuccessScreen"
                  component={OrderModificationSuccess}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Modify Successful"
                  hideTabBar
                />
                <Scene
                  key="orderModify"
                  component={OrderModifyScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="orderCancelConfirm"
                  component={OrderCancelConfirmScreen}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="orderCanceled"
                  component={OrderCanceledScreen}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderLeftButton={() => null}
                  hideTabBar
                />

                <Scene
                  key="account"
                  component={AccountView}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="My account"
                  renderLeftButton={NavItems.menuButton}
                  duration={300}
                  hideTabBar
                />
                <Scene
                  key="profileView"
                  {...this.props}
                  component={ProfileView}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="My account"
                  renderLeftButton={NavItems.menuButton}
                  duration={300}
                  hideTabBar
                />
                <Scene
                  key="brokerView"
                  component={BrokerView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Brokerage"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  panHandlers={null}
                  hideTabBar
                />
                <Scene
                  key="profileSocialView"
                  component={ProfileSocialView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Social media"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />

                <Scene
                  key="profileEditView"
                  component={ProfileEditView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Profile"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="profileChangePasswordView"
                  component={ProfileChangePasswordView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Password"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="profileNotificationsView"
                  component={ProfileNotificationsView}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />

                <Scene
                  key="brokerConnect"
                  component={BrokerConnectView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Connect a brokerage firm"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />

                <Scene
                  key="investorScore"
                  component={InvestorScoreView}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Investor score"
                  renderLeftButton={NavItems.menuButton}
                  hideTabBar
                />

                <Scene
                  key="education"
                  component={EducationScreen}
                  type={ActionConst.RESET}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  title="Education"
                  renderLeftButton={NavItems.menuButton}
                  duration={300}
                  hideTabBar
                />
                <Scene
                  key="termDetails"
                  component={TermDetailsScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="articleDetails"
                  component={ArticleScreen}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="oauth"
                  component={OauthView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="socialOauth"
                  component={OauthSocialView}
                  hideNavBar={false}
                  renderTitle={NavItems.title}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="finraView"
                  component={FinraView}
                  hideNavBar={false}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="helpScreen"
                  component={HelpWebView}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="contactScreen"
                  component={ContactUsWebView}
                  title="Help"
                  renderTitle={NavItems.title}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="finraView"
                  component={FinraView}
                  renderTitle={NavItems.logo}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="detailViewModal"
                  component={DetailViewModal}
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="newOfferingsView"
                  component={NewOfferingsView}
                  renderTitle={NavItems.title}
                  title="Today's new offerings"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="newOfferingView"
                  component={NewOfferingView}
                  renderTitle={NavItems.title}
                  title="New offering"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="offeringDetailsNotification"
                  component={OfferingDetailsNotification}
                  renderTitle={NavItems.title}
                  // type={ActionConst.REPLACE}
                  title="Offering"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="orderReconfirmation"
                  component={OrderReconfirmation}
                  // renderTitle={NavItems.logo}
                  title="Order Reconfimation"
                  renderBackButton={NavItems.backButton}
                  {...platformBasedConfigs}
                  hideTabBar
                />
                <Scene
                  key="serverMaintenance"
                  component={ServerMaintenance}
                  renderTitle={NavItems.logo}
                  {...platformBasedConfigs}
                  hideTabBar
                />
              </Scene>
            </Scene>
          </Scene> */}
          {/* <Scene key="share" component={SocialShareMessageView} />
          <Scene key="error" component={ErrorView} /> */}
        {/* </Scene> */}
      </RouterWithRedux>
    );
  };
}

const mapStateToProps = state => {
  return {
    startupComplete: state.startup.startupComplete
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startupWithDeeplink: data => dispatch(StartupActions.startupWithDeeplink(data)),
    logNotificationOpen: data => dispatch(UserActions.logNotificationOpen(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter);
