module Branches
  class ComputeSf
    def initialize(config:)
      @config     = config
      @start_date = @config[:start_date].to_date
      @end_date   = @config[:end_date].to_date
      @branch     = @config[:branch]

      @members  = Member.active_and_resigned.where(
                    branch_id: @branch.id
                  ).order("last_name ASC")

      @data = {
        start_date: @start_date,
        end_date: @end_date,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        settings: Settings.default_member_accounts.map{ |o| { account_type: o.account_type, account_subtype: o.account_subtype } },
        records: [],
        centers: [],
        officers: [],
        total: []
      }
    end

    def execute!
      @members.each do |member|
        member_data = ::Members::BuildSoaFundsObject.new(
                        member: member, 
                        start_date: @start_date, 
                        end_date: @end_date
                      ).execute!

        if member_data[:records].any?
          @data[:records] << member_data
        end
      end

      # Setup centers
      centers = Center.where(
                  id: @members.pluck(:center_id).uniq
                ).order("name ASC")

      @data[:centers] = centers.map{ |o| { id: o.id, name: o.name } }

      # Setup officers
      @data[:officers]  = User.where(id: centers.pluck(:user_id).uniq).order("last_name ASC").map{ |o|
                            {
                              id: o.id,
                              first_name: o.first_name,
                              last_name: o.last_name,
                              full_name: "#{o.last_name}, #{o.first_name}"
                            }
                          }

      @data
    end
  end
end
