var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var jshint = require('jshint');
var exec = require('child_process').exec;



gulp.task('scripts', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    gulp.src(['/src/*.js', '/src/library/*.js', 'src/Model/*.js', '!vendor/**', '!gulpfile.js', '!node_modules'])
        //.pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('build/js'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function () {
    gutil.log('Gulp started');
    //    gulp.run('scripts');

    gulp.watch('*.js', ['javascript']);
    gulp.watch('src/*.scss', ['sass']);
    gulp.watch('src/*.ts', ['typescript']);
    gulp.watch('src/*.js', ['javascript']);
    gulp.watch('src/library/*.js', ['javascript']);
    gulp.watch('src/Model/*.js', ['javascript']);

    // Watch files and run tasks if they change
    //gulp.watch(['src/*.js', 'src/library/*.js', 'src/Model/*.js', ], function (event) {
    //        gutil.log('Watched file changed');
    //        gulp.run('scripts');
    //        gulp.run('server');
    //});
});


gulp.task('typescript', function () {
    gutil.log('Compile Typescript');
    var tsResult = gulp.src('*.ts')
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: true,
            noImplicitAny: true,
            out: 'main.js'
        }));

    return merge([
    tsResult.dts.pipe(gulp.dest('build/definitions')),
    tsResult.js.pipe(gulp.dest('build/js'))
    ]);
});

gulp.task('sass', function () {
    gutil.log('Compile SASS');
    gulp.src('*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('javascript', function () {
    gutil.log('Compile Javascript');
    //Keeping separate as wildcards seems to make a mess of the folders

    gulp.src(['src/Model/*.js', '!vendor/**', '!gulpfile.js', '!build/**', '!node_modules'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./build/js/Model'));

    gulp.src(['src/library/*.js', '!vendor/**', '!gulpfile.js', '!build/**', '!node_modules'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./build/js/library'));

    gulp.src(['src/*.js', '!vendor/**', '!gulpfile.js', '!build/**', '!node_modules'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./build/js'));

    gulp.src(['src/Model/*.js', 'src/library/*.js', 'src/*.js', '!vendor/**', '!gulpfile.js', '!build/**', '!node_modules'], {
            base: '.'
        })
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./build/js'));
});


gulp.task('server', function (cb) {
    //Do the build here if desired
    gutil.log('Execute Server Task');
    //Just while learning how to debug compiled files
    exec('node src/testtedious.js', function (err, stdout, stderr) {
        //    exec('node build/js/all.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('watch', function () {
    gulp.watch('*.scss', ['sass']);
    gulp.watch('*.ts', ['typescript']);
    gulp.watch('*.js', ['javascript']);
    gulp.watch('src/*.scss', ['sass']);
    gulp.watch('src/*.ts', ['typescript']);
    gulp.watch('src/*.js', ['javascript']);
    gulp.watch('src/library/*.js', ['javascript']);
    gulp.watch('src/Model/*.js', ['javascript']);
    gulp.watch('*', ['server']);
});




//gulp.task('lint', function () {
//    gulp.src('./**/*.js')
//        .pipe(jshint());
//});
//
//
//gulp.task('start', function () {
//    nodemon({
//        script: 'TediousDatabase.js',
//        ext: 'js html',
//        ignore: ['gulpfile.js'],
//        env: {
//            'NODE_ENV': 'development'
//        },
//        tasks: ['lint']
//    });
//});