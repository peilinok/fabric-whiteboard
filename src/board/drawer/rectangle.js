import { fabric } from 'fabric'

export default function (from, to, color, width) {
  var path =
    'M ' +
    from.x +
    ' ' +
    from.y +
    ' L ' +
    to.x +
    ' ' +
    from.y +
    ' L ' +
    to.x +
    ' ' +
    to.y +
    ' L ' +
    from.x +
    ' ' +
    to.y +
    ' L ' +
    from.x +
    ' ' +
    from.y +
    ' z'

  return new fabric.Path(path, {
    left: from.x,
    top: from.y,
    stroke: color,
    strokeWidth: width,
    fill: 'rgba(255, 255, 255, 0)',
  })
}
