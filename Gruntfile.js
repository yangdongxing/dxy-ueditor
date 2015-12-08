module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'dxy-plugins/**/{toolbar,plugin}.js']
        },
        concat: {
            plugin : {
                src : ['dxy-plugins/**/*.js','!dxy-plugins/**/extend.js'],
                dest : 'ueditor.dxy.custom.js'
            },
            editorcss: {
                src : ['dxy-plugins/**/editor.css'],
                dest : 'themes/iframe.css'
            },
            wechatcss : {
                src : ['dxy-plugins/**/wechat.css'],
                dest : 'themes/wechat.css'
            },
            extend : {
                src : ['dxy-extend/view.js','dxy-extend/template.js', 'dxy-plugins/**/extend.js'],
                dest : 'ueditor.dxy.extend.js'
            },
            modal : {
                src : ['dxy-plugins/**/modal.tpl'],
                dest : 'dxy-plugins/modals/dxy-plugin-modals.tpl'
            }
        },
        watch: {
            js : {
                files : ['dxy-plugins/**/*.js', 'Gruntfile.js', 'dxy-extend/**/*.js'],
                tasks : ['jshint','concat:plugin', 'concat:extend']
            },
            editorcss : {
                files : ['dxy-plugins/**/editor.css'],
                tasks : ['concat:editorcss', 'registerStyle']
            },
            wechatcss: {
                files : ['dxy-plugins/**/wechat.css'],
                tasks : ['concat:wechatcss', 'registerWechatStyle']
            },
            modal : {
                files : ['dxy-plugins/**/modal.tpl'],
                tasks : ['concat:modal', 'registerModal']
            },
            replacedview : {
                files : ['dxy-plugins/**/*.view'],
                tasks : ['require_html']
            }
        },
        require_html: {
            options: {
                
            },
            replacedview: {
                files: {
                  'dxy-extend/template.js': ['dxy-plugins/**/*.view']
                }
            },
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
        while((line = reg.exec(file))){
            body += "'" + line + "'+\n";
        }
        body = body.slice(0, body.length-2);
        body = 'var styles = ' + body + ';\n';
        require('fs').writeFileSync('./dxy-plugins/editorstyle/plugin.js', header+body+footer, {
            encoding : 'utf8'
        });
    });
    grunt.registerTask('registerWechatStyle','registerWechatStyle', function(){
        var file = require('fs').readFileSync('./themes/wechat.css', {
            encoding : 'utf8'
        });
        var header = require('fs').readFileSync('./dxy-plugins/wechatstyle/header.tpl', {
            encoding : 'utf8'
        });
        var footer = require('fs').readFileSync('./dxy-plugins/wechatstyle/footer.tpl', {
            encoding : 'utf8'
        });
        var line, reg = /^.+$/img, body='';
        while((line = reg.exec(file))){
            body += "'" + line + "'+\n";
        }
        body = body.slice(0, body.length-2);
        body = 'var styles = ' + body + ';\n';
        require('fs').writeFileSync('./dxy-plugins/wechatstyle/plugin.js', header+body+footer, {
            encoding : 'utf8'
        });
    });
    grunt.registerTask('registerModal','registerModal', function(){
        var file = require('fs').readFileSync('./dxy-plugins/modals/dxy-plugin-modals.tpl', {
            encoding : 'utf8'
        });
        var header = require('fs').readFileSync('./dxy-plugins/modals/header.tpl', {
            encoding : 'utf8'
        });
        var footer = require('fs').readFileSync('./dxy-plugins/modals/footer.tpl', {
            encoding : 'utf8'
        });
        var line, reg = /^.+$/img, body='';
        while((line = reg.exec(file))){
            body += "'" + line + "'+\n";
        }
        body = body.slice(0, body.length-2);
        body = 'var modals = ' + body + ';\n';
        require('fs').writeFileSync('./dxy-plugins/modals/plugin.js', header+body+footer, {
            encoding : 'utf8'
        });
    });
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('build', ['jshint', 'concat','registerStyle']);
};