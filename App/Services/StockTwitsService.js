import axios from 'axios'
import Logger from '../Lib/Logger'
import { Actions as NavigationActions } from 'react-native-router-flux'

export const stockTwitsPost = (data) => {
    const message = 'body=' + data.message
    axios.post('https://api.stocktwits.com/api/2/messages/create.json?access_token=' + data.token, message)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        return error
      });
  }

export const stockTwitsAuth = () => {
    NavigationActions.genericWebView({url : 'https://api.stocktwits.com/api/2/oauth/authorize?client_id=cf23cd08f41cc9e6&response_type=token&redirect_uri=https://clickipo.com/redirect&scope=read,watch_lists,publish_messages,publish_watch_lists,follow_users,follow_stocks'})
  }