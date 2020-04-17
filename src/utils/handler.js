import { fabric } from 'fabric'

/**
 * return true if ref is valid,otherwise return false
 * @param {object} ref
 */
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

/**
 * return fabric canvas from ref of WhiteBoard,should call isRefValid first
 * @param {object} ref
 */
const getFabricCanvasFromRef = (ref) => {
  return ref.refs.board.refs.fabricCanvas
}

/**
 * return object by id in specified fabric canvas,return null when do not have one
 * @param {object} canvas
 * @param {string} id
 */
const getWhiteBoardObjectById = (canvas, id) => {
  var objs = canvas.getObjects()
  for (var i = 0, len = objs.length; i < len; i++) {
    if (objs[i].id === id) {
      return objs[i]
    }
  }
  return null
}

/**
 * return whiteboard data in json
 * @param {object} ref
 */
const getWhiteBoardData = (ref) => {
  if (isRefValid(ref) === false) return ''

  console.debug('getWhiteBoardData')

  return getFabricCanvasFromRef(ref).toJSON(['id', 'relationship'])
}

/**
 * load data with specified fabric canvas in ref
 * @param {object} ref
 * @param {string} data
 * @param {function} cb
 */
const loadWhiteBoardData = (ref, data, cb) => {
  if (isRefValid(ref) === false) return

  console.debug('loadWhiteBoardData')

  getFabricCanvasFromRef(ref).loadFromJSON(data, cb)
}

/**
 * add objects defined in json to specified fabric canvas
 * @param {object} ref
 * @param {string} json
 */
const addWhiteBoardObject = (ref, json) => {
  if (isRefValid(ref) === false) return

  console.debug('addWhiteBoardObject')

  try {
    const { mode, obj } = JSON.parse(json)
    const fabricCanvas = getFabricCanvasFromRef(ref)

    fabric.util.enlivenObjects([obj], (objects) => {
      var origRenderOnAddRemove = fabricCanvas.renderOnAddRemove
      fabricCanvas.renderOnAddRemove = false

      objects.forEach(function (o) {
        let existObj = getWhiteBoardObjectById(fabricCanvas, o.id)

        if (existObj === null) fabricCanvas.add(o)
        else existObj.set(o)

        let invertedMatrix = fabric.util.invertTransform(
          o.calcTransformMatrix()
        )
        o.relationship = fabric.util.multiplyTransformMatrices(
          invertedMatrix,
          o.calcTransformMatrix()
        )
      })

      fabricCanvas.renderOnAddRemove = origRenderOnAddRemove
      fabricCanvas.renderAll()
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * remove objects by ids in specified fabric canvas in ref
 * @param {object} ref
 * @param {string} jsonArray
 */
const removeWhiteBoardObjects = (ref, jsonArray) => {
  if (isRefValid(ref) === false) return
  const fabricCanvas = getFabricCanvasFromRef(ref)

  console.debug('removeWhiteBoardObjects')

  try {
    var origRenderOnAddRemove = fabricCanvas.renderOnAddRemove
    fabricCanvas.renderOnAddRemove = false

    const targets = JSON.parse(jsonArray)
    targets.forEach((target) => {
      const targetObj = getWhiteBoardObjectById(fabricCanvas, target.id)
      if (targetObj !== null) fabricCanvas.remove(targetObj)
    })

    fabricCanvas.renderOnAddRemove = origRenderOnAddRemove
    fabricCanvas.renderAll()
  } catch (error) {
    console.error(error)
  }
}

const applyMatrixWithRelationship = (
  fabricCanvas,
  targetObj,
  relationship,
  matrix,
  point,
  transform = null,
  useAnimation = false
) => {
  let newMatrix = fabric.util.multiplyTransformMatrices(matrix, relationship)

  let newTransform = fabric.util.qrDecompose(newMatrix)

  targetObj.set({
    flipX: false,
    flipY: false,
  })

  if (useAnimation === false || transform === null) {
    targetObj.set(newTransform)
    targetObj.setPositionByOrigin(point, 'left', 'top')
    targetObj.setCoords()
  } else {
    let animationProps = {}
    let animationOptions = {
      duration: 200,
      onChange: fabricCanvas.renderAll.bind(fabricCanvas),
      onComplete: () => {
        targetObj.set(newTransform)
        targetObj.setPositionByOrigin(point, 'left', 'top')
        targetObj.setCoords()
      },
    }
    let isSupport = true

    switch (transform.action) {
      case 'drag':
        animationProps.left = point.x
        animationProps.top = point.y
        break
      case 'rotate':
        animationProps.left = point.x
        animationProps.top = point.y
        animationProps.angle = newTransform.angle
        if (targetObj.type === 'circle' || targetObj.type === 'ellipse')
          isSupport = false
        break
      default:
        isSupport = false
        console.error('unsupported action', transform.action)
        break
    }

    if (isSupport === true) targetObj.animate(animationProps, animationOptions)
    else {
      targetObj.set(newTransform)
      targetObj.setPositionByOrigin(point, 'left', 'top')
      targetObj.setCoords()
    }
  }
}

/**
 * apply modify by specified selection or object,if specified a selection will auto add one
 * @param {object} ref
 * @param {string} json
 */
const modifyWhiteBoardObjects = (ref, json, useAnimation = false) => {
  if (isRefValid(ref) === false) return
  const fabricCanvas = getFabricCanvasFromRef(ref)

  console.debug('modifyWhiteBoardObjects')

  try {
    const {
      target,
      invertedMatrix,
      matrix,
      hasTransform,
      transform,
      selected,
      point,
    } = JSON.parse(json)

    if (target.type === 'textbox' && hasTransform === false) {
      const targetObj = getWhiteBoardObjectById(fabricCanvas, target.id)
      if (targetObj !== null) targetObj.set('text', target.text)

      return
    }

    if (target.type !== 'activeSelection') {
      const targetObj = getWhiteBoardObjectById(fabricCanvas, target.id)
      if (targetObj !== null) {
        applyMatrixWithRelationship(
          fabricCanvas,
          targetObj,
          targetObj.relationship,
          matrix,
          point,
          transform,
          useAnimation
        )
      }

      fabricCanvas.requestRenderAll()
    } else {
      let activeObj = fabricCanvas.getActiveObject()
      if (activeObj === null) {
        const selectedObjs = []
        selected.forEach((obj) => {
          let existObj = getWhiteBoardObjectById(fabricCanvas, obj.id)
          if (existObj !== null) selectedObjs.push(existObj)
        })

        const sel = new fabric.ActiveSelection(selectedObjs, {
          canvas: fabricCanvas,
        })

        const desiredMatrix = fabric.util.multiplyTransformMatrices(
          invertedMatrix,
          sel.calcTransformMatrix()
        )

        sel.relationship = desiredMatrix

        fabricCanvas.setActiveObject(sel)

        applyMatrixWithRelationship(
          fabricCanvas,
          sel,
          sel.relationship,
          matrix,
          point,
          transform,
          useAnimation
        )
      } else {
        applyMatrixWithRelationship(
          fabricCanvas,
          activeObj,
          activeObj.relationship,
          matrix,
          point,
          transform,
          useAnimation
        )
      }

      fabricCanvas.requestRenderAll()
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * clear all context in specified fabric canvas in ref
 * @param {object} ref
 */
const clearWhiteBoardContext = (ref) => {
  if (isRefValid(ref) === false) return

  console.debug('clearWhiteBoardContext')

  getFabricCanvasFromRef(ref).clear()
}

/**
 * create selection
 * @param {object} ref
 * @param {string} selectionJson
 */
const createWhiteBoardSelection = (ref, selectionJson) => {
  if (isRefValid(ref) === false) return

  console.debug('createWhiteBoardSelection')

  try {
    const { target, invertedMatrix, selected } = JSON.parse(selectionJson)
    const fabricCanvas = getFabricCanvasFromRef(ref)

    fabricCanvas.discardActiveObject()

    let sel = null
    if (target.type === 'activeSelection') {
      //multi select
      const selectedObjs = []
      selected.forEach((obj) => {
        const targetObj = getWhiteBoardObjectById(fabricCanvas, obj.id)
        if (targetObj !== null) {
          selectedObjs.push(targetObj)
        }
      })

      sel = new fabric.ActiveSelection(selectedObjs, target)
      sel.set('canvas', fabricCanvas)

      const desiredMatrix = fabric.util.multiplyTransformMatrices(
        invertedMatrix,
        sel.calcTransformMatrix()
      )

      sel.relationship = desiredMatrix
    } else {
      //single object select
      sel = getWhiteBoardObjectById(fabricCanvas, target.id)
    }

    if (sel !== null) {
      fabricCanvas.setActiveObject(sel)
      fabricCanvas.requestRenderAll()
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * update specified selection,include add and remove
 * @param {object} ref
 * @param {string} selectionJson
 */
const updateWhiteBoardSelection = (ref, selectionJson) => {
  if (isRefValid(ref) === false) return

  console.debug('updateWhiteBoardSelection')

  try {
    const fabricCanvas = getFabricCanvasFromRef(ref)
    const { target, invertedMatrix, selectedIds, deselectedIds } = JSON.parse(
      selectionJson
    )

    const selObjects = []
    let sel = fabricCanvas.getActiveObject()

    if (sel && (sel.type !== target.type || sel.id !== target.id)) {
      console.debug('type or id is different,discard')
      //should add already selected object,
      //for that update will not trigger already selected objects
      selObjects.push(sel)
      fabricCanvas.discardActiveObject()
      sel = null
    }

    //already exist just update the selection
    if (sel !== null) {
      console.debug('sel do exist update')
      selectedIds.forEach((id) => {
        const targetObj = getWhiteBoardObjectById(fabricCanvas, id)
        if (targetObj !== null && sel.contains(targetObj) === false)
          sel.addWithUpdate(targetObj)
      })

      deselectedIds.forEach((id) => {
        const targetObj = getWhiteBoardObjectById(fabricCanvas, id)
        if (targetObj !== null && sel.contains(targetObj) === true)
          sel.removeWithUpdate(targetObj)
      })

      fabricCanvas.requestRenderAll()
      return
    }

    //sel do not exist,create one
    if (target.type === 'activeSelection') {
      console.debug('sel do not exist,create one')
      selectedIds.forEach((id) => {
        const targetObj = getWhiteBoardObjectById(fabricCanvas, id)
        if (targetObj !== null) selObjects.push(targetObj)
      })

      sel = new fabric.ActiveSelection(selObjects)
      sel.set('canvas', fabricCanvas)

      const desiredMatrix = fabric.util.multiplyTransformMatrices(
        invertedMatrix,
        sel.calcTransformMatrix()
      )

      sel.relationship = desiredMatrix

      fabricCanvas.setActiveObject(sel)
    } else {
      console.debug('is not sel,set target active')
      const targetObj = getWhiteBoardObjectById(fabricCanvas, target.id)
      if (targetObj !== null) fabricCanvas.setActiveObject(targetObj)
    }

    fabricCanvas.requestRenderAll()
  } catch (error) {
    console.error(error)
  }
}

/**
 * clear selection
 * @param {object} ref
 * @param {string} selectionJson
 */
const clearWhiteBoardSelection = (ref, selectionJson) => {
  if (isRefValid(ref) === false) return

  console.debug('clearWhiteBoardSelection')

  const fabricCanvas = getFabricCanvasFromRef(ref)

  fabricCanvas.discardActiveObject()
  fabricCanvas.requestRenderAll()
}

export {
  getWhiteBoardData,
  loadWhiteBoardData,
  addWhiteBoardObject,
  modifyWhiteBoardObjects,
  removeWhiteBoardObjects,
  clearWhiteBoardContext,
  createWhiteBoardSelection,
  updateWhiteBoardSelection,
  clearWhiteBoardSelection,
}
