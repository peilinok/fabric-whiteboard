import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'class-names'

import modes from './utils/mode'

import Board from './board'
import ToolBar from './toolbar'

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
    onModeClick,
  } = props

  if (visible === true) {
    return (
      <div className={classNames('fabric-whiteboard', className)}>
        <Board visible={showBoard} mode={mode} width={width} height={height} />
        <ToolBar visible={showToolbar} mode={mode} onModeClick={onModeClick} />
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
  brushThickness: PropTypes.number,
  onModeClick: PropTypes.func,
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
  brushThickness: 24,
  onModeClick: () => {},
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

export { WhiteBoard as default, getWhiteBoardData, loadWhiteBoardData }
