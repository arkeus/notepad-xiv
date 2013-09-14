require "nokogiri"
require "open-uri"

class ItemScraper
	NUM_PAGES = 2 #149
	COLUMNS = [:name, :description, :rank, :class, :obtained]
	COLUMN_MAP = Hash[*COLUMNS.each_with_index.map { |v, i| [v, i] }.flatten]
	
	def initialize(file)
		puts "Creating item database at #{file}"
		@file = File.open(file, "w")
	end
	
	def scrape
		items = []
		
		1.upto(NUM_PAGES) do |page|
			url = page_url(page)
			doc = Nokogiri::HTML(open(url))
			item_rows = doc.css("table#ItemTableSortable").css("tr")
			item_rows.each do |item_row|
				values = item_row.css("td")
				next if values.empty?
				name = get_column(values, :name)
				description = get_column(values, :description)
				rank = get_column(values, :rank)
				klass = get_column(values, :class)
				obtained = get_column(values, :obtained)
				items << { n: name, d: description, r: rank, c: klass, o: obtained }
			end
			wait "Page #{page}"
		end
		
		@file.write(items.to_json)
	end
	
	def close
		@file.close if @file
	end
	
	private
	
	def page_url(page)
		"http://ffxiv.zam.com/en/itemlist.html?1&page=#{page}"
	end
	
	def get_column(element, column)
		return element[COLUMN_MAP[column]].text
	end
	
	def wait(message = nil, time = 1)
		puts "Sleeping (#{message}) - #{time}s"
		sleep(time)
	end
end