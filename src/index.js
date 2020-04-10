import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'class-names'

import modes from './utils/mode'

import Board from './board'
import ToolBar from './toolbar'

import { fabric } from 'fabric'

import './style.scss'

const WhiteBoard = (props) => {
  const {
    visible,
    className,
    width,
    height,
    showToolbar,
    showBoard,
    mode,
    fontSize,
    brushColor,
    brushColors,
    brushThickness,
    brushThicknessRange,
    onModeClick,
    onBrushColorChange,
    onBrushThicknessChange,
    onObjectAdded,
  } = props

  if (visible === true) {
    return (
      <div className={classNames('fabric-whiteboard', className)}>
        <Board
          visible={showBoard}
          mode={mode}
          width={width}
          height={height}
          brushColor={brushColor}
          brushThickness={brushThickness}
          onObjectAdded={onObjectAdded}
        />
        <ToolBar
          visible={showToolbar}
          mode={mode}
          fontSize={fontSize}
          brushColor={brushColor}
          brushColors={brushColors}
          brushThickness={brushThickness}
          brushThicknessRange={brushThicknessRange}
          onModeClick={onModeClick}
          onBrushColorChange={onBrushColorChange}
          onBrushThicknessChange={onBrushThicknessChange}
        />
      </div>
    )
  } else return <React.Component />
}

WhiteBoard.propTypes = {
  visible: PropTypes.bool,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  showToolbar: PropTypes.bool,
  showBoard: PropTypes.bool,
  mode: PropTypes.oneOf(modes),
  fontSize: PropTypes.number,
  brushColor: PropTypes.string,
  brushColors: PropTypes.arrayOf(PropTypes.string),
  brushThickness: PropTypes.number,
  brushThicknessRange: PropTypes.arrayOf(PropTypes.number),
  onModeClick: PropTypes.func,
  onBrushColorChange: PropTypes.func,
  onBrushThicknessChange: PropTypes.func,
  onObjectAdded: PropTypes.func,
}

WhiteBoard.defaultProps = {
  visible: true,
  className: '',
  width: '400px',
  height: '380px',
  showToolbar: true,
  showBoard: true,
  mode: modes[0],
  fontSize: 22,
  brushColor: '#f44336',
  brushColors: [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
  ],
  brushThickness: 2,
  brushThicknessRange: [2, 3, 4, 5, 6, 7, 8],
  onModeClick: () => {},
  onBrushColorChange: () => {},
  onBrushThicknessChange: () => {},
  onObjectAdded: (json) => {},
}

const getWhiteBoardData = () => {
  if (window.fabricCanvas !== null && window.fabricCanvas !== undefined) {
    return window.fabricCanvas.toJSON()
  }

  return ''
}

const loadWhiteBoardData = (data, cb) => {
  if (window.fabricCanvas !== null && window.fabricCanvas !== undefined) {
    window.fabricCanvas.loadFromJSON(data, cb)
  }
}

const addWhiteBoardObject = (json) => {
  if (window.fabricCanvas === null || window.fabricCanvas === undefined) return

  try {
    const { mode, obj } = JSON.parse(json)

    fabric.util.enlivenObjects([obj], (objects) => {
      var origRenderOnAddRemove = window.fabricCanvas.renderOnAddRemove
      window.fabricCanvas.renderOnAddRemove = false

      objects.forEach(function (o) {
        window.fabricCanvas.add(o)
      })

      window.fabricCanvas.renderOnAddRemove = origRenderOnAddRemove
      window.fabricCanvas.renderAll()
    })
  } catch (error) {
    console.error(error)
  }
}

export {
  WhiteBoard as default,
  getWhiteBoardData,
  loadWhiteBoardData,
  addWhiteBoardObject,
}
