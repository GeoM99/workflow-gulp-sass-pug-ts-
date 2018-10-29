import  gulp from 'gulp';
import  prefix from 'gulp-autoprefixer';
import  pug from 'gulp-pug';
import  sass from 'gulp-sass';
import  imagemin from 'gulp-imagemin';
import  pngquant from 'imagemin-pngquant';
import  svgmin from 'gulp-svgmin';
import  webp from 'gulp-webp';
import  usereft from 'gulp-useref';
import  concat  from 'gulp-concat';
import  uncss from 'gulp-uncss';
import  cleanCSS from 'gulp-clean-css';
import  uglify from 'gulp-uglify';
import  htmlmin from 'gulp-htmlmin';
import  ts from 'gulp-typescript';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';







let directories = {
  src : 'dev',
  dist : 'dist',
  node_modules : 'node_modules'
}


let files = {
  CSS : [
    `${directories.node_modules}/materialize-css/dist/css/materialize.min.css`,
    `${directories.node_modules}/animate.css/animate.css`,
    `${directories.node_modules}/font-awesome/css/font-awesome.min.css`,
    `${directories.dist}/css/core.css`
  
  ],
  miniCSS : 'build.min.css',
  
  JS : [
  `${directories.node_modules}/materialize/dist/js/materialize.min.js`,
  `${directories.dist}/js/scripts.js`


  ],
  miniJS : 'build.min.js',
  fonts : [`${directories.node_modules}/font-awesome/fonts/*.*`,


  ]
}

let options = {
  pug : {
    pretty : true,
    locals : {}
  },


  ts:{

    noImplicitAny: true,
    allowJs : true,
    target: 'ES5',
    experimentalDecorators: true,
    module: 'commonjs'
    
  },


  sass : { 
    outputStyle: 'compressed' 
  },

  es6:{ 
    presets: ['@babel/env']
  },
  
  imagemin :{
    progressive : true,
    use : [pngquant()]
  },

  svgmin : {
    plugins : [
      {convertColors : false}, 
      {removeAttrs : { 
        attrs : ['fill'] 
      } 
    }
  ]
 },

 uncss : { 
   html : [`${directories.dist}/*.html`]
  },

autoprefixer : {
  browsers : ['last 5 versions', '> 5%', 'Firefox ESR','safari 5','ie 7','ie 9','opera 12.1', 'ios 6','android 4'],
  cascade : false
  
  },
  htmlmin : { collapseWithSpace : true }
}



//USE TYPESCRIPT OR ES6

//Tarea compilar typesctipt
gulp.task('ts', ()=>{
  gulp
    .src(`${directories.src}/ts/**/*.ts`)
    .pipe(ts(options.ts))
    .pipe(gulp.dest(`${directories.dist}/js`))

})

//Tarea compilar es6
gulp.task('es6', ()=>{
    browserify(`${directories.src}/es6/scripts.js`)
      .transform(babelify)
      .bundle()
      .on('error' , function(e){
        console.error(e);
      this.emit('end')    
      })
      .pipe(source('scripts.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))  
    .pipe(gulp.dest(`${directories.dist}/js`))
  
})




//Tarea minificacion javascript
gulp.task('js', ()=>{
   gulp
    .src(files.JS)
    .pipe(concat(files.miniJS))
    .pipe(uglify())
    .pipe(gulp.dest(`${directories.dist}/js`))

  })

//Tarea para compilar gulp
gulp.task('pug', ()=> {
   gulp
    .src(`${directories.src}/pug/**/*.pug`)
    .pipe(pug(options.pug))
    .pipe(gulp.dest(`${directories.dist}`))
})


//Tarea para compilar sass
gulp.task('sass', ()=>{
  gulp
    .src(`${directories.src}/sass/*.sass`)
    .pipe(sass(options.sass))
    .pipe(gulp.dest(`${directories.dist}/css`))
})




//Tareas  minificacion de imagenes

gulp.task('img',()=>{
   gulp
    .src(`${directories.src}/img/**/*.+(png|jpeg|jpg|gif)`)
    .pipe(imagemin(options.imagemin))
    .pipe(gulp.dist(`${directories.dist}/img`))
})

gulp.task('svg', ()=>{
   gulp
    .src(`${directories.src}/img/svg/*.svg`)
    .pipe(svgmin(options.svgmin))
    .pipe(gulp.dest(`${directories.dist}/img/svg`))
})

gulp.task('webp', ()=>{
   gulp
    .src(`${directories.src}/img/**/*.+(png|jpeg|jpg)`)
    .pipe(webp())
    .pipe(gulp.dest(`${directories.dist}/img/webp`))
})

gulp.task('fonts', ()=>{
   gulp
    .src(`${files.fonts}`)
    .pipe(gulp.dest(`${directories.dist}/fonts`))

})


//Tarea minificacion css
gulp.task('css',  ()=>{
   gulp
    .src(files.CSS)
    .pipe(concat(files.miniCSS))
    //.pipe(uncss(options.uncss))
    .pipe(prefix(options.autoprefixer))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${directories.dist}/css`))

  })


//Tarea minificacion Html
gulp.task('html', ()=>{
   gulp
    .src(`${directories.dist}/*.html`)
    .pipe(usereft())
    .pipe(htmlmin(options.htmlmin))
    .pipe(gulp.dest(`${directories.dist}`))
})




gulp.task('watcher', ()=>{
  gulp.watch(`${directories.src}/pug/**/*.pug`, gulp.parallel('pug'))
  gulp.watch(`${directories.src}/sass/**/*.sass`, gulp.parallel('sass'))
  gulp.watch(`${directories.src}/**/*.js`, gulp.parallel('es6'))
  
  //gulp
    //.watch(`${directories.src}/ts/**/*.ts`, gulp.parallel('ts'))
  
  })