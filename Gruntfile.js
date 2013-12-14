module.exports = function(grunt) {
	"use strict";
	
	var banner = function() {
		var date = new Date,
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
			
		h = h<10 ? '0'+h : h;
		m = m<10 ? '0'+m : m;
		s = s<10 ? '0'+s : s;
		
		var time = h + ':' + m + ':' + s;
		
		var str = '/*!\n';
		str += ' * <%= pkg.name %> v<%= pkg.version %>\n';
		str += ' * <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> ' + time + '\n';
		str += ' *\n'
		str += ' */\n';
		
		return str;
	}();
	
	var concat = function() {
		var intro = ['src/intro.js', 'src/support.js', 'src/util.js']
		var lang = ['object.js', 'function.js', 'array.js', 'string.js', 'class.js'].map(function(fileName) {
			return 'src/lang/' + fileName
		})
		var core = ['selector.js', 'core.js', 'is.js', 'dom.js', 'event.js', 'io.js', 'cache.js'].map(function(fileName) {
			return 'src/' + fileName
		})
		var outro = ['src/outro.js']

		return intro.concat(lang, core, outro)
	}()


	// 配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				banner: banner
			},
			zjs: {
				// intro在首部，outro在尾部
				src: concat,
				dest: 'z.src.js'
			}
		},
		uglify: {
			options: {
				banner: banner
			},
			build: {
				src: ['z.src.js'],
				dest: 'z.js'
			}
		}
	});
	
	
	// 载入concat和uglify插件，分别对于合并和压缩
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// 注册任务
	grunt.registerTask('default', ['concat', 'uglify']);
}; 