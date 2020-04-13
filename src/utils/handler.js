import { fabric } from 'fabric'

const isRefValid = (ref) => {
  return (
    ref &&
    ref.refs &&
    ref.refs.board &&
    ref.refs.board.refs &&
    ref.refs.board.refs.fabricCanvas &&
    ref.refs.toolbar &&
    ref.refs.toolbar.refs
  )
}

const getFabricCanvasFromRef = (ref) => {
  return ref.refs.board.refs.fabricCanvas
}

const getWhiteBoardData = (ref) => {
  if (isRefValid(ref) === false) return ''

  return getFabricCanvasFromRef(ref).toJSON()
}

const loadWhiteBoardData = (ref, data, cb) => {
  if (isRefValid(ref) === true) {
    getFabricCanvasFromRef(ref).loadFromJSON(data, cb)
  }
}

const addWhiteBoardObject = (ref, json) => {
  if (isRefValid(ref) === false) return

  const { board } = ref.refs

  try {
    const { mode, obj } = JSON.parse(json)
    const fabricCanvas = getFabricCanvasFromRef(ref)

    fabric.util.enlivenObjects([obj], (objects) => {
      var origRenderOnAddRemove = fabricCanvas.renderOnAddRemove
      fabricCanvas.renderOnAddRemove = false

      objects.forEach(function (o) {
        fabricCanvas.add(o)
      })

      fabricCanvas.renderOnAddRemove = origRenderOnAddRemove
      fabricCanvas.renderAll()
    })
  } catch (error) {
    console.error(error)
  }
}

const clearWhiteBoardContext = (ref) => {
  if (isRefValid(ref) === false) return

  getFabricCanvasFromRef(ref).clear()
}

export {
  getWhiteBoardData,
  loadWhiteBoardData,
  addWhiteBoardObject,
  clearWhiteBoardContext,
}
