class BorrowTransactionItem < ApplicationRecord
  belongs_to :borrow_transaction
  belongs_to :item

  before_create :set_default_status

  private

  def set_default_status
    self.status ||= 'borrowed'
  end
end
