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
var pathComponents = 'source/components';
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
gulp.task('clean', function(){
	return gulp.src([pathBuild], {read: false})
		.pipe(clean());
});

// HTML =============================================
gulp.task('clean-pug-mixins', function(){
	return gulp.src(pathComponents + '/_mixins.pug', {read: false})
		.pipe(clean());
});

gulp.task('concat-pug-mixins', ['clean-pug-mixins'], function(){
	return gulp.src(pathComponents + '/**/_*.pug')
		.pipe(concat('_mixins.pug'))
		.pipe(gulp.dest(pathComponents));
});

gulp.task('pug', ['concat-pug-mixins'], function(){
	return gulp.src(pathSource + '/tpl/**/*.pug')
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(pathBuild + '/html'))
		.pipe(browserSync.stream());
});
// END HTML =========================================


// CSS ==============================================
var postProcessors = [
	autoprefixer({browsers: ['last 5 version']})
];

gulp.task('sass', function(){
	return gulp.src([pathComponents + '/_variables.sass',
									pathComponents + '/_mixins.sass',
									pathComponents + '/**/*.sass'])
		.pipe(concat('components.sass'))
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(postProcessors))
		.pipe(gulp.dest(pathBuild + '/f/css'))
		.pipe(browserSync.stream());
});

// main.css
gulp.task('main-css', function(){
	return gulp.src(pathSource + '/f/sass/**/*.sass')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(postProcessors))
		.pipe(gulp.dest(pathBuild + '/f/css'))
		.pipe(browserSync.stream());
});
// END CSS ==========================================

// SCRIPTS ==========================================
gulp.task('scripts', function() {
	return gulp.src(pathSource + '/f/js/**/*.js')
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
	gulp.watch(pathComponents + '/**/*.pug', ['concat-pug-mixins', 'pug']);
	gulp.watch(pathSource + '/tpl/**/*.pug', ['pug']);
	gulp.watch(pathComponents + '/**/*.sass', ['sass']);
	gulp.watch(pathSource + '/f/sass/**/*.sass', ['main-css']);
	gulp.watch(pathComponents + '/**/i/*.*', ['img']);
	gulp.watch(pathComponents + '/**/*.js', ['scripts']);
});

//default
gulp.task('default', ['concat-pug-mixins', 'pug', 'main-css', 'sass', 'scripts', 'img', 'watch', 'browserSync'], function(){
	console.log('gulp watch');
});

gulp.task('build',   ['concat-pug-mixins', 'pug', 'main-css', 'sass', 'scripts', 'img'], function(){
	console.log('build finished');
});
