import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fabric } from 'fabric'

import * as drawer from './drawer'
import modes from '../utils/mode'
import uuid from 'node-uuid'

import './style.scss'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDrawing: false,
      moveCount: 1,
      preDrawerObj: undefined,
      preTextObj: undefined,
      posFrom: { x: 0, y: 0 },
      posTo: { x: 0, y: 0 },
      currentGroupId: '',
    }

    this.fabricCanvas = null
    this.transpos = this.transpos.bind(this)
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this)
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this)
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this)
    this.handleCanvasPathCreated = this.handleCanvasPathCreated.bind(this)
    this.handleCanvasSelectionCreated = this.handleCanvasSelectionCreated.bind(
      this
    )
    this.handleCanvasSelectionUpdated = this.handleCanvasSelectionUpdated.bind(
      this
    )
    this.handleCanvasSelectionCleared = this.handleCanvasSelectionCleared.bind(
      this
    )
    this.handleCanvasObjectsModified = this.handleCanvasObjectsModified.bind(
      this
    )

    this.handleCanvasDrawing = this.handleCanvasDrawing.bind(this)
  }

  UNSAFE_componentWillMount() {
    const id = 'fabric-whiteboard-canvas-' + uuid.v4()
    this.setState({
      canvasId: id,
    })
  }

  componentDidMount() {
    const { canvasId } = this.state
    const { width, height, brushColor, brushThickness } = this.props
    //create fabric canvas with select mode
    this.fabricCanvas = new fabric.Canvas(canvasId, {
      isDrawingMode: false,
      skipTargetFind: false,
      selectable: false,
      selection: false,
    })

    this.fabricCanvas.freeDrawingBrush.color = brushColor
    this.fabricCanvas.freeDrawingBrush.width = brushThickness
    this.fabricCanvas.hoverCursor = 'pointer'
    this.fabricCanvas.on('mouse:down', this.handleCanvasMouseDown)
    this.fabricCanvas.on('mouse:up', this.handleCanvasMouseUp)
    this.fabricCanvas.on('mouse:move', this.handleCanvasMouseMove)
    this.fabricCanvas.on('path:created', this.handleCanvasPathCreated)
    this.fabricCanvas.on('selection:created', this.handleCanvasSelectionCreated)
    this.fabricCanvas.on('selection:updated', this.handleCanvasSelectionUpdated)
    this.fabricCanvas.on('selection:cleared', this.handleCanvasSelectionCleared)
    this.fabricCanvas.on('object:modified', this.handleCanvasObjectsModified)

    this.fabricCanvas.zoom = window.zoom ? window.zoom : 1

    this.refs = {
      fabricCanvas: this.fabricCanvas,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //isDrawingMode  free drawing mode
    //skipTargetFind all el can not select
    //selectable can select
    //selection show selection bounds
    if (
      nextProps.mode !== this.props.mode ||
      nextProps.enabled !== this.props.enabled
    ) {
      const { preTextObj } = this.state
      if (preTextObj !== undefined) {
        preTextObj.exitEditing()
        this.setState({ preTextObj: undefined })
      }

      if (nextProps.enabled === false) {
        this.fabricCanvas.isDrawingMode = false
        this.fabricCanvas.skipTargetFind = true
        this.fabricCanvas.selectable = false
        this.fabricCanvas.selection = false
      } else {
        switch (nextProps.mode) {
          case 'select':
            this.fabricCanvas.isDrawingMode = false
            this.fabricCanvas.skipTargetFind = false
            this.fabricCanvas.selectable = true
            this.fabricCanvas.selection = true
            break
          case 'pen':
            this.fabricCanvas.isDrawingMode = true
            this.fabricCanvas.skipTargetFind = true
            this.fabricCanvas.selectable = false
            this.fabricCanvas.selection = false
            break
          case 'eraser':
            this.fabricCanvas.isDrawingMode = false
            this.fabricCanvas.skipTargetFind = false
            this.fabricCanvas.selectable = true
            this.fabricCanvas.selection = true
            break
          default:
            this.fabricCanvas.isDrawingMode = false
            this.fabricCanvas.skipTargetFind = true
            this.fabricCanvas.selectable = false
            this.fabricCanvas.selection = false
            break
        }
      }
    }

    if (nextProps.width !== this.props.width) {
      if (this.fabricCanvas) {
        //this.fabricCanvas.setWidth(nextProps.width)
      }
    }

    if (nextProps.height !== this.props.height) {
      if (this.fabricCanvas) {
        //this.fabricCanvas.setHeight(nextProps.height)
      }
    }

    if (nextProps.brushColor !== this.props.brushColor) {
      if (this.fabricCanvas) {
        this.fabricCanvas.freeDrawingBrush.color = nextProps.brushColor
      }
    }

    if (nextProps.brushThickness !== this.props.brushThickness) {
      if (this.fabricCanvas) {
        this.fabricCanvas.freeDrawingBrush.width = nextProps.brushThickness
      }
    }
  }

  render() {
    const { canvasId } = this.state
    const { visible, enabled, width, height } = this.props

    if (visible === false) return <div></div>

    return (
      <div className="fabric-whiteboard-board">
        <canvas
          id={canvasId}
          className="fabric-whiteboard-canvas"
          width={width}
          height={height}
          style={{ width: width, height: height }}
        />
        {enabled === false ? (
          <div
            className="fabric-whiteboard-mask"
            style={{ width: width, height: height }}
          />
        ) : (
          <div />
        )}
      </div>
    )
  }

  transpos(pos) {
    return { x: pos.x / window.zoom, y: pos.y / window.zoom }
  }

  handleCanvasMouseDown(options) {
    const { enabled } = this.props
    if (enabled === false) return
    this.setState(
      {
        isDrawing: true,
        posFrom: {
          x: options.e.offsetX,
          y: options.e.offsetY,
        },
        posTo: {
          x: options.e.offsetX,
          y: options.e.offsetY,
        },
      },
      () => {
        if (this.props.mode === 'text') this.handleCanvasDrawing()
      }
    )
  }

  handleCanvasMouseUp(options) {
    const { mode, onObjectAdded } = this.props
    const { preDrawerObj } = this.state

    if (mode !== 'text' && preDrawerObj !== undefined) {
      preDrawerObj.set('id', uuid.v4())
      onObjectAdded(
        JSON.stringify({
          mode: mode,
          obj: preDrawerObj.toJSON(['id']),
        })
      )
    }

    this.setState({
      isDrawing: false,
      moveCount: 1,
      preDrawerObj: undefined,
      posTo: {
        x: options.e.offsetX,
        y: options.e.offsetY,
      },
    })
  }

  handleCanvasMouseMove(options) {
    this.setState(
      {
        moveCount: this.state.moveCount++,
        posTo: {
          x: options.e.offsetX,
          y: options.e.offsetY,
        },
      },
      this.handleCanvasDrawing()
    )
  }

  handleCanvasPathCreated(e) {
    const { enabled, onObjectAdded } = this.props
    if (enabled === false || e.path === undefined) return
    //console.warn('handleCanvasPathCreated', e)

    e.path.set('id', uuid.v4())
    onObjectAdded(
      JSON.stringify({
        mode: 'pen',
        obj: e.path.toJSON(['id']),
      })
    )
  }

  handleCanvasSelectionCreated(e) {
    const { mode, enabled, onObjectsRemoved, onSelectionCreated } = this.props
    if (enabled === false || e.e === undefined) return
    //console.warn('handleCanvasSelectionCreated', e)

    const selected = []
    e.selected.forEach((obj) => {
      selected.push({ id: obj.id })
      if (mode === 'eraser') this.fabricCanvas.remove(obj)
    })

    if (mode === 'eraser') {
      onObjectsRemoved(JSON.stringify(selected))

      this.fabricCanvas.discardActiveObject()
      return
    }

    const matrix = e.target.calcTransformMatrix()
    const invertedMatrix = fabric.util.invertTransform(matrix)

    onSelectionCreated(
      JSON.stringify({
        target: e.target.toJSON(['id', 'type']),
        invertedMatrix: invertedMatrix,
        selected,
      })
    )
  }

  handleCanvasSelectionUpdated(e) {
    const { mode, enabled, onSelectionUpdated } = this.props
    if (enabled === false || e.e === undefined) return
    //console.warn('handleCanvasSelectionUpdated', e)

    const deselectedIds = []
    const selectedIds = []
    if (e.deselected) {
      e.deselected.forEach((obj) => {
        deselectedIds.push(obj.id)
      })
    }

    if (e.selected) {
      e.selected.forEach((obj) => {
        selectedIds.push(obj.id)
      })
    }

    const matrix = e.target.calcTransformMatrix()
    const invertedMatrix = fabric.util.invertTransform(matrix)

    onSelectionUpdated(
      JSON.stringify({
        target: e.target.toJSON(['id', 'type']),
        invertedMatrix,
        selectedIds: selectedIds,
        deselectedIds: deselectedIds,
      })
    )
  }

  handleCanvasSelectionCleared(e) {
    const { enabled, onSelectionCleared } = this.props
    if (enabled === false || e.e === undefined) return

    //console.warn('handleCanvasSelectionCleared', e)

    const deselectedIds = []

    if (e.deselected) {
      e.deselected.forEach((obj) => {
        deselectedIds.push(obj.id)
      })
    }

    this.fabricCanvas.discardActiveObject()

    onSelectionCleared(JSON.stringify(deselectedIds))
  }

  handleCanvasObjectsModified(e) {
    const { enabled, onObjectsModified } = this.props
    if (enabled === false || e.e === undefined) return
    //console.warn('handleCanvasObjectsModified', e)

    if (!e.target) return

    const objects = this.fabricCanvas.getActiveObjects()
    const selected = []
    if (objects) {
      objects.forEach((obj) => {
        selected.push({
          id: obj.id,
          matrix: obj.calcTransformMatrix(),
          obj: obj.toJSON(['id', 'type']),
          point: obj.getPointByOrigin('center', 'center'),
        })
      })
    }

    const matrix = e.target.calcTransformMatrix()
    const invertedMatrix = fabric.util.invertTransform(matrix)

    onObjectsModified(
      JSON.stringify({
        target: e.target.toJSON(['id', 'type']),
        selected: selected,
        invertedMatrix: invertedMatrix,
        matrix: e.target.calcTransformMatrix(),
        hasTransform: e.transform !== null && e.transform !== undefined,
        transform: e.transform,
        point: e.target.getPointByOrigin('center', 'center'),
      })
    )
  }

  handleCanvasDrawing() {
    const {
      preDrawerObj,
      preTextObj,
      isDrawing,
      moveCount,
      posFrom,
      posTo,
    } = this.state
    const {
      mode,
      fontSize,
      brushColor,
      brushThickness,
      onObjectAdded,
    } = this.props
    if (isDrawing === false || !moveCount % 2) return

    let drawerObj = undefined
    let textObj = undefined

    if (preDrawerObj !== undefined) this.fabricCanvas.remove(preDrawerObj)
    if (preTextObj !== undefined) preTextObj.exitEditing()

    this.setState(
      {
        preDrawerObj: undefined,
        preTextObj: undefined,
      },
      () => {
        switch (mode) {
          case 'line':
            drawerObj = drawer.drawLine(
              posFrom,
              posTo,
              brushColor,
              brushThickness
            )
            break
          case 'dotline':
            drawerObj = drawer.drawDotLine(
              posFrom,
              posTo,
              brushColor,
              brushThickness
            )
            break
          case 'arrow':
            drawerObj = drawer.drawArrow(
              posFrom,
              posTo,
              brushColor,
              'rgba(255,255,255,0)',
              brushThickness
            )
            break
          case 'text':
            textObj = drawer.drawText(posFrom, fontSize, brushColor)
            textObj.set('id', uuid.v4())
            textObj.on('editing:exited', (e) => {
              if (textObj.text !== '') {
                onObjectAdded(
                  JSON.stringify({
                    mode: 'text',
                    obj: textObj.toJSON(['id']),
                  })
                )
              } else this.fabricCanvas.remove(textObj) //auto remove empty itext
            })
            this.fabricCanvas.add(textObj)
            textObj.enterEditing()
            textObj.hiddenTextarea.focus()
            break
          case 'rectangle':
            drawerObj = drawer.drawRectangle(
              posFrom,
              posTo,
              brushColor,
              brushThickness
            )
            break
          case 'triangle':
            drawerObj = drawer.drawTriangle(
              posFrom,
              posTo,
              brushColor,
              brushThickness,
              true
            )
            break
          case 'circle':
            drawerObj = drawer.drawCircle(
              posFrom,
              posTo,
              brushColor,
              brushThickness
            )
            break
          case 'ellipse':
            drawerObj = drawer.drawEllipse(
              posFrom,
              posTo,
              brushColor,
              brushThickness
            )
            break
          default:
            break
        }

        if (drawerObj !== undefined) {
          this.fabricCanvas.add(drawerObj)
        }

        this.setState({
          preDrawerObj: drawerObj,
          preTextObj: textObj,
        })
      }
    )
  }
}

Board.propTypes = {
  visible: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(modes).isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.number,
  brushColor: PropTypes.string.isRequired,
  brushThickness: PropTypes.number.isRequired,
  onObjectAdded: PropTypes.func,
  onObjectsModified: PropTypes.func,
  onObjectsRemoved: PropTypes.func,
  onSelectionCreated: PropTypes.func,
  onSelectionUpdated: PropTypes.func,
  onSelectionCleared: PropTypes.func,
}

export default Board
