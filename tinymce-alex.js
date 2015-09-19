//TODO Don't rely on jQuery
(function($) {
	// Load Alex Dependency
	tinymce.ScriptLoader.load( tinymce.PluginManager.urls.alextinymce + '/alex/alex.js');

	// Create tinyMCE Class
	tinymce.create('tinymce.plugins.alextinymce', {
		init : function(editor, url) {
			var self = this;
			self.editor = editor;

			// Load CSS
			tinymce.DOM.loadCSS(url + '/tinymce-alex.css');

			// TODO
			// On content load, run alex

			editor.on('init', function(e){
				var $wrapper = $('<div id="alex-tinymce-wrapper"><div id="alex-tinymce-handle"> > AlexJS</div></div>').insertAfter(editor.container);
				self.$messageWrapper = $('<div id="alex-tinymce-innerwrapper"></div>').appendTo($wrapper);
			});

			// On node change, run alex
			editor.on('change', function(e) {
				self.runAlex();
			});
		},

		runAlex : function() {
			var content = this.editor.getContent();
			var rawText = $(content).text();
			var html = this.formatMessages(alex(rawText).messages);
			console.log(alex(rawText).messages);
			this.$messageWrapper.html(html);
		},

		formatMessages : function(messages) {
			var html = '';
			for (var i = 0; i <= messages.length - 1; i++) {
				 html += this.addMessageClass(messages[i]) + '<br />';
			};

			return html;
		},

		addMessageClass : function(message) {
			var splitIndex = message.message.indexOf('insensitive'); // insensitive shouldn't be matched

			return message.message.replace(/`(.+?)`/g, function (match, capture, offset) {
				var messageClass = 'mce-alex-sensitive';
				if ( offset < splitIndex ) {
					messageClass = 'mce-alex-insensitive';
				}

				return '<code class="' + messageClass + '">' + capture + '</code>';
			});
		}
	});

	tinymce.PluginManager.add('alextinymce', tinymce.plugins.alextinymce);
})(jQuery);