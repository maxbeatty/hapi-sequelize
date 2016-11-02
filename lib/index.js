const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')
const Umzug = require('umzug')
const Joi = require('joi')

const schema = Joi.object().keys({
  dialect: Joi.string().default('postgres'),
  host: Joi.string().required(),
  port: Joi.required(),
  database: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string(),
  migrationsPath: Joi.string().default(path.join(process.cwd(), 'lib/db/models')),
  modelsPath: Joi.string().default(path.join(process.cwd(), 'lib/db/migrations'))
})

exports.register = function (server, options, next) {
  const logger = function (msg) {
    server.log(['db'], msg)
  }

  Joi.validate(options, schema, function (err, value) {
    if (err) {
      server.log(['db', 'error'], err)
      next(err)
    }

    options = value

    const sequelize = new Sequelize(options.database, options.username, options.password, {
      dialect: options.dialect,
      port: options.port,
      host: options.host,
      define: {
        paranoid: true,
        underscored: true
      },
      logging: logger
    })

    var models = {}
    const modelsPath = path.join(process.cwd(), options.modelsPath)

    fs.readdirSync(modelsPath).forEach(function (file) {
      var model = path.basename(file, '.js')
      models[model] = sequelize.import(path.join(modelsPath, file))
    })

    sequelize.sync()
    .then(function () {
      server.log(['db'], 'database connection created')

      server.expose('sequelize', sequelize)
      server.expose('models', models)

      var umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
          sequelize: sequelize
        },
        logging: logger,
        upName: 'up',
        downName: 'down',
        migrations: {
          params: [sequelize],
          path: path.join(process.cwd(), options.migrationsPath),
          pattern: /^\d+[\w-]+\.js$/ // Date.now() + '-description.js'
        }
      })

      // run new migrations on startup
      umzug.up()
      .then(function (migrations) {
        server.log(['info', 'db'], 'executed ' + migrations.length + ' migrations')

        next()
      })
      .catch(next)
    })
    .catch(next)
  })
}

exports.register.attributes = {
  name: 'db'
}
