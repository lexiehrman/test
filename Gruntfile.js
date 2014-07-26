'use strict';

module.exports = function(grunt){

    // Auto-Load dependencies from package.json
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Grunt Config
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // JS HINT
      //////////////////////////////////////////////////////////////////////////
      jshint: {
        options: {
          asi: true,
          curly: true,
          eqeqeq: false,
          latedef: 'nofunc',
          noarg: true,
          undef: false,
          boss: true,
          eqnull: true,
          sub: true,
          browser: true,
          evil: true,
          shadow: true
        },
        globals: {
          jQuery: true
        },
        all: [
          'app/js/scripts/**/*.js',
          'app/js/app/app.js'
        ]
      },

      // CONCATENATE JS
      //////////////////////////////////////////////////////////////////////////
      concat: {
        options: {
          separator: ';',
          stripBanners: true
        },
        plugins: {
          src: [
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/handlebars/handlebars.js',
            'bower_components/velocity/jquery.velocity.js',
            'bower_components/fitvids/jquery.fitvids.js',
            'bower_components/fluidbox/jquery.fluidbox.js',
            'bower_components/unveil/jquery.unveil.js',
            'app/js/vendor/**/*.js',
            'app/js/scripts/**/*.js',
            'app/js/app/app.js'
          ],
          dest: 'app/js/main.js'
        }
      },

      // UGLIFY JS
      //////////////////////////////////////////////////////////////////////////
      uglify: {
        options: {
          mangle: true
        },
        dist: {
          files: {
            'theme/assets/main.min.js': ['app/js/main.js']
          }
        }
      },


      // SVG OPTIMIZATION
      //////////////////////////////////////////////////////////////////////////
      svgmin: {
        options: {
            plugins: [{
                removeViewBox: false
            }]
        },
        dist: {
            files: [{
                expand: true,
                cwd: 'app/svg/source/',
                src: ['*.svg'],
                dest: 'app/svg/optimized',
                ext: '.min.svg'
            }]
        }
      },

      // IMAGE OPTIMIZATION
      //////////////////////////////////////////////////////////////////////////
      imagemin: {
        static: {
          options: {
            optimizationLevel: 3,
            progressive: true
          },
        },
        dynamic: {
          files: [{
            expand: true,
            cwd: 'app/images/src/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'app/images/optimized/'
          }]
        }
      },

      // DATA-URI ENCODING ( BITMAP TEXTURES )
      //////////////////////////////////////////////////////////////////////////
      datauri: {
        dist: {
          options: {
            classPrefix: 'data-',
            variables: true
          },
          src: [
            'app/datauri/checkbox-selected.png',
            'app/datauri/checkbox-unselected.png',
            'app/datauri/texture-light-grey.jpg',
            'app/datauri/texture-horizontal-line.jpg'
          ],
          dest: [ 'app/styles/modules/_datauri.scss' ]
        }
      },

      // VIDEO COMPRESSION
      //////////////////////////////////////////////////////////////////////////
      responsive_videos: {
        dist: {
          options: {
            sizes: [{
              width: 640,
              poster: '00:00:05'
            },{
              width: 1280,
              poster: '00:00:05'
            }],
            encodes:[{
              webm: [
                {'-vcodec': 'libvpx'},
                {'-crf': '12'},
                {'-b:v': '1.5M',},
              ],
              ogv: [
                {'-vcodec': 'libtheora'},
                {'-crf': '10'},
                {'-b:v': '1.2M',},
              ],
              mp4: [
                {'-vcodec':'libx264'},
                {'-pix_fmt': 'yuv420p'},
                {'-crf': '20'},
                {'-threads': '0'}
              ]
            }]
          },
          files: [{
            expand: true,
            cwd: 'app/videos/uncompressed',
            src: ['*.{mov,mp4}'],
            dest: 'app/videos/output/'
          }]
        }
      },

      // SASS COMPILE
      //////////////////////////////////////////////////////////////////////////
      sass: {
        dist: {
          options: {
            style: 'nested'
          },
          files: [{
            expand: true,
            cwd: 'app/styles/',
            src: ['*.scss'],
            dest: '././.tmp/',
            ext: '.css'
          }]
        }
      },

      // AUTOPREFIX SCSS
      //////////////////////////////////////////////////////////////////////////
      autoprefixer: {
        options: {
          browsers: ['last 2 versions',"Android 4", '> 3%', 'Firefox ESR', 'Opera 12.1']
        },
        files: {
          expand: true,
          flatten: true,
          src: '.tmp/*.css', // -> src/css/file1.css, src/css/file2.css
          dest: '.tmp/' // -> dest/css/file1.css, dest/css/file2.css
        },
      },

      // CLEAN & OPTIMIZE CSS
      //////////////////////////////////////////////////////////////////////////
      csso: {
        main: {
          files: {
            'theme/assets/style.css': ['.tmp/style.css']
          }
        },
      },


      // Shopify
      //////////////////////////////////////////////////////////////////////////
      shopify: {
        options: {
          api_key: "9e7c3ea41e8c5c3c45b9efed444c276f",
          password: "a3d67adbc00802e37f77adf40ba45b61",
          url: "the-interwebbers-dev.myshopify.com",
          base: "theme/",
          theme: 9718991
        }
      },


      // WATCH - DEVELOPMENT
      //////////////////////////////////////////////////////////////////////////
      watch: {
        js: {
          files: ['app/js/**/*.js'],
          tasks: ['jshint','concat', 'uglify']
        },
        css: {
          files: ['app/styles/**/*.scss'],
          tasks: ['sass', 'autoprefixer', 'csso'],
        },
        svg:{
          files: [ 'app/svg/source/*.svg' ],
          tasks: [ 'svgmin'],
        },
        shopify: {
          files: ['theme/assets/**','theme/config/**','theme/layout/**','theme/snippets/**','theme/templates/**'],
          tasks: ["shopify"],
        }
      }
    });

    grunt.registerTask('default', []);
    grunt.registerTask('data', ['datauri']);
    grunt.registerTask('images', ['imagemin']);
    grunt.registerTask('videos', ['responsive_videos']);

};
