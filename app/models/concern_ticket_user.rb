class ConcernTicketUser < ApplicationRecord
    
  belongs_to :user
  belongs_to :concern_ticket

  def update_branch_assignment!(task:, status:, branch_ids:)
    concern_ticket.with_lock do
      assignments = (concern_ticket.data || {}).fetch("branch_developers", {}).dup
      selected_ids = Array(branch_ids).reject(&:blank?).map(&:to_s).uniq
      selected_ids = [] unless task == "developer" && status == "active"

      unless Branch.where(id: selected_ids).count == selected_ids.length
        raise ArgumentError, "Please select valid branches."
      end

      conflicts = assignments.select { |branch_id, member_id| selected_ids.include?(branch_id) && member_id != id.to_s }
      if concern_ticket.concern_ticket_users.where(id: conflicts.values, task: "developer", status: "active").exists?
        raise ArgumentError, "A selected branch already belongs to another active developer. Remove that assignment first."
      end

      assignments.delete_if { |_, member_id| member_id == id.to_s }
      selected_ids.each { |branch_id| assignments[branch_id] = id.to_s }
      update!(task: task, status: status)
      concern_ticket.update!(data: (concern_ticket.data || {}).merge("branch_developers" => assignments))
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