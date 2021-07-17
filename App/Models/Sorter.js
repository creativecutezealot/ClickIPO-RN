class Sorter {
  category: String
  label: String
  enabledDefault: Boolean
  sorterPredicate: String
  enabled: Boolean


  constructor (category, label, enabledDefault, sorterPredicate) {
    this.label = label
    this.category = category
    this.enabledDefault = enabledDefault
    this.sorterPredicate = sorterPredicate

    this.enabled = enabledDefault
  }

  reset = () => {
    this.enabled = this.enabledDefault
  }

  isModified  = () => {
    return !(this.enabled === this.enabledDefault)
  }
}

export default Sorter
