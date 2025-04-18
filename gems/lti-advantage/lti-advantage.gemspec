# frozen_string_literal: true

require_relative "lib/lti_advantage/version"

Gem::Specification.new do |spec|
  spec.name          = "lti-advantage"
  spec.version       = LtiAdvantage::VERSION
  spec.authors       = ["Instructure"]
  spec.email         = ["opensource@instructure.com"]

  spec.summary       = "Ruby library for creating IMS LTI tool providers and consumers"
  spec.homepage      = "http://github.com/instructure/lti-advantage"
  spec.license       = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
  else
    raise "RubyGems 2.0 or newer is required to protect against " \
          "public gem pushes."
  end

  spec.files         = Dir.glob("{lib,spec}/**/*") + %w[test.sh]
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "activemodel", ">= 5.1"
  spec.add_dependency "json-jwt", "~> 1.5"
end
