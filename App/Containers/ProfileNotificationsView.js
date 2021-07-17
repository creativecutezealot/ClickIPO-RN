import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
  ListView,
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  KeyboardAvoidingView
} from 'react-native'

import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  Device
} from '../Models'

import AlertMessage from '../Components/AlertMessage'

import {
  Colors,
  Metrics,
  Fonts,
  ApplicationStyles
  // Images
} from '../Themes'

import TextField from '../Components/TextField'
// import Checkbox from '../Components/Checkbox'
import FullButton from '../Components/FullButton'
import DeviceListItem from '../Components/DeviceListItem'
import styles from './Styles/ProfileNotificationsViewStyle'
// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'

// I18n
// import I18n from 'react-native-i18n'

import Logger from '../Lib/Logger'

class ProfileNotificationsView extends React.Component {

  state: {
    devices: Array<Device>,
    dataSource: Object,

    isProcessing: Boolean,
  }

  constructor (props) {
    super(props)

    const { devices = [] } = props

    // DataSource configured
    const rowHasChanged = (r1, r2) => r1.id !== r2.id
    const ds = new ListView.DataSource({rowHasChanged})

    this.state = {
      devices: devices,
      dataSource: ds.cloneWithRows(devices),

      isProcessing: false
    }
  }

  componentWillReceiveProps (newProps) {
    // Logger.log({ name: 'ProfileNotificationsView.componentWillReceiveProps()', value: newProps })

    const { devices = [], isProcessing } = this.newProps

    this.setState({
      devices: devices,
      dataSource: ds.cloneWithRows(devices),

      isProcessing: false,
    })
  }

  componentWillMount () {
    // Logger.log({ name: 'ProfileNotificationsView.componentWillMount()' })
  }

  componentWillUnmount () {
    // Logger.log({ name: 'ProfileNotificationsView.componentWillUnmount()' })
  }

  disableNotifications = (deviceId) => {
    // Logger.log({ name: 'ProfileNotificationsView.disableNotifications()', deviceId: deviceId })

    this.props.disableDeviceNotifications(deviceId)
  }

  noRowData = () => {
    return this.state.dataSource.getRowCount() === 0
  }

  render () {
    // Logger.log({ name: 'ProfileNotificationsView.render()', state: this.state })

    return (
      <ScrollView style={ApplicationStyles.mainContainer}>
        <KeyboardAvoidingView behavior='position' style={styles.Component}>
          <View style={[ApplicationStyles.container, { margin: 24 }]}>
            <Text style={ApplicationStyles.headline}>Push Notifications Settings</Text>

            <View style={[ApplicationStyles.container, { marginTop: 36 }]}>
              <Text style={[{ fontFamily: Fonts.type.bold, fontSize: 16, color: Colors.greyishBrown }]}>My Devices</Text>

              <View style={[ApplicationStyles.container, { marginTop: 8, borderTopWidth: 1, borderColor: Colors.lightGrey }]}>
                <AlertMessage title='No Devices' show={this.noRowData()} />

                <ListView
                  contentContainerStyle={{  }}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow}
                  enableEmptySections
                  pageSize={15}
                />
              </View>
            </View>

          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  renderRow = (rowData) => {
    // Logger.log({ name: 'ProfileNotificationsView.renderRow()', rowData: rowData, state: this.state })

    return (
      <DeviceListItem device={rowData} onDisableNotifications={(deviceid) => { this.disableNotifications(deviceid) }} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    devices: state.user.user.devices,

    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    disableDeviceNotifications: (data) => dispatch(SettingsActions.disableDeviceNotifications(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileNotificationsView)
