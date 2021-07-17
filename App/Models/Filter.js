class Filter {
  category: String
  label: String
  enabledDefault: Boolean
  filterPredicate: (String) => Boolean
  enabled: Boolean


  constructor (category, label, enabledDefault, filterPredicate) {
    this.label = label
    this.category = category
    this.enabledDefault = enabledDefault
    this.filterPredicate = filterPredicate

    this.enabled = enabledDefault
  }

  reset = () => {
    this.enabled = this.enabledDefault
  }

  isModified  = () => {
    return !(this.enabled === this.enabledDefault)
  }
}

export default Filter
