import React, { Component } from 'react'
import { fabric } from 'fabric'

import * as drawer from './drawer'

import './style.scss'

export default class Board extends Component {
  constructor(props) {
    super(props)

    this.canvas = null
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('fabric-whiteboard-canvas', {
      isDrawingMode: true,
      skipTargetFind: true,
      selectable: true,
      selection: true,
    })

    window.canvas = this.canvas
  }

  render() {
    return (
      <div className="fabric-whiteboard-board">
        <canvas
          id="fabric-whiteboard-canvas"
          className="fabric-whiteboard-canvas"
        ></canvas>
      </div>
    )
  }
}
