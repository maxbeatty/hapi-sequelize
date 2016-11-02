# hapi-sequelize

> opinionated hapi plugin for interacting with sequelize

```
npm install @maxbeatty/hapi-sequelize
```

```js
const Hapi = require('hapi')
const server = new Hapi.Server()

server.connection()

server.register({
  register: require('@maxbeatty/hapi-sequelize'),
  options: {
    host: 'localhost',
    port: 5432,
    database: 'example',
    username: 'whoami',
    password: 'anger blew favor satisfy'
  }
}, function (err) {
  if (err) {
    console.error(err)
  } else {
    server.start(function () {
      console.info('Server started at ' + server.info.uri)
    })
  }
})
```

## Plugin options

### `dialect`

Database type like `mysql`, `mariadb`, `sqlite`, `postgres`, or `mssql`. Defaults to `postgres`

### `host`

Where to connect to your database like `localhost`

### `port`

Which port to connect to like `5432`

### `database`

Which database to connect to like `your_app`

### `username`

What user to connect as like `root` (not really)

### `password`

The password for your user like [`polish feet mad lucky`](http://passplum.com)

### `modelsPath`

Where your model definitions should be loaded from relative to your process. Defaults to `./lib/db/models`

### `migrationsPath`

Where your migrations should be loaded from relative to your process. Defaults to `./lib/db/migrations`

## Defaults

The Sequelize `define` options `paranoid` and `underscored` default to `true`. If you'd like to make these options, please open a Pull Request.
