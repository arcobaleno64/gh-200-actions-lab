#!/bin/sh
echo "RESULT11 docker args-count=[$#] arg1=[$1] INPUT_WHO-TO-GREET=[$(env | grep '^INPUT_WHO' | cut -d= -f2-)] pwd=[$(pwd)] workspace-env=[$GITHUB_WORKSPACE] github-output-set=[$([ -n "$GITHUB_OUTPUT" ] && echo yes || echo no)]"
echo "greeting=Hello $1" >> "$GITHUB_OUTPUT"
