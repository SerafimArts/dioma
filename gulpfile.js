var gulp       = require('gulp');
var babel      = require('gulp-babel');
var concat     = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var commonjs   = require('gulp-wrap-commonjs');

gulp.task('default', () => {
    // Building example
    gulp
        .src([
            require.resolve('babel-polyfill/browser.js'),
            require.resolve('commonjs-require/commonjs-require.js')
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('polyfill.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('example'));


    // Building container
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'stage-1'],
            plugins: [
                'syntax-flow',
                'syntax-decorators',

                'transform-flow-strip-types',
                'transform-decorators-legacy'
            ]
        }))
        .pipe(commonjs({
            pathModifier: path => {
                return path
                    .replace(/.js$/, '')
                    .replace(/\\/g, '/')
                    .replace(/^.*?\/src\//, '');
            }
        }))
        .pipe(concat('container.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('example'))
    ;
});