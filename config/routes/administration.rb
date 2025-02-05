namespace :administration do
  get "/", to: "pages#index"

  resources :users, except: [:destroy] do
    resources :user_demerits
  end

  resources :account_transactions, only: [:show]
  resources :areas
  resources :clusters
  resources :branches
  resources :centers
  resources :announcements
  resources :loan_products, except: [:destroy] do
    resources :loan_product_types
    resources :loan_product_taggings
  end
  resources :loan_product_categories
  resources :membership_arrangements
  resources :membership_types do
    get "/add_loan_product_configrations", to: "membership_types#add_loan_product_configurations"
  end

  resources :referrers
  
  resources :member_shares, only: [:index]
  get "/member_shares/not_printed", to: "member_shares#not_printed"
  get "/member_shares/printed", to: "member_shares#printed"
  get "/member_shares/no_certificates", to: "member_shares#no_certificates"
  get "/member_shares/print", to: "member_shares#print"
  post "/member_shares/void", to: "member_shares#void"

  resources :project_type_categories
  resources :project_types

  resources :surveys, only: [:index, :show, :edit, :update] do
    get "/survey_question_form", to: "surveys#survey_question_form"
  end

  resources :computer_system, only: [:index] do 
    get "/computer_system", to: "computer_system#index"
  end

  # Static pages
  get "/loan_products/download/json", to: "loan_products#download", as: :download_loan_products
end
