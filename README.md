![Build Status](https://codeship.com/projects/fe21adf0-1f10-0133-8b98-7a1057e16cf4/status?branch=master)

# Dilemme website

My future website, "Dilemme", French website based on [either.io](http://either.io) concept.

Work in progress.

# Install and run

Mongodb required running on default port. With a "dilemme" user being able to read and write "dilemme" db.

Environment variables have to be set in a ".env" file at the root of the project (I use [dotenv](https://github.com/motdotla/dotenv)).

Two environment variables are required :
* `NODE\_ENV`: "development" or "production"
* `MONGO\_PASSWORD`: the "dilemme" database password

You must have [gulp](http://gulpjs.com/) and bower installed too.
```sh
$ npm install -g gulp
$ npm install -g bower
```

Default dmin credentials are 'joe'/'joe'.


Classic stuff to launch the application : 

```sh
$ npm install
$ bower install
$ gulp build
$ node server
```

Then go to http://localhost:3131 and everything should be fine.

# Useful Gulp tasks

## Build

```sh
$ gulp build
```

* Concat and minify JS files
* Build Stylus files to CSS, concat and minify CSS
* Compile Jade views to HTML

## Watch

```sh
$ gulp watch
```

* Launch server.js using [gulp-nodemon](https://github.com/JacksonGariety/gulp-nodemon)
* Watch for any change in JS sources (client side) and rebuild them
* Watch for any change in Stylus sources and rebuild them
* Same for Jade files
* Watch for any change in JS files inside of /server directory and relaunch server.js

## Lint

```sh
$ gulp lint
```

* Run JSHint on sources