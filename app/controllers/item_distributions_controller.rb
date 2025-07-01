class ItemDistributionsController < ApplicationController

  def index
    @item_distributions = ItemDistribution.all

    # if params[:mr_number].present?
    #   @item_distributions = @item_distributions.where("mr_number ILIKE ?", "%#{params[:mr_number]}%")
    # end

    if params[:branch_id].present?
      @item_distributions = @item_distributions.where(branch_id: params[:branch_id])
    end

    if params[:item_id].present?
      @item_distributions = @item_distributions.where(item_id: params[:item_id])
    end

    if params[:distributed_by].present?
      @item_distributions = @item_distributions.where(distributed_by: params[:distributed_by])
    end

    @item_distributions = @item_distributions
      .includes(:item)
      .joins(:item)
      .joins('LEFT JOIN branches ON branches.id = item_distributions.branch_id')
      .order(:status, 'items.name', 'branches.name', :distributed_by)
      .page(params[:page]).per(20)

    @branches = Branch.all.index_by(&:id)

    item_ids = ItemDistribution.distinct.pluck(:item_id)
    @filter_items = Item.where(id: item_ids).order(:name).group_by(&:name).map { |_, items| items.first }

    distributor_ids = ItemDistribution.distinct.pluck(:distributed_by)
    @filter_distributors = User.where(id: distributor_ids).order(:first_name, :last_name)

    @users = User.all.index_by(&:id)
  end

  def show
    
    @item_distribution = ItemDistribution.find(params[:id])
    @item = Item.find_by(id: @item_distribution.item_id)
    @branches = Branch.all.index_by(&:id)
    @users = User.all.index_by(&:id)
    @branch = @branches[@item_distribution.branch_id]
    @receive_by_user = @users[@item_distribution.receive_by]
    @distributed_by_user = @users[@item_distribution.distributed_by]
    @distributors = User.all.select { |u| (u.roles & ["MIS", "OAS"]).any? }

    @subheader_side_actions = []

    unless ["void", "approved"].include?(@item_distribution.status.to_s.downcase)
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
      :mr_number,
      :inventory_number,
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
end