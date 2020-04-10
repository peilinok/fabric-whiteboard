import React, { Component } from 'react'
import classNames from 'class-names'
import PropTypes from 'prop-types'

import './style.scss'

class Thickness extends Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 0,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    const { value, range } = this.props

    this.setState({
      index: range.find((v, i) => {
        return v === value
      }),
    })
  }

  render() {
    const { visible, color, value } = this.props
    return (
      <div
        className={classNames({
          'fabric-whiteboard-thickness': true,
          'fabric-whiteboard-thickness-hide': !visible,
        })}
        onClick={this.handleClick}
      >
        <div
          style={{
            backgroundColor: color,
            width: `${value * 2}px`,
            height: `${value * 2}px`,
            borderRadius: '50%',
          }}
        />
      </div>
    )
  }

  handleClick() {
    const { range, onChange } = this.props
    const { index } = this.state

    let tempIndex = index + 1

    if (tempIndex > range.length - 1) tempIndex = 0

    this.setState(
      {
        index: tempIndex,
      },
      () => {
        onChange(range[tempIndex])
      }
    )
  }
}

Thickness.propTypes = {
  visible: PropTypes.bool,
  color: PropTypes.string,
  value: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
}

export default Thickness
