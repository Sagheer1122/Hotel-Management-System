#!/usr/bin/env bash
# exit on error
set -o errexit

# Fix line endings and shebangs for all bin files
find bin -type f -exec sed -i 's/\r$//' {} +
find bin -type f -exec sed -i 's/ruby\.exe/ruby/g' {} +
chmod +x bin/*

bundle install

# Run migrations only (no seeds - will seed separately)
RAILS_ENV=production bundle exec rails db:migrate
