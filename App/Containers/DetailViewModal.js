import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import GenericModal from './GenericModal'
import InvestorScoreOverviewView from './InvestorScoreOverviewView'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Styles from './Styles/DetailViewModalStyle'

import {
  //Images,
  Colors,
  //Metrics,
  Fonts,
  //ApplicationStyles
} from '../Themes'

import Logger from '../Lib/Logger'


class DetailViewModal extends React.Component {

  renderInvestorScore = () => {
    return(<InvestorScoreOverviewView />)
  }

  renderFaq = () => {
    return(
      <View>
        <View style={ Styles.Component}>
          <Text style={[ Fonts.style.headline]}>How do I increase my Investor Score?</Text>
        </View>
        <Text>By holding an IPO as an investment rather than selling it in the first 30 days of trading and by holding a Secondary Offering for 15 days or longer. The longer you hold an IPO past the 30 day window, and a Secondary Offering past the 15 day window, will continue to increase your score.The majority of your score will be based on your buy and hold behavior, the longer the better. The more offerings you participate in, and placing orders early in the process, will also increase your score. The ClickIPO process is designed to attract buy and hold investors and eliminate flippers. A higher Investor Score will rank an investor higher which means better access and better allocations in more offerings.</Text>
      </View>
      )
  }

  renderWaitListInfo = () => {
    return(
      <View style={Styles.ParentView}>
        <View style={ Styles.ViewStyle}>
          <Text style={[{fontSize: 24, fontFamily: Fonts.type.light}]}>You Are On Our Waitlist To Purchase IPO and Secondary Offerings</Text>
        </View>
        <Text style={Styles.TextStyle1}>Why Is there a Waitlist?</Text>
        <Text style={Styles.TextStyle2}>While we are in our Beta test, only a limited number of  users at supported brokerages are able to actually participate in Offerings on the ClickIPO app. Regardless of your brokerage, you are automatically entered on the Waitlist to participate in Offerings. This means that you will receive an invitation from either ClickIPO or your brokerage when the app is accessible and you are able to connect the app and  participate in an available offering. We anticipate opening participation to our waitlist by the 1st quarter of 2018.</Text>
        <Text style={Styles.TextStyle1}>What if my brokerage doesn’t support the app?</Text>
        <Text style={Styles.TextStyle2}>If your current brokerage firm does not support the app, we will introduce you to other brokerage firms that do support the app, giving you an opportunity to connect the ClickIPO app.</Text>
        <Text style={Styles.TextStyle1}>How can I use the app now?</Text>
        <Text style={Styles.TextStyle2}>Anyone can use the ClickIPO app to browse offerings, read a prospectus, follow an offering, or share any IPO or Secondary Offering listed on the app. We encourage you to make yourself familiar with the many features available on the app before you connect with a brokerage firm and place any orders.</Text>
      </View>
    )
  }

  render = () => {
    if(this.props.content === 'investorScore') {
      var content = this.renderInvestorScore()
    } else if (this.props.content === 'waitlist') {
      var content = this.renderWaitListInfo()
    } else {
      var content = this.renderFaq()
    }
    return (
      <ScrollView>
        {content}
      </ScrollView>
    )
   }
}

export default DetailViewModal