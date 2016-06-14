# grunt-require-html

> transform html to js require module

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-require-html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-require-html');
```

## The "require_html" task

### Overview
In your project's Gruntfile, add a section named `require_html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  require_html: {
    options: {
      paths : {
		'filepathname' : 'rename'
  	  }
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      test: {
        files: {
          'tmp/test.js': ['test/*.html']
        }
      }
    },
  },
});
```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
