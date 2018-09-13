const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const inquirer = require('inquirer')
const CredentialManager = require('../lib/credential-manager')
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

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
      expect(inquirer.prompt.calledOnce).to.be.true()
      inquirer.prompt.restore()
    })
  })
  context('whith existing credentials', () => {
    it('should just return them', async () => {
      let [key, secret] = await creds.getKeyAndSecret()
      expect(key).to.equal('Party On')
      expect(secret).to.equal('Wayne')
    })
  })
  after(() => {
    creds.conf.delete('apiKey')
    creds.conf.delete('apiSecret')
  })
})
