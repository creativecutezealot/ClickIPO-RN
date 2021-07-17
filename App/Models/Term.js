

class Term {
  id: String
  term: String
  definition: String

  constructor (id: String, term: String, definition: String) {
    this.id = id
    this.term = term
    this.definition = definition
  }

  static fromJson (json) {
    // Logger.log({ function: 'Order.fromJson', json: json })

    var retval: Term = new Term(json.id, json.term, json.definition)

    return retval
  }
}

export default Term
