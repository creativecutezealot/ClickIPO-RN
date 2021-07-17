import React from 'react';
import { StyleSheet,  Dimensions, Linking, Platform, AppState } from "react-native";
import { Actions as NavigationActions } from 'react-native-router-flux';
import SafariView from 'react-native-safari-view';
import Config from 'react-native-config';
import { auth } from 'react-native-twitter';
import branch from "react-native-branch";

var {
  height: deviceHeight
} = Dimensions.get("window")

var styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
})

class OauthSocialView extends React.Component {
  constructor(props) {
    super(props);

    this.twitterProvider = {
      twitterTokens: {
        consumerKey: Config.TWITTER_CONSUMER_KEY,
        consumerSecret: Config.TWITTER_CONSUMER_SECRET,
        accessToken: '',
        accessTokenSecret: '',
      },
      callbackURL: `${Config.API_BASE_URL}/auth/twitter`,
    }
  }

  componentWillMount = () => {

    // if the social provider is twitter we are going to use the react-native-twitter library 
    // check provider name and then call the auth function of the react-native-twitter
    // provider.id is the name
    console.log('this.props.provider: ', this.props.provider)
    console.log('inside of the CWM, and props: ', this.props);

    if (provider.id === 'twitter') {
      // call the auth function here
      this.authenticateTwitter()
    } else if (Platform.OS === 'ios') {
      SafariView.show({
        url: this.props.authorizeUrl
      })
    } else if (Platform.OS === 'android') {
      Linking.openURL(this.props.authorizeUrl).catch(err => console.log('An error occured: ', err));
      // CustomTabs.openURL(this.props.authorizeUrl)
    }
    console.log('adding the event listener');
    Linking.addEventListener('url', this.onNavigationStateChange)
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidMount = () => {
    this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
      console.log('in the function of branch in CDM')
      console.log('error: ', error)
      console.log('params: ', params)
      if (error) {
        return;
      }

      if (params["+non_branch_link"]) {
        this.onNavigationStateChange({ url: params["+non_branch_link"] })
      }

      if (params["+clicked_branch_link"]) {

        return;
      }
    });
    console.log('at end of CDM');
  }

  componentWillUnmount = () => {
    console.log('in CWU removing the event listener');
    Linking.removeEventListener('url', this.onNavigationStateChange)
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch();
      this._unsubscribeFromBranch = null;
    }
  }

  authenticateTwitter = () => {
    console.log('this.twitterProvider.twitterTokens: ', this.twitterProvider.twitterTokens)
    console.log('this.twitterProvider.callbackURL: ', this.twitterProvider.callbackURL);
    auth(this.twitterProvider.twitterTokens, this.twitterProvider.callbackURL)
      .then(result => {
        // the result is captured via _checkDeepLink and onNavigationStateChange and is sent to the socialShareView component
      })
  }

  _handleAppStateChange = (currentAppState) => {
    console.log('in _handleAppStateChange: ', currentAppState);
    if (Platform.OS === 'android') {
      console.log('inside of the if of _handleAppStateChange')
      this._checkDeepLink();
    }
  }

  _checkDeepLink = () => {
    console.log('inside ofthe _checkDeepLink')
    Linking.getInitialURL().then(url => {
      // TODO: this is where I parse the url and get the access token and call the this.props.callback funtion
      console.log('url in the Linking get initial url: ', url);
      if (url.startsWith(this.props.callbackUrl)) {
        console.log('url startwith, ', this.props.callbackUrl);
        var callbackUrl = url
        this.props.callback(callbackUrl);
        NavigationActions.pop();
      }
    })
    .catch(error => {
      console.log('error in deeplink callback: ', error);
    })
  }


  onNavigationStateChange = (event) => {
    console.log('this.props.callbackUrl: ', this.props.callbackUrl)
    console.log('in the onNavStateChange: ', event)
    if (event.url.startsWith(this.props.callbackUrl)) {
      console.log('event.url startwith, ', this.props.callbackUrl);
      var callbackUrl = event.url
      this.props.callback(callbackUrl)
      if (Platform.OS === 'ios') {
        SafariView.dismiss()
        NavigationActions.pop();
      }
    }
  }


  render = () => {
    return (
      null
    )
  }
}

export default OauthSocialView;