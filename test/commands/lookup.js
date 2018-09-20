const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const { ReadableMock, WritableMock } = require('stream-mock')
const lookup = require('../../commands/lookup')
const CredentialManager = require('../../lib/credential-manager')
const Twitter = require('../../lib/twitter')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

console.log(typeof WriteableMock)

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
      let stdout = new WritableMock()
      lookup.users('twine-test', null, { stdin, stdout })
      stdout.on('finish', () => {
        expect(JSON.parse(stdout.data))
          .to.deep.equal([{ screen_name: 'foo' }, { screen_name: 'bar' }])
        done()
      })
    })
    it('should lookup more than 100 users piped to stdin', (done) => {
      let users = [...Array(101).keys()].map((n) => `foo${n}`)
      let stdin = new ReadableMock(users.map((u) => `${u}\n`), { objectMode: true })
      let stdout = new WritableMock()
      lookup.users('twine-test', null, { stdin, stdout })
      stdout.on('finish', () => {
        expect(JSON.parse(stdout.data))
          .to.deep.equal(users.map((u) => ({ screen_name: u })))
        done()
      })
    })
  })
  afterEach(() => {
    sandbox.restore()
  })
})
