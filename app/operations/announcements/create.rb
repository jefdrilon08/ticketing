module Announcements
  class Create
    attr_accessor :announcement,
                  :title,
                  :announced_at,
                  :branch,
                  :content,
                  :user

    def initialize(title:, announced_at:, branch:, content:, user:, file_banner:)
      @title        = title
      @announced_at = announced_at
      @branch       = branch
      @content      = content
      @user         = user
      @file_banner  = file_banner
    end

    def execute!
      @announcement = Announcement.new(
                        title:        @title,
                        announced_at: @announced_at,
                        branch:       @branch,
                        content:      @content,
                        user:         @user,
                        file_banner:  @file_banner
                      )

      @announcement.save!

      @announcement
    end
  end
end
