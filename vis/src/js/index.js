
;(function () {
  // global variables that will be loaded/initialized later
  let canvas, ctx, locations, radius = 10
  
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
      new Station('ALAPAHA', 390, 703, 63, 0, 0, 0), 
      new Station('ALBANY', 278, 669, 61, 5, 30, 10), 
      new Station('ALMA', 492, 671, 67, 3, 45, 6), 
      new Station('ALPHARET', 254, 251, 57, 2, 90, 4), 
      new Station('ALTO', 334, 197, 57, 4, 285, 8), 
      new Station('ARABI', 310, 624, 64, 3, 315, 6), 
      new Station('ARLINGT', 199, 702, 65, 1, 30, 4), 
      new Station('ATTAPUL', 219, 800, 61, 4, 0, 8), 
      new Station('BALLGND', 233, 217, 62, 2, 225, 6), 
      new Station('BAXLEY', 501, 636, 66, 3, 300, 6), 
      new Station('BLAIRSVI', 295, 127, 60, 3, 285, 6), 
      new Station('BLURIDGE', 238, 120, 58, 3, 15, 6), 
      new Station('BRUNSW', 634, 730, 67, 3, 90, 10), 
      new Station('BUTLER', 259, 504, 62, 3, 45, 8), 
      new Station('BYROMVIL', 302, 564, 62, 4, 60, 10), 
      new Station('BYRON', 321, 487, 61, 3, 0, 8), 
      new Station('CAIRO', 253, 783, 62, 4, 45, 8), 
      new Station('CALHOUN', 173, 174, 60, 1, 60, 4), 
      new Station('CAMILLA', 245, 714, 63, 5, 45, 8), 
      new Station('CLARKSHI', 535, 321, 58, 4, 255, 8), 
      new Station('CORDELE', 293, 591, 62, 3, 75, 8), 
      new Station('COVING', 307, 358, 61, 3, 285, 6), 
      new Station('DAHLON', 302, 165, 58, 3, 240, 8), 
      new Station('DALLAS', 170, 283, 60, 3, 165, 6), 
      new Station('DANVILLE', 391, 242, 61, 3, 225, 8), 
      new Station('DAWSON', 226, 635, 62, 1, 45, 6), 
      new Station('HHERC', 231, 639, 62, 4, 90, 8), 
      new Station('DEARING', 506, 370, 62, 2, 195, 6), 
      new Station('DIXIE', 331, 794, 61, 3, 345, 8), 
      new Station('DONALSON', 164, 758, 60, 4, 30, 8), 
      new Station('DOUGLAS', 453, 680, 70, 3, 315, 8), 
      new Station('DUBLIN', 434, 513, 65, 1, 240, 4), 
      new Station('DUCKER', 234, 672, 63, 2, 30, 6), 
      new Station('DUNWOODY', 235, 268, 58, 3, 270, 6), 
      new Station('EATONTON', 356, 364, 62, 2, 270, 6), 
      new Station('ELBERTON', 478, 262, 59, 2, 105, 4), 
      new Station('ELLIJAY', 233, 163, 57, 2, 285, 6), 
      new Station('FTVALLEY', 300, 507, 62, 4, 90, 10), 
      new Station('GAINES', 314, 208, 59, 2, 210, 4), 
      new Station('GEORGETO', 139, 632, 64, 4, 120, 8), 
      new Station('GLENNV', 573, 599, 67, 4, 75, 8), 
      new Station('GRIFFIN', 246, 387, 60, 3, 15, 8), 
      new Station('DEMPSEY', 244, 389, 60, 1, 345, 4), 
      new Station('HATLEY', 337, 608, 63, 4, 0, 10), 
      new Station('HOMERV', 471, 757, 63, 2, 270, 4), 
      new Station('JVILLE', 374, 482, 61, 3, 330, 6), 
      new Station('DULUTH', 258, 266, 60, 2, 180, 4), 
      new Station('JONESB', 242, 344, 60, 2, 195, 6), 
      new Station('KENNESAW', 205, 259, 61, 2, 165, 4), 
      new Station('LAFAYET', 94, 140, 60, 2, 30, 4), 
      new Station('MCRAE', 437, 582, 64, 2, 60, 6), 
      new Station('MIDVILLE', 532, 450, 64, 3, 285, 6), 
      new Station('MOULTRIE', 324, 736, 60, 5, 60, 10), 
      new Station('NAHUNTA', 561, 730, 66, 4, 0, 8), 
      new Station('NEWMAN', 218, 630, 62, 4, 45, 8), 
      new Station('NEWTON', 220, 723, 65, 2, 0, 6), 
      new Station('OAKWOOD', 303, 227, 57, 2, 255, 8), 
      new Station('ODUM', 555, 656, 68, 3, 315, 8), 
      new Station('OSSABAW', 688, 622, 66, 3, 150, 8), 
      new Station('PENFIELD', 381, 310, 60, 3, 165, 6), 
      new Station('CALLAWAY', 169, 457, 61, 2, 225, 6), 
      new Station('PLAINS', 234, 587, 64, 3, 90, 6), 
      new Station('FLOYD', 131, 209, 60, 3, 225, 6), 
      new Station('WANSLEY', 140, 360, 62, 2, 210, 4), 
      new Station('SANLUIS', 175, 4181, 67, 0, 0, 0), 
      new Station('SASSER', 234, 643, 61, 3, 90, 8), 
      new Station('SAVANNAH', 663, 595, 70, 2, 30, 6), 
      new Station('SEMINOLE', 164, 792, 59, 4, 180, 8), 
      new Station('SHELLMAN', 202, 637, 61, 4, 60, 8), 
      new Station('SKIDAWAY', 696, 604, 67, 3, 90, 8), 
      new Station('SPARKS', 365, 727, 60, 2, 45, 4), 
      new Station('SPARTA', 428, 384, 62, 2, 30, 6), 
      new Station('STATES', 588, 515, 67, 3, 165, 6), 
      new Station('STEAMILL', 155, 766, 59, 4, 45, 8), 
      new Station('TENNILLE', 452, 442, 62, 2, 45, 6), 
      new Station('TIFTON', 351, 679, 59, 1, 75, 6), 
      new Station('BOWEN', 363, 681, 59, 2, 15, 4), 
      new Station('TIGER', 364, 126, 62, 4, 135, 8), 
      new Station('TYTY', 334, 676, 58, 3, 60, 8), 
      new Station('UNADILLA', 332, 552, 63, 3, 45, 8), 
      new Station('VALDOSTA', 380, 789, 62, 2, 330, 4), 
      new Station('VIDALIA', 514, 572, 65, 3, 60, 6), 
      new Station('VIENNA', 330, 577, 62, 2, 30, 4), 
      new Station('WATHORT', 365, 285, 59, 2, 240, 4), 
      new Station('WATUGA', 349, 287, 58, 4, 225, 6), 
      new Station('WATUSDA', 361, 287, 59, 2, 0, 6), 
      new Station('WAYCROSS', 493, 725, 66, 3, 345, 8), 
      new Station('BLEDSOE', 229, 400, 60, 4, 45, 6), 
      new Station('WOODBINE', 594, 766, 64, 3, 345, 6), 
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