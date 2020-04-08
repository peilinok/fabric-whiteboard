import { fabric } from 'fabric'

export default function (from, fontSize, color) {
  return new fabric.Textbox('', {
    left: from.x - 60,
    top: from.y - 20,
    width: 150,
    fontSize: fontSize,
    borderColor: '#2c2c2c',
    fill: color,
    hasControls: true,
  })
}
