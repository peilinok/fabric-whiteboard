import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fabric } from 'fabric'

import * as drawer from './drawer'
import modes from '../utils/mode'

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
    this.handleCanvasSelectionCreated = this.handleCanvasSelectionCreated.bind(
      this
    )
    this.handleCanvasDrawing = this.handleCanvasDrawing.bind(this)
  }

  componentDidMount() {
    const { width, height, brushColor, brushThickness } = this.props
    this.fabricCanvas = new fabric.Canvas('fabric-whiteboard-canvas', {
      isDrawingMode: false,
      skipTargetFind: true,
      selectable: true,
      selection: true,
    })

    window.fabricCanvas = this.fabricCanvas
    window.fabricCanvas.freeDrawingBrush.color = brushColor
    window.fabricCanvas.freeDrawingBrush.width = brushThickness
    window.fabricCanvas.on('mouse:down', this.handleCanvasMouseDown)
    window.fabricCanvas.on('mouse:up', this.handleCanvasMouseUp)
    window.fabricCanvas.on('mouse:move', this.handleCanvasMouseMove)
    window.fabricCanvas.on(
      'selection:created',
      this.handleCanvasSelectionCreated
    )

    window.fabricCanvas.zoom = window.zoom ? window.zoom : 1
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //isDrawingMode  free drawing mode
    //skipTargetFind all el can not select
    //selectable can select
    //selection show selection bounds
    if (nextProps.mode !== this.props.mode) {
      const { preDrawerObj, preTextObj } = this.state
      if (preDrawerObj !== undefined) window.fabricCanvas.remove(preDrawerObj)
      if (preTextObj !== undefined) preTextObj.exitEditing()
      switch (nextProps.mode) {
        case 'select':
          window.fabricCanvas.isDrawingMode = false
          window.fabricCanvas.skipTargetFind = false
          window.fabricCanvas.selectable = true
          window.fabricCanvas.selection = true
          break
        case 'pen':
          window.fabricCanvas.isDrawingMode = true
          window.fabricCanvas.skipTargetFind = true
          window.fabricCanvas.selectable = false
          window.fabricCanvas.selection = false
          break
        case 'eraser':
          window.fabricCanvas.isDrawingMode = false
          window.fabricCanvas.skipTargetFind = false
          window.fabricCanvas.selectable = true
          window.fabricCanvas.selection = true
          break
        default:
          window.fabricCanvas.isDrawingMode = false
          window.fabricCanvas.skipTargetFind = true
          window.fabricCanvas.selectable = false
          window.fabricCanvas.selection = false
          break
      }
    }

    if (nextProps.width !== this.props.width) {
      if (window.fabricCanvas) {
        //window.fabricCanvas.setWidth(nextProps.width)
      }
    }

    if (nextProps.height !== this.props.height) {
      if (window.fabricCanvas) {
        //window.fabricCanvas.setHeight(nextProps.height)
      }
    }

    if (nextProps.brushColor !== this.props.brushColor) {
      if (window.fabricCanvas) {
        window.fabricCanvas.freeDrawingBrush.color = nextProps.brushColor
      }
    }

    if (nextProps.brushThickness !== this.props.brushThickness) {
      if (window.fabricCanvas) {
        window.fabricCanvas.freeDrawingBrush.width = nextProps.brushThickness
      }
    }
  }

  render() {
    const { visible, width, height } = this.props

    if (visible === false) return <div></div>

    return (
      <div className="fabric-whiteboard-board">
        <canvas
          id="fabric-whiteboard-canvas"
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

  handleCanvasSelectionCreated(e) {
    const { mode } = this.props
    if (mode !== 'eraser') return

    if (e.target._objects) {
      var etCount = e.target._objects.length
      for (var etindex = 0; etindex < etCount; etindex++) {
        window.fabricCanvas.remove(e.target._objects[etindex])
      }
    } else {
      window.fabricCanvas.remove(e.target)
    }

    window.fabricCanvas.discardActiveObject()
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
    const { mode, brushColor, brushThickness } = this.props
    if (isDrawing === false || !moveCount % 2) return

    let drawerObj = undefined
    let textObj = undefined

    if (preDrawerObj !== undefined) window.fabricCanvas.remove(preDrawerObj)
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
            window.fabricCanvas.add(textObj)
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
          window.fabricCanvas.add(drawerObj)
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
}

export default Board
