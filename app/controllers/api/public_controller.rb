module Api
  class PublicController < ActionController::API
    def save_members
      members = params.permit(:members)
      puts params

      # raise members.permit(:members)

      cmd = ::Kmba::ValidateSaveMembers.new(
        members: members 
      )

      cmd.execute!

      if cmd.errors.length > 0
        render json: { errors: cmd.errors }, status: :unprocessable_entity
      else
        render json: { message: "ok" }
      end
    end

    def areas
      areas = Area.select("id, name")

      areas = areas.order("name ASC").map{ |o|
                {
                  id: o.id,
                  name: o.name
                }
              }

      render json: JSON.pretty_generate(areas: areas.as_json)
    end

    def clusters
      clusters = Cluster.select("id, name, area_id")

      if params[:area_id].present?
        clusters = clusters.where(area_id: params[:area_id])
      end

      clusters  = clusters.order("name ASC").map{ |o|
                    {
                      id: o.id,
                      name: o.name
                    }
                  }

      render json: JSON.pretty_generate(clusters: clusters.as_json)
    end

    def branches
      branches = ReadOnlyBranch.select("id, name, cluster_id")

      if params[:cluster_id].present?
        branches = branches.where(cluster_id: params[:cluster_id])
      end

      branches = branches.order("name ASC").map{ |o|
        {
          id: o.id,
          name: o.name
        }
      }

      if params[:with_centers].present?
        branches = branches.map{ |o|
          o[:centers] = Center.where(branch_id: o[:id]).map{ |center|
            center.to_h
          }

          o
        }
      end

      render json: JSON.pretty_generate(branches: branches.as_json)
    end

    def centers
      if params[:branch_id].blank?
       render json: { errors: { branch_id: 'Branch id required' } }, status: :unprocessable_entity
      else
       centers = Center.select("id, name, branch_id").order("name ASC").map{ |o|
                  {
                    id: o.id,
                    name: o.name,
                    branch_id: o.branch_id
                    }
                  }
 
        render json: JSON.pretty_generate(centers: centers.as_json)
      end
    end

    def api_centers
      branch_id = params[:branch_id]   
      branch_center = Center.select("id, name").where(branch_id:  branch_id)            
      centers  = branch_center.order("name ASC").map{ |o|
                    {
                      center_id: o.id,
                      center_name: o.name,
                    }
                  }

      render json: JSON.pretty_generate(branch_centers: centers.as_json)
    end

    def status_check
      reference_number = params[:reference_number]

      if reference_number.blank?
        render json: { errors: ["reference_number required"] }, status: :unprocessable_entity
      else
        online_application = OnlineApplication.find_by_reference_number(reference_number)

        if online_application.blank?
          render json: { errors: ["online application not found"] }, status: :unprocessable_entity
        else
          render json: { status: online_application.status }
        end
      end
    end
  end
end
