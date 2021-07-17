

import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import {
  // Metrics
} from '../Themes'
// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'
// import { Actions as NavigationActions } from 'react-native-router-flux'
import ArticleWebView from '../Containers/ArticleWebView'
// Styles
import firebase from '../Config/FirebaseConfig'
// I18n
// import I18n from 'react-native-i18n'

class ProspectusScreen extends React.Component {

  componentWillMount () {

    firebase.analytics().logEvent('prospectus_opened', { ticker : this.props.tickerSymbol })

    firebase.analytics().setCurrentScreen('offerings_' + this.props.tickerSymbol + '_prospectus')

  }

  render () {
    return (
      <View style={{marginTop: 65, flex: 1}}>
      <ArticleWebView url={this.props.url}/>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProspectusScreen)
