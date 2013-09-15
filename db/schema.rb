# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20130915021305) do

  create_table "boards", force: true do |t|
    t.string   "name",       limit: 32, null: false
    t.integer  "ip",         limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "boards", ["name"], name: "index_boards_on_name"

  create_table "notes", force: true do |t|
    t.integer  "board_id",                             null: false
    t.string   "item",                                 null: false
    t.boolean  "hq",                   default: false
    t.integer  "price"
    t.integer  "ip",         limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "notes", ["board_id", "item", "hq"], name: "index_notes_on_board_id_and_item_and_hq"
  add_index "notes", ["created_at"], name: "index_notes_on_created_at"

end
