module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'dxy-plugins/**/*.js']
        },
        concat: {
            build : {
                src : ['dxy-plugins/**/*.js'],
                dest : 'ueditor.dxy.custom.js'
            }        
        },
        watch: {
            js : {
                files : ['dxy-plugins/**/*.js', 'Gruntfile.js'],
                tasks : ['jshint','concat:build']
            }
        }
    });
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('build', ['jshint','concat:build']);
};