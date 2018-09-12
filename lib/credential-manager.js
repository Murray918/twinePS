const Configstore = require('configstore')

class CredentialManager {
  constructor (name) {
    this.conf = new Configstore(name)
  }

  getKetAndSecret () {
    let key = this.conf.get('apiKey')
    if (key) {
      let secret = this.conf.get('apiSecret')
      return [key, secret]
    } else {
      let answers = await inquirer.prompt([
        {type: 'input', name: 'key', message: 'Enter your twitter API key:'},
        {type: 'password', name: 'secret', message: 'Enter your Twitter API secret:'}
      ])
      this.conf.set('apiKey', answers.key)
      this.conf.set('apiSecret', answers.secret)
      return [answers.key, answers.secret]
    }
  }
}

module.exports = CredentialManager