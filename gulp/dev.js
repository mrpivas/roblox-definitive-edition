const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const typograf = require("gulp-typograf");
const svgsprite = require("gulp-svg-sprite");
const replace = require("gulp-replace");
const webpHTML = require("gulp-webp-retina-html");
const imageminWebp = require("imagemin-webp");
const rename = require("gulp-rename");
const prettier = require("@bdchauvette/gulp-prettier");

gulp.task("clean:dev", function(done) {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: true }));
	}
	done();
});

const fileIncludeSetting = {
  prefix: "@@",
  basepath: "@file",
};

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
      message: "Error <%= error.message %>",
			sound: false,
		}),
	};
};

gulp.task("html:dev", function() {
	return gulp
		.src([
      "./src/html/**/*.html",
      "!./**/blocks/**/*.*",
      "!./src/html/docs/**/*.*",
		])
    .pipe(changed("./build/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify("HTML")))
		.pipe(fileInclude(fileIncludeSetting))
		.pipe(
			replace(/<img(?:.|\n|\r)*?>/g, function(match) {
        return match.replace(/\r?\n|\r/g, "").replace(/\s{2,}/g, " ");
			})
		) //удаляет лишние пробелы и переводы строк внутри тега <img>
		.pipe(
			replace(
				/(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        "$1./$4$5$7$1"
			)
		)
		.pipe(
			typograf({
        locale: ["ru", "en-US"],
        htmlEntity: { type: "digit" },
				safeTags: [
          ["<\\?php", "\\?>"],
          ["<no-typography>", "</no-typography>"],
				],
			})
		)
		.pipe(
			webpHTML({
        extensions: ["jpg", "jpeg", "png", "gif", "webp"],
			retina: false,
			})
		)
		.pipe(
			prettier({
				tabWidth: 4,
				useTabs: true,
				printWidth: 182,
        trailingComma: "es5",
				bracketSpacing: false,
			})
		)
    .pipe(gulp.dest("./build/"))
    .pipe(browserSync.stream());
});

gulp.task("sass:dev", function() {
	return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./build/css/"))
    .pipe(plumber(plumberNotify("SCSS")))
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        "$1$2$3$4$6$1"
			)
		)
		.pipe(sourceMaps.write())
    .pipe(gulp.dest("./build/css/"))
    .pipe(browserSync.stream());
});

gulp.task("images:dev", function() {
	return (
		gulp
      .src(["./src/img/**/*", "!./src/img/svgicons/**/*"])
      .pipe(changed("./build/img/"))
			.pipe(
				imagemin([
					imageminWebp({
						quality: 85,
					}),
				])
			)
      .pipe(rename({ extname: ".webp" }))
      .pipe(gulp.dest("./build/img/"))
      .pipe(gulp.src(["./src/img/**/*", "!./src/img/svgicons/**/*"]))
      .pipe(changed("./build/img/"))
			// .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./build/img/"))
      .pipe(browserSync.stream())
	);
});

const svgStack = {
	mode: {
		stack: {
			example: true,
		},
	},
	shape: {
		transform: [
			{
				svgo: {
					js2svg: { indent: 4, pretty: true },
				},
			},
		],
	},
};

const svgSymbol = {
	mode: {
		symbol: {
      sprite: "../sprite.symbol.svg",
		},
	},
	shape: {
		transform: [
			{
				svgo: {
					js2svg: { indent: 4, pretty: true },
					plugins: [
						{
              name: "removeAttrs",
							params: {
                attrs: "(fill|stroke)",
							},
						},
					],
				},
			},
		],
	},
};

gulp.task("svgStack:dev", function() {
	return gulp
    .src("./src/img/svgicons/**/*.svg")
    .pipe(plumber(plumberNotify("SVG:dev")))
		.pipe(svgsprite(svgStack))
    .pipe(gulp.dest("./build/img/svgsprite/"));
});

gulp.task("svgSymbol:dev", function() {
	return gulp
    .src("./src/img/svgicons/**/*.svg")
    .pipe(plumber(plumberNotify("SVG:dev")))
		.pipe(svgsprite(svgSymbol))
    .pipe(gulp.dest("./build/img/svgsprite/"))
    .pipe(browserSync.stream());
});

gulp.task("files:dev", function() {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files/"))
    .pipe(gulp.dest("./build/files/"));
});

gulp.task("logo:dev", function() {
	return gulp
    .src("./src/img/svgicons/all/*.svg")
    .pipe(gulp.dest("./build/img/"));
});

gulp.task("svgicons:dev", function() {
	return gulp
    .src("./src/img/svgicons/**/*.svg")
    .pipe(gulp.dest("./build/img/svgicons/"));
});

gulp.task("js:dev", function() {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./build/js/"))
      .pipe(plumber(plumberNotify("JS")))
		// .pipe(babel())
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./build/js/"))
      .pipe(browserSync.stream())
  );
});

gulp.task("server:dev", function() {
  browserSync.init({
    server: {
      baseDir: "./build/",
    },
    port: 8000,
	open: true,
    notify: false,
  });
});

gulp.task("watch:dev", function() {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
	gulp.watch(
    ["./src/html/**/*.html", "./src/html/**/*.json"],
    gulp.parallel("html:dev")
	);
  gulp.watch("./src/img/**/*", gulp.parallel("images:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
	gulp.watch(
    "./src/img/svgicons/*",
    gulp.series("svgStack:dev", "svgSymbol:dev")
	);
  gulp.watch("./src/img/svgicons/all/*.svg", gulp.parallel("logo:dev"));
  gulp.watch("./src/img/svgicons/**/*.svg", gulp.parallel("svgicons:dev"));
});
