;(function () {
  let canvas, ctx, locations
  const radius = 10
  const frameMs = 80
  let animating = false
  let lastFrame = 0

  function init () {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    startShowingWeather()
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
      console.log('api read at ' + new Date())
      draw()
      startAnimation()
    } catch (err) {
      console.error('api read failed', err)
    }
  }

  function pulse (now) {
    let tm = ((now % 1000) / 100) / 10
    if (((now % 2000) / 1000) % 2 > 1) {
      tm = 1 - tm
    }
    return tm
  }

  function needsPulse () {
    return locations && locations.some(l =>
      l.rainFall > 0 || l.windGust !== l.windSpeed
    )
  }

  function startAnimation () {
    if (animating || !needsPulse()) {
      return
    }
    animating = true
    window.requestAnimationFrame(update)
  }

  function update (now) {
    if (now - lastFrame >= frameMs) {
      lastFrame = now
      draw()
    }
    if (needsPulse()) {
      window.requestAnimationFrame(update)
    } else {
      animating = false
    }
  }

  function draw () {
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const tm = pulse(Date.now())
    if (locations) {
      locations.forEach(l => {
        const e = l.elevation / 100
        const m1 = e / 2
        const m2 = e - m1
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'black'
        ctx.moveTo(l.x - m1, l.y + m1)
        ctx.lineTo(l.x, l.y - m2)
        ctx.lineTo(l.x + m2, l.y + m1)
        ctx.closePath()
        ctx.stroke()

        if (l.humidity > 90) {
          ctx.beginPath()
          ctx.lineWidth = 1
          ctx.strokeStyle = 'hsl(190,100%,50%)'
          ctx.arc(l.x, l.y, radius, 0, Math.PI * 2)
          ctx.stroke()
        } else if (l.rainFall > 0) {
          const r = l.rainFall
          ctx.beginPath()
          ctx.lineWidth = r - 0.51 + tm
          ctx.strokeStyle = 'hsl(210,100%,50%)'
          ctx.arc(l.x, l.y, radius + r / 2, 0, Math.PI * 2)
          ctx.stroke()
        }
        drawWindInd(ctx, l, tm)
      })
    }
  }

  function drawWindInd (ctx, l, tm) {
    const hue = getHue((l.temp - 32) / 1.8)
    const startDeg = ((l.windDir - 90 + 360) % 360)
    const endDeg = ((l.windDir + 90 + 360) % 360)
    const startAngle = (Math.PI / 180) * startDeg - (Math.PI / 2)
    const endAngle = (Math.PI / 180) * endDeg - (Math.PI / 2)

    ctx.beginPath()
    ctx.fillStyle = 'hsl(' + hue + ',100%,50%)'
    ctx.arc(l.x, l.y, radius, startAngle, endAngle)
    ctx.fill()

    const sat = l.solar / 10.0
    ctx.beginPath()
    ctx.fillStyle = 'hsl(180,100%,' + sat + '%)'
    ctx.arc(l.x, l.y, radius, endAngle, startAngle)
    ctx.fill()

    const tailStartX = radius * Math.cos(startAngle)
    const tailStartY = radius * Math.sin(startAngle)
    const tailEndX = radius * Math.cos(endAngle)
    const tailEndY = radius * Math.sin(endAngle)

    const tailDeg = ((l.windDir + 180) % 360)
    const tailAngle = (Math.PI / 180) * tailDeg - (Math.PI / 2)
    const w = l.windSpeed + ((l.windGust - l.windSpeed) * tm)
    const tailTipX = w * Math.cos(tailAngle)
    const tailTipY = w * Math.sin(tailAngle)
    ctx.beginPath()
    ctx.fillStyle = 'hsl(' + hue + ',100%,50%)'
    ctx.moveTo(l.x + tailStartX, l.y + tailStartY)
    ctx.lineTo(l.x + tailTipX, l.y + tailTipY)
    ctx.lineTo(l.x + tailEndX, l.y + tailEndY)
    ctx.fill()
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
