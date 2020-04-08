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
      isDrawing: false,
      moveCount: 1,
      posFrom: { x: 0, y: 0 },
      posTo: { x: 0, y: 0 },
    }

    this.canvas = null
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this)
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this)
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this)
    this.handleCanvasSelectionCreated = this.handleCanvasSelectionCreated.bind(
      this
    )
    this.handleCanvasDrawing = this.handleCanvasDrawing.bind(this)
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('fabric-whiteboard-canvas', {
      isDrawingMode: false,
      skipTargetFind: true,
      selectable: true,
      selection: true,
    })

    window.canvas = this.canvas
    window.canvas.freeDrawingBrush.color = '#E34F51'
    window.canvas.freeDrawingBrush.width = 2
    window.canvas.on('mouse:down', this.handleCanvasMouseDown)
    window.canvas.on('mouse:up', this.handleCanvasMouseUp)
    window.canvas.on('mouse:move', this.handleCanvasMouseMove)
    window.canvas.on('selection:created', this.handleCanvasSelectionCreated)

    window.zoom = window.zoom ? window.zoom : 1
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
          window.canvas.skipTargetFind = false
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
          window.canvas.skipTargetFind = false
          window.canvas.selectable = false
          window.canvas.selection = false
          break
      }
    }
  }

  render() {
    const { visible, mode, size } = this.props

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
    const { isDrawing, moveCount, posFrom, posTo } = this.state
    const { mode } = this.props
    if (isDrawing === false || !moveCount % 2) return

    switch (mode) {
      case 'pen':
        break
      default:
        break
    }
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
