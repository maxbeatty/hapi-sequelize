const Lab = require('lab')
const Code = require('code')
const proxyquire = require('proxyquire')
const Hapi = require('hapi')

const Db = proxyquire('../', {
  'sequelize': function (db, user, pass, options) {
    return {
      logging: options.logging,
      import: function () {},
      sync: function () {
        this.logging('test')
        return Promise.resolve()
      }
    }
  },
  'umzug': function () {
    return {
      up: function () { return Promise.resolve([]) }
    }
  }
})

const lab = exports.lab = Lab.script()

const expect = Code.expect

lab.experiment('Database', function () {
  lab.test('require valid options', function (done) {
    const server = new Hapi.Server()

    server.connection()

    try {
      server.register({
        register: Db,
        options: {}
      }, function (err) {
        expect(err).to.be.instanceof(Error)
      })
    } catch (err) {
      expect(err).to.be.instanceof(Error)

      done()
    }
  })

  lab.test('load and migrate', function (done) {
    const server = new Hapi.Server()

    server.connection()

    server.register({
      register: Db,
      options: {
        host: 'localhost',
        port: 5432,
        database: 'test',
        username: 'test',
        password: 'password',
        modelsPath: '.',
        migrationsPath: '.'
      }
    }, done)
  })
})
