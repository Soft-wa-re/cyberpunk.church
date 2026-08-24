#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require_relative "../lib/argument_graph"

root = Pathname(__dir__).parent
check_only = ARGV.delete("--check")
abort("Usage: ruby scripts/build_argument_graphs.rb [--check]") unless ARGV.empty?

begin
  graphs = ArgumentGraph::Compiler.new(root).compile
  destination = root.join("assets", "argument-graphs")
  expected_paths = graphs.transform_values do |graph|
    destination.join("#{graph.fetch("id")}.json")
  end

  if check_only
    stale = []
    graphs.each do |id, graph|
      path = expected_paths.fetch(id)
      expected = JSON.pretty_generate(graph) + "\n"
      stale << path.relative_path_from(root).to_s unless path.file? && path.read == expected
    end
    expected = expected_paths.values.map(&:expand_path)
    Dir[destination.join("*.json")].each do |path|
      pathname = Pathname(path).expand_path
      stale << pathname.relative_path_from(root).to_s unless expected.include?(pathname)
    end

    unless stale.empty?
      raise ArgumentGraph::ValidationError,
            stale.map { |path| "#{path}: generated JSON is missing or out of date; run npm run arguments:build" }
    end
  else
    FileUtils.mkdir_p(destination)
    graphs.each do |id, graph|
      expected_paths.fetch(id).write(JSON.pretty_generate(graph) + "\n")
    end

    expected = expected_paths.values.map(&:expand_path)
    Dir[destination.join("*.json")].each do |path|
      FileUtils.rm_f(path) unless expected.include?(Pathname(path).expand_path)
    end
  end

  verb = check_only ? "Validated" : "Built"
  puts "#{verb} #{graphs.length} argument graph#{graphs.length == 1 ? "" : "s"}."
rescue ArgumentGraph::ValidationError => e
  warn "Argument graph validation failed:"
  e.errors.each { |error| warn "  - #{error}" }
  exit 1
end
