# frozen_string_literal: true

require "json"
require "pathname"
require "set"
require "yaml"

module ArgumentGraph
  NODE_TYPES = %w[question claim hypothesis evidence objection assumption conclusion].freeze
  RELATION_TYPES = %w[
    supports attacks contradicts entails assumes depends-on explains alternative-to
  ].freeze
  STATUSES = %w[open tentative accepted rejected unknown].freeze
  BELIEF_TYPES = %w[probability qualitative unknown].freeze
  CONFIDENCE_LEVELS = %w[low medium high].freeze
  ID_PATTERN = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/

  class ValidationError < StandardError
    attr_reader :errors

    def initialize(errors)
      @errors = errors
      super(errors.join("\n"))
    end
  end

  class Loader
    def initialize(root)
      @root = Pathname(root)
    end

    def load_all
      source_paths.map do |path|
        data = YAML.safe_load(path.read, aliases: false)
        [path, data]
      rescue Psych::Exception => e
        raise ValidationError, ["#{relative(path)}: invalid YAML: #{e.message.lines.first.strip}"]
      end
    end

    private

    def source_paths
      Dir[@root.join("_arguments", "*.{yml,yaml}")].sort.map { |path| Pathname(path) }
    end

    def relative(path)
      path.relative_path_from(@root)
    end
  end

  class Validator
    GRAPH_KEYS = %w[version id title description views nodes edges].freeze
    VIEW_KEYS = %w[id title description nodes].freeze
    NODE_KEYS = %w[id type title body epistemics sources].freeze
    EPISTEMIC_KEYS = %w[status belief confidence cruxes updates].freeze
    UPDATE_KEYS = %w[up down].freeze
    BELIEF_KEYS = %w[type value].freeze
    SOURCE_KEYS = %w[title url note].freeze
    EDGE_KEYS = %w[id from to type strength note].freeze

    def validate(graph, path: "argument graph")
      @errors = []
      @path = path.to_s

      unless graph.is_a?(Hash)
        error("must be a YAML object")
        return @errors
      end

      validate_keys(graph, GRAPH_KEYS, "graph")
      validate_version(graph["version"])
      validate_id(graph["id"], "graph id")
      validate_nonempty_string(graph["title"], "graph title")
      validate_optional_string(graph["description"], "graph description")

      nodes = validate_array(graph["nodes"], "nodes", nonempty: true)
      edges = validate_array(graph["edges"], "edges")
      views = validate_array(graph["views"], "views") if graph.key?("views")

      validate_nodes(nodes)
      validate_edges(edges, nodes)
      validate_views(views, nodes) if graph.key?("views")
      @errors
    end

    private

    def validate_version(version)
      error("graph version must be 1") unless version == 1
    end

    def validate_nodes(nodes)
      return unless nodes

      ids = []
      nodes.each_with_index do |node, index|
        context = "node ##{index + 1}"
        unless node.is_a?(Hash)
          error("#{context} must be an object")
          next
        end

        context = "node '#{node["id"] || index + 1}'"
        validate_keys(node, NODE_KEYS, context)
        validate_id(node["id"], "#{context} id")
        validate_enum(node["type"], NODE_TYPES, "#{context} type")
        validate_nonempty_string(node["title"], "#{context} title")
        validate_optional_string(node["body"], "#{context} body")
        validate_epistemics(node["epistemics"], context) if node.key?("epistemics")
        validate_sources(node["sources"], context) if node.key?("sources")
        ids << node["id"] if node["id"].is_a?(String)
      end

      duplicate_values(ids).each { |id| error("duplicate node id '#{id}'") }
    end

    def validate_edges(edges, nodes)
      return unless edges

      node_ids = Array(nodes).filter_map { |node| node["id"] if node.is_a?(Hash) }.to_set
      edge_ids = []

      edges.each_with_index do |edge, index|
        context = "edge ##{index + 1}"
        unless edge.is_a?(Hash)
          error("#{context} must be an object")
          next
        end

        context = "edge '#{edge["id"] || index + 1}'"
        validate_keys(edge, EDGE_KEYS, context)
        validate_id(edge["id"], "#{context} id")
        validate_id(edge["from"], "#{context} from")
        validate_id(edge["to"], "#{context} to")
        validate_enum(edge["type"], RELATION_TYPES, "#{context} type")
        validate_optional_string(edge["note"], "#{context} note")
        validate_unit_number(edge["strength"], "#{context} strength") if edge.key?("strength")

        if edge["from"].is_a?(String) && !node_ids.include?(edge["from"])
          error("#{context} refers to nonexistent source node '#{edge["from"]}'")
        end
        if edge["to"].is_a?(String) && !node_ids.include?(edge["to"])
          error("#{context} refers to nonexistent target node '#{edge["to"]}'")
        end

        edge_ids << edge["id"] if edge["id"].is_a?(String)
      end

      duplicate_values(edge_ids).each { |id| error("duplicate edge id '#{id}'") }
    end

    def validate_views(views, nodes)
      return unless views

      node_ids = Array(nodes).filter_map { |node| node["id"] if node.is_a?(Hash) }.to_set
      view_ids = []

      views.each_with_index do |view, index|
        context = "view ##{index + 1}"
        unless view.is_a?(Hash)
          error("#{context} must be an object")
          next
        end

        context = "view '#{view["id"] || index + 1}'"
        validate_keys(view, VIEW_KEYS, context)
        validate_id(view["id"], "#{context} id")
        validate_nonempty_string(view["title"], "#{context} title")
        validate_optional_string(view["description"], "#{context} description")

        selected_nodes = validate_array(view["nodes"], "#{context} nodes", nonempty: true)
        if selected_nodes
          selected_nodes.each_with_index do |node_id, node_index|
            label = "#{context} node ##{node_index + 1}"
            validate_id(node_id, label)
            if node_id.is_a?(String) && !node_ids.include?(node_id)
              error("#{context} refers to nonexistent node '#{node_id}'")
            end
          end
          duplicate_values(selected_nodes.select { |node_id| node_id.is_a?(String) }).each do |node_id|
            error("#{context} includes duplicate node '#{node_id}'")
          end
        end

        view_ids << view["id"] if view["id"].is_a?(String)
      end

      duplicate_values(view_ids).each { |id| error("duplicate view id '#{id}'") }
    end

    def validate_epistemics(epistemics, context)
      unless epistemics.is_a?(Hash)
        error("#{context} epistemics must be an object")
        return
      end

      validate_keys(epistemics, EPISTEMIC_KEYS, "#{context} epistemics")
      validate_enum(epistemics["status"], STATUSES, "#{context} status") if epistemics.key?("status")
      if epistemics.key?("confidence")
        validate_enum(epistemics["confidence"], CONFIDENCE_LEVELS, "#{context} confidence")
      end
      validate_belief(epistemics["belief"], context) if epistemics.key?("belief")
      validate_string_array(epistemics["cruxes"], "#{context} cruxes") if epistemics.key?("cruxes")
      validate_updates(epistemics["updates"], context) if epistemics.key?("updates")
    end

    def validate_updates(updates, context)
      unless updates.is_a?(Hash)
        error("#{context} updates must be an object")
        return
      end

      validate_keys(updates, UPDATE_KEYS, "#{context} updates")
      error("#{context} updates must include up or down observations") if updates.empty?
      UPDATE_KEYS.each do |direction|
        next unless updates.key?(direction)

        validate_array(updates[direction], "#{context} updates #{direction}", nonempty: true)&.each_with_index do |item, index|
          validate_nonempty_string(item, "#{context} updates #{direction} item ##{index + 1}")
        end
      end
    end

    def validate_belief(belief, context)
      unless belief.is_a?(Hash)
        error("#{context} belief must be an object")
        return
      end

      validate_keys(belief, BELIEF_KEYS, "#{context} belief")
      type = belief["type"]
      validate_enum(type, BELIEF_TYPES, "#{context} belief type")

      case type
      when "probability"
        unless belief.key?("value")
          error("#{context} probability belief requires a value")
          return
        end
        validate_unit_number(belief["value"], "#{context} probability belief value")
      when "qualitative"
        validate_nonempty_string(belief["value"], "#{context} qualitative belief value")
      when "unknown"
        error("#{context} unknown belief must not include a value") if belief.key?("value")
      end
    end

    def validate_sources(sources, context)
      sources = validate_array(sources, "#{context} sources")
      return unless sources

      sources.each_with_index do |source, index|
        source_context = "#{context} source ##{index + 1}"
        unless source.is_a?(Hash)
          error("#{source_context} must be an object")
          next
        end

        validate_keys(source, SOURCE_KEYS, source_context)
        error("#{source_context} must include title, url, or note") if source.empty?
        SOURCE_KEYS.each do |key|
          validate_optional_string(source[key], "#{source_context} #{key}")
        end
      end
    end

    def validate_keys(object, allowed, context)
      (object.keys - allowed).each { |key| error("#{context} has unknown field '#{key}'") }
    end

    def validate_array(value, label, nonempty: false)
      unless value.is_a?(Array)
        error("#{label} must be an array")
        return nil
      end
      error("#{label} must contain at least one item") if nonempty && value.empty?
      value
    end

    def validate_string_array(value, label)
      value = validate_array(value, label)
      return unless value

      value.each_with_index do |item, index|
        validate_nonempty_string(item, "#{label} item ##{index + 1}")
      end
    end

    def validate_enum(value, allowed, label)
      error("#{label} must be one of: #{allowed.join(", ")}") unless allowed.include?(value)
    end

    def validate_id(value, label)
      return if value.is_a?(String) && value.match?(ID_PATTERN)

      error("#{label} must use lowercase kebab-case")
    end

    def validate_nonempty_string(value, label)
      error("#{label} must be a nonempty string") unless value.is_a?(String) && !value.strip.empty?
    end

    def validate_optional_string(value, label)
      error("#{label} must be a string") unless value.nil? || value.is_a?(String)
    end

    def validate_unit_number(value, label)
      valid = value.is_a?(Numeric) && value.finite? && value.between?(0, 1)
      error("#{label} must be a number between 0 and 1") unless valid
    end

    def duplicate_values(values)
      values.group_by(&:itself).select { |_value, occurrences| occurrences.length > 1 }.keys
    end

    def error(message)
      @errors << "#{@path}: #{message}"
    end
  end

  class Compiler
    MAPPED_CLAIM_PATTERN = /\[[^\]\n]+\]\(([^)\n]+)\)\{:[^}\n]*\.mapped-claim[^}\n]*\}/
    MAPPED_CLAIM_TARGET_PATTERN = /\A#argument-map\?node=([a-z0-9]+(?:-[a-z0-9]+)*)\z/

    def initialize(root)
      @root = Pathname(root)
    end

    def compile
      loaded = Loader.new(@root).load_all
      errors = []
      graphs = {}

      loaded.each do |path, graph|
        relative = path.relative_path_from(@root).to_s
        errors.concat(Validator.new.validate(graph, path: relative))

        next unless graph.is_a?(Hash) && graph["id"].is_a?(String)

        expected_id = path.basename(path.extname).to_s
        errors << "#{relative}: graph id '#{graph["id"]}' must match filename '#{expected_id}'" if graph["id"] != expected_id
        errors << "#{relative}: duplicate graph id '#{graph["id"]}'" if graphs.key?(graph["id"])
        graphs[graph["id"]] = graph
      end

      errors.concat(validate_post_references(graphs))
      raise ValidationError, errors unless errors.empty?

      graphs
    end

    private

    def validate_post_references(graphs)
      errors = []
      Dir[@root.join("_posts", "*")].sort.each do |post_path|
        path = Pathname(post_path)
        next unless path.file?

        source = path.read
        frontmatter = read_frontmatter(path, source)
        mapped_claim_targets = source.scan(MAPPED_CLAIM_PATTERN).flatten
        relative = path.relative_path_from(@root)

        unless frontmatter&.key?("argument_graph")
          mapped_claim_targets.each do |target|
            errors << "#{relative}: mapped claim '#{target}' requires argument_graph frontmatter"
          end
          next
        end

        graph_id = frontmatter["argument_graph"]
        unless graph_id.is_a?(String)
          errors << "#{relative}: argument_graph must be a graph id string"
          next
        end
        unless graphs.key?(graph_id)
          errors << "#{relative}: argument_graph '#{graph_id}' does not exist"
          next
        end

        graph = graphs.fetch(graph_id)
        view = nil
        if frontmatter.key?("argument_graph_view")
          view_id = frontmatter["argument_graph_view"]
          unless view_id.is_a?(String)
            errors << "#{relative}: argument_graph_view must be a view id string"
            next
          end

          view = Array(graph["views"]).find do |candidate|
            candidate.is_a?(Hash) && candidate["id"] == view_id
          end
          unless view
            errors << "#{relative}: argument graph '#{graph_id}' has no view '#{view_id}'"
            next
          end
        end

        node_ids = Array(graph["nodes"]).filter_map { |node| node["id"] if node.is_a?(Hash) }.to_set
        mapped_claim_targets.each do |target|
          match = target.match(MAPPED_CLAIM_TARGET_PATTERN)
          unless match
            errors << "#{relative}: mapped claim '#{target}' must target #argument-map?node=<node-id>"
            next
          end

          node_id = match[1]
          unless node_ids.include?(node_id)
            errors << "#{relative}: mapped claim refers to nonexistent node '#{node_id}' in graph '#{graph_id}'"
            next
          end

          if view && !Array(view["nodes"]).include?(node_id)
            errors << "#{relative}: mapped claim node '#{node_id}' is not included in view '#{view["id"]}'"
          end
        end
      end
      errors
    end

    def read_frontmatter(path, source = path.read)
      match = source.match(/\A---\s*\n(.*?)\n---\s*\n/m)
      return nil unless match

      YAML.safe_load(match[1], aliases: false)
    rescue Psych::Exception => e
      raise ValidationError, ["#{path.relative_path_from(@root)}: invalid frontmatter: #{e.message.lines.first.strip}"]
    end
  end
end
