import { fabric } from 'fabric'

export default function (points, color, width) {
  return new fabric.Polygon(points, {
    stroke: color,
    strokeWidth: width,
    fill: 'rgba(255, 255, 255, 0)',
    opacity: 1,
    hasBorders: true,
    hasControls: false,
  })
}
