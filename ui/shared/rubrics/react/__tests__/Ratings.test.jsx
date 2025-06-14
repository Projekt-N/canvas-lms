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
import $ from 'jquery'
import {shallow} from 'enzyme'
import Ratings, {Rating} from '../Ratings'

// This is needed for $.screenReaderFlashMessageExclusive to work.
import '@canvas/rails-flash-notifications'

describe('The Ratings component', () => {
  const props = {
    assessing: false,
    footer: null,
    tiers: [
      {id: '1', description: 'Superb', points: 10},
      {id: '2', description: 'Meh', long_description: 'More Verbosity', points: 5},
      {id: '3', description: 'Subpar', points: 1},
    ],
    defaultMasteryThreshold: 10,
    assessmentRatingId: '2',
    points: 5,
    pointsPossible: 10,
    isSummary: false,
    useRange: false,
  }

  const component = mods => shallow(<Ratings {...{...props, ...mods}} />)
  it('renders the root component as expected', () => {
    const wrapper = component()
    expect(wrapper.find('Rating')).toHaveLength(3)
    expect(wrapper.find('Rating').at(0).prop('description')).toBe('Superb')
    expect(wrapper.find('Rating').at(1).prop('description')).toBe('Meh')
    expect(wrapper.find('Rating').at(2).prop('description')).toBe('Subpar')
  })

  it('renders the Rating sub-components as expected when range rating enabled', () => {
    const useRange = true
    const wrapper = component({useRange})
    const ratings = wrapper.find('Rating')
    expect(ratings).toHaveLength(3)
    expect(ratings.at(0).prop('description')).toBe('Superb')
    expect(ratings.at(1).prop('description')).toBe('Meh')
    expect(ratings.at(2).prop('description')).toBe('Subpar')
  })

  it('properly select the first matching rating when two tiers have the same point value and no ID is passed', () => {
    const tiers = [
      {description: 'Superb', points: 10},
      {description: 'Meh', points: 5},
      {description: 'Meh 2, The Sequel', points: 5},
      {description: 'Subpar', points: 1},
    ]
    const assessmentRatingId = null
    const selected = component({tiers, assessmentRatingId})
      .find('Rating')
      .map(el => el.prop('selected'))
    expect(selected).toEqual([false, true, false, false])
  })

  it('highlights the right rating when no assessmentRatingId present', () => {
    const ratings = (points, useRange = false, assessmentRatingId = null) =>
      component({points, useRange, assessmentRatingId})
        .find('Rating')
        .map(el => el.shallow().hasClass('selected'))

    expect(ratings(10)).toEqual([true, false, false])
    expect(ratings(8)).toEqual([false, false, false])
    expect(ratings(8, true)).toEqual([true, false, false])
    expect(ratings(5)).toEqual([false, true, false])
    expect(ratings(3)).toEqual([false, false, false])
    expect(ratings(3, true)).toEqual([false, true, false])
    expect(ratings(1)).toEqual([false, false, true])
    expect(ratings(0, true)).toEqual([false, false, true])
    expect(ratings(undefined)).toEqual([false, false, false])
  })

  it('calls onPointChange and flashes VO message when a rating is clicked', () => {
    const onPointChange = jest.fn()
    const flashMock = jest.spyOn($, 'screenReaderFlashMessage')
    const el = component({onPointChange})

    el.find('Rating').first().prop('onClick').call()
    expect(onPointChange.mock.calls[0]).toEqual([
      {id: '1', description: 'Superb', points: 10},
      false,
    ])
    expect(flashMock).toHaveBeenCalledTimes(1)
    flashMock.mockRestore()
  })

  it('uses the right default mastery level colors', () => {
    const mastery = (points, assessmentRatingId) =>
      component({points, assessmentRatingId})
        .find('Rating')
        .map(el => el.prop('tierColor'))
    expect(mastery(10, '1')).toEqual([null, 'transparent', 'transparent'])
    expect(mastery(5, '2')).toEqual(['transparent', null, 'transparent'])
    expect(mastery(1, '3')).toEqual(['transparent', 'transparent', null])
    const shaderClasses = (points, assessmentRatingId) =>
      component({points, assessmentRatingId})
        .find('Rating')
        .map(el => el.prop('shaderClass'))
    expect(shaderClasses(10, '1')).toEqual(['meetsMasteryShader', null, null])
    expect(shaderClasses(5, '2')).toEqual([null, 'nearMasteryShader', null])
    expect(shaderClasses(1, '3')).toEqual([null, null, 'wellBelowMasteryShader'])
  })

  it('uses the right custom rating colors', () => {
    const customRatings = [
      {points: 10, color: '09BCD3'},
      {points: 5, color: '65499D'},
      {points: 1, color: 'F8971C'},
    ]
    const ratings = (points, assessmentRatingId, useRange = false) =>
      component({points, assessmentRatingId, useRange, customRatings})
        .find('Rating')
        .map(el => el.prop('tierColor'))
    expect(ratings(10, '1')).toEqual(['#09BCD3', 'transparent', 'transparent'])
    expect(ratings(5, '2')).toEqual(['transparent', '#65499D', 'transparent'])
    expect(ratings(1, '3')).toEqual(['transparent', 'transparent', '#F8971C'])
    expect(ratings(0, '3', true)).toEqual(['transparent', 'transparent', '#F8971C'])
  })

  describe('custom ratings', () => {
    const customRatings = [
      {points: 100, color: '100100'},
      {points: 60, color: '606060'},
      {points: 10, color: '101010'},
      {points: 1, color: '111111'},
    ]
    const ratings = (points, assessmentRatingId, pointsPossible = 10) =>
      component({points, assessmentRatingId, pointsPossible, customRatings, useRange: true})
        .find('Rating')
        .map(el => el.prop('tierColor'))

    it('scales points to custom ratings', () => {
      expect(ratings(10, '1')).toEqual(['#100100', 'transparent', 'transparent'])
      expect(ratings(6, '1')).toEqual(['#606060', 'transparent', 'transparent'])
      expect(ratings(5, '2')).toEqual(['transparent', '#101010', 'transparent'])
      expect(ratings(4.4, '2')).toEqual(['transparent', '#101010', 'transparent'])
      expect(ratings(1, '3')).toEqual(['transparent', 'transparent', '#101010'])
      expect(ratings(0.1, '3')).toEqual(['transparent', 'transparent', '#111111'])
      expect(ratings(0, '3')).toEqual(['transparent', 'transparent', '#111111'])
    })

    it('does not scale points if pointsPossible is 0', () => {
      expect(ratings(10, '1', 0)).toEqual(['#101010', 'transparent', 'transparent'])
      expect(ratings(4, '2', 0)).toEqual(['transparent', '#111111', 'transparent'])
    })
  })

  const ratingComponent = overrides => (
    <Rating {...props.tiers[0]} isSummary={false} assessing={true} {...overrides} />
  )

  it('is navigable and clickable when assessing', () => {
    const onClick = jest.fn()
    const wrapper = shallow(ratingComponent({onClick}))
    const div = wrapper.find('div').at(0)
    expect(div.prop('tabIndex')).toEqual(0)
    div.simulate('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('is not navigable or clickable when not assessing', () => {
    const onClick = jest.fn()
    const wrapper = shallow(ratingComponent({assessing: false, onClick}))
    const div = wrapper.find('div').at(0)
    expect(div.prop('tabIndex')).toBeNull()
    expect(div.prop('role')).toBeNull()
    div.simulate('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('only renders the single selected Rating with a footer in summary mode', () => {
    const el = component({points: 5, isSummary: true, footer: <div>ow my foot</div>})
    const ratings = el.find('Rating')

    expect(ratings).toHaveLength(1)

    const rating = ratings.at(0)
    expect(rating.prop('description')).toBe('Meh')
    expect(rating.prop('points')).toBe(5)
    expect(rating.prop('selected')).toBe(true)
  })

  it('renders a default rating if none of the ratings are selected', () => {
    const el = component({
      points: 6,
      assessmentRatingId: null,
      isSummary: true,
      footer: <div>ow my foot</div>,
    })
    const ratings = el.find('Rating')

    expect(ratings).toHaveLength(1)

    const rating = ratings.at(0)
    expect(rating.prop('points')).toBe(0)
    expect(rating.prop('description')).toBeTruthy()
  })

  it('hides points on the default rating if points are hidden', () => {
    const el = component({points: 6, isSummary: true, footer: <div>ow my foot</div>})
    const rating = el.find('Rating')
    expect(rating.prop('hidePoints')).toBe(true)
  })

  it('renders rating-points when restrictive quantitative data and hidePoints is false', () => {
    const component = shallow(
      <Rating {...props.tiers[0]} isSummary={false} assessing={true} hidePoints={false} />,
    )

    expect(component.find('[data-testid="rating-points"]').exists()).toBe(true)
  })

  describe('with restrict_quantitative_data', () => {
    let originalENV

    beforeEach(() => {
      originalENV = {...window.ENV}
      window.ENV.restrict_quantitative_data = true
    })

    afterEach(() => {
      window.ENV = originalENV
    })

    it('does not renders rating-points when restrictive quantitative data is true and hidePoints is false', () => {
      ENV.restrict_quantitative_data = true
      const component = shallow(
        <Rating {...props.tiers[0]} isSummary={false} assessing={true} hidePoints={false} />,
      )

      expect(component.find('[data-testid="rating-points"]').exists()).toBe(false)
    })

    it('does not renders rubric-total when restrictive quantitative data is false and hidePoints if true', () => {
      ENV.restrict_quantitative_data = false
      const component = shallow(
        <Rating {...props.tiers[0]} isSummary={false} assessing={true} hidePoints={true} />,
      )

      expect(component.find('[data-testid="rating-points"]').exists()).toBe(false)
    })
  })
})
