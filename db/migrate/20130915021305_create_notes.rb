class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
    	t.integer :board_id, null: false
    	t.string :item, null: false
    	t.boolean :hq, default: false
    	t.integer :price
    	t.integer :ip, limit: 8
    	t.timestamps
    	
    	t.index [:board_id, :item, :hq]
    	t.index :created_at
    end
  end
end
