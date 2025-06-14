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
import MissingIndicator from '../MissingIndicator'

it('renders an indicator with the invisible variant and a title', () => {
  const wrapper = shallow(<MissingIndicator title="blah" />)
  expect(wrapper.find('Indicator')).toHaveLength(1)
  expect(wrapper.find('Indicator').prop('variant')).toBe('invisible')
  expect(wrapper.find('Indicator').prop('title')).toBe('Missing items for blah')
})
