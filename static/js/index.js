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






// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('dataset-gallery');
  if (!gallery) return;

  const dataIds = (gallery.dataset.actIds || '').split(',').map(s => Number(s.trim())).filter(n => Number.isInteger(n) && n > 0);
  const ACT_IDS = dataIds.length ? dataIds : [3, 16, 25, 12, 11, 8];
  const DEFAULT_FPS = Number(gallery.dataset.fps) || 10;
  const MAX_FRAMES = Number(gallery.dataset.frames) || 30;

  const ACTION_NAMES = {
    1:"Chest expanding horizontally", 2:"Chest expanding vertically", 3:"Left side twist",
    4:"Right side twist", 5:"Raising left arm", 6:"Raising right arm", 7:"Waving left arm",
    8:"Waving right arm", 9:"Picking up things", 10:"Throwing toward left side",
    11:"Throwing toward right side", 12:"Kicking toward left direction using right leg",
    13:"Kicking toward right direction using left leg", 14:"Bowing forward",
    15:"Stretching and relaxing in free form", 16:"Mark time",
    17:"Left upper limb extension", 18:"Right upper limb extension",
    19:"Left front lunge", 20:"Right front lunge", 21:"Both upper limbs extension",
    22:"Squat", 23:"Left side lunge", 24:"Right side lunge", 25:"Left limbs extension",
    26:"Right limbs extension", 27:"Jumping up", 28:"Tai Chi", 29:"High knees",
    30:"Neck rotations while standing with both legs", 31:"Slowly stand up and sit down from a chair",
    32:"Sit and left leg kick/extension", 33:"Sit and right leg kick/extension",
    34:"Sit and raise left dumbbell (arm curls)", 35:"Sit and raise right dumbbell (arm curls)",
    36:"Walk in straight line (fast)", 37:"Walk in straight line (slow)", 38:"Walk in curves (fast)",
    39:"Walk in curves (slow)", 40:"Non-in-place Lunge", 41:"Front kick walk",
    42:"Sideways walking", 43:"Badminton", 44:"Table tennis (ping pong)", 45:"Baseball",
    46:"Volleyball", 47:"Free-place Boxing", 48:"Walk in straight line & pick up item",
    49:"Walk in curve & pick up item", 50:"Basketball"
  };

  const createCard = (id) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    const title = ACTION_NAMES[id] ? `${ACTION_NAMES[id]} (Act ${id})` : `Act ${id}`;
    card.innerHTML = `
      <div class="has-text-weight-semibold">${title}</div>
      <video preload="metadata" muted playsinline>
        <source src="./static/dataset_videos/combined_output_depth_${id}.mp4" type="video/mp4">
      </video>
      <img src="./static/dataset_videos/combined_output_depth_${id}.gif" alt="Act ${id} fallback" style="display:none;">
      <input class="slider" type="range" min="0" max="1" step="1" value="0">
      <div class="frame-label">Frame <span class="frame-now">0</span>/<span class="frame-total">0</span></div>
    `;
    return card;
  };

  const initCard = (card) => {
    const video = card.querySelector('video');
    const imgFallback = card.querySelector('img');
    const slider = card.querySelector('input[type="range"]');
    const frameNow = card.querySelector('.frame-now');
    const frameTotal = card.querySelector('.frame-total');

    const fps = Number(video.dataset.fps) || DEFAULT_FPS;

    video.addEventListener('error', () => {
      video.style.display = 'none';
      imgFallback.style.display = 'block';
      slider.style.display = 'none';
      frameTotal.textContent = 'GIF';
    });

    video.addEventListener('loadedmetadata', () => {
      const framesByDuration = Math.max(1, Math.round(video.duration * fps));
      const totalFrames = Math.min(MAX_FRAMES, framesByDuration);
      slider.max = totalFrames - 1;
      frameTotal.textContent = totalFrames;

      video.currentTime = 0.001;
      video.pause();

      slider.addEventListener('input', () => {
        const frameIdx = Number(slider.value);
        video.currentTime = frameIdx / fps;
        frameNow.textContent = frameIdx;
      });
    });

    video.addEventListener('timeupdate', () => {
      if (!isFinite(video.duration) || video.duration === 0) return;
      const currentFrame = Math.round(video.currentTime * fps);
      slider.value = currentFrame;
      frameNow.textContent = currentFrame;
    });
  };

  ACT_IDS.forEach((id) => {
    const card = createCard(id);
    gallery.appendChild(card);
    initCard(card);
  });
});
// ...existing code...

// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('dataset-gallery1');
  if (!gallery) return;

  const dataIds = (gallery.dataset.actIds || '').split(',').map(s => Number(s.trim())).filter(n => Number.isInteger(n) && n > 0);
  const ACT_IDS = dataIds.length ? dataIds : [3, 16, 25, 12, 11, 8];
  const DEFAULT_FPS = Number(gallery.dataset.fps) || 10;
  const MAX_FRAMES = Number(gallery.dataset.frames) || 30;

  const ACTION_NAMES = {
  1:"Chest expanding horizontally", 2:"Chest expanding vertically", 3:"Left side twist",
  4:"Right side twist", 5:"Raising left arm", 6:"Raising right arm", 7:"Waving left arm",
  8:"Waving right arm", 9:"Picking up things", 10:"Throwing toward left side",
  11:"Throwing toward right side", 12:"Kicking toward left direction using right leg",
  13:"Kicking toward right direction using left leg", 14:"Bowing forward",
  15:"Stretching and relaxing in free form", 16:"Mark time",
  17:"Left upper limb extension", 18:"Right upper limb extension",
  19:"Left front lunge", 20:"Right front lunge", 21:"Both upper limbs extension",
  22:"Squat", 23:"Left side lunge", 24:"Right side lunge", 25:"Left limbs extension",
  26:"Right limbs extension", 27:"Jumping up", 28:"Tai Chi", 29:"High knees",
  30:"Neck rotations while standing with both legs", 31:"Slowly stand up and sit down from a chair",
  32:"Sit and left leg kick/extension", 33:"Sit and right leg kick/extension",
  34:"Sit and raise left dumbbell (arm curls)", 35:"Sit and raise right dumbbell (arm curls)",
  36:"Walk in straight line (fast)", 37:"Walk in straight line (slow)", 38:"Walk in curves (fast)",
  39:"Walk in curves (slow)", 40:"Non-in-place Lunge", 41:"Front kick walk",
  42:"Sideways walking", 43:"Badminton", 44:"Table tennis (ping pong)", 45:"Baseball",
  46:"Volleyball", 47:"Free-place Boxing", 48:"Walk in straight line & pick up item",
  49:"Walk in curve & pick up item", 50:"Basketball"
};

const createCard = (id) => {
  const card = document.createElement('div');
  card.className = 'video-card';
  const title = ACTION_NAMES[id] ? `${ACTION_NAMES[id]} (Act ${id})` : `Act ${id}`;
  card.innerHTML = `
    <div class="has-text-weight-semibold">${title}</div>
    <video preload="metadata" muted playsinline>
      <source src="./static/dataset_videos/combined_output_depth_${id}.mp4" type="video/mp4">
    </video>
    <img src="./static/dataset_videos/combined_output_depth_${id}.gif" alt="Act ${id} fallback" style="display:none;">
    <input class="slider" type="range" min="0" max="1" step="1" value="0">
    <div class="frame-label">Frame <span class="frame-now">0</span>/<span class="frame-total">0</span></div>
  `;
  return card;
};

  const initCard = (card) => {
    const video = card.querySelector('video');
    const imgFallback = card.querySelector('img');
    const slider = card.querySelector('input[type="range"]');
    const frameNow = card.querySelector('.frame-now');
    const frameTotal = card.querySelector('.frame-total');

    const fps = Number(video.dataset.fps) || DEFAULT_FPS;

    video.addEventListener('error', () => {
      video.style.display = 'none';
      imgFallback.style.display = 'block';
      slider.style.display = 'none';
      frameTotal.textContent = 'GIF';
    });

    video.addEventListener('loadedmetadata', () => {
      const framesByDuration = Math.max(1, Math.round(video.duration * fps));
      const totalFrames = Math.min(MAX_FRAMES, framesByDuration);
      slider.max = totalFrames - 1;
      frameTotal.textContent = totalFrames;

      video.currentTime = 0.001;
      video.pause();

      slider.addEventListener('input', () => {
        const frameIdx = Number(slider.value);
        video.currentTime = frameIdx / fps;
        frameNow.textContent = frameIdx;
      });
    });

    video.addEventListener('timeupdate', () => {
      if (!isFinite(video.duration) || video.duration === 0) return;
      const currentFrame = Math.round(video.currentTime * fps);
      slider.value = currentFrame;
      frameNow.textContent = currentFrame;
    });
  };

  ACT_IDS.forEach((id) => {
    const card = createCard(id);
    gallery.appendChild(card);
    initCard(card);
  });
});
// ...existing code...

// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('dataset-gallery2');
  if (!gallery) return;

  const dataIds = (gallery.dataset.actIds || '').split(',').map(s => Number(s.trim())).filter(n => Number.isInteger(n) && n > 0);
  const ACT_IDS = dataIds.length ? dataIds : [3, 16, 25, 12, 11, 8];
  const DEFAULT_FPS = Number(gallery.dataset.fps) || 10;
  const MAX_FRAMES = Number(gallery.dataset.frames) || 30;

  const ACTION_NAMES = {
  1:"Chest expanding horizontally", 2:"Chest expanding vertically", 3:"Left side twist",
  4:"Right side twist", 5:"Raising left arm", 6:"Raising right arm", 7:"Waving left arm",
  8:"Waving right arm", 9:"Picking up things", 10:"Throwing toward left side",
  11:"Throwing toward right side", 12:"Kicking toward left direction using right leg",
  13:"Kicking toward right direction using left leg", 14:"Bowing forward",
  15:"Stretching and relaxing in free form", 16:"Mark time",
  17:"Left upper limb extension", 18:"Right upper limb extension",
  19:"Left front lunge", 20:"Right front lunge", 21:"Both upper limbs extension",
  22:"Squat", 23:"Left side lunge", 24:"Right side lunge", 25:"Left limbs extension",
  26:"Right limbs extension", 27:"Jumping up", 28:"Tai Chi", 29:"High knees",
  30:"Neck rotations while standing with both legs", 31:"Slowly stand up and sit down from a chair",
  32:"Sit and left leg kick/extension", 33:"Sit and right leg kick/extension",
  34:"Sit and raise left dumbbell (arm curls)", 35:"Sit and raise right dumbbell (arm curls)",
  36:"Walk in straight line (fast)", 37:"Walk in straight line (slow)", 38:"Walk in curves (fast)",
  39:"Walk in curves (slow)", 40:"Non-in-place Lunge", 41:"Front kick walk",
  42:"Sideways walking", 43:"Badminton", 44:"Table tennis (ping pong)", 45:"Baseball",
  46:"Volleyball", 47:"Free-place Boxing", 48:"Walk in straight line & pick up item",
  49:"Walk in curve & pick up item", 50:"Basketball"
};

const createCard = (id) => {
  const card = document.createElement('div');
  card.className = 'video-card';
  const title = ACTION_NAMES[id] ? `${ACTION_NAMES[id]} (Act ${id})` : `Act ${id}`;
  card.innerHTML = `
    <div class="has-text-weight-semibold">${title}</div>
    <video preload="metadata" muted playsinline>
      <source src="./static/dataset_videos/combined_output_depth_${id}.mp4" type="video/mp4">
    </video>
    <img src="./static/dataset_videos/combined_output_depth_${id}.gif" alt="Act ${id} fallback" style="display:none;">
    <input class="slider" type="range" min="0" max="1" step="1" value="0">
    <div class="frame-label">Frame <span class="frame-now">0</span>/<span class="frame-total">0</span></div>
  `;
  return card;
};

  const initCard = (card) => {
    const video = card.querySelector('video');
    const imgFallback = card.querySelector('img');
    const slider = card.querySelector('input[type="range"]');
    const frameNow = card.querySelector('.frame-now');
    const frameTotal = card.querySelector('.frame-total');

    const fps = Number(video.dataset.fps) || DEFAULT_FPS;

    video.addEventListener('error', () => {
      video.style.display = 'none';
      imgFallback.style.display = 'block';
      slider.style.display = 'none';
      frameTotal.textContent = 'GIF';
    });

    video.addEventListener('loadedmetadata', () => {
      const framesByDuration = Math.max(1, Math.round(video.duration * fps));
      const totalFrames = Math.min(MAX_FRAMES, framesByDuration);
      slider.max = totalFrames - 1;
      frameTotal.textContent = totalFrames;

      video.currentTime = 0.001;
      video.pause();

      slider.addEventListener('input', () => {
        const frameIdx = Number(slider.value);
        video.currentTime = frameIdx / fps;
        frameNow.textContent = frameIdx;
      });
    });

    video.addEventListener('timeupdate', () => {
      if (!isFinite(video.duration) || video.duration === 0) return;
      const currentFrame = Math.round(video.currentTime * fps);
      slider.value = currentFrame;
      frameNow.textContent = currentFrame;
    });
  };

  ACT_IDS.forEach((id) => {
    const card = createCard(id);
    gallery.appendChild(card);
    initCard(card);
  });
});
// ...existing code...


// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('dataset-gallery3');
  if (!gallery) return;

  const dataIds = (gallery.dataset.actIds || '').split(',').map(s => Number(s.trim())).filter(n => Number.isInteger(n) && n > 0);
  const ACT_IDS = dataIds.length ? dataIds : [3, 16, 25, 12, 11, 8];
  const DEFAULT_FPS = Number(gallery.dataset.fps) || 10;
  const MAX_FRAMES = Number(gallery.dataset.frames) || 30;

  const ACTION_NAMES = {
  1:"Chest expanding horizontally", 2:"Chest expanding vertically", 3:"Left side twist",
  4:"Right side twist", 5:"Raising left arm", 6:"Raising right arm", 7:"Waving left arm",
  8:"Waving right arm", 9:"Picking up things", 10:"Throwing toward left side",
  11:"Throwing toward right side", 12:"Kicking toward left direction using right leg",
  13:"Kicking toward right direction using left leg", 14:"Bowing forward",
  15:"Stretching and relaxing in free form", 16:"Mark time",
  17:"Left upper limb extension", 18:"Right upper limb extension",
  19:"Left front lunge", 20:"Right front lunge", 21:"Both upper limbs extension",
  22:"Squat", 23:"Left side lunge", 24:"Right side lunge", 25:"Left limbs extension",
  26:"Right limbs extension", 27:"Jumping up", 28:"Tai Chi", 29:"High knees",
  30:"Neck rotations while standing with both legs", 31:"Slowly stand up and sit down from a chair",
  32:"Sit and left leg kick/extension", 33:"Sit and right leg kick/extension",
  34:"Sit and raise left dumbbell (arm curls)", 35:"Sit and raise right dumbbell (arm curls)",
  36:"Walk in straight line (fast)", 37:"Walk in straight line (slow)", 38:"Walk in curves (fast)",
  39:"Walk in curves (slow)", 40:"Non-in-place Lunge", 41:"Front kick walk",
  42:"Sideways walking", 43:"Badminton", 44:"Table tennis (ping pong)", 45:"Baseball",
  46:"Volleyball", 47:"Free-place Boxing", 48:"Walk in straight line & pick up item",
  49:"Walk in curve & pick up item", 50:"Basketball"
};

const createCard = (id) => {
  const card = document.createElement('div');
  card.className = 'video-card';
  const title = ACTION_NAMES[id] ? `${ACTION_NAMES[id]} (Act ${id})` : `Act ${id}`;
  card.innerHTML = `
    <div class="has-text-weight-semibold">${title}</div>
    <video preload="metadata" muted playsinline>
      <source src="./static/dataset_videos/combined_output_depth_${id}.mp4" type="video/mp4">
    </video>
    <img src="./static/dataset_videos/combined_output_depth_${id}.gif" alt="Act ${id} fallback" style="display:none;">
    <input class="slider" type="range" min="0" max="1" step="1" value="0">
    <div class="frame-label">Frame <span class="frame-now">0</span>/<span class="frame-total">0</span></div>
  `;
  return card;
};

  const initCard = (card) => {
    const video = card.querySelector('video');
    const imgFallback = card.querySelector('img');
    const slider = card.querySelector('input[type="range"]');
    const frameNow = card.querySelector('.frame-now');
    const frameTotal = card.querySelector('.frame-total');

    const fps = Number(video.dataset.fps) || DEFAULT_FPS;

    video.addEventListener('error', () => {
      video.style.display = 'none';
      imgFallback.style.display = 'block';
      slider.style.display = 'none';
      frameTotal.textContent = 'GIF';
    });

    video.addEventListener('loadedmetadata', () => {
      const framesByDuration = Math.max(1, Math.round(video.duration * fps));
      const totalFrames = Math.min(MAX_FRAMES, framesByDuration);
      slider.max = totalFrames - 1;
      frameTotal.textContent = totalFrames;

      video.currentTime = 0.001;
      video.pause();

      slider.addEventListener('input', () => {
        const frameIdx = Number(slider.value);
        video.currentTime = frameIdx / fps;
        frameNow.textContent = frameIdx;
      });
    });

    video.addEventListener('timeupdate', () => {
      if (!isFinite(video.duration) || video.duration === 0) return;
      const currentFrame = Math.round(video.currentTime * fps);
      slider.value = currentFrame;
      frameNow.textContent = currentFrame;
    });
  };

  ACT_IDS.forEach((id) => {
    const card = createCard(id);
    gallery.appendChild(card);
    initCard(card);
  });
});
// ...existing code...