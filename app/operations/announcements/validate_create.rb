module Announcements
  class ValidateCreate
    attr_accessor :title,
                  :announced_at,
                  :content,
                  :file_banner,
                  :errors

    def initialize(title:, announced_at:, content:, file_banner:)
      @title        = title
      @content      = content
      @announced_at = announced_at
      @file_banner  = file_banner

      @errors = {}
    end

    def execute!
      if @title.blank?
        @errors['title'] = 'Title required'
      end

      if @content.blank?
        @errors['content'] = 'Content required'
      end

      if @announced_at.blank?
        @errors['announced_at'] = 'Announced date required'
      end

      if @file_banner.blank?
        @errors['file_banner'] = 'Banner required'
      end
    end
  end
end
