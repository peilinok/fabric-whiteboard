import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'class-names'

import modes from './utils/mode'

import Board from './board'
import ToolBar from './toolbar'

import './style.scss'

const WhiteBoard = (props) => {
  const { visible, className, style } = props

  if (visible === true)
    return (
      <div
        className={classNames('fabric-whiteboard', className)}
        style={Object.assign(style)}
      >
        <Board />
        <ToolBar />
      </div>
    )
  else return <React.Component />
}

WhiteBoard.propTypes = {
  visible: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  showToolbar: PropTypes.bool,
  showBoard: PropTypes.bool,
  defaultMode: PropTypes.oneOf(modes),
  mode: PropTypes.oneOf(modes),
  fontSize: PropTypes.number,
  brushThickness: PropTypes.number,
}

WhiteBoard.defaultProps = {
  visible: true,
  className: '',
  style: {},
  showToolbar: true,
  showBoard: true,
  defaultMode: 'pointer',
  mode: '',
  fontSize: 22,
  brushThickness: 24,
}

module.exports = WhiteBoard
