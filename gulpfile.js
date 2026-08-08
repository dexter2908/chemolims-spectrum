var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var _ = require('lodash');


var scripts = require('./app.scripts.json');

var source = {
    js: {
        main: 'app/main.js',
        src: [
            // application config
            'app.config.js',

            // application bootstrap file
            'app/main.js',

            // main module
            'app/app.js',

            // module files
            'app/**/module.js',

            // other js files [controllers, services, etc.]
            'app/**/!(module)*.js'
        ],
        tpl: 'app/**/*.tpl.html'
    }
};

var destinations = {
    js: 'build'
};

// Many template source files carry the Windows read-only attribute. gulp.dest
// preserves the source mode by default, which makes the bundles read-only and
// causes EPERM on the next write - so force a writable mode on output.
var destOptions = {
    mode: parseInt('644', 8)
};


function build() {
    return es.merge(gulp.src(source.js.src), getTemplateStream())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js, destOptions));
}

function js() {
    return es.merge(gulp.src(source.js.src), getTemplateStream())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js, destOptions));
}

function watch(done) {
    gulp.watch(source.js.src, js);
    gulp.watch(source.js.tpl, js);
    done(); // Signals that the watchers have successfully initialized
}

function connectServer(done) {
    connect.server({
        port: 8888
    });
    done(); // Signals that the local server is up and listening
}

function vendor(done) {
    var streams = [];

    _.forIn(scripts.chunks, function(chunkScripts, chunkName) {
        var paths = [];

        chunkScripts.forEach(function(script) {
            var scriptFileName = scripts.paths[script];

            if (!fs.existsSync(__dirname + '/' + scriptFileName)) {
                throw new Error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName + ' ' + script);
            }

            paths.push(scriptFileName);
        });

        if (paths.length > 0) {
            streams.push(
                gulp.src(paths)
                    .pipe(concat(chunkName + '.js'))
                    //.on('error', swallowError)
                    .pipe(gulp.dest(destinations.js, destOptions))
            );
        }
    });

    if (streams.length === 0) {
        done();
        return;
    }

    // es.merge returns a legacy stream that only emits 'end' (never 'finish'),
    // which gulp 4 cannot use to detect completion - so signal it manually.
    es.merge(streams)
        .on('error', done)
        .on('end', function() {
            done();
        });
}

gulp.task('build', build);
gulp.task('js', js);
gulp.task('watch', watch);
gulp.task('connect', connectServer);
gulp.task('vendor', vendor);

gulp.task('prod', gulp.series(vendor, build));
gulp.task('dev', gulp.series(vendor, js, gulp.parallel(watch, connectServer)));
gulp.task('default', gulp.series('dev'));

var swallowError = function(error) {
    console.log(error.toString());
    this.emit('end');
};

var getTemplateStream = function() {
    return gulp.src(source.js.tpl)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }));
};
