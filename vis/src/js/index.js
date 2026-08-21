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
  const markRadius = 12
  const windRefMph = 10
  const rainRefInches = 1
  const calmLine = 3
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

  function drawRain (c, x, y, inches) {
    if (!inches || inches <= 0) {
      return
    }
    const w = markRadius * 2
    const h = (inches / rainRefInches) * markRadius
    if (h < 0.5) {
      return
    }
    c.fillStyle = 'hsl(210,80%,32%)'
    c.fillRect(x - w / 2, y, w, h)
  }

  function drawDisc (c, x, y, solar) {
    c.beginPath()
    c.arc(x, y, markRadius, 0, Math.PI * 2)
    c.fillStyle = solarFill(solar)
    c.fill()
  }

  function windGoing (windDir) {
    const goingDeg = ((windDir + 180) % 360)
    return (Math.PI / 180) * goingDeg - (Math.PI / 2)
  }

  function drawGustBar (c, x, y, dx, dy, extraMph) {
    if (extraMph <= 0) {
      return
    }
    const gLen = (extraMph / windRefMph) * markRadius
    if (gLen < 0.5) {
      return
    }
    const hw = 1.5
    const hx = -dy * hw
    const hy = dx * hw
    const ex = x + dx * gLen
    const ey = y + dy * gLen
    c.beginPath()
    c.moveTo(x + hx, y + hy)
    c.lineTo(x - hx, y - hy)
    c.lineTo(ex - hx, ey - hy)
    c.lineTo(ex + hx, ey + hy)
    c.closePath()
    c.fill()
    c.stroke()
  }

  function drawWind (c, l) {
    const going = windGoing(l.windDir || 0)
    const dx = Math.cos(going)
    const dy = Math.sin(going)
    const hue = getHue((l.temp - 32) / 1.8)
    const speed = l.windSpeed || 0
    const gust = l.windGust || 0
    c.strokeStyle = 'hsl(' + hue + ',80%,28%)'
    c.fillStyle = 'hsl(' + hue + ',100%,50%)'
    c.lineWidth = 1

    if (speed <= 0) {
      c.beginPath()
      c.moveTo(l.x, l.y)
      c.lineTo(l.x + dx * calmLine, l.y + dy * calmLine)
      c.lineWidth = 2
      c.stroke()
      c.lineWidth = 1
      drawGustBar(c, l.x + dx * calmLine, l.y + dy * calmLine, dx, dy, gust)
      return
    }

    const len = (speed / windRefMph) * markRadius
    const px = -dy
    const py = dx
    const tipX = l.x + dx * len
    const tipY = l.y + dy * len
    c.beginPath()
    c.moveTo(tipX, tipY)
    c.lineTo(l.x + px * markRadius, l.y + py * markRadius)
    c.lineTo(l.x - px * markRadius, l.y - py * markRadius)
    c.closePath()
    c.fill()
    c.stroke()
    drawGustBar(c, tipX, tipY, dx, dy, gust - speed)
  }

  function drawStation (c, l) {
    drawRain(c, l.x, l.y, l.rainToday)
    drawDisc(c, l.x, l.y, l.solar)
    drawWind(c, l)
  }

  function draw () {
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, cssWidth, cssHeight)
    if (!locations) {
      return
    }
    locations.forEach(l => drawStation(ctx, l))
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
    const labelX = 52
    const items = [
      { solar: 500, label: 'sun' },
      { solar: 200, label: 'hazy' },
      { solar: 0, label: 'night' }
    ]
    items.forEach((item, i) => {
      const y = 36 + i * 72
      drawDisc(legendCtx, markX, y, item.solar)
      legendLabel(legendCtx, labelX, y, item.label)
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
