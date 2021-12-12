;(function () {
// initialize config variables here
let canvas, ctx

// function to create rectangle objects
class Rectangle {
  // you create new Rectangles by calling this as a function
  // these are the arguments you pass in
  // add default values to avoid errors on empty arguments
  constructor (
    x = 0, y = 0,
    width = 0, height = 0,
    fillColor = '', strokeColor = '', strokeWidth = 2
  ) {
    // ensure the arguments passed in are numbers
    // a bit overkill for this tutorial
    this.x = Number(x)
    this.y = Number(y)
    this.width = Number(width)
    this.height = Number(height)
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokeWidth
  }

  // get keyword causes this method to be called
  // when you use myRectangle.area
  get area () {
    return this.width * this.height
  }

  // gets the X position of the left side
  get left () {
    // origin is at top left so just return x
    return this.x
  }

  // get X position of right side
  get right () {
    // x is left position + the width to get end point
    return this.x + this.width
  }

  // get the Y position of top side
  get top () {
    // origin is at top left so just return y
    return this.y
  }

  // get Y position at bottom
  get bottom () {
    return this.y + this.height
  }

  // draw rectangle to screen
  draw () {
    // destructuring
    const {
      x, y, width, height,
      fillColor, strokeColor, strokeWidth
    } = this

    // saves the current styles set elsewhere
    // to avoid overwriting them
    ctx.save()

    // set the styles for this shape
    ctx.fillStyle = fillColor
    ctx.lineWidth = strokeWidth

    // create the *path*
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.rect(x, y, width, height)

    // draw the path to screen
    ctx.fill()
    ctx.stroke()

    // restores the styles from earlier
    // preventing the colors used here
    // from polluting other drawings
    ctx.restore()
  }
}

  // draws a grid
  function createGrid () {
    // draw a line every *step* pixels
    const step = 50

    // our end points
    const width = canvas.width
    const height = canvas.height

    // set our styles
    ctx.save()
    ctx.strokeStyle = 'gray' // line colors
    ctx.fillStyle = 'black' // text color
    ctx.font = '14px Monospace'
    ctx.lineWidth = 0.35

    // draw vertical from X to Height
    for (let x = 0; x < width; x += step) {
      // draw vertical line
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()

      // draw text
      ctx.fillText(x, x, 12)
    }

    // draw horizontal from Y to Width
    for (let y = 0; y < height; y += step) {
      // draw horizontal line
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()

      // draw text
      ctx.fillText(y, 0, y)
    }

    // restore the styles from before this function was called
    ctx.restore()
  }

function init () {
  // set our config variables
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')

  createGrid()

  // outlined square X: 50, Y: 35, width/height 50
  ctx.beginPath()
  ctx.strokeRect(50, 35, 50, 50)

  // filled square X: 125, Y: 35, width/height 50
  ctx.beginPath()
  ctx.fillRect(125, 35, 50, 50)

  // filled, outlined square X: 200, Y: 35, width/height 50
  ctx.beginPath()
  ctx.strokeStyle = 'red'
  ctx.fillStyle = 'blue'
  ctx.lineWidth = 5
  ctx.rect(200, 35, 50, 50)
  ctx.fill()
  ctx.stroke()

  // 4th square, uses the same style defined previously
  ctx.beginPath()
  ctx.rect(275, 35, 50, 50)
  ctx.fill()
  ctx.stroke()

  // create a new rectangle object using the Rectangle class
  const mySquare = new Rectangle(400, 85, 50, 50, 'gold')

  // now we have data and methods to describe our square
  console.log(mySquare)
  // Object
  // fillColor: "gold"
  // height: 50
  // strokeColor: ""
  // strokeWidth: 2
  // width: 50
  // x: 450
  // y: 100
  // area: (...)
  // bottom: (...)
  // left: (...)
  // right: (...)
  // top: (...)

  // draw the square data to screen
  mySquare.draw()  

  // mySquare from earlier...
  // const mySquare = new Rectangle(400, 85, 50, 50, 'gold')

  // lets use the helper methods to
  // draw shapes on the sides of mySquare
  const childrenSquares = [
    // top side square - align x with mySquare's left side
    // align bottom with top of mySquare
    new Rectangle(mySquare.left, mySquare.top - 50, 50, 50, 'red'),

    // right side square - align x with right side of mySquare
    // align top with mySquare top
    new Rectangle(mySquare.right, mySquare.top, 50, 50, 'green'),

    // bottom square
    new Rectangle(mySquare.left, mySquare.bottom, 50, 50, 'blue'),

    // left square
    new Rectangle(mySquare.left - 50, mySquare.top, 50, 50, 'magenta')
  ]

  // draw all of the child squares by looping over them
  childrenSquares.forEach(square => square.draw())
  // LINES

  // save previous styles & set our current styles
  ctx.save()
  ctx.strokeStyle = 'blue'
  ctx.fillStyle = 'blue'
  ctx.lineWidth = 4

  // stroked trapezoid
  ctx.beginPath()
  ctx.moveTo(50, 200) // sets our starting point
  ctx.lineTo(100, 200) // create a line from start point to X: 100, Y: 200
  ctx.lineTo(90, 180) // create the right side
  ctx.lineTo(60, 180) // top side
  ctx.closePath() // left side and closes the path
  ctx.stroke() // draws it to screen via a stroke

  // filled trapezoid
  ctx.beginPath()
  ctx.moveTo(150, 200) // starting point
  ctx.lineTo(200, 200) // bottom side
  ctx.lineTo(190, 180) // right side
  ctx.lineTo(160, 180) // top side
  // no need to closePath, fill automatically closes the path
  ctx.fill()

  // restore saved styles (for other examples)
  ctx.restore()

  // TEXT

  // usual setup
  ctx.save()
  ctx.strokeStyle = 'red'
  ctx.fillStyle = 'black'

  // text specific styles
  ctx.font = 'bold 16px Monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // draw stroked text to screen
  ctx.strokeText('Stroked Text', 50, 250)

  // calculate the width of this text using current font/styles
  const textWidth = ctx.measureText('Stroked Text').width

  // X = previous X position + width + 25px margin
  ctx.fillText('Filled Text', 50 + textWidth + 25, 250)

  ctx.restore()

  // ARCS / Circles
  // usual setup
  ctx.save()
  ctx.strokeStyle = 'black'
  ctx.fillStyle = 'red'

  // x, y, radius, startAngle, endAngle, antiClockwise = false by default
  ctx.beginPath()
  ctx.arc(50, 300, 15, 0, 2 * Math.PI, false) // full circle
  ctx.fill()
  ctx.stroke()

  // half circle counter clockwise
  ctx.beginPath()
  ctx.arc(100, 300, 15, 0, Math.PI, true)
  ctx.fill()
  ctx.stroke()

  // half circle clockwise
  ctx.beginPath()
  ctx.arc(150, 300, 15, 0, Math.PI)
  ctx.fill()
  ctx.stroke()

  // pacman like
  ctx.beginPath()
  ctx.fillStyle = 'gold'
  ctx.arc(200, 300, 15, 0.1 * Math.PI, 1.85 * Math.PI)
  ctx.lineTo(200, 300)
  ctx.fill()

  ctx.restore()

  // TRIANGLES
  // usual setup
  ctx.save()
  ctx.strokeStyle = 'black'
  ctx.fillStyle = 'orangered'

  // Filled Triangle
  ctx.beginPath()
  ctx.moveTo(50, 400) // starting point
  ctx.lineTo(50, 350) // left side
  ctx.lineTo(100, 400) // hypotenuse / long side
  ctx.fill() // closes the bottom side & fills

  // stroked triangle
  ctx.beginPath()
  ctx.moveTo(150, 400) // starting point
  ctx.lineTo(200, 400) // bottom side
  ctx.lineTo(200, 350) // right side
  ctx.closePath() // hypotenuse/long side (remember to close path for strokes!)
  ctx.stroke()

  ctx.restore()

  
}
// wait for the HTML to load
document.addEventListener('DOMContentLoaded', init)

})()