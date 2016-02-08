module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: ['Gruntfile.js', 'src/main.js']
        },
        jscs: {
            src: [
                'Gruntfile.js',
                'src/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        },
        concat: {
            dist: {
                src: ['src/main.js'],
                dest: 'dist/<%= pkg.name %>.js',
                nonull: true
            }
        },
        uglify: {
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['jshint', 'jscs', 'concat', 'uglify']);
};