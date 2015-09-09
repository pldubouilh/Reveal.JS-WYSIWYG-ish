/* Cool things TODO :

	> priority

		+ Display new fragment ASAP

	> More WYSIWYG friendly stuff (meh)

		+ Cool overview slide when slides moved
		+ Snap things, middle & stuff
		+ alt l/r/c on div for center left right position
		+ alt + something for code
		+ proper WYSIWYG - a fine pain ! Is it really necessary ?
		+ Cleanup hacky CSS in beige.css
		+ Put right extension on save
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


// Init in editor
modeEditorOn();

// Title editable, & stored inside slide on each keystroke
$( ".UberTitle" ).keyup(function() {
	$("section.present > div.hiddenTitle").html($(".UberTitle").html());
});


// Display/dissmiss help if needed
$(document).bind('keydown', 'alt+h', function () {
	$(".overlay").toggle();
});
$( ".close" ).click(function() {
	$(".overlay").toggle();
});
$(document).on('keydown', false, 'esc', function(event) {
	$(".overlay").hide(); // hide help if required
});

// New Paragraph - editor only
$(document).bind('keydown', 'alt+A', function () {
	if(! $(".slides").hasClass("borderNotExceed")) return
	$("section.present").append("<div class=\"draggable textZone\" contenteditable=\"true\" style=\"position: absolute; left: 425px; top: 310px\">New Paragraph</div>");
	dragging();
});


// New Paragraph / fragment - editor only
$(document).bind('keydown', 'alt+z', function () {
	if(! $(".slides").hasClass("borderNotExceed")) return
	$("section.present").append("<div class=\"draggable fragment textZone\" contenteditable=\"true\"style=\"position: absolute; left: 425px; top: 310px\">New Paragraph</div>");
	dragging();
});

// Center things
$(document).bind('keydown', 'alt+v', function () {
	$("section.present").children().each(function( index ) {

		// Some fine jquery dark magic over here !
		// image
		if( $(this).hasClass("item") )
			$(this).children(".draggable").first().css("left", Math.floor(($("section.present").width() - $(this).find("img").first().width())/2) );

		// text
		else
			$(this).css("left", ($("section.present").width() - $(this).width())/2 );
	});
});

// Move to next
$(document).bind('keydown', 'alt+K', function () {
	$("section.present").next("section").removeClass("future").addClass("past");
	$("section.present").insertAfter($("section.present").next("section"));
});


// Move to previous
$(document).bind('keydown', 'alt+J', function () {
	$("section.present").prev("section").removeClass("past").addClass("future");
	$("section.present").insertBefore($("section.present").prev("section"));
});


// New Slide - editor only
$(document).bind('keydown', 'alt+N', function (){
	if(! $(".slides").hasClass("borderNotExceed")) return

	$("section.present").after("<section class=\"future\" aria-hidden=\"true\" style=\"\
	display:none;\" hidden=\"\"><div class=\"hiddenTitle\" style=\"display:none;\">Slide Title</div>\
	<div contenteditable=\"true\" class=\"draggable textZone\" style=\"position: absolute; left: 425px; top:\
	310px\">Content</div></section>");

	dragging();
});


// New Slide Center  - editor only
$(document).bind('keydown', 'alt+I', function (){
	if(! $(".slides").hasClass("borderNotExceed")) return

	$("section.present").after("<section class=\"future center\" aria-hidden=\"true\" style=\"\
	display:none;\" hidden=\"\"><div class=\"hiddenTitle\" style=\"display:none;\"></div>\
	<h1 contenteditable=\"true\" class=\"draggable textZone\">Important stuff</h1></section>");

	dragging();
});


// Remove some stuff if available ...
$(document).on('keydown', 'div, h1', 'alt+R', function(event) {
	// Image selected ? Remove !
	if (imgFocus != null)
		$(imgFocus).parent().parent().remove();

	// no image ? remove text if selected !
  else if( this.contentEditable == "true")
    $(this).remove();
});

// ...Remove slide if empty
$(document).on('keydown', null, 'alt+R', function(event) {
	if($("section.present").children().length == 1){
		var toRemove = $("section.present")
		toRemove.prev("section").removeClass("past").addClass("present");
		toRemove.removeClass("present").remove();
	}
});


// Blur if escape pressed on a contentEditable
$(document).on('keyup', 'h1, div', function(event) {
	if(event.which == 27){
		if( this.contentEditable == "true" ){
			$(this).blur();
			return;
		}
		else
			deselectImage(); // auto check if something is to be deselected

	}
});


// Get keystroke - action on delete/backspace
/*
$(document).on('keydown', 'body', function(event) {
	if(event.which == 46 || event.which == 8){

		// Delete image if one's selected
		if (imgFocus != null){
			console.log('delImg');
			$(imgFocus).parent().parent().remove();
			event.preventDefault();
		}
	}
});
*/


/* *********** Image selection/deselection ************ */

var flag = false;
var imgFocus = null;


function deselectImage(){
	if (imgFocus != null){
		$(imgFocus).css("border-color","rgba(79, 64, 28, 0)");
		imgFocus = null
	}
}

// Remove img selection if something else clicked
$(document).on('mousedown', '.slides', function(event) {
	if (flag == true) return; // bad hack is bad
	deselectImage();
});

// Image clicked
$(document).on('mousedown', '.ui-wrapper', function(event) {
	if (imgFocus != this){
		imgFocus = this
		$(imgFocus).css("border-color","rgba(79, 64, 28, 0.99)");
	}

	// bad bad bad bad bad bad bad bad
	// Wee delay to prevent two events to occur
	flag = true
	window.setInterval(function(){
		flag = false
	}, 10);
});

// Left / right > deselect image
$(document).on('keyup', 'body', function(event) {
	if(event.which == 39 || event.which == 37)
		deselectImage();
});


/* *************** Editor mode ************* */

function modeEditorOff(){
	$(".draggable").draggable("destroy");
	$(".resizable").resizable("destroy");

	$("body").attr("spellcheck","false");

	$("div, h1").each(function(index,element){
		if ($(element).attr("contenteditable") == "true")
			$(element).attr("contenteditable","false");
	});

	$(".slides").removeClass("borderNotExceed");
	$("body").removeClass("checkerboardDark");
}


function modeEditorOn(){
	dragging();
	$(".resizable").resizable({ aspectRatio: true	});

	$("body").attr("spellcheck","true");

	$("div, h1").each(function(index,element){
		if ($(element).attr("contenteditable") == "false")
			$(element).attr("contenteditable","true");
	});

	$(".slides").addClass("borderNotExceed");
	$("body").addClass("checkerboardDark");
}


// Toggle editor mode
$(document).bind('keydown', 'alt+P', function () {
	// Switch to presentation/editor mode
	if($(".slides").hasClass("borderNotExceed"))
		modeEditorOff();
	else
		modeEditorOn();
});


// Save
$(document).bind('keydown', 'alt+S', function () {
	modeEditorOff();
	output = document.documentElement.innerHTML;
	document.location =	'data:html/attachment;base64,' + window.btoa(unescape(encodeURIComponent(output)));
	modeEditorOn();
});


// Warning on quit
$(window).bind('beforeunload', function(){
	return 'Have you saved (ALT + S) your slides ?';
});


// Dragging, and disable animation when dragged
function dragging(){
	var zoom = $('.slides').css('zoom');

	$(".draggable").draggable({
		start: function( event, ui ) {
			$(this).css("transition", "none");
		},
		stop: function( event, ui ) {
			$(this).css("transition", "all 0.2s ease");
		},
		cursor: "move",
		// Hack to remove effect of the zoom
		drag: function(evt,ui) {
	    var factor = (1 / zoom) -1 ;
	    ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
	    ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor);
		}
	});
}


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
	dragging();
	$(".resizable").resizable({ aspectRatio: true	});
}
