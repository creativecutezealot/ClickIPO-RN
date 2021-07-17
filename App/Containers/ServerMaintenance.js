import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Images, ApplicationStyles, Colors } from '../Themes';

class ServerMaintenance extends Component {
  render() {
    const { logo } = Images;
    return (
      <View style={[ApplicationStyles.container, { backgroundColor: Colors.deepBooger }]}>
        <Image resize="contain" style={[{ alignSelf: 'center', resizeMode: 'contain', height: 60, width: 180, marginTop: 30, marginBottom: 30 }]} source={logo} />
        <Text style={[ApplicationStyles.darkLabelContainer, {color: Colors.white, fontSize: 18, padding: 15, margin: 15, textAlign: 'center', borderRadius: 10, borderColor: Colors.black}]}>{this.props.errorMessage}</Text>
      </View>
    );
  }
}

export default ServerMaintenance;