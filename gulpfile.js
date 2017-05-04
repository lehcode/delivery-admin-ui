'use strict';

var gulp = require("gulp");
var concat = require("gulp-concat");
var util = require('gulp-util');
var env = require('gulp-env');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('gulp-debug');
var fs = require('fs');
var fse = require('fs-extra')
var sass = require('gulp-sass');
var strip = require('strip-comments');
var stripHtml = require('gulp-remove-html-comments');
var templateCache = require('gulp-angular-templatecache');
var autoprefixer = require('gulp-autoprefixer');

var config = {
  appDir: './app',
  production: !!util.env.production,
  pub: './public',
  cssDest: "/css",
  jsDest: "/js",
  assetsDir: "./assets",
  bowerDir: "./bower_components",
};

/*
 * Completes sequence, depends on and therefore run after "build" task
 */
gulp.task('default', ['build'], function () {
  process.exit();
});

/*
 * Default build
 */
gulp.task('build', function () {

  var paths = [
    process.cwd() + '/' + config.pub + "/css",
    process.cwd() + '/' + config.pub + "/js",
    process.cwd() + '/' + config.pub + "/views",
    process.cwd() + '/' + config.pub + "/tpl",
  ];

  paths.forEach(function (path) {
    fse.removeSync(path);
  });

  gulp.start('concat:js:vendor');
  gulp.start('concat:css:vendor');
  gulp.start('sass:vendor');
  gulp.start('sass:app');
  gulp.start('concat:js:app');
  //gulp.start('copy:icons:fa');
  gulp.start('copy:images:assets');
  gulp.start('copy:ng:templates');
  gulp.start('copy:ng:views');
  //gulp.start('copy:images:datatable');
  //gulp.start('copy:images:angular-grid');
  gulp.start('copy:app:fonts');
});

/*
 * Copy public files
 */
gulp.task('copy:ng:views', function () {
  return gulp.src(config.appDir + '/views/**/*.html')
    .pipe(stripHtml())
    //.pipe(templateCache())
    .pipe(debug({title: "copy:ng:views ", showFiles: true}))
    .pipe(gulp.dest(config.pub + '/views'));
});

gulp.task('copy:ng:templates', function () {
  return gulp.src(config.appDir + '/templates/**/*.html')
    .pipe(stripHtml())
    .pipe(debug({title: "copy:ng:templates ", showFiles: true}))
    .pipe(gulp.dest(config.pub + '/tpl'));
});

gulp.task('copy:images:assets', function () {
  return gulp.src([
    config.assetsDir + '/images/**/*.(jpg|png|svg|gif)',
  ])
    .pipe(debug({title: "copy:images:assets ", showFiles: true}))
    .pipe(gulp.dest(config.pub + '/img'));
});

gulp.task('copy:app:fonts', function () {
  return gulp.src(config.assetsDir + '/fonts/**.*')
    .pipe(debug({title: "copy:app:fonts", showFiles: true}))
    .pipe(gulp.dest(config.pub + '/fonts'));
});

/*
 * Concatenate vendor JS files
 */
gulp.task('concat:js:vendor', function () {

  var vendorScripts = [
    config.bowerDir + '/angular/angular.js',
    config.bowerDir + '/angular-loader/angular-loader.js',
    config.bowerDir + '/angular-mocks/angular-mocks.js',
    config.bowerDir + '/angular-route/angular-route.js',
    config.bowerDir + '/angular-sanitize/angular-sanitize.js',
    config.bowerDir + '/angular-ui-router/release/angular-ui-router.js',
    config.bowerDir + '/angular-animate/angular-animate.js',
    config.bowerDir + '/angular-aria/angular-aria.js',
    config.bowerDir + '/angular-material/angular-material.js',
    config.bowerDir + '/angular-resource/angular-resource.min.js',
    config.bowerDir + '/angular-material-icons/angular-material-icons.js',
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/html5-boilerplate/dist/js/plugins.js',
    config.bowerDir + '/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
    config.bowerDir + '/svg-morpheus/compile/unminified/svg-morpheus.js',
    config.bowerDir + '/toastr/toastr.js',
    config.bowerDir + '/angular-local-storage/dist/angular-local-storage.js',
  ];

  return gulp.src(vendorScripts)
    .pipe(debug({title: "concat:js:vendor ", showFiles: true}))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.pub + config.jsDest));

});

/*
 * Contactenate vendor CSS
 */
gulp.task("concat:css:vendor", function () {

  var files = [
    config.bowerDir + '/angular-material/angular-material.css',
    config.bowerDir + '/angular-material/layouts/angular-material.layouts.css',
    config.bowerDir + '/angular-material/layouts/angular-material.layout-attributes.css',
    config.bowerDir + '/angular-material-icons/angular-material-icons.css',
    config.bowerDir + '/toastr/toastr.css',
    config.bowerDir + '/angular-bootstrap/ui-bootstrap-csp.css',
  ];

  return gulp.src(files)
    .pipe(debug({title: "concat:css:vendor ", showFiles: true}))
    //.pipe(strip())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('vendor.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.pub + config.cssDest));

});


/*
 * Concatenate vendor SASS to CSS
 */
gulp.task('sass:vendor', function () {

  var styles = [
    // config.bowerDir + '/angular-material/angular-material.scss',
    // config.bowerDir + '/angular-material/layouts/angular-material.layouts.scss',
    // config.bowerDir + '/angular-material/layouts/angular-material.layout-attributes.scss',
    // config.bowerDir + '/toastr/toastr.scss',
  ];

  return gulp.src(styles)
    .pipe(debug({title: "sass:vendor", showFiles: true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('vendor.sass.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.pub + config.cssDest));
});

/*
 * Concatenate App javascript
 */
gulp.task('concat:js:app', function () {

  var appJs = [
    config.appDir + "/app.js",
    config.appDir + "/config.js",
    config.appDir + "/state.js",
    config.appDir + "/run.js",
    config.appDir + "/components/version/interpolate-filter.js",
    config.appDir + "/components/version/version-directive.js",
    config.appDir + "/components/version/version.js",
    config.appDir + "/controllers/**/*.js",
    config.appDir + "/widgets/**/*.js",
  ];

  var path = process.cwd() + "/" + config.pub + config.jsDest;
  console.log("concat:js:app: Writing to '%s'", path);

  return gulp.src(appJs)
    .pipe(debug({title: "concat:js:app", showFiles: true}))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.pub + config.jsDest));
});

/*
 * Compile application SASS to CSS
 */
gulp.task('sass:app', function () {

  var styles = [
    config.assetsDir + '/sass/*.scss',
    '!' + config.assetsDir + '/sass/bootstrap.scss',
  ];

  var path = process.cwd() + "/" + config.pub + config.cssDest;
  console.log("sass:app: Writing to '%s'", path);

  return gulp.src(styles)
    .pipe(debug({title: "sass:app", showFiles: true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('app.sass.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path));

});

/*
 * Watchers
 */
gulp.watch(config.appDir + '/**/*.js', function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.start(['concat:js:app']);
});

gulp.watch([
  config.assetsDir + '/sass/*.scss',
], function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.start(['sass:app', 'sass:vendor']);
});

gulp.watch([
  config.appDir + '/views/**/*.html',
], function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.start('copy:ng:views');
});

gulp.watch([
  config.appDir + '/templates/**/*.html'
], function (event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  gulp.start('copy:ng:templates');
});

var checkDestination = function (path) {
  if (!fs.existsSync(path)) {
    console.error("Destination '%s' does not exist!", path);
    return false;
  }
  return true;
}
