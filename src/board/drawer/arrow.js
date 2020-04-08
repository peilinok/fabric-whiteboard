import { fabric } from 'fabric'

function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
  theta = typeof theta != 'undefined' ? theta : 30
  headlen = typeof theta != 'undefined' ? headlen : 10
  var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI,
    angle1 = ((angle + theta) * Math.PI) / 180,
    angle2 = ((angle - theta) * Math.PI) / 180,
    topX = headlen * Math.cos(angle1),
    topY = headlen * Math.sin(angle1),
    botX = headlen * Math.cos(angle2),
    botY = headlen * Math.sin(angle2)
  var arrowX = fromX - topX,
    arrowY = fromY - topY
  var path = ' M ' + fromX + ' ' + fromY
  path += ' L ' + toX + ' ' + toY
  arrowX = toX + topX
  arrowY = toY + topY
  path += ' M ' + arrowX + ' ' + arrowY
  path += ' L ' + toX + ' ' + toY
  arrowX = toX + botX
  arrowY = toY + botY
  path += ' L ' + arrowX + ' ' + arrowY
  return path
}

export default function (from, to, color, fill, width) {
  return new fabric.Path(drawArrow(from.x, from.y, to.x, to.y, 20, 18), {
    stroke: color,
    fill: fill,
    strokeWidth: width,
  })
}
