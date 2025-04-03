class ItemDistributionsController < ApplicationController
  before_action :set_item_distribution, only: [:show, :edit, :update, :destroy]
  before_action :load_dropdown_data, only: [:new, :create, :edit, :update]
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

  def index
    # Fetch all item distributions without associations
    @item_distributions = ItemDistribution.all
  end

  def new
    @item_distribution = ItemDistribution.new
  end

  def show; end

  def create
    @item_distribution = ItemDistribution.new(item_distribution_params)
    puts "Submitted Parameters: #{item_distribution_params.inspect}" # Debugging line
    if @item_distribution.save
      redirect_to item_distributions_path, notice: 'Item distribution created successfully.'
    else
      flash.now[:alert] = 'Failed to create item distribution. Please check the errors below.'
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @item_distribution.update(item_distribution_params)
      redirect_to item_distributions_path, notice: 'Item distribution updated successfully.'
    else
      flash.now[:alert] = 'Failed to update item distribution. Please check the errors below.'
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    if @item_distribution.destroy
      redirect_to item_distributions_path, notice: 'Item distribution was successfully deleted.'
    else
      redirect_to item_distributions_path, alert: 'Failed to delete item distribution.'
    end
  end

  private

  # Find the item distribution by ID, handle errors if not found
  def set_item_distribution
    @item_distribution = ItemDistribution.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    handle_record_not_found
  end

  # Strong parameters to whitelist allowed fields
  def item_distribution_params
    params.require(:item_distribution).permit(:item_table, :branch_id, :employee_id, :quantity, :distributed_by, :receive_by).tap do |whitelisted|
      # Replace UUIDs with names before saving
      whitelisted[:item_table] = Item.find_by(id: whitelisted[:item_table])&.name if whitelisted[:item_table].present?
      whitelisted[:branch_id] = Branch.find_by(id: whitelisted[:branch_id])&.name if whitelisted[:branch_id].present?
      whitelisted[:employee_id] = User.find_by(id: whitelisted[:employee_id])&.first_name if whitelisted[:employee_id].present?
    end
  end

  # Load dropdown data for items, branches, and employees
  def load_dropdown_data
    @items = Item.order(:name)
    @branches = Branch.order(:name)
    @employees = User.order(:first_name)
  end

  # Handle record not found errors gracefully
  def handle_record_not_found
    redirect_to item_distributions_path, alert: 'Item distribution not found.'
  end
end