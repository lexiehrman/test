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
            'app/datauri/checkbox-unselected.png'
          ],
          dest: [ 'app/styles/modules/_datauri.scss' ]
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
            dest: '../../.tmp/',
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
        dist: {
          files: {
            src: '.tmp/*.css'
          }
        }
      },

      // CLEAN & OPTIMIZE CSS
      //////////////////////////////////////////////////////////////////////////
      csso: {
        dist: {
          files: {
            expand: true,
            cwd: '.tmp/',
            src: ['*.css', '!*.min.css'],
            dest: 'theme/assets/',
            ext: '.css.liquid'
          }
        }
      },


      // Shopify
      //////////////////////////////////////////////////////////////////////////
      shopify: {
        options: {
          api_key: "9df06ea65175bb8dbd48c24eadc88801",
          password: "1fc604c668e586e882e2575c17125207",
          url: "callina.myshopify.com",
          base: "theme/",
          theme: 9269095
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

};
