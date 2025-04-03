namespace :accounting do
  resources :accounting_codes
  get "/print_chart_of_accounts", to: "accounting_codes#print"
  get "/download_excel_chart_of_accounts", to: "accounting_codes#excel"
  get "/accounting_codes/download/json", to: "accounting_codes#download", as: :download_accounting_codes
  resources :item_distributions, only: [:index, :new, :create]
end
