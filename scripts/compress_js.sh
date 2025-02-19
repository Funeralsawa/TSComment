#! /bin/bash
JS_PATH=/home/acs/TSComment/system/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

find ${JS_PATH_SRC} -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}All.js

echo yes | python3 /home/acs/TSComment/manage.py collectstatic