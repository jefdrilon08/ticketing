module Centers
  class BuildCenterHash
    attr_accessor :center,
                  :data

    def initialize(center:)
      @center = center

      @data = {
        id:                   @center.id,
        branch:               @center.branch.to_s,
        branch_id:            @center.branch_id,
        name:                 @center.name,
        user:                 @center.user.to_s,
        meeting_day_display:  @center.meeting_day_display,
        lat:                  @center.lat || 14.6091,
        lon:                  @center.lon || 121.0223
      }
    end

    def execute!

      @data
    end
  end
end
