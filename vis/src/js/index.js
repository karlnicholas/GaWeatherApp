;(function () {
  // global variables that will be loaded/initialized later
  let canvas, ctx, locations, img
  
  class Station {
    constructor(key, x, y, temp) {
      this.key = key;
      this.x = x;
      this.y = y;
      this.temp = temp;
      this.hue = 200 + (160 * ( temp / 100 ));
    }
    draw(ctx) {
      ctx.beginPath()
      ctx.fillStyle='hsl(' + this.hue + ',100%,50%)'
      // ctx.fillStyle = 'color: blue';
      // ctx.fillStyle = 'red';
      ctx.arc(
        this.x, this.y,
        10,
        0, Math.PI * 2
      )
      ctx.fill()
    }
  }

  // runs once at the beginning
  // loads any data and kickstarts the loop
  function init () {
    // *load data here*
    // our canvas variables
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')

    // set the canvas size
    // canvas.width = 875
    // canvas.height = 1024
    locations = [
      new Station('ALAPAHA', 434, 803, 63),
      new Station('ALBANY', 286, 757, 60),
      new Station('ALMA', 567, 760, 62),
      new Station('ALPHARET', 254, 205, 54),
      new Station('ALTO', 359, 133, 53),
      new Station('ARABI', 329, 698, 60),
      new Station('ARLINGT', 181, 801, 62),
      new Station('ATTAPUL', 207, 930, 62),
      new Station('BALLGND', 226, 161, 61),
      new Station('BAXLEY', 579, 714, 63),
      new Station('BLAIRSVI', 308, 42, 55),
      new Station('BLURIDGE', 233, 32, 53),
      new Station('BRUNSW', 754, 838, 61),
      new Station('BUTLER', 261, 540, 58),
      new Station('BYROMVIL', 318, 619, 59),
      new Station('BYRON', 343, 517, 59),
      new Station('CAIRO', 253, 908, 62),
      new Station('CALHOUN', 147, 103, 54),
      new Station('CAMILLA', 242, 817, 62),
      new Station('CLARKSHI', 625, 298, 57),
      new Station('CORDELE', 306, 655, 59),
      new Station('COVING', 323, 346, 56),
      new Station('DAHLON', 317, 92, 54),
      new Station('DALLAS', 144, 248, 55),
      new Station('DANVILLE', 434, 193, 56),
      new Station('DAWSON', 216, 713, 60),
      new Station('HHERC', 224, 718, 61),
      new Station('DEARING', 587, 362, 58),
      new Station('DIXIE', 356, 923, 62),
      new Station('DONALSON', 135, 875, 63),
      new Station('DOUGLAS', 517, 772, 64),
      new Station('DUBLIN', 492, 552, 62),
      new Station('DUCKER', 228, 762, 62),
      new Station('DUNWOODY', 229, 227, 55),
      new Station('EATONTON', 388, 355, 57),
      new Station('ELBERTON', 549, 220, 57),
      new Station('ELLIJAY', 227, 90, 53),
      new Station('FTVALLEY', 315, 544, 59),
      new Station('GAINES', 333, 148, 55),
      new Station('GEORGETO', 102, 709, 62),
      new Station('GLENNV', 675, 665, 63),
      new Station('GRIFFIN', 243, 385, 56),
      new Station('DEMPSEY', 240, 387, 55),
      new Station('HATLEY', 363, 677, 59),
      new Station('HOMERV', 539, 874, 61),
      new Station('JVILLE', 412, 511, 59),
      new Station('DULUTH', 260, 225, 55),
      new Station('JONESB', 238, 328, 57),
      new Station('KENNESAW', 189, 216, 58),
      new Station('LAFAYET', 43, 59, 51),
      new Station('MCRAE', 495, 643, 62),
      new Station('MIDVILLE', 621, 469, 60),
      new Station('MOULTRIE', 347, 846, 61),
      new Station('NAHUNTA', 659, 839, 64),
      new Station('NEWMAN', 207, 707, 61),
      new Station('NEWTON', 209, 829, 62),
      new Station('OAKWOOD', 319, 173, 55),
      new Station('ODUM', 651, 740, 62),
      new Station('OSSABAW', 826, 695, 63),
      new Station('PENFIELD', 422, 284, 55),
      new Station('CALLAWAY', 142, 478, 56),
      new Station('PLAINS', 227, 650, 59),
      new Station('FLOYD', 92, 150, 55),
      new Station('WANSLEY', 103, 350, 57),
      new Station('SANLUIS', 150, 5398, 70),
      new Station('SASSER', 228, 724, 61),
      new Station('SAVANNAH', 794, 660, 66),
      new Station('SEMINOLE', 136, 920, 63),
      new Station('SHELLMAN', 185, 716, 59),
      new Station('SKIDAWAY', 836, 672, 61),
      new Station('SPARKS', 400, 835, 62),
      new Station('SPARTA', 484, 381, 57),
      new Station('STATES', 694, 554, 61),
      new Station('STEAMILL', 123, 887, 61),
      new Station('TENNILLE', 514, 458, 57),
      new Station('TIFTON', 382, 771, 61),
      new Station('BOWEN', 397, 773, 60),
      new Station('TIGER', 400, 40, 53),
      new Station('TYTY', 359, 767, 61),
      new Station('UNADILLA', 357, 604, 60),
      new Station('VALDOSTA', 420, 917, 63),
      new Station('VIDALIA', 597, 630, 62),
      new Station('VIENNA', 354, 636, 59),
      new Station('WATHORT', 401, 249, 55),
      new Station('WATUGA', 380, 253, 54),
      new Station('WATUSDA', 395, 253, 56),
      new Station('WAYCROSS', 568, 832, 61),
      new Station('BLEDSOE', 221, 403, 57),
      new Station('WOODBINE', 701, 887, 63),
    ];
    // begin update loop
    window.requestAnimationFrame(update)
  }

  // draws stuff to the screen
  // allows us to separate calculations and drawing
  function draw () {
    // clear the canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw the ball (only object in this scene)
    locations.forEach(v => v.draw(ctx))

  }

  // the main piece of the loop
  // runs everything
  function update () {
    // queue the next update
    window.requestAnimationFrame(update)

    // logic goes here


    // draw after logic/calculations
    draw()
  }
  // start our code once the page has loaded
  document.addEventListener('DOMContentLoaded', init)
})()