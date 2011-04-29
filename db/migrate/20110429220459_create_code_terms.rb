class CreateCodeTerms < ActiveRecord::Migration
  def self.up
    create_table :code_terms do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :code_terms
  end
end
