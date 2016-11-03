'use strict';

module.exports = function(grunt) {
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        banner: '/* <%=pkg.name%> - v<%=pkg.version%> - <%=grunt.template.today("yyyy-mm-dd")%>\n' +
        '** Copyright (c) <%=grunt.template.today("yyyy")%> */\n',

        // Task configuration.
        clean: {
            font: 'assets/fonts/*',
            image: 'assets/images/*',
            'themes-image': 'assets/themes/default/images/*'
        },
        copy: {
            init: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/assets/fonts',
                        src: ['**/*'],
                        dest: 'src/fonts'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'bower_components/',
                        src: [
                            'bootstrap-sass/assets/javascripts/bootstrap.min.js',
                            //'bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                            'jquery/dist/jquery.min.js',
                            //'jquery.easing/js/jquery.easing.min.js',
                            //'fullpage.js/dist/jquery.fullpage.min.js',
                            'html5shiv/dist/html5shiv.min.js',
                            'respond/dest/respond.min.js'
                        ],
                        dest: 'assets/js/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'bower_components/',
                        src: [
                            //'bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                            //'fullpage.js/dist/jquery.fullpage.min.css'
                        ],
                        dest: 'assets/css/',
                        filter: 'isFile'
                    }
                ]
            },
            font: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/fonts',
                        src: ['**/*'],
                        dest: 'assets/fonts'
                    }
                ]
            },
            image: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images',
                        src: ['**/*'],
                        dest: 'assets/images'
                    }
                ]
            },
            'themes-image': {
                files: [
                    {
                        expand: true,
                        cwd: 'src/themes/default/images',
                        src: ['**/*'],
                        dest: 'assets/themes/default/images'
                    }
                ]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            grunt: {
                src: 'Gruntfile.js'
            },
            main: {
                src: ['src/themes/default/js/*.js', '!src/themes/default/js/main.js']
            }
        },

        concat: {
            options: {
                //separator: ';'
            },
            main: {
                src: '<%= jshint.main.src %>',
                dest: 'src/themes/default/js/main.js'
            }
        },

        uglify: {
            options: {
                stripBanners: true,
                banner: '<%=banner%>'
            },
            core: {
                files: [{
                    expand: true,
                    cwd: 'src/themes/default/js',
                    src: ['main.js'],
                    dest: 'assets/themes/default/js',
                    ext: '.min.js'
                }]
            }
        },

        compass: {
		    options: {
				config: 'config.rb'
			},
            core: {
                options: {
                    sassDir: 'src/sass/core',
					cssDir: 'src/css'
                }
            },
            themes: {
                options: {
                    sassDir: 'src/sass/themes/default',
					cssDir: 'src/themes/default/css'
                }
            }
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            core: {
                options: {
                    import: false
                },
                src: ['src/css/*.css']
            },
            themes: {
                options: {
                    import: false
                },
                src: ['src/themes/default/css/*.css']
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            core: {
                options: {
                    map: true
                },
                src: ['src/css/*.css']
            },
            themes: {
                options: {
                    map: true
                },
                src: ['src/themes/default/css/*.css']
            }
        },

        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            core: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'assets/css',
                    ext: '.min.css'
                }]
            },
            themes: {
                files: [{
                    expand: true,
                    cwd: 'src/themes/default/css',
                    src: ['*.css'],
                    dest: 'assets/themes/default/css',
                    ext: '.min.css'
                }]
            }
        },
        usebanner: {
			options: {
				position: 'top',
				banner: '<%= banner %>'
			},
			files: {
				expand: true,
				cwd: 'assets/themes/default/css',
				src: '*.min.css'
			}
        },
        watch: {
            script: {
                files: '<%= jshint.main.src %>',
                tasks: ['jshint:main', 'concat', 'uglify']
            },
            scss: {
                files: 'src/sass/core/**/*.scss',
                tasks: ['compass:core', 'csslint:core', 'autoprefixer:core', 'cssmin:core']
            },
            'themes-scss': {
                files: 'src/sass/themes/**/*.scss',
                tasks: ['compass:themes', 'csslint:themes', 'autoprefixer:themes', 'cssmin:themes', 'usebanner']
            },
            font: {
                files: 'src/fonts/**/*',
                tasks: ['clean:font', 'copy:font']
            },
            image: {
                files: 'src/images/**/*',
                tasks: ['clean:image', 'copy:image']
            },
            'themes-image': {
                files: 'src/themes/default/images/**/*',
                tasks: ['clean:themes-image', 'copy:themes-image']
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default tasks.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'compass', 'csslint', 'autoprefixer', 'cssmin', 'usebanner', 'clean', 'copy', 'watch']);
};

