#!/bin/bash

# Clean up any existing netlify function builds
rm -rf .netlify/functions-serve

# Install root project dependencies
npm install

# Create functions directory and views subdirectory
mkdir -p netlify/functions/views

# Copy views files
cp -r views/* netlify/functions/views/

# Ensure node_modules exists in functions directory
cd netlify/functions
npm install
cd ../..

# Create symbolic link for node_modules in functions directory
mkdir -p .netlify/functions-serve/server
cd .netlify/functions-serve/server
ln -s ../../../node_modules .
cd ../../..
