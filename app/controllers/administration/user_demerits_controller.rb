module Administration
  class UserDemeritsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_user!
    before_action :load_object!, only: [:show, :edit, :update, :destroy]

    def index
      @user_demerits  = UserDemerit.where(user_id: @user.id)
    end

    def new
      @user_demerit = UserDemerit.new(date_of_action: Date.today, demerit_type: 'verbal', branch: @branches.first, role: @user.roles.last)

      @subheader_items = [
        { text: "Administration" },
        { text: "Users", is_link: true, path: administration_users_path },
        { text: "#{@user.full_name}", is_link: true, path: administration_user_path(@user) },
        { text: "New Demerit" }
      ]
    end

    def create
      @user_demerit       = UserDemerit.new(user_demerit_params)
      @user_demerit.user  = @user
      
      @user_demerit.data  = {
        prepared_by: {
          id: current_user.id,
          first_name: current_user.first_name,
          last_name: current_user.last_name
        }
      }

      if @user_demerit.save
        redirect_to administration_user_user_demerit_path(@user, @user_demerit)
      else
        @subheader_items = [
          { text: "Administration" },
          { text: "Users", is_link: true, path: administration_users_path },
          { text: "#{@user.full_name}", is_link: true, path: administration_user_path(@user) },
          { text: "New Demerit" }
        ]

        render :new
      end
    end

    def edit
      @subheader_items = [
        { text: "Administration" },
        { text: "Users", is_link: true, path: administration_users_path },
        { text: "#{@user.full_name}", is_link: true, path: administration_user_path(@user) },
        { text: "Edit" }
      ]
    end

    def update
      if @user_demerit.update(user_demerit_params)
        redirect_to administration_user_user_demerit_path(@user, @user_demerit)
      else
        @subheader_items = [
          { text: "Administration" },
          { text: "Users", is_link: true, path: administration_users_path },
          { text: "#{@user.full_name}", is_link: true, path: administration_user_path(@user) },
          { text: "Edit" }
        ]

        render :edit
      end
    end

    def show
      @subheader_items = [
        { text: "Administration" },
        { text: "Users", is_link: true, path: administration_users_path },
        { text: "#{@user.full_name}", is_link: true, path: administration_user_path(@user) },
        { text: "#{@user_demerit.id}" }
      ]

      @subheader_side_actions = []

      if @user_demerit.pending?
        @subheader_side_actions << {
          id: "btn-approve",
          class: "fa fa-check",
          text: "Approve",
          link: "#"
        }

        @subheader_side_actions << {
          id: "#",
          class: "fa fa-pencil-alt",
          text: "Edit",
          link: edit_administration_user_user_demerit_path(@user, @user_demerit)
        }

        @subheader_side_actions << {
          id: "#",
          class: "fa fa-times",
          text: "Delete",
          link: administration_user_user_demerit_path(@user, @user_demerit),
          data: {
            method: :delete,
            confirm: "Are you sure?"
          }
        }
      end

      @payload = {
        id: @user_demerit.id
      }
    end

    def destroy
      if !@user_demerit.pending?
        redirect_to administration_user_user_demerit_path(@user, @user_demerit)
      end

      @user_demerit.destroy!

      redirect_to administration_user_path(@user)
    end

    private

    def load_object!
      @user_demerit = UserDemerit.find(params[:id])
    end

    def user_demerit_params
      params.require(:user_demerit).permit!
    end

    def load_user!
      @user   = User.find(params[:user_id])
    end
  end
end
