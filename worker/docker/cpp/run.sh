#!/bin/bash

set -e

cd /workspace

g++ Main.cpp -o Main

if [ -f input.txt ]; then
    ./Main < input.txt
else
    ./Main
fi