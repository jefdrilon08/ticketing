class BorrowTransactionItemsController < ApplicationController
  def index
    @borrow_transaction = BorrowTransaction.find(params[:transaction_id])
    @borrow_transaction_items = @borrow_transaction.borrow_transaction_items
    @branch = @borrow_transaction.branch
    @user = @borrow_transaction.user
    @items = Item.all

    @subheader_side_actions = [
      {
        id: "btn-approve",
        link: "#",
        class: "fas fa-check",
        text: "Approve",
        data: { transaction_id: @borrow_transaction.id }
      }
    ]
  end

  def create
    @borrow_transaction = BorrowTransaction.find(params[:transaction_id])
    @borrow_transaction_item = BorrowTransactionItem.new(borrow_transaction_item_params)
    @borrow_transaction_item.borrow_transaction = @borrow_transaction

    if @borrow_transaction_item.save
      redirect_to borrow_transaction_items_path(@borrow_transaction), notice: 'Item added successfully.'
    else
      @items = Item.all
      render :index, alert: 'Failed to add item.'
    end
  end

  def update_status
    @transaction_item = BorrowTransactionItem.find(params[:id])
    
    if @transaction_item.update(status: 'returned', return_date: Date.today)
      render json: { success: true, return_date: @transaction_item.return_date.strftime("%Y-%m-%d") }
    else
      render json: { success: false }
    end
  end

  def approve
    transaction_id = params[:id]  
    borrow_transaction = BorrowTransaction.find_by(id: transaction_id)
  
    if borrow_transaction
      if borrow_transaction.update(status: 'approved')
        render json: { success: true, message: 'Transaction approved successfully!' }
      else
        render json: { success: false, message: 'Failed to approve transaction.' }
      end
    else
      render json: { success: false, message: 'Transaction not found.' }, status: 404
    end
  end

  private

  def borrow_transaction_item_params
    params.require(:borrow_transaction_item).permit(:item_id, :quantity)
  end
end
