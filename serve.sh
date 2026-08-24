bundle install
npm install
npm run arguments:build
npm run assets:build

bundle exec jekyll serve --livereload &
JEKYLL_PID=$!

# Ensure Jekyll stops when this script exits or is interrupted
trap "echo 'Stopping Jekyll...'; kill $JEKYLL_PID" INT TERM EXIT

# Wait for server to be ready
while ! nc -z localhost 4000; do
  sleep 0.2
done

# Open browser
open http://127.0.0.1:4000

# Wait on Jekyll process so Ctrl-C works correctly
wait $JEKYLL_PID
