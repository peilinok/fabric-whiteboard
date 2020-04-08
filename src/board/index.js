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
      drawerColor: '#E34F51',
      drawerWidth: 2,
      drawerFontSize: 24,
      isDrawing: false,
      moveCount: 1,
      preDrawerObj: undefined,
      preTextObj: undefined,
      posFrom: { x: 0, y: 0 },
      posTo: { x: 0, y: 0 },
    }

    this.canvas = null
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
    const { drawerColor, drawerWidth } = this.state
    this.canvas = new fabric.Canvas('fabric-whiteboard-canvas', {
      isDrawingMode: false,
      skipTargetFind: true,
      selectable: true,
      selection: true,
    })

    window.canvas = this.canvas
    window.canvas.freeDrawingBrush.color = drawerColor
    window.canvas.freeDrawingBrush.width = drawerWidth
    window.canvas.on('mouse:down', this.handleCanvasMouseDown)
    window.canvas.on('mouse:up', this.handleCanvasMouseUp)
    window.canvas.on('mouse:move', this.handleCanvasMouseMove)
    window.canvas.on('selection:created', this.handleCanvasSelectionCreated)

    window.zoom = window.zoom ? window.zoom : 1
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //isDrawingMode  free drawing mode
    //skipTargetFind all el can not select
    //selectable can select
    //selection show selection bounds
    if (nextProps.mode !== this.props.mode) {
      switch (nextProps.mode) {
        case 'select':
          window.canvas.isDrawingMode = false
          window.canvas.skipTargetFind = false
          window.canvas.selectable = true
          window.canvas.selection = true
          break
        case 'pen':
          window.canvas.isDrawingMode = true
          window.canvas.skipTargetFind = true
          window.canvas.selectable = false
          window.canvas.selection = false
          break
        case 'eraser':
          window.canvas.isDrawingMode = false
          window.canvas.skipTargetFind = false
          window.canvas.selectable = true
          window.canvas.selection = true
          break
        default:
          window.canvas.isDrawingMode = false
          window.canvas.skipTargetFind = true
          window.canvas.selectable = false
          window.canvas.selection = false
          break
      }
    }
  }

  render() {
    const { visible, size } = this.props

    if (visible === false) return <div></div>

    return (
      <div className="fabric-whiteboard-board">
        <canvas
          id="fabric-whiteboard-canvas"
          className="fabric-whiteboard-canvas"
          width={size.width}
          height={size.height}
        />
      </div>
    )
  }

  transpos(pos) {
    return { x: pos.x / window.zoom, y: pos.y / window.zoom }
  }

  handleCanvasMouseDown(options) {
    this.setState({
      isDrawing: true,
      posFrom: {
        x: options.e.offsetX,
        y: options.e.offsetY,
      },
      posTo: {
        x: options.e.offsetX,
        y: options.e.offsetY,
      },
    })
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

    console.info(mode)

    if (e.target._objects) {
      var etCount = e.target._objects.length
      for (var etindex = 0; etindex < etCount; etindex++) {
        window.canvas.remove(e.target._objects[etindex])
      }
    } else {
      window.canvas.remove(e.target)
    }

    window.canvas.discardActiveObject()
  }

  handleCanvasDrawing() {
    const {
      drawerColor,
      drawerWidth,
      drawerFontSize,
      preDrawerObj,
      preTextObj,
      isDrawing,
      moveCount,
      posFrom,
      posTo,
    } = this.state
    const { mode } = this.props
    if (isDrawing === false || !moveCount % 2) return

    let drawerObj = undefined
    let textObj = undefined

    if (preDrawerObj !== undefined) window.canvas.remove(preDrawerObj)
    if (textObj !== undefined) drawerFontSize.exitEditing()

    this.setState(
      {
        preDrawerObj: undefined,
      },
      () => {
        switch (mode) {
          case 'line':
            drawerObj = drawer.drawLine(
              posFrom,
              posTo,
              drawerColor,
              drawerWidth
            )
            break
          case 'arrow':
            drawerObj = drawer.drawArrow(
              posFrom,
              posTo,
              drawerColor,
              'rgba(255,255,255,0)',
              drawerWidth
            )
            break
          case 'text':
            textObj = drawer.drawText(posFrom, drawerFontSize, drawerColor)
            window.canvas.add(textObj)
            textObj.enterEditing()
            textObj.hiddenTextarea.focus()
            this.setState({
              preTextObj: textObj,
            })
            break
          case 'rectangle':
            drawerObj = drawer.drawRectangle(
              posFrom,
              posTo,
              drawerColor,
              drawerWidth
            )
            break
          case 'triangle':
            break
          case 'circle':
            drawerObj = drawer.drawCircle(
              posFrom,
              posTo,
              drawerColor,
              drawerWidth
            )
            break
          case 'ellipse':
            drawerObj = drawer.drawEllipse(
              posFrom,
              posTo,
              drawerColor,
              drawerWidth
            )
            break
          default:
            break
        }

        if (drawerObj !== undefined) {
          window.canvas.add(drawerObj)
          this.setState({
            preDrawerObj: drawerObj,
          })
        }
      }
    )
  }
}

Board.propTypes = {
  visible: PropTypes.bool,
  mode: PropTypes.oneOf(modes),
  size: PropTypes.objectOf(
    PropTypes.shape({
      width: PropTypes.string,
      height: PropTypes.string,
    })
  ),
}

export default Board
