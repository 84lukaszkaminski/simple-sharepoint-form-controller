module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: {
                options: {
                    undef: true,
                    unused: true,
                    globals: {
                        window: true
                    }
                },
                files: {
                    src: [
                        'base/**/*.js',
                        'form/**/*.js',
                        'utils/**/*.js',
                        'sandbox.js'
                    ]
                }
            }
        },
        uglify: {
            all: {
                files: [
                    {
                        src: ['sandbox.js', 'utils/**/*.js', 'base/**/*.js', 'form/**/*.js'],
                        dest: 'src/simpleSharepointFormController.min.js'
                    }
                ]
            }
        },
        cssmin: {
            all: {
                files: [
                    {
                        src: ['styles.css'],
                        dest: 'src/simpleSharepointFormController.min.css'
                    }
                ]
            }
        },
        copy: {
            libs: {
                files: [
                    {
                        src: ['node_modules/moment/min/moment.min.js'],
                        dest: 'libs/moment.min.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['copy:libs', 'uglify:all', 'cssmin:all']);
    grunt.registerTask('hint', ['jshint:all']);
};