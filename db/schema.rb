# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_11_19_105704) do

  create_table "stores", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", limit: 20
    t.string "owner", limit: 16
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "transactions", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "store_id"
    t.integer "trantype_id"
    t.decimal "amount", precision: 14, scale: 2
    t.string "cpf", limit: 12
    t.string "card", limit: 14
    t.datetime "transaction_dt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["store_id"], name: "index_transactions_on_store_id"
    t.index ["trantype_id"], name: "index_transactions_on_trantype_id"
  end

  create_table "trantypes", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "description", limit: 30
    t.string "deb_or_decred", limit: 12
    t.string "signal", limit: 1
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "cognito_id"
    t.string "name"
    t.string "email"
    t.boolean "enabled", default: false, null: false
    t.boolean "archived", default: false, null: false
    t.string "options", limit: 4096
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
