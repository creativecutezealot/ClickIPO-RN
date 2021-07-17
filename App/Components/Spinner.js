import React, { Component } from 'react'
import {
    View, Modal,
    ActivityIndicator
} from 'react-native'
import styles from './Styles/SpinnerStyle'

export default class Spinner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
        }
    } 

    render() {
        return (
            <View style={styles.Component}>
                <Modal
                    transparent={true}
                    supportedOrientations={['portrait', 'landscape']}
                    visible={this.state.isLoading}
                    onRequestClose={() => console.log("sdfdf")}>
                    <View style={styles.View1}>
                        <View
                            style={styles.View2}>
                            <ActivityIndicator
                                color={"white"}
                                size='large'
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}