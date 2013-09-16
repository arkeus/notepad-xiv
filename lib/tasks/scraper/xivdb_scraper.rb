require "nokogiri"
require "open-uri"

class XivdbScraper
	NUM_PAGES = 131
	
	def initialize(file)
		puts "Creating item database at #{file}"
		@file = File.open(file, "w")
	end
	
	def scrape
		items = []
		
		1.upto(NUM_PAGES) do |page|
			url = page_url(page)
			puts "Requesting #{url}"
			doc = Nokogiri::HTML(open(url))
			elements = doc.css("div[data-tooltip]")
			elements.each do |container|
				tooltip = Nokogiri::HTML(container['data-tooltip'])
				name = tooltip.css("h2").text
				element = container.css("div[style='float:left; width: 192px; padding:5px 0 0 3px;line-height:20px;']")
				url = element.css("a").first['href']
				id = url.split("/")[1]
				rarity = element.css("span").first['class'].split(" ").find { |c| c =~ /rarity/ }.split("_").last
				level = element.css("div[style='font-size:11px;opacity:0.8;']").first.to_s.match(/Lv<\/span>(\d+)</)[1]
				type = container.css("span[style='opacity:0.7;']").first.text
				image_relative_path = container.css("img").first['src']
				if image_relative_path
					image_path = "http://xivdb.com/#{image_relative_path}"
					target_path = Rails.root.join("app/assets/images/items/#{id}.png")
					if File.exists?(target_path)
						puts "Skipping image #{image_path}"
					else
						download_image(image_path, target_path)
						wait image_path, 0.2
					end
				end
				item = { n: name, u: url, i: id, r: rarity, l: level, t: type, m: image_relative_path ? 1 : 0 }
				#puts item
				items << item
			end
			
			wait "Page #{page}"
		end
		
		@file.write("var items = " + items.to_json + ";")
	end
	
	def close
		@file.close if @file
	end
	
	private
	
	def download_image(from, to)
		open(to, "wb") { |file| file << open(from).read }
	end
	
	def page_url(page)
		URI::escape(%Q(http://xivdb.com/modules/search/search.php?query=!filters&pagearray={"item":#{page}}&language=1&filters="ITEMS:ICI_DATED_0"))
	end
	
	def get_column(element, column)
		return element[COLUMN_MAP[column]].text
	end
	
	def wait(message = nil, time = 10)
		puts "Sleeping (#{message}) - #{time}s"
		sleep(time)
	end
end