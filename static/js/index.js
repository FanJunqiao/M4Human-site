window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/MMFI_interp";
var NUM_INTERP_FRAMES = 96;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})



// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('teaser-slider');
  const frameSpan = document.getElementById('teaser-frame');
  const totalSpan = document.getElementById('teaser-frame-total');
  if (!slider || !frameSpan || !totalSpan) return;

  // Find the video in the same section as the slider
  const section = slider.closest('section');
  const video = section ? section.querySelector('video') : null;
  if (!video) return;

  const fps = Number(video.dataset.fps) || 30;

  video.addEventListener('loadedmetadata', () => {
    const totalFrames = Math.max(1, Math.floor(video.duration * fps));
    slider.max = String(totalFrames);
    totalSpan.textContent = String(totalFrames);
    slider.value = "0";
    video.pause(); // manual frame control
    frameSpan.textContent = "0";
  });

  slider.addEventListener('input', () => {
    const frame = Number(slider.value);
    if (!video.paused) video.pause();
    video.currentTime = frame / fps;
    frameSpan.textContent = String(frame);
  });

  function sync() {
    const frame = Math.round(video.currentTime * fps);
    slider.value = String(frame);
    frameSpan.textContent = String(frame);
  }

  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    const step = () => {
      sync();
      video.requestVideoFrameCallback(step);
    };
    video.addEventListener('play', () => video.requestVideoFrameCallback(step));
  } else {
    video.addEventListener('timeupdate', sync);
    video.addEventListener('seeked', sync);
  }

  if (typeof bulmaSlider !== 'undefined') bulmaSlider.attach();
});
// ...existing code...