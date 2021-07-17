// Utility functions
import { Platform } from 'react-native'
import R from 'ramda'

import orderBy from 'lodash/orderBy'
import reject from 'lodash/reject'
import _ from 'lodash'

import URLSearchParams from 'url-search-params'

import Moment from 'moment'

import {
  User,
  Offering,
  Order,
  Filter,
  Sorter
} from '../Models'

// useful cleaning functions
const nullToEmpty = R.defaultTo('')
const replaceEscapedCRLF = R.replace(/\\n/g)
const nullifyNewlines = R.compose(replaceEscapedCRLF(' '), nullToEmpty)

import Logger from '../Lib/Logger'

// Correct Map URIs
export const locationURL = (address: String) => {
  let cleanAddress = nullifyNewlines(address)
  // https://developer.apple.com/library/ios/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  let url = `http://maps.apple.com/?address=${cleanAddress}`
  // https://developers.google.com/maps/documentation/ios-sdk/urlscheme
  if (Platform.OS === 'android') url = `http://maps.google.com/?q=${cleanAddress}`

  return url
}

export const directionsURL = (address: String) => {
  let cleanAddress = nullifyNewlines(address)
  // https://developer.apple.com/library/ios/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  let url = `http://maps.apple.com/?daddr=${cleanAddress}&dirflg=d`
  // https://developers.google.com/maps/documentation/ios-sdk/urlscheme
  if (Platform.OS === 'android') url = `http://maps.google.com/?daddr=${cleanAddress}`

  return url
}

export const numberWithCommas = (number: Number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const canPlaceOrder = (user: User, offering: Offering) => {
  // this is a boolean
  return offering.acceptingOrders
  // var retval = false

  // //if (/*offering.participate && offering.acceptingOrders*/true) {
  // // if (offering.participate && offering.acceptingOrders) {
  // if (offering.acceptingOrders) {
  //   retval = true
  // }

  // return retval
}

export const filterOfferings = (offerings: Array<Offering>, searchTerm: String, filters: Array<Filter>, industries) => {
  // Logger.log({ name: 'Utilities.filterOfferings()', offerings: offerings, searchTerm: searchTerm, filters: filters })

  var retval = offerings
  var newarray=[];

  if (retval.length > 0) {
    // reduce offering based on searchTerm
    if (searchTerm && searchTerm.length > 0) {
      retval = retval.filter((el) => {
        return ( (Moment(Moment().format("YYYY-MM-DD")).isSameOrBefore(el.sortableDate) || (el.sortableDate === null))  && ((el.name && el.name.toLowerCase().includes(searchTerm.toLowerCase())) || (el.tickerSymbol && el.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))))
      })
    } else {
      retval = retval.filter((el) => {
        return (Moment(Moment().format("YYYY-MM-DD")).isSameOrBefore(el.sortableDate) || (el.sortableDate === null))
      })
    }
    
    if (filters && filters.length > 1) {
      var checkCount=0;
      filters.map((filter) => {
        if (filter.enabled) {
          checkCount=1;
          if(filter.label=='IPO'){
            retval.filter((item) => item.offeringTypeName == 'IPO').map((data) => {
              newarray.push(data);
            });
          }
          if(filter.label=='Marketed secondary'){
            retval.filter((item) => item.offeringTypeName == 'Secondary').map((data) => {
              newarray.push(data);
            });
          }
          if (filter.label == 'Follow-On Overnight') {
            retval.filter((item) => item.offeringTypeName == 'Follow-On Overnight').map((data) => {
            // retval.filter((item) => item.offeringTypeName == 'Spot').map((data) => {
              newarray.push(data);
            });
          }

          // if (filter.label == 'Marketed secondary') {
          //   retval.filter((item) => item.offeringTypeName == 'Block').map((data) => {
          //     newarray.push(data);
          //   });
          // }

          // else if(filter.label=='Cancelled'){
          //   retval.filter((item) => item.status == 'cancelled').map((data) => {
          //     newarray.push(data);
          //   });
          // }else if(filter.label=='Closed'){
          //   retval.filter((item) => item.status == 'closed').map((data) => {
          //     newarray.push(data);
          //   });
          // }else if(filter.label=='Pending'){
          //   retval.filter((item) => item.status == 'active').map((data) => {
          //     newarray.push(data);
          //   });
          // }
        }
      })
      if(checkCount==1){
        retval = newarray;
      }else if(checkCount==0){
        retval = [];
      }
    }

    if(industries && industries.length>0){
      let indusItemCount = 0;
      let industryFilteredArray = [];
      industries.map((industry) => {
        retval.filter((item) =>  item.industries[0].name == industry).map((data) => {
          indusItemCount = 1;
          industryFilteredArray.push(data);
        });
      });

      if(industryFilteredArray.length==0){
        retval = [];
      }else{
        retval = industryFilteredArray;
      }
    }

  }

  return retval
}



export const sortOfferings = (offerings: Array<Order>, sorters:Array<Sorter>) => {
  var retval = []


  var sorter = _.filter(sorters, function(sorter) { return sorter.acceptingOrders === true})

  
  // if (sorter){

  // } else {
  //   sorter[0] = sorters[0]
  // }

  
  // if((offerings && offerings.length > 0) && offerings[0].status === 'closed') {
  //   var order = 'desc'
  // } else {
  //   var order = 'asc'
  // }
  var orderbycheck = "asc"
  if (offerings && offerings.length > 0) {
    // if(sorter[0] && sorter[0].sorterPredicate){
    //   retval = orderBy(offerings, ['acceptingOrders', 'Anticiapted effective date'], [ false, 'desc'])
    // } else {
    //   retval = _.orderBy(offerings, ['acceptingOrders', 'sortableDate'], ['desc', 'asc'])
    // }
    let type = {};
    sorters.forEach(item => {
      if(item.enabled==true){
        if(item.label=="Accepting Orders"){
          orderbycheck = "desc"
        }
        type = item;
      }
    });

    retval = _.orderBy(offerings, type.sorterPredicate, orderbycheck);
  }
  return retval
}


export const filterOrder = (Orders: Array<Orders>, searchTerm: String, filters: Array<Filter>) => {
  // Logger.log({ name: 'Utilities.filterOfferings()', offerings: offerings, searchTerm: searchTerm, filters: filters })

  var retval = Orders
  var newarray=[];

  if (retval.length > 0) {
    //reduce offering based on searchTerm
    if (searchTerm && searchTerm.length > 0) {
      retval = retval.filter((el) => {
        return ( (Moment(Moment().format("YYYY-MM-DD")).isSameOrBefore(el.sortableDate) || (el.sortableDate === null))  && ((el.name && el.name.toLowerCase().includes(searchTerm.toLowerCase())) || (el.tickerSymbol && el.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))))
      })
    } else {
      retval = retval.filter((el) => {
        return (Moment(Moment().format("YYYY-MM-DD")).isSameOrBefore(el.sortableDate) || (el.sortableDate === null))
      })
    }
    
    if (filters && filters.length > 0) {
      var checkCount=0;
      filters.map((filter) => {
        if (filter.enabled) {
          checkCount=1;
          if(filter.label=='Cancelled'){
            retval.filter((item) => item.status == 'cancelled').map((data) => {
              newarray.push(data);
            });
          }
          if(filter.label=='Closed'){
            retval.filter((item) => item.status == 'closed').map((data) => {
              newarray.push(data);
            });
          }
          if(filter.label=='Pending'){
            retval.filter((item) => item.status == 'active').map((data) => {
              newarray.push(data);
            });
          }
        }
      })
      if(checkCount=1){
        retval = newarray;
      }else if(checkCount=0){
        retval = [];
      }
    }
  }

  return retval
}

export const sortOrders = (orders: Array<Order>, sorters:Array<Sorter>) => {
  var retval = [];

  var sorter = _.filter(sorters, function(sorter) { return sorter.acceptingOrders === true})
  if (orders && orders.length > 0) {
    let type = {};
    var orderbycheck = "asc"
    sorters.forEach(item => {
      if(item.enabled==true){
        if(item.label=="Highest Requested Amount" || item.label=="Date By Descending" ){
          orderbycheck = "desc"
        }
        type = item;
      }
    });

    retval = _.orderBy(orders, type.sorterPredicate, orderbycheck, );
  }
  return retval
}

export function omit(keys, params) {
  return keys.reduce((acc, key) => {
    delete acc[key]; // eslint-disable-line no-param-reassign, fp/no-delete
    return acc;
  }, {...params});
}

export function query(params, sort = false, w3c = false) {
  const entries = sort ? Object.entries(params).sort() : Object.entries(params);
  return w3c ?
    entries
      .reduce((acc, [k, v]) => {
        acc.set(k, v);
        return acc;
      }, new URLSearchParams())
      .toString() :
    entries
      .map(([k, v]) => `${rfc3986(k)}=${rfc3986(v)}`)
      .join('&');
}

export function replacePathParams(path, params) {
  const replacedParamKeys = [];
  const replacedPath = path.replace(/:(.+?)(?=\/|$)/g, (_, p1) => {
    if (!params[p1]) {
      return `:${p1}`;
    }
    replacedParamKeys.push(p1);
    return rfc3986(params[p1] || `:${p1}`);
  });
  return {replacedPath, replacedParamKeys};
}

export function rfc3986(str) {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`.toUpperCase());
}

export function parseUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url.split('?')[1]

  // we'll store the parameters here
  var params = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // if parameter name already exists
      if (params[paramName]) {
        // convert value to array (if still string)
        if (typeof params[paramName] === 'string') {
          params[paramName] = [params[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          params[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          params[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        params[paramName] = paramValue;
      }
    }
  }

  return params;
}
// Add by Burhan
export function dateFormat(offerings: Array<Offering>) {
  let date = {offerings};
    var monthNames = [
      'Jun', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec',
    ];
    let splitTimeDate = date.offerings.split(' ')
    let splitDate = splitTimeDate[0].split('-')
    let day = splitDate[2];
    let monthIndex = splitDate[1];
    return monthNames[monthIndex - 1] + ' ' + day;
}

export function dateFormatDetails(offerings: Array<Offering>) {
  let date = {offerings};
  var monthNames = [
    'Jun', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec',
  ];
  let splitTimeDate = date.offerings.split(' ')
  let splitDate = splitTimeDate[0].split('-')
  let day = splitDate[2];
  let monthIndex = splitDate[1];
  let year = splitDate[0];
  return  monthNames[monthIndex - 1] + ' ' + day + ', ' + year;
}