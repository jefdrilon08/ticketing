module Api
  module V1
    class ClustersController < ApiController
      before_action :authenticate_user!

      def fetch_branches
 
        cluster = @clusters.select{ |o| o[:id] == params[:id] }.first
        
        branches = Branch.where(cluster_id: cluster[:id]).order("name ASC").map{ |c| { id: c.id, name:  c.name } }

        render json: { branch: branches }
      end
    
      def index
        clusters  = Cluster.all.order("name ASC")

        data  = []

        clusters.each do |o|
          branches = []

          o.branches.order("name ASC").each do |c|
            branches << {
              id: c.id,
              name: c.name
            }
          end

          data << {
            id: o.id,
            name: o.name,
            branches: branches
          }
        end

        render json: { clusters: data }
      end
    end
  end
end
