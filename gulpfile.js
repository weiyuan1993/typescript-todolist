var gulp = require('gulp');
var tsc = require('gulp-typescript');
gulp.task('default', function() {     
    return gulp.src('./dist/type-todo.ts')
    .pipe(tsc())
    .pipe(gulp.dest('./build/'));
});