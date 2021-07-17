import React from 'react'
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient'

// const React = require('react');
const ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Animated,
} = ReactNative;

const Button = require('react-native-scrollable-tab-view/Button');

import Logger from '../Lib/Logger'


// const DefaultTabBar = React.createClass({
export default class DefaultTabBar extends React.Component{

  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: PropTypes.style,
    tabStyle: PropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: PropTypes.style,
    activeColors : PropTypes.any,
    inactiveColors: PropTypes.any,
  };

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  };

  renderTabOption(name, page) {
  };

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, activeColors, inactiveColors} = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'bold';
    const gradColor = isTabActive ? activeColors : inactiveColors;

    return (
    
    <LinearGradient key={name + '_grad'} style={styles.flexOne}  colors={gradColor} start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 0.0}} >
   		<Button
      		style={styles.flexOne}
      		key={name}
      		accessible={true}
      		accessibilityLabel={name}
      		accessibilityTraits='button'
      		onPress={() => onPressHandler(page)} >
      		<View style={[styles.tab, this.props.tabStyle, ]}>
        		<Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
          			{name}
        		</Text>
      		</View>
    	</Button>
    </LinearGradient>
    );
  };

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
    });

    var tabBarHeight = {}
    var tabBarHeightBorder = {}

    if (this.props.isTabsHidden){
      tabBarHeight = { height:0 }
      tabBarHeightBorder = {borderWidth:0}
    } 

    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, tabBarHeight, tabBarHeightBorder ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  flexOne: {
    flex: 1,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

module.exports = DefaultTabBar;
