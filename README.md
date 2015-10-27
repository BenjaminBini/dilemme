![Build Status](https://codeship.com/projects/fe21adf0-1f10-0133-8b98-7a1057e16cf4/status?branch=master)

# Dilemme website

My future website, "Dilemme", French website based on [either.io](http://either.io) concept.

Work in progress.

# Install and run

MongoDB is required and must be running on default port.

Environment variables have to be set in a ".env" file at the root of the project (see `.env.sample` file) (I use [dotenv](https://github.com/motdotla/dotenv)).

7 environment variables are required :
* `NODE_ENV`: "development" or "production"
* `ROOT_PATH`: root URL (for example : http://dilemme.io, or http://localhost:3131) WITHOUT trailing slash but WITH leading "http://"
* `MONGO_URI`: database URI, with user and password if required
* `MONGO_TEST_URI`: test database URI, with user and password if required
* `GMAIL_USER`: GMail user for sending mail
* `GMAIL_PASSWORD`: GMail password for sending mail
* `FB_ID`: Facebook app ID, used for Facebook authentication (create an app on [Facebook developper website](https://developers.facebook.com/))
* `FB_SECRET`: Facebook app secret
* `TWITTER_ID`: Twitter app ID, used for Twitter authentication (create an app on [Twitter developper website](https://apps.twitter.com/))
* `TWITTER_SECRET`: Twitter app secret*
* `GOOGLE_ID`: Google app client ID, used for Google authentication (create an app and a client for the app on [Google developper console](https://console.developers.google.com/) and enable Google+ API access)
* `GOOGLE_SECRET`: Google app client secret

You must have [gulp](http://gulpjs.com/) and [bower](http://bower.io/) installed too.
```sh
$ npm install -g gulp
$ npm install -g bower
```

Default admin credentials are 'joe'/'joe'.


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

## Lint

```sh
$ gulp lint
```

* Run [JSHint](http://jshint.com/docs/) on sources
* Run [JSCS](http://jscs.info/) on sources using [Google JS Code Style](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) customized with two rules :
	* No limitation for line length
	* Trailing white spaces forbidden

## Watch

```sh
$ gulp watch
```

* Launch server.js using [gulp-nodemon](https://github.com/JacksonGariety/gulp-nodemon)
* Watch for any change in JS sources (client side) and rebuild them
* Watch for any change in Stylus sources and rebuild them
* Same for Jade files
* Watch for any change in JS files inside of /server directory and relaunch server.js

## Debug

```sh
$ gulp debug
``

* Launch server.js with debug port set to 3132
* Watch files like the `watch` task