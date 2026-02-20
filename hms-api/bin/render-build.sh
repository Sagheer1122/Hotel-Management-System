#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rails db:migrate
# if you have seeds, you might want to run them only once
bundle exec rails db:seed
