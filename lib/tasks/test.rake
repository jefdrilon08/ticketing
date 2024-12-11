namespace :test do
  # Test for payment upload
  # Endpoint: https://us-central1-rms-kmba.cloudfunctions.net/apiTest/payment/upload
  # Required structure:
  #  {
  #    "memberNumber": "TEST1234789", <Member Number> <REQUIRED>
  #    "amountPaid": 80, <Amount of Payment> <REQUIRED>
  #    "branch": "Test Branch", <Branch> <REQUIRED>
  #    "datePlacedPayment": "9/1/2021", <Date of Payment> <REQUIRED>
  #    "paymentType": "Contribution", <Type of Payment> <”Life Insurance Fund” or “Retirement Fund”> <REQUIRED>
  #    "paymentRefNo": "SAMPLEREF0123412", <Payment Reference #> <REQUIRED>
  #    "paymentChannel": "Bank Transfer", <Payment Channel> <REQUIRED>
  #    "orDate": "8/1/2021", <OR Date> <REQUIRED>
  #    "description": "Sample Description", <Payment Description> <REQUIRED>
  #    "externalRef": "SAMPLE000002P" <External Reference> <REQUIRED>
  #  }
  task :kazer_payment_api_upload => :environment do
    ENDPOINT = ENV['ENDPOINT'] || "https://us-central1-rms-kmba.cloudfunctions.net/apiTest/payment/upload"

    # Get a transaction from the database based on ID passed to task. Always assume deposit
    account_transaction = AccountTransaction.where(transaction_type: "deposit").find(ENV['ID'])
    member_account      = MemberAccount.find(account_transaction.subsidiary_id)
    member              = member_account.member
    branch              = member.branch

    # Mapped parameters

    # Map the payload according to the data
    payload = {
      memberNumber:       "12345",
      amountPaid:         account_transaction.amount,
      branch:             branch.name,
      datePlacedPayment:  account_transaction.transacted_at.strftime("%m/%d/%Y"),
      paymentType:        member_account.account_subtype,
      paymentRefNo:       account_transaction.id,
      paymentChannel:     "Bank Transfer",
      orDate:             account_transaction.transacted_at.strftime("%m/%d/%Y"),
      description:        "Test transaction",
      externalRef:        account_transaction.id
    }

    result  = HTTParty.post(
                ENDPOINT,
                :body => payload.to_json,
                :headers => { 'Content-Type' => 'application/json' }
              )

    puts(result)
  end
end
