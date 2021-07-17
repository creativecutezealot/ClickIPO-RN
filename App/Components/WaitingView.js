import React from 'react'
import {
	View,
  	ActivityIndicator,
  	InteractionManager
} from 'react-native'
import {
  Colors
} from '../Themes'
import styles from './Styles/WaitingViewStyle'

class WaitingView extends React.Component {
	state: {
	}
	constructor (props) {
		super(props)
		this.state = {
		}
	}

	render() {
		if(this.props.isWaiting === true) {
			return(
				<View style={styles.container}>
					<ActivityIndicator
					animating={this.state.animating}
					style={[{height: 80}]}
					size="large"
					color={Colors.pinkishGrey}
					/>
				</View>
			)
		} else {
			return(
				<View style={{flex:1}}>
					{this.props.children}
				</View>
			)
		}
	}
}

export default WaitingView