module Branches
  class ValidateUpdateCoordinates
    attr_accessor :errors

    def initialize(branch:, lat:, lon:)
      @branch = branch
      @lat    = lat
      @lon    = lon

      @errors = []
    end

    def execute!
      if @branch.blank?
        @errors << "Branch not found"
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
