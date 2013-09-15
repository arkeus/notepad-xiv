class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
    	t.string :name, limit: 32, null: false
    	t.integer :ip, limit: 8
    	t.timestamps
    	
    	t.index :name
    end
  end
end
