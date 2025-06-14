/*
 * Copyright (C) 2018 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import {shallow} from 'enzyme'
import {NotificationBadge, NewActivityIndicator} from '../index'

it('renders an indicator', () => {
  const wrapper = shallow(
    <NotificationBadge>
      <NewActivityIndicator title="blah" itemIds={['first', 'second']} />
    </NotificationBadge>,
  )
  expect(wrapper.find('div')).toHaveLength(1)
  expect(wrapper.find('style')).toHaveLength(1)
  // The child should exist but may be wrapped by animatable HOC
  expect(wrapper.children()).toHaveLength(2) // style + div
  const contentDiv = wrapper.find('div').first()
  expect(contentDiv.children()).toHaveLength(1) // should have the NewActivityIndicator
})

it('renders an empty div when no children', () => {
  const wrapper = shallow(<NotificationBadge>{null}</NotificationBadge>)
  expect(wrapper.find('div')).toHaveLength(1)
  expect(wrapper.find('NewActivityIndicator')).toHaveLength(0)
  expect(wrapper.find('style')).toHaveLength(1)
  expect(wrapper.find('div').children()).toHaveLength(0)
})
