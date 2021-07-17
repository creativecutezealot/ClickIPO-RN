
import React from 'react'
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  // ScrollView,
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  // Keyboard,
  // LayoutAnimation,
  Clipboard,
  RefreshControl,
  Platform
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Device
} from '../Models'

import Icon from 'react-native-vector-icons/FontAwesome'

// Styles
import {
  Colors,
  Fonts,
  Images
} from '../Themes'

import styles from './Styles/DeviceListItemStyle'

import Logger from '../Lib/Logger'

export default class DeviceListItem extends React.Component {

  componentWillMount () {
    // Logger.log({ name: 'DeviceListItem.componentWillMount()' })
  }

  componentWillUnmount () {
    // Logger.log({ name: 'DeviceListItem.componentWillUnmount()' })
  }

  render = () => {
    // Logger.log({ name: 'DeviceListItem.render()', props: this.props })

    const { device } = this.props

    return (
      <View style={[styles.row, { alignItems: 'center', flex: 1, height: 40, backgroundColor: Colors.smoke, borderBottomWidth: 1, borderColor: Colors.lightGrey }]}>
        <View style={[styles.container, { flex: 1, marginHorizontal: 12 }]}>
          <Text style={[{ fontFamily: Fonts.type.base, fontSize: 16 }, { color: Colors.greyishBrown }]}>{device.name ? device.name : 'Unknown'}</Text>
        </View>

        <TouchableHighlight style={[{ marginHorizontal: 12, padding: 4 }]} underlayColor={Colors.pinkishGrey} onPress={() => this.props.onDisableNotifications(device.id)}>
          <Icon name={'trash'} style={[{ fontSize: 20, color: Colors.greyishBrown }]} />
        </TouchableHighlight>
      </View>
    )
  }
}

// Prop type warnings
DeviceListItem.propTypes = {
  device: PropTypes.object.isRequired,
  onDisableNotifications: PropTypes.func.isRequired,
}
