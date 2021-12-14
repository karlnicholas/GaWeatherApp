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
  }
  // draws stuff to the screen
  // allows us to separate calculations and drawing
  function draw () {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    // clear the canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw the ball (only object in this scene)
    if ( locations ) {
      locations.forEach(l => {
        hue = 200 + (160 * ( l.temp / 100 ))
        ctx.beginPath()
        ctx.fillStyle='hsl(' + hue + ',100%,50%)'
        startDeg = ((l.windDir - 90 + 360) % 360)
        endDeg = ((l.windDir + 90 + 360) % 360)
        startAngle = (Math.PI / 180) * startDeg - (Math.PI / 2)
        endAngle = (Math.PI / 180) * endDeg - (Math.PI / 2)

        ctx.arc(l.x, l.y, radius, startAngle, endAngle)
        ctx.fill()

        tailStartX = radius*Math.cos(startAngle)
        tailStartY = radius*Math.sin(startAngle)
        tailEndX = radius*Math.cos(endAngle)
        tailEndY = radius*Math.sin(endAngle)

        tailDeg = ((l.windDir + 180) % 360)
        tailAngle = (Math.PI / 180) * tailDeg - (Math.PI / 2)
        t = new Date().getTime()
        tm = ((t % 1000) / 100) / 10 
        if ( ((t % 2000) / 1000) % 2 > 1 ) {
          tm = 1 - tm
        }
        tailTipX = ((l.windSpeed - l.windGust > 0 ? l.windSpeed - l.windGust : 0 ) + ((l.windGust - l.windSpeed) * tm ))*Math.cos(tailAngle)
        tailTipY = ((l.windSpeed - l.windGust > 0 ? l.windSpeed - l.windGust : 0 ) + ((l.windGust - l.windSpeed) * tm ))*Math.sin(tailAngle)
        ctx.beginPath()
        ctx.moveTo(l.x + tailStartX, l.y + tailStartY)
        ctx.lineTo(l.x + tailTipX, l.y + tailTipY) // right side
        ctx.lineTo(l.x + tailEndX, l.y + tailEndY) // right side
        ctx.fill()
      })
    }
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