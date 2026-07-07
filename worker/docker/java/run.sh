#!/bin/bash

set -e

javac Main.java

if [ -f input.txt ]; then
    java Main < input.txt
else
    java Main
fi