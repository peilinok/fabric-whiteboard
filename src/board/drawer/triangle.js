import { fabric } from 'fabric'

//all 60 degree
const drawEquilateral = (from, to, color, width) => {
  var height = to.y - from.y
  return new fabric.Triangle({
    top: from.y,
    left: from.x,
    width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2)),
    height: height,
    stroke: color,
    strokeWidth: width,
    fill: 'rgba(255,255,255,0)',
  })
}

//has 90 degree
const drawRightangle = (from, to, color, width) => {
  var path =
    'M ' +
    from.x +
    ' ' +
    from.y +
    ' L ' +
    from.x +
    ' ' +
    to.y +
    ' L ' +
    to.x +
    ' ' +
    to.y +
    ' z'
  return new fabric.Path(path, {
    left: from.x,
    top: from.y,
    stroke: color,
    strokeWidth: width,
    fill: 'rgba(255, 255, 255, 0)',
  })
}

export default function (from, to, color, width, isEquialateral) {
  if (isEquialateral === true) return drawEquilateral(from, to, color, width)
  else return drawRightangle(from, to, color, width)
}
