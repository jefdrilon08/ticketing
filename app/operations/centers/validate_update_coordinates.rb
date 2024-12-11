module Centers
  class ValidateUpdateCoordinates
    attr_accessor :errors

    def initialize(center:, lat:, lon:)
      @center = center
      @lat    = lat
      @lon    = lon

      @errors = []
    end

    def execute!
      if @center.blank?
        @errors << "Center not found"
      end

      if @lat.blank?
        @errors << "lat required"
      end

      if @lon.blank?
        @errors << "lon required"
      end

      @errors
    end
  end
end
