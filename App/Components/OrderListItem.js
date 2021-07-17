
import React from 'react'
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux';
import { numberWithCommas } from '../Lib/Utilities';
import {
  User,
  Offering
} from '../Models';

// Styles
import {
  Colors,
  Fonts,
  ApplicationStyles
} from '../Themes';

export default class OrderListItem extends React.Component {

  onPress = () => {
    this.props.orderSelected(this.props.order);
  }

  render = () => {
    const { order } = this.props;
    const logo = { uri: 'https:' + order.offering.logoUrl }
    const name = order.offering.name;
    const orderStatus = ((order.allocatedShares > 0) ? 'Shares allocated: ' + order.allocatedShares : 'Order: $' + numberWithCommas(order.requestedAmount));
    const orderDescription = ((order.status == "cancelled") ? 'Status: Cancelled' : ((order.allocatedShares > 0) ? 'Status: Closed' : 'Status Pending'));

    if (order.status == "cancelled" || order.status == "closed") {
      // Can't touch and get into details
      return (
        <View style={[ApplicationStyles.bottomBorder,{backgroundColor: Colors.white}]} >
          <View style={ApplicationStyles.rowContainer}>
            <View style={ApplicationStyles.cancelledlogoContainerOrderList}>
              <Image resizeMode='contain' style={ApplicationStyles.logoOrderList} source={logo} />
            </View>

            <View style={[ApplicationStyles.cancelleddescriptionContainer, { backgroundColor: Colors.verylightgrey }]}>
              <View style={{ marginBottom: 10 }}>
                <Text style={[ApplicationStyles.companyLabel,{color:Colors.twilightBlue}]}>{ name }</Text>
              </View>

              <View >
                <Text style={[ApplicationStyles.label,{fontFamily: Fonts.type.chivo, fontSize: 14, color:Colors.blueSteel}]}>{ orderStatus }</Text>
              </View>

              <View>
                <Text style={[ApplicationStyles.label,{fontFamily: Fonts.type.chivo, fontSize: 14, color:Colors.blueSteel}]}>{ orderDescription }</Text>
              </View>
            </View>
          </View>
        </View>
      );
    //the code for Reconfirmation Required text over orders -- when we implement the reconfirmation required, add the neccessary conditional to render this for the orders with reconfirmation required flag 
    //we are now navigating to the reconfirmation page from the ordersListView component inside of the pressModify function
    } else if (order.reconfirmationRequired) {
      return (
        <View style={[ApplicationStyles.bottomBorder, { backgroundColor: Colors.white }]} >
          <TouchableHighlight onPress={this.onPress}>
            <View style={ApplicationStyles.rowContainer}>
              <View style={[ApplicationStyles.cancelledlogoContainerOrderList, { opacity: 0.2 }]}>
                <Image resizeMode='contain' style={ApplicationStyles.logoOrderList} source={logo} />
              </View>

              <View style={[ApplicationStyles.cancelleddescriptionContainer, { backgroundColor: Colors.verylightgrey, opacity: 0.2 }]}>
                <View style={{ marginBottom: 10 }}>
                  <Text style={[ApplicationStyles.companyLabel, { color: Colors.twilightBlue }]}>{name}</Text>
                </View>

                <View >
                  <Text style={[ApplicationStyles.label, { fontFamily: Fonts.type.chivo, fontSize: 14, color: Colors.blueSteel }]}>{orderStatus}</Text>
                </View>

                <View>
                  <Text style={[ApplicationStyles.label, { fontFamily: Fonts.type.chivo, fontSize: 14, color: Colors.blueSteel }]}>{orderDescription}</Text>
                </View>
              </View>
              <View style={{ position: 'absolute', height: '100%', width: '100%', alignContent: 'center', justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center', alignContent: 'center', backgroundColor: 'rgba(255, 255, 255, .1)' }}>Reconfirmation Required</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <View style={[ApplicationStyles.bottomBorder,{backgroundColor: Colors.white}]}>
          <TouchableHighlight onPress={this.onPress}>
            <View style={ApplicationStyles.rowContainer}>

              <View style={ApplicationStyles.logoContainerOrderList}>
                <Image resizeMode='contain' style={ApplicationStyles.logoOrderList} source={logo} />
              </View>

              <View style={[ApplicationStyles.descriptionContainer,{backgroundColor: Colors.white}]}>
                <View style={{ marginBottom: 10 }}>
                  <Text style={[ApplicationStyles.companyLabel,{color:Colors.twilightBlue}]}>{ name }</Text>
                </View>

                <View >
                  <Text style={[ApplicationStyles.label,{fontFamily: Fonts.type.chivo, fontSize: 14, color:Colors.blueSteel}]}>{ orderStatus }</Text>
                </View>

                <View>
                  <Text style={[ApplicationStyles.label,{fontFamily: Fonts.type.chivo, fontSize: 14, color:Colors.blueSteel}]}>{ orderDescription }</Text>
                </View>
              </View>

            </View>
          </TouchableHighlight>
        </View>
      );
    }
  }
}

// Prop type warnings
OrderListItem.propTypes = {
  order: PropTypes.object.isRequired
}