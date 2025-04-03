class BorrowTransactionsController < ApplicationController
  before_action :authenticate_user!

  def index
    @borrow_transactions = BorrowTransaction.all
    @branches = Branch.all 

    @subheader_side_actions = [
      {
        id: "btn-new-borrow",  
        link: "#",
        class: "fa fa-plus",
        text: "New"
      }
    ]
  end

  def create
    request_date = Date.strptime(params[:borrow_transaction][:request_date], "%Y/%m/%d") rescue nil

    if request_date.nil?
      render json: { messages: ["Invalid date format."] }, status: :unprocessable_entity
      return
    end

    @borrow_transaction = current_user.borrow_transactions.new(borrow_transaction_params)
    @borrow_transaction.request_date = request_date 

    if @borrow_transaction.save
      render json: { message: "Borrow transaction created successfully!" }, status: :ok
    else
      render json: { messages: @borrow_transaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @borrow_transaction = BorrowTransaction.find(params[:id])
    if @borrow_transaction.update(borrow_transaction_params)
      render json: { message: "Borrow transaction updated successfully!" }, status: :ok
    else
      render json: { messages: @borrow_transaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete
    @transaction = BorrowTransaction.find_by(id: params[:id])
    
    if @transaction
      @transaction.destroy
      render json: { message: 'Borrow Transaction successfully deleted.' }, status: :ok
    else
      render json: { messages: ['Transaction not found.'] }, status: :not_found
    end
  end

  private
  
  def borrow_transaction_params
    params.require(:borrow_transaction).permit(:branch_id, :request_date, :status)
  end
end
