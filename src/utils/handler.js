import { fabric } from 'fabric'

fabric.Canvas.prototype.getObjectById = (id) => {
  var objs = fabric.Canvas.prototype.getObjects()
  for (var i = 0, len = objs.length; i < len; i++) {
    if (objs[i].id == id) {
      return objs[i]
    }
  }
  return null
}

const isRefValid = (ref) => {
  return !(
    ref === null ||
    ref === undefined ||
    ref.refs === null ||
    ref.refs === undefined ||
    ref.refs.board === null ||
    ref.refs.board === undefined ||
    ref.refs.board.refs === null ||
    ref.refs.board.refs === undefined ||
    ref.refs.board.refs.fabricCanvas === null ||
    ref.refs.board.refs.fabricCanvas === undefined ||
    ref.refs.toolbar === null ||
    ref.refs.toolbar === undefined ||
    ref.refs.toolbar.refs === null ||
    ref.refs.toolbar.refs === undefined
  )
}

const getFabricCanvasFromRef = (ref) => {
  return ref.refs.board.refs.fabricCanvas
}

const getWhiteBoardObjectById = (canvas, id) => {
  var objs = canvas.getObjects()
  for (var i = 0, len = objs.length; i < len; i++) {
    if (objs[i].id == id) {
      return objs[i]
    }
  }
  return null
}

const getWhiteBoardData = (ref) => {
  if (isRefValid(ref) === false) return ''

  return getFabricCanvasFromRef(ref).toJSON(['id'])
}

const loadWhiteBoardData = (ref, data, cb) => {
  if (isRefValid(ref) === false) return

  getFabricCanvasFromRef(ref).loadFromJSON(data, cb)
}

const addWhiteBoardObject = (ref, json) => {
  if (isRefValid(ref) === false) return

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

const removeWhiteBoardObjects = (ref, jsonArray) => {
  if (isRefValid(ref) === false) return
  const fabricCanvas = getFabricCanvasFromRef(ref)

  try {
    var origRenderOnAddRemove = fabricCanvas.renderOnAddRemove
    fabricCanvas.renderOnAddRemove = false

    const targets = JSON.parse(jsonArray)
    targets.forEach((targetId) => {
      const targetObj = getWhiteBoardObjectById(fabricCanvas, targetId)
      if (targetObj !== null) fabricCanvas.remove(targetObj)
    })

    fabricCanvas.renderOnAddRemove = origRenderOnAddRemove
    fabricCanvas.renderAll()
  } catch (error) {
    console.error(error)
  }
}

const modifyWhiteBoardObjects = (ref, jsonArray) => {
  if (isRefValid(ref) === false) return
  const fabricCanvas = getFabricCanvasFromRef(ref)

  console.info('apply modify', jsonArray)
  try {
    const targets = JSON.parse(jsonArray)
    targets.forEach((target) => {
      const targetObj = getWhiteBoardObjectById(fabricCanvas, target.id)
      if (targetObj !== null) targetObj.set(target)
    })

    fabricCanvas.renderAll()
    fabricCanvas.calcOffset()
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
  modifyWhiteBoardObjects,
  removeWhiteBoardObjects,
  clearWhiteBoardContext,
}
