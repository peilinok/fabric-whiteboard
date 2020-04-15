import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import WhiteBoard from '../index'

import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

test('WhiteBoard', () => {
  const whiteBoard = shallow(<WhiteBoard />)

  expect(whiteBoard.hasClass('fabric-whiteboard-canvas')).toBe(true)
})
