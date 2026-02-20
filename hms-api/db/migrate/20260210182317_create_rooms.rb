class CreateRooms < ActiveRecord::Migration[8.1]
  def change
    create_table :rooms do |t|
      t.string :name
      t.text :description
      t.decimal :price
      t.integer :capacity
      t.integer :category
      t.integer :status
      t.boolean :is_featured

      t.timestamps
    end
  end
end
