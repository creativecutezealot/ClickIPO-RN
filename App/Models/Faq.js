

class Faq {
  id: String
  question: String
  answer: String
  active: Boolean
  category: String

  constructor (id: String, question: String, answer: String, category: String) {
    this.id = id
    this.question = question
    this.answer = answer
    this.category = category
    this.active = false
  }

  static fromJson (json) {
    // Logger.log({ function: 'Faq.fromJson', json: json })

    var retval: Faq = new Faq(json.id, json.question, json.answer, json.faq_category_name)

    return retval
  }
}

export default Faq
