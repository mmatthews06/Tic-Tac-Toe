'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var notify = require('gulp-notify');
var argv = require('yargs').argv;

// less
var less = require('gulp-less');
var path = require('path');
// BrowserSync
var browserSync = require('browser-sync');
// js
var watchify = require('watchify');
// linting
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// gulp build --production
var production = !!argv.production;
// determine if we're doing a build
// and if so, bypass the livereload
var build = argv._.length ? argv._[0] === 'build' : false;
var watch = argv._.length ? argv._[0] === 'watch' : true;

// ----------------------------
// Error notification methods
// ----------------------------
var beep = function() {
  var os = require('os');
  var file = 'gulp/error.wav';
  if (os.platform() === 'linux') {
    // linux
    exec("aplay " + file);
  } else {
    // mac
    console.log("afplay " + file);
    exec("afplay " + file);
  }
};
var handleError = function(task) {
  return function(err) {
    beep();

      notify.onError({
        message: task + ' failed, check the logs..',
        sound: false
      })(err);

    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
  };
};
// --------------------------
// CUSTOM TASK METHODS
// --------------------------
var tasks = {
  // --------------------------
  // Delete build folder
  // --------------------------
  clean: function(cb) {
    del(['build/'], cb);
  },
  // --------------------------
  // Copy static assets
  // --------------------------
  assets: function() {
    return gulp.src('./client/assets/**/*')
      .pipe(gulp.dest('build/assets/'));
  },
  // --------------------------
  // HTML
  // --------------------------
  // html templates (when using the connect server)
  templates: function() {
    gulp.src('templates/*.html')
      .pipe(gulp.dest('build/'));
  },
  // --------------------------
  // less
  // --------------------------
  less: function () {
    console.log('Trying less!');
    return gulp.src('./static/*.less')
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(gulp.dest('./static'));
  },
  // --------------------------
  // linting
  // --------------------------
  lintjs: function() {
    return gulp.src([
        'gulpfile.js',
        './client/js/index.js',
        './client/js/**/*.js'
      ]).pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .on('error', function() {
        beep();
      });
  },
};

gulp.task('browser-sync', function() {
    browserSync({
        //server: {
          //baseDir: "./build"
        //},
        //port: process.env.PORT || 3000,
        proxy: 'localhost:8000',
        browser: ['google chrome']
    });
});

gulp.task('reload-less', ['less'], function(){
  browserSync.reload();
});
gulp.task('reload-js', ['browserify'], function(){
  browserSync.reload();
});
gulp.task('reload-templates', ['templates'], function(){
  browserSync.reload();
});

// --------------------------
// CUSTOMS TASKS
// --------------------------
gulp.task('clean', tasks.clean);
// for production we require the clean method on every individual task
var req = build ? ['clean'] : [];
// individual tasks
gulp.task('templates', req, tasks.templates);
gulp.task('assets', req, tasks.assets);
gulp.task('less', req, tasks.less);
gulp.task('lint:js', tasks.lintjs);
gulp.task('test', tasks.test);

// --------------------------
// DEV/WATCH TASK
// --------------------------
//gulp.task('watch', ['assets', 'templates', 'sass', 'browserify', 'browser-sync'], function() {
gulp.task('watch', ['less', 'browser-sync'], function() {
  // --------------------------
  // watch:less
  // --------------------------
  gulp.watch('./static/*.less', ['reload-less']);

  // --------------------------
  // watch:js
  // --------------------------
  gulp.watch('./static/*.js', ['lint:js', 'reload-js']);

  // TypeScript conversion later...

  // --------------------------
  // watch:html
  // --------------------------
  //gulp.watch('./templates/**/*.html', ['reload-templates']);

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// build task
gulp.task('build', [
  'clean',
  'templates',
  'assets',
  'less'
]);

gulp.task('default', ['watch']);

// gulp (watch) : for development and livereload
// gulp build : for a one off development build
// gulp build --production : for a minified production build
