const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const inquirer = require('inquirer')
const CredentialManager = require('../lib/credential-manager')

describe('a credential manger', () => {
  var creds
  before(() => {
    creds = new CredentialManager('twine-test')
  })
  context('with no existing credentials', () => {
    it('should prompt the user', async () => {
      sinon.stub(inquirer, 'prompt').resolves({ key: 'Party On', secret: 'Wayne' })
      let [key, secret] = await creds.getKeyAndSecret()
      expect(key).to.equal('Party On')
      expect(secret).to.equal('Wayne')
      inquirer.prompt.restore()
    })
  })
  after(() => {
    creds.conf.delete('apiKey')
    creds.conf.delete('apiSecret')
  })
})
