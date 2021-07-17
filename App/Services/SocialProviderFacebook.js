import SocialProvider from './SocialProvider'
import Config from 'react-native-config';

import {LoginManager, LoginButton, AccessToken, ShareDialog, ShareApi, AppEventsLogger} from 'react-native-fbsdk'

import {
  Images
} from '../Themes'

import { SocialIdentity } from '../Models';
import Logger from '../Lib/Logger'

class SocialProviderFacebook extends SocialProvider {
  constructor(...args) {
    super(...args)

    this.id = 'facebook'
    this.name = 'Facebook'
    this.icon = Images.facebookIcon
    this.color = '#3B5998'
  }

  oauth = async () => {
    console.log('in oauth')
    let that = this;
     return LoginManager.logInWithReadPermissions(["public_profile"]).then(
      function (result) {
        console.log('result from facebook auth: ', result);
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          return AccessToken.getCurrentAccessToken().then(
            function (accessToken) {

              //data is returned here gets passed to the user_identities api

              const data = {
                provider: 'facebook',
                uid: accessToken.userID,
                token: accessToken.accessToken,
                secret: Config.FACEBOOK_APP_SECRET,
                expiration_time: accessToken.expirationTime,
                last_refresh_time: accessToken.lastRefreshTime
              }

              return data;
            }
          )
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );


    // return LoginManager.logInWithPublishPermissions(['publish_actions']).then((result) => {
    //   // Logger.log({ name: 'SocialProviderFacebook.oauth()', result: result })
    //   console.log('result is logInWithPublishPermissions: ', result)
    //   if (result.isCancelled) {
    //     // Logger.log({ name: 'SocialProviderFacebook.oauth()', result: 'Login cancelled' })

    //     return null
    //   } else {
    //     return AccessToken.getCurrentAccessToken().then((accessToken) => {
    //       // Logger.log({ name: 'SocialProviderFacebook.oauth()', accessToken: accessToken })

    //       // TODO: const identity = new SocialIdentity()

    //       console.log('accessToken: ', accessToken);
    //       console.log('this is: ', this);
    //       const identity = {
    //           provider: this.id,
    //           token: accessToken.accessToken,
    //       }

    //       return identity
    //     })
    //   }
    // },
    // (error) => {
    //   // Logger.log({ name: 'SocialProviderFacebook.oauth()', error: error })

    //   // TODO: throw error
    //   return null
    // })
  }

  auth = () => {
    // Logger.log({ name: 'SocialProviderFacebook.auth()' })


  }

  share = (share) => {

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://clickipo.com/offerings/?offer_id=' + share.shareable.id + '&utm_source=Facebook&utm_campaign=Facebook_ss_app&utm_term=%24' + share.shareable.tickerSymbol + '&ct=Facebook_ss_app', // TODO: check shareable type once implimented
      contentDescription: 'The IPO Marketplace For You',
    }


    return ShareDialog.canShow(shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      }
    ).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Share Was Cancelled')
        } else {
          console.log('Share success with postId: ', result);
        }
      }, 
      function (err) {
        console.log('share fail with error: ', err);
      }
    )
    // return ShareApi.canShare(shareLinkContent).then((canShare) => {
    //   if (canShare) {
    //     return ShareApi.share(shareLinkContent, '/me', share.message)
    //   } else {
    //     // TODO: throw error
    //   }
    // }).then((result) => {
    //   // Logger.log({ name: 'SocialProviderFacebook.share()', result: result })
    //   console.log('result in facebook: ', result)
    //   return result
    // },
    // (error) => {
    //   console.log('error in facebook sharing inside of the fb provider: ', error)
    //   // TODO: throw error
    //   return null
    // })
  }

}

export default SocialProviderFacebook
