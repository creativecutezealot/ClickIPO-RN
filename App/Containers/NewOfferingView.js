import React, { Component } from 'react';
import { Text, View, Dimensions, ListView } from 'react-native';
import { connect } from 'react-redux';
import NewFullButton from '../Components/NewFullButton';
import WaitingView from '../Components/WaitingView';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { filterOfferings, sortOfferings } from '../Lib/Utilities';
import OfferingListItem from '../Components/OfferingListItem';

import StartupActions from '../Redux/StartupRedux';
import OfferingActions from '../Redux/OfferingRedux';
import firebase from '../Config/FirebaseConfig';

import { ApplicationStyles } from '../Themes';

class NewOfferingView extends Component {
  constructor(props) {
    super(props);

    const { offerings = [] } = props;
    const rowHasChanged = (r1, r2 ) => r1.id !== r2.id || r1.save !== r2.save || r1.read !== r2.read;
    const ds = new ListView.DataSource({rowHasChanged});
    
    this.state = {
      dataSource: ds.cloneWithRows(offerings),
      waiting: true
    }
  }

  componentWillReceiveProps = (newProps) => {
    //here we have to set the offering that we get from api call to the state
    // const localOffering = newProps.offerings
    if(newProps.offering) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProps.offering),
        waiting: false
      })
    }
  }

  componentWillMount = () => {
    //calling the single offering api and passing offeringExtID 
    const data = {id: this.props.offeringExtID}
    this.props.fetchOffering(data)
    // this.props.loadOfferings()
  }
  
  componentDidMount = () => {
    this.props.resetDeeplink();
    firebase.analytics().setCurrentScreen('offering_new');
  }

  handlePressSeeOfferings = () => {
    NavigationActions.pop()
    NavigationActions.offerings()
  }

  renderRow = (offering) => {
    return (
      <OfferingListItem offering={offering} placeOrderEnabled={true} toggleSaved={() => this.props.toggleSaved(offering.id)} />
    )
  }

  renderFooter = () => {
    return (
      <NewFullButton
        text='See all offerings'
        buttonStyle={{ height: 40, margin: 20, width: Dimensions.get('window').width - 40 }}
        onPress={this.handlePressSeeOfferings}
        disabled={false} />
    )
  }

  render() {
    return (
      <WaitingView isWaiting={this.state.waiting}>
        <ListView
          contentContainerStyle={ApplicationStyles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderFooter={this.renderFooter}
          enableEmptySections
          pageSize={15}
        />
      </WaitingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    offering: state.offering.offering
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetDeeplink: (data) => dispatch(StartupActions.resetDeeplink(data)),
    fetchOffering: (data) => dispatch(OfferingActions.fetchOffering(data)),
    // loadOfferings: () => dispatch(OfferingActions.loadOfferings()),    
    toggleSaved: (data) => dispatch(OfferingActions.toggleSaved(data))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOfferingView);