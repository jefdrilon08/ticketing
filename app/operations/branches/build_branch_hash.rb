module Branches
  class BuildBranchHash
    attr_accessor :branch,
                  :data

    def initialize(branch:)
      @branch = branch

      @data = {
        id:             @branch.id,
        name:           @branch.name,
        color:          @branch.color,
        or_prefix:      @branch.or_prefix,
        or_counter:     @branch.or_counter,
        or_current_max: @branch.or_current_max,
        ar_prefix:      @branch.ar_prefix,
        ar_counter:     @branch.ar_counter,
        ar_current_max: @branch.ar_current_max,
        lat:            @branch.lat || 14.6091,
        lon:            @branch.lon || 121.0223
      }
    end

    def execute!
      @data[:centers] = @branch.centers.includes([:user]).order(
        "name ASC"
      ).map{ |center|
        obj = {
          id:                   center.id,
          name:                 center.name,
          user:                 center.user.to_s,
          meeting_day_display:  center.meeting_day_display,
          member_count:         center.members.active.count
        }
      }

      @data
    end
  end
end
