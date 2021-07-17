

import React from 'react'
import {
  Alert,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Text
} from 'react-native'
import styles from './Styles/NavItemsStyle'
import { Actions as NavigationActions, Scene, ActionConst } from 'react-native-router-flux'
import {
  Colors,
  Metrics,
  Images,
  Fonts
} from '../Themes'

import Logger from '../Lib/Logger'

import LinearGradient from 'react-native-linear-gradient'

import SearchView from '../Components/SearchView'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

const openDrawer = () => {
  NavigationActions.refresh({
    key: 'drawer',
    open: true
  })
}

const toggleOfferingsView = () => {
  this.offeringsView = this.offeringsView === 'CARD' ? 'LIST' : 'CARD'

  NavigationActions.refresh({
    key: 'offerings',
    view: this.offeringsView
  })
}

const headerHeight = Platform.OS === 'ios' ? 24 : 0;

const headerPadLeft = 48;
const headerPadRight = 48; //80

// const navTextColor = Platform.OS === 'ios' ? Colors.booger : Colors.white;
// const navRightMoreIcon = Platform.OS === 'ios' ? 'ios-more-outline' : 'md-more'
// const gradientStart = Platform.OS === 'ios' ? Colors.greenYellow : Colors.white
// const gradientEnd = Platform.OS === 'ios' ? Colors.greenBlue : Colors.white
// const symbolFontColor = Platform.OS === 'ios' ? Colors.white : Colors.booger
// const offeringFontColor = Platform.OS === 'ios' ? Colors.drawerBlue : Colors.white
// const tickerFontColor = Platform.OS === 'ios' ? Colors.blueSteel : Colors.white
// const titleFontColor = Platform.OS === 'ios' ? Colors.drawerBlue : Colors.white
// const subtitleFontColor = Platform.OS === 'ios' ? Colors.blueCoral : Colors.white


const navTextColor = Platform.OS === 'ios' ? Colors.booger : Colors.booger;
const navRightMoreIcon = Platform.OS === 'ios' ? 'icon-more' : 'icon-more-vertical'
const gradientStart = Platform.OS === 'ios' ? Colors.greenYellow : Colors.greenYellow
const gradientEnd = Platform.OS === 'ios' ? Colors.greenBlue : Colors.greenBlue
const symbolFontColor = Platform.OS === 'ios' ? Colors.white : Colors.white
const offeringFontColor = Platform.OS === 'ios' ? Colors.drawerBlue : Colors.drawerBlue
const tickerFontColor = Platform.OS === 'ios' ? Colors.blueSteel : Colors.blueSteel
const titleFontColor = Platform.OS === 'ios' ? Colors.drawerBlue : Colors.drawerBlue
const subtitleFontColor = Platform.OS === 'ios' ? Colors.blueCoral : Colors.blueCoral

 var searchTerm = ''

  const handleBackPress = (props) => {
    // console.log('props in back button: ', props);
    if(props && typeof props.changeStatusBarColor !== "undefined"){
      props.changeStatusBarColor(Colors.greenBlueDarker)
    }
    this.searchTerm = ''

  if (props.name == 'orderCancelConfirm') {
    NavigationActions.offerings({ tabId: '1' });
    }


    /*
      when user clicks back in the brokerView we check to see if the user is in flow and if the record is partial
      to notify the user that if they click back without linking they are unable to place an order
    */
    if (props.name == 'brokerView' && props.inFlow && props.brokerConnection.status === 'partial') {
      const data = {
        account_id: props.brokerConnection.accountId,
        mpid: props.brokerConnection.mpid
      }

      Alert.alert(
      'ClickIPO',
      'Are you sure you want to leave without linking your account ',
      [
        {text: 'Cancel'},
        {text: 'YES', onPress: () => {
          props.deleteBrokerConnection(data);
          NavigationActions.pop();
        }
       },
      ],
      { cancelable: false }
    )
    } else {
      NavigationActions.pop();
    }


  }

  handleSearchPress = (props) => {
    NavigationActions.offeringsSearch({isSearchOpen:true, isTabsHidden:true, searchTerm:''})
  }

 

  var isFilterOpen = false

  handleFilterClosePress = (props) => {
    this.isFilterOpen = false
    NavigationActions.refresh({ isFilterOpen:this.isFilterOpen, isTabsHidden: this.isFilterOpen, hideNavBar:this.isFilterOpen})
  }

  handleFilterPress = (props) => {
    this.isFilterOpen = true
    NavigationActions.refresh({ handleFilterPress: (props_) => this.handleFilterClosePress(props_),  isFilterOpen:this.isFilterOpen, isTabsHidden: this.isFilterOpen})
  }


 

  const applySearchTerm = (searchTerm) => {
    this.searchTerm = searchTerm
    NavigationActions.refresh({searchTerm:this.searchTerm}) 
  }



//if (typeof me.onChange !== "undefined") { 
 
export default {

  offeringDetails (props) {

    if (props && props.title && props.tickerSymbol){

        var gstart = Colors.greenYellow
        var gend = Colors.greenBlue

      if ((props.offeringTypeName === 'Secondary') || (props.offeringTypeName === 'Follow-On Overnight')) {
      // if ((props.offeringTypeName === 'Secondary') || (props.offeringTypeName === 'Spot') || (props.offeringTypeName === 'Block')) {
          gstart = Colors.seaFoam
          gend =  Colors.tealishLite
        }
      
      return (

        <View style={{ marginTop:headerHeight,flex:1, alignItems: 'center', flexDirection: 'row',  paddingLeft: headerPadLeft, paddingRight: headerPadRight }}>
            <LinearGradient colors={[gstart, gend]} start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}} style={[styles.offeringIcon, { height: 40, width: 40, alignItems: 'center', borderRadius: 20,}]}>
                <Text style={{ fontFamily: Fonts.type.base, fontSize: 24, color: symbolFontColor, textAlign: 'center', backgroundColor: Colors.clear, alignItems: 'center' }}>{ props.title.charAt(0)}</Text>
            </LinearGradient>
            <View style= {[{flexDirection:'column', paddingHorizontal: 8}]}>
                <Text numberOfLines={1} style={{ fontFamily: Fonts.type.base, fontSize: 18, color: offeringFontColor, backgroundColor: Colors.clear, lineHeight:24  }}>{props.title}</Text>
                <Text numberOfLines={1} style={{ fontFamily: Fonts.type.base, fontSize: 12, fontWeight: 'bold', color: tickerFontColor, backgroundColor: Colors.clear, lineHeight:16 }}>${props.tickerSymbol}</Text>
            </View>
        </View>

      )
    } else {
      return (
        null
      )
    }
    
    
  },

  commonRightButtons (props) {

    if (props && props.isSearchOpen){
      return null
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={ handleSearchPress.bind(this,props) }>
            <ClickIcon name='icon-search'
              size={24}
              color={navTextColor}
              style={[styles.backButton,{marginRight:0,marginLeft:0}]}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={ handleFilterPress.bind(this,props) }>
            <ClickIcon name={navRightMoreIcon}
              size={24}
              color={navTextColor}
              style={styles.backButton}
            />
          </TouchableOpacity>
         
        </View>
      )
    }

  },

  title (props) {

    if (props && props.title){

      return (
        <View style={{ marginTop:headerHeight, flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text numberOfLines={1} style={{ fontFamily: Fonts.type.base, fontSize: 16, fontWeight: 'bold', color: titleFontColor, backgroundColor: Colors.clear  }}>{props.title}</Text>
          </View>
        </View>
      )
    } else {
      return (
        null
      )
    }
  },

  titleWithSubtitle (props) {

    if (props && props.title && props.subtitle){
        var oType = ''
        if ( props.offeringTypeName ){
          oType = ' (' + props.offeringTypeName + ')'
        }

      return (
        <View style={{ marginTop:headerHeight, flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
            <View style={[{ flexDirection:'column',justifyContent: 'center', alignItems: 'center' }]}>
              <Text numberOfLines={1} style={{ fontFamily: Fonts.type.base, fontSize: 16, fontWeight: 'bold', color: titleFontColor, backgroundColor: Colors.clear, lineHeight:20  }}>{props.title}</Text>
              <Text numberOfLines={1} style={{ fontFamily: Fonts.type.base, fontSize: 14, fontWeight: 'bold', color: subtitleFontColor, backgroundColor: Colors.clear, lineHeight:20  }}>{props.subtitle + oType}</Text>
            </View>
          </View>
        </View>        
      )
    } else {
      return (
        null
      )
    }
  },


  logo (props) {
    var logo = Images.logoTop

    

    if (Platform.OS === 'android'){
      //logo = Images.logoTopWhite
      //logo = Images.logoTopWhite
    }
    
      return (
        <View style={[{ marginTop: headerHeight, flex:1, justifyContent: 'center', alignItems: 'center', paddingLeft: headerPadLeft, paddingRight: headerPadRight , flexDirection: 'row' }]}>
          <Image resizeMode='contain' style={[{ height: 24 }]} source={logo} />
        </View>
      )
  
    
  },

  search (props) {
    var logo = Images.logoTop

    

    if (Platform.OS === 'android'){
      //logo = Images.logoTopWhite
      //logo = Images.logoTopWhite
    }

    return (
        <View style={[{ marginTop: headerHeight, flex:1, justifyContent: 'center', alignItems: 'center', paddingLeft: headerPadLeft, paddingRight: headerPadRight , flexDirection: 'row' }]}>
          <View style={{flex:1}}>
            <SearchView searchTerm={this.searchTerm} onChange={(searchTerm) => applySearchTerm.bind(this,searchTerm)}/>
          </View>
        </View>
    )
    
  },

  backButton (props) {
    var navTextColor_ = navTextColor
    if ((props.offeringTypeName === 'Secondary') || (props.offeringTypeName === 'Follow-On Overnight')) {
    // if ((props.offeringTypeName === 'Secondary') || (props.offeringTypeName === 'Spot') || (props.offeringTypeName === 'Block')) {
        navTextColor_ =  Colors.tealishLite
    }

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={ handleBackPress.bind(this,props) }>
            <ClickIcon name='icon-chevron-left'
              size={24}
              color={navTextColor_}
              style={[styles.menuButton]}
            />
          </TouchableOpacity>
        </View>      
    )
  },

  closeButton (props) {
    
    var navTextColor_ = navTextColor
    if ((props.offeringTypeName === 'Secondary') || (props.offeringTypeName === 'Follow-On Overnight')) {
    // if ((props.offeringTypeName === 'Secondary') || (props.offeringTypeName === 'Spot') || (props.offeringTypeName === 'Block')) {
        navTextColor_ =  Colors.tealishLite
    }

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={ handleBackPress.bind(this,props) }>
            <ClickIcon name='icon-x'
              size={24}
              color={navTextColor_}
              style={styles.menuButton}
            />
          </TouchableOpacity>

        </View>

    )
  },

  menuButton (props) {

    return (

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={ openDrawer }>
            <ClickIcon name='icon-menu'
              size={24}
              color={navTextColor}
              style={styles.menuButton}
            />
          </TouchableOpacity>
        </View>
      )
       
  },

  viewButton () {
    if (!this.offeringsView) {
      this.offeringsView = 'LIST'
    }

    const iconName = this.offeringsView === 'CARD' ? 'th-list' : 'th-large'
    const iconText = this.offeringsView === 'CARD' ? 'List' : 'Cards'

    return (
      <TouchableOpacity onPress={toggleOfferingsView}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ marginRight: 4 }}>
            <Text style={[styles.menuButton, { ...Fonts.style.light }]}>{iconText}</Text>
          </View>

          <ClickIcon name={iconName}
            size={24}
            color={Colors.greyishBrown}
            style={styles.menuButton}
          />
        </View>
      </TouchableOpacity>
    )
  },

  searchButton (callback: Function) {
    return (
      <TouchableOpacity onPress={callback}>
        <ClickIcon name='icon-search'
          size={24}
          color={Colors.greyishBrown}
          style={styles.searchButton}
        />
      </TouchableOpacity>
    )
  }
}
