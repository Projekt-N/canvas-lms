# frozen_string_literal: true

#
# Copyright (C) 2011 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.
#

class AttachmentAssociation < ActiveRecord::Base
  # removing this definition until we figure out how to unbreak rake db:set_ignored_columns
  # enum :field_name, %i[syllabus_body]

  belongs_to :attachment
  belongs_to :context, polymorphic: %i[conversation_message submission course group]
  belongs_to :user

  before_create :set_root_account_id

  after_save :set_word_count

  def self.update_associations(context, attachment_ids, user, session, field_name = nil)
    currently_has = AttachmentAssociation.where(context:, field_name:).pluck(:attachment_id)

    to_delete = currently_has - attachment_ids
    to_create = attachment_ids - currently_has

    AttachmentAssociation.where(context:, field_name:, attachment_id: to_delete).destroy_all if to_delete.any?

    if to_create.any?
      Attachment.where(id: to_create).find_each do |attachment|
        next unless attachment.grants_right?(user, session, :download)

        AttachmentAssociation.create!(context:, attachment:, user:, field_name:)
      end
    end
  end

  def set_root_account_id
    self.root_account_id ||=
      if context_type == "ConversationMessage" || context.nil?
        # conversation messages can have multiple root account IDs, so we
        # don't bother dealing with them here
        attachment&.root_account_id
      else
        context.root_account_id
      end
  end

  def set_word_count
    if context_type == "Submission" && saved_change_to_attachment_id?
      attachment&.set_word_count
    end
  end
end
