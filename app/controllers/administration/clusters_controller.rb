module Administration
  class ClustersController < ApplicationController
    before_action :authenticate_user!
    before_action :load_cluster!, only: [:edit, :show, :update]

    def index
      @clusters  = Cluster.select("*")

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          text: "Clusters"
        }
      ]

      @subheader_side_actions = [
        {
          id: "btn-new",
          link: new_administration_cluster_path,
          class: "fa fa-plus",
          text: "New Cluster"
        }
      ]
    end

    def new
      @cluster = Cluster.new

      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_clusters_path,
          text: "Clusters"
        },
        {
          text: "New"
        }
      ]

      @subheader_side_actions = []
    end

    def create
      @cluster = Cluster.new(cluster_params) 

      if @cluster.save
        redirect_to administration_cluster_path(@cluster)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_clusters_path,
            text: "Clusters"
          },
          {
            text: "New"
          }
        ]

        @subheader_side_actions = []
        render :new
      end
    end

    def edit
      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_clusters_path,
          text: "Clusters"
        },
        {
          text: "Edit: #{@cluster.name}"
        }
      ]

      @subheader_side_actions = []
    end

    def update
      if @cluster.update(cluster_params)
        redirect_to administration_cluster_path(@cluster)
      else
        @subheader_items = [
          {
            text: "Administration"
          },
          {
            is_link: true,
            path: administration_clusters_path,
            text: "Clusters"
          },
          {
            text: "Edit: #{@cluster.name}"
          }
        ]

        @subheader_side_actions = []

        render :edit
      end
    end

    def show
      @subheader_items = [
        {
          text: "Administration"
        },
        {
          is_link: true,
          path: administration_clusters_path,
          text: "Clusters"
        },
        {
          text: "#{@cluster.name}"
        }
      ]

      @subheader_side_actions = []
    end

    private

    def load_cluster!
      @cluster = Cluster.find(params[:id])
    end

    def cluster_params
      params.require(:cluster).permit!
    end
  end
end
