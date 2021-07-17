import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Dimensions, Alert, Linking, AppState, Platform } from 'react-native';
import { connect } from 'react-redux';
import { ShareDialog } from 'react-native-fbsdk';
import twitter, { auth } from 'react-native-twitter';
import Config from 'react-native-config';
import { create } from 'apisauce';

import { Actions as NavigationActions } from 'react-native-router-flux';
import { Images, Colors, Fonts, Metrics } from '../Themes';
import FeatureSetConfig from '../Config/FeatureSetConfig'
import Styles from './Styles/SocialShareViewStyle'
import firebase from '../Config/FirebaseConfig';
import SocialActions from '../Redux/SocialRedux';
import ToastActions from '../Redux/ToastRedux';
import UserActions from '../Redux/UserRedux';

import Icon from 'react-native-vector-icons/Ionicons';

import Logger from '../Lib/Logger';

class SocialShareView extends React.Component {
  startShare: null;

  constructor(props) {
    // Logger.log({ name: 'SocialShareView.constructor()', props: props })

    super(props)

    this.state = {
      shareable: props.shareable,
      providers: props.providers,
      facebookLinked: false,
      twitterLinked: false,
      stockTwitsLinked: false,
      linkedInLinked: false,
      twitterObj: {},
      stockTwitObj: {},
      linkedInObj: {}
    }
    this.linkedInProvider = {
      name: 'LinkedIn',
      icon: Images.linkedInShare,
      color: '#0077B5'
    }

    this.twitterProvider = {
      twitterTokens: {
        consumerKey: Config.TWITTER_CONSUMER_KEY,
        consumerSecret: Config.TWITTER_CONSUMER_SECRET,
        accessToken: '',
        accessTokenSecret: '',
      },
      callbackURL: 'clickipo://deeplinks/oauth/twitter',
      name: 'Twitter',
      id: 'twitter',
      color: '#00aced',
      icon: Images.twitterIcon,
    }
    this.startShare = props.startShare;
    this.verifierDeferreds = new Map()
  }

  componentWillReceiveProps = newProps => {

    this.setState({
      providers: newProps.providers
    });

    if (newProps.user) {
      newProps.user.socialIdentities.forEach(socialProvider => {
        if (socialProvider.provider === 'facebook') {
          this.setState({ facebookLinked: true });
        } else if (socialProvider.provider === 'twitter') {
          //we are also setting the socialProvider.provider to the twitter obj here becauase we are going to 
          //later use that obj to get the tokens. ( will only have to iterate over the socialIdentities once)
          this.setState({ twitterLinked: true, twitterObj: socialProvider });
        } else if (socialProvider.provider === "stocktwits") {
          //check if stocktwits is linked and then grab the credentials ie the access_token from db
          this.setState({ stockTwitsLinked: true, stockTwitObj: socialProvider });
        } else if (socialProvider.provider) {
          this.setState({ linkedInLinked: true, linkedInObj: socialProvider });
        } else {
          this.setState({
            facebookLinked: false,
            twitterLinked: false,
            stocktwitsLinked: false
          });
        }
      });
    }
  };

  componentDidMount() {
    if (this.props.user) {
      this.props.user.socialIdentities.forEach(socialProvider => {
        if (socialProvider.provider === 'facebook') {
          this.setState({ facebookLinked: true });
        } else if (socialProvider.provider === 'twitter') {
          //we are also setting the socialProvider.provider to the twitter obj here becauase we are going to 
          //later use that obj to get the tokens. ( will only have to iterate over the socialIdentities once)
          this.setState({ twitterLinked: true, twitterObj: socialProvider });
        } else if (socialProvider.provider === "stocktwits") {
          //check if stocktwits is linked and then grab the credentials ie the access_token from db
          this.setState({ stockTwitsLinked: true, stockTwitObj: socialProvider });
        } else if (socialProvider.provider) {
          this.setState({ linkedInLinked: true, linkedInObj: socialProvider });
        } else {
          this.setState({
            facebookLinked: false,
            twitterLinked: false,
            stocktwitsLinked: false
          });
        }
      });
    }

    //not sure what this is == might be related to an old code
    if (this.startShare === 'st') {
      this.handlePressShare(this.state.providers.stocktwits)
    } else if (this.startShare === 'fb') {
      this.handlePressShare(this.state.providers.facebook)
    } else if (this.startShare === 'tw') {
      this.handlePressShare(this.state.providers.twitter)
    }
  }

  // componentWillUnmount() {
  //   AppState.addEventListener('change', this._handleAppStateChange);
  // }

  // _handleAppStateChange = (currentAppState) => {
  //   console.log('the current app state is: ', currentAppState);
  //   if (Platform.OS === 'android') {
  //     this._checkDeeplink();
  //   }
  // }

  // _checkDeeplink = () => {
  //   Linking.getInitialURL()
  //     .then(url => {
  //       //the url contains the accessToken
  //       // split and recover the accessToken from the url
  //       console.log('the initial url is: ', url);
  //     })
  //     .catch(error => {
  //       console.log('error in getting the initial url: ', error);
  //     })
  // }

  //the message to display and the callback function if token is NOT valid
  handleError = (message, isTokenValid, callback) => {
    Alert.alert(
      'ClickIPO',
      message,
      [
        { text: isTokenValid ? 'OK' : 'Cancel' },
        isTokenValid ? null : { text: 'Link', onPress: () => callback() },
      ],
      { cancelable: true }
    )
  }

  handleErrorCallback = () => {
    NavigationActions.profileSocialView();
  }

  handleSuccessResponse = (message) => {
    Alert.alert(
      'ClickIPO',
      message,
      [
        { text: 'OK' }
      ],
      { cancelable: true }
    );
  }

  handlePressShare = provider => {
    if (this.state.providers.stocktwits === provider) {
      firebase
        .analytics()
        .setCurrentScreen(
          'offerings_' +
          this.state.shareable.tickerSymbol +
          '_actions_share_stocktwits'
        )
    } else if (this.state.providers.facebook === provider) {
      firebase
        .analytics()
        .setCurrentScreen(
          'offerings_' +
          this.state.shareable.tickerSymbol +
          '_actions_share_facebook'
        )
    } else if (this.state.providers.twitter === provider) {
      firebase
        .analytics()
        .setCurrentScreen(
          'offerings_' +
          this.state.shareable.tickerSymbol +
          '_actions_share_twitter'
        )
    }

    this.props.share(provider, this.props.shareable)
  };


  //https://go.clickipo.com/offerings/?offer_id=[offering_id]
  //&utm_source=Facebook&utm_campaign=Facebook_ss_app&utm_term=[SYMBOL]&ct=Facebook_ss_app
  //&og_redirect=https%3A%2F%2Fclickipo.com%2Fofferings%2F%3Foffer_id%[offer_id]

  handlePressShareFacebook = () => {
    const { shareable } = this.state;

    // if (this.state.facebookLinked) {
      const shareLinkContent = {
        contentType: 'link',
        contentUrl: 'https://go.clickipo.com/offerings/?offer_id=' + shareable.id + '&utm_source=Facebook&utm_campaign=Facebook_ss_app&utm_term=' + shareable.tickerSymbol + '//&og_redirect=https%3A%2F%2Fclickipo.com%2Fofferings%2F%3Foffer_id%' + shareable.id,
        contentDescription: 'The IPO Marketplace For You',
      }

      return ShareDialog.canShow(shareLinkContent)
        .then(canShow => {
          if (canShow) {
            return ShareDialog.show(shareLinkContent);
          }
        })
        .then(result => {
          if (result.isCancelled) {
            this.handleError('Share was cancelled')
          } else {
            this.handleSuccessResponse('Share was successful');
          }
        })
        .catch(error => {
          this.handleError('Share was not successful, please try again')
        })
    // } else {
    //   this.handleError('Please link your Facebook account first', false, this.handleErrorCallback);
    // }
  }

  /* Twitter */

  handlePressShareTwitter = provider => {
    const { shareable } = this.props;
    console.log('this.state.twitterLinked: ', this.state.twitterLinked)
    if (this.state.twitterLinked) {
      NavigationActions.share({ provider, shareable, handleShare: this.handleShareTwitter })
    } else {
      this.handleAuthTwitter();
    }
  }

  handleAuthTwitter = () => {
    // twitter provider object will be different than the linkedIn and Stocktwits because the react-native-twitter library expects certain objects
    provider = {
      name: 'Twitter',
      id: 'twitter',
      backendCallback: 'clickipo://deeplinks/twitter/',
      callback: this.twitterOauth,
    }

    this.props.linkSocialMedia(provider);

    // console.warn('handleAuth is getting called: ', this.twitterProvider.twitterTokens, this.twitterProvider.callbackURL);
    // auth(this.twitterProvider.twitterTokens, this.twitterProvider.callbackURL)
    //   .then(result => {
    //     console.warn('this is the result of twitter auth: ', result);
    //     //data that we are going to send to the backend 
    //     const data = {
    //       provider: 'twitter',
    //       uid: result.id,
    //       token: result.accessToken,
    //       secret: result.accessTokenSecret,
    //       expiration_time: '',
    //       last_refresh_time: ''
    //     }
    //     console.log('===============')
    //     console.log('data: ', data);
    //     console.log('===============')
    //     // this.props.sendLinkedProvider(data);

    //     const successMessage = { message: 'Connection succesful, you can now share on Twitter', icon: 'good'}
    //     this.props.toastMessage(successMessage);

    //     //TODO fix this async issue here -- because the token is not updated yet the user gets redirected back to the twitter login page
    //     //I can call the handlePressShareTwitter then show the share modal to the user
    //     // this.handlePressShareTwitter(this.state.providers.twitter);

    //   })
    //   .catch(err => {
    //     console.warn('error in handleAuth of twitter: ', err)
    //     const errorMessage = { message: 'Connection not successful, please try again!', icon: 'bad' }
    //     this.props.toastMessage(errorMessage);
    //   })

    // provider = {
    //   name: 'Twitter',
    //   id: 'twitter',
    //   callbackurl: `clickipo://deeplinks/twitter`
    // }

    // this.props.linkSocialMedia(provider);
  }

  // TODO: this is the same as linkedInOauth CODE_CLEANUP -- this has a minor difference handle accordingly
  twitterOauth = (response) => {
    console.log('response in stockTwitsOauth: ', response)
    if (response.includes('success')) {
      //split by / <-- super useful comment
      const splitResponse = response.split('/');
      //get the last index which is uid=<id>&access_token=<access_token> and split by &
      const uidAndAccessTokenArray = splitResponse[splitResponse.length - 1].split('&');
      //take the 0th index which is uid=<id> and get <id>
      const uid = uidAndAccessTokenArray[0].split('=')[1];
      //take the first index which is access_token=<access_token> and get <access_token>
      const accessToken = uidAndAccessTokenArray[1].split('=')[1];

      // take the second index which is access_token_secret=<access_token_secret> and get the secret
      const accessTokenSecret = uidAndAccessTokenArray[2].split('=')[1];

      //construct the data object sending to the backend
      const data = {
        provider: 'twitter',
        uid: uid,
        token: accessToken,
        secret: accessTokenSecret,
        expiration_time: '',
        last_refresh_time: ''
      }

      this.props.sendLinkedProvider(data);
      const successMessage = { message: 'Connection successful, you can now share on Twitter', icon: 'good' }
      this.props.toastMessage(successMessage);
    } else {
      const errorMessage = { message: 'Unable to link your Twitter account, please try again later!', icon: 'bad' }
      this.props.toastMessage(errorMessage);
    }
  }

  //this method is passed to the share modal and is called there to share the content
  handleShareTwitter = (shareMessage) => {
    const { shareable } = this.state;

    const twitterToken = {
      consumerKey: Config.TWITTER_CONSUMER_KEY,
      consumerSecret: Config.TWITTER_CONSUMER_SECRET,
      accessToken: this.state.twitterObj.token,
      accessTokenSecret: this.state.twitterObj.secret,
    }

    //construct the tweet object here -- this is what gets posted to the users account on twitter
    const tweet = {
      status: shareMessage + '\nhttps://go.clickipo.com/offerings/?offer_id=' + shareable.id + '&utm_source=Facebook&utm_campaign=Facebook_ss_app&utm_term=' + shareable.tickerSymbol + '//&og_redirect=https%3A%2F%2Fclickipo.com%2Fofferings%2F%3Foffer_id%' + shareable.id,
    }

    //create the twitter client here to make the call
    client = twitter(twitterToken);

    client.rest.post('statuses/update', tweet)
      .then(response => {
        this.handleSuccessResponse('Share was successful');
      })
      .catch(err => {
        this.handleAuthTwitter();
      })
  }

  /* StockTwits */

  handlePressShareStockTwits = provider => {
    const { shareable } = this.props;
    if (this.state.stockTwitsLinked) {
      NavigationActions.share({ provider, shareable, handleShare: this.handleShareStockTwits });
    } else {
      this.handleAuthStocktwits();
    }
  }

  handleAuthStocktwits = () => {
    const redirectUri = `${Config.API_BASE_URL}/auth/stocktwits`;

    provider = {
      name: 'StockTwits',
      id: 'stocktwits',
      authorizeUrl: `https://api.stocktwits.com/api/2/oauth/authorize?client_id=${Config.STOCKTWITS_CONSUMER_KEY}&response_type=code&redirect_uri=${redirectUri}&scope=read,publish_messages`,
      backendCallback: 'clickipo://deeplinks/stocktwits/',
      callback: this.stockTwitsOauth,
    }

    this.props.linkSocialMedia(provider);
  }

  // TODO: this is the same as linkedInOauth CODE_CLEANUP
  stockTwitsOauth = (response) => {
    if (response.includes('success')) {
      //split by / <-- super useful comment
      const splitResponse = response.split('/');
      //get the last index which is uid=<id>&access_token=<access_token> and split by &
      const uidAndAccessTokenArray = splitResponse[splitResponse.length - 1].split('&');
      //take the 0th index which is uid=<id> and get <id>
      const uid = uidAndAccessTokenArray[0].split('=')[1];
      //take the first index which is access_token=<access_token> and get <access_token>
      const accessToken = uidAndAccessTokenArray[1].split('=')[1];

      //construct the data object sending to the backend
      const data = {
        provider: 'stocktwits',
        uid: uid,
        token: accessToken,
        secret: '',
        expiration_time: '',
        last_refresh_time: ''
      }

      this.props.sendLinkedProvider(data);
      const successMessage = { message: 'Connection successful, you can now share on StockTwits', icon: 'good' }
      this.props.toastMessage(successMessage);
    } else {
      const errorMessage = { message: 'Unable to link your StockTwits account, please try again later!', icon: 'bad' }
      this.props.toastMessage(errorMessage);
    }
  }

  handleShareStockTwits = (shareMessage) => {
    const { shareable } = this.props;

    const api = create({
      baseURL: 'https://api.stocktwits.com/api/2',
    });

    const message = shareMessage + '\nhttps://go.clickipo.com/offerings/?offer_id=' + shareable.id + '&utm_source=StockTwits&utm_campaign=StockTwits_ss_app&utm_term=' + shareable.tickerSymbol + '&ct=StockTwits_ss_app&og_redirect=https%3A%2F%2Fclickipo.com%2Fofferings%2F%3Foffer_id%' + shareable.id;

    data = {
      body: message,
      chart: shareable.offeringTypeName === 'IPO' ? 'https://clickipo.com/wp-content/uploads/social-share-ipo-offering.png' : 'https://clickipo.com/wp-content/uploads/social-share-secondary-offering.png'
    }

    //code below posts to stocktwits 
    api.post(`/messages/create.json?access_token=${this.state.stockTwitObj.token}`, data)
      .then(response => {
        this.handleSuccessResponse('Share was successful');
      })
      .catch(error => {
        this.handleAuthStocktwits();
      })
  }

  /* LinkedIn */

  handlePressShareLinkedIn = provider => {
    const { shareable } = this.props;

    if (this.state.linkedInLinked) {
      NavigationActions.share({ provider, shareable, handleShare: this.handleShareLinkedIn });
    } else {
      this.handleAuthLinkedIn();
    }
  }

  handleAuthLinkedIn = async () => {
    const redirectUri = `${Config.API_BASE_URL}/auth/linkedin`;
    provider = {
      name: 'LinkedIn',
      id: 'linkedin',
      authorizeUrl: `https://www.linkedin.com/oauth/v2/authorization?client_id=${Config.LINKEDIN_CONSUMER_KEY}&response_type=code&redirect_uri=${redirectUri}&scope=r_emailaddress%20w_share%20r_basicprofile%20r_liteprofile%20w_member_social`,
      backendCallback: 'clickipo://deeplinks/linkedin/',
      callback: this.linkedInOauth,
    }

    // Linking.openURL(authorizeUrl).catch(err => console.error('An error occurred', err));

    // if (url.includes('success')) {
    //   const splitResponse = url.split('/');
    //   //get the last index which is uid=<id>&access_token=<access_token> and split by &
    //   const uidAndAccessTokenArray = splitResponse[splitResponse.length - 1].split('&');
    //   //take the 0th index which is uid=<id> and get <id>
    //   const uid = uidAndAccessTokenArray[0].split('=')[1];
    //   //take the first index which is access_token=<access_token> and get <access_token>
    //   const accessToken = uidAndAccessTokenArray[1].split('=')[1];

    //   const data = {
    //     provider: 'linkedin',
    //     uid: uid,
    //     token: accessToken,
    //     secret: '',
    //     expiration_time: '',
    //     last_refresh_time: ''
    //   }

    //   this.props.sendLinkedProvider(data);
    // }

    console.log('calling the linkSocialMedia: ', provider)
    this.props.linkSocialMedia(provider);


    // let callbackUrl = `${Config.API_BASE_URL}/linkedin`;

    // const oauthConfig = {
    //   authorizeUrl: `https://www.linkedin.com/oauth/v2/authorization?client_id=${Config.LINKEDIN_CONSUMER_KEY}&response_type=code&redirect_uri=${callbackUrl}&scope=r_emailaddress%20w_share%20r_basicprofile%20r_liteprofile%20w_member_social&token=${this.props.token}`,
    //   callbackUrl: 'clickipo://deeplinks/linkedin',
    //   callback: this.linkedInOauth,
    // }

    // console.warn('oauthConfig of LinkedIn: ', oauthConfig);

    // window.setTimeout(() => { NavigationActions.oauth(oauthConfig) }, 300);
    // return await(
    //   new Promise((resolve, reject) => {
    //     this.verifierDeferreds.set('requestToken', { resolve, reject })
    //   })
    // )
  }

  // TODO: this is the same as stockTwitsOauth CODE_CLEANUP
  linkedInOauth = (response) => {
    if (response.includes('success')) {
      //split by / <-- super useful comment
      const splitResponse = response.split('/');
      //get the last index which is uid=<id>&access_token=<access_token> and split by &
      const uidAndAccessTokenArray = splitResponse[splitResponse.length - 1].split('&');
      //take the 0th index which is uid=<id> and get <id>
      const uid = uidAndAccessTokenArray[0].split('=')[1];
      //take the first index which is access_token=<access_token> and get <access_token>
      const accessToken = uidAndAccessTokenArray[1].split('=')[1];

      //construct the data object sending to the backend
      const data = {
        provider: 'linkedin',
        uid: uid,
        token: accessToken,
        secret: '',
        expiration_time: '',
        last_refresh_time: ''
      }

      this.props.sendLinkedProvider(data);
      const successMessage = { message: 'Connection successful, you can now share on LinkedIn', icon: 'good' }
      this.props.toastMessage(successMessage);
    } else {
      const errorMessage = { message: 'Unable to link your LinkedIn account, please try again later!', icon: 'bad' }
      this.props.toastMessage(errorMessage);
    }
  }

  handleShareLinkedIn = shareMessage => {
    const { shareable } = this.props;
    const api = create({
      baseURL: 'https://api.linkedin.com/v2',
      headers: { 'Authorization': `Bearer ${this.state.linkedInObj.token}`, }
    });
    // TODO:// give the user the ability to choose between public or connection

    const message = shareMessage + '\nhttps://go.clickipo.com/offerings/?offer_id=' + shareable.id + '&utm_source=StockTwits&utm_campaign=StockTwits_ss_app&utm_term=' + shareable.tickerSymbol + '&ct=StockTwits_ss_app&og_redirect=https%3A%2F%2Fclickipo.com%2Fofferings%2F%3Foffer_id%' + shareable.id;

    //below is the format that linkedin has asked for in the post api
    const data = {
      author: `urn:li:person:${this.state.linkedInObj.uid}`,
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": message
          },
          "shareMediaCategory": "NONE"
        }
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS"
      }
    }

    api.post('/ugcPosts', data)
      .then(response => {
        console.log('response from the linkedIn post: ', response)
        this.handleSuccessResponse('Share was successful');
      })
      .catch(error => {
        console.log('error in linkedIn post: ', error)
        this.handleAuthLinkedIn();
      })
  }




  render = () => {
    if (FeatureSetConfig.social.sharingEnabled) {
      return (
        <View
          style={Styles.Component}
        >
          <TouchableOpacity
            style={Styles.TouchableStyle}
            onPress={() => this.handlePressShareFacebook()}
          >
            <Image
              resizeMode='contain'
              style={Styles.Image}
              source={Images.facebookIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={Styles.TouchableStyle1}
            onPress={() => this.handlePressShareTwitter(this.state.providers.twitter)}
          >
            <Image
              resizeMode='contain'
              style={Styles.Image}
              source={Images.twitterIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.TouchableStyle2, { backgroundColor: '#405775', marginRight: 30, }]}
            onPress={() => this.handlePressShareStockTwits(this.state.providers.stocktwits)}
          >
            <Image
              resizeMode='contain'
              style={Styles.Image}
              source={Images.stockTwitsIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[Styles.TouchableStyle2, { backgroundColor: '#0077B5'}]}
            onPress={() => this.handlePressShareLinkedIn(this.linkedInProvider)}
          >
            <Image
              resizeMode='contain'
              style={Styles.Image}
              source={Images.linkedInShare}
            />
          </TouchableOpacity>

        </View>

      )
    }
  };
}

const mapStateToProps = state => {
  return {
    providers: state.social.providers,
    user: state.user.user,
    token: state.user.token.token,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(UserActions.fetchUser()),
    share: (provider, shareable) => dispatch(SocialActions.share(provider, shareable)),
    sendLinkedProvider: (data) => dispatch(SocialActions.sendLinkedProvider(data)),
    linkSocialMedia: (data) => dispatch(SocialActions.linkSocialMedia(data)),
    toastMessage: (data) => dispatch(ToastActions.toastMessage(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialShareView)