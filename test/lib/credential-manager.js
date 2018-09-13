const chai = require('chai')
const path = require('path')
const fs = require('fs')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const CredentialManager = require('../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('a credential manger', () => {
  var creds
  before(() => {
    creds = new CredentialManager('twine-test')
  })
  it('should return credentials when they are found', async () => {
    await creds.storeKeyAndSecret('party', 'world')
    let [key, secret] = await creds.getKeyAndSecret()
    expect(key).to.equal('party')
    expect(secret).to.equal('world')
  })
  it('should reject when no credentials are found', async () => {
    await creds.clearKeyAndSecret()
    expect(creds.getKeyAndSecret()).to.be.rejected()
  })
  after(async (done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)
  })
})
