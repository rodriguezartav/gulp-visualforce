/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/



var gulp = require('gulp');

gulp.task('watch', ['setVarsLocal', "browserSync"], function() {
  gulp.watch('src/css/**', ['css']);
  gulp.watch(['src/images/**', '!src/images/map/**'], ['images']);
  gulp.watch('src/htdocs/assets/**', ['markup']);
});