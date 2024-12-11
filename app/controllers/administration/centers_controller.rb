module Administration
  class CentersController < ApplicationController
    before_action :authenticate_user!

    def index

      @officer  = User.where(roles: ["","SO"]).order("last_name ASC")
      @centers  = Center.limit(20).includes(:branch, :user).where(branch_id: @branches.pluck(:id))
      @center_select = Center.all


      if params[:branch].present?
        @centers = Center.where(branch_id: params[:branch])
       
      end

      if params[:center].present?
        @centers = Center.where(id: params[:center])
      end

      if params[:branch].present?
        @centers = Center.where(branch_id: params[:branch])
      end

      if params[:user].present?
        @centers = Center.where(user_id: params[:user])
      end


      if params[:branch].present? and params[:user].present?
        @centers = Center.where(user_id: params[:user], branch_id: params[:branch])
      end


      @centers_page  = @centers.order("name ASC").page(params[:page]).per(LIST_PAGE_SIZE)

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          text: "Centers"
        }
      ]

      @subheader_side_actions = [
        {
          id: "btn-new",
          link: new_administration_center_path,
          class: "fa fa-plus",
          text: "New Center"
        }
      ]
    end

    def new
      @center = Center.new

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_centers_path,
          text: "Centers"
        },
        {
          text: "New"
        }
      ]
    end

    def create
      @center = Center.new(center_params)

      if @center.save
        redirect_to administration_center_path(@center)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_centers_path,
            text: "Centers"
          },
          {
            text: "New"
          }
        ]

        render :new
      end
    end

    def edit
      @center = Center.find(params[:id])

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_centers_path,
          text: "Centers"
        },
        {
          text: "Edit #{@center.name}"
        }
      ]
    end

    def update
      @center = Center.find(params[:id])

      if @center.update(center_params)
         Loan.where("center_id =? and status IN (?)", params[:id], ["active","pending"]).update(user_id: params[:user_id])

        redirect_to administration_center_path(@center)

      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_centers_path,
            text: "Centers"
          },
          {
            text: "Edit #{@center.name}"
          }
        ]

        render :edit
      end
    end

    def show
      @center = ReadOnlyCenter.find(params[:id])

      cmd = ::Centers::BuildCenterHash.new(
        center: @center
      )

      cmd.execute!

      @payload = {
        token: current_user.generate_jwt,
        data: cmd.data
      }
    end

    def destroy
      @center = Center.find(params[:id])
      @center.destroy!
      flash[:success] = "Successfully removed center"
      redirect_to administration_branch_path(@center.branch)
    end

    private

    def load_user!
      @center = Center.find(params[:id])
    end

    def center_params
      params.require(:center).permit!
    end
  end
end
