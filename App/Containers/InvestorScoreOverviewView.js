import React from 'react'
import { ScrollView, Text, View, KeyboardAvoidingView, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import {
  Images,
  ApplicationStyles
} from '../Themes'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import firebase from '../Config/FirebaseConfig'

class InvestorScoreOverviewView extends React.Component {

  componentWillMount = () => {
    firebase.analytics().setCurrentScreen('help_investor_score_how_it_works')
  }
  
  render () {
    return (
      <ScrollView style={ApplicationStyles.container}>
        <KeyboardAvoidingView behavior='position'>
          <View style={ApplicationStyles.copyContainer}>
            <Text style={ApplicationStyles.copyHeader}>What Is the ClickIPO Investor Score&#8482;? </Text>
            <View style={ApplicationStyles.imageContainer}><Image style={ApplicationStyles.imageCongrats} source={Images.congrats} /></View>
            <Text style={ApplicationStyles.paragraph}>The ClickIPO Investor Score&#8482; applies to any investors that have been invited to participate in offerings on the ClickIPO platform, and have connected a supported brokerage account. It does not apply to users who only use the app for informational purposes.</Text>
            <Text style={ApplicationStyles.paragraph}>The ClickIPO Investor Score&#8482; is a proprietary scoring system we use to rank investors based on their investment behavior. It works similar to a credit score in that we use your score to determine IPO and Secondary Offering allocations. A higher score means you will receive a better allocation in more offerings relative to other investors with a lower score.</Text>
            <Text style={ApplicationStyles.paragraph}>At this time, we do not publish investor scores, but use the score internally to determine allocations.</Text>
            <Text style={ApplicationStyles.copyHeader}>Why Does ClickIPO Need to Score Users?</Text>
            <View style={ApplicationStyles.imageContainer}><Image style={ApplicationStyles.imageInstitution} source={Images.institution} /></View>
            <Text style={ApplicationStyles.paragraph}>Allocations of public offerings are limited and we could have more demand for shares in an offering than the shares available. ClickIPO uses a scoring system to help us automatically allocate shares to investors based primarily on their “buy and hold” behavior. The scoring system is designed to eliminate “IPO Flippers”, those that have the intention of selling any allocation in the first 30 days of trading.</Text>
            <Text style={ApplicationStyles.copyHeader}>Which Behaviors Help or Hurt My Score?</Text>
            <View style={ApplicationStyles.imageContainer}><Image style={ApplicationStyles.imageGraph} source={Images.graph} /></View>
            <Text style={ApplicationStyles.paragraph}>Buying and holding IPO shares for 30 days or longer, and secondary offering shares for 15 days or longer is the best way to increase your score. We calculate score increases up to 6 months, so longer holding periods increase your score the most. Selling IPO or secondary offering shares earlier than the 15 and 30 day periods listed above will hurt your score. Selling in the first day or first week after an offering will have the most negative effect on your score. Other factors that affect your score are: Participating in more offerings, buying additional shares in the aftermarket, and placing orders early in the process. </Text>        
            <Text style={ApplicationStyles.paragraph}>Keep in mind that Click IPO Securities does not offer investment advice and that you are free to sell your shares at any time without restriction. Also, users will not see a score reduction in offerings that are trading at a 25% premium to their issue price even if those shares are sold in the first 30 days of trading.</Text>
            <View style={ApplicationStyles.imageContainer}><Image style={ApplicationStyles.imageIcon} source={Images.iconIllustration} /></View>
            <Text style={ApplicationStyles.tip}>When you see these symbols, they refer to actions that you have taken, or might take, that will generally help or hurt your investor score.</Text>
            <Text style={ApplicationStyles.paragraph}>New users start with a relatively low score until they participate in an offering or multiple offerings to build their score. </Text>
            <Text style={ApplicationStyles.paragraph}>Because multiple factors contribute to allocation, at no point are allocations ever guaranteed. Even users with high scores may not receive any allocation of a particular offering.</Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorScoreOverviewView)
