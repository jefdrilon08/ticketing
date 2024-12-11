module Administration
  class AreasController < ApplicationController
    before_action :authenticate_user!

    def index
      @areas  = Area.select("*")

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          text: "Areas"
        }
      ]

      @subheader_side_actions = [
        {
          id: "btn-new",
          link: new_administration_area_path,
          class: "fa fa-plus",
          text: "New Area"
        }
      ]
    end

    def new
      @area = Area.new

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_areas_path,
          text: "Areas"
        },
        {
          text: "New Area"
        }
      ]

      @subheader_side_actions = []
    end

    def create
      @area = Area.new(area_params)

      if @area.save
        redirect_to administration_area_path(@area)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_areas_path,
            text: "Areas"
          },
          {
            text: "New Area"
          }
        ]

        @subheader_side_actions = []

        render :new
      end
    end

    def edit
      @area = Area.find(params[:id])

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_areas_path,
          text: "Areas"
        },
        {
          text: "Edit: #{@area.name}"
        }
      ]

      @subheader_side_actions = []
    end

    def update
      @area = Area.find(params[:id])

      if @area.update(area_params)
        redirect_to administration_area_path(@area)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_areas_path,
            text: "Areas"
          },
          {
            text: "Edit: #{@area.name}"
          }
        ]

        @subheader_side_actions = []

        render :edit
      end
    end

    def show
      @area = Area.find(params[:id])

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_areas_path,
          text: "Areas"
        },
        {
          text: "Edit: #{@area.name}"
        }
      ]

      @subheader_side_actions = []
    end

    private

    def load_user!
      @area = Area.find(params[:id])
    end

    def area_params
      params.require(:area).permit!
    end
  end
end
