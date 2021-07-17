

class Article {
  	id: String
	title: String
	image_thumb: String
	article_category_name: String
	created_at: String

  constructor (id: String, title: String, image_thumb: String, article_category_name: String, created_at: String) {
    this.id = id,
    this.title = title,
    this.image_thumb = image_thumb,
    this.article_category_name = article_category_name,
    this.created_at = created_at
  }
  static fromJson (json) {
    // Logger.log({ function: 'Faq.fromJson', json: json })

    var retval: Article = new Article(json.id, json.title, json.image_thumb, json.article_category_name, json.created_at)

    return retval
  }
}

export default Article
