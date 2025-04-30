namespace :api do
  # Onlint Applications
  post "/register", to: "online_applications#register"

  # Repayment Rates
  get "/repayment_rates/:id", to: "repayment_rates#show"

  # Manual Aging
  get "/manual_aging/:id", to: "manual_aging#show"

  get "/branch_cash_flow", to: "branch_cash_flow#index"
  post "/branch_cash_flow/generate",to: "branch_cash_flow#generate"
  # PSR Schedules
  post "/psr_schedules/generate", to: "psr_schedules#jefgenerate"
  # Standard API
  post "/public/save_members", to: "public#save_members"

  # API for KEZAR
  post "/receive_api/save_members_api", to: "receive_api#save_members_api"
  post "/receive_api/save_payments_api", to: "receive_api#save_payments_api"
  post "/receive_api/save_claims_api", to: "receive_api#save_claims_api"
  get "/public/api_centers/:branch_id", to: "public#centers"
  get "/yml_values/production_values", to: "yml_values#production_values"

  # Dashboard
  get "/dashboard/branch_markers", to: "dashboard#branch_markers"
  get "/dashboard/overview", to: "dashboard#overview"

  get "/dashboard/disbursement", to: "dashboard#disbursement"
  get "/dashboard/disbursement_data", to: "dashboard#disbursement_data"


  get "/loan_product_types", to: "loan_product_types#index"
  get "/loan_product_taggings", to: "loan_product_taggings#index"
  post "/status_check", to: "public#status_check"
  get "/public/branches", to: "public#branches"
  get "/public/centers", to: "public#centers"
  get "/public/clusters", to: "public#clusters"
  get "/public/areas", to: "public#areas"

  # Users
  post "/login", to: "users#login"
  post "/forgot_password", to: "users#forgot_password"
  post "/users/forgot_password", to: "users#forgot_password"
  post "/users/change_password", to: "users#change_password"

  # Members
  get "/members", to: "members#index"
  post "/members/login", to: "v3/members#login"
  post "/members/change_password", to: "members#change_password"
  get "/members/active_loans", to: "members#active_loans"
  get "/members/total_active_loan_balance", to: "members#total_active_loan_balance"
  get "/members/insurance_fund", to: "members#insurance_fund"
  get "/members/total_equities", to: "members#total_equities"
  get "/members/total_funds", to: "members#total_funds"
  post "/members/apply_online", to: "members#apply_online"
  post "/members/unlock", to: "members#unlock"
  post "/members/balik_kasapi", to: "members#balik_kasapi"
  post "/members/resign", to: "members#resign"
  post "/members/reinstate", to: "members#reinstate"
  post "/members/update_recognition_date", to: "members#update_recognition_date"
  post "/members/claims_copy_pdf", to: "members#claims_copy_pdf"  
  post "/members/is_reclassified", to: "members#is_reclassified"
  post "/members/create_survey", to: "members#create_survey"
  post "/members/update_password", to: "members#update_password"
  post "/members/delete", to: "members#delete"
  post "/members/form_make_payments", to: "members#form_make_payments"
  post "/members/is_member_subscribed", to: "members#is_member_subscribed" # for checking the status of member subscription
  post "/members/update_member_subscription", to: "members#update_member_subscription" # for updating the status of member subscription
  post "/members/verify_code", to: "v3/members#verify_code" # for verification of sms code
  post "/members/member_change_password", to: "v3/members#member_change_password" # for changing of member's password
  get "/members/project_types", to: "v3/members#project_types" # getting the project type and categories
  post "/members/confirmation_changepass", to: "v3/members#confirmation_changepass"
  post "/members/member_change_old_password", to: "v3/members#member_change_old_password"

  # Messages
  post "/messages", to: "messages#create"
  get "/messages", to: "messages#index"
  get "/messages/:id", to: "messages#show"
  post "/messages/:id/reply", to: "messages#reply"
  get "/messages/:id/replies", to: "messages#replies"

  # Branches
  get "/branches", to: "branches#index"
  post "/branches/close", to: "branches#close"
  post "/branches/update_coordinates", to: "branches#update_coordinates"

  # Centers
  post "/centers/update_coordinates", to: "centers#update_coordinates"

  # Announcements
  get "/announcements", to: "announcements#index"
  post "/announcements", to: "announcements#create"
  get "/announcements/:id", to: "announcements#show"

  # Closing Records
  post "/closing_records", to: "closing_records#create"
  get "/closing_records", to: "closing_records#index"
  get "/closing_records/records", to: "closing_records#records"
  post "/closing_records/remove", to: "closing_records#remove"

  # Branch PSR Records
  post "/branch_psr_records/fetch", to: "branch_psr_records#fetch"

  # Exec Reports
  get "/exec_reports/psr_query", to: "exec_reports#psr_query"

  # Loans
  post "/loans/restructure", to: "loans#restructure"

  # Loan Products
  get "/loan_products", to: "loan_products#index"

  namespace :v1 do

    namespace :tickets do
      post "/concern_tickets/create_concern", to: "concern_tickets#create_concern"
      post "/concern_tickets/create_ticket", to: "concern_tickets#create_ticket"
      post "/concern_tickets/add_member_concern_ticket", to: "concern_tickets#add_member_ct"
      post "/concern_tickets/update_assigned_person", to: "concern_tickets#update_assigned_person"
      post "/concern_tickets/edit_concern_type", to: "concern_tickets#edit_concern_type"
      post "concern_tickets/:id/toggle_hold", to: "concern_tickets#toggle_hold"
      # for member status
      patch "/concern_ticket_users/:id/update_member_status", to: "concern_tickets#update_member_status"
      # for javascript
      post "concern_tickets/update_status", to: "concern_tickets#update_status"
    end

    # Process Online Application
    post "/online_applications/process", to: "online_applications#process_application"
    post "/online_applications/reject", to: "online_applications#reject"
    post "/online_applications/verify", to: "online_applications#verify"
    post "/online_applications/assign_branch", to: "online_applications#assign_branch"

    post "/online_loan_applications/verify", to: "online_loan_applications#verify"
    post "/online_loan_applications/for_review", to: "online_loan_applications#for_review"
    post "/online_loan_applications/for_approve", to: "online_loan_applications#for_approve"
    post "/online_loan_applications/approve_loan", to: "online_loan_applications#approve_loan"
    post "/online_loan_applications/change_amount", to: "online_loan_applications#change_amount"
    post "/online_loan_applications/change_loan_tag", to: "online_loan_applications#change_loan_tag"
    post "/online_loan_applications/reject", to: "online_loan_applications#reject"
    post "/online_loan_applications/update_details", to: "online_loan_applications#update_details"
    post "/online_loan_applications/reject_checking", to: "online_loan_applications#reject_checking"
    post "/online_loan_applications/reject_approve", to: "online_loan_applications#reject_approve"
    post "/online_loan_applications/decline", to: "online_loan_applications#decline"
    post "/online_loan_applications/check", to: "online_loan_applications#check"
    post "online_loan_applications/mb_save", to: "online_loan_applications#mb_save"
    
    # Savings Insurance Transfer Collections
    post "/savings_insurance_transfer_collections/save", to: "savings_insurance_transfer_collections#save"
    post "/savings_insurance_transfer_collections/add_member", to: "savings_insurance_transfer_collections#add_member"
    post "/savings_insurance_transfer_collections/remove_member", to: "savings_insurance_transfer_collections#remove_member"
    post "/savings_insurance_transfer_collections/approve", to: "savings_insurance_transfer_collections#approve"
    post "/savings_insurance_transfer_collections/update_particular", to: "savings_insurance_transfer_collections#update_particular"
    post "/savings_insurance_transfer_collections/update_or_ar_number", to: "savings_insurance_transfer_collections#update_or_ar_number"

    # Insurance Loan Bundle Enrollments
    post "/insurance_loan_bundle_enrollments/save", to: "insurance_loan_bundle_enrollments#save"
    post "/insurance_loan_bundle_enrollments/add_member", to: "insurance_loan_bundle_enrollments#add_member"
    post "/insurance_loan_bundle_enrollments/remove_member", to: "insurance_loan_bundle_enrollments#remove_member"
    post "/insurance_loan_bundle_enrollments/approve", to: "insurance_loan_bundle_enrollments#approve"
    post "/insurance_loan_bundle_enrollments/pending", to: "insurance_loan_bundle_enrollments#pending"
    post "/insurance_loan_bundle_enrollments/check", to: "insurance_loan_bundle_enrollments#check"
    post "/insurance_loan_bundle_enrollments/declined", to: "insurance_loan_bundle_enrollments#declined"

    # Accounting Codes
    get "/accounting_codes", to: "accounting_codes#index"

    #Onlinedisbursement
    post "bank_transfer/create",  to: "bank_transfer#create"
    post "bank_transfer/create_channel", to:"bank_transfer#create_channel"

    # Adjustments
    namespace :adjustments do
      post "/subsidiary_adjustments/create", to: "subsidiary_adjustments#create"
      post "/subsidiary_adjustments/approve", to: "subsidiary_adjustments#approve"
      post "/subsidiary_adjustments/destroy", to: "subsidiary_adjustments#destroy"
      post "/subsidiary_adjustments/add_member", to: "subsidiary_adjustments#add_member"
      post "/subsidiary_adjustments/delete_member", to: "subsidiary_adjustments#delete_member"
      post "/subsidiary_adjustments/add_accounting_code", to: "subsidiary_adjustments#add_accounting_code"
      post "/subsidiary_adjustments/delete_accounting_code", to: "subsidiary_adjustments#delete_accounting_code"
      post "/subsidiary_adjustments/update_accounting_entry_particular", to: "subsidiary_adjustments#update_accounting_entry_particular"

      post "/batch_moratorium_adjustments/create", to: "batch_moratorium_adjustments#create"
      post "/batch_moratorium_adjustments/approve", to: "batch_moratorium_adjustments#approve"
      post "/batch_moratorium_adjustments/destroy", to: "batch_moratorium_adjustments#destroy"
      post "/moratoriums/create", to: "moratoriums#create"
      post "/moratoriums/delete", to: "moratoriums#delete"
      post "/moratoriums/process", to: "moratoriums#process_moratorium"
      post "/moratoriums/batch_process", to: "moratoriums#batch_process"
      post "/accrued_interests/create", to: "accrued_interests#create"
      post "/accrued_interests/process", to: "accrued_interests#process_accrued"
      post "/accrued_interests/delete", to: "accrued_interests#delete"
      post "/accrued_interests/batch_process", to: "accrued_interests#batch_process"
      post "/accrued_interests/remove", to: "accrued_interests#remove"
      post "/accrued_interests/erase_record", to: "accrued_interests#erase_record"
      
      
      post "/recompute_restructures/create", to: "recompute_restructures#create"
      post "/recompute_restructures/approve", to: "recompute_restructures#approve"
      post "/recompute_restructures/destroy", to: "recompute_restructures#destroy"
      
      post "/make_payments/approve", to: "make_payments#approve"
      post "/make_payments/destroy", to: "make_payments#destroy"
    end

		post "/administration/member_shares/print", to: "member_shares#print"

    # Users
    get "/roles", to: "users#roles"
    post "/change_password", to: "users#change_password"
    post "/update_profile_picture", to: "users#update_profile_picture"

    # Dashboard
    get "/dashboard", to: "dashboard#index"
    get "/dashboard/overview", to: "dashboard#overview"

    # Dashboard MII
    get "/dashboard_mii", to: "dashboard_mii#index"
    get "/dashboard_mii/overview_mii", to: "dashboard_mii#overview_mii"


    # Monitoring
    get "/monitoring/accounting_entry_subsidiary_balancing", to: "monitoring#accounting_entry_subsidiary_balancing"
    get "/monitoring/accounting_entry_precision", to: "monitoring#accounting_entry_precision"

    # Members
    get "/members", to: "members#index"
    get "/members/search", to: "members#search"
    get "/members/fetch", to: "members#fetch"
    get "/members/fetch_survey_answer", to: "members#fetch_survey_answer"
    get "/members/fetch_resignation_details", to: "members#fetch_resignation_details"
    post "/members/process_resignation", to: "members#process_resignation"
    get "/members/member_co_makers", to: "members#member_co_makers"
    get "/members/member_loan_products", to: "members#member_loan_products"
    post "/members/create_survey", to: "members#create_survey"
    post "/members/delete_survey_answer", to: "members#delete_survey_answer"
    post "/members/generate_access_token", to: "members#generate_access_token"
    post "/members/save_signature", to: "members#save_signature"
    post "/members/save", to: "members#save"
    post "/members/save_survey_answer", to: "members#save_survey_answer"
    post "/members/delete", to: "members#delete"
    post "/members/unlock", to: "members#unlock"
    post "/members/restore", to: "members#restore"
    post "/members/generate_missing_accounts", to: "members#generate_missing_accounts"
    post "/members/change_member_type", to: "members#change_member_type"
    post "/members/change_recognition_date", to: "members#change_recognition_date"
    post "/members/resign", to: "members#resign"
    post "/members/reinstate", to: "members#reinstate"
    post "/members/update_recognition_date", to: "members#update_recognition_date"
    post "/members/claims_copy_pdf", to: "members#claims_copy_pdf"
    post "/members/is_reclassified", to: "members#is_reclassified"
    post "/members/upload_profile_picture", to: "members#upload_profile_picture"
    post "/members/upload_signature", to: "members#upload_signature"
    post "/members/delete_profile_picture", to: "members#delete_profile_picture"
    post "/members/delete_signature", to: "members#delete_signature"
    get "/members/process_members_file", to: "members#process_members_file"
    get "/members/process_beneficiaries_file", to: "members#process_beneficiaries_file"
    get "/members/process_legal_dependents_file", to: "members#process_legal_dependents_file"
    post "/members/save_make_payment", to: "members#save_make_payment"
    get "/risk_profiles/fetch_daily_metric", to: "risk_profiles#fetch_daily_metric"
    get "/risk_profiles/fetch_prev_metric", to: "risk_profiles#fetch_prev_metric"
    get "/members/member_mobile_number", to: "members#member_mobile_number"
    get "/members/mobile_number_exist", to: "members#mobile_number_exist"
    post "members/update_mobile_number", to: "members#update_mobile_number"

    #post "/members_make_payment/save_make_payment", to: "members_make_payment#save_make_payment"
    # Member accounts
    get "/savings_accounts", to: "savings_accounts#index"
    post "/savings_accounts/sync_maintaining_balance", to: "savings_accounts#sync_maintaining_balance"
    post "/savings_accounts/request_time_deposit_withdrawal", to: "savings_accounts#request_time_deposit_withdrawal"
    post "/savings_accounts/delete_withdrawal_request", to: "savings_accounts#delete_withdrawal_request"
    post "/savings_accounts/approve_withdrawal_request", to: "savings_accounts#approve_withdrawal_request"

    # /api/
    # Member Parameter
    # 
    get "/insurance_accounts/fetch_insurance_status", to: "insurance_accounts#fetch_insurance_status"
    get "/insurance_accounts/process_account_transactions_file", to: "insurance_accounts#process_account_transactions_file"
    get "/insurance_accounts/process_member_accounts_file", to: "insurance_accounts#process_member_accounts_file"

    # Accounting
    get "/accounting/fetch_trial_balance", to: "accounting#fetch_trial_balance"
    get "/accounting/fetch_general_ledger", to: "accounting#fetch_general_ledger"
    get "/accounting/trial_balance_excel", to: "accounting#trial_balance_excel"

    post "/trial_balances/create", to: "trial_balances#create"
    post "/trial_balances/delete", to: "trial_balances#delete"

    post "/general_ledgers/create", to: "general_ledgers#create"
    post "/general_ledgers/delete", to: "general_ledgers#delete"
    get "/general_ledgers/fetch", to: "general_ledgers#fetch"

    # Accounting Entries
    get "/accounting_entries/fetch", to: "accounting_entries#fetch"
    post "/accounting_entries/save", to: "accounting_entries#save"
    post "/accounting_entries/approve", to: "accounting_entries#approve"
    post "/accounting_entries/modify_date_posted", to: "accounting_entries#modify_date_posted"

    # Loans
    get "/loans/fetch", to: "loans#fetch"
    get "/loans/fetch_by_member", to: "loans#fetch_by_member"
    post "/loans/change_book", to: "loans#change_book"
    post "/loans/approve", to: "loans#approve"
    post "/loans/reage", to: "loans#reage"
    post "/loans/delete", to: "loans#delete"
    post "/loans/apply", to: "loans#apply"
    post "/loans/save", to: "loans#save"
    post "/loans/update_first_date_of_payment", to: "loans#update_first_date_of_payment"
    post "/loans/update_date_released", to: "loans#update_date_released"
    post "/loans/delay_amort", to: "loans#delay_amort"
    post "/loans/new_adjustment", to: "loans#new_adjustment"
    post "/loans/delete_adjustment", to: "loans#delete_adjustment"
    post "/loans/approve_adjustment", to: "loans#approve_adjustment"
    post "/loans/restructure", to: "loans#restructure"
    post "/loans/recompute_restructure", to: "loans#recompute_restructure"
    post "/loans/verify", to: "loans#verify"
    post "/loans/for_release", to: "loans#for_release"
    post "/loans/process", to: "loans#process_loan"
    post "/loans/reject", to: "loans#reject"
    post "/loans/upload_application_form", to: "loans#upload_application_form"
    post "/loans/reverse_loan", to: "loans#reverse_loan"
    post "/loans/reverse_loan_reason", to: "loans#reverse_loan_reason"
    post "/loans/reverse_approve_loan_reason", to: "loans#reverse_approve_loan_reason"
    post "/loans/fraud_save", to: "loans#fraud_save"
    # Branches
    get "/branches", to: "branches#index"
    get "/branches/list_centers", to: "branches#list_centers"
    get "/branches/fetch_centers", to: "branches#fetch_centers"
    get "/branches/:id/stats", to: "branches#stats"
    get "/branches/fetch_centers_for_restructure", to: "branches#fetch_centers_for_restructure"



    # Clusters
    get "/clusters", to: "clusters#index"
    # Accounting Funds
    get "/accounting_funds", to: "accounting_funds#index"

    # Centers
    get "/centers", to: "centers#index"
    get "/centers/centers", to: "centers#centers"
    get "/centers/process_centers_file", to: "centers#process_centers_file"

    # Billing
    post "/billings", to: "billings#create"
    post "/billings/update", to: "billings#update"
    post "/billings/save", to: "billings#save"
    post "/billings/unsave", to: "billings#unsave"
    post "/billings/modify_transaction_record", to: "billings#modify_transaction_record"
    post "/billings/modify_member_record", to: "billings#modify_member_record"
    post "/billings/toggle_attendance", to: "billings#toggle_attendance"
    post "/billings/toggle_attendance_on", to: "billings#toggle_attendance_on"
    post "/billings/toggle_attendance_off", to: "billings#toggle_attendance_off"
    post "/billings/approve", to: "billings#approve"
    post "/billings/zero_out", to: "billings#zero_out"
    post "/billings/check", to: "billings#check"
    post "/billings/uncheck", to: "billings#uncheck"
    post "/billings/update_or_number", to: "billings#update_or_number"
    post "/billings/update_ar_number", to: "billings#update_ar_number"
    post "/billings/update_particular", to: "billings#update_particular"
    post "/billings/update_si_number", to: "billings#update_si_number"
    post "/billings/update_book", to: "billings#update_book"
    get "/billings/fetch", to: "billings#fetch"



    #billing_for_full_payments
    post "/billing_for_full_payments/create", to: "billing_for_full_payments#create"
    post "/billing_for_full_payments/update_amount", to: "billing_for_full_payments#update_amount"
    post "/billing_for_full_payments/add_member", to: "billing_for_full_payments#add_member"
    post "/billing_for_full_payments/remove_payment_member", to: "billing_for_full_payments#remove_payment_member"
    post "/billing_for_full_payments/add_particular", to: "billing_for_full_payments#add_particular"
    post "/billing_for_full_payments/add_or", to: "billing_for_full_payments#add_or"
    post "/billing_for_full_payments/add_ar", to: "billing_for_full_payments#add_ar"
    post "/billing_for_full_payments/approved", to: "billing_for_full_payments#approved"
    post "/billing_for_full_payments/checked", to: "billing_for_full_payments#checked"
    post "/billing_for_full_payments/update_book", to: "billing_for_full_payments#update_book"


    #Accrued_Billing
    post "/accrued_payment_collections", to: "accrued_payment_collections#create"
    post "/accrued_payment_collections/update_transaction", to: "accrued_payment_collections#update_transaction"
    post "/accrued_payment_collections/approve_transaction", to: "accrued_payment_collections#approve_transaction"
    post "/accrued_payment_collections/process_zero", to: "accrued_payment_collections#process_zero"
    post "/accrued_payment_collections/delete", to: "accrued_payment_collections#delete"
    post "/accrued_payment_collections/add_particular", to: "accrued_payment_collections#add_particular"
    post "/accrued_payment_collections/add_or", to: "accrued_payment_collections#add_or"
    post "/accrued_payment_collections/add_ar", to: "accrued_payment_collections#add_ar"
    post "/accrued_payment_collections/add_book_type", to: "accrued_payment_collections#add_book_type"

    #midas
    get "/excel_reports/generate", to: "excel_reports#generate"
    
    #transfer_savings
    post "/transfer_savings/create", to: "transfer_savings#create"
    post "/transfer_savings/approved", to: "transfer_savings#approved"
    get "/transfer_savings/fetch", to: "transfer_savings#fetch"

    
    #transfer_member_records
    post "/transfer_member_records/create", to: "transfer_member_records#create"
    post "/transfer_member_records/add_member", to: "transfer_member_records#add_member"
    post "/transfer_member_records/delete_member", to: "transfer_member_records#delete_member"
    post "/transfer_member_records/approve", to: "transfer_member_records#approve"
    post "/transfer_member_records/add_particular", to: "transfer_member_records#add_particular"

    # Monthly Closing Collection
    get "/monthly_closing_collections/fetch", to: "monthly_closing_collections#fetch"
    post "/monthly_closing_collections", to: "monthly_closing_collections#create"
    post "/monthly_closing_collections/update", to: "monthly_closing_collections#update"
    post "/monthly_closing_collections/approve", to: "monthly_closing_collections#approve"

    # Insurance Monthly Closing Collection
    get "/insurance_monthly_closing_collections/fetch", to: "insurance_monthly_closing_collections#fetch"
    post "/insurance_monthly_closing_collections", to: "insurance_monthly_closing_collections#create"
    post "/insurance_monthly_closing_collections/update", to: "insurance_monthly_closing_collections#update"
    post "/insurance_monthly_closing_collections/approve", to: "insurance_monthly_closing_collections#approve"

    # Commission Collection
    get "/commission_collections/fetch", to: "commission_collections#fetch"
    post "/commission_collections", to: "commission_collections#create"
    post "/commission_collections/update", to: "commission_collections#update"
    post "/commission_collections/approve", to: "commission_collections#approve"
    post "/commission_collections/modify_template", to: "commission_collections#modify_template"
    post "/commission_collections/modify_book", to: "commission_collections#modify_book"
    post "/commission_collections/modify_particular", to: "commission_collections#modify_particular"
    post "/commission_collections/save_payee", to: "commission_collections#save_payee"
    post "/commission_collections/save_check_number", to: "commission_collections#save_check_number"
    post "/commission_collections/save_check_voucher_number", to: "commission_collections#save_check_voucher_number"
    post "/commission_collections/add_transaction_fee", to: "commission_collections#add_transaction_fee"

    # Membership Payment Collection
    post "/membership_payment_collections", to: "membership_payment_collections#create"
    post "/membership_payment_collections/modify_transaction_record", to: "membership_payment_collections#modify_transaction_record"
    post "/membership_payment_collections/approve", to: "membership_payment_collections#approve"
    post "/membership_payment_collections/update_or_number", to: "membership_payment_collections#update_or_number"
    post "/membership_payment_collections/update_ar_number", to: "membership_payment_collections#update_ar_number"
    post "/membership_payment_collections/update_particular", to: "membership_payment_collections#update_particular"
    get "/membership_payment_collections/fetch", to: "membership_payment_collections#fetch"
    get "/membership_payment_collections/fetch_members", to: "membership_payment_collections#fetch_members"
    post "/membership_payment_collections/add_member", to: "membership_payment_collections#add_member"
    post "/membership_payment_collections/remove_member", to: "membership_payment_collections#remove_member"

    # Deposit Collection
    post "/deposit_collections", to: "deposit_collections#create"
    post "/deposit_collections/modify_transaction_record", to: "deposit_collections#modify_transaction_record"
    post "/deposit_collections/approve", to: "deposit_collections#approve"
    post "/deposit_collections/finalize", to: "deposit_collections#finalize"
    post "/deposit_collections/update_or_number", to: "deposit_collections#update_or_number"
    post "/deposit_collections/update_ar_number", to: "deposit_collections#update_ar_number"
    post "/deposit_collections/update_particular", to: "deposit_collections#update_particular"
    post "/deposit_collections/update_accounting_fund", to: "deposit_collections#update_accounting_fund"
    get "/deposit_collections/fetch", to: "deposit_collections#fetch"
    get "/deposit_collections/fetch_members", to: "deposit_collections#fetch_members"
    get "/deposit_collections/fetch_accounting_funds", to: "deposit_collections#fetch_accounting_funds"
    post "/deposit_collections/add_member", to: "deposit_collections#add_member"
    post "/deposit_collections/remove_member", to: "deposit_collections#remove_member"
    post "/deposit_collections/modify_cash_management_template", to: "deposit_collections#modify_cash_management_template"
    post "/deposit_collections/modify_book", to: "deposit_collections#modify_book"
    post "/deposit_collections/load_branch", to: "deposit_collections#load_branch"
    post "/deposit_collections/load_center", to: "deposit_collections#load_center"

    # Time Deposit Collection
    post "/time_deposit_collections", to: "time_deposit_collections#create"
    post "/time_deposit_collections/approve", to: "time_deposit_collections#approve"
    get "/time_deposit_collections/fetch", to: "time_deposit_collections#fetch"
    get "/time_deposit_collections/fetch_members", to: "time_deposit_collections#fetch_members"
    post "/time_deposit_collections/update_or_number", to: "time_deposit_collections#update_or_number"
    post "/time_deposit_collections/update_ar_number", to: "time_deposit_collections#update_ar_number"
    post "/time_deposit_collections/update_particular", to: "time_deposit_collections#update_particular"
    post "/time_deposit_collections/modify_cash_management_template", to: "time_deposit_collections#modify_cash_management_template"
    post "/time_deposit_collections/modify_book", to: "time_deposit_collections#modify_book"
    post "/time_deposit_collections/add_member", to: "time_deposit_collections#add_member"
    post "/time_deposit_collections/remove_member", to: "time_deposit_collections#remove_member"

    # Withdrawal Collection
    post "/withdrawal_collections", to: "withdrawal_collections#create"
    post "/withdrawal_collections/modify_transaction_record", to: "withdrawal_collections#modify_transaction_record"
    post "/withdrawal_collections/approve", to: "withdrawal_collections#approve"
    post "/withdrawal_collections/update_or_number", to: "withdrawal_collections#update_or_number"
    post "/withdrawal_collections/update_ar_number", to: "withdrawal_collections#update_ar_number"
    post "/withdrawal_collections/update_particular", to: "withdrawal_collections#update_particular"
    get "/withdrawal_collections/fetch", to: "withdrawal_collections#fetch"
    get "/withdrawal_collections/fetch_members", to: "withdrawal_collections#fetch_members"
    post "/withdrawal_collections/add_member", to: "withdrawal_collections#add_member"
    post "/withdrawal_collections/remove_member", to: "withdrawal_collections#remove_member"

    # Insurance Withdrawal Collection
    post "/insurance_withdrawal_collections", to: "insurance_withdrawal_collections#create"
    post "/insurance_withdrawal_collections/modify_transaction_record", to: "insurance_withdrawal_collections#modify_transaction_record"
    post "/insurance_withdrawal_collections/approve", to: "insurance_withdrawal_collections#approve"
    post "/insurance_withdrawal_collections/update_particular", to: "insurance_withdrawal_collections#update_particular"
    get "/insurance_withdrawal_collections/fetch", to: "insurance_withdrawal_collections#fetch"
    get "/insurance_withdrawal_collections/fetch_members", to: "insurance_withdrawal_collections#fetch_members"
    post "/insurance_withdrawal_collections/add_member", to: "insurance_withdrawal_collections#add_member"
    post "/insurance_withdrawal_collections/remove_member", to: "insurance_withdrawal_collections#remove_member"

    # Equity Withdrawal Collection
    post "/equity_withdrawal_collections", to: "equity_withdrawal_collections#create"
    post "/equity_withdrawal_collections/modify_transaction_record", to: "equity_withdrawal_collections#modify_transaction_record"
    post "/equity_withdrawal_collections/approve", to: "equity_withdrawal_collections#approve"
    post "/equity_withdrawal_collections/update_particular", to: "equity_withdrawal_collections#update_particular"
    get "/equity_withdrawal_collections/fetch", to: "equity_withdrawal_collections#fetch"
    get "/equity_withdrawal_collections/fetch_members", to: "equity_withdrawal_collections#fetch_members"
    post "/equity_withdrawal_collections/add_member", to: "equity_withdrawal_collections#add_member"
    post "/equity_withdrawal_collections/remove_member", to: "equity_withdrawal_collections#remove_member"

    # Insurance Fund Transfer Collection
    post "/insurance_fund_transfer_collections", to: "insurance_fund_transfer_collections#create"
    post "/insurance_fund_transfer_collections/modify_transaction_record", to: "insurance_fund_transfer_collections#modify_transaction_record"
    post "/insurance_fund_transfer_collections/approve", to: "insurance_fund_transfer_collections#approve"
    post "/insurance_fund_transfer_collections/update_particular", to: "insurance_fund_transfer_collections#update_particular"
    get "/insurance_fund_transfer_collections/fetch", to: "insurance_fund_transfer_collections#fetch"
    get "/insurance_fund_transfer_collections/fetch_members", to: "insurance_fund_transfer_collections#fetch_members"
    post "/insurance_fund_transfer_collections/add_member", to: "insurance_fund_transfer_collections#add_member"
    post "/insurance_fund_transfer_collections/remove_member", to: "insurance_fund_transfer_collections#remove_member"
    post "/insurance_fund_transfer_collections/load_center", to: "insurance_fund_transfer_collections#load_center"
    post "/insurance_fund_transfer_collections/update_or_number", to: "insurance_fund_transfer_collections#update_or_number"
    post "/insurance_fund_transfer_collections/update_reference_number", to: "insurance_fund_transfer_collections#update_reference_number"
    post "/insurance_fund_transfer_collections/finalize", to: "insurance_fund_transfer_collections#finalize"
    post "/insurance_fund_transfer_collections/revert", to: "insurance_fund_transfer_collections#revert"

    #Member Account Validations
    post 'member_account_validations/generate_transaction', to: 'member_account_validations#generate_transaction'
    post 'member_account_validations/add_member', to: 'member_account_validations#add_member'
    post 'member_account_validations/delete_member_account_validation_record', to: 'member_account_validations#delete_member_account_validation_record'
    post 'member_account_validations/approve', to: 'member_account_validations#approve'
    post 'member_account_validations/validate', to: 'member_account_validations#validate'
    post 'member_account_validations/check', to: 'member_account_validations#check'
    post 'member_account_validations/reverse', to: 'member_account_validations#reverse'
    post 'member_account_validations/cancel', to: 'member_account_validations#cancel'
    post 'member_account_validations/cancel_member', to: 'member_account_validations#cancel_member'

    # Survey Answers
    post "/survey_answers", to: "survey_answers#create"
    post "/survey_answers/save", to: "survey_answers#save"

    namespace :data_stores do
      post "/project_type_summary/create", to: "project_type_summary#create"
      post "/icpr/queue", to: "icpr#queue"
      get "/icpr/fetch", to: "icpr#fetch"
      post "/icpr/approve", to: "icpr#approve"
      post "/icpr/set_rate", to: "icpr#set_rate"
      post "/member_id_generetors/create", to: "member_id_generetors#create"
      get "/member_id_generetors/fetch_members", to: "member_id_generetors#fetch_members"
      post "/member_id_generetors/contact_person", to: "member_id_generetors#contact_person"
      post "/member_id_generetors/add_contact_person", to: "member_id_generetors#add_contact_person"
      post "/member_id_generetors/add_member", to: "member_id_generetors#add_member"
      post "/member_id_generetors/check_member_id", to: "member_id_generetors#check_member_id"
      post "/member_id_generetors/remove_member", to: "member_id_generetors#remove_member"
      post "/patronage_refund/queue", to: "patronage_refund#queue"
      get "/patronage_refund/fetch", to: "patronage_refund#fetch"
      post "/patronage_refund/approve", to: "patronage_refund#approve"
      post "/patronage_refund/set_rate", to: "patronage_refund#set_rate"
      post "/personal_funds/queue", to: "personal_funds#queue"
      get "/personal_funds/fetch", to: "personal_funds#fetch"
      get "/personal_funds/download_excel", to: "personal_funds#download_excel"
      post "/branch_loans_stats/queue", to: "branch_loans_stats#queue"
      post "/accounting_entries_summaries/queue", to: "accounting_entries_summaries#queue"
      post "/soa_expenses/queue", to: "soa_expenses#queue"
      get "/soa_expenses/fetch", to: "soa_expenses#fetch"
      post "/soa_loans/queue", to: "soa_loans#queue"
      get "/soa_loans/fetch", to: "soa_loans#fetch"
      post "/soa_funds/queue", to: "soa_funds#queue"
      get "/soa_funds/fetch", to: "soa_funds#fetch"
      post "/watchlists/queue", to: "watchlists#queue"
      get "/watchlists/fetch", to: "watchlists#fetch"
      post "/repayment_rates/queue", to: "repayment_rates#queue"
      get "/repayment_rates/fetch", to: "repayment_rates#fetch"
      post "/manual_aging/queue", to: "manual_aging#queue"
      get "/manual_aging/fetch", to: "manual_aging#fetch"
      post "/branch_repayment_reports/queue", to: "branch_repayment_reports#queue"
      get "/branch_repayment_reports/fetch", to: "branch_repayment_reports#fetch"
      post "/branch_resignations/queue", to: "branch_resignations#queue"
      get "/branch_resignations/fetch", to: "branch_resignations#fetch"
      post "/member_counts/queue", to: "member_counts#queue"
      post "/insurance_member_counts/queue", to: "insurance_member_counts#queue"
      post "/claims_counts/queue", to: "claims_counts#queue"
      post "/uploaded_documents_counts/queue", to: "uploaded_documents_counts#queue"
      post "/member_quarterly_reports/queue", to: "member_quarterly_reports#queue"
      post "/monthly_new_and_resigned/queue", to: "monthly_new_and_resigned#queue"
      post "/monthly_new_and_resigned/resolution_update", to: "monthly_new_and_resigned#resolution_update"
      get "/monthly_new_and_resigned/fetch", to: "monthly_new_and_resigned#fetch"
      post "/monthly_incentives/queue", to: "monthly_incentives#queue"
      post "/x_weeks_to_pay/queue", to: "x_weeks_to_pay#queue"
      get "/x_weeks_to_pay/fetch", to: "x_weeks_to_pay#fetch"
      get "/x_weeks_to_pay/:id/print_pdf", to: "x_weeks_to_pay#print_pdf"
      post "/year_end_closings/queue", to: "year_end_closings#queue"
      post "/year_end_closings/approve", to: "year_end_closings#approve"
      post "/balance_sheets/queue", to: "balance_sheets#queue"
      post "/income_statements/queue", to: "income_statements#queue"
      post "/members_in_good_standing/queue", to: "members_in_good_standing#queue"
      get "/members_in_good_standing/fetch", to: "members_in_good_standing#fetch"
      post "/for_writeoff/queue", to: "for_writeoff#queue"
      get "/for_writeoff/fetch", to: "for_writeoff#fetch"
      post "/involuntary_members/queue", to: "involuntary_members#queue"
      post "/involuntary_members/print",to: "involuntary_members#print"
      post "/insurance_personal_funds/queue", to: "insurance_personal_funds#queue"
      post "/insurance_personal_funds/queue_bulk", to: "insurance_personal_funds#queue_bulk"
      get "/insurance_personal_funds/fetch", to: "insurance_personal_funds#fetch"
      get "/insurance_personal_funds/download_excel", to: "insurance_personal_funds#download_excel"

      post "/share_capital_summary/create", to: "share_capital_summary#create"
      get "/share_capital_summary/fetch", to: "share_capital_summary#fetch"

      post "/assets_liabilities/create", to: "assets_liabilities#create"
      post "/share_capital_involuntary/queue", to: "share_capital_involuntary#queue"
      post "/member_per_center_counts/queue", to: "member_per_center_counts#queue"
      post "/allowance_computation_report/queue", to: "allowance_computation_report#queue"
      get  "/allowance_computation_report/fetch", to: "allowance_computation_report#fetch"

       #WrittenOffReport
      post "written_off_report/generate", to: "written_off_report#generate"


    end

    namespace :epassbook do
      get "/members/status", to: "members#status"
      get "/members/show", to: "members#show"
      get "/active_loans", to: "loans#active_loans"
      get "/savings", to: "savings#index"
      get "/savings/show", to: "savings#transactions"
      get "/insurances", to: "insurances#index"
      get "/insurances/show", to: "insurances#transactions"
      get "/equities", to: "equities#index"
      get "/equities/show", to: "equities#transactions"
      get "/loans/show", to: "loans#show"
      get "/loans/payments", to: "loans#payments"
    end

    # Centers
    post "/centers/assign_officer", to: "centers#assign_officer"

    namespace :administration do
      #Computer System
      post "/computer_system/create", to: "computer_system#create"
      put "/computer_system/update", to: "computer_system#update"
      post "/computer_system/delete", to: "computer_system#delete"
      #Items
      post "items/create", to: "items#create"
      put "/items/update", to: "items#update"
      post "/items/delete", to: "items#delete"
      #Items Category
      post "items_category/create", to: "items_category#create"
      put "items_category/update",  to: "items_category#update"
      post "items_category/delete", to: "items_category#delete"
      #Sub-Category
      post "sub_categories/create", to: "sub_categories#create"
      put "sub_categories/update",  to: "sub_categories#update"
      post "sub_categories/delete", to: "sub_categories#delete"
      #Suppliers
      post "suppliers/create", to: "suppliers#create"
      put "/suppliers/update", to: "suppliers#update"
      post "/suppliers/delete", to: "suppliers#delete"
      #Brands
      post "brands/create", to: "brands#create"
      put "brands/update",  to: "brands#update"
      post "brands/delete", to: "brands#delete"
     #User
      post "/user_demerits/approve", to: "user_demerits#approve"
      get "/user_branches", to: "user_branches#index"
      post "/user_branches/toggle", to: "user_branches#toggle"
      # Surveys
      post "/surveys/save", to: "surveys#save"
      post "/surveys/delete", to: "surveys#delete"
      get "/surveys/fetch", to: "surveys#fetch"
      # Survey Question
      get "/survey_questions/fetch", to: "survey_questions#fetch"
      post "/survey_questions/save", to: "survey_questions#save"
      post "/survey_questions/delete", to: "survey_questions#delete"
      # Loan Product
      post "/loan_products/delete", to: "loan_products#delete"
      post "/loan_products/modify_prerequisite", to: "loan_products#modify_prerequisite"
      post "/loan_products/modify_maintaining_balance", to: "loan_products#modify_maintaining_balance"
      # Membership Arrangement
      post "/membership_arrangements/update_data", to: "membership_arrangements#update_data"
    end
    
    get 'reports/member_reports', to: 'reports#member_reports'
    get 'reports/collections_clip_reports', to: 'reports#collections_clip_reports'
    get 'reports/collections_blip_reports', to: 'reports#collections_blip_reports'
    get 'reports/member_dependent_reports', to: 'reports#member_dependent_reports'
    get 'reports/cic_reports', to: 'reports#cic_reports'
    get 'reports/member_quarterly_reports', to: 'reports#member_quarterly_reports'
    get 'reports/member_counts', to: 'reports#member_counts'
    get 'pages/insurance_account_status_reports', to: 'pages#insurance_account_status_reports'
    get 'reports/summary_of_certificates_and_policies', to: 'reports#summary_of_certificates_and_policies' 
    get "/reports/personal_document_reports", to: "reports#personal_document_reports"
    get "/reports/collections_hiip_reports", to: "reports#collections_hiip_reports"
    get 'reports/insurance_quarterly_reports', to: 'reports#insurance_quarterly_reports'
    get "/reports/savings_insurance_transfer_reports", to: "reports#savings_insurance_transfer_reports"

    get "/reports/insurance_loan_bundle_reports", to: "reports#insurance_loan_bundle_reports"

    get "/reports/claims_processing_time_report", to: "reports#claims_processing_time_report"
    get "/reports/claims_processing_time_report_summary", to: "reports#claims_processing_time_report_summary"
    get "/reports/reclassified_report", to: "reports#reclassified_report  "
    #claims
    post "/claims/save", to: "claims#save"
    post "/claims/create", to: "claims#create"
    post "/claims/approve", to: "claims#approve"
    post "/claims/post", to: "claims#post"
    post "/claims/pending", to: "claims#pending"
    post "/claims/check", to: "claims#check"
    post "/claims/proceed", to: "claims#proceed"
    post "/claims/declined", to: "claims#declined"
    post "/claims/update", to: "claims#update"
    post "/claims/modify_claims_template", to: "claims#modify_claims_template"
    post "/claims/modify_book", to: "claims#modify_book"
    post "/claims/modify_particular", to: "claims#modify_particular"
    post "/claims/save_payee", to: "claims#save_payee"
    post "/claims/save_check_number", to: "claims#save_check_number"
    post "/claims/save_check_voucher_number", to: "claims#save_check_voucher_number"
    post "/claims/save_note", to: "claims#save_note"
    post "/claims/save_date_paid", to: "claims#save_date_paid"
    post "/claims/add_transaction_fee", to: "claims#add_transaction_fee"    
  end

  # For member mobile client
  namespace :members do
    # Loans
    get "/loans/:id", to: "loans#show"
    get "/loans", to: "loans#index"
    post "/loans", to: "loans#create"

    # Insurance
    get "/insurance_accounts", to: "insurance_accounts#index"
    get "/insurance_accounts/:id", to: "insurance_accounts#show"
    get "/insurance_accounts/:id/transactions", to: "insurance_accounts#transactions"
   
    # Savings
    get "/savings_accounts", to: "savings_accounts#index"
    get "/savings_accounts/:id", to: "savings_accounts#show"
    get "/savings_accounts/:id/transactions", to: "savings_accounts#transactions"
   
    # Equities
    get "/equity_accounts", to: "equity_accounts#index"
    get "/equity_accounts/:id", to: "equity_accounts#show"
    get "/equity_accounts/:id/transactions", to: "equity_accounts#transactions"

    # Shares
    get "/member_shares", to: "member_shares#index"

    # Survey
    get "/surveys", to: "surveys#index"
    post "/surveys/create_survey_mobile", to: "surveys#create_survey_mobile"
    post "/surveys/fetch_survey_answer", to: "surveys#fetch_survey_answer"
    post "/surveys/update_survey_answer", to: "surveys#update_survey_answer"

    # Loan Products
    get "/loan_products", to: "loan_products#index"

    # Co Makers
    get "/co_makers", to: "co_makers#index"

    # Loan Applications
    get "/loan_applications", to: "loan_applications#index"
  end

  # Client Meta Services
  get "/client_meta/loan_products", to: "client_meta#loan_products"

  namespace :v2 do
    post "/apply", to: "public#apply"
    post "/branches/save_daily_branch_metric", to: "branches#save_daily_branch_metric"
    post "/check_status", to: "public#check_status"
    post "/check_mobile_number", to: "public#check_mobile_number"
    get "/branches", to: "public#branches"
    
    # loans
    post "/loans/apply", to: "loans#apply"
    get "/loans/project_type_categories", to: "loans#project_type_categories"
    get "/loans", to: "loans#index"
    get "/loans/settings", to: "loans#settings"
    post "/loans/quote", to: "loans#quote"
    post "/loans/review", to: "loans#review"

    # members
    post "/members/update_password", to: "members#update_password"
    get "/members/co_makers", to: "members#co_makers"
    get "/members/loan_products", to: "members#loan_products"
    get "/members/fetch_files", to: "members#fetch_files"
    post "/members/upload_file", to: "members#upload_file"

    # dashboard
    post "/dashboard/generate_daily_report", to: "dashboard#generate_daily_report"
    post "/dashboard/generate_accounting_report", to: "dashboard#generate_accounting_report"

    # monthly_accounting_code_summaries
    post "/monthly_accounting_code_summaries/create", to: "monthly_accounting_code_summaries#create"

    # trends
    get "/trends/fetch_yearly_data", to: "trends#fetch_yearly_data"

    # users
    post "/users/login", to: "users#login"
    get "/users", to: "users#index"

    namespace :members do
      get "/insurances", to: "insurances#index"
      get "/insurances/:id", to: "insurances#show"
      get "/equities", to: "equities#index"
      get "/equities/:id", to: "equities#show"
      get "/savings", to: "savings#index"
      get "/savings/:id", to: "savings#show"
      get "/loans", to: "loans#index"
      get "/loans/:id", to: "loans#show"
      post "/settings/change_password", to: "settings#change_password"
    end
  end

  
end
