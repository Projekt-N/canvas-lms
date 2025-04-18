/* eslint-disable no-global-assign */
/*
 * Copyright (C) 2013 - present Instructure, Inc.
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

import progressable from '../progressable'
import {Model} from '@canvas/backbone'
import sinon from 'sinon'

const ok = x => expect(x).toBeTruthy()
const equal = (x, y) => expect(x).toBe(y)

const progressUrl = '/progress'
let server = null
let clock = null
let model = null

class QuizCSV extends Model {}
QuizCSV.mixin(progressable)

describe('progressable', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers()
    model = new QuizCSV()
    model.url = '/quiz_csv'
    server = sinon.fakeServer.create()
    server.respondWith('GET', progressUrl, [
      200,
      {'Content-Type': 'application/json'},
      '{"workflow_state": "completed"}',
    ])
    server.respondWith('GET', model.url, [
      200,
      {'Content-Type': 'application/json'},
      '{"csv": "one,two,three"}',
    ])
  })

  afterEach(() => {
    server.restore()
    clock.restore()
  })

  test('set progress_url', () => {
    const spy = sinon.spy()
    model.progressModel.on('complete', spy)
    model.on('progressResolved', spy)
    model.set({progress_url: progressUrl})
    server.respond() // respond to progress, which queues model fetch
    clock.tick(1)
    server.respond() // respond to model fetch
    clock.tick(1)
    ok(spy.calledTwice, 'complete and progressResolved handlers called')
    equal(model.progressModel.get('workflow_state'), 'completed')
    equal(model.get('csv'), 'one,two,three')
  })

  test('set progress.url', () => {
    const spy = sinon.spy()
    model.progressModel.on('complete', spy)
    model.on('progressResolved', spy)
    model.progressModel.set({url: progressUrl, workflow_state: 'queued'})
    server.respond() // respond to progress, which queues model fetch
    clock.tick(1)
    server.respond() // respond to model fetch
    clock.tick(1)
    ok(spy.calledTwice, 'complete and progressResolved handlers called')
    equal(model.progressModel.get('workflow_state'), 'completed')
    equal(model.get('csv'), 'one,two,three')
  })
})
