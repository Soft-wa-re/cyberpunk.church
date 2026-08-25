# frozen_string_literal: true

require "minitest/autorun"
require "fileutils"
require "tmpdir"
require_relative "../lib/argument_graph"

class ArgumentGraphValidatorTest < Minitest::Test
  def setup
    @validator = ArgumentGraph::Validator.new
  end

  def test_accepts_a_valid_graph
    assert_empty @validator.validate(valid_graph, path: "valid.yml")
  end

  def test_rejects_duplicate_node_ids_and_missing_endpoints
    graph = valid_graph
    graph["nodes"] << graph["nodes"].first.dup
    graph["edges"].first["to"] = "missing-node"

    errors = @validator.validate(graph, path: "broken.yml")

    assert errors.any? { |error| error.include?("duplicate node id 'question'") }
    assert errors.any? { |error| error.include?("nonexistent target node 'missing-node'") }
  end

  def test_rejects_unknown_node_and_relation_types
    graph = valid_graph
    graph["nodes"].first["type"] = "fact"
    graph["edges"].first["type"] = "maybe-supports"

    errors = @validator.validate(graph, path: "broken.yml")

    assert errors.any? { |error| error.include?("node 'question' type must be one of") }
    assert errors.any? { |error| error.include?("edge 'evidence-supports-question' type must be one of") }
  end

  def test_rejects_probability_outside_zero_and_one
    graph = valid_graph
    graph["nodes"].first["epistemics"] = {
      "belief" => { "type" => "probability", "value" => 1.2 }
    }

    errors = @validator.validate(graph, path: "broken.yml")

    assert errors.any? { |error| error.include?("probability belief value must be a number between 0 and 1") }
  end

  def test_rejects_duplicate_views_and_missing_view_nodes
    graph = valid_graph
    graph["views"] = [
      { "id" => "post-view", "title" => "Post view", "nodes" => %w[question missing-node] },
      { "id" => "post-view", "title" => "Duplicate view", "nodes" => %w[question question] }
    ]

    errors = @validator.validate(graph, path: "broken.yml")

    assert errors.any? { |error| error.include?("refers to nonexistent node 'missing-node'") }
    assert errors.any? { |error| error.include?("includes duplicate node 'question'") }
    assert errors.any? { |error| error.include?("duplicate view id 'post-view'") }
  end

  def test_rejects_invalid_directional_updates
    graph = valid_graph
    graph["nodes"].first["epistemics"] = {
      "updates" => { "up" => [], "sideways" => ["An unsupported direction"] }
    }

    errors = @validator.validate(graph, path: "broken.yml")

    assert errors.any? { |error| error.include?("updates has unknown field 'sideways'") }
    assert errors.any? { |error| error.include?("updates up must contain at least one item") }
  end

  def test_validator_enums_match_the_canonical_schema
    schema_path = File.expand_path("../_schemas/argument-graph.schema.json", __dir__)
    definitions = JSON.parse(File.read(schema_path)).fetch("$defs")

    assert_equal ArgumentGraph::NODE_TYPES, definitions.fetch("nodeType").fetch("enum")
    assert_equal ArgumentGraph::RELATION_TYPES, definitions.fetch("relationType").fetch("enum")
    assert_equal ArgumentGraph::BELIEF_TYPES,
                 definitions.fetch("belief").fetch("properties").fetch("type").fetch("enum")
  end

  private

  def valid_graph
    {
      "version" => 1,
      "id" => "valid-graph",
      "title" => "A valid graph",
      "nodes" => [
        { "id" => "question", "type" => "question", "title" => "What follows?" },
        { "id" => "evidence", "type" => "evidence", "title" => "An observation" }
      ],
      "edges" => [
        {
          "id" => "evidence-supports-question",
          "from" => "evidence",
          "to" => "question",
          "type" => "supports"
        }
      ]
    }
  end
end

class ArgumentGraphCompilerTest < Minitest::Test
  def test_rejects_mapped_claims_missing_from_the_graph_or_post_view
    Dir.mktmpdir do |root|
      FileUtils.mkdir_p(File.join(root, "_arguments"))
      FileUtils.mkdir_p(File.join(root, "_posts"))

      graph = {
        "version" => 1,
        "id" => "site-map",
        "title" => "Site map",
        "views" => [
          { "id" => "post-view", "title" => "Post view", "nodes" => ["question"] }
        ],
        "nodes" => [
          { "id" => "question", "type" => "question", "title" => "A question" },
          { "id" => "evidence", "type" => "evidence", "title" => "Some evidence" }
        ],
        "edges" => []
      }
      File.write(File.join(root, "_arguments", "site-map.yml"), YAML.dump(graph))
      File.write(
        File.join(root, "_posts", "2026-01-01-post.md"),
        <<~MARKDOWN
          ---
          argument_graph: site-map
          argument_graph_view: post-view
          ---
          [Outside the view](#argument-map?node=evidence){:.mapped-claim}
          [Missing entirely](#argument-map?node=missing-node){:.mapped-claim}
        MARKDOWN
      )

      error = assert_raises(ArgumentGraph::ValidationError) do
        ArgumentGraph::Compiler.new(root).compile
      end

      assert_includes error.errors, "_posts/2026-01-01-post.md: mapped claim node 'evidence' is not included in view 'post-view'"
      assert_includes error.errors, "_posts/2026-01-01-post.md: mapped claim refers to nonexistent node 'missing-node' in graph 'site-map'"
    end
  end
end
