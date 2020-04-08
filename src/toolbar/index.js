import React, { Component } from 'react'
import classNames from 'class-names'
import PropTypes from 'prop-types'

import modes from '../utils/mode'

import './style.scss'

class Toolbar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toolButtons: [],
    }

    this.generateToolButtons = this.generateToolButtons.bind(this)
  }

  componentDidMount() {
    this.setState({
      toolButtons: this.generateToolButtons(),
    })
  }

  render() {
    const { toolButtons } = this.state
    const { visible, mode, onModeClick } = this.props

    if (visible === false) return <div></div>

    return (
      <div className="fabric-whiteboard-toolbar">
        <ul
          id="fabric-whiteboard-toolbar-ul"
          className="fabric-whiteboard-toolbar-ul"
        >
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
  onModeClick: PropTypes.func,
}

Toolbar.defaultProps = {
  visible: true,
  mode: '',
  onModeClick: () => {},
}

export default Toolbar
