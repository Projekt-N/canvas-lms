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
import {fireEvent, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moment from 'moment-timezone'
import {PlannerHeader} from '../index'

const TZ = 'America/Denver'
const plannerDays = [
  moment('2018-03-01T14:00:42Z').tz(TZ),
  moment('2018-03-02T14:00:42Z').tz(TZ),
  moment('2018-03-03T14:00:42Z').tz(TZ),
]

function defaultProps(options) {
  return {
    courses: [{id: '1', longName: 'Course Long Name', shortName: 'Course Short Name'}],
    opportunities: {
      items: [
        {
          id: '1',
          course_id: '1',
          due_at: '2017-03-09T20:40:35Z',
          html_url: 'http://www.non_default_url.com',
          name: 'learning object title',
        },
        {
          id: '2',
          course_id: '1',
          due_at: '2017-03-09T20:40:35Z',
          html_url: 'http://www.non_default_url.com',
          name: 'learning object title',
          planner_override: {dismissed: true},
        },
      ],
      nextUrl: null,
    },
    days: plannerDays.map(d => [d.format('YYYY-MM-DD'), [{dateBucketMoment: d}]]),
    getInitialOpportunities: () => {},
    getNextOpportunities: () => {},
    savePlannerItem: () => {},
    locale: 'en',
    timeZone: TZ,
    deletePlannerItem: () => {},
    dismissOpportunity: () => {},
    clearUpdateTodo: () => {},
    startLoadingGradesSaga: () => {},
    cancelEditingPlannerItem: () => {},
    setGradesTrayState: () => {},
    ariaHideElement: document.createElement('div'),
    stickyZIndex: 3,
    stickyButtonId: 'new_activity_button',
    firstNewActivityDate: null,
    loading: {
      isLoading: false,
      allPastItemsLoaded: false,
      allFutureItemsLoaded: false,
      allOpportunitiesLoaded: true,
      setFocusAfterLoad: false,
      firstNewDayKey: null,
      futureNextUrl: null,
      pastNextUrl: null,
      seekingNewActivity: false,
      loadingGrades: false,
      gradesLoaded: false,
      loadingOpportunities: false,
    },
    ui: {
      naiAboveScreen: false,
    },
    todo: {},
    auxElement: document.createElement('div'),
    ...options,
  }
}

// These are terrible, but the property selectors weren't working for me
// (even though the children property apparently works)
function findEditTray(wrapper) {
  return wrapper.find('Tray').at(0)
}

let ariaLive

beforeAll(() => {
  ariaLive = document.createElement('div')
  ariaLive.id = 'flash_screenreader_holder'
  ariaLive.setAttribute('role', 'alert')
  document.body.appendChild(ariaLive)
})

afterAll(() => {
  if (ariaLive) ariaLive.remove()
})

it('renders the base component correctly with buttons and trays', () => {
  const wrapper = shallow(<PlannerHeader {...defaultProps()} />)
  // Check for main header elements
  expect(wrapper.find('StickyButton').exists()).toBe(true)
  expect(wrapper.find('#planner-today-btn').exists()).toBe(true)
  expect(wrapper.find('[data-testid="add-to-do-button"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="show-my-grades-button"]').exists()).toBe(true)
  // Check for trays
  expect(wrapper.find('Tray').at(0).prop('label')).toBe('Add To Do')
  expect(wrapper.find('Tray').at(1).prop('label')).toBe('My Grades')
  // Check opportunities popover exists
  expect(wrapper.find('Animatable(Opportunities_)').exists()).toBe(true)
})

it('does not render the Add To Do option when isObserving', () => {
  const {queryByText} = render(<PlannerHeader {...defaultProps()} isObserving={true} />)
  const addToDoButton = queryByText('Add To Do')

  expect(addToDoButton).toBeNull()
})

it('toggles the new item tray', async () => {
  const mockCancel = jest.fn()
  const {getByTestId, getByRole, queryByRole} = render(
    <PlannerHeader {...defaultProps()} cancelEditingPlannerItem={mockCancel} />,
  )
  const button = getByTestId('add-to-do-button')
  await userEvent.click(button)
  const heading1 = getByRole('heading', {name: /Add To Do/i})
  expect(heading1).toBeInTheDocument()
  await userEvent.click(button)
  const heading2 = queryByRole('heading', {name: /Add To Do/i})
  expect(heading2).not.toBeInTheDocument()
  expect(mockCancel).toHaveBeenCalled()
})

it('sends focus back to the add new item button', () => {
  const mockCancel = jest.fn()
  const ref = React.createRef()
  render(<PlannerHeader {...defaultProps()} cancelEditingPlannerItem={mockCancel} ref={ref} />)
  ref.current.handleToggleTray() // simulate clicking the + button
  ref.current.handleCloseTray() // simulate cancelling
  expect(mockCancel).toHaveBeenCalled()
})

describe('when component is mounted', () => {
  it("calls getNextOpportunities if all opportunities haven't been loaded", () => {
    const tempProps = defaultProps()
    tempProps.getNextOpportunities = jest.fn()
    tempProps.loading.allOpportunitiesLoaded = false
    render(<PlannerHeader {...tempProps} />)
    expect(tempProps.getNextOpportunities).toHaveBeenCalled()
  })

  it("doesn't call getNextOpportunities if all opportunities have already been loaded", () => {
    const tempProps = defaultProps()
    tempProps.getNextOpportunities = jest.fn()
    render(<PlannerHeader {...tempProps} />)
    expect(tempProps.getNextOpportunities).not.toHaveBeenCalled()
  })
})

it('toggles aria-hidden on the ariaHideElement when opening the opportunities popover', () => {
  const fakeElement = document.createElement('div')
  const wrapper = render(<PlannerHeader {...defaultProps()} ariaHideElement={fakeElement} />)
  const button = wrapper.getByText('opportunities popup')
  fireEvent.click(button)
  expect(fakeElement.getAttribute('aria-hidden')).toBe('true')
  fireEvent.click(button)
  expect(fakeElement.getAttribute('aria-hidden')).toBe(null)
})

it('toggles aria-hidden on the ariaHideElement when opening the add to do item tray', () => {
  const fakeElement = document.createElement('div')
  const wrapper = render(<PlannerHeader {...defaultProps()} ariaHideElement={fakeElement} />)

  const button = wrapper.getByTestId('add-to-do-button')

  fireEvent.click(button)
  expect(fakeElement.getAttribute('aria-hidden')).toBe('true')
  fireEvent.click(button)
  expect(fakeElement.getAttribute('aria-hidden')).toBe(null)
})

it('renders the tray with the name of an existing item when provided', () => {
  const wrapper = shallow(
    <PlannerHeader {...defaultProps({todo: {updateTodoItem: {title: 'abc'}}})} />,
  )
  expect(findEditTray(wrapper).prop('label')).toBe('Edit abc')
})

it('does not call getNextOpportunities when component has loaded all opportunities', () => {
  const mockDispatch = jest.fn()
  const props = defaultProps()
  props.courses = [
    {id: '1', longName: 'Course Long Name', shortName: 'Course Short Name'},
    {id: '2', longName: 'Course Other Long Name', shortName: 'Course Other Name'},
    {id: '3', longName: 'Course Big Long Name', shortName: 'Course Big Name'},
  ]

  props.opportunities.items = [
    {
      id: '1',
      course_id: '1',
      due_at: '2017-03-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '2',
      course_id: '2',
      due_at: '2017-04-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '3',
      course_id: '3',
      due_at: '2017-05-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '4',
      course_id: '1',
      due_at: '2017-06-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '5',
      course_id: '2',
      due_at: '2017-07-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '6',
      course_id: '3',
      due_at: '2017-08-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '7',
      course_id: '1',
      due_at: '2017-09-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
  ]

  props.loading = {
    isLoading: false,
    allPastItemsLoaded: false,
    allFutureItemsLoaded: false,
    allOpportunitiesLoaded: true,
    setFocusAfterLoad: false,
    firstNewDayKey: null,
    futureNextUrl: null,
    pastNextUrl: null,
    seekingNewActivity: false,
  }

  props.todo = {}

  props.getNextOpportunities = mockDispatch
  const wrapper = shallow(<PlannerHeader {...props} />)

  wrapper.setProps(props)
  expect(props.getNextOpportunities).not.toHaveBeenCalled()
})

it('does call getNextOpportunities when component has 9 opportunities', () => {
  const mockDispatch = jest.fn()
  const props = defaultProps()
  props.courses = [
    {id: '1', longName: 'Course Long Name', shortName: 'Course Short Name'},
    {id: '2', longName: 'Course Other Long Name', shortName: 'Course Other Name'},
    {id: '3', longName: 'Course Big Long Name', shortName: 'Course Big Name'},
  ]

  props.opportunities.items = [
    {
      id: '1',
      course_id: '1',
      due_at: '2017-03-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '2',
      course_id: '2',
      due_at: '2017-04-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '3',
      course_id: '3',
      due_at: '2017-05-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '4',
      course_id: '1',
      due_at: '2017-06-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '5',
      course_id: '2',
      due_at: '2017-07-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '6',
      course_id: '3',
      due_at: '2017-08-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '7',
      course_id: '1',
      due_at: '2017-09-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '8',
      course_id: '2',
      due_at: '2017-10-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '9',
      course_id: '1',
      due_at: '2017-15-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
  ]

  props.loading = {
    allPastItemsLoaded: false,
    allFutureItemsLoaded: false,
    allOpportunitiesLoaded: false,
    setFocusAfterLoad: false,
    firstNewDayKey: null,
    futureNextUrl: null,
    pastNextUrl: null,
    seekingNewActivity: false,
  }
  props.todo = {}

  props.getNextOpportunities = mockDispatch
  const wrapper = shallow(<PlannerHeader {...props} />)

  wrapper.setProps(props)
  expect(props.getNextOpportunities).toHaveBeenCalled()
})

it('opens tray if todo update item props is set', () => {
  const mockDispatch = jest.fn()
  const props = defaultProps()
  props.courses = [
    {id: '1', longName: 'Course Long Name', shortName: 'Course Short Name'},
    {id: '2', longName: 'Course Other Long Name', shortName: 'Course Other Name'},
    {id: '3', longName: 'Course Big Long Name', shortName: 'Course Big Name'},
  ]

  props.opportunities.items = [
    {
      id: '1',
      course_id: '1',
      due_at: '2017-03-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '2',
      course_id: '2',
      due_at: '2017-04-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '3',
      course_id: '3',
      due_at: '2017-05-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '4',
      course_id: '1',
      due_at: '2017-06-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '5',
      course_id: '2',
      due_at: '2017-07-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '6',
      course_id: '3',
      due_at: '2017-08-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '7',
      course_id: '1',
      due_at: '2017-09-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '8',
      course_id: '2',
      due_at: '2017-10-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '9',
      course_id: '1',
      due_at: '2017-15-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '11',
      course_id: '2',
      due_at: '2017-16-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '12',
      course_id: '1',
      due_at: '2017-12-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '10',
      course_id: '2',
      due_at: '2017-17-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
  ]

  props.getNextOpportunities = mockDispatch
  const wrapper = shallow(<PlannerHeader {...props} />)

  props.todo = {
    updateTodoItem: {
      id: 10,
    },
  }

  wrapper.setProps(props)
  expect(wrapper.state().trayOpen).toEqual(true)
})

it('shows all opportunities on badge even when we have over 10 items', () => {
  const props = defaultProps()
  props.courses = [
    {id: '1', longName: 'Course Long Name', shortName: 'Course Short Name'},
    {id: '2', longName: 'Course Other Long Name', shortName: 'Course Other Name'},
    {id: '3', longName: 'Course Big Long Name', shortName: 'Course Big Name'},
  ]

  props.opportunities.items = [
    {
      id: '1',
      course_id: '1',
      due_at: '2017-03-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '2',
      course_id: '2',
      due_at: '2017-04-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '3',
      course_id: '3',
      due_at: '2017-05-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '4',
      course_id: '1',
      due_at: '2017-06-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '5',
      course_id: '2',
      due_at: '2017-07-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '6',
      course_id: '3',
      due_at: '2017-08-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '7',
      course_id: '1',
      due_at: '2017-09-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '8',
      course_id: '2',
      due_at: '2017-10-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '9',
      course_id: '3',
      due_at: '2017-13-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '10',
      course_id: '1',
      due_at: '2017-14-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '11',
      course_id: '2',
      due_at: '2017-15-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
    {
      id: '12',
      course_id: '3',
      due_at: '2017-16-09T20:40:35Z',
      html_url: 'http://www.non_default_url.com',
      name: 'learning object title',
    },
  ]

  props.loading = {
    loadingOpportunities: false,
    allOpportunitiesLoaded: true,
  }

  const {getAllByText} = render(<PlannerHeader {...props} />)
  const badge = getAllByText(`${props.opportunities.items.length}`)[0] // Assuming you have a test ID for the badge

  expect(badge.textContent).toBe(String(props.opportunities.items.length))
})

it('edits new item in open tray', () => {
  const openEditingPlannerItem = jest.fn()
  const todo1 = {title: 'todo1'}
  const todo2 = {title: 'todo2'}
  // Because Tray renders its contents (UpdateItemTray) somewhere else in the DOM,
  // if we mount(), we won't be able to find it to check its properties
  const wrapper = shallow(
    <PlannerHeader {...defaultProps()} openEditingPlannerItem={openEditingPlannerItem} />,
  )

  // edit a PlannerItem
  wrapper.setProps({...defaultProps({todo: {updateTodoItem: todo1}})})
  expect(findEditTray(wrapper).prop('open')).toEqual(true)
  expect(wrapper.find('UpdateItemTray_').prop('noteItem')).toEqual(todo1)
  expect(openEditingPlannerItem).toHaveBeenCalledTimes(1)

  // edit another PlannerItem in open tray
  wrapper.setProps({...defaultProps({todo: {updateTodoItem: todo2}})})
  expect(findEditTray(wrapper).props().open).toEqual(true)
  expect(wrapper.find('UpdateItemTray_').prop('noteItem')).toEqual(todo2)
  expect(openEditingPlannerItem).toHaveBeenCalledTimes(2)
})

it('sets the maxHeight on the Opportunities', () => {
  window.innerHeight = 700 // even though it doesn't actually change the window's size, you can do this.
  const wrapper = shallow(<PlannerHeader {...defaultProps()} />)
  // since we've shallow rendered, have to stub in the button
  // (if we mount, then the popup isn't reachable from enzyme)
  wrapper.instance().opportunitiesHtmlButton = {
    getBoundingClientRect() {
      return {top: 10, height: 20}
    },
  }
  // triggers a re-render
  wrapper.setState({opportunitiesOpen: true})
  expect(wrapper.find('Animatable(Opportunities_)').prop('maxHeight')).toEqual(640)
})

it('opens the tray when it gets an updateTodoItem prop', () => {
  const wrapper = shallow(<PlannerHeader {...defaultProps()} />)

  expect(findEditTray(wrapper).prop('open')).toBe(false)
  wrapper.setProps({...defaultProps({todo: {updateTodoItem: {}}})})
  expect(findEditTray(wrapper).prop('open')).toBe(true)
})

it('toggles the grades tray', async () => {
  const {getByTestId, getByRole, queryByRole} = render(<PlannerHeader {...defaultProps()} />)

  const button = getByTestId('show-my-grades-button')
  await userEvent.click(button)

  const heading1 = getByRole('heading', {name: /My Grades/i})
  expect(heading1).toBeInTheDocument()

  await userEvent.click(button)

  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 500))

  const heading2 = queryByRole('heading', {name: /My Grades/i})
  expect(heading2).not.toBeInTheDocument()
})

it('calls startLoadingGradesSaga when grades are not loaded and the grades tray opens', () => {
  const props = defaultProps()
  props.startLoadingGradesSaga = jest.fn()
  const wrapper = shallow(<PlannerHeader {...props} />)
  wrapper.instance().toggleGradesTray()
  expect(props.startLoadingGradesSaga).toHaveBeenCalled()
})

it('passes loading to the GradesDisplay when grades are loading', () => {
  const props = defaultProps()
  props.loading.loadingGrades = true
  const wrapper = shallow(<PlannerHeader {...props} />)
  expect(wrapper.find('GradesDisplay').prop('loading')).toBe(true)
})

it('does not start the grades saga when grades are loading', () => {
  const props = defaultProps()
  props.loading.loadingGrades = true
  props.startLoadingGradesSaga = jest.fn()
  const wrapper = shallow(<PlannerHeader {...props} />)
  wrapper.instance().toggleGradesTray()
  expect(props.startLoadingGradesSaga).not.toHaveBeenCalled()
})

it('does not start the grades saga when grades have been loaded', () => {
  const props = defaultProps()
  props.loading.gradesLoaded = true
  props.startLoadingGradesSaga = jest.fn()
  const wrapper = shallow(<PlannerHeader {...props} />)
  wrapper.instance().toggleGradesTray()
  expect(props.startLoadingGradesSaga).not.toHaveBeenCalled()
})

describe('new activity button', () => {
  let spy

  beforeEach(() => {
    spy = jest.spyOn(PlannerHeader.prototype, 'newActivityAboveView')
  })

  afterEach(() => {
    spy.mockReset()
    spy.mockRestore()
  })

  it('does not show when there is no new activity', () => {
    spy.mockReturnValue(false)
    const wrapper = shallow(<PlannerHeader {...defaultProps()} />)
    expect(wrapper.find('Portal').prop('open')).toBe(false)
    expect(spy.mock.calls).toHaveLength(1)
  })

  it('shows when there is new activity', () => {
    spy.mockReturnValue(true)
    const wrapper = shallow(<PlannerHeader {...defaultProps()} />)
    expect(wrapper.find('Portal').prop('open')).toBe(true)
    expect(spy.mock.calls).toHaveLength(1)
  })
})

describe('decision to show new activity indicator', () => {
  it('is false while data is loading', () => {
    const props = defaultProps()
    props.loading.isLoading = true
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(false)
  })

  it('is false when there are no planner items', () => {
    const props = defaultProps()
    props.days = []
    props.loading.isLoading = false
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(false)
  })

  it('is false when first activity date is unknown', () => {
    const props = defaultProps()
    props.loading.isLoading = false
    props.firstNewActivityDate = undefined
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(false)
  })

  it('is false when the newest activity is already on or below the viewport', () => {
    const props = defaultProps()
    props.loading.isLoading = false
    props.firstNewActivityDate = plannerDays[0]
    props.ui.naiAboveScreen = false
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(false)
  })

  it('is true when there is new activity still to be loaded from the past', () => {
    const props = defaultProps()
    props.loading.isLoading = false
    props.firstNewActivityDate = moment(plannerDays[0])
    props.firstNewActivityDate.subtract(5, 'days')
    props.ui.naiAboveScreen = false
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(true)
  })

  it('is true when a new activity is above the viewport', () => {
    const props = defaultProps()
    props.loading.isLoading = false
    props.firstNewActivityDate = plannerDays[0]
    props.ui.naiAboveScreen = true
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(true)
  })

  it('is true when there is new activity but no current items', () => {
    const props = defaultProps()
    props.days = []
    props.loading.isLoading = false
    props.firstNewActivityDate = plannerDays[0]
    props.ui.naiAboveScreen = true
    const wrapper = shallow(<PlannerHeader {...props} />)
    expect(wrapper.instance().newActivityAboveView()).toEqual(true)
  })
})

describe('today button', () => {
  it('is displayed when the planner has items', () => {
    const props = defaultProps()
    const wrapper = shallow(<PlannerHeader {...props} />)
    const todaybtn = wrapper.find('#planner-today-btn')
    expect(todaybtn).toHaveLength(1)
  })

  it('is not displayed when the planner has no items to display', () => {
    const props = defaultProps()
    props.days = []
    const wrapper = shallow(<PlannerHeader {...props} />)
    const todaybtn = wrapper.find('#planner-today-btn')
    expect(todaybtn).toHaveLength(0)
  })
})
