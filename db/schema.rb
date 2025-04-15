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

ActiveRecord::Schema[7.1].define(version: 2025_04_14_010126) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activity_logs", id: :uuid, default: -> { "public.gen_random_uuid()" }, force: :cascade do |t|
    t.string "content"
    t.string "activity_type"
    t.json "data"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["created_at"], name: "manual_idx_4", order: :desc
  end

  create_table "add_is_private_and_connect_to_item_to_concern_tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "is_private"
    t.boolean "connect_to_item"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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

  create_table "borrow_transaction_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "borrow_transaction_id", null: false
    t.uuid "item_id", null: false
    t.integer "quantity"
    t.string "status"
    t.date "return_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["borrow_transaction_id"], name: "index_borrow_transaction_items_on_borrow_transaction_id"
    t.index ["item_id"], name: "index_borrow_transaction_items_on_item_id"
  end

  create_table "borrow_transactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "branch_id", null: false
    t.date "request_date"
    t.string "status", default: "pending"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["branch_id"], name: "index_borrow_transactions_on_branch_id"
    t.index ["user_id"], name: "index_borrow_transactions_on_user_id"
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
    t.string "description"
    t.boolean "active", default: true
    t.index ["cluster_id"], name: "index_branches_on_cluster_id"
  end

  create_table "brands", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.uuid "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_brands_on_item_id"
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
    t.string "description"
    t.string "status"
    t.json "data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_fors", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "concern_id"
    t.string "name"
    t.text "description"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "concern_ticket_details", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "ticket_number"
    t.uuid "concern_ticket_id"
    t.text "description"
    t.json "data"
    t.string "status"
    t.uuid "name_for_id"
    t.uuid "branch_id"
    t.uuid "requested_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "concern_type_id"
    t.uuid "assigned_user_id"
  end

  create_table "concern_ticket_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "status"
    t.string "task"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "concern_ticket_id"
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
    t.string "ticket_name"
    t.boolean "is_private"
    t.boolean "connect_to_item"
  end

  create_table "concern_types", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "concern_id"
  end

  create_table "inventories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "item_id", null: false
    t.string "serial_number"
    t.integer "quantity"
    t.string "unit"
    t.string "status"
    t.date "purchase_date"
    t.uuid "supplier_id", null: false
    t.string "type"
    t.json "data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "available_for_distribution"
    t.index ["item_id"], name: "index_inventories_on_item_id"
    t.index ["supplier_id"], name: "index_inventories_on_supplier_id"
  end

  create_table "inventory_distributions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "inventory_id", null: false
    t.string "mr_number"
    t.uuid "cluster_id", null: false
    t.uuid "branch_id", null: false
    t.uuid "user_id", null: false
    t.integer "quantity"
    t.date "date_distribute"
    t.string "distribute_by"
    t.string "recieve_by"
    t.json "data"
    t.string "distribution_type"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["branch_id"], name: "index_inventory_distributions_on_branch_id"
    t.index ["cluster_id"], name: "index_inventory_distributions_on_cluster_id"
    t.index ["inventory_id"], name: "index_inventory_distributions_on_inventory_id"
    t.index ["user_id"], name: "index_inventory_distributions_on_user_id"
  end

  create_table "inventory_request_details", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "inventory_request_id", null: false
    t.uuid "item_id", null: false
    t.string "description"
    t.string "unit"
    t.integer "quantity_requested"
    t.integer "approve_quantity"
    t.string "remarks"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["inventory_request_id"], name: "index_inventory_request_details_on_inventory_request_id"
    t.index ["item_id"], name: "index_inventory_request_details_on_item_id"
  end

  create_table "inventory_requests", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_number"
    t.date "date"
    t.uuid "branch_id", null: false
    t.uuid "user_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["branch_id"], name: "index_inventory_requests_on_branch_id"
    t.index ["user_id"], name: "index_inventory_requests_on_user_id"
  end

  create_table "item_distributions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "item_table"
    t.string "branch_id"
    t.string "employee_id"
    t.integer "quantity"
    t.string "distributed_by"
    t.datetime "distributed_at"
    t.string "receive_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "item_requests", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.date "date_request", null: false
    t.string "status", default: "Pending"
    t.jsonb "status_dates", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_item_requests_on_user_id"
  end

  create_table "items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "status", null: false
    t.string "unit"
    t.uuid "items_category_id", null: false
    t.jsonb "data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "item_type"
    t.boolean "is_parent"
    t.uuid "parent_id"
    t.index ["items_category_id"], name: "index_items_on_items_category_id"
    t.index ["parent_id"], name: "index_items_on_parent_id"
  end

  create_table "items_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "code"
    t.string "name"
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

  create_table "milestones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "system_ticket_desc_id"
    t.text "milestone_details"
    t.string "status"
    t.date "target_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "repair_maintenances", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "distribute_id"
    t.text "diagnosis"
    t.text "recomendation"
    t.text "status"
    t.integer "ticket_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "suppliers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.boolean "status"
    t.json "data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "contact_person"
    t.string "contact_number"
    t.string "address"
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
    t.string "requested_by"
    t.string "request_type"
    t.date "target_date"
  end

  create_table "system_tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "computer_system_id"
    t.string "status"
    t.string "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "data"
    t.integer "system_number"
    t.boolean "is_private"
  end

  create_table "system_tickets_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_id"
    t.string "status"
    t.json "data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "system_ticket_id"
    t.string "role"
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

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "borrow_transaction_items", "borrow_transactions"
  add_foreign_key "borrow_transaction_items", "items"
  add_foreign_key "borrow_transactions", "branches"
  add_foreign_key "borrow_transactions", "users"
  add_foreign_key "branches", "clusters"
  add_foreign_key "brands", "items"
  add_foreign_key "centers", "branches"
  add_foreign_key "clusters", "areas"
  add_foreign_key "inventories", "items"
  add_foreign_key "inventories", "suppliers"
  add_foreign_key "inventory_distributions", "branches"
  add_foreign_key "inventory_distributions", "clusters"
  add_foreign_key "inventory_distributions", "inventories"
  add_foreign_key "inventory_distributions", "users"
  add_foreign_key "inventory_request_details", "inventory_requests"
  add_foreign_key "inventory_request_details", "items"
  add_foreign_key "inventory_requests", "branches"
  add_foreign_key "inventory_requests", "users"
  add_foreign_key "item_requests", "users"
  add_foreign_key "items", "items", column: "parent_id"
  add_foreign_key "items", "items_categories"
  add_foreign_key "messages", "users"
  add_foreign_key "user_demerits", "branches"
  add_foreign_key "user_demerits", "users"
  add_foreign_key "user_tasks", "users"
end
