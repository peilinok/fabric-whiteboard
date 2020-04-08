import { fabric } from 'fabric'

export default function (from, to, color, width) {
  return new fabric.Line([from.x, from.y, to.x, to.y], {
    stroke: color,
    strokeWidth: width,
  })
}
