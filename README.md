# basic-ecommerce-quikdb

## Overview

The objective of this project is to build a basic e-commerce application that enables users to perform CRUD operations on products, while ensuring role-based access control for authenticated and unauthenticated users. The application will demonstrate core backend development skills, including database interaction, authentication, and RESTful API design. The project will utilize Node.js and QuikDB’s Database to meet the requirements.

## Design Choices

- **Controller-Service-Repository Pattern:**  
  The application is organized into controllers (handling HTTP requests), services (containing business logic), and repositories (managed by QuikDB). This separation improves maintainability, testability, and scalability.

## Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd quikdb-final
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

## Running the Application

1. **Start app:**

   ```bash
   npm start
   ```

2. **Drop Schemas before app starts:**

   ```bash
   npm run hard:start
   ```

## Testing

1. **Run All Tests:**

   ```bash
   npm run test
   ```

## API Documentation

    https://documenter.getpostman.com/view/25115132/2sAYXFjJBW
