
;(function () {
  // global variables that will be loaded/initialized later
  let canvas, ctx, locations, radius = 8
  
  class Station {
    constructor(key, x, y, temp, windSpeed, windDir, windGust) {
      this.key = key;
      this.x = x;
      this.y = y;
      this.temp = temp;
      this.windSpeed = windSpeed;
      this.windDir = windDir;
      this.windGust = windGust;
      this.hue = 200 + (160 * ( temp / 100 ));
    }
    draw(ctx) {
      ctx.beginPath()
      ctx.fillStyle='hsl(' + this.hue + ',100%,50%)'
      // ctx.fillStyle = 'color: blue';
      // ctx.fillStyle = 'red';
      // ctx.arc(
      //   this.x, this.y,
      //   6,
      //   0, Math.PI * 2
      // )
      startDeg = ((this.windDir - 90 + 360) % 360)
      endDeg = ((this.windDir + 90 + 360) % 360)
      startAngle = (Math.PI / 180) * startDeg - (Math.PI / 2)
      endAngle = (Math.PI / 180) * endDeg - (Math.PI / 2)

      ctx.arc(this.x, this.y, radius, startAngle, endAngle)
      ctx.fill()

      tailStartX = radius*Math.cos(startAngle)
      tailStartY = radius*Math.sin(startAngle)
      tailEndX = radius*Math.cos(endAngle)
      tailEndY = radius*Math.sin(endAngle)

      tailDeg = ((this.windDir + 180) % 360)
      tailAngle = (Math.PI / 180) * tailDeg - (Math.PI / 2)
      t = new Date().getTime()
      tm = ((t % 1000) / 100) / 10
      if ( ((t % 2000) / 1000) % 2 > 1 ) {
        tm = 1 - tm
      }
      tailTipX = (this.windSpeed + ((this.windGust - this.windSpeed) * tm ))*Math.cos(tailAngle)
      tailTipY = (this.windSpeed + ((this.windGust - this.windSpeed) * tm ))*Math.sin(tailAngle)
      ctx.beginPath()
      ctx.moveTo(this.x + tailStartX, this.y + tailStartY)
      ctx.lineTo(this.x + tailTipX, this.y + tailTipY) // right side
      ctx.lineTo(this.x + tailEndX, this.y + tailEndY) // right side
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
      new Station('ALAPAHA', 390, 703, 63, 0, 30, 2), 
      new Station('ALBANY', 278, 669, 60, 5, 45, 10), 
      new Station('ALMA', 492, 671, 62, 4, 15, 8), 
      new Station('ALPHARET', 254, 251, 54, 1, 150, 4), 
      new Station('ALTO', 334, 197, 53, 4, 120, 8), 
      new Station('ARABI', 310, 624, 60, 6, 60, 10), 
      new Station('ARLINGT', 199, 702, 62, 5, 0, 10), 
      new Station('ATTAPUL', 219, 800, 62, 7, 345, 11), 
      new Station('BALLGND', 233, 217, 61, 0, 345, 4), 
      new Station('BAXLEY', 501, 636, 63, 3, 15, 8), 
      new Station('BLAIRSVI', 295, 127, 55, 2, 270, 6), 
      new Station('BLURIDGE', 238, 120, 53, 3, 330, 6), 
      new Station('BRUNSW', 634, 730, 61, 4, 75, 10), 
      new Station('BUTLER', 259, 504, 58, 5, 60, 8), 
      new Station('BYROMVIL', 302, 564, 59, 6, 45, 10), 
      new Station('BYRON', 321, 487, 59, 4, 15, 10), 
      new Station('CAIRO', 253, 783, 62, 3, 15, 8), 
      new Station('CALHOUN', 173, 174, 54, 2, 0, 4), 
      new Station('CAMILLA', 245, 714, 62, 4, 45, 8), 
      new Station('CLARKSHI', 535, 321, 57, 4, 0, 8), 
      new Station('CORDELE', 293, 591, 59, 5, 45, 10), 
      new Station('COVING', 307, 358, 56, 4, 60, 6), 
      new Station('DAHLON', 302, 165, 54, 4, 210, 8), 
      new Station('DALLAS', 170, 283, 55, 2, 330, 4), 
      new Station('DANVILLE', 391, 242, 56, 4, 90, 8), 
      new Station('DAWSON', 226, 635, 60, 4, 45, 10), 
      new Station('HHERC', 231, 639, 61, 6, 45, 10), 
      new Station('DEARING', 506, 370, 58, 4, 15, 10), 
      new Station('DIXIE', 331, 794, 62, 4, 330, 8), 
      new Station('DONALSON', 164, 758, 63, 6, 0, 11), 
      new Station('DOUGLAS', 453, 680, 64, 4, 105, 10), 
      new Station('DUBLIN', 434, 513, 62, 3, 45, 8), 
      new Station('DUCKER', 234, 672, 62, 4, 30, 8), 
      new Station('DUNWOODY', 235, 268, 55, 2, 0, 4), 
      new Station('EATONTON', 356, 364, 57, 5, 90, 10), 
      new Station('ELBERTON', 478, 262, 57, 2, 105, 4), 
      new Station('ELLIJAY', 233, 163, 53, 3, 180, 8), 
      new Station('FTVALLEY', 300, 507, 59, 5, 45, 10), 
      new Station('GAINES', 314, 208, 55, 4, 105, 6), 
      new Station('GEORGETO', 139, 632, 62, 3, 30, 6), 
      new Station('GLENNV', 573, 599, 63, 5, 30, 10), 
      new Station('GRIFFIN', 246, 387, 56, 5, 105, 11), 
      new Station('DEMPSEY', 244, 389, 55, 3, 45, 8), 
      new Station('HATLEY', 337, 608, 59, 6, 45, 10), 
      new Station('HOMERV', 471, 757, 61, 3, 45, 6), 
      new Station('JVILLE', 374, 482, 59, 4, 45, 8), 
      new Station('DULUTH', 258, 266, 55, 1, 165, 4), 
      new Station('JONESB', 242, 344, 57, 3, 120, 6), 
      new Station('KENNESAW', 205, 259, 58, 2, 105, 4), 
      new Station('LAFAYET', 94, 140, 51, 3, 30, 8), 
      new Station('MCRAE', 437, 582, 62, 5, 45, 10), 
      new Station('MIDVILLE', 532, 450, 60, 8, 30, 11), 
      new Station('MOULTRIE', 324, 736, 61, 5, 30, 10), 
      new Station('NAHUNTA', 561, 730, 64, 4, 60, 8), 
      new Station('NEWMAN', 218, 630, 61, 5, 60, 10), 
      new Station('NEWTON', 220, 723, 62, 3, 45, 8), 
      new Station('OAKWOOD', 303, 227, 55, 2, 60, 8), 
      new Station('ODUM', 555, 656, 62, 4, 15, 8), 
      new Station('OSSABAW', 688, 622, 63, 1, 90, 4), 
      new Station('PENFIELD', 381, 310, 55, 7, 90, 10), 
      new Station('CALLAWAY', 169, 457, 56, 3, 300, 6), 
      new Station('PLAINS', 234, 587, 59, 3, 45, 6), 
      new Station('FLOYD', 131, 209, 55, 4, 45, 8), 
      new Station('WANSLEY', 140, 360, 57, 1, 315, 4), 
      new Station('SANLUIS', 175, 4181, 70, 0, 0, 0), 
      new Station('SASSER', 234, 643, 61, 4, 75, 8), 
      new Station('SAVANNAH', 663, 595, 66, 2, 90, 8), 
      new Station('SEMINOLE', 164, 792, 63, 3, 150, 8), 
      new Station('SHELLMAN', 202, 637, 59, 6, 60, 10), 
      new Station('SKIDAWAY', 696, 604, 61, 2, 60, 8), 
      new Station('SPARKS', 365, 727, 62, 5, 45, 11), 
      new Station('SPARTA', 428, 384, 57, 4, 45, 8), 
      new Station('STATES', 588, 515, 61, 4, 60, 10), 
      new Station('STEAMILL', 155, 766, 61, 6, 45, 10), 
      new Station('TENNILLE', 452, 442, 57, 5, 45, 8), 
      new Station('TIFTON', 351, 679, 61, 5, 45, 10), 
      new Station('BOWEN', 363, 681, 60, 5, 15, 10), 
      new Station('TIGER', 364, 126, 53, 4, 135, 8), 
      new Station('TYTY', 334, 676, 61, 5, 30, 10), 
      new Station('UNADILLA', 332, 552, 60, 5, 45, 8), 
      new Station('VALDOSTA', 380, 789, 63, 3, 0, 6), 
      new Station('VIDALIA', 514, 572, 62, 6, 45, 10), 
      new Station('VIENNA', 330, 577, 59, 6, 45, 11), 
      new Station('WATHORT', 365, 285, 55, 3, 120, 6), 
      new Station('WATUGA', 349, 287, 54, 6, 90, 8), 
      new Station('WATUSDA', 361, 287, 56, 3, 120, 8), 
      new Station('WAYCROSS', 493, 725, 61, 7, 30, 11), 
      new Station('BLEDSOE', 229, 400, 57, 3, 90, 6), 
      new Station('WOODBINE', 594, 766, 63, 4, 45, 8), 
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