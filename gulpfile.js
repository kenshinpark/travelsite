var gulp = require('gulp');
var watch = require('gulp-watch');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssvars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var cssImport = require('postcss-import');
var browserSync = require('browser-sync').create();
var mixins = require('postcss-mixins');

gulp.task('default', function () {
    console.log('Hooray');
});

gulp.task('html', function () {
    console.log('HTML');
});

gulp.task('styles', function () {
    return gulp.src('./app/assets/styles/styles.css')
        .pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
        .on('error', function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('./app/temp/styles'));
});

gulp.task('watch', function () {

    browserSync.init({
        notify: false,
        server: {
            baseDir: 'app'
        }
    });

    watch('./app/index.html', function () {
        browserSync.reload();
    });

    watch('./app/assets/styles/**/*.css', function () {
        gulp.start('cssInject');
    });

});

gulp.task('cssInject', ['styles'], function () {
    return gulp.src('./app/temp/styles/styles.css')
        .pipe(browserSync.stream());
});


var svgSprite = require('gulp-svg-sprite');
var rename = require('gulp-rename');
var del = require('del');

var config = {
    mode: {
        css: {
            sprite: 'sprite.svg',
            render: {
                css: {
                    template: './gulp/task/sprite.css'
                }
            }
        }
    }
}

gulp.task('beginClean', function () {
    return del(['./app/temp/sprite', './app/assets/images/sprites']);
});

gulp.task('createSprite', ['beginClean'], function () {
    return gulp.src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('./app/temp/sprite/'));
});

gulp.task('copySpriteGrahpic', ['createSprite'], function () {
    return gulp.src('./app/temp/sprite/css/**/*.svg')
        .pipe(gulp.dest('./app/assets/images/sprites'));
});

gulp.task('copySpriteCSS', ['createSprite'], function () {
    return gulp.src('./app/temp/sprite/css/*.css')
        .pipe(rename('_sprite.css'))
        .pipe(gulp.dest('./app/assets/styles/modules/'));
});

gulp.task('endClean', ['copySpriteGrahpic', 'copySpriteCSS'], function () {
    return del('./app/temp/sprite');
});

gulp.task('icons', ['beginClean', 'createSprite', 'copySpriteGrahpic', 'copySpriteCSS', 'endClean']);