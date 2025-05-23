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
import {changeContextType, changeContextId} from '../filter'
import * as actions from '../../actions/filter'

describe('Context reducer', () => {
  let state
  beforeEach(() => {
    state = {
      contextType: 'course',
      contextId: '17',
    }
  })
  describe('changeContextType', () => {
    it('does not modify the state if for unknown actions', () => {
      expect(changeContextType(state, {type: 'unknown.action'})).toBe(state)
    })

    it('returns the new context type', () => {
      expect(changeContextType(state, {type: actions.CHANGE_CONTEXT_TYPE, payload: 'user'})).toBe(
        'user',
      )
    })
  })

  describe('changeContextId', () => {
    it('does not modify the state if for unknown actions', () => {
      expect(changeContextId(state, {type: 'unknown.action'})).toBe(state)
    })

    it('returns the new context it', () => {
      expect(changeContextId(state, {type: actions.CHANGE_CONTEXT_ID, payload: '19'})).toBe('19')
    })
  })
})
