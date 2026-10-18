

# QuickNotes System Design

QuickNotes is a browser-based note-taking API client and a system design project for a service intended to support one million registered users.

## Project Overview

This project has two main parts:

1. A front-end API client that uses JSONPlaceholder to demonstrate loading, creating and deleting notes.
2. System design documents describing the production API, relational database and scalable architecture the backend team should build.

**Important:** JSONPlaceholder is a practice API. Its simulated create and delete operations do not permanently change server data.

## Features

- Load 10 notes using GET.
- Create notes using POST.
- Delete notes using DELETE.
- Validate that titles are required and no longer than 100 characters.
- Display loading, success, error and empty states.
- Use `textContent` to display note text safely.
- Document the production API, data model and architecture.

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to Run the API Client

1. Clone the repository:

   ```bash
   git clone https://github.com/Amoslove/quicknotes-system-design.git
   ```

2. Open the `quicknotes-system-design` folder in Visual Studio Code.

3. Open `index.html` with the Live Server extension, or serve the folder using a local web server.

4. Click **Load notes** to retrieve 10 sample notes.

5. Enter a title and optional body, then click **Create note**.

6. Click **Delete** on a note to test the DELETE request.

An internet connection is required to reach JSONPlaceholder.

## Design Documents

- [API Design](docs/api-design.md) — REST endpoints, request and response examples, authentication and errors.
- [Data Model](docs/data-model.md) — database entities, relationships, SQL tables, queries and indexes.
- [Architecture](docs/architecture.md) — requirements, traffic estimates, system diagram, request flows and reliability.

## What I Learned

1. How to use asynchronous JavaScript and `fetch()` to communicate with a REST API.
2. How GET, POST and DELETE requests work, including HTTP status codes and error handling.
3. Why API input validation and safe DOM text insertion are important.
4. How to design relational database tables with primary keys, foreign keys, joins and indexes.
5. How load balancing, caching, read replicas and background queues can support a growing service.
6. How Git commits and GitHub help track and publish project work.

## Future Improvements

- Connect the client to a real QuickNotes backend with persistent storage.
- Add user registration, authentication and authorisation.
- Support editing, searching, filtering and tagging notes.
- Add automated tests and production monitoring.

## Repository

https://github.com/Amoslove/quicknotes-system-design
