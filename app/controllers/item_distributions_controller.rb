class ItemDistributionsController < ApplicationController
  before_action :authenticate_user!

  def index
    @item_distributions = ItemDistribution.all

    # if params[:mr_number].present?
    #   @item_distributions = @item_distributions.where("mr_number ILIKE ?", "%#{params[:mr_number]}%")
    # end
    
    if params[:items_category_id].present?
      @item_distributions = @item_distributions.joins(:item).where(items: { items_category_id: params[:items_category_id] })
    end

    if params[:sub_category_id].present?
      @item_distributions = @item_distributions.joins(:item).where(items: { sub_category_id: params[:sub_category_id] })
    end
    if params[:branch_id].present?
      @item_distributions = @item_distributions.where(branch_id: params[:branch_id])
    end

    if params[:item_id].present?
      @item_distributions = @item_distributions.where(item_id: params[:item_id])
    end

    if params[:serial_number].present?
      @item_distributions = @item_distributions.joins(:item).where("items.serial_number ILIKE ?", "%#{params[:serial_number]}%")
    end

    if params[:distributed_by].present?
      @item_distributions = @item_distributions.where(distributed_by: params[:distributed_by])
    end

    if params[:status].present?
      @item_distributions = @item_distributions.where(status: params[:status])
    end

    @item_distributions = @item_distributions
      .includes(item: :items_category)
      .joins(:item)
      .joins('LEFT JOIN items_categories ON items_categories.id = items.items_category_id')
      .joins('LEFT JOIN branches ON branches.id = item_distributions.branch_id')
      .order('items_categories.name, items.date_purchased, item_distributions.status, items.name, branches.name, item_distributions.distributed_by')
      .page(params[:page]).per(20)

    @branches = Branch.all.index_by(&:id)

    item_ids = ItemDistribution.distinct.pluck(:item_id)
    @filter_items = Item.where(id: item_ids).order(:name).group_by(&:name).map { |_, items| items.first }
    
    @items_map = Item.where(id: item_ids).index_by(&:id)
    category_ids = @items_map.values.map(&:items_category_id).compact.uniq
    @categories_map = ItemsCategory.where(id: category_ids).index_by(&:id)

    category_ids = Item.distinct.pluck(:items_category_id).compact
    @filter_categories = ItemsCategory.where(id: category_ids).order(:name)

    sub_category_ids = Item.distinct.pluck(:sub_category_id).compact
    @filter_sub_categories = SubCategory.where(id: sub_category_ids).order(:name)

    distributor_ids = ItemDistribution.distinct.pluck(:distributed_by)
    @filter_distributors = User.where(id: distributor_ids).order(:first_name, :last_name)

    status_vals = ItemDistribution.distinct.pluck(:status).compact.uniq
    @filter_statuses = status_vals.sort

    @users = User.all.index_by(&:id)
  end

  def show
    @item_distribution = ItemDistribution.find(params[:id])
    @item = Item.find_by(id: @item_distribution.item_id)
    @branches = Branch.all.index_by(&:id)
    @users = User.all.index_by(&:id)
    @areas = Area.all.index_by(&:id)
    @clusters = Cluster.all.index_by(&:id)
    @branch = @branches[@item_distribution.branch_id]
    @receive_by_user = @users[@item_distribution.receive_by]
    @distributed_by_user = @users[@item_distribution.distributed_by]
    @distributors = User.all.select { |u| (u.roles & ["MIS", "OAS"]).any? }
    @pull_out_users = User.all.select { |u| (u.roles & ["MIS", "OAS"]).any? }
                      .sort_by { |u| [u.first_name.to_s.downcase, u.last_name.to_s.downcase] }

    @subheader_side_actions = []

    unless ["void", "approved", "pull_out"].include?(@item_distribution.status.to_s.downcase)
      @subheader_side_actions << {
        id: "btn-approve",
        link: approve_item_distribution_path(@item_distribution),
        class: "fa fa-check",
        text: "Approve",
        method: :post,
        data: { confirm: "Are you sure you want to approve this distribution?" }
      }
      @subheader_side_actions << {
        id: "btn-void",
        link: void_item_distribution_path(@item_distribution),
        class: "fa fa-x",
        text: "Void",
        method: :post,
        data: { confirm: "Are you sure you want to void this distribution?" }
      }
    end
    if @item_distribution.status == "approved" || @item_distribution.status == "Approved"
      @subheader_side_actions << {
        id: "btn-transfer",
        link: "#modal-transfer-distribution",
        class: "fa fa-arrow-right",
        text: "Transfer",
        method: :post,
        data: { "bs-toggle" => "modal", "bs-target" => "#modal-transfer-distribution" }
      }
      @subheader_side_actions << {
        id: "btn-pull-out",
        link: "#modal-pull-out",
        class: "fa fa-undo",
        text: "Pull Out",
        method: :post,
        data: { "bs-toggle" => "modal", "bs-target" => "#modal-pull-out" }
      }
    end
    if current_user.id == "8e43afba-c232-4d01-beae-7eae75f2b88c"
      @subheader_side_actions << {
        id: "btn-delete",
        link: "#",
        class: "fa fa-trash",
        data: {
          method: :delete,
          confirm: "Are you sure you want to delete this Item?"
        },
        text: "Delete"
      }
    end
  end

  def approve
    @item_distribution = ItemDistribution.find(params[:id])
    @item_distribution.update(status: "approved")
    if @item_distribution.item_id.present?
      item = Item.find_by(id: @item_distribution.item_id)
      item.update(status: "Active") if item
    end
    redirect_to item_distributions_path, notice: "Distribution approved!"
  end

  def void
    @item_distribution = ItemDistribution.find(params[:id])
    @item_distribution.update(status: "void")
    if @item_distribution.item_id.present?
      item = Item.find_by(id: @item_distribution.item_id)
      item.update(status: "Pending") if item
    end
    redirect_to item_distributions_path, alert: "Distribution voided!"
  end

  def update
    @item_distribution = ItemDistribution.find(params[:id])
    permitted = params.require(:item_distribution).permit(
      :distribute_name,
      :mr_number,
      :inventory_number,
      :area_id,
      :cluster_id,  
      :branch_id,
      :receive_by,
      :distributed_by,
      :distributed_at,
      :attached_mr_sticker
    )
    data = @item_distribution.data || {}
    data["is_sticker_attached"] = (permitted[:attached_mr_sticker].to_s == "true" || permitted[:attached_mr_sticker] == "1")

    @item_distribution.assign_attributes(permitted.except(:attached_mr_sticker))
    @item_distribution.data = data

    if @item_distribution.save
      redirect_to item_distribution_path(@item_distribution), notice: "Distribution updated!"
    else
      flash.now[:alert] = @item_distribution.errors.full_messages.join(", ")
      render :show, status: :unprocessable_entity
    end
  end

  def transfer
    @item_distribution = ItemDistribution.find(params[:id])
    permitted = params.require(:item_distribution).permit(
      :area_id,
      :cluster_id,
      :branch_id,
      :receive_by,
      :distributed_by,
      :distribute_name
    )

    previous_area = Area.find_by(id: @item_distribution.area_id)
    previous_cluster = Cluster.find_by(id: @item_distribution.cluster_id)
    previous_branch = Branch.find_by(id: @item_distribution.branch_id)
    previous_distributed_by_user = User.find_by(id: @item_distribution.distributed_by)
    previous_receive_by_user = User.find_by(id: @item_distribution.receive_by)

    @item_distribution.data ||= {}
    @item_distribution.data["transfer_details"] ||= []

    transfer_record = {
      transfer_date: Time.current.strftime("%Y-%m-%d"),
      previous_area: previous_area&.name || "N/A",
      previous_cluster: previous_cluster&.name || "N/A",
      previous_branch: previous_branch&.name || "N/A",
      previous_distribute_name: @item_distribution.distribute_name,
      previous_distributed_by: "#{previous_distributed_by_user&.first_name} #{previous_distributed_by_user&.last_name}".strip || "N/A",
      previous_receive_by: "#{previous_receive_by_user&.first_name} #{previous_receive_by_user&.last_name}".strip || "N/A"
    }

    @item_distribution.data["transfer_details"] << transfer_record
    @item_distribution.assign_attributes(permitted)

    if @item_distribution.save
      redirect_to item_distribution_path(@item_distribution), notice: "Distribution transferred successfully!"
    else
      flash.now[:alert] = @item_distribution.errors.full_messages.join(", ")
      render :show, status: :unprocessable_entity
    end
  end

  def pull_out
    @item_distribution = ItemDistribution.find(params[:id])
    reason = params[:reason]
    pull_out_by_id = params[:pull_out_by]
    pull_out_by_user = User.find_by(id: pull_out_by_id)
    pull_out_by_name = pull_out_by_user ? "#{pull_out_by_user.first_name} #{pull_out_by_user.last_name}".strip : "N/A"

    pull_out_record = {
      pull_out_date: Time.current.strftime("%Y-%m-%d"),
      pull_out_reason: reason,
      pull_out_by_id: pull_out_by_id,
      pull_out_by_name: pull_out_by_name
    }

    head_office_area_id = "06a78557-bbc4-491a-bef9-b6c2e6938671"
    head_office_cluster_id = "0866e43d-543b-44bb-ba6d-b5605840c3ca"
    head_office_branch_id = "b9659f7e-c4d5-4b8b-be3b-508bd7c6a583"

    @item_distribution.data ||= {}
    @item_distribution.data["pull_out_details"] ||= []
    @item_distribution.data["pull_out_details"] << pull_out_record
    @item_distribution.update(
      status: "pull_out",
      area_id: head_office_area_id,
      cluster_id: head_office_cluster_id,
      branch_id: head_office_branch_id,
      data: @item_distribution.data
    )

    if @item_distribution.item_id.present?
      item = Item.find_by(id: @item_distribution.item_id)
      if item
        item_data = item.data || {}
        item_data["pull_out_details"] ||= []
        item_data["pull_out_details"] << pull_out_record
        item.update(status: "pull_out", data: item_data)
      end
    end

    redirect_to item_distributions_path, notice: "Item distribution pulled out successfully!"
  end

  def destroy
    @item_distribution = ItemDistribution.find(params[:id])
    if @item_distribution.destroy
      redirect_to item_distributions_path, notice: "Item distribution deleted successfully!"
    else
      redirect_to item_distributions_path, alert: "Error deleting item distribution."
    end
  rescue ActiveRecord::InvalidForeignKey, ActiveRecord::DeleteRestrictionError
    redirect_to item_distributions_path, alert: "Unable to delete. This item distribution is being referenced elsewhere."
  end
  
end