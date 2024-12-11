module Branches
  class ComputeMonthlyNewAndResignedForMii
    def initialize(config:)
      @config = config
      @year   = @config[:year]
      @month  = @config[:month]
      @branch = @config[:branch]
      @as_of  = Date.new(@year, @month, -1)
      @start_date = @as_of.at_beginning_of_month


      @members  = Member.active_and_resigned_and_pending.where(
                    branch_id: @branch.id
                  )

      @data = {
        year: @year,
        month: @month,
        as_of: @as_of,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        new_members: [],
        resigned_members: [],
        num_new: 0,
        num_resigned: 0,
        # settings_default_membership: @settings_default_membership
        settings_default_membership: "KMBA"
      }
    end

    def execute!
      @resigned_members = @members.where(
                            "(extract(month FROM insurance_date_resigned) = ? AND extract(year FROM insurance_date_resigned) = ?)",
                            @month,
                            @year
                          ).order("last_name ASC")

      @new_members  = @members.active.where(
                        "data ->> 'recognition_date' >= ? AND data ->>'recognition_date' <= ?",
                        @start_date,
                        @as_of
                      ).order("last_name ASC")


      # Compute resigned
      @data[:num_resigned]  = @resigned_members.count

      # Compute new
      @data[:num_new] = @new_members.count

      # Format resigned members
      @data[:resigned_members]  = @resigned_members.map{ |m|
                                    date_resigned = m.insurance_date_resigned

                                    if date_resigned.blank?
                                      date_resigned = m.previous_date_resigned
                                    end

                                    {
                                      id: m.id,
                                      first_name: m.first_name,
                                      middle_name: m.middle_name,
                                      last_name: m.last_name,
                                      identifiction_number: m.identification_number,
                                      date_resigned: date_resigned.strftime("%B %d, %Y"),
                                      center: {
                                        id: m.center.id,
                                        name: m.center.name
                                      },
                                      officer: {
                                        id: m.center.try(:user).try(:id),
                                        first_name: m.center.try(:user).try(:first_name),
                                        last_name: m.center.try(:user).try(:last_name)
                                      },
                                      branch: {
                                        id: m.branch.id,
                                        name: m.branch.name
                                      }
                                    }
                                  }

      # Format new members
      @data[:new_members] = @new_members.map{ |m|
                              recognition_date  = m.recognition_date
                              
                              if recognition_date.present?
                                recognition_date  = recognition_date.strftime("%b %d, %Y")
                              end

                              {
                                id: m.id,
                                first_name: m.first_name,
                                middle_name: m.middle_name,
                                last_name: m.last_name,
                                identifiction_number: m.identification_number,
                                recognition_date: recognition_date,
                                membership_date: recognition_date,
                                center: {
                                  id: m.center.id,
                                  name: m.center.name
                                },
                                officer: {
                                  id: m.center.try(:user).try(:id),
                                  first_name: m.center.try(:user).try(:first_name),
                                  last_name: m.center.try(:user).try(:last_name)
                                },
                                branch: {
                                  id: m.branch.id,
                                  name: m.branch.name
                                }
                              }
                            }

      @data
    end
  end
end
