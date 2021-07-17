import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
  Images
} from '../../Themes'

export const sectionedMultiSelectStyles = StyleSheet.create({ 
  button:{backgroundColor:'rgba(66,173,55,1)'},
  cancelButton:{backgroundColor:'rgba(66,173,55,1)'},
  searchBar: {height:42}, 
  
});

export default StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'column',
    position:"absolute",
    left: 0,
    top: 0,
    right:0,
    bottom:0,
    zIndex:2,
    backgroundColor: "rgba(0,0,0,.4)"
  },
  dropDownContainer: {
    width: 250,
    backgroundColor:'white',
    bottom: 0,
    right:0,
    top:0,
    position:'absolute',
    marginTop: 175
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 25,
    paddingRight: 25,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0)',
    borderBottomColor: Colors.smoke2
  },
  row: {
    flexDirection:'row',
  },
  filterSection:{
    flex: 4
  },
  filterIcon:{ flex: 1 
  },
  listItem: {
    backgroundColor:Colors.tealishTint
  },
  dropDownTab: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    borderBottomColor: Colors.smoke2
  },
  icon: {
    fontSize:16,
    color: Colors.tealishLite
  },
  text: {
    flex:3,
    fontSize: 14,
    fontWeight: 'bold'
  },
  textHeader: {
    fontSize: 14,
    fontWeight: '600'
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  clearAll: {
    color: Colors.twilightBlue,
    textAlign: 'right',
    fontSize: 14
  },
  clearAllTouchable: {
    paddingTop: 15,
    paddingBottom: 15
  },
  tooltip: {
    width: 0,
    height: 0,
    top: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    alignSelf: 'flex-end',
    marginRight: 15,
    borderRightWidth: 10,
    borderBottomWidth: 12,
    borderLeftWidth: 10,
    left: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.tealishLite,
    borderLeftColor: 'transparent'
  },
  filterPerentView:{
    backgroundColor: Colors.white,
     height: '100%',
     marginTop: 50
  },
  filterLinearGradeantView:{
    width:'70%',height:40,
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:8,
    backgroundColor:'rgba(66,173,55,1)'
  },
  filterApplyText:{
    textAlign:'center',
    color:'#fff',
    fontSize:18,
  }, 
  tooltipContainer: {

  },
  enabledFiltersText:{
    fontSize: 12, 
    color: Colors.lightGrey
  },
})
