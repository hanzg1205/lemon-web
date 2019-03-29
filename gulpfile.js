const gulp = require('gulp');
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');

gulp.task('devSass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'));
});
gulp.task('server', () => {
    return gulp.src('./src')
        .pipe(webserver({
            port: 9999,
            livereload: true,
            proxies: [{
                source: '/bill/getBill',
                target: 'http://localhost:3000/bill/getBill'
            },{
                source: '/classify/getClassify',
                target: 'http://localhost:3000/classify/getClassify'
            },{
                source: '/bill/addBill',
                target: 'http://localhost:3000/bill/addBill'
            },{
                source: '/classify/getCustom',
                target: 'http://localhost:3000/classify/getCustom'
            }]
        }))
});
gulp.task('watching', () => {
    gulp.watch('./src/scss/**/*.scss', gulp.series('devSass'));
});
gulp.task('default', gulp.series('devSass', 'server', 'watching'));