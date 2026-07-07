#!/bin/sh

set -e

if [ -f input.txt ]; then
    node Main.js < input.txt
else
    node Main.js
fi