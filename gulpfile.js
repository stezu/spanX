var gulp = require('gulp'),
    rename = require('gulp-rename');

// Run script through jshint
gulp.task('lint', function () {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    return gulp.src('spanX.js')
        .pipe(jshint({ indent: 2 }))
        .pipe(jshint.reporter(stylish));
});

// Minify javascript
gulp.task('js', function () {
    var uglify = require('gulp-uglify');

    return gulp.src('spanX.js')
        .pipe(uglify())
        .pipe(rename('spanX.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['lint', 'js']);