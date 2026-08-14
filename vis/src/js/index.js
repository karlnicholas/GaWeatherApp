;(function () {
  let canvas, ctx, locations
  let cssWidth = 0
  let cssHeight = 0

  // georgia68.svg is an A4 plate (viewBox 0 0 21000 29700) drawn
  // at the canvas CSS size. These edges are that plate in lon/lat,
  // inverted from the old Atlanta/Savannah pixel fit so stations
  // stay on the artwork. Equirectangular onto the viewBox.
  const mapWest = -86.060566
  const mapEast = -80.330918
  const mapNorth = 35.606757
  const mapSouth = 28.805904

  const solarFull = 400
  const rainHeavy = 0.25
  const vaneHead = 10
  const pxPerMph = 1.6
  const vaneHalfW = 6

  function init () {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    sizeCanvas()
    window.addEventListener('resize', onResize)
    startShowingWeather()
  }

  function onResize () {
    sizeCanvas()
    projectStations()
    draw()
  }

  function sizeCanvas () {
    const dpr = window.devicePixelRatio || 1
    cssWidth = canvas.clientWidth
    cssHeight = canvas.clientHeight
    canvas.width = Math.round(cssWidth * dpr)
    canvas.height = Math.round(cssHeight * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function project (lat, lon) {
    return {
      x: (lon - mapWest) / (mapEast - mapWest) * cssWidth,
      y: (mapNorth - lat) / (mapNorth - mapSouth) * cssHeight
    }
  }

  function projectStations () {
    if (!locations) {
      return
    }
    locations.forEach(l => {
      const p = project(l.latitude, l.longitude)
      l.x = p.x
      l.y = p.y
    })
  }

  function startShowingWeather () {
    api()
    setInterval(() => api(), 900000)
  }

  async function api () {
    try {
      const response = await fetch('/api/gastations')
      if (!response.ok) {
        throw new Error('HTTP ' + response.status)
      }
      const data = await response.json()
      locations = data.gaStations
      projectStations()
      console.log('api read at ' + new Date())
      draw()
    } catch (err) {
      console.error('api read failed', err)
    }
  }

  function solarFill (solar) {
    const t = Math.max(0, Math.min(1, (solar || 0) / solarFull))
    return 'hsl(190,100%,' + (t * 50) + '%)'
  }

  function vaneGeom (l) {
    const goingDeg = ((l.windDir + 180) % 360)
    const going = (Math.PI / 180) * goingDeg - (Math.PI / 2)
    const dx = Math.cos(going)
    const dy = Math.sin(going)
    const px = -dy
    const py = dx
    const speed = l.windSpeed || 0
    const gust = Math.max(speed, l.windGust || 0)
    const bodyLen = vaneHead + pxPerMph * speed
    const gustLen = vaneHead + pxPerMph * gust
    const base = { x: l.x, y: l.y }
    return {
      base: base,
      tip: { x: l.x + dx * bodyLen, y: l.y + dy * bodyLen },
      gustTip: { x: l.x + dx * gustLen, y: l.y + dy * gustLen },
      left: { x: l.x + px * vaneHalfW, y: l.y + py * vaneHalfW },
      right: { x: l.x - px * vaneHalfW, y: l.y - py * vaneHalfW },
      extra: gustLen - bodyLen
    }
  }

  function drawSky (g, solar) {
    ctx.beginPath()
    ctx.arc(g.base.x, g.base.y, vaneHalfW, 0, Math.PI * 2)
    ctx.fillStyle = solarFill(solar)
    ctx.fill()
  }

  function drawVaneBody (g, hue) {
    ctx.beginPath()
    ctx.moveTo(g.left.x, g.left.y)
    ctx.lineTo(g.right.x, g.right.y)
    ctx.lineTo(g.tip.x, g.tip.y)
    ctx.closePath()
    ctx.fillStyle = 'hsl(' + hue + ',100%,50%)'
    ctx.strokeStyle = 'hsl(' + hue + ',80%,28%)'
    ctx.lineWidth = 1
    ctx.fill()
    ctx.stroke()
  }

  function drawGust (g, hue) {
    if (g.extra <= 2) {
      return
    }
    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = 'hsl(' + hue + ',80%,22%)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(g.tip.x, g.tip.y)
    ctx.lineTo(g.gustTip.x, g.gustTip.y)
    ctx.stroke()
    ctx.restore()
  }

  function drawRainFoot (g, inches) {
    if (!inches || inches <= 0) {
      return
    }
    const heavy = inches >= rainHeavy
    const w = heavy ? 12 : 8
    const h = heavy ? 3.5 : 2
    ctx.fillStyle = heavy ? 'rgba(20,40,70,0.55)' : 'rgba(20,40,70,0.4)'
    ctx.fillRect(g.base.x - w / 2, g.base.y + vaneHalfW + 2, w, h)
  }

  function drawStation (l) {
    const hue = getHue((l.temp - 32) / 1.8)
    const g = vaneGeom(l)
    drawSky(g, l.solar)
    drawRainFoot(g, l.rainToday)
    drawVaneBody(g, hue)
    drawGust(g, hue)
  }

  function draw () {
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, cssWidth, cssHeight)
    if (!locations) {
      return
    }
    locations.forEach(drawStation)
  }

  function getHue (t) {
    var a = (t + 30) / 60
    a = (a < 0) ? 0 : ((a > 1) ? 1 : a)

    var sign = (a < 0.5) ? -1 : 1
    a = sign * Math.pow(2 * Math.abs(a - 0.5), 0.35) / 2 + 0.5

    var h0 = 259
    var h1 = 12
    return (h0) * (1 - a) + (h1) * (a)
  }

  document.addEventListener('DOMContentLoaded', init)
})()
