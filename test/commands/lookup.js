const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const { ReadableMock, WriteableMock } = require('stream-mock')
const lookup = require('../../commands/lookup')
const CredentialManager = require('../../lib/credential-manager')
const Twitter = require('../../lib/twitter')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the lookup module', () => {
  var sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })
  context('users', () => {
    beforeEach(() => {
      sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
        .resolves(['key', 'secret'])
      sandbox.stub(Twitter.prototype, 'get')
        .callsFake((url) => {
          let response = url.slice(url.indexOf('=') + 1)
            .split(',').map((n) => ({ screen_name: n }))
          return Promise.resolve(response)
        })
    })
    it('shoud lookup users', (done) => {
      let stdin = new ReadableMock(['foo\n', 'bar\n'], { objectMode: true })
      let stdout = new WriteableMock()
      lookup.users('twine-test', null, { stdin, stdout })
      stdout.on('finish', () => {
        expect(JSON.parse(stdout.data))
          .to.deep.equal([{ screen_name: 'foo' }, { screen_name: 'bar' }])
        done()
      })
    })
  })
  afterEach(() => {
    sandbox.restore()
  })
})
