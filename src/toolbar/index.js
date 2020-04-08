import React, { Component } from 'react'
import classNames from 'class-names'

import modes from '../utils/mode'

import './style.scss'

export default class Toolbar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toolButtons: [],
      activedButton: '',
    }

    this.generateToolButtons = this.generateToolButtons.bind(this)
    this.handleModeClick = this.handleModeClick.bind(this)
  }

  componentDidMount() {
    this.setState({
      toolButtons: this.generateToolButtons(),
    })
  }

  render() {
    const { toolButtons, activedButton } = this.state

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
                btn.key === activedButton ? 'active' : ''
              )}
              data={btn.key}
              title={btn.title}
              onClick={() => this.handleModeClick(btn.key)}
            >
              <i
                className={classNames(
                  `toolbar-ul-${btn.key}`,
                  btn.key === activedButton ? 'active' : ''
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

  handleModeClick(mode) {
    console.warn(mode)
    this.setState({
      activedButton: mode,
    })
  }
}
