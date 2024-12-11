module Branches
  class FetchCenters
    def initialize(branch:)
      @branch = branch
    end

    def execute!
      centers = @branch
        .centers
        .select("
          centers.*,
          SUM(CASE WHEN members.status = 'active' THEN 1 ELSE 0 END) AS active_count,
          SUM(CASE WHEN members.status = 'pending' THEN 1 ELSE 0 END) AS pending_count
        ")
        .joins(:members)
        .includes(:user)
        .group("centers.id")
        .order("name ASC")
        .map do |c|
          officer = c.try(:user)
          {
            id: c.id,
            name: c.name,
            short_name: c.short_name,
            meeting_day_display: c.meeting_day_display,
            officer: {
              id: officer.try(:id),
              first_name: officer.try(:first_name),
              last_name: officer.try(:last_name)
            },
            active_count: c.active_count,
            pending_count: c.pending_count
          }
        end

      {
        branch: { id: @branch.id, name: @branch.name },
        centers: centers,
      }
    end
  end
end
