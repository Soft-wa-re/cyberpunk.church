# frozen_string_literal: true

require "cgi"
require "erb"
require "fileutils"
require "open3"
require "tmpdir"
require "uri"
require "yaml"

ROOT = File.expand_path("..", __dir__)
CONFIG_PATH = File.join(ROOT, "_config.yml")
TEMPLATE_PATH = File.join(__dir__, "cyberpunk-church-og.svg.erb")
SVG_PATH = File.join(ROOT, "cyberpunk-church-og.svg")
PNG_PATH = File.join(ROOT, "cyberpunk-church-og.png")

def required_value(mapping, key, context)
  value = mapping[key]
  abort "Missing #{context}.#{key} in _config.yml" if value.nil? || value.to_s.strip.empty?

  value.to_s
end

def xml(value)
  CGI.escapeHTML(value.to_s)
end

config = YAML.safe_load(File.read(CONFIG_PATH), aliases: true)
featured = config.fetch("featured", {})
social_card = config.fetch("social_card", {})

site_title = required_value(config, "title", "site")
site_description = required_value(config, "description", "site")
site_url = required_value(config, "url", "site")
featured_text = required_value(featured, "text", "featured")
card_tagline = required_value(social_card, "tagline", "social_card")
card_prompt = required_value(social_card, "prompt", "social_card")
site_domain = URI.parse(site_url).host
abort "site.url must be an absolute URL in _config.yml" if site_domain.nil?

svg = ERB.new(File.read(TEMPLATE_PATH), trim_mode: "-").result(binding)
check_only = ARGV.delete("--check")
abort "Unknown arguments: #{ARGV.join(' ')}" unless ARGV.empty?

Dir.mktmpdir("cyberpunk-church-social-card") do |directory|
  rendered_svg = File.join(directory, "cyberpunk-church-og.svg")
  rendered_png = File.join(directory, "cyberpunk-church-og.png")
  File.write(rendered_svg, svg)

  begin
    _stdout, stderr, status = Open3.capture3(
      "rsvg-convert",
      "--format=png",
      "--width=1200",
      "--height=627",
      "--output=#{rendered_png}",
      rendered_svg
    )
  rescue Errno::ENOENT
    abort "Could not find rsvg-convert. Install librsvg (Homebrew: brew install librsvg)."
  end
  unless status.success?
    abort "Could not render the social card. Install librsvg (Homebrew: brew install librsvg).\n#{stderr}"
  end

  if check_only
    stale = []
    stale << File.basename(SVG_PATH) unless File.exist?(SVG_PATH) && File.binread(SVG_PATH) == File.binread(rendered_svg)
    stale << File.basename(PNG_PATH) unless File.exist?(PNG_PATH) && File.binread(PNG_PATH) == File.binread(rendered_png)
    abort "Generated social-card files are stale: #{stale.join(', ')}. Run npm run social-card:build." unless stale.empty?

    puts "Social-card SVG and PNG are up to date."
  else
    FileUtils.cp(rendered_svg, SVG_PATH)
    FileUtils.cp(rendered_png, PNG_PATH)
    puts "Built #{File.basename(SVG_PATH)} and #{File.basename(PNG_PATH)}."
  end
end
