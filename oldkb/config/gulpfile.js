const path = require('path');
const posix = path.posix;
const gulp = require('gulp'),
	pug = require('gulp-pug'),
	data = require('gulp-data'),
	plumber = require('gulp-plumber');

const mkdirp = require('mkdirp');

const config = require('./index');


gulp.task('template', () => {
	const assets = require('./assets.json');
	gulp.src(config.entryPath + '/**/index.pug')
		.pipe(plumber())
		.pipe(data(file => {
			const dir = path.dirname(
					path.relative(file.base, file.path)
				)
				.split(path.sep).join(posix.sep),
				asset = assets[dir];

			const d = {
				common: assets.common,
				href: dir
			};

			if (asset) {
				Object.assign(d, {
					page: asset
				});
			}

			return d;
		}))
		.pipe(pug({
			basedir: config.srcPath
		}))
		.pipe(gulp.dest(config.templatePath));
});

gulp.task('sass', () => {
	const base = './main/resources/public/modules/materialize-css';
	mkdirp(`${base}/css`, (err) => {
		if (err) {
			onsole.error(err)
			return;
		}
	});

	return gulp.src('./node_modules/materialize-css/fonts/**/*')
		.pipe(gulp.dest(`${base}/fonts`));
});

gulp.task('watch', ['template'], () => {
	gulp.watch(config.srcPath + '/**/*.pug', ['template']);
});


gulp.task('default', ['template']);
