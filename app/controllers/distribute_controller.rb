class DistributeController < ApplicationController
  def index
    @subheader_side_actions = [
      { id: "btn-new", link: new_distribute_path, class: "fa fa-plus", text: "New" }
    ]
    @inventory_distributions = InventoryDistribution.includes(inventory: :item).all
    load_dropdowns
  end

  def new
    @inventory_distribution = InventoryDistribution.new(data: [])
    load_dropdowns

    if params[:inventory_id].present?
      @inventory = Inventory.find(params[:inventory_id])
      @item_name = @inventory.item&.name
      @item_type = @inventory.item&.item_type
      @inventory_id = @inventory.id
    else
      @item_name = nil
      @item_type = nil
      @inventory_id = nil
    end
  end

  def create
    @inventory_distribution = InventoryDistribution.new(inventory_distribution_params)
    @inventory_distribution.distribute_by = current_user.full_name

    @inventory_distribution.data ||=[]

    if @inventory_distribution.inventory_id.blank?
      flash[:error] = "Error distributing: No item selected."
      load_dropdowns
      render :new and return
    end

    if @inventory_distribution.save
      redirect_to distribute_path, notice: "Inventory distributed successfully!"
    else
      load_dropdowns
      render :new
    end
  end

  def edit
    @inventory_distribution = InventoryDistribution.find(params[:id])
    load_dropdowns

    # @inventory_distribution.data ||= []

    @inventory_id = @inventory_distribution.inventory_id
    if @inventory_distribution.inventory
      @item_name = @inventory_distribution.inventory.item&.name
      @item_type = @inventory_distribution.inventory.item&.item_type
    else
      @item_name = nil
      @item_type = nil
    end

    render :new
  end

  def update
    @inventory_distribution = InventoryDistribution.find(params[:id])
    @inventory_distribution.assign_attributes(inventory_distribution_params)
    @inventory_distribution.distribute_by = current_user.full_name

    
    # @inventory_distribution.data ||= []

    if @inventory_distribution.save
      redirect_to distribute_path, notice: "Inventory distribution updated successfully!"
    else
      load_dropdowns
      render :edit
    end
  end

  def destroy
    @inventory_distribution = InventoryDistribution.find(params[:id])
    if @inventory_distribution.destroy
      redirect_to distribute_path, notice: "Inventory distribution deleted successfully!"
    else
      redirect_to distribute_path, alert: "Failed to delete inventory distribution."
    end
  end

  def view
    @inventory_distribution = InventoryDistribution.find_by(id: params[:id])
    if @inventory_distribution.nil?
      logger.debug("No InventoryDistribution found with id: #{params[:id]}")
      redirect_to distribute_path, alert: "No Inventory Distribution found."
    else
      logger.debug("Found InventoryDistribution with id: #{params[:id]}")
    end
  end

  private

  def inventory_distribution_params
    params.require(:inventory_distribution).permit(
      :inventory_id, :mr_number, :cluster_id, :branch_id, :user_id,
      :quantity, :date_distribute, :recieve_by, :distribution_type, :status
    )
  end

  def load_dropdowns
    @clusters = Cluster.all
    @branches = Branch.all
    @users = User.all
    @inventory_items = Inventory.joins(:item)
                                .select('inventories.id, inventories.serial_number, items.name, items.item_type as item_item_type')
  end
end
