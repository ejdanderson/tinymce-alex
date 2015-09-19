//TODO Don't rely on jQuery
(function($) {
	tinymce.create('tinymce.plugins.alextinymce', {
		init : function(editor, url) {
			var self = this;
			self.editor = editor;

			// TODO
			// On content load run alex

			editor.on('init', function(e){
				// parentElement.parentElement.parentElement is WP Specific, need to insert after wordcount etc...
				self.$alexWrapper = $('<div class="alex-tinymce-wrapper"></div>').insertAfter(editor.container);
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
			this.$alexWrapper.html(html);
		},

		formatMessages : function(messages) {
			var html = '';
			for (var i = 0; i <= messages.length - 1; i++) {
				 html += messages[i].message + '<br />';
			};

			return html;
		}
	});

	tinymce.PluginManager.add('alextinymce', tinymce.plugins.alextinymce);
})(jQuery);