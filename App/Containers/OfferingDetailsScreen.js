import React from 'react'
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
   Platform,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
  WebView,
  AlertIOS,
  Button
  // KeyboardAvoidingView,
  // Keyboard,
  // LayoutAnimation
  // KeyboardAvoidingView
} from 'react-native';

import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';
import OfferingActions from '../Redux/OfferingRedux';
import UserActions from '../Redux/UserRedux';
import OrderActions from '../Redux/OrderRedux';

import { User, Offering, Order } from '../Models';

import FullButton from '../Components/FullButton';

import WaitingView from '../Components/WaitingView';
import SafariView from 'react-native-safari-view';
import GenericModal from '../Containers/GenericModal';

import InvestorScoreView from './InvestorScoreView';
import SocialShareView from './SocialShareView';

import { numberWithCommas, dateFormatDetails } from '../Lib/Utilities';
// import { canPlaceOrder } from '../Lib/Utilities';

// import Moment from 'moment';

import styles from './Styles/OfferingDetailsScreenStyle'

import { findByProp } from 'ramdasauce';

import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/FontAwesome';

// import Intercom from 'react-native-intercom';

// Styles
import { Colors, Fonts, Images, ApplicationStyles } from '../Themes';
//import AlertMessage from '../Components/AlertMessage'

// I18n
// import I18n from 'react-native-i18n'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);

import Logger from '../Lib/Logger';

import firebase from '../Config/FirebaseConfig';


class OfferingDetailsScreen extends React.Component {
  state: {
    user: User,
    offering: Offering,
    saveSide: Boolean,
    isLoading: Boolean
  };

  startShare: null;
  prospectus_: false;
  placeOrder: false;

  constructor(props) {
    super(props);

    const offering =
      findByProp('id', props.id, props.offerings) || props.offering;
    Logger.log({
      name: 'OfferingDetailsScreen.constructor()',
      props: props
    });

    this.prospectus_ = props.prospectus;
    this.startShare = props.startShare;
    this.placeOrder = props.placeOrder;

    // this.sendProspectus = this.sendProspectus.bind(this);
    const { order = [] } = props;

    this.state = {
      user: props.user,
      activeOrder: null,
      offering: offering,
      isLoading: true,
      saveSide: true,
      showModal: false,
      isSaved: false,
      showVideo:false
    };
  }

  componentWillMount() {
    const oneOffering = findByProp('id', this.props.id, this.props.offerings);

    if (oneOffering) {
      this.setState({
        offering: oneOffering,
        isSaved: oneOffering.save
      });
    }

    const industry = this.state.offering.industry
      ? this.state.offering.industry
      : 'none';
    firebase.analytics().logEvent('viewed_offer', {
      ticker: this.state.offering.tickerSymbol,
      industry: industry
    });
    const offeringLabel = 'viewed ' + this.state.offering.tickerSymbol;
    // const intercomData = {};
    // intercomData[offeringLabel] = true;
    // Intercom.updateUser(intercomData);

    // Logger.log({ name: 'OfferingDetailsScreen.componentWillMount()', state: state })
    const { offering } = this.state;
    if (!offering.read) {
      this.props.markRead(offering.id);
    }

    /***
        if (offering.detailViewLoadedAt !== null) {
          const now = new Date();
          const timeDiff = Math.abs(
            now.getTime() - offering.detailViewLoadedAt.getTime()
          );
          if (timeDiff > 900000) {
            this.setState({
              isLoading: true
            });
            this.props.fetchOffering({
              id: offering.id
            });
          }
        } else {
          this.setState({
            isLoading: true
          });
          this.props.fetchOffering({
            id: offering.id
          });
        }
    ***/

    if ((offering.offeringTypeName === 'Secondary') || (offering.offeringTypeName === 'Follow-On Overnight')) {
    // if ((offering.offeringTypeName === 'Secondary') || (offering.offeringTypeName === 'Spot') || (offering.offeringTypeName === 'Block') ) {
      this.props.changeStatusBarColor(Colors.tealish);
      this.props.changeNavBarImage(Images.navigationBackgroundBlue);
    } else {
      this.props.changeStatusBarColor(Colors.greenBlueDarker);
      this.props.changeNavBarImage(Images.navigationBackgroundBlue);
    }
  }

  componentWillUnmount() {
    // Logger.log({ name: 'OfferingDetailsScreen.componentWillUnmount()', state: state })

  }

  noRowData() {
    return this.state.showVideo === true
  }

  componentDidMount() {
    //this.props.id is the offerings id, 
    const offeringId = this.props.id;

    this.props.fetchActiveOrder(offeringId);


    if (this.prospectus_) {
      this.displayProspectus();
    }

    if (this.placeOrder) {
      this.handlePressPlaceOrder(this.state.offering.id);
    }

    firebase.analytics().setCurrentScreen('offerings_' + this.state.offering.tickerSymbol);
  }

  componentWillReceiveProps = newProps => {
    
    if (newProps.order) {
      //set the activeOrder id here
      const newActiveOrder = newProps.order;
      this.setState({
        activeOrder: newActiveOrder,
        activeOrderId: newActiveOrder.id,
        // activeOrderId: newActiveOrder.offering.id,
        isLoading: false
      });
    }

    /**      
        const offering = findByProp('id', this.props.id, newProps.offerings);
        InteractionManager.runAfterInteractions(() => {
          if (offering.detailViewLoadedAt) {
            //might have to change this, we get a console.warning 
    
            
            this.setState({
              offering: offering,
              isLoading: false
            });
    
            //console.warn("Inside componentWillReceiveProps ", this.state.componentMounted)
          }
        });
    **/

  };
onVideoPress(){
  Platform.select({
    ios: () => {
      AlertIOS.alert('', 'turn the phone for better Quality', [
        {
          text: 'OK',
          onPress: () => this.termsButton()
        }
      ])
    },
    android: () => {
      ToastAndroid.show('turn the phone for better Quality', ToastAndroid.SHORT);
    }
  })();
}
  termsButton = () => {
    
    this.setState({
      showVideo:true
    })
    if(Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({
          url: 'https://www.youtube.com/watch?v=i3kaFpVOJMs'
        }))
        .catch(error => {
          console.error('Unable to open this link. Please try again later');
        });
    } else if (Platform.OS === 'android') {
      try {
        CustomTabs.openURL(
          'https://clickipo.com/terms-conditions'
        )
      }
      catch(error) {
        console.error('Unable to open this link. Please try again later', error)
      }
    }
  }

  handlePressSave = offeringId => {
    // Logger.log({ name: 'OfferingDetailsScreen.handlePressSave()', offering: offering })

    this.props.toggleSaved(offeringId);

    //toggling the saved/following button
    this.setState({
      isSaved: !this.state.isSaved
    });
  };

  handlePressPlaceOrder = offeringId => {
    // if no active order go to place order
    if (!this.state.offering.hasOrder) {
      // offer details  
      NavigationActions.orderCreate({
        id: offeringId,
        subtitle: this.state.offering.name,
        offeringTypeName: this.state.offering.offeringTypeName
      });
    } else if (this.props.order.reconfirmationRequired) {
      NavigationActions.orderReconfirmation({ order: this.props.order });
    } else {
      // this.setState({showModal: true})

      NavigationActions.orderModify({ order: this.state.activeOrder, offering: this.state.offering })

    }


    // // offer details
    // NavigationActions.orderCreate({
    //   id: offeringId,
    //   subtitle: this.state.offering.name,
    //   offeringTypeName: this.state.offering.offeringTypeName
    // });
  };


  handleSendProspectus() {
    //call the function that sends the prospectus the user 
    const data = {
      ext_id: this.state.offering.id,
      url_type: 'prospectus'
    }
    this.props.sendProspectus(data);
  }

  handleProspectus() {
    Alert.alert(
      'Prospectus',
      'Would you like to read the prospectus or email yourself a copy?',
      [
        { text: 'Read', onPress: () => this.displayProspectus() },
        { text: 'Email', onPress: () => this.handleSendProspectus() },
        { text: 'Cancel', onPress: () => console.log('cancelled button was pressed') }
      ]
    )
  }

  handleBrochure() {
    Alert.alert(
      'Brochure',
      'Would you like to display the brochure or email yourself a copy?',
      [
        { text: 'Read', onPress: () => this.displayBrochure() },
        { text: 'Email', onPress: () => this.handleSendBrochure() },
        { text: 'Cancel', onPress: () => console.log('cancelled button was pressed') }
      ]
    );
  }

  handleSendBrochure() {
    const data = {
      ext_id: this.state.offering.id,
      url_type: 'brochure'
    }
    this.props.sendProspectus(data)
  }


  displayBrochure = () => {
    NavigationActions.prospectusScreen({
      url: this.state.offering.brochureUrl,
      tickerSymbol: this.state.offering.tickerSymbol
    });
  }

  displayProspectus = () => {
    NavigationActions.prospectusScreen({
      url: this.state.offering.prospectusUrl,
      tickerSymbol: this.state.offering.tickerSymbol
    });
    const offeringLabel =
      'viewed prospectus ' + this.state.offering.tickerSymbol;
    // const intercomData = {};
    // intercomData[offeringLabel] = true;
    // Intercom.updateUser(intercomData);
  };

  getInvestorScoreInfo = () => {
    return <InvestorScoreView />;
  };

  openInvestorScoreInfo = () => {
    NavigationActions.detailViewModal({
      content: 'investorScore'
    });
  };

  openFaqInfo = () => {
    NavigationActions.detailViewModal({
      content: 'faq'
    });
  };

  WebView (){
    <WebView
    source={{uri: 'https://github.com/facebook/react-native'}}
    style={{marginTop: 20}}
  />
  };
  renderDescription = name => {
    if (this.state.offering.description.length !== 0) {
      return (
        <View>
          <Text style={styles.offeringdescription}>
            {this.state.offering.description}
          </Text>
        </View>
      );
    }
  };

  renderIndustries = thisList => {
    const offeringType = this.state.offering.offeringTypeName;
    var offeringTypeTextColor = Colors.smoke;
    if (offeringType === 'IPO') {
      offeringTypeTextColor = Colors.booger;
    } else if ((offeringType === 'Secondary') || (offeringType === 'Follow-On Overnight')) {
    // } else if ((offeringType === 'Secondary') || (offeringType === 'Spot') || (offeringType === 'Block')) {
      offeringTypeTextColor = Colors.tealishLite;
    } else {
      offeringTypeTextColor = Colors.orangeTint;
    }
    // comment by burhan
    // if (thisList.length !== 0) {
    //   const industries = thisList.map(thisOne => {
    //     return (
    //       <Text
    //         style={([ApplicationStyles.info], { color: offeringTypeTextColor })}
    //         key={thisOne.name}
    //       >
    //         {thisOne.name}
    //       </Text>
    //     );
    //   });
    //   return <View>{industries}</View>;
    // } else {
    //   return null;
    // }

    // add by burhan
    if(thisList !== null) {
      const industry = thisList
      return <Text style={([ApplicationStyles.info], { color: offeringTypeTextColor })}>{industry}</Text>
    } else {
      return null
    }
  };

  renderProspectus = () => {
    const offeringType = this.state.offering.offeringTypeName;
    var offeringTypeTextColor = Colors.smoke;
    if (offeringType === 'IPO') {
      offeringTypeTextColor = Colors.booger;
    // } else if ((offeringType === 'Secondary') || (offeringType === 'Spot') || (offeringType === 'Block')) {
    } else if ((offeringType === 'Secondary') || (offeringType === 'Follow-On Overnight')) {
      offeringTypeTextColor = Colors.tealishLite;
    } else {
      offeringTypeTextColor = Colors.orangeTint;
    }

    var justifyContent = this.state.offering.brochureUrl ? 'space-around' : 'flex-start';
    var paddingHorizontal = this.state.offering.brochureUrl ? 0 : 24

    if (this.state.offering.prospectusUrl !== null) {
      return (
        <View style={[ApplicationStyles.VideoContainer, {justifyContent: justifyContent, paddingHorizontal: paddingHorizontal} ]}>
          <TouchableOpacity onPress={() => this.handleProspectus()}>
            <View style={[ApplicationStyles.noteContainer]}>
              <ClickIcon
                name="icon-doc"
                style={[styles.iconDoc,
                { color: offeringTypeTextColor }
                ]}
              />
              <Text style={styles.readTheProspectus}>
                Prospectus
              </Text>
            </View>
          </TouchableOpacity>
          {this.state.offering.brochureUrl ? 
            <TouchableOpacity onPress={() => this.handleBrochure()}>
              <View style={[ApplicationStyles.noteContainer]}>
                <ClickIcon
                  name="icon-doc"
                  style={[styles.iconDoc,
                    { color: offeringTypeTextColor }
                  ]}
                  />
                <Text style={styles.readTheProspectus}>
                  Brochure
                </Text>
              </View>
            </TouchableOpacity> : null
          }
        </View>
      );
    }
  };

  measureView = event => {
    this.setState({
      imageWidth: event.nativeEvent.layout.width
    });
  };

  handleNoBrokerageAccount() {
    NavigationActions.brokerView();
  }

  renderAll = () => {

    const { user, offering } = this.state;
    const id = offering.id;
    // const name = offering.name
    const logo = {
      uri: 'https:' + offering.logoUrl
    };
    const name = offering.name;
    const tickerSymbol = offering.tickerSymbol;
    if (offering.finalShares === 0 || offering.finalShares === undefined || offering.finalShares === null) {
      var shares = 'TBD';
    } else {
      var shares = numberWithCommas(
        offering.finalShares
      );
    }
    if (offering.tradeDate) {
      var dateLabel = 'Anticipated:';
      // var date = Moment.utc(offering.tradeDate).format('MMMM Do YYYY');
      var date = dateFormatDetails(offering.tradeDate);
    } else {
      var dateLabel = 'Date:';
      var date = 'TBD';
    }

    const underwritersList = offering.underwritersList;

    const saveIcon = offering.save ? Images.saved : Images.savedOff;
    //const followActive = offering.save ? 'Following!' : 'Follow';
    const saveIconColor = offering.save ? Colors.booger : Colors.pinkishGrey;
    const saveButtonText = offering.save ? 'Unsave' : 'Save';
    const saveAlign = this.state.saveSide ? 'flex-end' : 'flex-start';

    const participate = offering.participate;
    const industries = offering.industries;
    const offeringType = offering.offeringTypeName;

    if (offering.finalPrice) {
      var price = '$' + offering.finalPrice.toFixed(2);
    } else if (
      offering.minPrice === 0 &&
      offering.maxPrice === 0
    ) {
      var price = 'TBD';
    } else if (
      offering.minPrice !== null &&
      offering.maxPrice !== null
    ) {
      var price =
        '$' +
        offering.minPrice.toFixed(2) +
        '-$' +
        offering.maxPrice.toFixed(2);
    } else if (offering.minPrice === null && offering.maxPrice === null) {
      var price = 'TBD'
    } else {
      var price = '$' + offering.maxPrice.toFixed(2);
    }
    var orderType = 'offer to buy:';
    var priceType = 'Price range:';
    var offeringTypeColor = Colors.white;
    var offeringTypeTextColor = Colors.smoke;
    if (offeringType === 'IPO') {
      offeringTypeColor = Colors.greenYellow;
      offeringTypeTextColor = Colors.booger;
      displayName = 'IPO';
      if (offering.tradeDate) {
        var dateLabel = 'Anticipated Date:';
        // var date = Moment.utc(offering.tradeDate).format('MMMM Do YYYY');
        var date = dateFormatDetails(offering.tradeDate);
      } else {
        var dateLabel = 'Date:';
        var date = 'TBD';
      }
    } else if (offeringType === 'Secondary') {
      // priceType = 'Price';
      priceType = 'Last Closing Price:';
      // price =
      //   'TBD (Last Closing Price: $' +
      //   offering.maxPrice.toFixed(2) +
      //   ')';
      price = '$' + offering.maxPrice.toFixed(2);
      offeringTypeColor = Colors.seaFoam;
      offeringTypeTextColor = Colors.tealishLite;
      displayName = 'Marketed Secondary';
      if (offering.tradeDate) {
        var dateLabel = 'Anticipated Date:';
        // var date = Moment.utc(offering.tradeDate).format('MMMM Do YYYY');
        var date = dateFormatDetails(offering.tradeDate);
      } else {
        var dateLabel = 'Date:';
        var date = 'TBD';
      }
    } else if ((offeringType === 'Follow-On Overnight')) {
    // } else if ((offeringType === 'Spot') || (offeringType === 'Block')) {
      priceType = 'Last Closing Price';
      priceType2 = 'Anticipated Price (Range)';
      // price = '$' + offering.minPrice.toFixed(2);
      // Add by Burhan
      price = '$' + offering.maxPrice.toFixed(2)
      followOnPriceRange = offering.priceRange;
      // spotBlockAnticipatedPrice = '$' + offering.anticipatedPrice.maxPrice.toFixed(2);
      offeringTypeColor = Colors.seaFoam;
      offeringTypeTextColor = Colors.tealishLite;
      displayName = `${offeringType} Trade`;
      if (offering.tradeDate) {
        var dateLabel = 'Anticipated Date:';
        // var date = Moment.utc(offering.tradeDate).format('MMMM Do YYYY');
        var date = dateFormatDetails(offering.tradeDate);
      } else {
        var dateLabel = 'Date:';
        var date = 'TBD';
      }
    } else {
      displayName = 'No information available';
    }

    // const scrollViewBottomMargin = canPlaceOrder(user, offering) ? 40 : 0;

    // offeringIllustration = () => {
    //   const splitPath = offering.logoUrl.split('/');
    //   const image = splitPath[splitPath.length - 1];
    //   if (image === 'placeholder_company_medium.png') {
    //     return (
    //       <View
    //         style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    //       >
    //         <Text style={[{ fontSize: 20, color: Colors.pinkishGrey }]}>
    //           ${offering.tickerSymbol}
    //         </Text>
    //       </View>
    //     );
    //   } else {
    //     return <Image resizeMode="contain" style={{ flex: 1 }} source={logo} />;
    //   }
    // };

    /*
    <View style={[ApplicationStyles.tipContainer]}>
    <ClickIcon name='lightbulb-o' style={[ApplicationStyles.icon, { color: Colors.white }]} />
    <Text style={[ApplicationStyles.note, {color: Colors.white}]}>Increasing your ClickIPO Investor Score can improve your chances of being allocated shares in an IPO.  Learn More ></Text>
  </View>
  <View style={[ApplicationStyles.noteContainer, ApplicationStyles.bottomBorder]}>
  <ClickIcon name='usd' style={[ApplicationStyles.icon, {color: Colors.black}]} />
  <Text style={[ApplicationStyles.note, {color: Colors.black}]}>You can place a maximum order of $25,000 for this IPO.</Text>
</View>
<View style={[ApplicationStyles.noteContainer, ApplicationStyles.bottomBorder]}>
<ClickIcon name='tachometer' style={[ApplicationStyles.icon, {color: Colors.black}]} />
<Text style={[ApplicationStyles.note, {color: Colors.black}]}>There are 100+ conditional purchase orders from other ClickIPO members.</Text>
</View>
*/
    let accounts
    if (user.brokerConnection) {
      accounts = user.brokerConnection.accounts
    } else {
      accounts = false
    }

    //if person is not restricted ask them to connect their BD account
    if ((this.props.restrictedPerson === 0) && (!user.brokerConnection || user.brokerConnection.status !== 'active') ) {
      return (
        <View style={[ApplicationStyles.mainContainer]}>
          <View style={styles.flex}>
            <ScrollView style={styles.flex}>
              <View style={styles.subView}>
                <View
                  style={[
                    ApplicationStyles.infoContainer,
                    // ApplicationStyles.bottomBorder
                  ]}
                >
                  <View style={styles.renderIndustriesView}>
                    <Text style={{ color: offeringTypeTextColor }}>
                      {displayName}
                    </Text>
                    {this.renderIndustries(industries)}
                  </View>
                  <View style={styles.renderIndustriesView}>
                    <Text style={[ApplicationStyles.info]}>{dateLabel}</Text>
                    <Text style={[ApplicationStyles.info]}>{date}</Text>
                  </View>
                  {
                    (offeringType === 'Follow-On Overnight') ?
                    // (offeringType === 'Spot' || offeringType === 'Block') ?
                      <View style={styles.renderIndustriesView}>
                        <Text style={[ApplicationStyles.info]}>{priceType}</Text>
                        <Text style={[ApplicationStyles.spotBlockInfo]}>{price}</Text>
                      </View> :
                      <View style={styles.renderIndustriesView}>
                        <Text style={[ApplicationStyles.info]}>{priceType}</Text>
                        <Text style={[ApplicationStyles.info]}>{price}</Text>
                      </View>
                  }
                  { //if offeringType is Follow-On Overnight show the anticipated price ( price )
                    (offeringType === 'Follow-On Overnight') ?
                    // (offeringType === 'Spot' || offeringType === 'Block') ?
                      <View style={styles.renderIndustriesView}>
                        <Text style={[ApplicationStyles.info]}>{priceType2}</Text>
                        <Text style={[ApplicationStyles.spotBlockInfo]}>{followOnPriceRange}</Text>
                      </View> : null
                  }
                  <View style={styles.renderIndustriesView}>
                    <Text style={[ApplicationStyles.info]}>Approx shares:</Text>
                    <Text style={[ApplicationStyles.info]}>{shares}</Text>
                  </View>
                </View>
                <View style={[ApplicationStyles.infoContainer]}>
                  <View
                    style={styles.ConnectBrokerageAccountMainView}
                  >
                    <View
                      style={styles.ConnectBrokerageAccountSubView}
                    >
                      <TouchableOpacity
                        style={styles.ConnectBrokerageAccountTouchableOpacity}
                        onPress={this.handleNoBrokerageAccount.bind(this)}
                      >
                        <LinearGradient
                          colors={[offeringTypeColor, offeringTypeTextColor]}
                          start={styles.LinearGradientStart}
                          end={styles.LinearGradientEnd}
                          style={styles.LinearGradientStyle}>
                          <Text style={styles.LinearGradientText}>
                            Connect a Brokerage Account
                </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={[ApplicationStyles.infoContainer, styles.socialShareView]}>
                  <View style={styles.socialShareSubView}>
                    <SocialShareView
                      startShare={this.startShare}
                      shareable={offering}
                    />
                  </View>
                </View>
                    <View style={styles.socialShareInnerView}>
                      {this.state.isSaved ? (
                        <TouchableOpacity
                          style={styles.ConnectFollowBrokerageAccountTouchableOpacity}
                          onPress={this.handlePressSave.bind(this, id)}
                        >
                          <LinearGradient
                            colors={[offeringTypeColor, offeringTypeTextColor]}
                            start={styles.LinearGradientStart}
                            end={styles.LinearGradientEnd}
                            style={styles.followingLinearGradient}>
                            <Text style={styles.followingTextStyle}>
                              <Icon name="check" color="#ffffff" />
                              Interested
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      ) : (
                          <TouchableOpacity
                            style={[styles.followTouchableOpacity, { borderColor: offeringTypeTextColor }]}
                            onPress={this.handlePressSave.bind(this, id)}>
                            <Text style={[styles.followText, { color: offeringTypeTextColor, }]}>
                            Interested?
                        </Text>
                          </TouchableOpacity>
                        )}
                    </View>

                <View style={styles.descriptionView}>
                  <Text style={[ApplicationStyles.infoLabel]}>DESCRIPTION</Text>
                  {this.renderDescription(name)}
                </View>
                {this.renderProspectus()}
                <View style={[ApplicationStyles.infoContainer]}>
                  <Text style={[ApplicationStyles.infoLabel]}>UNDERWRITER(S)</Text>
                  <Text style={[ApplicationStyles.info]}>{underwritersList}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }

    return (
      <View style={[ApplicationStyles.mainContainer]}>
        <View style={styles.flex}>
          <ScrollView style={styles.flex}>
            <View style={styles.subView}>
              <View style={[ ApplicationStyles.infoContainer ]}>
                <View style={styles.renderIndustriesView}>
                  <Text style={{ color: offeringTypeTextColor }}>
                    {displayName}
                  </Text>
                  {this.renderIndustries(industries)}
                </View>
                <View style={styles.renderIndustriesView}>
                  <Text style={[ApplicationStyles.info]}>{dateLabel}</Text>
                  <Text style={[ApplicationStyles.info]}>{date}</Text>
                </View>
                {
                  // (offeringType === 'Spot' || offeringType === 'Block') ?
                  (offeringType === 'Follow-On Overnight') ?
                    <View style={styles.renderIndustriesView}>
                      <Text style={[ApplicationStyles.info]}>{priceType}</Text>
                      <Text style={[ApplicationStyles.spotBlockInfo]}>{price}</Text>
                    </View> :
                    <View style={styles.renderIndustriesView}>
                      <Text style={[ApplicationStyles.info]}>{priceType}</Text>
                      <Text style={[ApplicationStyles.info]}>{price}</Text>
                    </View>
                }
                { //if offeringType is Follow-On Overnight show the anticipated price
                  (offeringType === 'Follow-On Overnight') ?
                    <View style={styles.renderIndustriesView}>
                      <Text style={[ApplicationStyles.info]}>{priceType2}</Text>
                      <Text style={[ApplicationStyles.spotBlockInfo]}>{followOnPriceRange}</Text>
                    </View> : null
                }
                <View style={styles.renderIndustriesView}>
                  <Text style={[ApplicationStyles.info]}>Approx shares:</Text>
                  <Text style={[ApplicationStyles.info]}>{shares}</Text>
                </View>
              </View>
              <View style={[ApplicationStyles.infoContainer]}>
                {this.renderActions(orderType)}
              </View>
              <View
                style={[ ApplicationStyles.infoContainer, styles.socialShareView ]} >
                <View style={[styles.socialShareSubView]}>
                  <SocialShareView
                    startShare={this.startShare}
                    shareable={offering}
                  />
                </View>
              </View>
                  <View style={[styles.socialShareInnerView, {padding: 10, flex: 1}]}>
                    {this.state.isSaved ? (
                      <TouchableOpacity
                        style={styles.ConnectBrokerageAccountTouchableOpacity}
                        onPress={this.handlePressSave.bind(this, id)}
                      >
                        <LinearGradient
                          colors={[offeringTypeColor, offeringTypeTextColor]}
                          start={styles.LinearGradientStart}
                          end={styles.LinearGradientEnd}
                          style={styles.followingLinearGradientStyle}
                        >
                          <Text style={styles.followingTextStyle}>
                            <Icon name="check" color="#ffffff" />
                            Interested
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                          style={[styles.followTouchableOpacity, { borderColor: offeringTypeTextColor }]}
                          onPress={this.handlePressSave.bind(this, id)}
                        >
                          <Text style={[styles.followText, { color: offeringTypeTextColor, }]}>
                          Interested?
                        </Text>
                        </TouchableOpacity>
                      )}
                  </View>

              <View style={[ApplicationStyles.infoContainer, { paddingTop: 0 }]}>
                <Text style={[ApplicationStyles.infoLabel]}>DESCRIPTION</Text>
                {this.renderDescription(name)}
              </View>
              {this.renderProspectus()}
              <View style={[ApplicationStyles.infoContainer]}>
                <Text style={[ApplicationStyles.infoLabel]}>UNDERWRITER(S)</Text>
                <Text style={[ApplicationStyles.info]}>{underwritersList}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  /*
  renderInvestorScoreEffect1 = participate => {
    if (participate) {
      return (
        <View style={[ApplicationStyles.tipContainer]}>
        {/* <ClickIPO name='ios-bulb-outline' style={[ApplicationStyles.icon, { color: Colors.white }]} /> }
          <Text style={[ApplicationStyles.note, { color: Colors.white }]} >
            Increasing your ClickIPO Investor Score can improve your chances of
            being allocated shares in an IPO.
            <Text style={styles.learnMoreTextStyle} onPress={this.openInvestorScoreInfo}>
              Learn More >
            </Text>
          </Text>
        </View>
        );
      } else {
        return null;
      }
    };
    
    renderInvestorScoreEffect2 = (participate, orderType) => {
      if (participate) {
        return (
          <View style={[ApplicationStyles.tipContainer]}>
          {/* <ClickIPO name='ios-bulb-outline' style={[ApplicationStyles.icon, { color: Colors.white }]} /> }
          <Text
            style={[
              ApplicationStyles.note, { color: Colors.white }]}
              >
            Submitting your {orderType} early and frequently improves your Investor Score.
            <Text
              style={styles.textstyle}
              onPress={this.openFaqInfo}
              >
              Learn More >
            </Text>
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };
  */
  
  renderActions = orderType => {
    const { user, offering } = this.state;
  
    /***
        This is redundant code quickly fixed to remove the immediate bug showing infinity on the number of shares when price='TBD'.
        This needs to be fixed properly soon

            { (price != 'TBD' ) ? (
              <TouchableOpacity style={{height: 60, flex: 1, backgroundColor: Colors.booger, borderRadius: 6, justifyContent: 'center', alignItems: 'center'}} onPress={this.handlePressPlaceOrder.bind(this, offering.id)}>
              <Text style={{fontSize: 18}}>Place Order</Text>
              <Text style={{fontSize: 12}}>(Wait List Status: Pending)</Text>
              </TouchableOpacity>
            ) : (<View></View>)
            }

    ***/

    if (offering.finalPrice) {
      var price = '$' + offering.finalPrice.toFixed(2)
    } else if (offering.minPrice === 0 && offering.maxPrice === 0) {
      var price = 'TBD'
    } else if (offering.minPrice !== null && offering.maxPrice !== null) {
      var price = '$' + offering.minPrice.toFixed(2) + '-$' + offering.maxPrice.toFixed(2)
    } else if (offering.minPrice === null && offering.maxPrice === null) {
      var price = 'TBD'
    } else {
      var price = '$' + offering.maxPrice.toFixed(2);
    }

    if (orderType === 'offer to buy') {
      //var thisText = 'Place Offer to Buy (Wait List Status: Pending)';
      var thisText = 'Place Offer to Buy';
    } else {
      //var thisText = 'Place Order (Wait List Status: Pending)';
      var thisText = 'Place Order';
    }

    //add a check for brokerConnection, if it exists check for canAcceptOrder, if person is not restricted allow ordering
    if (offering.acceptingOrders && offering.maxPrice > 0 && this.props.canAcceptOrder && this.props.restrictedPerson === 0) {
      const offeringType = this.state.offering.offeringTypeName;
      var offeringTypeColor = Colors.white;
      var offeringTypeTextColor = Colors.smoke;
      if (offeringType === 'IPO') {
        offeringTypeColor = Colors.greenYellow;
        offeringTypeTextColor = Colors.booger;
      } else if ((offeringType === 'Secondary') || (offeringType === 'Follow-On Overnight')) {
      // } else if ((offeringType === 'Secondary') || (offeringType === 'Spot') || (offeringType === 'Block')) {
        offeringTypeColor = Colors.seaFoam;
        offeringTypeTextColor = Colors.tealishLite;
      } else {
        offeringTypeColor = Colors.orangeWashed;
        offeringTypeTextColor = Colors.orangeTint;
      }
      return (
        <View
          style={styles.ConnectBrokerageAccountMainView}
        >
          <TouchableOpacity
            style={styles.ConnectBrokerageAccountSubView}
            onPress={this.handlePressPlaceOrder.bind(this, offering.id)}
          >
            <LinearGradient
              colors={[offeringTypeColor, offeringTypeTextColor]}
              start={styles.LinearGradientStart}
              end={styles.LinearGradientEnd}
              style={styles.LinearGradientStyle}
            >
              {this.props.order.reconfirmationRequired ? <Text style={styles.placeOrderText}> Reconfirm Order </Text> : !offering.hasOrder ? <Text style={styles.placeOrderText}> Place Order </Text> : <Text style={styles.placeOrderText}> Modify Order </Text>}  
              {/* <Text style={styles.placeOrderText}>
              Place Order
            </Text> */}
              {/* <Text style={styles.placeOrderText}>

            </Text> */}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    } else {
      // This is the place where we put a message informing the customer that they cannot place and order and the button is not selectable

      //var thisText = 'Not Available at this time';

      const offeringType = this.state.offering.offeringTypeName;
      var offeringTypeColor = Colors.white;
      var offeringTypeTextColor = Colors.smoke;
      if (offeringType === 'IPO') {
        offeringTypeColor = Colors.greenYellow;
        offeringTypeTextColor = Colors.booger;
      } else if ((offeringType === 'Secondary') || (offeringType === 'Follow-On Overnight')) {
      // } else if ((offeringType === 'Secondary') || (offeringType === 'Spot') || (offeringType === 'Block')) {
        offeringTypeColor = Colors.seaFoam;
        offeringTypeTextColor = Colors.tealishLite;
      } else {
        offeringTypeColor = Colors.orangeWashed;
        offeringTypeTextColor = Colors.orangeTint;
      }
      return (
        <View style={styles.ConnectBrokerageAccountMainView}>
          <View
            style={styles.ConnectBrokerageAccountSubView}
            onPress={this.handlePressPlaceOrder.bind(this, offering.id)}
          >
            <LinearGradient
              colors={[offeringTypeColor, offeringTypeTextColor]}
              start={styles.LinearGradientStart}
              end={styles.LinearGradientEnd}
              style={styles.LinearGradientStyle}
            >
              <Text style={styles.LinearGradientText}>
                Not available at this time
              </Text>
            </LinearGradient>
          </View>
        </View>
      );
    }
  };

  isWaiting = () => {
    if (this.props.fetchingOrder === false) {
      return false;
    } else {
      return true;
    }
  };

  render = () => {
    return (
      <WaitingView isWaiting={this.isWaiting()}>{this.renderAll()}</WaitingView>
    );
  };
}

OfferingDetailsScreen.propTypes = {
  user: PropTypes.object,
  offeringId: PropTypes.string,
  offering: PropTypes.object,
  offerings: PropTypes.array,
  toggleSaved: PropTypes.func,
  markRead: PropTypes.func,
  fetching: PropTypes.bool,
  error: PropTypes.object,
  restrictedPerson: PropTypes.number
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
    // canAcceptOrder: state.user.user.brokerConnection.canAcceptOrder,
    canAcceptOrder: state.user.user.brokerConnection ? state.user.user.brokerConnection.canAcceptOrder : true,
    offerings: state.offering.offerings,
    fetchingOrder: state.order.fetching,
    order: state.order.order,
    error: state.offering.error,
    orderError: state.order.error,
    restrictedPerson: state.user.restrictedPerson,
    brokerConnection: state.user.brokerConnection,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchOffering: data => dispatch(OfferingActions.fetchOffering(data)),
    fetchActiveOrder: (order) => dispatch(OrderActions.fetchActiveOrder(order)),
    toggleSaved: data => dispatch(OfferingActions.toggleSaved(data)),
    markRead: data => dispatch(OfferingActions.markRead(data)),
    sendProspectus: data => dispatch(UserActions.sendProspectusToUser(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OfferingDetailsScreen
);