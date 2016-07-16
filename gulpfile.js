'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');

var pathSource = 'source';
var pathBuild = 'htdocs';

// SERVER AND SYNC ==================================
gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: pathBuild,
			open: false
		}
	});
});

// CLEAN ALL ========================================
gulp.task('clean', function () {
	return gulp.src([pathBuild], {read: false})
		.pipe(clean());
});


// HTML =============================================
gulp.task('pug', function(){
	return gulp.src(pathSource + '/tpl/**/*.pug')
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(pathBuild + '/html'));
});
// END HTML =========================================


// CSS ==============================================
var postProcessors = [
	autoprefixer({browsers: ['last 5 version']})
];

gulp.task('sass', function(){
	return gulp.src(pathSource + '/f/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(postProcessors))
		.pipe(gulp.dest(pathBuild + '/f/css'));
});
// END CSS ==========================================

// SCRIPTS ==========================================
gulp.task('scripts', function() {
	gulp.src(pathSource + '/f/js/**/*.js')
		.pipe(gulp.dest(pathBuild + '/f/js'));
});
// END SCRIPTS ======================================

// IMAGES ===========================================
gulp.task('img', function(){
	return gulp.src(pathSource + '/f/i/**/*.*')
		.pipe(gulp.dest(pathBuild + '/f/i'));
});
// END IMAGES =======================================

// watch
gulp.task('watch', function() {
	gulp.watch(pathSource + '/templates/**/*.pug', ['pug']);
	gulp.watch(pathSource + '/f/sass/**/*.sass', ['sass']);
	gulp.watch(pathSource + '/f/i/**/*.*', ['img']);
	gulp.watch(pathSource + '/f/js/**/*.js', ['scripts']);
});

//default
gulp.task('default', ['pug', 'sass', 'scripts', 'img', 'watch', 'browserSync'], function(){
	console.log('gulp watch');
});

gulp.task('build',   ['pug', 'sass', 'scripts', 'img'], function(){
	console.log('build finished');
});
