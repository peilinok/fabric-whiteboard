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
      drawerFontSize: 24,
      isDrawing: false,
      moveCount: 1,
      preDrawerObj: undefined,
      preTextObj: undefined,
      posFrom: { x: 0, y: 0 },
      posTo: { x: 0, y: 0 },
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
    this.handleCanvasObjectMoved = this.handleCanvasObjectMoved.bind(this)
    this.handleCanvasObjectScaled = this.handleCanvasObjectScaled.bind(this)

    this.handleCanvasDrawing = this.handleCanvasDrawing.bind(this)
  }

  UNSAFE_componentWillMount() {
    const id = 'fabric-whiteboard-canvas-' + uuid.v4()
    this.setState({
      canvasId: id,
    })

    console.warn(('id', id))
  }

  componentDidMount() {
    const { canvasId } = this.state
    const { width, height, brushColor, brushThickness } = this.props
    //create fabric canvas with select mode
    this.fabricCanvas = new fabric.Canvas(canvasId, {
      isDrawingMode: false,
      skipTargetFind: false,
      selectable: true,
      selection: true,
    })

    this.fabricCanvas.freeDrawingBrush.color = brushColor
    this.fabricCanvas.freeDrawingBrush.width = brushThickness
    this.fabricCanvas.on('mouse:down', this.handleCanvasMouseDown)
    this.fabricCanvas.on('mouse:up', this.handleCanvasMouseUp)
    this.fabricCanvas.on('mouse:move', this.handleCanvasMouseMove)
    this.fabricCanvas.on('path:created', this.handleCanvasPathCreated)
    this.fabricCanvas.on('selection:created', this.handleCanvasSelectionCreated)
    this.fabricCanvas.on('object:moved', this.handleCanvasObjectMoved)
    this.fabricCanvas.on('object:scaled', this.handleCanvasObjectScaled)

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
    if (nextProps.mode !== this.props.mode) {
      const { preTextObj } = this.state
      if (preTextObj !== undefined) {
        preTextObj.exitEditing()
        this.setState({ preTextObj: undefined })
      }
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
    const { visible, width, height } = this.props

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
      </div>
    )
  }

  transpos(pos) {
    return { x: pos.x / window.zoom, y: pos.y / window.zoom }
  }

  handleCanvasMouseDown(options) {
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

    if (mode !== 'text' && preDrawerObj !== undefined)
      onObjectAdded({ mode: mode, obj: preDrawerObj.toJSON() })

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
    const { onObjectAdded } = this.props

    onObjectAdded({ mode: 'pen', obj: e.path.toJSON() })
  }

  handleCanvasSelectionCreated(e) {
    const { mode } = this.props
    if (mode !== 'eraser') return

    if (e.target._objects) {
      var etCount = e.target._objects.length
      for (var etindex = 0; etindex < etCount; etindex++) {
        this.fabricCanvas.remove(e.target._objects[etindex])
      }
    } else {
      this.fabricCanvas.remove(e.target)
    }

    this.fabricCanvas.discardActiveObject()
  }

  handleCanvasObjectMoved(e) {
    console.info('moved:', e)

    console.warn(this.fabricCanvas.findTarget(e.e, true))
  }

  handleCanvasObjectScaled(e) {
    console.info('scaled:', e)
  }

  handleCanvasDrawing() {
    const {
      drawerFontSize,
      preDrawerObj,
      preTextObj,
      isDrawing,
      moveCount,
      posFrom,
      posTo,
    } = this.state
    const { mode, brushColor, brushThickness, onObjectAdded } = this.props
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
            textObj = drawer.drawText(posFrom, drawerFontSize, brushColor)
            textObj.on('editing:exited', (e) => {
              if (textObj.text !== '')
                onObjectAdded({ mode: 'text', obj: textObj.toJSON() })
              else this.fabricCanvas.remove(textObj) //auto remove empty itext
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
  mode: PropTypes.oneOf(modes).isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  brushColor: PropTypes.string.isRequired,
  brushThickness: PropTypes.number.isRequired,
  onObjectAdded: PropTypes.func,
}

export default Board
