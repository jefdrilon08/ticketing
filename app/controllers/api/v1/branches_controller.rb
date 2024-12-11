module Api
  module V1
    class BranchesController < ApiController
      before_action :authenticate_user!, except: [:list_centers, :index]
      before_action :authenticate_app_request!, only: [:list_centers]

      def list_centers
        if params[:id].blank?
          render json: { message: "id required" }, status: 400
        else
          centers = Center.where(branch_id: params[:id])

          render json: { centers: centers.map{ |o| { id: o.id, name: o.name } } }
        end
      end

      def fetch_centers_for_restructure
        #branch  = @branches.where(id: params[:id]).first
        branch = @branches.select{ |o| o[:id] == params[:id] }.first

        if branch.present?
          centers = Center.where(branch_id: branch[:id]).order("name ASC").map{ |c| 
                      members = []

                      if params[:with_members].present?
                        members = Member.joins(:loans).where("loans.center_id = ? and loans.loan_product_id = ?", c.id, "1c2fcdbd-d60b-402c-b04b-824bb90958d1").order("last_name ASC").map{ |m|
                                    {
                                      id: m.id,
                                      last_name: m.last_name,
                                      first_name: m.first_name,
                                      middle_name: m.middle_name,
                                      full_name: m.full_name
                                    }
                                  }
                      end

                      { 
                        id: c.id, 
                        name:  c.name,
                        members: members
                      }
                    }
        else
          centers = []  
        end

        render json: { centers: centers }
      end

      def update_current_date
        branch  = Branch.find(params[:id])
        branch.update!(current_date: params[:current_date])

        render json: { message: "ok" }
      end

      def index
        if params[:b].present?
          branches = current_user
            .branches
            .where(user_branches: { active: true })
            .map do |b|
              {
                id:      b.id,
                name:    b.name
              }
            end

          render json: { branches: branches }
        else
          branches = current_user
            .branches
            .includes(:centers)
            .where(user_branches: { active: true })
            .map do |b|
              {
                id:      b.id,
                name:    b.name,
                centers: b.centers.order("name ASC").map { |c| { id: c.id, name: c.name } },
              }
            end

          render json: { branches: branches }
        end
      end

      def fetch_centers
        #branch  = @branches.where(id: params[:id]).first
        branch = @branches.select{ |o| o[:id] == params[:id] }.first

        if branch.present?
          centers = Center.where(branch_id: branch[:id]).order("name ASC").map{ |c| 
                      members = []

                      if params[:with_members].present?
                        members = Member.active.where(center_id: c.id).order("last_name ASC").map{ |m|
                                    {
                                      id: m.id,
                                      last_name: m.last_name,
                                      first_name: m.first_name,
                                      middle_name: m.middle_name,
                                      full_name: m.full_name
                                    }
                                  }
                      end

                      { 
                        id: c.id, 
                        name:  c.name,
                        members: members
                      }
                    }
        else
          centers = []  
        end

        render json: { centers: centers }
      end

      def stats
        branch  = Branch.where(id: @branches.pluck(:id)).where(id: params[:id]).first
        as_of   = params[:as_of].try(:to_date)

        if as_of.blank?
          as_of = Date.today
        end

        if branch.blank?
          render json: { errors: ["not found"] }, status: 400
        else
          data_store  = DataStore.where(
                          "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS date) = ?",
                          branch.id,
                          as_of
                        ).last

          if data_store.blank?
            config  = {
              branch: branch,
              as_of: as_of
            }

            data_store  = ::DataStores::SaveBranchLoansStats.new(
                            config: config
                          ).execute!
          end

          render json: data_store.data
        end
      end
    end
  end
end
