/*
 * Copyright (C) 2021 - present Instructure, Inc.
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

import {render} from '@testing-library/react'
import React from 'react'
import QuestionInspector from '../index'

describe('canvas_quizzes/events/views/QuestionInspector', () => {
  it('renders', () => {
    render(
      <QuestionInspector
        events={[
          {
            id: 'e1',
            type: 'question_answered',
            data: [{quizQuestionId: 'q1'}],
          },
        ]}
        question={{id: 'q1'}}
      />,
    )
    expect(document.body.textContent).toMatch('This question was answered once.')
  })

  it('renders against a real payload', () => {
    const {events} = {
      events: [
        {
          id: '3408',
          createdAt: '2014-11-16T13:37:27Z',
          type: 'question_answered',
          data: [
            {quizQuestionId: '111', answer: null, answered: false},
            {quizQuestionId: '112', answer: null, answered: false},
            {quizQuestionId: '113', answer: {color1: null, color2: null}, answered: false},
            {quizQuestionId: '114', answer: [], answered: false},
            {quizQuestionId: '115', answer: [], answered: false},
            {quizQuestionId: '116', answer: null, answered: false},
            {quizQuestionId: '117', answer: {organ: null, color: null}, answered: false},
            {quizQuestionId: '118', answer: null, answered: false},
          ],
        },
        {
          id: '3415',
          createdAt: '2014-11-16T13:38:27Z',
          type: 'question_answered',
          data: [{quizQuestionId: '114', answer: ['5514'], answered: true}],
        },
        {
          id: '3418',
          createdAt: '2014-11-16T13:48:54Z',
          type: 'question_answered',
          data: [{quizQuestionId: '113', answer: {color1: 'red', color2: null}, answered: true}],
        },
        {
          id: '3419',
          createdAt: '2014-11-16T13:48:57Z',
          type: 'question_answered',
          data: [{quizQuestionId: '113', answer: {color1: 'red', color2: 'blue'}, answered: true}],
        },
        {
          id: '3424',
          createdAt: '2014-11-16T14:18:03Z',
          type: 'question_answered',
          data: [{quizQuestionId: '113', answer: {color1: null, color2: 'blue'}, answered: true}],
        },
        {
          id: '3429',
          createdAt: '2014-11-16T14:18:55Z',
          type: 'question_answered',
          data: [{quizQuestionId: '113', answer: {color1: null, color2: null}, answered: false}],
        },
        {
          id: '3434',
          createdAt: '2014-11-16T14:26:01Z',
          type: 'question_answered',
          data: [{quizQuestionId: '113', answer: {color1: null, color2: 'xxx'}, answered: true}],
        },
        {
          id: '3435',
          createdAt: '2014-11-16T14:26:05Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '113',
              answer: {color1: null, color2: 'xyz'},
              answered: true,
              last: true,
            },
          ],
        },
        {
          id: '3446',
          createdAt: '2014-12-03T12:09:48Z',
          type: 'question_answered',
          data: [
            {quizQuestionId: '111', answer: '<p>hello world</p>', answered: true},
            {
              quizQuestionId: '115',
              answer: [
                {answer_id: '1422', match_id: null},
                {answer_id: '9895', match_id: null},
                {answer_id: '9297', match_id: null},
              ],
              answered: false,
            },
          ],
        },
        {
          id: '3447',
          createdAt: '2014-12-03T12:09:52Z',
          type: 'question_answered',
          data: [
            {quizQuestionId: '111', answer: '<p>hello world</p>\n<p>&nbsp;</p>', answered: true},
          ],
        },
        {
          id: '3448',
          createdAt: '2014-12-03T12:09:53Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '111',
              answer:
                '<p>hello world</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>akjshdklhaskjdhjkasdk</p>\n<p>&nbsp;</p>',
              answered: true,
            },
          ],
        },
        {
          id: '3449',
          createdAt: '2014-12-03T12:09:54Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '111',
              answer:
                '<p>hello world</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>akjshdklhaskjdhjkasdk</p>\n<p>zxclkjzxlck</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>',
              answered: true,
            },
          ],
        },
        {
          id: '3450',
          createdAt: '2014-12-03T12:09:56Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '111',
              answer:
                '<p>hello world</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>akjshdklhaskjdhjkasdk</p>\n<p>zxclkjzxlck</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>adada</p>',
              answered: true,
            },
          ],
        },
        {
          id: '3456',
          createdAt: '2014-12-03T12:09:59Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '111',
              answer:
                '<p>hello world</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>akjshdklhaskjdhjkasdk</p>\n<p>zxclkjzxlck</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p><span style="color: #99cc00;">adada</span></p>',
              answered: true,
            },
          ],
        },
        {
          id: '3459',
          createdAt: '2014-12-03T12:10:14Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '111',
              answer:
                '<p>hello world</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>akjshdklhaskjdhjkasdk</p>\n<p>zxclkjzxlck</p>\n<p>&nbsp;</p>\n<p></p>\n<p><span style="color: #99cc00;">adada</span></p>',
              answered: true,
              last: true,
            },
          ],
        },
        {
          id: '3460',
          createdAt: '2014-12-03T12:10:22Z',
          type: 'question_answered',
          data: [{quizQuestionId: '112', answer: '662', answered: false, last: true}],
        },
        {
          id: '3461',
          createdAt: '2014-12-03T12:10:24Z',
          type: 'question_answered',
          data: [{quizQuestionId: '114', answer: ['5514', '4261'], answered: true, last: true}],
        },
        {
          id: '3467',
          createdAt: '2014-12-03T12:10:33Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '115',
              answer: [
                {answer_id: '1422', match_id: null},
                {answer_id: '9895', match_id: '9019'},
                {answer_id: '9297', match_id: null},
              ],
              answered: true,
            },
          ],
        },
        {
          id: '3468',
          createdAt: '2014-12-03T12:10:34Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '115',
              answer: [
                {answer_id: '1422', match_id: '9812'},
                {answer_id: '9895', match_id: '9019'},
                {answer_id: '9297', match_id: null},
              ],
              answered: true,
            },
          ],
        },
        {
          id: '3469',
          createdAt: '2014-12-03T12:10:35Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '115',
              answer: [
                {answer_id: '1422', match_id: '9812'},
                {answer_id: '9895', match_id: '9019'},
                {answer_id: '9297', match_id: '1616'},
              ],
              answered: true,
              last: true,
            },
          ],
        },
        {
          id: '3470',
          createdAt: '2014-12-03T12:10:39Z',
          type: 'question_answered',
          data: [
            {quizQuestionId: '116', answer: '3023', answered: true, last: true},
            {quizQuestionId: '117', answer: {organ: null, color: '1381'}, answered: true},
          ],
        },
        {
          id: '3471',
          createdAt: '2014-12-03T12:10:41Z',
          type: 'question_answered',
          data: [{quizQuestionId: '117', answer: {organ: '3208', color: '1381'}, answered: true}],
        },
        {
          id: '3475',
          createdAt: '2014-12-03T12:10:44Z',
          type: 'question_answered',
          data: [
            {
              quizQuestionId: '117',
              answer: {organ: '3208', color: '1638'},
              answered: true,
              last: true,
            },
          ],
        },
        {
          id: '3476',
          createdAt: '2014-12-03T12:10:45Z',
          type: 'question_answered',
          data: [{quizQuestionId: '118', answer: 32, answered: true}],
        },
        {
          id: '3477',
          createdAt: '2014-12-03T12:10:48Z',
          type: 'question_answered',
          data: [{quizQuestionId: '118', answer: 4, answered: true, last: true}],
        },
      ],
      questions: [
        {
          id: '111',
          questionType: 'essay_question',
          questionText:
            '<p>[Essay] Summarize your feelings towards life, the universe, and everything in decimal numbers.</p>',
          position: 1,
          answers: [],
          matches: null,
          readableType: 'Essay',
        },
        {
          id: '112',
          questionType: 'file_upload_question',
          questionText: '<p>[File Upload] Hey, what do you look like?</p>',
          position: 2,
          answers: [],
          matches: null,
          readableType: 'File upload',
        },
        {
          id: '113',
          questionType: 'fill_in_multiple_blanks_question',
          questionText: '<p>[FIMB] Roses are [color1], violets are [color2]</p>',
          position: 3,
          answers: [
            {id: '9711', text: 'Red', comments: '', weight: 100, blank_id: 'color1'},
            {id: '2700', text: 'Blue', comments: '', weight: 100, blank_id: 'color1'},
            {id: 9702, text: 'bonkers', comments: '', weight: 100, blank_id: 'color2'},
            {id: 7150, text: 'mumbojumbo', comments: '', weight: 100, blank_id: 'color2'},
          ],
          matches: null,
          readableType: 'Fill in multiple blanks',
        },
        {
          id: '114',
          questionType: 'multiple_answers_question',
          questionText: '<p>[MAnswers] A and B, or B and C?</p>',
          position: 4,
          answers: [
            {id: 5514, text: 'A', comments: '', weight: 100},
            {id: 4261, text: 'B', comments: '', weight: 100},
            {id: 3322, text: 'C', comments: '', weight: 0},
          ],
          matches: null,
          readableType: 'Multiple answers',
        },
        {
          id: '116',
          questionType: 'multiple_choice_question',
          questionText: '<p>[MC] A, B, C, or D?</p>',
          position: 6,
          answers: [
            {id: 3023, text: 'A', html: '', comments: '', weight: 100},
            {id: 8899, text: 'B', html: '', comments: '', weight: 0},
            {id: 7907, text: 'C', html: '', comments: '', weight: 0},
            {id: 5646, text: 'D', html: '', comments: '', weight: 0},
          ],
          matches: null,
          readableType: 'Multiple choice',
        },
        {
          id: '117',
          questionType: 'multiple_dropdowns_question',
          questionText: '<p>[MDropdowns] Alligators are [color], zombies eat [organ].</p>',
          position: 7,
          answers: [
            {id: 3208, text: 'brainz', comments: '', weight: 100, blank_id: 'organ'},
            {id: 8331, text: '', comments: '', weight: 0, blank_id: 'organ'},
            {id: 1381, text: 'green', comments: '', weight: 100, blank_id: 'color'},
            {id: 1638, text: 'cool', comments: '', weight: 0, blank_id: 'color'},
          ],
          matches: null,
          readableType: 'Multiple dropdowns',
        },
        {
          id: '118',
          questionType: 'numerical_question',
          questionText: "<p>[Numerical] What's 9 plus 3, or 4 minus zero?</p>",
          position: 8,
          answers: [
            {
              id: 9395,
              text: '',
              comments: '',
              weight: 100,
              numerical_answer_type: 'exact_answer',
              exact: 0,
              margin: 0,
            },
            {
              id: 1939,
              text: '',
              comments: '',
              weight: 100,
              numerical_answer_type: 'exact_answer',
              exact: 0,
              margin: 0,
            },
            {
              id: 3009,
              text: '',
              comments: '',
              weight: 100,
              numerical_answer_type: 'exact_answer',
              exact: 0,
              margin: 0,
            },
          ],
          matches: null,
          readableType: 'Numerical',
        },
        {
          id: '115',
          questionType: 'matching_question',
          questionText: '<p>Matching!</p>',
          position: 5,
          answers: [
            {
              id: 1422,
              text: 'Where?',
              left: 'Where?',
              right: 'Home.',
              comments: '',
              match_id: 9812,
            },
            {
              id: 9895,
              text: 'When?',
              left: 'When?',
              right: 'Always.',
              comments: '',
              match_id: 4142,
            },
            {
              id: 9297,
              text: 'What if?',
              left: 'What if?',
              right: 'Yeah, what?',
              comments: '',
              match_id: 9019,
            },
          ],
          matches: [
            {text: 'Home.', match_id: 9812},
            {text: 'Always.', match_id: 4142},
            {text: 'Yeah, what?', match_id: 9019},
            {text: 'On January 1st, 1960.', match_id: 9308},
            {text: 'A coke, please.', match_id: 1616},
          ],
          readableType: 'Matching',
        },
      ],
      submission: {id: 1108, startedAt: '2014-11-16T13:37:19Z', attempt: 2},
      expandAll: false,
      shouldTruncate: false,
      activeEventId: null,
    }

    render(
      <QuestionInspector
        events={events}
        question={{
          id: '111',
        }}
      />,
    )

    expect(document.body.textContent).toMatch('This question was answered 8 times.')
  })
})
