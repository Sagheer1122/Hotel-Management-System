#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Cleaning up bin files..."
# Fix line endings and shebangs for all bin files
find bin -type f -exec sed -i 's/\r$//' {} +
find bin -type f -exec sed -i 's/ruby\.exe/ruby/g' {} +
chmod +x bin/*

echo "Installing dependencies..."
bundle install

echo "Running migrations and seeding..."
RAILS_ENV=production bundle exec rails db:migrate db:seed

echo "Build complete!"
