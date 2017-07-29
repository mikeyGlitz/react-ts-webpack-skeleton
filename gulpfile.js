const gulp = require('gulp');
const gutil = require('gulp-util');
const typedoc = require('gulp-typedoc');

gulp.task('docs', () => {
  gulp.src([
    '**/*.ts',
    '**/*.tsx',
    "!node_modules/**",
    "!coverage/**",
    "!**/dist/**",
    "!docs/**",
    "!.config/**",
    "!__tests__/**"
  ])
  .pipe(typedoc({
    module: "commonjs",
    target: "es5",
    jsx: "react",
    out: "docs",
    name: "React Typescript Skeleton"
  }))
});

