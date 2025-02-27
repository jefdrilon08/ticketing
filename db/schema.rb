# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

<<<<<<< HEAD
ActiveRecord::Schema[7.1].define(version: 2025_02_24_060633) do
=======
ActiveRecord::Schema[7.1].define(version: 2025_02_19_083802) do
>>>>>>> b6d2699fde68de06f5f2414ce15fb879695aa044
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

  create_table "computer_systems", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_ticket_details", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "concern_ticket_id"
    t.text "description"
    t.json "data"
    t.string "status"
    t.string "name"
    t.uuid "concern_type_id"
    t.uuid "branch_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "ticket_number"
  end

  create_table "concern_ticket_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "status"
    t.string "task"
    t.uuid "concern_ticket_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "status"
    t.json "data"
    t.uuid "computer_system_id"
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_types", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_ticket_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "status"
    t.string "task"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_types", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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

  create_table "milestone_details", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "system_ticket_desc_id"
    t.text "milestone_details"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "system_ticket_descs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "ticket_number"
    t.string "system_ticket_id"
    t.string "system_type"
    t.date "date_received"
    t.date "start_date"
    t.string "status"
    t.json "data"
    t.string "title"
    t.text "description"
    t.text "expected_goal"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "system_ticket_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_id"
    t.json "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "system_tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "computer_system_id"
    t.string "status"
    t.string "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
