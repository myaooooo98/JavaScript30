const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    // enabling video and audio channels
    // get and then (JavaScript30 - 06)
    // getUserMedia() - return promise
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            // localMediaStream = an object
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        // in case someone not allow to access the camera
        .catch(err => {
            console.error('Access to camera is denied', err);
        })
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // every 16 milliseconds, paint the video into the canvas
    //drawImage(*image/video, *x, *y, width, height) - x & y are the position on the canvas, width and height are optionals
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        
        // take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);

        // mess around with the pixels
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);

        // ghosting effect
        // stacking the current image that with 10% of the transparency on top of the previous one
        // Alpha higher, less ghosting effect
        // ctx.globalAlpha = 0.1;

        pixels = greenScreen(pixels);

        // put the pixels back to th canvas
        ctx.putImageData(pixels, 0, 0);

    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();    // play a sound when photo taken

    // take the data out of the canvas for photo
    // base-64 - text representation for photo
    const data = canvas.toDataURL('image/jpeg');       
    const link = document.createElement('a');
    link.href = data;
    // 'handsome' = make the photo is actually downloadable to the hard drive
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src='${data}' alt='image' />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100;  // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50;  // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;  //  blue
        // pixels.data[i + 3] = alpha (for transparency)
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0];  // red
        pixels.data[i + 300] = pixels.data[i + 1];  // green
        pixels.data[i - 550] = pixels.data[i + 2];  //  blue
    }
    return pixels;
}

function greenScreen(pixels) {
    // hold min and max green
    /// green screen works in the way take all the rgb within the level out
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // check if any of the color are within the max and min level
    // rmin, gmin etc are the names of the input in HTML
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;   // make it transparent
    }
  }

  return pixels;
}

getVideo();

// once the video is playing, it will trigger the event 'canplay'
video.addEventListener('canplay', paintToCanvas);