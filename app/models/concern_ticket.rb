class ConcernTicket < ApplicationRecord
  has_many :concern_ticket_details
  has_many :concern_types, foreign_key: :concern_id
  has_many :concern_fors, foreign_key: :concern_id
  has_many :concern_ticket_users, foreign_key: :concern_ticket_id
  belongs_to :user, optional: true # Assuming some tickets might not have an assigned user
  belongs_to :computer_system, optional: true
  has_many :data_stores

  def developer_for_area(area_id)
    return if area_id.blank?

    member_id = (data || {}).fetch("area_developers", {})[area_id.to_s]
    concern_ticket_users.find_by(id: member_id, task: "developer", status: "active")&.user_id if member_id.present?
  end

  def assignee_for_branch(branch_id)
    area_id = Branch.joins(:cluster).where(id: branch_id).pick("clusters.area_id") if branch_id.present?
    developer_for_area(area_id) || user_id
  end

  def assign_concern_leader(leader_id)
    return if leader_id.blank?

    unless concern_ticket_users.where(task: "developer", status: "active", user_id: leader_id).exists?
      errors.add(:base, "Concern leader must be an active developer belonging to this concern.")
      raise ActiveRecord::RecordInvalid, self
    end
    self.user_id = leader_id
  end

  def assign_area_developers(assignments)
    assignments = assignments.to_h.reject { |_, member_id| member_id.blank? }
    valid_areas = Area.where(id: assignments.keys).pluck(:id).map(&:to_s)
    valid_members = concern_ticket_users.where(task: "developer", status: "active").pluck(:id).map(&:to_s)
    unless (assignments.keys - valid_areas).empty? && (assignments.values - valid_members).empty?
      errors.add(:base, "Select valid areas and active developers belonging to this concern.")
      raise ActiveRecord::RecordInvalid, self
    end
    self.data = (data || {}).merge("area_developers" => assignments)
  end

  def assign_developer_areas(developer_areas)
    assignments = {}
    developer_areas.each_pair do |member_id, area_ids|
      Array(area_ids).reject(&:blank?).uniq.each do |area_id|
        if assignments.key?(area_id) && assignments[area_id] != member_id
          errors.add(:base, "An area cannot be selected for more than one developer. Remove duplicate selections before saving.")
          raise ActiveRecord::RecordInvalid, self
        end
        assignments[area_id] = member_id
      end
    end
    assign_area_developers(assignments)
  end
end
