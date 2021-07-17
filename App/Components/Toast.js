
import React from 'react'
import PropTypes from 'prop-types';
import { View, Text, Dimensions, Animated, Easing } from 'react-native'
import { connect } from 'react-redux'
import {
  Colors,
  Fonts,
  Images
} from '../Themes'
import Icon from 'react-native-vector-icons/Ionicons'
import ToastActions from '../Redux/ToastRedux'
import styles from './Styles/ToastStyle'

import Logger from '../Lib/Logger'

class Toast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      icon: ''
    }
  }
	componentWillMount() {
		this.animatedValue = new Animated.Value(-100);
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			message : newProps.messageInfo.message,
			icon : newProps.messageInfo.icon
		})
		Animated.sequence([
			Animated.timing(this.animatedValue, {
				toValue: 25,
				duration: 700,
				easing: Easing.spring
			}),
			Animated.timing(this.animatedValue, {
				toValue: -100,
				delay: 1000,
				duration: 700,
				easing: Easing.spring
			})
		]).start()
	}



	render() {
		const {width} = Dimensions.get('window')
		const animatedStyle = { bottom: this.animatedValue }
		if(this.state.icon === 'good') {
			var icon = 'ios-checkmark-circle'
		} else if(this.state.icon === 'bad') {
			var icon = 'ios-close-circle'
		} else {
			var icon = 'ios-information-circle'
		}
		return(
			<Animated.View style={[{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }, animatedStyle]}>
				<View style={{ backgroundColor: Colors.twilightBlue, borderRadius: 6, width: width - 50, minHeight: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: 'black', shadowOffset:{width: 0, height: 5}, shadowRadius: 3, shadowOpacity: .3, paddingRight: 10 }}>
					<View style={styles.ViewStyle}>
						<Icon style={{fontSize: 24, color: Colors.white}} name={icon} />
					</View>
					<Text style={{fontSize: 12, flex: 1, color: Colors.white, marginVertical: 10}}>{this.state.message}</Text>
				</View>
			</Animated.View>
		)
	}	
}


const mapDispatchToProps = (dispatch) => {
  return {
    toastMessage: (data) => dispatch(ToastActions.toastMessage(data))
  }
}

const mapStateToProps = (state) => {
  return {
    messageInfo: state.toast.messageInfo
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toast)