## Setup Instructions:

To set up and run this project, follow these steps:

- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Run Development Server**:
  ```bash
  npm run dev
  ```
  (This will start the Next.js development server.)
- **Build for Production**:
  ```bash
  npm run build
  ```
  (This will build the Next.js application for production deployment.)
- **Start Production Server**:
  ```bash
  npm run start
  ```
  (This will start the Next.js production server after building.)
- **Run Linter**:
  ```bash
  npm run lint
  ```
  (This will run the configured linter to check for code style and quality issues.)

## Notes and Decisions Made:

- **Next.js App Router Usage**:

  - The Next.js App Router was chosen as it was the default choice for a new Next.js project at the time of development.

- **Styling with Tailwind CSS**:

  - Tailwind CSS was selected primarily to avoid writing custom CSS and to leverage its extensive set of pre-defined classes for rapid UI development.

- **Mobile Responsiveness**:

  - Using Tailwind CSS `container` classes and responsive design principles.

- **Custom Error, Loading, and Not Found Pages**:

  - Custom error, loading, and not-found pages were implemented to improve user feedback by displaying more informative messages and custom designs for error, loading, and not-found scenarios.

- **TypeScript Adoption**:

  - TypeScript was beneficial for catching type-related errors early in development, improving code quality and maintainability.

- **SQLite Database Implementation**:
  - The "Store the stories in a SQLite Database" feature was implemented using the `sqlite` and `sqlite3` libraries. The database is configured in [`lib/db.ts`](lib/db.ts), with a `hackerNews.db` file and a `stories` table to cache Hacker News story data for data persistence and performance optimization.
