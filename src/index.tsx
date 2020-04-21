import React, { Component } from 'react'

import classNames from 'class-names'

import {
  getWhiteBoardData,
  loadWhiteBoardData,
  addWhiteBoardObject,
  removeWhiteBoardObjects,
  modifyWhiteBoardObjects,
  clearWhiteBoardContext,
  createWhiteBoardSelection,
  updateWhiteBoardSelection,
  clearWhiteBoardSelection,
} from './utils/handler'

import Board from './board'
import ToolBar from './toolbar'

import './style.scss'

export {
  getWhiteBoardData,
  loadWhiteBoardData,
  addWhiteBoardObject,
  removeWhiteBoardObjects,
  modifyWhiteBoardObjects,
  clearWhiteBoardContext,
  createWhiteBoardSelection,
  updateWhiteBoardSelection,
  clearWhiteBoardSelection,
}

export type modes =
  | 'select'
  | 'pen'
  | 'line'
  | 'dotline'
  | 'arrow'
  | 'text'
  | 'rectangle'
  | 'triangle'
  | 'circle'
  | 'ellipse'
  | 'eraser'

export interface WhiteBoardProps {
  visible?: boolean
  className?: string
  width?: string | number
  height?: string | number
  showToolbar?: boolean
  enableToolbar?: boolean
  showBoard?: boolean
  enableBoard?: boolean
  mode: modes
  fontSize?: number
  brushColor?: string
  brushColors?: string[]
  brushThickness?: number
  brushThicknessRange?: number[]
  onModeClick?: (mode: string) => void
  onBrushColorChange?: (color: string) => void
  onBrushThicknessChange?: (thinkness: number) => void
  onObjectAdded?: (object: string) => void
  onObjectsModified?: (object: string) => void
  onObjectsRemoved?: (object: string) => void
  onSelectionCreated?: (object: string) => void
  onSelectionUpdated?: (object: string) => void
  onSelectionCleared?: (object: string) => void
}

class WhiteBoard extends Component<WhiteBoardProps, any> {
  toolbar: ToolBar
  board: any

  constructor(props) {
    super(props)
    this.board = undefined
    this.toolbar = undefined
  }

  componentDidMount() {
    this.refs = {
      board: this.board,
      toolbar: this.toolbar,
    }
  }

  render() {
    const {
      visible,
      className,
      width,
      height,
      showToolbar,
      showBoard,
      enableBoard,
      enableToolbar,
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
      onObjectsModified,
      onObjectsRemoved,
      onSelectionCreated,
      onSelectionUpdated,
      onSelectionCleared,
    } = this.props

    if (visible === true) {
      return (
        <div className={classNames('fabric-whiteboard', className)}>
          <Board
            ref={(ref) => {
              this.board = ref
            }}
            visible={showBoard}
            enabled={enableBoard}
            mode={mode}
            width={width}
            height={height}
            fontSize={fontSize}
            brushColor={brushColor}
            brushThickness={brushThickness}
            onObjectAdded={onObjectAdded}
            onObjectsModified={onObjectsModified}
            onObjectsRemoved={onObjectsRemoved}
            onSelectionCreated={onSelectionCreated}
            onSelectionUpdated={onSelectionUpdated}
            onSelectionCleared={onSelectionCleared}
          />
          <ToolBar
            ref={(ref) => {
              this.toolbar = ref
            }}
            visible={showToolbar}
            enabled={enableToolbar}
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
}

WhiteBoard.defaultProps = {
  visible: true,
  className: '',
  width: '400px',
  height: '380px',
  showToolbar: true,
  enableToolbar: true,
  showBoard: true,
  enableBoard: true,
  mode: 'select',
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
  onObjectAdded: () => {},
  onObjectsModified: () => {},
  onObjectsRemoved: () => {},
  onSelectionCreated: () => {},
  onSelectionUpdated: () => {},
  onSelectionCleared: () => {},
}

export default WhiteBoard
