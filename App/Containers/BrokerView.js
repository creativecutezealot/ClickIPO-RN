import React from 'react'
import PropTypes from 'prop-types';
import { Text } from 'react-native'

import { connect } from 'react-redux'
// import UserActions from '../Redux/UserRedux'
// import { Actions as NavigationActions } from 'react-native-router-flux'

import BrokerConnectionView from './BrokerConnectionView'
import BrokerListView from './BrokerListView'
import BrokerConnectionSelectAccountView from './BrokerConnectionSelectAccountView'
import BrokerConnectionAccountView from './BrokerConnectionAccountView'

// Styles
// import styles from './Styles/BrokerViewStyle'

import Logger from '../Lib/Logger'
import firebase from '../Config/FirebaseConfig'

class BrokerView extends React.Component {
  constructor (props) {
    super(props)

    // Logger.log({ name: 'BrokerView.constructor()', props: props })

    const { brokerConnection = null } = props

    this.state = {
      brokerConnection: brokerConnection
    }
  }

  componentWillMount = () => {
    // Logger.log({ name: 'BrokerView.componentWillMount()' })
    firebase.analytics().setCurrentScreen('account_brokerages')

  }

  componentWillUnmount = () => {
    // Logger.log({ name: 'BrokerView.componentWillUnmount()' })
  }

  componentWillReceiveProps = (newProps) => {
    // Logger.log({ name: 'BrokerView.componentWillUnmount()', newProps: newProps })
    this.setState({ brokerConnection: newProps.brokerConnection})
  }

  render = () => {
    //if inFlow is true then show the brokerConnectionView ( proceed normally ) otherwise show the brokerList
    //the inFlow variable solves the problem of the user abandoning the flow of the brokerDealerConnection

    //if no brokerConnection then show the brokerList

    //if yes brokerConnection, if yes accounts show BrokerConnectionView 

    //if yes BrokerConnection and yes in flow then show the list
    
     
    const { brokerConnection } = this.state;

      if (!brokerConnection) {
        return (
          <BrokerListView />
        );
      } else if (brokerConnection.status === 'partial' && this.props.inFlow) {
        return (
          <BrokerConnectionSelectAccountView brokerConnection={this.props.brokerConnection} />
        );
      } else if (brokerConnection.status === 'partial' && !this.props.inFlow) {
        return (
          <BrokerListView />
        );
      } else {
        return (
          <BrokerConnectionView brokerConnection={this.props.brokerConnection} />
        );
      }



    // if (brokerConnection) {
    //   if(brokerConnection.status === 'active') {
    //     return (
    //       <BrokerConnectionView brokerConnection={brokerConnection} />
    //     )
    //   } else if (this.props.inFlow) {
    //     return (
    //       <BrokerConnectionView brokerConnection={brokerConnection} />
    //     )
    //   } else {
    //       return (
    //         <BrokerListView />
    //       )  
    //   }
    // } else {
    //   return (
    //     <BrokerListView />
    //   )
    // }
  }
}

const mapStateToProps = (state) => {
  // console.log('state inside of brokerView, there should be a key value pair called inFlow: ', state)
  return {
    brokerConnection: state.user.user.brokerConnection,
    inFlow: state.broker.inFlow,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerView)
