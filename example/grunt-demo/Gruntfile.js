'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    //载入npm的库清单，必须
    pkg: grunt.file.readJSON('package.json'),

    //以下是插件的具体配置，各种插件的配置可参考官网，下面是一些例子
    //concat，合并文件
    concat: {
      options: { separator: ';' }, //合并的分隔符
      dist: {
        src: ['src/*.js'], //要合并的文件
        dest: 'dest/<%= pkg.name %>.js', //合成后的文件
      },
    },

    //minify js  压缩JS
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
      }, //banner 就是在压缩后的文件开头生成一个标签，这里是名字+日期
      dist: {
        src: ['<%= concat.dist.dest %>'], //表示要压缩concat之后的文件
        dest: 'dest/<%= pkg.name %>.min.js', //压缩后的文件
      },
    },

    //单元测试的工具
    qunit: {
      files: ['test/*.html'],
    },
    //js的语法检查
    jshint: {
      files: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
    },
    //实现监控的工具，开启后每次改动文件都会执行里面定义的任务
    watch: {
      files: ['<%= jshint.files %>', '<%= qunit.files %>'],
      tasks: ['jshint', 'qunit'],
    },
  });

  //载入库，必须的
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // 默认任务，命令行输入'grunt'运行，分先后顺序
  grunt.registerTask('default', ['concat', 'uglify']);

  // 自定义任务, 命令行输入 'grunt test' 运行，test就是自定义的名字
  grunt.registerTask('test', ['jshint', 'qunit', 'watch']);
};
