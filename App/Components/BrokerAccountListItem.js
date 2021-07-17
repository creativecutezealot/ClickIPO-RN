
import React from 'react'
import PropTypes from 'prop-types';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
import { Colors, Fonts } from '../Themes'
import styles from './Styles/DeviceListItemStyle';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);


export default class BrokerAccountListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
    }
  }

  handlePress (brokerAccount) {
    this.setState({disabled: true});
    this.props.onConnectBrokerAccount(brokerAccount);

  }

  render = () => {
    const { brokerAccount, brokerConnection } = this.props;

    const mainBackgroundColor = Colors.white;
    const detailFontColor = Colors.drawerBlue;
    const actionFontColor = Colors.booger;
    availableBalance = '$ ' + brokerAccount.availableBalance.toLocaleString();

/***
    return (

    <TouchableHighlight style= {{ backgroundColor: mainBackgroundColor }}  underlayColor={Colors.pinkishGrey}  onPress={this.handlePress.bind(this, activeAccount, brokerAccount )} >
          

      <View style={[{ marginHorizontal: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EBEBEB", height: 140, flexDirection : 'column', flex: 1 }]}>
        
        <View style= {[{ flexDirection : 'row',  paddingTop: 16, justifyContent: 'space-between' }]}>
          
            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{brokerConnection.brokerDealerName ? brokerConnection.brokerDealerName : 'Unknown'}</Text>

            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{brokerAccount.accountNumber ? brokerAccount.accountNumber : 'Unknown'}</Text>

        </View>

        <View style= {[{ flexDirection : 'row', paddingTop: 16, justifyContent: 'flex-end', }]}>          
            <!-- <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{brokerAccount.availableBalance}</Text> -->
            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{availableBalance}</Text>
        </View>


        <View style= {[{ flexDirection : 'row', paddingVertical: 16, justifyContent: 'center', }]}>          
            { (isActiveAccount) ? <ClickIcon style={{ marginRight: 10 }} name="icon-check" size={20} color={actionFontColor} /> : null } 
            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: actionFontColor }]}>{ (isActiveAccount) ? 'Linked account' : ( (activeAccount) ? 'Link account' : 'Link account' )  }</Text>
        </View>


      </View>

    </TouchableHighlight>
    )
***/

    return (
      <View style= {{ backgroundColor: mainBackgroundColor }}  underlayColor={Colors.pinkishGrey}>
        <View style={[{ marginHorizontal: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EBEBEB", height: 100, flexDirection : 'column', flex: 1 }]}>
          <View style= {[{ flexDirection : 'row',  paddingTop: 16, justifyContent: 'space-between' }]}>
            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{brokerConnection.brokerDealerName ? brokerConnection.brokerDealerName : 'Unknown'}</Text>
            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{brokerAccount.accountNumber ? brokerAccount.accountNumber : 'Unknown'}</Text>
            <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 14 }, { color: detailFontColor }]}>{availableBalance}</Text>
          </View>

          <View style= {[{ flexDirection : 'row', paddingVertical: 16, justifyContent: 'center', }]}>
            <TouchableOpacity
              style={styles.TouchableOpacityStyles}
              onPress={this.handlePress.bind(this, brokerAccount)}
              disabled={this.state.disabled}>
              <Text style={ styles.TextStyles}>
                Link account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

// Prop type warnings
BrokerAccountListItem.propTypes = {
  brokerAccount: PropTypes.object.isRequired,
  onConnectBrokerAccount: PropTypes.func.isRequired,
}
