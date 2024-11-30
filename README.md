# Mango test - FRAN ARAGÓN

## Deployment

You can view the live deployment of this project at the following link:  
[Live Demo]()

## Overview

This repository contains the Range component, developed as part of a coding exercise. The web application provides two types of custom range sliders: one for a normal range of values and another with fixed set values. This README provides an overview of the project structure, functionalities, and setup instructions.

## Table of Contents

- [Features](#features)
- [Technology Stack](#tech-stack)
- [Installation and Setup](#installation-setup)

<a id="features"></a>
## Features

The project includes the following core functionalities:

1. **Normal Range Slider**:
   - A custom range slider component that allows the user to select a value between a minimum and maximum range. The user can drag two handles along the range line, and adjust the values by clicking on the labels. The component ensures that the minimum value is not exceeded and that the maximum value is not crossed.
   - The slider supports a cursor change when hovered over, enlarging the handles to indicate that they are draggable.
   - The component utilizes a mocked HTTP service to fetch the minimum and maximum values.

2. **Fixed Values Range Slider**:
   - A custom range slider with fixed values such as [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]. The user can select only values within this predefined set. The slider ensures that the minimum and maximum values are not crossed.
   - The component is designed so that currency values cannot be changed; they are displayed as labels.
   - A mocked HTTP service provides the range values, and the component allows the user to interact with the range line by dragging two handles.

3. **Unit Tests for Range Components**:
   - Unit tests are implemented to ensure the functionality of the components, including value manipulation, handle dragging, and label changes. These tests are designed to simulate user interactions and validate the behavior of both the normal range and fixed value sliders.
  
4. **Header Navigation**:
   - Even though not explicitly required, a Header component has been implemented to provide navigation between the two exercises (Normal Range and Fixed Values). The header allows users to easily switch between both exercises, improving user experience and providing a more structured application flow. The header includes links to the corresponding routes, helping users navigate between the exercises smoothly.

<a id="tech-stack"></a>
## Technology Stack

The project uses the following technologies and libraries:

- **React (v18.3.1)**: JavaScript library for building user interfaces with reusable components.
- **Next (v15.0.3)**: React framework for server-side rendering, static site generation, and routing.
- **TypeScript (v5.7.2)**: Superset of JavaScript that adds static typing for improved development.
- **Styled-components (v6.1.13)**: Library for writing CSS in JavaScript, scoped to components.

<a id="installation-setup"></a>
## Installation and Setup

To set up this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mango-test

2. Install dependencies:

   ```bash
   npm install

4. Run the Application:
Start the development server:
   ```bash
   npm run dev

The app should now be running on http://localhost:3000.
