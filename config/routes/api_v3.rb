namespace :api do
  namespace :v3 do
    # Members
    get "/members/dashboard", to: "members#dashboard"
    get "/members/savings", to: "members#savings"

    # User Management
    post "/users", to: "users#create"
    put "/users/:id", to: "users#update"
    get "/users/:id", to: "users#show"
    delete "/users/:id", to: "users#delete"
    get "/users", to: "users#index"

    # User Branch Toggle
    post "/user_branches/toggle", to: "user_branches#toggle"
    get "/user_branches/:id/fetch", to: "user_branches#index"

    # Import Members
    post "/members/import_members", to: "members#import_members"
  end
end
