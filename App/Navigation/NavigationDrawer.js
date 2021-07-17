import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Drawer from 'react-native-drawer'
import { DefaultRenderer, Actions as NavigationActions } from 'react-native-router-flux'
import DrawerContent from '../Containers/DrawerContent'
import { connect } from 'react-redux'

import {Colors} from '../Themes/'
import styles from './Styles/NavigationDrawerStyle'
import firebase from '../Config/FirebaseConfig'

/* *******************
* Documentation: https://github.com/root-two/react-native-drawer
********************/

class NavigationDrawer extends Component {

  navOpened(state, value){

    if(value){
      firebase.analytics().setCurrentScreen('navigation')
    }

    NavigationActions.refresh({key: state.key, open: value})
  }
  
  render () {
    const state = this.props.navigation.state; //this.props.navigationState
    const children = state.children
    return (
      <Drawer
        ref='navigation'
        type='overlay'
        open={state.params.open}
        onOpen={this.navOpened.bind(this,state, true)}
        onClose={this.navOpened.bind(this,state, false)}
        content={<DrawerContent/>}
        styles={styles}
        tapToClose
        openDrawerOffset={0.0}
        closedDrawerOffset={0.0}
        panCloseMask={0.3}
        negotiatePan
        tweenHandler={ratio => ({
          main: {
            opacity: 1,
          },
          mainOverlay: {
            opacity: 0,
            backgroundColor: Colors.white
          },
        })}
        /*
        tweenHandler={(ratio) => ({
          main: { opacity: Math.max(0.54, 1 - ratio) }
        })}
        */
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    )
  }
}

NavigationDrawer.propTypes = {
  navigationState: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDrawer)
