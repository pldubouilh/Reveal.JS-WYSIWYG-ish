/* Cool things TODO :

+ Refresh index (again)

> More WYSIWYG friendly stuff (meh)

		+ right click, group (meh)
		+ Cool overview slide when slides moved
		+ Snap things, middle & stuff
		+ alt l/r/c on div for center left right position
		+ alt + something for <pre>
		+ oh and fix <pre></pre>

		+ proper WYSIWYG - a fine pain ! Is it really necessary ?
		+ Cleanup hacky CSS in beige.css
*/

// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
	controls: false,
	progress: true,
	history: true,
	center: false,
	transition: 'fade', // none/fade/slide/convex/concave/zoom
	slideNumber: 'c/t',

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
$('.UberTitle').keyup(function() {
	$('section.present > div.hiddenTitle').html($('.UberTitle').html());
});

// Detect paste and update ubertitle. Bad hack is bad
$(document).on('paste', '.UberTitle', function(event) {
	window.setInterval(function(){ //paste fires before the actual pasting
		$('section.present > div.hiddenTitle').html($('.UberTitle').html());
	}, 10);
});

// Display/dissmiss help if needed
$(document).bind('keydown', 'alt+h', function () {
	$('.overlay').toggle();
});
$('.close').click(function() {
	$('.overlay').toggle();
});

// Escape CBs
$(document).on('keydown', false, 'esc', function(event) {
	$('.overlay').hide(); // hide help if required
});

// Blur if escape pressed on a contentEditable
$(document).on('keyup', 'h1, div', function(event) {
	if(event.which == 27)
		if( this.contentEditable == 'true')
			$(this).blur();
});


// New Paragraph - editor only
function newPar(){
	if(! $('.slides').hasClass('borderNotExceed')) return
	$('section.present').append('<div class="draggable textZone" \
	 contenteditable="true" style="position: absolute; left: 357px; top: \
	 310px">New Paragraph</div>');

	dragging();
}

$(document).bind('keydown', 'alt+A', function () {
	newPar();
});


// New Paragraph / fragment - editor only
$(document).bind('keydown', 'alt+z', function () {
	if(! $('.slides').hasClass('borderNotExceed')) return

	$('section.present').append('<div class="draggable fragment textZone" \
	 contenteditable="true"style="position: absolute; left: 256px; top: \
	 310px">New Fragmented Paragraph</div>');

	dragging();
	Reveal.nextFragment();
});


function centerThatText(that, evt){
	$(that).css('left', ($('section.present').width() - $(that).width())/2 );
}

// Center things
$(document).bind('keydown', 'alt+v', function (e) {
	$('section.present').children().each(function( index ) {
		// Some fine jquery dark magic over here !
		// image
		if( $(this).hasClass('item') )
			$(this).children('.draggable').first().css('left', Math.floor(($('section.present').width() - $(this).find('img').first().width())/2) )

		// text
		else
			centerThatText(this, e)
	});
});

// Center only editable when focused
$(document).on('keydown', 'div, h1', 'alt+v', function(event) {
	centerThatText(this)
	event.preventDefault()
});

// Press next/prev through all fragments (if any) till end of current slide
// bad hack is bad !
function nextTillFragmentsOver(){
	var that = $('section.present')
	while (that.hasClass('present'))
		Reveal.navigateRight()
}
function prevTillFragmentsOver(){
	var that = $('section.present')
	while (that.hasClass('present'))
		Reveal.navigateLeft()
}

function resetOverview(){
	if( Reveal.isOverview() ){
		Reveal.toggleOverview()
		Reveal.toggleOverview()
	}
}

// Move to next position
$(document).bind('keydown', 'alt+K', function () {
	Reveal.toggleOverview(true)
	setTimeout(function () {
		$('section.present').next('section').removeClass('future').addClass('past');
		$('section.present').insertAfter($('section.present').next('section'));
		nextTillFragmentsOver();
		resetOverview();
	}, 50);
});


// Move to previous position
$(document).bind('keydown', 'alt+J', function () {
	Reveal.toggleOverview(true)
	setTimeout(function () {
		$('section.present').prev('section').removeClass('past').addClass('future');
		$('section.present').insertBefore($('section.present').prev('section'));
		prevTillFragmentsOver();
		resetOverview();
	}, 50);
});


// New Slide - editor only
$(document).bind('keydown', 'alt+N', function (){
	if(! $('.slides').hasClass('borderNotExceed')) return

	// Copy previous slide name if available
	var title = $('section.present > .hiddenTitle').text();
	if (title.length === 0 || title === undefined)
		title = "New Slide";

	$('section.present').after('<section class="future" aria-hidden="true" style=" \
		display:none;" hidden=""><div class="hiddenTitle" style="display:none;">' + title  + ' \
		</div><div contenteditable="true" class="draggable textZone" \
		style="position: absolute; left: 414px; top:310px"> Content</div></section>');

	dragging();
	nextTillFragmentsOver();
});


// New Slide Center  - editor only
$(document).bind('keydown', 'alt+I', function (){
	if(! $('.slides').hasClass('borderNotExceed')) return

	$('section.present').after('<section class="future center" aria-hidden="true" style="\
	display:none;" hidden=""><div class="hiddenTitle" style="display:none;"></div>\
	<h1 contenteditable="true" style="font-size: 1.9em" class="draggable \
	textZone">Important stuff</h1></section>');

	dragging();
	nextTillFragmentsOver();
});


// Remove text ...
$(document).on('keydown', 'div, h1', 'alt+R', function(event) {
	// remove text if selected !
  if( this.contentEditable == 'true')
    $(this).remove();
});


//  Remove slide if empty
$(document).on('keydown', null, 'alt+R', function(event) {
	// slide empty ? remove
	if($('section.present').children().length == 1){
		// Switch stuff, and update title
		var toRemove = $('section.present')
		toRemove.prev('section').removeClass('past').addClass('present');
		toRemove.removeClass('present').remove();
		$('.UberTitle').html($('.present > .hiddenTitle').html());
	}
});


// Text-align on the left/center
$(document).on('keydown', '.textZone', 'alt+l', function(event) {
	var align = $(this).css('text-align')

	if (align == 'left')
		$(this).css('text-align', 'center')

	else if (align == 'center')
		$(this).css('text-align', 'left')

	event.preventDefault();
});


/* ******* click click click ********** */

var flagClick = false;

// Disable new par when dblclick (uber) titlez
// Click necessary as focus fires too late when dblclick
$(document).on('click', '.UberTitle, h1', function(event) {
	flagClick = true; // prevent new par on dblclick
	$(this).focus();
});
$(document).on('blur', '.UberTitle, h1', function(event) {
	flagClick = false;
});


// New par on doubleclick
$(document).on('dblclick', '.slides:not(.textZone)', function(event) {
	if(flagClick) return;

	var offset = $('.slides').offset();
	var factor = (1 / $('.slides').css('zoom')) ;

	var mousePos = {
			left: (factor * event.pageX) - (offset.left),
			top:  (factor * event.pageY) - (offset.top)
	};

	if(! $('.slides').hasClass('borderNotExceed')) return
	$('section.present').append('<div class="draggable textZone" \
	 contenteditable="true" style="position: absolute; \
	 left: ' + mousePos.left + 'px; top:' + mousePos.top + 'px;"> \
	 New Paragraph</div>');

	dragging();
});


// Remove image when doubleclick'in
$(document).on('dblclick', '.ui-wrapper', function(e) {

	$(this).parent().parent().remove();
	flagClick = true

	// Prevent new-par to fire.
	window.setInterval(function(){
		flagClick = false
	}, 10);
});


// Text clicked/unclicked >> Disable/re-enable drag
$(document).on('click', '.textZone', function(event) {
  	flagClick = true; // prevent new par on dblclick

		if($(this).hasClass('ui-draggable'))
  		$(this).draggable('destroy');
});
$(document).on('blur', '.textZone', function(event) {
	var zoom = $('.slides').css('zoom');
	flagClick = false;

	// Deselect anything that might still be selected
	document.getSelection().removeAllRanges();

	$(this).draggable({
		start: function( event, ui ) {
			$(this).css('transition', 'none');
		},
		stop: function( event, ui ) {
			$(this).css('transition', 'all 0.2s ease');
		},
		cursor: 'move',
		// Hack to remove effect of the zoom
		drag: function(evt,ui) {
			var factor = (1 / zoom) -1 ;
			ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
			ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor);
		}
	});
});


/* *************** Editor mode ************* */


function disableEditing(){
	$('.draggable').draggable('destroy');
	$('.resizable').resizable('destroy');
	$('body').attr('spellcheck','false');

	$('div, h1').each(function(index,element){
		if ($(element).attr('contenteditable') == 'true')
			$(element).attr('contenteditable','false');
	});
}

function enableEditing(){
	dragging();
	$('.resizable').resizable({ aspectRatio: true	});

	$('div, h1').each(function(index,element){
		if ($(element).attr('contenteditable') == 'false')
			$(element).attr('contenteditable','true');
	});

}

function modeEditorOff(){
	disableEditing();
	$('.slides').removeClass('borderNotExceed');
	$('body').removeClass('checkerboardDark');
}


function modeEditorOn(){
	enableEditing();
	$('.slides').addClass('borderNotExceed');
	$('body').addClass('checkerboardDark');
}


// Switch to presentation/editor mode
$(document).bind('keydown', 'alt+P', function () {
	if($('.slides').hasClass('borderNotExceed'))
		modeEditorOff();
	else
		modeEditorOn();
});

// Disable/enable editing depending on the overview mode
Reveal.addEventListener('overviewshown',function(event){
	disableEditing();
});
Reveal.addEventListener('overviewhidden',function(event){
	enableEditing();
});


var socket = io();
var timeOutDl

socket.on('isDlOk', function(payload){
	if (payload === 'ok'){
		clearTimeout(timeOutDl)

		$('.dlHelper').css('opacity', '1')
		setTimeout(function () {
			$('.dlHelper').css('opacity', '0')
		}, 1300);

		modeEditorOn();
	}
});


// Save
$(document).bind('keydown', 'alt+S', function () {
	modeEditorOff();

	// Try to get a name
	var title = $('.slides').children('section').first().children('h1').first().text();

	if (title === undefined)
	  var title = 'AmazingSlides'+ new Date().getDate() + '/' + new Date().getDay()


	// Trying local saving
	socket.emit('dlPage', {
		content: document.documentElement.innerHTML,
		name: title
	});

	// Timeout to local stuff otherwise
	timeOutDl = setTimeout(function (title) {
		console.log('Timeout ! Saving locally');

		if (title !== undefined && title.length > 0)
			download(document.documentElement.innerHTML, title + '.html', 'text/html');
		else
		  download(document.documentElement.innerHTML, 'slides.html', 'text/html');

		modeEditorOn();
	}, 3*1000);
});


// Warning on quit
$(window).bind('beforeunload', function(){
	return 'Have you saved (ALT + S) your slides ?';
});


// Dragging, and disable animation when dragged
function dragging(){
	var zoom = $('.slides').css('zoom');

	$('.draggable').draggable({
		start: function( event, ui ) {
			$(this).css('transition', 'none');
		},
		stop: function( event, ui ) {
			$(this).css('transition', 'all 0.2s ease');
		},
		cursor: 'move',
		// Hack to remove effect of the zoom
		drag: function(evt,ui) {
	    var factor = (1 / zoom) -1 ;
	    ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
	    ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor);
		}
	});
}

// Check out https://github.com/gthmb/jquery-free-transform

/* ************ Drag and drop *********** */

var dropper = document.getElementById('downloadID');
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
	var div = document.createElement('div');
	div.className = 'item';

	if(/^data:image/.test(dataUri)) {
		var imgDiv = document.createElement('div');
		imgDiv.className = 'draggable';
		var img = document.createElement('img');
		img.src = dataUri;
		img.className = 'resizable';
		img.style['width'] = '300px';
		imgDiv.appendChild(img);
		div.appendChild(imgDiv);
	}

	var newImg = $('section.present').append(div);
	$('.resizable').resizable({ aspectRatio: true	});
	dragging();
}
