module Administration
  class BranchesController < ApplicationController
    def index
      if current_user.is_mis?
        # Load all branches with their associated center counts
        sql = "
          SELECT 
            branches.*, 
            count(centers.*) AS center_count
          FROM branches 
          LEFT JOIN centers
          ON centers.branch_id = branches.id
          GROUP BY branches.id
          ORDER BY branches.name ASC
        "
        @branches = Branch.find_by_sql(sql)
      else
        # Load branches specific to the current user
        ids = ReadOnlyUserBranch.where(active: true, user_id: current_user.id).pluck(:branch_id)

        if ids.empty?
          @branches = [] # Return an empty array if no branches are found
        else
          sql = "
            SELECT 
              branches.*, 
              count(centers.*) AS center_count
            FROM branches 
            LEFT JOIN centers
            ON centers.branch_id = branches.id
            WHERE branches.id IN (#{ids.map { |id| "'#{id}'" }.join(',')})
            GROUP BY branches.id
            ORDER BY branches.name ASC
          "
          @branches = Branch.find_by_sql(sql)
        end
      end

      # Load other administration entities
      @users = User.all
      @computer_systems = ComputerSystem.all
      @items = Item.all
      @item_categories = ItemCategory.all
      @suppliers = Supplier.all

      # Subheader items for navigation
      @subheader_items = [
        { text: "Administration" },
        { text: "Branches" }
      ]
    end
  end
end