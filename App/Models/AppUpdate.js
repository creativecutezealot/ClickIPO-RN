import { findByProp } from 'ramdasauce'

import Logger from '../Lib/Logger'

class AppUpdate {
  sysId: String
  sysValue: String
  sysReadableVersion: String
  sysPlatform: String
  sysImage: String
  sysTitle: String
  sysDescription: String
  sysActionText: String
  sysActionSecondaryText: String
  sysIsUpdateRequired: Boolean
  sysIsDisplayRequired: Boolean
  sysAppUrl: String

  // broker

  // constructor () {
  // }

  
  static fromJson = (json) => {
    // Logger.log({ function: 'AppUpdate.fromJson', json: json })

    var retval: AppUpdate = new AppUpdate()
    // retval.sysId = json.sys_id // remove
    retval.sysValue = json.sys_value 
    // retval.sysReadableVersion = json.sys_readable_version // remove
    // retval.sysPlatform = json.sys_platform // remove
    retval.sysImage = json.sys_image
    retval.sysTitle = json.sys_title
    retval.sysDescription = json.sys_description
    retval.sysActionText = json.sys_action_text
    retval.sysActionSecondaryText = json.sys_action_secondary_text
    retval.sysIsUpdateRequired = json.sys_is_update_required
    retval.sysIsDisplayRequired = json.sys_is_display_required
    retval.sysAppUrl = json.sys_app_url

    return retval
  }
}

export default AppUpdate
