class ItemDistributionsController < ApplicationController

  def index
    @item_distributions = ItemDistribution.all

    if params[:mr_number].present?
      @item_distributions = @item_distributions.where("mr_number ILIKE ?", "%#{params[:mr_number]}%")
    end

    if params[:branch_id].present?
      @item_distributions = @item_distributions.where(branch_id: params[:branch_id])
    end

    @item_distributions = @item_distributions
      .includes(:item)
      .order(:status, :branch_id, :mr_number)
      .page(params[:page]).per(20)
    @branches = Branch.all.index_by(&:id)
    @users = User.all.index_by(&:id)
    
  end

  def approve
    @item_distribution = ItemDistribution.find(params[:id])
    @item_distribution.update(status: "approved")
    # Set the associated item's status to "Active"
    if @item_distribution.item_id.present?
      item = Item.find_by(id: @item_distribution.item_id)
      item.update(status: "Active") if item
    end
    redirect_to item_distributions_path, notice: "Distribution approved!"
  end

  def void
    @item_distribution = ItemDistribution.find(params[:id])
    @item_distribution.update(status: "void")
    # Set the associated item's status to "Pending"
    if @item_distribution.item_id.present?
      item = Item.find_by(id: @item_distribution.item_id)
      item.update(status: "Pending") if item
    end
    redirect_to item_distributions_path, alert: "Distribution voided!"
  end
end