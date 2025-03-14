class Checkpoint2024 < ActiveRecord::Migration[7.1]
  def change
   # These are extensions that must be enabled in order to support this database
    enable_extension "pg_stat_statements"
    enable_extension "pgcrypto"
    enable_extension "plpgsql"


    create_table "activity_logs", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.string "content"
      t.string "activity_type"
      t.json "data"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.index ["created_at"], name: "manual_idx_4", order: :desc
    end


    create_table "announcements", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.string "title"
      t.text "content"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.uuid "user_id"
      t.string "status"
      t.boolean "is_published"
      t.uuid "branch_id"
      t.date "announced_at"
      t.date "published_at"
      t.index ["branch_id"], name: "index_announcements_on_branch_id"
    end

    create_table "areas", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.string "name"
      t.string "short_name"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
    end


    create_table "branches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.uuid "cluster_id"
      t.string "name"
      t.string "short_name"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.integer "member_counter"
      t.date "current_date"
      t.string "color"
      t.boolean "is_main"
      t.string "or_prefix"
      t.integer "or_counter", default: 0
      t.integer "or_current_max"
      t.string "ar_prefix"
      t.integer "ar_counter", default: 0
      t.integer "ar_current_max"
      t.decimal "lat"
      t.decimal "lon"
      t.index ["cluster_id"], name: "index_branches_on_cluster_id"
    end

    create_table "centers", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.uuid "branch_id"
      t.string "name"
      t.string "short_name"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.integer "meeting_day"
      t.uuid "user_id"
      t.decimal "lat"
      t.decimal "lon"
      t.index ["branch_id"], name: "index_centers_on_branch_id"
    end

    create_table "clusters", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.uuid "area_id"
      t.string "name"
      t.string "short_name"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.index ["area_id"], name: "index_clusters_on_area_id"
    end

    create_table "messages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.string "topic"
      t.text "content"
      t.string "status"
      t.uuid "message_id"
      t.jsonb "data"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.uuid "user_id"
      t.index ["message_id"], name: "index_messages_on_message_id"
      t.index ["user_id"], name: "index_messages_on_user_id"
    end

    create_table "user_branches", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.uuid "user_id"
      t.uuid "branch_id"
      t.boolean "active"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
    end

    create_table "user_demerits", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
      t.uuid "user_id"
      t.uuid "branch_id"
      t.string "status"
      t.string "demerit_type"
      t.string "role"
      t.date "date_prepared"
      t.date "date_approved"
      t.date "date_of_action"
      t.text "reason"
      t.text "explanation"
      t.json "data"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.index ["branch_id"], name: "index_user_demerits_on_branch_id"
      t.index ["user_id"], name: "index_user_demerits_on_user_id"
    end

    create_table "user_tasks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.uuid "user_id", null: false
      t.string "status"
      t.string "task_type"
      t.jsonb "data"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.index ["user_id"], name: "index_user_tasks_on_user_id"
    end

    create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.string "email", default: "", null: false
      t.string "encrypted_password", default: "", null: false
      t.string "reset_password_token"
      t.datetime "reset_password_sent_at", precision: nil
      t.datetime "remember_created_at", precision: nil
      t.integer "sign_in_count", default: 0, null: false
      t.datetime "current_sign_in_at", precision: nil
      t.datetime "last_sign_in_at", precision: nil
      t.inet "current_sign_in_ip"
      t.inet "last_sign_in_ip"
      t.datetime "created_at", precision: nil, null: false
      t.datetime "updated_at", precision: nil, null: false
      t.string "username"
      t.string "first_name"
      t.string "last_name"
      t.string "identification_number"
      t.string "roles"
      t.boolean "is_regular"
      t.date "incentivized_date"
      t.string "access_token"
      t.boolean "is_verified"
      t.string "verification_token"
      t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    end


    add_foreign_key "branches", "clusters"
    add_foreign_key "centers", "branches"
    add_foreign_key "clusters", "areas"
    add_foreign_key "messages", "users"
    add_foreign_key "user_demerits", "branches"
    add_foreign_key "user_demerits", "users"
    add_foreign_key "user_tasks", "users"
  
  end
end
