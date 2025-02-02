# Hacking

You'll need a recent Node.js, Python3, cmake, and
[yarn](https://yarnpkg.com/).

You'll also need a C++ compiler for some native Node.js
packages. Install MSVC++ (Visual Studio) on Windows or XCode on
macOS. On Linux install gcc or clang.

If you want to have hot-reloading, install
[fswatch](https://github.com/emcrisostomo/fswatch).

## Build and run the online environment

This will start a web server for the in-browser application. If you
have fswatch it will also build the UI:

```
yarn start-ui
```

If you don't have fswatch or want to manually trigger a build of the UI app, run this:

```
yarn build-ui
```

And manually start a web-server: `python3 -m http.server --port 8080 build`.


## Build and run the desktop app

```
yarn start-desktop
```

## Formatting, type-checking

```
yarn format
```

```
yarn tsc
```

### Building a desktop release

This needs to be done on each supported platform. For Windows, macOS, and Linux it is handled by Github Actions.

```
yarn release-desktop $version
```

## Build and run the server app

You'll need to have PostgreSQL install and running. Create a
`datastation` database and user. Or run `./scripts/provision_db.sh`.

Then run migrations: `psql -U datastation -f
./server/migrations/1_init.sql`.

Create a config file at `/usr/local/etc/datastation/config.json` and
fill out the following fields:

```
{
  "auth": {
    "sessionSecret": "", // A strong key for session signing
    "openId": {
      realm": "https://accounts.google.com", // Or some other realm
      clientId": "my id",
      clientSecret": "my secret",
    },
  },

  "server": {
    "port": 443,
    "address": "localhost",
    "publicUrl": "https://datastation.mydomain.com", // The address users will enter into the browser to use the app
    "tlsKey": "/home/server/certs/datastation.key.pem", // TLS certs are required, should be tied to the publicUrl domain
    "tlsCert": "/home/server/certs/datastation.cert.pem",
  },

  "database": {
    "address": "localhost",
    "username": "datastation",
    "password": "some good password",
    "database": "datastation",
  },
}
```