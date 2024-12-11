module Administration
  class AnnouncementsController < ApplicationController
    before_action :authenticate_user!

    def index
      @announcements  = Announcement.select("*")

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          text: "Announcements"
        }
      ]

      @subheader_side_actions = [
        {
          id: "btn-new",
          link: new_administration_announcement_path,
          class: "fa fa-plus",
          text: "New Announcement"
        }
      ]
    end

    def new
      @announcement = Announcement.new

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_announcements_path,
          text: "Announcements"
        },
        {
          text: "New Announcement"
        }
      ]

      @subheader_side_actions = []
    end

    def create
      @announcement = Announcement.new(announcement_params)
      @announcement.user_id = current_user.id

      if @announcement.save
        redirect_to administration_announcement_path(@announcement)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_announcements_path,
            text: "Announcements"
          },
          {
            text: "New Announcement"
          }
        ]

        @subheader_side_actions = []

        render :new
      end
    end

    def edit
      @announcement = Announcement.find(params[:id])

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_announcements_path,
          text: "Announcements"
        },
        {
          text: "Edit Announcement #{@announcement.title}"
        }
      ]

      @subheader_side_actions = []
    end

    def update
      @announcement = Announcement.find(params[:id])

      if @announcement.update(announcement_params)
        redirect_to administration_announcement_path(@announcement)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_announcements_path,
            text: "Announcements"
          },
          {
            text: "Edit Announcement #{@announcement.title}"
          }
        ]

        @subheader_side_actions = []

        render :edit
      end
    end

    def show
      @announcement = Announcement.find(params[:id])

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_announcements_path,
          text: "Announcements"
        },
        {
          text: "#{@announcement}"
        }
      ]

      @subheader_side_actions = [
        {
          id: "",
          text: "Edit",
          class: "fa fa-pencil-alt",
          link: edit_administration_announcement_path(@announcement)
        }
      ]
    end

    private

    def load_user!
      @announcement = Announcement.find(params[:id])
    end

    def announcement_params
      params.require(:announcement).permit!
    end
  end
end
