var keep_trying_btns = ["mod.*_carousel", "Dont_reveal_close", "do_reveal_close"];
var reset_btns = ["Begin_btn", "Reset_btn", "next", "Next_btn", "continue"];
var try_once_per_reset_btn = ["mod.*_ctr.*_button"];

let intervalId;
let loopCounter = 0;
let idx = 0;

const fastForwardElements = () => {
  document.querySelectorAll('video, audio').forEach((element) => {
    element.playbackRate = 12;
  });
  const playerElements = document.querySelectorAll('[class*="player"]');
  playerElements.forEach((playerElement) => {
  playerElement.playbackRate = 12;
    if (typeof playerElement.fastSeek === 'function') {
      playerElement.fastSeek(30); // fast forward by 30 seconds
  }
    try {
      playerElement.play(); // resume the video playback
      playerElement.currentTime = 11130;
    } catch (e) {
        //console.error(e);
    }


  });
};


const tryButtons = (pattern, reset = false) => {
  const regex = new RegExp(pattern);
  const buttons = Array.from(document.querySelectorAll('*')).filter((element) => regex.test(element.className) || regex.test(element.id));

  if (buttons.length > 0) {
    if (reset) {
      console.log('Reset buttons:', buttons);
    } else {
      console.log(`Matched buttons for "${pattern}":`, buttons);
    }

    buttons.forEach((button) => {
      console.log(`Clicked: ${button.id}`);
      button.click();
      if (reset) {
        console.log('Reset successful');
      }
    });
  }
};

const stopLoop = () => {
  clearInterval(intervalId);
};

const mainLoop = () => {
  console.log('--- Main loop starts ---');
  fastForwardElements();

  if (idx === 0) {
    console.log('All buttons found on page:', Array.from(document.querySelectorAll('button, input[type=button]')));
  }

  const getOuterHTML = (selector) => {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((element) => element.outerHTML).join('');
  };

  const tryResetButtons = () => {
    let resetSuccess = false;
    reset_btns.forEach((pattern) => {
      const initialOuterHTML = getOuterHTML('*');
      tryButtons(pattern, true);
      const afterButtonClickOuterHTML = getOuterHTML('*');
      if (initialOuterHTML !== afterButtonClickOuterHTML) {
        resetSuccess = true;
      }
    });
    return resetSuccess;
  };

  let resetSuccess = tryResetButtons();

  keep_trying_btns.forEach((pattern) => {
    tryButtons(pattern);
  });

  resetSuccess = tryResetButtons();

  if (resetSuccess) {
    //idx = 0;
  } else {
    // loop through all patterns on next line

    try_once_per_reset_btn.forEach((pattern) => {
      const regex = new RegExp(pattern);
      const buttons = Array.from(document.querySelectorAll('*')).filter((element) => (regex.test(element.className) || regex.test(element.id)));
      if (buttons.length > 0) {
        const button = buttons[idx % buttons.length];
        console.log(`Clicked (try once): ${button.id}`);
        button.click();
      }});

    idx++;
  }

  loopCounter++;
  console.log(`Loop iteration: ${loopCounter}`);
};

intervalId = setInterval(mainLoop, 1000); // Change the interval time (in ms) if needed


// FOR INFO SEC, NOT WORKING
const setAllVideosTo100Percent = () => {
  const controlBars = document.querySelectorAll('.vjs-control-bar');

  controlBars.forEach((controlBar) => {
    const videoElement = controlBar.closest('.video-js').querySelector('video');

    if (videoElement) {
      videoElement.currentTime = videoElement.duration;
    } else {
      console.error('Video element not found.');
    }
  });
};

setAllVideosTo100Percent(); // Set all videos with class 'vjs-control-bar' to 100% completion


// Control progress bar for PRIVACY
(function () {
  // Make the progress bar visible
  function makeProgressBarVisible() {
    const progressBar = document.querySelector('[data-ref="progressBar"]');
    if (progressBar) {
      progressBar.style.visibility = "visible";
    }
  }

  // Fast forward the progress bar
  function fastForwardProgressBar() {
    const progressBar = document.querySelector('[data-ref="progressBar"]');
    if (progressBar) {
      const fastForwardValue = 50000; // Fast forward 1000 units
      progressBar.value = Math.min(progressBar.max, parseInt(progressBar.value) + fastForwardValue);
      progressBar.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  // Make the progress bar visible initially
  makeProgressBarVisible();

  // Fast forward the progress bar at regular intervals
  setInterval(fastForwardProgressBar, 500); // Fast forward every 5 seconds
})();
