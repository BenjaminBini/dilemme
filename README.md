![Build Status](https://codeship.com/projects/fe21adf0-1f10-0133-8b98-7a1057e16cf4/status?branch=master)

# Dilemme website

My future website, "Dilemme", French website based on [either.io](http://either.io) concept.

Work in progress.

# Install and run

Mongodb required running on default port. With a "dilemme" user being able to read and write "dilemme" db.

On development platform (whith no `NODE\_ENV` environement variable defined or set to "development"), dilemme password must be "dilemme".

On production platform (with `NODE_ENV` set to "production"), the db password must be in a node environement variable called `MONGO_PASSWORD`.

Environment variables have to be set in a ".env" file at the root of the project (I use [dotenv](https://github.com/motdotla/dotenv)).

You must have [gulp](http://gulpjs.com/) and bower installed too.
```sh
$ npm install -g gulp
$ npm install -g bower
```

Admin credentials are 'joe'/'joe'.


Classic stuff : 

```sh
$ npm install
$ bower install
$ gulp build
$ node server
```

Then go to http://localhost:3131 and everything should be fine.