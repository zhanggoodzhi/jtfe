const gulp = require('gulp');

const path = require('path'),
	posix = path.posix,
	plumber = require('gulp-plumber'),
	data = require('gulp-data'),
	pug = require('gulp-pug'),
	rename = require('gulp-rename');

const config = require('./index.js')();

gulp.task('template', () => {
	const menus = require(`./menus.js`),
		adminMenus = require(`./admin-menus.js`),
		assets = require('./assets.json'),
		common = assets.common;

	return gulp.src(['./pages/**/index.pug'])
		.pipe(plumber())
		.pipe(data(file => {
			const dir = path.dirname(
					file.path
					.split('pages').slice(1).join('')
				)
				.slice(1)
				.split(path.sep)
				.join(posix.sep);


			return {
				file: assets[dir],
				adminMenus,
				menus,
				common,
				dir,
				copyright: config.copyright
			};
		}))
		.pipe(pug({
			basedir: './template'
		}))
		.pipe(rename((file) => {
			const pathList = file.dirname.split(path.sep);
			file.dirname = pathList.slice(0, -1).join(path.sep);
			file.basename = pathList[pathList.length - 1];
			file.extname = '.jsp';
		}))
		.pipe(gulp.dest('./views'));
});


gulp.task('watch', ['template'], () => {
	gulp.watch(['./pages/**/*.pug', './template/**/*.pug'], ['template']);
});

gulp.task('default', ['template']);
