module Administration
  class UsersController < ApplicationController
    before_action :authenticate_user!
    before_action :load_user!, only: [:show, :edit]

    def index
      @subheader_side_actions = [
        {
          id: "btn-new",
          link: new_administration_user_path,
          class: "fa fa-plus",
          text: "New User"
        }
      ]

      render 'pages/react_root'
    end

    def new
      @payload = {
        roles: User::ROLES
      }

      render 'pages/react_root'
    end

    def edit
      @payload = {
        roles: User::ROLES,
        id: params[:id]
      }

      render 'pages/react_root'
    end

    def show
      @payload = {
        id: @user.id
      }

      render 'pages/react_root'
    end

    private

    def load_user!
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit!
    end
  end
end
