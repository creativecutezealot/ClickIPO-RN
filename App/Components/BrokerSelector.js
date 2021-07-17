
import React from 'react'
import PropTypes from 'prop-types';
import { Picker, View, Text } from 'react-native'
import { connect } from 'react-redux';

import { Dropdown } from './dropdown'
import UserActions from '../Redux/UserRedux';

import {
  Colors,
  Fonts
} from '../Themes'

import styles from './Styles/TextFieldStyle'


class BrokerSelector extends React.Component {
  componentDidMount() {
    this.props.fetchMarketingBrokerages();
  }

  render() {
  if (this.props.marketingBrokeragesList) {
    return (
      <View style={styles.BrokerSelectorViewStyle}>
        <Dropdown
          label=''
          value={this.props.brokerage ? this.props.brokerage : 'Select brokerage'}
          data={this.props.marketingBrokeragesList}
          labelHeight={0}
          style={styles.BrokerSelectorDropdownStyles}
          containerStyle={styles.ropdowncontainerStyle}
          activeLineWidth={0}
          underlineColorAndroid='transparent'
          rippleOpacity={0}
          baseColor={Colors.booger}
          animationDuration={20}
          onChangeText={(value, index, data) => this.props.onBrokerageChange(value)}
        />
      </View>
    )
  } else {
    return (
      <View style={styles.BrokerSelectorViewStyle}>
        <Text>Loading ...</Text>
      </View>
    )
  }
  }

}

const mapStateToProps = (state) => {
  return {
    marketingBrokeragesList: state.user.marketingBrokeragesList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMarketingBrokerages: () => dispatch(UserActions.fetchMarketingBrokerages()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokerSelector);