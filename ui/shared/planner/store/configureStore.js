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
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import reduxPromise from 'redux-promise'
import createSagaMiddleware from 'redux-saga'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import rootReducer from '../reducers'
import {createDynamicUiMiddleware} from '../dynamic-ui'
import allSagas from '../actions/sagas'

export default function configureStore(uiManager, defaultState) {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [thunk, reduxPromise, sagaMiddleware, createDynamicUiMiddleware(uiManager)]

  const store = createStore(
    rootReducer,
    defaultState,
    composeWithDevTools(applyMiddleware(...middlewares)),
  )
  sagaMiddleware.run(allSagas)
  return store
}
