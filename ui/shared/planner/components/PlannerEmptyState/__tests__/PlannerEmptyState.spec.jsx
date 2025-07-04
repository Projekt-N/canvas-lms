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
import React from 'react'
import {shallow} from 'enzyme'
import {render, fireEvent} from '@testing-library/react'
import PlannerEmptyState from '../index'

function defaultProps(opts = {}) {
  return {
    changeDashboardView: () => {},
    onAddToDo: () => {},
    isCompletelyEmpty: true,
    isWeekly: false,
    ...opts,
  }
}

it('renders desert when completely empty', () => {
  const wrapper = shallow(<PlannerEmptyState {...defaultProps()} />)
  expect(wrapper.find('.desert')).toHaveLength(1)
  expect(wrapper.find('.balloons')).toHaveLength(0)
  expect(wrapper.contains('No Due Dates Assigned')).toBeTruthy()
  expect(wrapper.contains("Looks like there isn't anything here")).toBeTruthy()
  expect(wrapper.contains('Go to Card View Dashboard')).toBeTruthy()
  expect(wrapper.contains('Add To-Do')).toBeTruthy()
})

it('renders balloons when not completely empty', () => {
  const wrapper = shallow(<PlannerEmptyState {...defaultProps({isCompletelyEmpty: false})} />)
  expect(wrapper.find('.balloons')).toHaveLength(1)
  expect(wrapper.find('.desert')).toHaveLength(0)
  expect(wrapper.contains('Nothing More To Do')).toBeTruthy()
  expect(wrapper.contains('Add To-Do')).toBeTruthy()
})

it('renders balloons and different text when weekly', () => {
  const wrapper = shallow(
    <PlannerEmptyState {...defaultProps({isCompletelyEmpty: false, isWeekly: true})} />,
  )
  expect(wrapper.find('.balloons')).toHaveLength(1)
  expect(wrapper.find('.desert')).toHaveLength(0)
  expect(wrapper.contains('Nothing Due This Week')).toBeTruthy()
  expect(wrapper.contains('Add To-Do')).toBeFalsy()
})

it('does not changeDashboardView on mount', () => {
  const mockDispatch = jest.fn()
  const changeDashboardView = mockDispatch
  render(<PlannerEmptyState {...defaultProps({changeDashboardView})} />)
  expect(changeDashboardView).not.toHaveBeenCalled()
})

it('calls changeDashboardView on link click', () => {
  const mockDispatch = jest.fn()
  const changeDashboardView = mockDispatch
  const wrapper = render(
    <PlannerEmptyState {...defaultProps({changeDashboardView, isCompletelyEmpty: true})} />,
  )
  const button = wrapper.getByText('Go to Card View Dashboard')
  fireEvent.click(button)
  expect(changeDashboardView).toHaveBeenCalledWith('cards')
})

it('does not call changeDashboardView on false prop', () => {
  const wrapper = render(<PlannerEmptyState {...defaultProps({isCompletelyEmpty: true})} />)
  const button = wrapper.getByText('Go to Card View Dashboard')
  fireEvent.click(button)
  expect(() => {
    fireEvent.click(button)
  }).not.toThrow()
})
