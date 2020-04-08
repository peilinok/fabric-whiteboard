import { fabric } from 'fabric'

export default function (from, to, color, width) {
  var left = from.x
  var top = from.y
  return new fabric.Ellipse({
    left: left,
    top: top,
    stroke: color,
    fill: 'rgba(255, 255, 255, 0)',
    originX: 'center',
    originY: 'center',
    rx: Math.abs(left - to.x),
    ry: Math.abs(top - to.y),
    strokeWidth: width,
  })
}
