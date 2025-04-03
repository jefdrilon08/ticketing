class BorrowTransaction < ApplicationRecord
  belongs_to :user
  belongs_to :branch  

  has_many :borrow_transaction_items, dependent: :destroy
 
  def as_json(options = {})
  super(options.merge(methods: [:formatted_request_date]))
  end

  def formatted_request_date
  request_date.strftime("%Y-%m-%d")
  end
end
