/*
 * Copyright (C) 2017 - present Instructure, Inc.
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
import {handleActions} from 'redux-actions'
import {cloneDeep} from 'lodash'

const defaultState = {
  items: [],
  missingItemsExpanded: false,
  nextUrl: null,
}

function setOpportunityState(state, action) {
  // merge payload into state, ignoring duplicates
  // this approach favors the existing item over the new
  const opportunities = [...state.items].concat(
    action.payload.items.filter(
      payitem => state.items.findIndex(stateitem => stateitem.id === payitem.id) < 0,
    ),
  )
  return {
    items: opportunities,
    nextUrl: action.payload.nextUrl,
  }
}

export default handleActions(
  {
    ADD_OPPORTUNITIES: setOpportunityState,
    DISMISSED_OPPORTUNITY: (state, action) => {
      const stateCopy = cloneDeep(state)
      const dismissedOpportunity = stateCopy.items.find(
        opportunity => opportunity.id === action.payload.assignment_id,
      )
      if (dismissedOpportunity.planner_override) {
        dismissedOpportunity.planner_override.dismissed = action.payload.dismissed
      } else {
        dismissedOpportunity.planner_override = action.payload
      }
      return stateCopy
    },
    TOGGLE_MISSING_ITEMS: (state, action) => {
      const stateCopy = cloneDeep(state)
      stateCopy.missingItemsExpanded = action.payload?.forceExpanded
        ? true
        : !state.missingItemsExpanded
      return stateCopy
    },
    CLEAR_OPPORTUNITIES: () => {
      return defaultState
    },
  },
  defaultState,
)
