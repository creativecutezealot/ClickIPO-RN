
import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  WebView,
  Linking,
  Alert,
  // TouchableHighlight,
  // Image,
  // TouchableOpacity
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  // KeyboardAvoidingView
} from 'react-native'

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes'

// I18n
// import I18n from 'react-native-i18n'
import styles from './Styles/ArticleWebViewStyle'

import Logger from '../Lib/Logger'

class ArticleWebView extends React.Component {
  state: {
    alertPresent : Boolean
  }

  constructor (props) {
    super(props)

    this.state = {
      alertPresent : false
    }
  }

  componentWillMount () {
    // Logger.log({ name: 'TermDetailsScreen.handlePressSave()', term: term })
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
    })
  }

  handleOK = (event) => {
    Linking.openURL(event.url)
    this.setState({
      alertPresent : false
    })
  }

  handleCancel = () => {
    this.setState({
      alertPresent : false
    })
  }

  onNavigationStateChange = (event) => {
/*    if (event.url !== this.props.url) {
        this.webview.stopLoading();
        if(this.state.alertPresent !== true) {
          Alert.alert(
            'Navigating away from ClickIPO',
            'This link must be opened in a browser. Would you like to proceed?',
            [ {text: 'OK', onPress: () => this.handleOK(event)},
              {text: 'Cancel', onPress: () => this.handleCancel(), style: 'cancel'}
            ],
            { cancelable: false }
          )
        }
        this.setState({
          alertPresent : true
        })
      } */
  }

  render() {
    if(this.props.url === null) {
      return (  <View style={styles.ViewStyle1}>
                  <Text>No prospectus available.</Text>
                </View> )
    } else {

      // in order to show pdfs we are using google drive and then using the google drive url to show the pdf
      let uri = this.props.url;
      if (/\.pdf$/.test(uri)) {
        uri = `https://drive.google.com/viewerng/viewer?embedded=true&url=${uri}`;
      }
      return(
        <View style={ApplicationStyles.container}>
          <WebView
            ref={(ref) => { this.webview = ref }}
            onNavigationStateChange={(event) => this.onNavigationStateChange(event)}
            automaticallyAdjustContentInsets={false}
            style={null}
            source={{uri}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            decelerationRate="normal"
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            startInLoadingState={true}
            scalesPageToFit={this.state.scalesPageToFit} />
        </View>
      )
    }
  }

}

export default ArticleWebView
