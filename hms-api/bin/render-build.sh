#!/usr/bin/env bash
# exit on error
set -o errexit

# Fix line endings for all bin files (Windows to Linux conversion)
find bin -type f -exec sed -i 's/\r$//' {} +
chmod +x bin/*

bundle install

# Run migrations
bundle exec rails db:migrate

# Seed data (Rooms and Admin)
bundle exec rails db:seed
