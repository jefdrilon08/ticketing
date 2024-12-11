module Api
  module V1
    class CentersController < ApiController
      before_action :authenticate_user!, except: [:process_centers_file]

      def assign_officer
        officer = User.where(id: params[:officer_id]).first
        center  = Center.where(id: params[:id]).first

        config = {
          user: current_user,
          officer: officer,
          center: center
        }

        errors  = ::Centers::ValidateAssignOfficer.new(
                    config: config
                  ).execute! 

        if errors[:messages].any?
          render json: errors, status: 400
        else
          ::Centers::AssignOfficer.new(
            config: config
          ).execute!

          render json: { message: "ok" }
        end
      end

      def index
        branches  = Branch.where(
                      id: UserBranch.active.where(
                        user_id: current_user.id
                      ).pluck(:branch_id)
                    ).order("name ASC")

        centers = Center.where("branch_id IN (?)", branches.id).order("name ASC")

        data  = []

        centers.find_each(batch_size: 1000) do |o|
          members = []

          o.members.order("last_name ASC").each do |m|
            members << {
              id: m.id,
              name: m.full_name
            }
          end

          data << {
            id: o.id,
            name: o.name,
            members: members
          }
        end

        render json: { centers: data }
      end

      def centers
        centers = Center.where("branch_id IN (?)", @branches.pluck(:id)).order("name ASC")

        if params[:branch_id].present?
          centers = centers.where(branch_id: params[:branch_id])
        end

        if params[:user_id].present?
          centers = centers.where(user_id: params[:user_id])
        end

        data  = []

        centers.order("name ASC").find_each(batch_size: 1000) do |o|
          members = []
          
          records = o.members

          if params[:is_unregistered].present?
            records = o.members.active.where("access_token IS NULL")
          end

          records.order("last_name ASC").each do |m|
            members << {
              id: m.id,
              name: m.full_name
            }
          end

          data << {
            id: o.id,
            name: o.name,
            members: members
          }
        end

        render json: { centers: data }
      end

      def process_centers_file
        actual_url  = params[:actual_url]

        ProcessCentersFile.perform_later({
          actual_url: actual_url
        })

        render json: { message: "ok" }
      end
    end
  end
end
