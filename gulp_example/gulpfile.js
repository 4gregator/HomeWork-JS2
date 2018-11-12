var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var htmlreplace = require('gulp-html-replace');
var browserify = require('gulp-browserify')
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var image = require('gulp-image');
var runSequence = require('run-sequence');

var prod = 0;
var buildPath = prod ? 'builds/prod/' : 'builds/dev/';
var fileName = prod ? 'main.min' : 'main';
var src = {
	html: 'app/*.html',
	js: 'app/scripts/*.js',
	css: 'app/styles/*.css',
	img: 'app/images/*'
};

gulp.task('js', function() {
	return gulp.src(src.js)
		.pipe(concat(fileName + '.js'))
		.pipe(browserify())
		.pipe(gulpif(prod, uglify()))
		.pipe(gulp.dest(buildPath))
});

gulp.task('css', function() {
	return gulp.src(src.css)
		.pipe(concat(fileName + '.css'))
		.pipe(less())
		.pipe(gulp.dest(buildPath))
});

gulp.task('html', function() {
	return gulp.src(src.html)
		.pipe(htmlreplace({
			css: fileName + '.css',
			js: fileName + '.js'
		}))
		.pipe(gulp.dest(buildPath))
});

gulp.task('img', function() {
	return gulp.src(src.img)
		.pipe(image())
		.pipe(gulp.dest(buildPath + '/img'))
});

gulp.task('clean', function() {
	return gulp.src(buildPath, {read: false})
		.pipe(clean());
});

gulp.task('default', ['html', 'js', 'css', 'img']);

gulp.task('build', function(done) {
	runSequence('clean', 'default');
});