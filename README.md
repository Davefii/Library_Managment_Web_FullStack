# Library Online

A full-stack library management project with a public library website, an authenticated member area, and an admin dashboard. The frontend consumes an ASP.NET Core Web API to support book discovery, category and author browsing, member management, borrowing workflows, and role-based access.

> This repository contains the frontend application. The backend API is maintained as a separate ASP.NET Core project and is expected to run at `https://localhost:7010` during local development.

## Project Overview

Library Online simulates a real-world library platform with three main experiences:

- **Public website:** browse books, categories, authors, book details, and related titles.
- **Member dashboard:** access member information and borrowing-related pages.
- **Admin dashboard:** manage books, authors, categories, members, users, borrowings, audit logs, and dashboard data.

The project focuses on practical frontend fundamentals: reusable JavaScript modules, API integration, dynamic DOM rendering, role-aware UI, responsive pages, and fast client-side filtering.

## Features

### Public Website

- Home page with library content and book collections
- Browse all public books
- Browse books by category
- Browse books by author
- Dynamic category and author counts
- Book details page with:
  - Cover image
  - Authors
  - Categories
  - ISBN
  - Publication year
  - Copy availability
  - Related books from the same category
- Details links that preserve the selected book ID in the URL
- Responsive layouts for desktop and mobile screens

### Authentication and Roles

- Login and registration pages
- Current-user lookup through the API
- Member and admin role detection
- User menu with dashboard and logout actions
- Borrow action visibility based on the current role

### Admin Dashboard

- Dashboard overview
- Book management
- Author management
- Category management
- Member management
- User management
- Borrowing management
- User profile management
- Audit log viewing
- Add, update, delete, return, and detail workflows where supported by the API

### Fast Local Search

Admin lists load their data once and filter it in the browser:

- Books: search by title or ISBN
- Members: search by name, email, phone, or address
- Borrowings: search by member name, email, or book title
- Borrowings: filter by active, returned, or overdue status
- Clearing a search restores the complete list without another API request

## Tech Stack

### Frontend

- HTML5
- CSS3
- Modern JavaScript ES Modules
- Fetch API
- Native DOM APIs
- Responsive layouts
- No frontend framework required

### Backend Integration

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- JWT authentication
- Refresh tokens
- BCrypt password hashing
- Role-based and ownership-based authorization
- Rate limiting
- API key protection
- Audit logging
- Swagger / OpenAPI

## Repository Structure

```text
Library Website Project/
|-- admin-dashboard/       # Admin pages and management scripts
|-- API_service_layer/      # Frontend API modules
|-- auth/                   # Login and registration pages
|-- authors/                # Public author directory
|-- book-details/          # Dynamic book details page
|-- catalog/                # Public catalog and filtered book pages
|-- categories/             # Public category directory
|-- Components/             # Shared header, footer, and book card markup
|-- home/                   # Public home page
|-- js/                     # Shared frontend controllers and renderers
|-- MemberDashboard/        # Member-facing pages
|-- DESIGN.md              # Visual design system and UI decisions
|-- package.json             # Minimal JavaScript module configuration
|-- README.md               # Project documentation
```

## Frontend Architecture

The frontend is organized around small modules with focused responsibilities:

- `API_service_layer/` contains fetch functions for books, authors, categories, users, members, borrowings, and dashboard data.
- `js/layout.js` loads shared header and footer components.
- `js/auth.js` loads the current user and renders the role-aware user menu.
- `js/book-renderer.js` creates reusable book cards and details links.
- Page controllers such as `categories-page.js`, `authors-page.js`, and `filtered-books.js` load data and update the DOM.
- `admin-dashboard/SharedModules/TableRenderer.js` provides shared table rendering and action handling.

The pages use query-string IDs for navigation. For example:

```text
book-details/Details_Book.html?id=4
catalog/books-by-category.html?id=1
catalog/books-by-author.html?id=2
```

## Getting Started

### Prerequisites

- A modern web browser
- A local static web server
- Node.js installed if you want to use a simple local server
- The companion ASP.NET Core API running at `https://localhost:7010`

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/library-website.git
cd library-website
```

### 2. Start the backend

Start the companion ASP.NET Core API first. The frontend API modules currently use:

```text
https://localhost:7010
```

If your API uses another URL, update the `API_URL` constants in `API_service_layer/` or centralize the base URL in a shared configuration module.

Make sure the backend has:

- SQL Server configured
- Database migrations applied
- HTTPS development certificate trusted
- CORS configured for the frontend origin
- Required JWT and API key settings configured

### 3. Start the frontend

Because the project uses ES modules and fetches shared HTML components, serve it through HTTP instead of opening HTML files directly.

For example, with a static server:

```bash
npx serve .
```

Then open the URL shown by the server, for example:

```text
http://localhost:3000/home/Home.html
```

You can also use the Live Server extension in VS Code.

## Backend API

The frontend expects endpoints similar to the following:

### Public Books

```text
GET /api/Books/ListBooksForAnyone
GET /api/Books/GetAllPapularBooksForAnyone
GET /api/Books/GetBookByID{id}
GET /api/Books/ListBooksByAuthorForAnyone/{authorId}
GET /api/Books/ListBooksByCategorieForAnyone/{categoryId}
GET /api/Books/TotalBooksByAuthor/{authorId}
GET /api/Books/TotalBooksByCategory/{categoryId}
```

### Public Authors and Categories

```text
GET /api/Authors/ListAuthorsForAnyone
GET /GetAllCategorysForAnyone
```

### Authenticated Operations

```text
GET    /api/Books/ListBooks
POST   /api/Books/AddBook
PUT    /api/Books/UpdateBookBy{id}
DELETE /api/Books/DeleteBookBy{id}
GET    /api/Members/ListMembers
GET    /api/Borrowings/ListBorrowings
POST   /api/Borrowings/AddBorrowing
POST   /api/Borrowings/returnBookBy{id}
```

The exact route names are defined in the backend and mirrored by the frontend service modules.

## Backend Summary

The companion API provides a layered ASP.NET Core implementation with:

- Authentication using JWT access tokens
- Refresh token rotation and revocation
- BCrypt password hashing
- Admin and member roles
- Ownership-based authorization
- User, member, author, category, and book management
- Borrowing and returning workflows
- Availability and overdue tracking
- Dashboard statistics
- Audit logging for important actions
- Rate limiting and API key protection
- SQL Server persistence through Entity Framework Core
- Swagger documentation

A backend README should be kept beside the API repository with its own database, environment variable, migration, and deployment instructions.

## Learning Outcomes

This project helped develop practical experience with:

- Structuring a multi-page frontend application
- Using JavaScript ES modules and imports
- Calling REST APIs with `fetch`
- Handling JSON responses and API errors
- Rendering dynamic HTML with the DOM API
- Building reusable renderers and table utilities
- Passing IDs between pages with URL query parameters
- Managing authenticated and unauthenticated UI states
- Applying role-based visibility rules
- Implementing client-side filtering with `filter`, `map`, `some`, and `Promise.all`
- Designing CRUD interfaces
- Working with images, forms, tables, status badges, and modal-like popup flows
- Connecting frontend behavior to a layered backend API
- Thinking about performance by avoiding unnecessary API requests

## Current Limitations and Recommended Next Steps

The core project is complete for its current scope. The following improvements would make it more production-ready:

- Add automated unit tests for API modules and render functions
- Add integration or end-to-end tests for login, CRUD, borrowing, and search flows
- Move the API base URL into environment-specific configuration
- Add a production deployment configuration for frontend and backend
- Add CI checks for syntax, formatting, and tests
- Implement the Borrow button action end to end if it is not already connected to the borrowing API
- Add book reviews and ratings with backend support
- Add pagination for large admin tables and public catalogs
- Add debounced search for very large client-side lists
- Improve loading, empty, and error states with accessible live regions
- Add centralized API error and authentication handling
- Add accessibility testing for keyboard navigation, focus states, labels, and contrast
- Add image fallback handling and upload validation
- Add security documentation for CORS, secrets, HTTPS, and token storage
- Avoid committing secrets, connection strings, or development tokens

## Screenshots

Add screenshots here before publishing the repository:

```text
screenshots/home.png
screenshots/catalog.png
screenshots/book-details.png
screenshots/admin-dashboard.png
```

Example Markdown:

```markdown
![Home page](screenshots/home.png)
```

## Security Notes

- Do not commit JWT secrets, API keys, database passwords, or refresh tokens.
- Use environment variables or secure deployment configuration for sensitive values.
- Keep HTTPS enabled when authentication cookies or tokens are in use.
- Configure CORS to allow only trusted frontend origins.
- Validate and authorize all sensitive operations on the backend; frontend visibility checks are not security boundaries.

## Author

Developed as a learning and portfolio project to practice full-stack library management, modern ASP.NET Core API development, frontend API integration, authentication, authorization, CRUD workflows, and secure application architecture.

## License

No license has been selected yet. Add a license before accepting external contributions or publishing the project for reuse.
