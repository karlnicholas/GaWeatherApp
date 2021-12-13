;(function () {
  // global variables that will be loaded/initialized later
  let canvas, ctx, locations, img
  
  class Station {
    constructor(key, x, y, temp, windSpeed) {
      this.key = key;
      this.x = x;
      this.y = y;
      this.temp = temp;
      this.windSpeed = windSpeed;
      this.hue = 200 + (160 * ( temp / 100 ));
    }
    draw(ctx) {
      ctx.beginPath()
      ctx.fillStyle='hsl(' + this.hue + ',100%,50%)'
      // ctx.fillStyle = 'color: blue';
      // ctx.fillStyle = 'red';
      ctx.arc(
        this.x, this.y,
        6,
        0, Math.PI * 2
      )
      ctx.fill()
      // ctx.beginPath()
      // ctx.fillStyle='hsl(' + this.hue + ',100%,50%)'
      // ctx.fillStyle = 'color: blue';
      // ctx.fillStyle = 'red';

      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x+3+this.windSpeed, this.y+3+this.windSpeed) // right side
      ctx.closePath() // hypotenuse/long side (remember to close path for strokes!)
      ctx.stroke()
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
      new Station('ALAPAHA', 390, 703, 63, 0), 
      new Station('ALBANY', 278, 669, 60, 5), 
      new Station('ALMA', 492, 671, 62, 4), 
      new Station('ALPHARET', 254, 251, 54, 1), 
      new Station('ALTO', 334, 197, 53, 4), 
      new Station('ARABI', 310, 624, 60, 6), 
      new Station('ARLINGT', 199, 702, 62, 5), 
      new Station('ATTAPUL', 219, 800, 62, 7), 
      new Station('BALLGND', 233, 217, 61, 0), 
      new Station('BAXLEY', 501, 636, 63, 3), 
      new Station('BLAIRSVI', 295, 127, 55, 2), 
      new Station('BLURIDGE', 238, 120, 53, 3), 
      new Station('BRUNSW', 634, 730, 61, 4), 
      new Station('BUTLER', 259, 504, 58, 5), 
      new Station('BYROMVIL', 302, 564, 59, 6), 
      new Station('BYRON', 321, 487, 59, 4), 
      new Station('CAIRO', 253, 783, 62, 3), 
      new Station('CALHOUN', 173, 174, 54, 2), 
      new Station('CAMILLA', 245, 714, 62, 4), 
      new Station('CLARKSHI', 535, 321, 57, 4), 
      new Station('CORDELE', 293, 591, 59, 5), 
      new Station('COVING', 307, 358, 56, 4), 
      new Station('DAHLON', 302, 165, 54, 4), 
      new Station('DALLAS', 170, 283, 55, 2), 
      new Station('DANVILLE', 391, 242, 56, 4), 
      new Station('DAWSON', 226, 635, 60, 4), 
      new Station('HHERC', 231, 639, 61, 6), 
      new Station('DEARING', 506, 370, 58, 4), 
      new Station('DIXIE', 331, 794, 62, 4), 
      new Station('DONALSON', 164, 758, 63, 6), 
      new Station('DOUGLAS', 453, 680, 64, 4), 
      new Station('DUBLIN', 434, 513, 62, 3), 
      new Station('DUCKER', 234, 672, 62, 4), 
      new Station('DUNWOODY', 235, 268, 55, 2), 
      new Station('EATONTON', 356, 364, 57, 5), 
      new Station('ELBERTON', 478, 262, 57, 2), 
      new Station('ELLIJAY', 233, 163, 53, 3), 
      new Station('FTVALLEY', 300, 507, 59, 5), 
      new Station('GAINES', 314, 208, 55, 4), 
      new Station('GEORGETO', 139, 632, 62, 3), 
      new Station('GLENNV', 573, 599, 63, 5), 
      new Station('GRIFFIN', 246, 387, 56, 5), 
      new Station('DEMPSEY', 244, 389, 55, 3), 
      new Station('HATLEY', 337, 608, 59, 6), 
      new Station('HOMERV', 471, 757, 61, 3), 
      new Station('JVILLE', 374, 482, 59, 4), 
      new Station('DULUTH', 258, 266, 55, 1), 
      new Station('JONESB', 242, 344, 57, 3), 
      new Station('KENNESAW', 205, 259, 58, 2), 
      new Station('LAFAYET', 94, 140, 51, 3), 
      new Station('MCRAE', 437, 582, 62, 5), 
      new Station('MIDVILLE', 532, 450, 60, 8), 
      new Station('MOULTRIE', 324, 736, 61, 5), 
      new Station('NAHUNTA', 561, 730, 64, 4), 
      new Station('NEWMAN', 218, 630, 61, 5), 
      new Station('NEWTON', 220, 723, 62, 3), 
      new Station('OAKWOOD', 303, 227, 55, 2), 
      new Station('ODUM', 555, 656, 62, 4), 
      new Station('OSSABAW', 688, 622, 63, 1), 
      new Station('PENFIELD', 381, 310, 55, 7), 
      new Station('CALLAWAY', 169, 457, 56, 3), 
      new Station('PLAINS', 234, 587, 59, 3), 
      new Station('FLOYD', 131, 209, 55, 4), 
      new Station('WANSLEY', 140, 360, 57, 1), 
      new Station('SANLUIS', 175, 4181, 70, 0), 
      new Station('SASSER', 234, 643, 61, 4), 
      new Station('SAVANNAH', 663, 595, 66, 2), 
      new Station('SEMINOLE', 164, 792, 63, 3), 
      new Station('SHELLMAN', 202, 637, 59, 6), 
      new Station('SKIDAWAY', 696, 604, 61, 2), 
      new Station('SPARKS', 365, 727, 62, 5), 
      new Station('SPARTA', 428, 384, 57, 4), 
      new Station('STATES', 588, 515, 61, 4), 
      new Station('STEAMILL', 155, 766, 61, 6), 
      new Station('TENNILLE', 452, 442, 57, 5), 
      new Station('TIFTON', 351, 679, 61, 5), 
      new Station('BOWEN', 363, 681, 60, 5), 
      new Station('TIGER', 364, 126, 53, 4), 
      new Station('TYTY', 334, 676, 61, 5), 
      new Station('UNADILLA', 332, 552, 60, 5), 
      new Station('VALDOSTA', 380, 789, 63, 3), 
      new Station('VIDALIA', 514, 572, 62, 6), 
      new Station('VIENNA', 330, 577, 59, 6), 
      new Station('WATHORT', 365, 285, 55, 3), 
      new Station('WATUGA', 349, 287, 54, 6), 
      new Station('WATUSDA', 361, 287, 56, 3), 
      new Station('WAYCROSS', 493, 725, 61, 7), 
      new Station('BLEDSOE', 229, 400, 57, 3), 
      new Station('WOODBINE', 594, 766, 63, 4), 
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