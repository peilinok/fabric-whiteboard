import React, { Component } from 'react'
import classNames from 'class-names'
import PropTypes from 'prop-types'

import ColorPicker from './colorpicker'
import Thickness from './thickness'

import modes from '../utils/mode'

import './style.scss'

class Toolbar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toolButtons: [],
      showColorPicker: false,
      showFontSize: false,
    }

    this.generateToolButtons = this.generateToolButtons.bind(this)
  }

  componentDidMount() {
    this.setState({
      toolButtons: this.generateToolButtons(),
    })
  }

  render() {
    const { toolButtons, showColorPicker, showFontSize } = this.state
    const {
      visible,
      mode,
      fontSize,
      brushColor,
      brushColors,
      brushThickness,
      brushThicknessRange,
      onModeClick,
      onBrushColorChange,
      onBrushThicknessChange,
    } = this.props

    if (visible === false) return <div></div>

    return (
      <div className="fabric-whiteboard-toolbar">
        <ul
          id="fabric-whiteboard-toolbar-ul"
          className="fabric-whiteboard-toolbar-ul"
        >
          <li className="toolbar-ul-li" title="thickness">
            <Thickness
              visible={true}
              color={brushColor}
              value={brushThickness}
              range={brushThicknessRange}
              onChange={onBrushThicknessChange}
            />
          </li>

          {toolButtons.map((btn) => (
            <li
              className={classNames(
                'toolbar-ul-li',
                btn.key === mode ? 'active' : ''
              )}
              data={btn.key}
              title={btn.title}
              onClick={() => onModeClick(btn.key)}
            >
              <i
                className={classNames(
                  `toolbar-ul-${btn.key}`,
                  btn.key === mode ? 'active' : ''
                )}
              />
            </li>
          ))}

          <li
            className="toolbar-ul-li"
            title="brush"
            onClick={() => {
              this.setState({
                showColorPicker: !showColorPicker,
              })
            }}
          >
            <i className="toolbar-ul-brush" />
          </li>

          <ColorPicker
            visible={showColorPicker}
            color={brushColor}
            colors={brushColors}
            onChange={onBrushColorChange}
          />
        </ul>
      </div>
    )
  }

  generateToolButtons() {
    const toolButtons = []
    modes.forEach((mode) => {
      toolButtons.push({
        key: mode,
        title: mode,
      })
    })

    return toolButtons
  }
}

Toolbar.propTypes = {
  visible: PropTypes.bool,
  mode: PropTypes.oneOf(modes),
  fontSize: PropTypes.number,
  brushColor: PropTypes.string,
  brushColors: PropTypes.arrayOf(PropTypes.string),
  brushThickness: PropTypes.number,
  brushThicknessRange: PropTypes.arrayOf(PropTypes.number),
  onModeClick: PropTypes.func,
  onBrushColorChange: PropTypes.func,
  onBrushThicknessChange: PropTypes.func,
}

export default Toolbar
