import React from 'react'
import PropTypes from 'prop-types';
import { ScrollView, View, Text, TouchableHighlight, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { LoginManager, AccessToken, ShareDialog } from 'react-native-fbsdk';
import { auth } from 'react-native-twitter';
import Config from 'react-native-config';

import SocialActions from '../Redux/SocialRedux';
import styles from './Styles/ProfileSocialViewStyle';
import { Colors, ApplicationStyles, Images } from '../Themes';
import firebase from '../Config/FirebaseConfig';
import ToastActions from '../Redux/ToastRedux';


class ProfileSocialView extends React.Component {

  constructor(props) {
    super(props);

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://clickipo.com/',
      contentDescription: 'ClickIPO website'
    }

    this.twitterTokens = {
      consumerKey: Config.TWITTER_CONSUMER_KEY,
      consumerSecret: Config.TWITTER_CONSUMER_SECRET,
    }

    this.twitterCallbackUrl = 'clickipo://deeplinks/oauth/twitter'

    this.state = {
      shareLinkContent: shareLinkContent,
      facebookLinked: false,
      twitterLinked: false,
      stocktwitsLinked: false,
      linkedInLinked: false,
    }
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('account_social');

    console.log('this.props.socialIdentities in  profileSocialView: ', this.props.socialIdentities)
    //this.props.socialIdentities is an array. 
    //loop through and if socialIdentity.facebook is true, then set the state of facebook is true. else set it false -- this applies for other social providers as well
    this.props.socialIdentities.forEach(socialProvider => {
      if (socialProvider.provider === 'facebook') {
        this.setState({ facebookLinked: true });
      } else if (socialProvider.provider === 'twitter') {
        this.setState({ twitterLinked: true });
      } else if (socialProvider.provider === 'stocktwits') {
        this.setState({ stocktwitsLinked: true });
      } else if (socialProvider.provider === 'linkedin') {
        this.setState({ linkedInLinked: true });
      } else {
          this.setState({
            facebookLinked: false,
            twitterLinked: false,
            stocktwitsLinked: false
          });
      }
    })
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
          this.setState({ stocktwitsLinked: true, stockTwitObj: socialProvider });
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


  //the message to display and the callback function if token is NOT valid
  handleError = (message) => {
    Alert.alert(
      'ClickIPO',
      message,
      [
        { text: 'OK' }
      ]
    );
  }

  handlePressProvider = () => {
    let that = this;
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
      function (result) {
        if (result.isCancelled) {
          this.handleError('Login was cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(
            function (accessToken) {
              //this is the data that we are sending to the user identities api to the backend
              const data = {
                provider: 'facebook',
                uid: accessToken.userID,
                token: accessToken.accessToken,
                secret: '',
                expiration_time: accessToken.expirationTime,
                last_refresh_time: accessToken.lastRefreshTime,
              }
              this.setState({ facebookLinked: true });
              that.props.sendLinkedProvider(data);
            },
            function (err) {
              this.handleError('Something went wrong, please try again');
            }
          )
        }
      },
      function (err) {
        this.handleError('Something went wrong, please try again');
      }
    )
  }

  /* Twitter */

  handlePressTwitter = () => {
    provider = {
      name: 'Twitter',
      id: 'twitter',
      backendCallback: 'clickipo://deeplinks/twitter/',
      callback: this.twitterOauth,
    }

    this.props.linkSocialMedia(provider);
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

  /* Ali: unused code Feb 27 2019
  stockTwitsOauth = (status) => {
    if (status === 'success') {
      //if the status is succuessful set the state of stocktwitsLinked to true
      this.setState({ stocktwitsLinked: true });
    } else {
      this.handleError('Something went wrong, please try again');
    }
  }
  */

  /* LinkedIn */
  handlePressLinkedIn = () => {
    const redirectUri = `${Config.API_BASE_URL}/auth/linkedin`;
    provider = {
      name: 'LinkedIn',
      id: 'linkedin',
      authorizeUrl: `https://www.linkedin.com/oauth/v2/authorization?client_id=${Config.LINKEDIN_CONSUMER_KEY}&response_type=code&redirect_uri=${redirectUri}&scope=r_emailaddress%20w_share%20r_basicprofile%20r_liteprofile%20w_member_social`,
      backendCallback: 'clickipo://deeplinks/linkedin/',
      callback: this.linkedInOauth,
    }

    this.props.linkSocialMedia(provider);
  }

  // TODO: this is the same as stockTwitsOauth CODE_CLEANUP
  linkedInOauth = (response, status) => {
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

  handlePressStockTwits = () => {
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

  render() {

    const FBProvider = {
      id: 'facebook',
      name: 'Facebook',
      icon: Images.facebookIcon,
      color: '#3B5998'
    }

    const TwitterProvider = {
      id: 'twitter',
      name: 'Twitter',
      icon: Images.twitterIcon,
      color: '#00aced'
    }

    const StockTwitsProvider = {
      id: 'stocktwits',
      name: 'StockTwits',
      icon: Images.stockTwitsIcon,
      color: '#405775'
    }

    const LinkedInProvider = {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Images.linkedInShare,
      color: '#0077B5'
    }

    return (
      <ScrollView style={ApplicationStyles.container}>
        <View style={styles.Component}>
          <Text style={ApplicationStyles.headline}>Accounts</Text>
        </View>
        <View style={[ApplicationStyles.border]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={() => this.handlePressProvider()}>
            <View style={ApplicationStyles.highlightInner}>
              <View style={ApplicationStyles.leftContainer}>
                <View style={{ backgroundColor: FBProvider.color, padding: 10, borderRadius: 50 }}>
                  <Image resizeMode='contain' style={styles.Image} source={FBProvider.icon} />
                </View>
              </View>
                <View style={ApplicationStyles.textContainer}>
                  <Text style={ApplicationStyles.text}>{this.state.facebookLinked ? `${FBProvider.name} Linked` : `Link ${FBProvider.name} Account`}</Text>
                </View>
              <View style={ApplicationStyles.rightContainer}>
                {
                  // TODO: delete button ???
                }
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View style={[ApplicationStyles.border]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={() => this.handlePressTwitter(this.props.providers.twitter)}>
            <View style={ApplicationStyles.highlightInner}>
              <View style={ApplicationStyles.leftContainer}>
                <View style={{ backgroundColor: TwitterProvider.color, padding: 10, borderRadius: 50 }}>
                  <Image resizeMode='contain' style={styles.Image} source={TwitterProvider.icon} />
                </View>
              </View>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>{this.state.twitterLinked ? `${TwitterProvider.name} Linked` : `Link ${TwitterProvider.name} Account`}</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                {
                  // TODO: delete button ???
                }
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View style={[ApplicationStyles.border]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={() => this.handlePressStockTwits()}>
            <View style={ApplicationStyles.highlightInner}>
              <View style={ApplicationStyles.leftContainer}>
                <View style={{ backgroundColor: StockTwitsProvider.color, padding: 10, borderRadius: 50 }}>
                  <Image resizeMode='contain' style={styles.Image} source={StockTwitsProvider.icon} />
                </View>
              </View>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>{this.state.stocktwitsLinked ? `${StockTwitsProvider.name} Linked` : `Link ${StockTwitsProvider.name} Account`}</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                {
                  // TODO: delete button ???
                }
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View style={[ApplicationStyles.border]}>
          <TouchableHighlight underlayColor={Colors.pinkishGrey} style={ApplicationStyles.tabContainer} onPress={() => this.handlePressLinkedIn()}>
            <View style={ApplicationStyles.highlightInner}>
              <View style={ApplicationStyles.leftContainer}>
                <View style={{ backgroundColor: LinkedInProvider.color, padding: 10, borderRadius: 50 }}>
                  <Image resizeMode='contain' style={styles.Image} source={LinkedInProvider.icon} />
                </View>
              </View>
              <View style={ApplicationStyles.textContainer}>
                <Text style={ApplicationStyles.text}>{this.state.linkedInLinked ? `${LinkedInProvider.name} Linked` : `Link ${LinkedInProvider.name} Account`}</Text>
              </View>
              <View style={ApplicationStyles.rightContainer}>
                {
                  // TODO: delete button ???
                }
              </View>
            </View>
          </TouchableHighlight>
        </View>

      </ScrollView>
    );
  }
}

ProfileSocialView.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    providers: state.social.providers,
    sendResponse: state.social.sendResponse,
    user: state.user.user,
    token: state.user.token.token,
    socialIdentitiesLocal: state.settings.socialIdentitiesLocal,
    socialIdentities: state.user.user.socialIdentities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    linkProvider: (provider) => dispatch(SocialActions.linkProvider(provider)),
    unlinkProvider: (provider) => dispatch(SocialActions.unlinkProvider(provider)),
    sendLinkedProvider: (data) => dispatch(SocialActions.sendLinkedProvider(data)),
    linkSocialMedia: (data) => dispatch(SocialActions.linkSocialMedia(data)),
    toastMessage: (data) => dispatch(ToastActions.toastMessage(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSocialView);