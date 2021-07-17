import React from 'react'
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'

import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import { ApplicationStyles } from '../Themes';
import LinearGradient from 'react-native-linear-gradient';

import Accordion from 'react-native-collapsible/Accordion'

// Styles
import {
  Colors,
  Fonts,
  Images
} from '../Themes'

import firebase from '../Config/FirebaseConfig'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Fonts/selection.json';
const ClickIcon = createIconSetFromIcoMoon(icoMoonConfig);
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import styles, { sectionedMultiSelectStyles } from './Styles/FilterViewStyle'

import Logger from '../Lib/Logger'

export default class FilterView extends React.Component {
  state: {

  }

  constructor(props) {
    super(props)
    // Logger.log({ name: 'FilterView.constructor()', props: props })

    this.state = {
      selectedItems: [],
      industries: [],
      filterTitle: props.filterTitle
    }
  }


  componentWillMount = () => {
    if (this.props.industries) {
      this.setState({
        selectedItems: this.props.selectedIndustry,
        industries: this.props.industries
      })
    }
  }

  componentWillReceiveProps = (newProps) => {

    // Logger.log({ name: 'FilterView.componentWillReceiveProps()', newProps: newProps })
  }

  filterCategories = () => {
    const filterCategories = uniqBy(this.props.filters, 'category').map((el) => el.category)

    return filterCategories
  }

  sorterCategories = () => {
    const sorterCategories = uniqBy(this.props.sorters, 'category').map((el) => el.category)

    return sorterCategories
  }


  modifiedFilters = () => {
    const modifiedFilters = filter(this.props.filters, (el) => { return el.isModified() })

    return modifiedFilters
  }

  modifiedSorters = () => {
    const modifiedSorters = filter(this.props.sorters, (el) => { return el.isModified() })

    return modifiedSorters
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems: selectedItems }, () => {
      this.props.onIndustryChange(this.state.selectedItems);
    });
  }

  toggleFilter = (filter) => {

    let filtercheck = 0;

    this.props.filters.map((el) => {
      if (el.enabled == true) {
        if (filter === el) {
        } else {
          filtercheck = 1;
        }
      }
    });

    if (filtercheck == 0) {
      alert("You must need to check atleast 1 filter option");
      return false;
    }

    const filters = this.props.filters.map((el) => {
      // Logger.log({ name: 'FilterView.toggleFilter()', filter: filter, el: el, equal: (filter === el) })
      if (filter === el) {
        el.enabled = !el.enabled
      }

      return el
    })
    // Logger.log({ name: 'FilterView.toggleFilter()', filters: filters })
    if (filter.enabled !== filter.enabledDefault) {
      firebase.analytics().logEvent('filter_enabled', { label: filter.label });
    }

    this.props.onFilterChange(filters)
  }

  toggleSorter = (sorter) => {

    const sorters = this.props.sorters.map((el) => {
      // Logger.log({ name: 'FilterView.toggleFilter()', filter: filter, el: el, equal: (filter === el) })
      if (sorter === el) {
        el.enabled = !el.enabled
      } else {
        el.enabled = false
      }
      return el
    })

    // Logger.log({ name: 'FilterView.toggleFilter()', filters: filters })
    if (sorter.enabled !== sorter.enabledDefault) {
      firebase.analytics().logEvent('sorting_enabled', { label: sorter.label });
    }

    this.props.onSorterChange(sorters)
  }



  resetFilters = () => {
    // Logger.log({ name: 'FilterView.resetFilters()', props: this.props })

    const filters = this.props.filters.map((el) => { el.reset(); return el; })
    this.SectionedMultiSelect._removeAllItems();
    //const sorters = this.props.sorters.map((el) => { el.reset(); return el; })

    // Logger.log({ name: 'FilterView.resetFilters()', filters: filters })

    this.props.onFilterChange(filters)
    //this.props.onSorterChange(filters)
  }
  doFilter() {
    this.props.handleFilterPress(this.props)
  }

  render() {
    const { selectedItems } = this.state;
    return (

      <View style={styles.filterPerentView}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={{ marginLeft: 18, fontWeight: 'bold' }}>
            {this.state.filterTitle}
          </Text>

          <View style={[styles.section, styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[styles.header, { fontSize: 12, fontWeight: 'bold', color: Colors.blueSteel }]}>SORT BY:</Text>
            <TouchableOpacity style={[styles.clearAllTouchable]}
              onPress={() => this.props.handleFilterPress(this.props)}>
              <ClickIcon name='icon-x'
                size={24}
                color={Colors.booger}
              />
            </TouchableOpacity>
          </View>

          {this.renderSorters()}

          <View style={[styles.section, styles.row], {height: 1, backgroundColor:'#EBEBEB', marginVertical:16}}>
            
          </View>

        <View style={[styles.section, styles.row, { justifyContent: 'space-between' }]}>
          <Text style={[styles.header, { fontSize: 12, fontWeight: 'bold', color: Colors.blueSteel }]}>FILTER BY:</Text>
          {this.renderClearAll()}
        </View>

        {(this.state.industries.length > 0) &&

          <View style={{ marginLeft: 18 }}>

            <SectionedMultiSelect
              ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
              items={this.state.industries}
              uniqueKey='name'
              iconKey='icon'
              selectText='Choose industry'
              showDropDowns={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={selectedItems}
              searchPlaceholderText='Search industry'
              showCancelButton={true}
              onCancel={() => this.SectionedMultiSelect._removeAllItems()}
              cancelButtonText='Cancel'
              onConfirm={() => this.setState({ visibleModal: 1 })}
              styles={sectionedMultiSelectStyles}
            />

          </View>
        }

        {this.renderFilters()}

        <View style={[styles.section, styles.row]}>

        </View>

        <TouchableOpacity onPress={() => this.doFilter()}>
          <View style={styles.filterLinearGradeantView}>
            <LinearGradient
              colors={['rgba(183,225,67,1)', 'rgba(66,173,55,1)']}
            // start={styles.LinearGradientStart}
            // end={styles.LinearGradientEnd}
            >

              <Text style={styles.filterApplyText}>Apply</Text>

            </LinearGradient>
          </View>
        </TouchableOpacity>


          </ScrollView>
        </View >
       
    )
  }

  renderClearAll() {
    // Logger.log({ name: 'FilterView.renderClearAll()', props: this.props })

    if (this.modifiedFilters().length > 0) {
      return (
        <TouchableOpacity style={[styles.clearAllTouchable]} onPress={this.resetFilters}>
          <Text style={[styles.clearAll]}>Clear All</Text>
        </TouchableOpacity>
      )
    }
  }

  renderFilters = () => {

    const filterCategories = this.filterCategories()
    const filterSections = filterCategories.map((el) => { return { label: el, filters: filter(this.props.filters, (filter) => { return filter.category === el }) } })

    var filterContent = [];

    for (let i = 0; i < filterSections.length; i++) {
      filterContent.push(this.renderFilterContent(filterSections[i]))
    }

    return filterContent

  }

  renderSorters = () => {


    const sorterCategories = this.sorterCategories()

    const sorterSections = sorterCategories.map((el) => { return { label: el, sorters: filter(this.props.sorters, (sorter) => { return sorter.category === el }) } })
    // Logger.log({ name: 'FilterView.renderCategories()', filterCategories: filterCategories, sections: sections })

    var sorterContent = [];

    for (let i = 0; i < sorterSections.length; i++) {
      sorterContent.push(this.renderSorterContent(sorterSections[i]))
    }

    return sorterContent

  }

  renderSectionHeader = (section, index, isActive) => {
    // Logger.log({ name: 'FilterView.renderSectionHeader()', section: section, index: index, isActive: isActive })

    const enabledFilters = filter(section.filters, (el) => el.enabled).map((el) => el.label).join(', ')
    // Logger.log({ name: 'FilterView.renderSectionHeader()', enabledFilters: enabledFilters })

    return (
      <View style={[styles.section]}>
        <View style={styles.filterSection}>
          <View style={[styles.row,]}>
            <Text style={styles.textHeader}>{section.label}</Text>
          </View>

          <View style={[{ alignSelf: 'flex-start' }]}>
            <Text style={styles.enabledFiltersText} ellipsizeMode={'tail'} numberOfLines={1}>{enabledFilters}</Text>
          </View>
        </View>
        <View style={styles.filterIcon}>
          <View style={[styles.row, { justifyContent: 'flex-end' }]}>
            <ClickIcon style={[styles.icon]} name={(isActive) ? 'icon-chevron-up' : 'icon-chevron-down'} />
          </View>
        </View>
      </View>
    )
  }

  renderSectionContent = (section, index, isActive) => {
    // Logger.log({ name: 'FilterView.renderSectionContent()', section: section, index: index, isActive: isActive })

    return section.filters.map((filter) => {
      return (
        <TouchableOpacity key={section.label + '-' + filter.label} style={[styles.section, styles.row]} onPress={this.toggleFilter.bind(this, filter)}>
          <ClickIcon style={[styles.icon, { color: Colors.booger }]} name={(filter.enabled) ? 'icon-box-checked' : 'icon-box'} />
          <Text style={[styles.text],{marginLeft: 10, color:Colors.booger}}>{filter.label}</Text>
        </TouchableOpacity >
      )
  })
}

renderFilterContent = (section) => {
  // Logger.log({ name: 'FilterView.renderSectionContent()', section: section, index: index, isActive: isActive })

  return section.filters.map((filter) => {
    return (
      <TouchableOpacity key={section.label + '-' + filter.label} style={[styles.section, styles.row]} onPress={this.toggleFilter.bind(this, filter)}>
        <ClickIcon style={[styles.icon, { color: Colors.booger }]} name={(filter.enabled) ? 'icon-box-checked' : 'icon-box'} />
        <Text style={[styles.text, { marginLeft: 10, color: Colors.booger }]}>{filter.label}</Text>
      </TouchableOpacity>
    )
  })
}

renderSorterContent = (section) => {
  // Logger.log({ name: 'FilterView.renderSectionContent()', section: section, index: index, isActive: isActive })

  return section.sorters.map((sorter) => {
    return (
      <TouchableOpacity key={section.label + '-' + sorter.label} style={[styles.section, styles.row]} onPress={this.toggleSorter.bind(this, sorter)}>
        <ClickIcon style={[styles.icon, { color: Colors.booger }]} name={(sorter.enabled) ? 'icon-circle-radio' : 'icon-circle'} />
        <Text style={[styles.text, { marginLeft: 10, color: Colors.booger }]}>{sorter.label}</Text>
      </TouchableOpacity>
    )
  })
}


}

// Prop type warnings
FilterView.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSorterChange: PropTypes.func.isRequired,
  onIndustryChange: PropTypes.func,
}
