import { Actions as NavigationActions } from 'react-native-router-flux';

export default class SocialMediaConnectionService {
  constructor(provider, oauthConfig) {
    console.log('oauthConfig: ', oauthConfig)
    this.provider = provider;
    this.oauthConfig = oauthConfig;
    this.verifierDeferreds = new Map();
  }

  oauth = async () => {
    const oauthViewProps = {
      authorizeUrl: this.oauthConfig.authorizeUrl,
      callbackUrl: this.oauthConfig.callbackUrl,
      callback: this.oauthConfig.callback,
      provider: this.provider,
    }

    NavigationActions.socialOauth(oauthViewProps);

    return await (
      new Promise((resolve, reject) => {
        this.verifierDeferreds.set(this.oauthConfig.requestId, {resolve, reject});
      })
    );
  }
}