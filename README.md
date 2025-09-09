# Earthquake Tracker - CSS Error Fix

A project demonstrating the identification and correction of common CSS errors in web development, with a focus on an earthquake tracker application interface.

## Overview

This project showcases how to identify and fix common CSS errors that can break website layouts and styling. The example focuses on an earthquake tracker application but the principles apply to any web project.

## Issues Fixed

1. **Missing closing quote in color values**
   - Fixed: `color: "#4fc3f7;` → `color: #4fc3f7;`

2. **Missing closing parenthesis in rgba function**
   - Fixed: `background: [rgba(255, 255, 255, 0.1);` → `background: rgba(255, 255, 255, 0.1);`

3. **Double dot in class selector**
   - Fixed: `..loading` → `.loading`

4. **Added standard 'appearance' property for compatibility**
   - Added: `appearance: none;` alongside vendor prefixes

## Features

- Clean, dark-themed interface for easy reading of code
- Syntax highlighting for better code visualization
- Detailed explanation of each error and why it matters
- CSS best practices and tips
- Fully responsive design

## Technologies Used

- HTML5
- CSS3 with modern features like Flexbox
- Font Awesome icons
- Responsive design principles

## Getting Started

To view this project, simply clone the repository and open the `index.html` file in any modern web browser:

```bash
git clone https://github.com/your-username/earthquake-tracker-css-fix.git
cd earthquake-tracker-css-fix
