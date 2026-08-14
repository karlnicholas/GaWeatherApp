;(function () {
  let canvas, ctx, legendCanvas, legendCtx, statusEl, locations
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
  const updateMs = 15 * 60 * 1000

  function init () {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    legendCanvas = document.getElementById('legendCanvas')
    legendCtx = legendCanvas.getContext('2d')
    statusEl = document.getElementById('status')
    sizeCanvas()
    sizeLegend()
    window.addEventListener('resize', onResize)
    startShowingWeather()
  }

  function onResize () {
    sizeCanvas()
    sizeLegend()
    projectStations()
    draw()
    drawLegend()
  }

  function sizeBacking (el, context, cssW, cssH) {
    const dpr = window.devicePixelRatio || 1
    el.width = Math.round(cssW * dpr)
    el.height = Math.round(cssH * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function sizeCanvas () {
    cssWidth = canvas.clientWidth
    cssHeight = canvas.clientHeight
    sizeBacking(canvas, ctx, cssWidth, cssHeight)
  }

  function sizeLegend () {
    sizeBacking(legendCanvas, legendCtx, legendCanvas.clientWidth, legendCanvas.clientHeight)
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
    setInterval(() => api(), updateMs)
  }

  function setStatus (text) {
    if (statusEl) {
      statusEl.textContent = text
    }
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
      const observed = formatObservation(data.observationDate)
      const count = locations ? locations.length : 0
      setStatus(observed + ' · ' + count + ' stations · updates every 15 minutes')
      draw()
      drawLegend()
    } catch (err) {
      console.error('api read failed', err)
      setStatus('Update failed · will try again in 15 minutes')
    }
  }

  function formatObservation (raw) {
    if (!raw) {
      return 'Fetched ' + new Date().toLocaleString()
    }
    return raw.replace(/^Conditions (at|on) /i, '')
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
    return {
      base: { x: l.x, y: l.y },
      tip: { x: l.x + dx * bodyLen, y: l.y + dy * bodyLen },
      gustTip: { x: l.x + dx * gustLen, y: l.y + dy * gustLen },
      left: { x: l.x + px * vaneHalfW, y: l.y + py * vaneHalfW },
      right: { x: l.x - px * vaneHalfW, y: l.y - py * vaneHalfW },
      extra: gustLen - bodyLen
    }
  }

  function drawSky (c, g, solar) {
    c.beginPath()
    c.arc(g.base.x, g.base.y, vaneHalfW, 0, Math.PI * 2)
    c.fillStyle = solarFill(solar)
    c.fill()
  }

  function drawVaneBody (c, g, hue) {
    c.beginPath()
    c.moveTo(g.left.x, g.left.y)
    c.lineTo(g.right.x, g.right.y)
    c.lineTo(g.tip.x, g.tip.y)
    c.closePath()
    c.fillStyle = 'hsl(' + hue + ',100%,50%)'
    c.strokeStyle = 'hsl(' + hue + ',80%,28%)'
    c.lineWidth = 1
    c.fill()
    c.stroke()
  }

  function drawGust (c, g, hue) {
    if (g.extra <= 2) {
      return
    }
    c.save()
    c.globalAlpha = 0.5
    c.strokeStyle = 'hsl(' + hue + ',80%,22%)'
    c.lineWidth = 1.5
    c.beginPath()
    c.moveTo(g.tip.x, g.tip.y)
    c.lineTo(g.gustTip.x, g.gustTip.y)
    c.stroke()
    c.restore()
  }

  function drawRainFoot (c, g, inches) {
    if (!inches || inches <= 0) {
      return
    }
    const heavy = inches >= rainHeavy
    const w = heavy ? 12 : 8
    const h = heavy ? 3.5 : 2
    c.fillStyle = heavy ? 'rgba(20,40,70,0.55)' : 'rgba(20,40,70,0.4)'
    c.fillRect(g.base.x - w / 2, g.base.y + vaneHalfW + 2, w, h)
  }

  function drawStationOn (c, l) {
    const hue = getHue((l.temp - 32) / 1.8)
    const g = vaneGeom(l)
    drawSky(c, g, l.solar)
    drawRainFoot(c, g, l.rainToday)
    drawVaneBody(c, g, hue)
    drawGust(c, g, hue)
  }

  function draw () {
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, cssWidth, cssHeight)
    if (!locations) {
      return
    }
    locations.forEach(l => drawStationOn(ctx, l))
  }

  function sample (x, y, extra) {
    const s = {
      x: x,
      y: y,
      temp: 88,
      windSpeed: 7,
      windDir: 270,
      windGust: 7,
      solar: 500,
      rainToday: 0
    }
    Object.assign(s, extra)
    return s
  }

  function legendLabel (c, x, y, text) {
    c.fillStyle = '#434242'
    c.font = '13px Georgia, Times, serif'
    c.textAlign = 'left'
    c.textBaseline = 'middle'
    c.fillText(text, x, y)
  }

  function drawLegend () {
    if (!legendCtx) {
      return
    }
    const w = legendCanvas.clientWidth
    const h = legendCanvas.clientHeight
    legendCtx.clearRect(0, 0, w, h)
    const markX = 28
    const labelX = 72
    const ys = [36, 108, 180, 252, 324, 396]
    const items = [
      { extra: { temp: 42, solar: 500 }, label: 'cold' },
      { extra: { temp: 92, solar: 500 }, label: 'hot' },
      { extra: { solar: 500, windSpeed: 4 }, label: 'sun' },
      { extra: { solar: 0, windSpeed: 4 }, label: 'night' },
      { extra: { windSpeed: 6, windGust: 18, solar: 300 }, label: 'gust' },
      { extra: { rainToday: 0.4, solar: 200 }, label: 'rain today' }
    ]
    items.forEach((item, i) => {
      drawStationOn(legendCtx, sample(markX, ys[i], item.extra))
      legendLabel(legendCtx, labelX, ys[i], item.label)
    })
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
