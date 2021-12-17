require("babel-core/register");
require("babel-polyfill");

;(function () {
  // global variables that will be loaded/initialized later
  let canvas, ctx, locations, radius = 10
  
  // runs once at the beginning
  // loads any data and kickstarts the loop
  function init () {
    // *load data here*
    // our canvas variables
    startShowingWeather()
    // begin update loop
    window.requestAnimationFrame(update)
  }

  function startShowingWeather() {
    api()
    setInterval( () => api(), 900000)
  }

  async function api() {
      const response = await fetch("http://localhost:8080/api/gastations").then(response => response.json())
      locations = response.gaStations
      console.log("api read at " + new Date())
  }
  // draws stuff to the screen
  // allows us to separate calculations and drawing
  function draw () {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    // clear the canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw the ball (only object in this scene)
    t = new Date().getTime()
    tm = ((t % 1000) / 100) / 10 
    if ( ((t % 2000) / 1000) % 2 > 1 ) {
      tm = 1 - tm
    }
    if ( locations ) {
      locations.forEach(l => {
        // hue = 200 + (160 * ( l.temp / 100 ))
        hue = getHue((l.temp - 32) / 1.8)
        // drawMapPin(ctx, hue, l.x, l.y, radius, l.windSpeed, l.windDir)
        drawWindInd(ctx, l, tm)
        e = l.elevation / 100;
        m1 = e / 2;
        m2 = e - m1;
        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle='black'
        ctx.moveTo(l.x - m1, l.y + m1)
        ctx.lineTo(l.x , l.y - m2) // right side
        ctx.lineTo(l.x + m2, l.y + m1) // right side
        ctx.closePath()
        ctx.stroke()
      
      })
    }
  }

  function drawWindInd(ctx, l, tm) {
    ctx.beginPath()
    ctx.fillStyle='hsl(' + hue + ',100%,50%)'
    startDeg = ((l.windDir - 90 + 360) % 360)
    endDeg = ((l.windDir + 90 + 360) % 360)
    startAngle = (Math.PI / 180) * startDeg - (Math.PI / 2)
    endAngle = (Math.PI / 180) * endDeg - (Math.PI / 2)

    ctx.arc(l.x, l.y, radius, startAngle, endAngle)
    ctx.fill()

    // 1000 - 0 -> 100 - 0
    sat = l.solar / 10
    ctx.beginPath()
    // ctx.strokeStyle='hsl( 196,' + sat + '%,50%)'
    ctx.fillStyle='hsl( 196,' + sat + '%,50%)'
    // ctx.lineWidth = 2;
    ctx.arc(l.x, l.y, radius, endAngle, startAngle )
    // ctx.arc(l.x, l.y, radius+1, 0, Math.PI * 2)
    ctx.fill()

    tailStartX = radius*Math.cos(startAngle)
    tailStartY = radius*Math.sin(startAngle)
    tailEndX = radius*Math.cos(endAngle)
    tailEndY = radius*Math.sin(endAngle)

    tailDeg = ((l.windDir + 180) % 360)
    tailAngle = (Math.PI / 180) * tailDeg - (Math.PI / 2)
    w = l.windSpeed + ((l.windGust - l.windSpeed) * tm )
//         if ( l.key === 'LAFAYET')
//           console.log("w =" + w + " tm = " + tm + " l = " + l.windSpeed + " l = " + l.windGust)
    tailTipX = w*Math.cos(tailAngle)
    tailTipY = w*Math.sin(tailAngle)
    ctx.beginPath()
    ctx.fillStyle='hsl(' + hue + ',100%,50%)'
    ctx.moveTo(l.x + tailStartX, l.y + tailStartY)
    ctx.lineTo(l.x + tailTipX, l.y + tailTipY) // right side
    ctx.lineTo(l.x + tailEndX, l.y + tailEndY) // right side
    ctx.fill()

  }

  function drawMapPin(ctx, hue, x = 60, y = 60, r = 10, l = 10, d = 90) {
    ctx.save()
    pCanvas = document.createElement('canvas')
    pCanvas.width = r*2
    pCanvas.height = r + l
    pCtx = pCanvas.getContext('2d')

    pCtx.translate(r, (r+l)/2)
    pCtx.rotate(d * (Math.PI/180))
    pCtx.translate(-r, -((r+l)/2))
    pCtx.fillStyle='black'
    pCtx.beginPath();
    pCtx.moveTo(r*2,r);
    pCtx.bezierCurveTo(r*2, 0, 0, 0, 0, r)
    pCtx.quadraticCurveTo(0, r + l/2, r, r + l);
    pCtx.quadraticCurveTo(r*2, r + l/2, r*2, r);
    pCtx.fill();
    ctx.drawImage(pCanvas, x, y)
    ctx.restore()
  }

  function drawMapPin2(ctx, x = 60, y = 60, r = 10, l = 10, d = 90) {
    ctx.save()
    ctx.fillStyle='black'
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.bezierCurveTo(x+r, y-r, x-r, y-r, x-r, y)
    ctx.quadraticCurveTo(x-r, y + l/2, x, y + l);
    ctx.quadraticCurveTo(x + r, y + l/2, x + r, y);
    ctx.fill();
    ctx.restore()
  }

  function getHue(t) {
      // Map the temperature to a 0-1 range
      var a = (t + 30)/60;
      a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
      
      // Scrunch the green/cyan range in the middle
      var sign = (a < .5) ? -1 : 1;
      a = sign * Math.pow(2 * Math.abs(a - .5), .35)/2 + .5;
      
      // Linear interpolation between the cold and hot
      var h0 = 259;
      var h1 = 12;
      var h = (h0) * (1 - a) + (h1) * (a);
      return h;
  }
  // the main piece of the loop
  // runs everything
  function update () {
    // queue the next update
    window.requestAnimationFrame(update)

    // draw after logic/calculations
    draw()
  }
  // start our code once the page has loaded
  document.addEventListener('DOMContentLoaded', init)
})()