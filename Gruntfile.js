/*global module:false*/

module.exports = function(grunt) {
  var destFile = 'jquery.defaulttext.js';
  var srcFile = 'src/' + destFile;

  // Load all npm tasks from package.json
  var matchdep = require('matchdep');
  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var _ = require('lodash');
  var marked = require('marked');
  // var hl = require('highlight').Highlight;
  //
  var hl = require('node-syntaxhighlighter');
  marked.setOptions({
    highlight: function(code, lang) {
      lang = lang || 'javascript';
      lang = hl.getLanguage(lang);

      return hl.highlight(code, lang);
    },
    gfm: true
  });

  // Project configuration.
  var gruntConfig = {
    bower: './bower.json',
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Requires jQuery <%= pkg.dependencies.jquery %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= pkg.license %>' +
          ' (http://www.opensource.org/licenses/mit-license.php)' +
          '<%= "\\n" %>' + ' */' +
          '<%= "\\n\\n" %>'
    },
    concat: {
      all: {
        src: [srcFile],
        dest: destFile
      },
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      }
    },
    // uglify: {
    //   all: {
    //     files: {
    //       'jquery.defaulttext.min.js': ['<%= concat.all.dest %>']
    //     },
    //     options: {
    //       preserveComments: 'some'
    //     }
    //   }
    // },
    watch: {
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint:all']
      },
      docs: {
        files: ['readme.md', 'lib/tmpl/**/*.html'],
        tasks: ['docs']
      }

    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        curly: true,
        // eqeqeq: true,
        // immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          require: false
        }
      }
    },
    version: {
      same: {
        src: ['package.json', destFile]
      },
      bannersame: {
        src: [destFile],
        options: {
          prefix: '- v',
        }
      }
    }
  };

  var releases = ['patch', 'minor', 'major'];

  releases.forEach(function(release) {
    gruntConfig.version[release] = {
      src: [
        'package.json',
      ],
      options: {
        release: release
      }
    };

    gruntConfig.version['banner' + release] = {
      src: [destFile],
      options: {
        prefix: '- v',
        release: release
      }
    };
  });

  grunt.config.init(gruntConfig);

  grunt.registerTask( 'bower', 'Update bower.json', function() {
    var comp = grunt.config('bower');
    var pkg = grunt.file.readJSON('package.json');
    var json = {
      name: 'jquery.defaulttext',
      version: pkg.version,
      main: grunt.config('concat.all.dest'),
      dependencies: pkg.dependencies,
      ignore: [
        'demo/',
        'lib/',
        'src/',
        '*.json'
      ]
    };

    grunt.file.write( comp, JSON.stringify(json, null, 2) );
    grunt.log.writeln( 'File "' + comp + '" updated."' );
  });

  grunt.registerTask('docs', 'Convert readme.md to html and concat with header and footer for index.html', function() {
    var readme = grunt.file.read('readme.md'),
        head = grunt.template.process(grunt.file.read('lib/tmpl/header.tpl')),
        foot = grunt.file.read('lib/tmpl/footer.tpl'),
        doc = marked(readme);


    grunt.file.write('index.html', head + doc + foot);
  });

  grunt.registerTask('build', ['jshint', 'concat', 'version:same', 'bower', 'docs']);
  releases.forEach(function(release) {
    grunt.registerTask(release, ['jshint', 'concat', 'version:banner' + release, 'version:' + release, 'bower']);
  });

  grunt.registerTask('default', ['build']);

};
