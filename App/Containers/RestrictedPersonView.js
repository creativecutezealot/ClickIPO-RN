import React from 'react'
import PropTypes from 'prop-types';
import { View, Text, ScrollView, StyleSheet, Dimensions, Platform } from "react-native"
import { connect } from 'react-redux'
import UserActions from '../Redux/UserRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import SafariView from 'react-native-safari-view';
import { CustomTabs } from 'react-native-custom-tabs'

import {
  ApplicationStyles,
  Colors
} from '../Themes'

import Logger from '../Lib/Logger'

import FullButton from '../Components/FullButton'
import Checkbox from '../Components/Checkbox'
import Styles from './Styles/RestrictedPersonViewStyle'


class RestrictedPersonView extends React.Component {

  constructor(props) {
    Logger.log({ name: 'RestrictedPersonView.constructor()', props: props })

    super(props)

    this.state = {
      complete: false,
      restricted: false,
      agree: false,
      learnMoreClicked: false
    }
  }

  componentWillMount = () => {
    Logger.log({ name: 'RestrictedPersonView.componentWillMount()' })
  }

  componentDidMount = () => {
    Logger.log({ name: 'RestrictedPersonView.componentDidMount()' })
  }

  handlePressConfirm = () => {
    //Add by burhan
    this.props.handlePressRestrictedConfirm()

    // comment by burhan
    // const restrictedPerson = this.state.restricted === true ? 1 : 0
    // const data = { restricted: restrictedPerson, user_id: this.props.user.id }
    // this.props.restrictedPerson(data)
    // if (this.state.restricted && this.state.agree) {
    //   this.props.handlePressRestrictedConfirm()
    // }
  }

  //open webView with BrokerConnection agreement information
  handlePressLearnMore() {
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({
          url: "https://clickipo.com/broker-permission/"
        }))
        .catch(error => {
          console.error('Unable to open this link. Please try again later');
        })
    } else if (Platform.OS === 'android') {
      try {
        CustomTabs.openURL(
          "https://clickipo.com/broker-permission/"
        )
      }
      catch (error) {
        console.error('Unable to open this link. Please try again later ', error);
      }
    }
  }

  render = () => {
    return (
      <View style={Styles.Component}>
        <View style={Styles.ParentView}>
          <View style={{ flex: 2 }}>
            <ScrollView style={Styles.ParentView1}>
              <View style={Styles.ParentView2}>
                <Text style={styles.header}>
                  5130. Restrictions on the Purchase and Sale of Initial Equity Public Offerings
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (a) General Prohibitions
            </Text>
                <Text style={styles.row}>
                  (1) A member or a person associated with a member may not sell, or cause to be sold, a new issue to any account in which a restricted person has a beneficial interest, except as otherwise permitted herein.
            </Text>
                <Text style={styles.row}>
                  (2) A member or a person associated with a member may not purchase a new issue in any account in which such member or person associated with a member has a beneficial interest, except as otherwise permitted herein.
            </Text>
                <Text style={styles.row}>
                  (3) A member may not continue to hold new issues acquired by the member as an underwriter, selling group member or otherwise, except as otherwise permitted herein.
            </Text>
                <Text style={styles.row}>
                  (4) Nothing in this paragraph (a) shall prohibit:
            </Text>
                <Text style={styles.row}>
                  (A) sales or purchases from one member of the selling group to another member of the selling group that are incidental to the distribution of a new issue to a non-restricted person at the public offering price;
            </Text>
                <Text style={styles.row}>
                  (B) sales or purchases by a broker-dealer of a new issue at the public offering price as part of an accommodation to a non-restricted person customer of the broker-dealer; or
            </Text>
                <Text style={styles.row}>
                  (C) purchases by a broker-dealer (or owner of a broker-dealer), organized as an investment partnership, of a new issue at the public offering price, provided such purchases are credited to the capital accounts of its partners in accordance with paragraph (c)(4).
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (b) Preconditions for Sale
            </Text>
                <Text style={styles.row}>
                  Before selling a new issue to any account, a member must in good faith have obtained within the twelve months prior to such sale, a representation from:
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (1) Beneficial Owners
            </Text>
                <Text style={styles.row}>
                  the account holder(s), or a person authorized to represent the beneficial owners of the account, that the account is eligible to purchase new issues in compliance with this Rule; or
            </Text>
                <Text style={[styles.row, styles.Header]}>
                  (2) Conduits
            </Text>
                <Text style={styles.row}>
                  a bank, foreign bank, broker-dealer, or investment adviser or other conduit that all purchases of new issues are in compliance with this Rule.
            </Text>
                <Text style={styles.row}>
                  A member may not rely upon any representation that it believes, or has reason to believe, is inaccurate. A member shall maintain a copy of all records and information relating to whether an account is eligible to purchase new issues in its files for at least three years following the member's last sale of a new issue to that account.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (c) General Exemptions
            </Text>
                <Text style={styles.row}>
                  The general prohibitions in paragraph (a) of this Rule shall not apply to sales to and purchases by the following accounts or persons, whether directly or through accounts in which such persons have a beneficial interest:
            </Text>
                <Text style={styles.row}>
                  (1) An investment company registered under the Investment Company Act;
            </Text>
                <Text style={styles.row}>
                  (2) A common trust fund or similar fund as described in Section 3(a)(12)(A)(iii) of the Exchange Act, provided that:
            </Text>
                <Text style={styles.row}>
                  (A) the fund has investments from 1,000 or more accounts; and
            </Text>
                <Text style={styles.row}>
                  (B) the fund does not limit beneficial interests in the fund principally to trust accounts of restricted persons;
            </Text>
                <Text style={styles.row}>
                  (3) An insurance company general, separate or investment account, provided that:
            </Text>
                <Text style={styles.row}>
                  (A) the account is funded by premiums from 1,000 or more policyholders, or, if a general account, the insurance company has 1,000 or more policyholders; and
            </Text>
                <Text style={styles.row}>
                  (B) the insurance company does not limit the policyholders whose premiums are used to fund the account principally to restricted persons, or, if a general account, the insurance company does not limit its policyholders principally to restricted persons;
            </Text>
                <Text style={styles.row}>
                  (4) An account if the beneficial interests of restricted persons do not exceed in the aggregate 10% of such account;
            </Text>
                <Text style={styles.row}>
                  (5) A publicly traded entity (other than a broker-dealer or an affiliate of a broker-dealer where such broker-dealer is authorized to engage in the public offering of new issues either as a selling group member or underwriter) that:
            </Text>
                <Text style={styles.row}>
                  (A) is listed on a national securities exchange; or
            </Text>
                <Text style={styles.row}>
                  (B) is a foreign issuer whose securities meet the quantitative designation criteria for listing on a national securities exchange;
            </Text>
                <Text style={styles.row}>
                  (6) An investment company organized under the laws of a foreign jurisdiction, provided that:
            </Text>
                <Text style={styles.row}>
                  (A) the investment company is listed on a foreign exchange for sale to the public or authorized for sale to the public by a foreign regulatory authority; and
            </Text>
                <Text style={styles.row}>
                  (B) no person owning more than 5% of the shares of the investment company is a restricted person;
            </Text>
                <Text style={styles.row}>
                  (7) An Employee Retirement Income Security Act benefits plan that is qualified under Section 401(a) of the Internal Revenue Code, provided that such plan is not sponsored solely by a broker-dealer;
            </Text>
                <Text style={styles.row}>
                  (8) A state or municipal government benefits plan that is subject to state and/or municipal regulation;
            </Text>
                <Text style={styles.row}>
                  (9) A tax exempt charitable organization under Section 501(c)(3) of the Internal Revenue Code; or
            </Text>
                <Text style={styles.row}>
                  (10) A church plan under Section 414(e) of the Internal Revenue Code
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (d) Issuer-Directed Securities
            </Text>
                <Text style={styles.row}>
                  The prohibitions on the purchase and sale of new issues in this Rule shall not apply to securities that:
            </Text>
                <Text style={styles.row}>
                  (1) are specifically directed by the issuer to persons that are restricted under the Rule; provided, however, that securities directed by an issuer may not be sold to or purchased by:
            </Text>
                <Text style={styles.row}>
                  (A) a broker-dealer; or
            </Text>
                <Text style={styles.row}>
                  (B) an account in which any restricted person specified in paragraphs (i)(10)(B) or (i)(10)(C) of this Rule has a beneficial interest, unless such person, or a member of his or her immediate family, is an employee or director of the issuer, the issuer's parent, or a subsidiary of the issuer or the issuer's parent. Also, for purposes of this paragraph (d)(1) only, a parent/subsidiary relationship is established if the parent has the right to vote 50% or more of a class of voting security of the subsidiary, or has the power to sell or direct 50% or more of a class of voting security of the subsidiary;
            </Text>
                <Text style={styles.row}>
                  (2) are specifically directed by the issuer and are part of an offering in which no broker-dealer:
            </Text>
                <Text style={styles.row}>
                  (A) underwrites any portion of the offering;
            </Text>
                <Text style={styles.row}>
                  (B) solicits or sells any new issue securities in the offering; and
            </Text>
                <Text style={styles.row}>
                  (C) has any involvement or influence, directly or indirectly, in the issuer's allocation decisions with respect to any of the new issue securities in the offering;
            </Text>
                <Text style={styles.row}>
                  (3) are part of a program sponsored by the issuer or an affiliate of the issuer that meets the following criteria:
            </Text>
                <Text style={styles.row}>
                  (A) the opportunity to purchase a new issue under the program is offered to at least 10,000 participants;
            </Text>
                <Text style={styles.row}>
                  (B) every participant is offered an opportunity to purchase an equivalent number of shares, or will receive a specified number of shares under a predetermined formula applied uniformly across all participants;
            </Text>
                <Text style={styles.row}>
                  (C) if not all participants receive shares under the program, the selection of the participants eligible to purchase shares is based upon a random or other non-discretionary allocation method; and
            </Text>
                <Text style={styles.row}>
                  (D) the class of participants does not contain a disproportionate number of restricted persons as compared to the investing public generally; or
            </Text>
                <Text style={styles.row}>
                  (4) are directed to eligible purchasers who are otherwise restricted under the Rule as part of a conversion offering in accordance with the standards of the governmental agency or instrumentality having authority to regulate such conversion offering.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (e) Anti-Dilution Provisions
            </Text>
                <Text style={styles.row}>
                  The prohibitions on the purchase and sale of new issues in this Rule shall not apply to an account in which a restricted person has a beneficial interest that meets the following conditions:
            </Text>
                <Text style={styles.row}>
                  (1) the account has held an equity ownership interest in the issuer, or a company that has been acquired by the issuer in the past year, for a period of one year prior to the effective date of the offering;
            </Text>
                <Text style={styles.row}>
                  (2) the sale of the new issue to the account shall not increase the account's percentage equity ownership in the issuer above the ownership level as of three months prior to the filing of the registration statement in connection with the offering;
            </Text>
                <Text style={styles.row}>
                  (3) the sale of the new issue to the account shall not include any special terms; and
            </Text>
                <Text style={styles.row}>
                  (4) the new issue purchased pursuant to this paragraph (e) shall not be sold, transferred, assigned, pledged or hypothecated for a period of three months following the effective date of the offering.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (f) Stand-by Purchasers
            </Text>
                <Text style={styles.row}>
                  The prohibitions on the purchase and sale of new issues in this Rule shall not apply to the purchase and sale of securities pursuant to a stand-by agreement that meets the following conditions:
            </Text>
                <Text style={styles.row}>
                  (1) the stand-by agreement is disclosed in the prospectus;
            </Text>
                <Text style={styles.row}>
                  (2) the stand-by agreement is the subject of a formal written agreement;
            </Text>
                <Text style={styles.row}>
                  (3) the managing underwriter(s) represents in writing that it was unable to find any other purchasers for the securities; and
            </Text>
                <Text style={styles.row}>
                  (4) the securities sold pursuant to the stand-by agreement shall not be sold, transferred, assigned, pledged or hypothecated for a period of three months following the effective date of the offering.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (g) Under-Subscribed Offerings
            </Text>
                <Text style={styles.row}>
                  Nothing in this Rule shall prohibit an underwriter, pursuant to an underwriting agreement, from placing a portion of a public offering in its investment account when it is unable to sell that portion to the public.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (h) Exemptive Relief
            </Text>
                <Text style={styles.row}>
                  Pursuant to the Rule 9600 Series, the staff, for good cause shown after taking into consideration all relevant factors, may conditionally or unconditionally exempt any person, security or transaction (or any class or classes of persons, securities or transactions) from this Rule to the extent that such exemption is consistent with the purposes of the Rule, the protection of investors and the public interest.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (i) Definitions
            </Text>
                <Text style={styles.row}>
                  (1) "Beneficial interest" means any economic interest, such as the right to share in gains or losses. The receipt of a management or performance based fee for operating a collective investment account, or other fees for acting in a fiduciary capacity, shall not be considered a beneficial interest in the account.
            </Text>
                <Text style={styles.row}>
                  (2) "Collective investment account" means any hedge fund, investment partnership, investment corporation or any other collective investment vehicle that is engaged primarily in the purchase and/or sale of securities. A "collective investment account" does not include a "family investment vehicle" or an "investment club."
            </Text>
                <Text style={styles.row}>
                  (3) "Conversion offering" means any offering of securities made as part of a plan by which a savings and loan association, insurance company or other organization converts from a mutual to a stock form of ownership.
            </Text>
                <Text style={styles.row}>
                  (4) "Family investment vehicle" means a legal entity that is beneficially owned solely by immediate family members.
            </Text>
                <Text style={styles.row}>
                  (5) "Immediate family member" means a person's parents, mother-in-law or father-in-law, spouse, brother or sister, brother-in-law or sister-in-law, son-in-law or daughter-in-law, and children, and any other individual to whom the person provides material support.
            </Text>
                <Text style={styles.row}>
                  (6) "Investment club" means a group of friends, neighbors, business associates or others that pool their money to invest in stock or other securities and are collectively responsible for making investment decisions.
            </Text>
                <Text style={styles.row}>
                  (7) "Limited business broker-dealer" means any broker-dealer whose authorization to engage in the securities business is limited solely to the purchase and sale of investment company/variable contracts securities and direct participation program securities.
            </Text>
                <Text style={styles.row}>
                  (8) "Material support" means directly or indirectly providing more than 25% of a person's income in the prior calendar year. Members of the immediate family living in the same household are deemed to be providing each other with material support.
            </Text>
                <Text style={styles.row}>
                  (9) "New issue" means any initial public offering of an equity security as defined in Section 3(a)(11) of the Exchange Act, made pursuant to a registration statement or offering circular. New issue shall not include:
            </Text>
                <Text style={styles.row}>
                  (A) offerings made pursuant to an exemption under Section 4(1), 4(2) or 4(6) of the Securities Act, or Securities Act Rule 504 if the securities are "restricted securities" under Securities Act Rule 144(a)(3), or Rule 144A or Rule 505 or Rule 506 adopted thereunder;
            </Text>
                <Text style={styles.row}>
                  (B) offerings of exempted securities as defined in Section 3(a)(12) of the Exchange Act, and rules promulgated thereunder;
            </Text>
                <Text style={styles.row}>
                  (C) offerings of securities of a commodity pool operated by a commodity pool operator as defined under Section 1a(5) of the Commodity Exchange Act;
            </Text>
                <Text style={styles.row}>
                  (D) rights offerings, exchange offers, or offerings made pursuant to a merger or acquisition;
            </Text>
                <Text style={styles.row}>
                  (E) offerings of investment grade asset-backed securities;
            </Text>
                <Text style={styles.row}>
                  (F) offerings of convertible securities;
            </Text>
                <Text style={styles.row}>
                  (G) offerings of preferred securities;
            </Text>
                <Text style={styles.row}>
                  (H) offerings of an investment company registered under the Investment Company Act;
            </Text>
                <Text style={styles.row}>
                  (I) offerings of securities (in ordinary share form or ADRs registered on Form F-6) that have a pre-existing market outside of the United States; and
            </Text>
                <Text style={styles.row}>
                  (J) offerings of a business development company as defined in Section 2(a)(48) of the Investment Company Act, a direct participation program as defined in Rule 2310(a) or a real estate investment trust as defined in Section 856 of the Internal Revenue Code.
            </Text>
                <Text style={styles.row}>
                  (10) "Restricted person" means:
            </Text>
                <Text style={styles.row}>
                  (A) Members or other broker-dealers
            </Text>
                <Text style={styles.row}>
                  (B) Broker-Dealer Personnel
            </Text>
                <Text style={styles.row}>
                  (i) Any officer, director, general partner, associated person or employee of a member or any other broker-dealer (other than a limited business broker-dealer);
            </Text>
                <Text style={styles.row}>
                  (ii) Any agent of a member or any other broker-dealer (other than a limited business broker-dealer) that is engaged in the investment banking or securities business; or
            </Text>
                <Text style={styles.row}>
                  (iii) An immediate family member of a person specified in subparagraph (B)(i) or (ii) if the person specified in subparagraph (B)(i) or (ii):
            </Text>
                <Text style={styles.row}>
                  a. materially supports, or receives material support from, the immediate family member;
            </Text>
                <Text style={styles.row}>
                  b. is employed by or associated with the member, or an affiliate of the member, selling the new issue to the immediate family member; or
            </Text>
                <Text style={styles.row}>
                  c. has an ability to control the allocation of the new issue.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (C) Finders and Fiduciaries
            </Text>
                <Text style={styles.row}>
                  (i) With respect to the security being offered, a finder or any person acting in a fiduciary capacity to the managing underwriter, including, but not limited to, attorneys, accountants and financial consultants; and
            </Text>
                <Text style={styles.row}>
                  (ii) An immediate family member of a person specified in subparagraph (C)(i) if the person specified in subparagraph (C)(i) materially supports, or receives material support from, the immediate family member.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (D) Portfolio Managers
            </Text>
                <Text style={styles.row}>
                  (i) Any person who has authority to buy or sell securities for a bank, savings and loan institution, insurance company, investment company, investment advisor or collective investment account.
            </Text>
                <Text style={styles.row}>
                  (ii) An immediate family member of a person specified in subparagraph (D)(i) that materially supports, or receives material support from, such person.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (E) Persons Owning a Broker-Dealer
            </Text>
                <Text style={styles.row}>
                  (i) Any person listed, or required to be listed, in Schedule A of a Form BD (other than with respect to a limited business broker-dealer), except persons identified by an ownership code of less than 10%;
            </Text>
                <Text style={styles.row}>
                  (ii) Any person listed, or required to be listed, in Schedule B of a Form BD (other than with respect to a limited business broker-dealer), except persons whose listing on Schedule B relates to an ownership interest in a person listed on Schedule A identified by an ownership code of less than 10%;
            </Text>
                <Text style={styles.row}>
                  (iii) Any person listed, or required to be listed, in Schedule C of a Form BD that meets the criteria of subparagraphs (E)(i) and (E)(ii) above;
            </Text>
                <Text style={styles.row}>
                  (iv) Any person that directly or indirectly owns 10% or more of a public reporting company listed, or required to be listed, in Schedule A of a Form BD (other than a reporting company that is listed on a national securities exchange or other than with respect to a limited business broker-dealer);
            </Text>
                <Text style={styles.row}>
                  (v) Any person that directly or indirectly owns 25% or more of a public reporting company listed, or required to be listed, in Schedule B of a Form BD (other than a reporting company that is listed on a national securities exchange or other than with respect to a limited business broker-dealer);
            </Text>
                <Text style={styles.row}>
                  (vi) An immediate family member of a person specified in subparagraphs (E)(i) through (v) unless the person owning the broker-dealer:
            </Text>
                <Text style={styles.row}>
                  a. does not materially support, or receive material support from, the immediate family member;
            </Text>
                <Text style={styles.row}>
                  b. is not an owner of the member, or an affiliate of the member, selling the new issue to the immediate family member; and
            </Text>
                <Text style={styles.row}>
                  c. has no ability to control the allocation of the new issue.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (j) Information Required to be Filed
            </Text>
                <Text style={styles.row}>
                  The book-running managing underwriter of a new issue shall be required to file the following information in the time and manner specified by FINRA with respect to new issues:
            </Text>
                <Text style={styles.row}>
                  (1) the initial list of distribution participants and their underwriting commitment and retention amounts on or before the offering date; and
            </Text>
                <Text style={styles.row}>
                  (2) the final list of distribution participants and their underwriting commitment and retention amounts no later than three business days after the offering date.
            </Text>

                <Text style={styles.header}>
                  5131. New Issue Allocations and Distributions
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (a) Quid Pro Quo Allocations
            </Text>
                <Text style={styles.row}>
                  No member or person associated with a member may offer or threaten to withhold shares it allocates of a new issue as consideration or inducement for the receipt of compensation that is excessive in relation to the services provided by the member.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (b) Spinning
            </Text>
                <Text style={styles.row}>
                  (1) No member or person associated with a member may allocate shares of a new issue to any account in which an executive officer or director of a public company or a covered non-public company, or a person materially supported by such executive officer or director, has a beneficial interest:
            </Text>
                <Text style={styles.row}>
                  (A) if the company is currently an investment banking services client of the member or the member has received compensation from the company for investment banking services in the past 12 months;
            </Text>
                <Text style={styles.row}>
                  (B) if the person responsible for making the allocation decision knows or has reason to know that the member intends to provide, or expects to be retained by the company for, investment banking services within the next 3 months; or
            </Text>
                <Text style={styles.row}>
                  (C) on the express or implied condition that such executive officer or director, on behalf of the company, will retain the member for the performance of future investment banking services.
            </Text>
                <Text style={styles.row}>
                  (2) The prohibitions in this paragraph shall not apply to allocations of shares of a new issue to any account described in Rule 5130(c)(1) through (3) and (5) through (10), or to any other account in which the beneficial interests of executive officers and directors of the company and persons materially supported by such executive officers and directors in the aggregate do not exceed 25% of such account.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (c) Policies Concerning Flipping
            </Text>
                <Text style={styles.row}>
                  (1) No member or person associated with a member may directly or indirectly recoup, or attempt to recoup, any portion of a commission or credit paid or awarded to an associated person for selling shares of a new issue that are subsequently flipped by a customer, unless the managing underwriter has assessed a penalty bid on the entire syndicate.
            </Text>
                <Text style={styles.row}>
                  (2) In addition to any obligation to maintain records relating to penalty bids under SEA Rule 17a-2(c)(1), a member shall promptly record and maintain information regarding any penalties or disincentives assessed on its associated persons in connection with a penalty bid.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (d) New Issue Pricing and Trading Practices
            </Text>
                <Text style={styles.row}>
                  In a new issue:
            </Text>
                <Text style={styles.row}>
                  (1) Reports of Indications of Interest and Final Allocations. The book-running lead manager must provide to the issuer's pricing committee (or, if the issuer has no pricing committee, its board of directors):
            </Text>
                <Text style={styles.row}>
                  (A) a regular report of indications of interest, including the names of interested institutional investors and the number of shares indicated by each, as reflected in the book-running lead manager's book of potential institutional orders, and a report of aggregate demand from retail investors;
            </Text>
                <Text style={styles.row}>
                  (B) after the settlement date of the new issue, a report of the final allocation of shares to institutional investors as reflected in the books and records of the book-running lead manager including the names of purchasers and the number of shares purchased by each, and aggregate sales to retail investors;
            </Text>
                <Text style={styles.row}>
                  (2) Lock-Up Agreements. Any lock-up agreement or other restriction on the transfer of the issuer's shares by officers and directors of the issuer entered into in connection with a new issue shall provide that:
            </Text>
                <Text style={styles.row}>
                  (A) Any lock-up agreement or other restriction on the transfer of the issuer's shares by officers and directors of the issuer shall provide that such restrictions will apply to their issuer-directed shares; and
            </Text>
                <Text style={styles.row}>
                  (B) At least two business days before the release or waiver of any lock-up or other restriction on the transfer of the issuer's shares, the book-running lead manager will notify the issuer of the impending release or waiver and announce the impending release or waiver through a major news service, except where the release or waiver is effected solely to permit a transfer of securities that is not for consideration and where the transferee has agreed in writing to be bound by the same lock-up agreement terms in place for the transferor;
            </Text>
                <Text style={styles.row}>
                  (3) Agreement Among Underwriters. The agreement between the book-running lead manager and other syndicate members must require, to the extent not inconsistent with SEC Regulation M, that any shares trading at a premium to the public offering price that are returned by a purchaser to a syndicate member after secondary market trading commences:
            </Text>
                <Text style={styles.row}>
                  (A) be used to offset the existing syndicate short position, or
            </Text>
                <Text style={styles.row}>
                  (B) if no syndicate short position exists, the member must either:
            </Text>
                <Text style={styles.row}>
                  (i) offer returned shares at the public offering price to unfilled customers' orders pursuant to a random allocation methodology, or
            </Text>
                <Text style={styles.row}>
                  (ii) sell returned shares on the secondary market and donate profits from the sale to an unaffiliated charitable organization with the condition that the donation be treated as an anonymous donation to avoid any reputational benefit to the member.
            </Text>
                <Text style={styles.row}>
                  (4) Market Orders. No member may accept a market order for the purchase of shares of a new issue in the secondary market prior to the commencement of trading of such shares in the secondary market.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (e) Definitions
            </Text>
                <Text style={styles.row}>
                  For purposes of this Rule, the following terms shall have the meanings stated below.
            </Text>
                <Text style={styles.row}>
                  (1) A "public company" is any company that is registered under Section 12 of the Exchange Act or files periodic reports pursuant to Section 15(d) thereof.
            </Text>
                <Text style={styles.row}>
                  (2) "Beneficial interest" shall have the same meaning as in FINRA Rule 5130(i)(1).
            </Text>
                <Text style={styles.row}>
                  (3) "Covered non-public company" means any non-public company satisfying the following criteria: (i) income of at least $1 million in the last fiscal year or in two of the last three fiscal years and shareholders' equity of at least $15 million; (ii) shareholders' equity of at least $30 million and a two-year operating history; or (iii) total assets and total revenue of at least $75 million in the latest fiscal year or in two of the last three fiscal years.
            </Text>
                <Text style={styles.row}>
                  (4) "Flipped" means the initial sale of new issue shares purchased in an offering within 30 days following the offering date of such offering.
            </Text>
                <Text style={styles.row}>
                  (5) "Investment banking services" include, without limitation, acting as an underwriter, participating in a selling group in an offering for the issuer or otherwise acting in furtherance of a public offering of the issuer; acting as a financial adviser in a merger, acquisition or other corporate reorganization; providing venture capital, equity lines of credit, private investment, public equity transactions (PIPEs) or similar investments or otherwise acting in furtherance of a private offering of the issuer; or serving as placement agent for the issuer.
            </Text>
                <Text style={styles.row}>
                  (6) "Material support" means directly or indirectly providing more than 25% of a person's income in the prior calendar year. Persons living in the same household are deemed to be providing each other with material support.
            </Text>
                <Text style={styles.row}>
                  (7) "New issue" shall have the same meaning as in Rule 5130(i)(9).
            </Text>
                <Text style={styles.row}>
                  (8) "Penalty bid" means an arrangement that permits the managing underwriter to reclaim a selling concession from a syndicate member in connection with an offering when the securities originally sold by the syndicate member are purchased in syndicate covering transactions.
            </Text>
                <Text style={styles.row}>
                  (9) "Unaffiliated charitable organization" is a tax-exempt entity organized under Section 501(c)(3) of the Internal Revenue Code that is not affiliated with the member and for which no executive officer or director of the member, or person materially supported by such executive officer or director, is an individual listed or required to be listed on Part VII of Internal Revenue Service Form 990 (i.e., officers, directors, trustees, key employees, highest compensated employees and certain independent contractors).
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  (f) Exemptive Relief
            </Text>
                <Text style={styles.row}>
                  Pursuant to the Rule 9600 Series, FINRA may in exceptional and unusual circumstances, taking into consideration all relevant factors, exempt a person unconditionally or on specified terms from any or all of the provisions of this Rule that it deems appropriate consistent with the protection of investors and the public interest.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  Supplementary Material:
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  .01 Issuer Directed Allocations.
            </Text>
                <Text style={styles.row}>
                  The prohibitions of paragraph (b) above shall not apply to allocations of securities that are directed in writing by the issuer, its affiliates, or selling shareholders, so long as the member has no involvement or influence, directly or indirectly, in the allocation decisions of the issuer, its affiliates, or selling shareholders with respect to such issuer-directed securities.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  .02 Written Representations.
            </Text>
                <Text style={styles.row}>
                  (a) Annual Representation. For the purposes of Rule 5131(b), a member may rely upon a written representation obtained within the prior 12 months from the beneficial owner(s) of the account, or a person authorized to represent the beneficial owner(s) of the account, as to whether such beneficial owner(s) is an executive officer or director or person materially supported by an executive officer or director and if so, the company(ies) on whose behalf such executive officer or director serves.
            </Text>
                <Text style={styles.row}>
                  (b) Indirect Beneficial Owners. For the purposes of Rule 5131(b), a member may rely upon a written representation obtained within the prior 12 months from a person authorized to represent an account that does not look through to the beneficial owners of any unaffiliated private fund invested in the account, except for beneficial owners that are control persons of the investment adviser to such private fund, that such unaffiliated private fund:
            </Text>
                <Text style={styles.row}>
                  (1) is managed by an investment adviser;
            </Text>
                <Text style={styles.row}>
                  (2) has assets greater than $50 million;
            </Text>
                <Text style={styles.row}>
                  (3) owns less than 25% of the account and is not a fund in which a single investor has a beneficial interest of 25% or more; and
            </Text>
                <Text style={styles.row}>
                  (4) was not formed for the specific purpose of investing in the account.
            </Text>
                <Text style={styles.row}>
                  An unaffiliated private fund is a “private fund,” as defined in Section 202(a)(29) of the Investment Advisers Act, whose investment adviser does not have a control person in common with the investment adviser to the account. A control person of an investment adviser is a person with direct or indirect “control” over the investment adviser, as that term is defined in Form ADV.
            </Text>
                <Text style={styles.row}>
                  (c) A member may not rely upon any representation that it believes, or has reason to believe, is inaccurate. A member shall maintain a copy of all records and information relating to whether an account is eligible to receive an allocation of the new issue under Rule 5131(b) in its files for at least three years following the member's allocation to that account.
            </Text>
                <Text style={[styles.row, styles.subHeader]}>
                  .03 Lock-up Announcements.
            </Text>
                <Text style={styles.row}>
                  For the purposes of this Rule, the requirement that the book-running lead manager announce the impending release or waiver of a lock-up or other restriction on the transfer of the issuer's shares shall be deemed satisfied where such announcement is made by the book-running lead manager, another member or the issuer, so long as such announcement otherwise complies with the requirements of paragraph (d)(2) of this Rule.
            </Text>



              </View>
            </ScrollView>
            <Text style={Styles.TextStyle}>Restricted persons under FINRA rule 5130 and 5131 are not allowed to purchase new issues.</Text>
          </View>
          <View style={Styles.ParentView3}>
            <View style={Styles.ParentView4}>
              <View style={Styles.ParentView5}>
                <View style={Styles.ParentView6}>
                  <Checkbox ref='agreeCheckbox' label='' checked={this.state.agree} onChange={() => this.setState({ agree: !this.state.agree })} />
                </View>
                <View style={Styles.ParentView7}>
                  <Text style={Styles.ParentView8}>I affirm that I have read and understand the prohibitions of Rules 5130 and 5131, and I attest that I am not a “restricted person” pursuant to the Rules.</Text>
                </View>
              </View>
              <View style={Styles.ParentView9}>
                <View style={Styles.ParentView10}>
                  <Checkbox ref='restrictedCheckbox' label='' checked={this.state.restricted} onChange={() => this.setState({ restricted: !this.state.restricted })} />
                </View>
                <View style={Styles.ParentView7}>
                  <Text style={Styles.ParentView8}>I hereby give permission to my connected brokerage firm to grant Click IPO access to my brokerage account information.         
                    <Text style={{ color: 'blue' }}
                      onPress={() => this.handlePressLearnMore()}>
                         {' '}Learn more.
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={Styles.ParentView11}>
              <FullButton
                ref='notRestricted'
                text='Confirm'
                disabled={(this.state.restricted == false && this.state.agree == false) || (this.state.restricted == true && this.state.agree == false) || (this.state.restricted == false && this.state.agree == true)}
                onPress={this.handlePressConfirm}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  row: {
    marginBottom: 12
  },
  header: {
    fontSize: 20,
    marginBottom: 12
  },
  subHeader: {
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12
  }
})


RestrictedPersonView.propTypes = {
  user: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    restrictedPerson: (data) => dispatch(UserActions.restrictedPerson(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestrictedPersonView)