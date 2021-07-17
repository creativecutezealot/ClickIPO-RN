import SocialProviderFacebook from './SocialProviderFacebook'
import SocialProviderTwitter from './SocialProviderTwitter'
import SocialProviderStocktwits from './SocialProviderStocktwits'

import Logger from '../Lib/Logger'
// our "constructor"
const create = () => {
  const facebook = new SocialProviderFacebook()

  const twitter = new SocialProviderTwitter()

  const stocktwits = new SocialProviderStocktwits()

  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  return {
    facebook,
    twitter,
    stocktwits,
  }
}

// let's return back our create method as the default.
export default {
  create
}
