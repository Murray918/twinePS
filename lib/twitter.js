const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios')

class Twitter {
  constructor (consumerKey, consumerSecret) {
    this.baseUrl = 'https://api.twitter.com/'
    this.token = {}
    let oauth = OAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function (baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      }
    })
    axios.interceptors.request.use((config) => {
      config.headers = oauth.toHeader(oauth.authorize({
        url: `${config.baseURL}${config.url}`,
        method: config.method,
        data: config.data
      }, this.token))
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.headers['oauth_callback'] = 'oob'
      console.log(config)
      return config
    })
    axios.defaults.baseURL = this.baseUrl
    console.log('this is defaults : ' + axios.defaults.baseURL)
  }
  setToken (key, secret) {
    this.token = { key, secret }
  }
  async get (api) {
    console.log(api)
    try {
      let response = await axios.get(api)
      return response.data
    } catch (error) {
      handleTwitterError(error)
    }
  }
  async post (api, data) {
    console.log('this is api: ' + api)
    try {
      let response = await axios.post(api, data)
      return response.data
    } catch (error) {
      handleTwitterError(error)
    }
  }
}

function handleTwitterError (error) {
  if (error.message.includes('401')) {
    throw new Error('Invalid Twitter credentials -- try running \'configure\' again')
  } else if (error.message.includes('429')) {
    throw new Error('Twitter rate limit reached -- try again later')
  } else {
    throw new Error(`Twitter: ${error.message}`)
  }
}

module.exports = Twitter
