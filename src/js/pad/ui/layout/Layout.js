define([
		'keyboard'
	],
	function(HotKey) {
		var gui = require('nw.gui');
		var win = gui.Window.get();

		var $pad = $('#main');
		var $editor = $('#main > #editor');
		var $viewer = $('#main > #viewer');

		var _offset = 50,
			_layout = 'layout0';

		var cls, _cls;
		
		var View = Backbone.View.extend({
			el: '#main',

			events: {},

			initialize: function() {},

			set: function(mode) {
				switch(mode) {
					case 1:
						cls = 'layout1';
					break;
					case 2:
						cls = 'layout2';
					break;
					case 3:
						cls = 'layout3';
					break;
					default:
						cls = 'layout0';
					break;
				}

				this.$el.removeClass(_cls);
				this.$el.addClass(cls);

				_cls = cls;

				nw.editor.refresh();
	    		global._gaq.push('haroopad.view', 'mode', layout);
			},

			moveRight: function() {
				if (_offset > 70) {
					return;
				}

				_offset += 5;

				if (_layout == 'layout0') {
					$editor.css('flex', '1 1 '+ _offset +'%');
					$viewer.css('flex', '1 1 '+ (100-_offset) +'%');
				} else if (_layout == 'layout1') {
					$editor.css('flex', '1 1 '+ (100-_offset) +'%');
					$viewer.css('flex', '1 1 '+ _offset +'%');
				}

				nw.editor.refresh();
			},

			moveLeft: function() {
				if (_offset < 30) {
					return;
				}
				
				_offset -= 5;

				if (_layout == 'layout0') {
					$editor.css('flex', '1 1 '+ _offset +'%');
					$viewer.css('flex', '1 1 '+ (100-_offset) +'%');
				} else if (_layout == 'layout1') {
					$editor.css('flex', '1 1 '+ (100-_offset) +'%');
					$viewer.css('flex', '1 1 '+ _offset +'%');
				}

				nw.editor.refresh();
			}
		});

		var view = new View;

		function setLayout(layout) {
			if (layout == _layout) {
				return;
			}

			switch(layout) {
				case 'reverse':
					layout = 'layout1';
					_offset = 100 - _offset;
				break;
				case 'editor':
					layout = 'layout2';
				break;
				case 'viewer':
					layout = 'layout3';
				break;
				default:
					layout = 'layout0';
					// _offset = 100 - _offset;
				break;
			}

			$pad.removeClass(_layout);
			$pad.addClass(layout);


			
			_layout = layout;

			nw.editor.refresh();
    		global._gaq.push('haroopad.view', 'mode', layout);
		}

		function right5() {
			if (_offset > 70) {
				return;
			}

			_offset += 5;

			if (_layout == 'layout0') {/*
				$editor.css('-webkit-flex', '1 0 '+ _offset +'%');
				$viewer.css('-webkit-flex', '1 0 '+ (100-_offset) +'%');*/
				$editor.css({
					width: _offset +'%',
					right: 100-_offset +'%'
				});
				$viewer.css({
					width: 100-_offset +'%',
					left: _offset +'%'
				})
			} else if (_layout == 'layout1') {/*
				$editor.css('-webkit-flex', '1 0 '+ (100-_offset) +'%');
				$viewer.css('-webkit-flex', '1 0 '+ _offset +'%');*/
				$viewer.css('right', (100-_offset) +'%');
				$viewer.width((100-_offset) +'%');
				$editor.width(_offset +'%');
			}

			nw.editor.refresh();
		}

		function left5() {
			if (_offset < 30) {
				return;
			}
			
			_offset -= 5;

			if (_layout == 'layout0') {
				$editor.css({
					width: _offset +'%',
					right: 100-_offset +'%'
				});
				$viewer.css({
					width: 100-_offset +'%',
					left: _offset +'%'
				})
			} else if (_layout == 'layout1') {
				$viewer.width(_offset +'%');
				$editor.width((100-_offset) +'%');
			}

			nw.editor.refresh();
		}

		HotKey('defmod-alt-1', function() {
			window.ee.emit('view.reset.mode');
		});
		HotKey('ctrl-\\', function() {
			window.ee.emit('view.reset.mode');
		});
		HotKey('defmod-alt-2', function() {
			setLayout('reverse');
		});
		HotKey('defmod-alt-3', function() {
			setLayout('editor');
		});
		HotKey('defmod-alt-4', function() {
			setLayout('viewer');
		});

		HotKey('shift-ctrl-]', function() {
			if (_layout == 'layout0') {
				setLayout('editor');	
			} else if (_layout == 'layout3') {
				window.ee.emit('view.reset.mode');
			}
		});
		HotKey('shift-ctrl-[', function() {
			if (_layout == 'layout2') {
				window.ee.emit('view.reset.mode');
			} else if (_layout == 'layout0') {
				setLayout('viewer');
			}
		});

		HotKey('ctrl-alt-]', function() {
			window.ee.emit('view.minus5.width');
		});
		HotKey('ctrl-alt-[', function() {
			window.ee.emit('view.plus5.width');
		});

		window.ee.on('view.reset.mode', function() {
			setLayout('default');
		});/*
		window.ee.on('view.plus5.width', right5);
		window.ee.on('view.minus5.width', left5);*/

		window.ee.on('view.plus5.width', function() {
			view.moveLeft();
		});
		window.ee.on('view.minus5.width', function() {
			view.moveRight();
		});
		window.ee.on('menu.view.mode', setLayout);
	});