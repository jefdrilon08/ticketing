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
      .order(:branch_id, :mr_number)
      .page(params[:page]).per(20)
    @branches = Branch.all.index_by(&:id)
    @users = User.all.index_by(&:id)
    
  end
end