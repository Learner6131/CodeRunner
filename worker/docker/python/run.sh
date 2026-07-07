#!/bin/bash

set -e

if [ -f input.txt ]; then
    python3 Main.py < input.txt
else
    python3 Main.py
fi