var gulp    = require('gulp');
var concat = require('gulp-concat');
var uglify  = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require("gulp-ng-html2js");

gulp.task('loginScripts', function() {
  
  gulp.src(['./app_client/login/main.js','./app_client/login/*.js','./app_client/common/**/*.js', '!./app_client/login/login_app.min.js'])
    // .pipe(sourcemaps.init())
      .pipe(concat('./login_app.min.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest('./app_client/login'))
    // .pipe(sourcemaps.write('./'))
    // .pipe(gulp.dest('app_client'));
});

gulp.task('patientScripts', function() {
  gulp.src(['./app_client/patient/main.js', './app_client/patient/**/*.js','./app_client/common/**/*.js', '!./app_client/patient/patient_app.min.js'])
    // .pipe(sourcemaps.init())
      .pipe(concat('./patient_app.min.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest('./app_client/patient'))
    // .pipe(sourcemaps.write('./'))
    // .pipe(gulp.dest('app_client'));
});

gulp.task('doctorScripts', function() {
  gulp.src(['./app_client/doctor/main.js', './app_client/doctor/**/*.js','./app_client/common/**/*.js', '!./app_client/doctor/doctor_app.min.js'])
    // .pipe(sourcemaps.init())
      .pipe(concat('./doctor_app.min.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest('./app_client/doctor'))
    // .pipe(sourcemaps.write('./'))
    // .pipe(gulp.dest('app_client'));
});

gulp.task('watch', function() {
  watch(['./app_client/common/**/*.js'], function () {
    gulp.start('default');
  });
  watch(['./app_client/login/*.js', '!./app_client/login/login_app.min.js'], function () {
    gulp.start('loginScripts');
  });
  watch(['./app_client/patient/**/*.js',  '!./app_client/patient/patient_app.min.js'], function () {
    gulp.start('patientScripts');
  });
  watch(['./app_client/doctor/**/*.js',  '!./app_client/doctor/doctor_app.min.js'], function () {
    gulp.start('doctorScripts');
  });
});


gulp.task('default', ['loginScripts','patientScripts','doctorScripts', 'watch']);