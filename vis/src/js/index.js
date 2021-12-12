;(function () {
  // global variables that will be loaded/initialized later
  let canvas, ctx, locations, img
  
  class Station {
    constructor(key, x, y) {
      this.key = key;
      this.x = x;
      this.y = y;
    }
    draw(ctx) {
      ctx.beginPath()
      ctx.fillStyle = 'red'
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
      new Station('ALAPAHA', 434, 803), 
      new Station('ALBANY', 286, 757), 
      new Station('ALMA', 567, 760), 
      new Station('ALPHARET', 254, 205), 
      new Station('ALTO', 359, 133), 
      new Station('ARABI', 329, 698), 
      new Station('ARLINGT', 181, 801), 
      new Station('ATTAPUL', 207, 930), 
      new Station('BALLGND', 226, 161), 
      new Station('BAXLEY', 579, 714), 
      new Station('BLAIRSVI', 308, 42), 
      new Station('BLURIDGE', 233, 32), 
      new Station('BRUNSW', 754, 838), 
      new Station('BUTLER', 261, 540), 
      new Station('BYROMVIL', 318, 619), 
      new Station('BYRON', 343, 517), 
      new Station('CAIRO', 253, 908), 
      new Station('CALHOUN', 147, 103), 
      new Station('CAMILLA', 242, 817), 
      new Station('CLARKSHI', 625, 298), 
      new Station('CORDELE', 306, 655), 
      new Station('COVING', 323, 346), 
      new Station('DAHLON', 317, 92), 
      new Station('DALLAS', 144, 248), 
      new Station('DANVILLE', 434, 193), 
      new Station('DAWSON', 216, 713), 
      new Station('HHERC', 224, 718), 
      new Station('DEARING', 587, 362), 
      new Station('DIXIE', 356, 923), 
      new Station('DONALSON', 135, 875), 
      new Station('DOUGLAS', 517, 772), 
      new Station('DUBLIN', 492, 552), 
      new Station('DUCKER', 228, 762), 
      new Station('DUNWOODY', 229, 227), 
      new Station('EATONTON', 388, 355), 
      new Station('ELBERTON', 549, 220), 
      new Station('ELLIJAY', 227, 90), 
      new Station('FTVALLEY', 315, 544), 
      new Station('GAINES', 333, 148), 
      new Station('GEORGETO', 102, 709), 
      new Station('GLENNV', 675, 665), 
      new Station('GRIFFIN', 243, 385), 
      new Station('DEMPSEY', 240, 387), 
      new Station('HATLEY', 363, 677), 
      new Station('HOMERV', 539, 874), 
      new Station('JVILLE', 412, 511), 
      new Station('DULUTH', 260, 225), 
      new Station('JONESB', 238, 328), 
      new Station('KENNESAW', 189, 216), 
      new Station('LAFAYET', 43, 59), 
      new Station('MCRAE', 495, 643), 
      new Station('MIDVILLE', 621, 469), 
      new Station('MOULTRIE', 347, 846), 
      new Station('NAHUNTA', 659, 839), 
      new Station('NEWMAN', 207, 707), 
      new Station('NEWTON', 209, 829), 
      new Station('OAKWOOD', 319, 173), 
      new Station('ODUM', 651, 740), 
      new Station('OSSABAW', 826, 695), 
      new Station('PENFIELD', 422, 284), 
      new Station('CALLAWAY', 142, 478), 
      new Station('PLAINS', 227, 650), 
      new Station('FLOYD', 92, 150), 
      new Station('WANSLEY', 103, 350), 
      new Station('SANLUIS', 150, 5398), 
      new Station('SASSER', 228, 724), 
      new Station('SAVANNAH', 794, 660), 
      new Station('SEMINOLE', 136, 920), 
      new Station('SHELLMAN', 185, 716), 
      new Station('SKIDAWAY', 836, 672), 
      new Station('SPARKS', 400, 835), 
      new Station('SPARTA', 484, 381), 
      new Station('STATES', 694, 554), 
      new Station('STEAMILL', 123, 887), 
      new Station('TENNILLE', 514, 458), 
      new Station('TIFTON', 382, 771), 
      new Station('BOWEN', 397, 773), 
      new Station('TIGER', 400, 40), 
      new Station('TYTY', 359, 767), 
      new Station('UNADILLA', 357, 604), 
      new Station('VALDOSTA', 420, 917), 
      new Station('VIDALIA', 597, 630), 
      new Station('VIENNA', 354, 636), 
      new Station('WATHORT', 401, 249), 
      new Station('WATUGA', 380, 253), 
      new Station('WATUSDA', 395, 253), 
      new Station('WAYCROSS', 568, 832), 
      new Station('BLEDSOE', 221, 403), 
      new Station('WOODBINE', 701, 887), 
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