module.exports = function(grunt) {
	"use strict";
	
	var banner = function() {
		var date = new Date
		var h = date.getHours()
		var m = date.getMinutes()
		var s = date.getSeconds()
			
		h = h<10 ? '0'+h : h;
		m = m<10 ? '0'+m : m;
		s = s<10 ? '0'+s : s;
		
		var time = h + ':' + m + ':' + s
		
		var str = '/*!\n';
		str += ' * <%= pkg.name %> v<%= pkg.version %>\n';
		str += ' * <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> ' + time + '\n';
		str += ' *\n'
		str += ' */\n';
		
		return str
	}()
	
	var zjs = function() {
		var intro = ['src/intro.js', 'src/support.js', 'src/util.js']
		var lang = ['object', 'function', 'array', 'string', 'class'].map(function(fileName) {
			return 'src/lang/' + fileName + '.js'
		})
		var core = ['selector', 'core', 'is', 'dom', 'event', 'io', 'loader','cache'].map(function(fileName) {
			return 'src/' + fileName + '.js'
		})
		var outro = ['src/outro.js']

		return intro.concat(lang, core, outro)
	}()

	var ui = function() {
		var arr = ['dragdrop', 'tab'].map(function(fileName) {
			return 'src/ui/' + fileName + '.js'
		})
		return arr
	}()

	// 配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				banner: banner
			},
			z: {
				// intro在首部，outro在尾部
				src: zjs,
				dest: 'z.src.js'
			},
			ui: {
				src: ui,
				dest: 'ui.js'
			}
		},
		uglify: {
			options: {
				banner: banner
			},
			z: {
				src: ['z.src.js'],
				dest: 'z.js'
			},
			ui: {
				src: ui,
				dest: 'ui.js'
			}
		}
	})
	
	
	// 载入concat和uglify插件，分别对于合并和压缩
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	
	// 注册任务
	grunt.registerTask('default', ['concat', 'uglify'])
}; 