module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'dxy-plugins/**/*.js']
        },
        concat: {
            js : {
                src : ['dxy-plugins/**/*.js'],
                dest : 'ueditor.dxy.custom.js'
            },
            editorcss: {
                src : ['dxy-plugins/**/editor.css'],
                dest : 'themes/iframe.css'
            } 
        },
        watch: {
            js : {
                files : ['dxy-plugins/**/*.js', 'Gruntfile.js'],
                tasks : ['jshint','concat:js']
            },
            editorcss : {
                files : ['dxy-plugins/**/editor.css'],
                tasks : ['concat:editorcss', 'registerStyle']
            }
        }
    });
    grunt.registerTask('registerStyle','registerStyle', function(){
        var file = require('fs').readFileSync('./themes/iframe.css', {
            encoding : 'utf8'
        });
        var header = require('fs').readFileSync('./dxy-plugins/editorstyle/header.tpl', {
            encoding : 'utf8'
        });
        var footer = require('fs').readFileSync('./dxy-plugins/editorstyle/footer.tpl', {
            encoding : 'utf8'
        });
        var line, reg = /^.+$/img, body='';
        while(line = reg.exec(file)){
            body += "'" + line + "'+\n";
        }
        body = body.slice(0, body.length-2);
        body = 'var styles = ' + body + ';\n';
        require('fs').writeFileSync('./dxy-plugins/editorstyle/style.js', header+body+footer, {
            encoding : 'utf8'
        });
    });
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('build', ['jshint','concat','registerStyle']);
};