

// import Logger from '../Lib/Logger'

class ClickIpoError {
  error: Object
  displayMessage: String
  stack: String

  constructor (error) {
    this.error = error

    if (error) {
      console.log('inside of the if');
      this.displayMessage = error
    } else {
      console.log('inside of the else');
      this.displayMessage = 'An unknown error occured. Please try again.'
    }

    this.stack = (new Error()).stack
  }
}

export default ClickIpoError
