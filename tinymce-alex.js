(function($) {
	tinymce.PluginManager.add('alextinymce', function(editor, url) {
		// On content load run alex
		// TODO

		// On node change, run alex
		editor.on('change', function(e) {
			var content = editor.getContent();
			var rawText = $(content).text();

			console.log(alex(rawText).messages);
		});
	});
})(jQuery);