var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('scripts', function() {
  var stream = gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/ng-dialog/js/ngDialog.js',
    'bower_components/moment/moment.js',
    'app/scripts/app.js',
    'app/scripts/controller.js',
    'app/scripts/route.js',
    'app/scripts/services/service.js',
    'app/scripts/services/user.js',
    'app/scripts/services/roleType.js',
    'app/scripts/services/searchConstructor.js',
    'app/scripts/services/paging.js'
    ])
    .pipe(concat('um.js'))  //合并文件
    //.pipe(uglify())  //压缩js，开发时可以注释掉
    .pipe(gulp.dest('app/dist'));

    return stream;
});

gulp.task('styles', function() {
    var style = gulp.src([
        'bower_components/ng-dialog/css/ngDialog.css',
        'bower_components/ng-dialog/css/ngDialog-theme-default.css',
        'app/style/um.css'
    ])
    .pipe(concat('style.css'))
    .pipe(gulp.dest('app/dist'));
});

gulp.task('default', [], function() {
    gulp.start('styles', 'scripts');
});

var watcher = gulp.watch('app/scripts/*.js', ['default']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});