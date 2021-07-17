

class Category {
  id: String
  name: String
  description: String

  // constructor () {
  // }

  static fromJson (json) {
    var retval: Category = new Category()
    retval.id = json.id
    retval.name = json.name
    retval.description = json.description

    return retval
  }
}

export default Category
