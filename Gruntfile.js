/*global module:false*/

module.exports = function(grunt) {

  // Load all npm tasks from package.json
  var matchdep = require('matchdep');
  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Because I'm lazy
  var _ = grunt.util._;
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
  grunt.initConfig({
    bower: './bower.json',
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' +
          ' (<%= _.pluck(pkg.licenses, "url").join(", ") %>)' +
          '<%= "\\n" %>' + ' */' +
          '<%= "\\n\\n" %>'
    },
    concat: {
      all: {
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: 'jquery.<%= pkg.name %>.js'
      },
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      }
    },
    uglify: {
      all: {
        files: {
          'jquery.<%= pkg.name %>.min.js': ['<%= concat.all.dest %>']
        },
        options: {
          preserveComments: 'some'
        }
      }
    },
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
      patch: {
        src: [
          '<%= pkg.name %>.jquery.json',
          'package.json',
          'src/jquery.<%= pkg.name %>.js',
          'jquery.<%= pkg.name %>.js'
        ],
        options: {
          release: 'patch'
        }
      },
      same: {
        src: ['package.json', 'src/jquery.<%= pkg.name %>.js', 'jquery.<%= pkg.name %>.js']
      },
      bannerPatch: {
        src: ['jquery.<%= pkg.name %>.js'],
        options: {
          prefix: '- v',
          release: 'patch'
        }
      }
    }
  });


  grunt.registerTask( 'bower', 'Update bower.json', function() {
    var comp = grunt.config('bower'),
        pkgName = grunt.config('pkg').name,
        pkg = grunt.file.readJSON(pkgName + '.jquery.json'),
        json = {};

    ['name', 'version', 'dependencies'].forEach(function(el) {
      json[el] = pkg[el];
    });

    _.extend(json, {
      main: grunt.config('concat.all.dest'),
      ignore: [
        'demo/',
        'lib/',
        'src/',
        '*.json'
      ]
    });
    json.name = 'jquery.' + json.name;

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

  grunt.registerTask('build', ['jshint', 'concat', 'version:same', 'bower', 'uglify', 'docs']);
  grunt.registerTask('patch', ['jshint', 'concat', 'version:bannerPatch', 'version:patch', 'bower', 'uglify']);
  grunt.registerTask('default', ['build']);

};
