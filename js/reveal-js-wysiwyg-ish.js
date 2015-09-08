/* Cool things TODO :
	+ WYSIWYG - a fine pain ! Is it really necessary ?
	+ Cool overview slide when slides moved
	+ Cleanup hacky CSS in beige.css
	+ Clean code
	+ Put right extension on save
	+ Remove effect when dragging (event shoud fire) - causes lag
*/

// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
	controls: true,
	progress: true,
	history: true,
	center: false,
	transition: 'fade', // none/fade/slide/convex/concave/zoom

	// Optional reveal.js plugins
	dependencies: [
		{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
		{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
		{ src: 'plugin/zoom-js/zoom.js', async: true },
		{ src: 'plugin/notes/notes.js', async: true }
	]
});


// New Paragraph
$(document).bind('keydown', 'alt+A', function () {
	$("section.present").append("<div class=\"draggable\" contenteditable=\"true\">New Paragraph</div>");
	$(".draggable").draggable({ grid: [ 5, 5 ] });
});

// New Paragraph / fragment
$(document).bind('keydown', 'alt+z', function () {
	$("section.present").append("<div class=\"draggable fragment\" contenteditable=\"true\">New Paragraph</div>");
	$(".draggable").draggable({ grid: [ 5, 5 ] });
});

// Move to next
$(document).bind('keydown', 'alt+K', function () {
	$("section.present").next("section").removeClass("future");
	$("section.present").next("section").addClass("past");
	$("section.present").insertAfter($("section.present").next("section"));
});

// Move to previous
$(document).bind('keydown', 'alt+J', function () {
	$("section.present").prev("section").removeClass("past");
	$("section.present").prev("section").addClass("future");
	$("section.present").insertBefore($("section.present").prev("section"));
});

// Toggle not exceed frame
$(document).bind('keydown', 'alt+P', function () {
	$(".slides").toggleClass("borderNotExceed");
	$("body").toggleClass("checkerboardDark");
});

// New Slide
$(document).bind('keydown', 'alt+N', function (){
	$("section.present").after("<section class=\"future\" aria-hidden=\"true\" style=\"\
	display:none;\" hidden=\"\"><div class=\"hiddenTitle\" style=\"display:none;\">Slide Title</div>\
	<div contenteditable=\"true\" class=\"draggable\">Content</div></section>");

	$(".draggable").draggable({ grid: [ 5, 5 ] });
});

// New Slide Center
$(document).bind('keydown', 'alt+I', function (){
	$("section.present").after("<section class=\"future center\" aria-hidden=\"true\" style=\"\
	display:none;\" hidden=\"\"><div class=\"hiddenTitle\" style=\"display:none;\"></div>\
	<h1 contenteditable=\"true\" class=\"draggable\">Important stuff</h1></section>");

	$(".draggable").draggable({ grid: [ 5, 5 ] });
});

// Save
function utf8_to_b64( str ) {
	return window.btoa(unescape(encodeURIComponent( str )));
}

$(document).bind('keydown', 'alt+S', function () {
	$(".draggable").draggable("destroy");
	$(".resizable").resizable("destroy");

	output = document.documentElement.innerHTML;
	document.location =	'data:html/attachment;base64,' + utf8_to_b64(output);

	$(".draggable").draggable({ grid: [ 5, 5 ] });
	$(".resizable").resizable({ aspectRatio: true	});

});

// Warning on quit
$(window).bind('beforeunload', function(){
	return 'Have you saved (ALT + S) your slides ?';
});

// Title editable, & stored inside slide on each keystroke
$( ".UberTitle" ).keyup(function() {
	$("section.present > div.hiddenTitle").html($(".UberTitle").html());
});

// Init Resizable & Draggable
$(".draggable").draggable({ grid: [ 5, 5 ] });
$(".resizable").resizable({ aspectRatio: true	});



/* ******** Drag and drop ******* */
var dropper = document.getElementById("downloadID");
dropper.ondragover = function () { return false; };
dropper.ondragend = function () { return false; };

dropper.ondrop = function (e) {
	e.preventDefault();
	var files = [].slice.call(e.dataTransfer.files);
	files.forEach(function (file) {
		var reader = new FileReader();
		reader.onload = function(event) {
			fileLoaded(file.name, event.target.result);
		};
		reader.readAsDataURL(file);
	});
	return false;
};

function fileLoaded(filename, dataUri) {
	var div = document.createElement("div");
	div.className = 'item';

	if(/^data:image/.test(dataUri)) {
		var imgDiv = document.createElement("div");
		imgDiv.className = 'draggable';
		var img = document.createElement("img");
		img.src = dataUri;
		img.className = 'resizable';
		img.style['width'] = '300px';
		imgDiv.appendChild(img);
		div.appendChild(imgDiv);
	}

	$("section.present").append(div);
	$(".draggable").draggable({ grid: [ 5, 5 ] });
	$(".resizable").resizable({ aspectRatio: true	});
}
