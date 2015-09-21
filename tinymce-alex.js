/*
Plugin URI: http://github.com/kidfiction/tinymce-alex
Description: Integrates  into plugin for (Alex)[http://alex.com].
Version: 0.1
Author: Evan Anderson
Author URI: http://ejdanderson.com
License: GPLv2 or later
*/

// Load Alex Dependency
tinymce.ScriptLoader.load(tinymce.PluginManager.urls.alextinymce + '/alex/alex.js');

// Create tinyMCE Class
tinymce.create('tinymce.plugins.alextinymce', {
	init : function(editor, url) {
		var self = this;
		self.editor = editor;

		// fake jQuery
		self.$ = tinymce.dom.DomQuery;

		// Load CSS
		tinymce.DOM.loadCSS(url + '/tinymce-alex.css');

		editor.on('init', function(e){

			self.$(editor.container).after('<div id="mce-alex-wrapper"><div id="mce-alex-handle"> <span class="mce-alex-toggle">-</span> AlexJS : <span id="mce-alex-count">0</div></div>');
			self.$wrapper = self.$('#mce-alex-wrapper');

			self.$countWrapper = self.$('#mce-alex-count');
			self.$messageWrapper = self.$('<ul id="mce-alex-ul"></ul>').appendTo(self.$wrapper);
			self.rootNode = self.editor.dom.getRoot();
			self.$('#mce-alex-handle').on('click', function(e) {

				if (self.$messageWrapper.hasClass('mce-alex-hide') ) {
					self.$messageWrapper.removeClass('mce-alex-hide');
					self.$('.mce-alex-toggle').html('-');
				}
				else {
					self.$messageWrapper.addClass('mce-alex-hide');
					self.$('.mce-alex-toggle').html('+');
				}
			});

			self.runAlex();

			// WP Specific events, hide Alex wrapper when
			// using text view
			self.$('.switch-html').on('click', function(e) {
				self.hideWrapper();
			});
			self.$('.switch-tmce').on('click', function(e) {
				self.showsWrapper();
			});
		});

		// On node change, run alex. TODO run this on keyup event with debounce implementation
		editor.on('change', function(e) {
			self.runAlex();
		});
	},

	runAlex : function(e) {
		var rawText = this.rootNode.innerText;
		var messages = alex(rawText).messages;
		var html = this.formatMessages(messages);

		if ( messages.length == 0) {
			this.$countWrapper.addClass('mce-alex-zero');
		}
		else {
			this.$countWrapper.removeClass('mce-alex-zero');
		}
		this.$countWrapper.html(messages.length);
		this.$messageWrapper.html(html);
	},

	/*
	walkTree : function() {
		// first remove all bogus wrappers which drive formatting
		// walk all text nodes
		// find first instance of word, continue
			advanced = !! parseInt( window.getUserSetting( 'hidetb' ), 10 ),
		var walker = document.createTreeWalker(this.rootNode, NodeFilter.SHOW_TEXT, null, false);
		var node;
		var results = [];

		while(node = walker.nextNode()) {
		    results.push(node);
		}
		for (var i = 0; i <= results.length - 1; i++) {
			dummyNode = this.editor.dom.create('div', {id : 'test', 'class' : 'myclass'}, 'some content');
			this.editor.dom.insertAfter(dummyNode, results[i]);
			this.editor.dom.remove(results[i]);
		};

		//TODO implement this with debounce and keyup : http://davidwalsh.name/function-debounce
		editor.on( 'nodechange keyup', _.debounce( update, 1000 ) );
		$content.on( 'input keyup', _.debounce( update, 1000 ) );

	},
	*/

	toggleAlex : function() {
		this.$wrapper.toggleClass('mce-alex-hide');
	},

	formatMessages : function(messages) {
		var html = '';
		for (var i = 0; i <= messages.length - 1; i++) {
			 html += '<li>' + this.formatMessage(messages[i]) + '<li>';
		};

		return html;
	},

	formatMessage : function(message) {
		var splitIndex = message.message.indexOf('insensitive'); // insensitive shouldn't be matched

		return message.message.replace(/`(.+?)`/g, function (match, capture, offset) {
			var messageClass = 'mce-alex-sensitive';
			if ( offset < splitIndex ) {
				messageClass = 'mce-alex-insensitive';
			}

			return '<code class="' + messageClass + '">' + capture + '</code>';
		});
	},

	showWrapper : function() {
		this.$wrapper.show();
	},

	hideWrapper : function() {
		this.$wrapper.hide();
	}
});

tinymce.PluginManager.add('alextinymce', tinymce.plugins.alextinymce);
