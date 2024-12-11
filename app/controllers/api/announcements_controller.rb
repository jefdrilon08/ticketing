module Api
  class AnnouncementsController < ::Api::FrontController
    before_action :authenticate_user!, except: [:index, :show]
    before_action :authenticate_user_or_member!, only: [:index, :show]

    def index
      announcements = Announcement.select("id, title, announced_at, is_published");

      data  = announcements.map{ |o|
                {
                  id: o.id,
                  title: o.title,
                  announced_at: o.announced_at.strftime("%b %d, %Y"),
                  is_published: o.is_published,
                  file_banner: o.file_banner.url
                }
              }

      render json: { announcements: data }
    end

    def show
      announcement = Announcement.find(params[:id])

      data = {
        id:           announcement.id,
        title:        announcement.title,
        content:      announcement.content,
        is_published: announcement.is_published,
        announced_at: announcement.announced_at.strftime("%b %d, %Y"),
        file_banner:  announcement.file_banner.url
      }

      render json: { announcement: data }
    end

    def create
      payload = JSON.parse(params[:payload]).with_indifferent_access

      title         = payload[:title]
      announced_at  = payload[:announced_at]
      branch        = ReadOnlyBranch.find_by_id(payload[:branch_id])
      content       = payload[:content]

      validator = ::Announcements::ValidateCreate.new(
                    title:        title,
                    announced_at: announced_at,
                    content:      content,
                    file_banner:  params[:file_banner]
                  )

      validator.execute!

      if validator.errors.any?
        render json: { errors: validator.errors }, status: :unprocessable_entity
      else
        cmd = ::Announcements::Create.new(
                title:        title,
                announced_at: announced_at,
                branch:       branch,
                content:      content,
                user:         @user,
                file_banner:  params[:file_banner]
              )

        cmd.execute!

        render json: { id: cmd.announcement.id }
      end
    end
  end
end
