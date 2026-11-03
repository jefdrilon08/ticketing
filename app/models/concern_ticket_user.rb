class ConcernTicketUser < ApplicationRecord
    
  belongs_to :user
  belongs_to :concern_ticket

  def update_area_assignment!(task:, status:, area_ids:)
    concern_ticket.with_lock do
      assignments = (concern_ticket.data || {}).fetch("area_developers", {}).dup
      selected_ids = Array(area_ids).reject(&:blank?).map(&:to_s).uniq
      selected_ids = [] unless task == "developer" && status == "active"

      unless Area.where(id: selected_ids).count == selected_ids.length
        raise ArgumentError, "Please select valid areas."
      end

      conflicts = assignments.select { |area_id, member_id| selected_ids.include?(area_id) && member_id != id.to_s }
      if concern_ticket.concern_ticket_users.where(id: conflicts.values, task: "developer", status: "active").exists?
        raise ArgumentError, "A selected area already belongs to another active developer. Remove that assignment first."
      end

      assignments.delete_if { |_, member_id| member_id == id.to_s }
      selected_ids.each { |area_id| assignments[area_id] = id.to_s }
      update!(task: task, status: status)
      concern_ticket.update!(data: (concern_ticket.data || {}).merge("area_developers" => assignments))
    end
  end

  # CTU_ROLES = [
  #   "Developer",
  #   "Requester",
  # ]

  # CT_STATUSES = [
  #   "Active",
  #   "Inactive",
  # ]

end
