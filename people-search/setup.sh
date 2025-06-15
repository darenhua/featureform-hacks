#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Set environment variables if needed
export PYTHONUNBUFFERED=1 