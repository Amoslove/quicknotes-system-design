

# QuickNotes API Design

## 1. Overview

QuickNotes is a note-taking service that allows registered users to create, view, update, organise and delete notes. The production API will use REST principles and JSON for request and response bodies. All endpoints use HTTPS.

Base URL: `https://api.quicknotes.example/v1`

Authentication: Protected endpoints require a valid bearer access token.

## 2. Endpoint Table

| Method | Path | Description | Success Status |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | 201 Created |
| POST | `/auth/login` | Authenticate a user | 200 OK |
| GET | `/notes` | List the authenticated user's notes, with pagination | 200 OK |
| POST | `/notes` | Create a note | 201 Created |
| GET | `/notes/{id}` | Retrieve one note | 200 OK |
| PATCH | `/notes/{id}` | Update part of a note | 200 OK |
| DELETE | `/notes/{id}` | Delete a note | 204 No Content |
| GET | `/tags` | List the user's tags | 200 OK |
| POST | `/notes/{id}/tags` | Attach a tag to a note | 201 Created |

All note and tag endpoints require authentication. Users may access only resources they are authorised to use.

## 3. List Notes

### Request

`GET /v1/notes?page=1&limit=20`

Headers:

`Authorization: Bearer <access_token>`

`Accept: application/json`

### Response — 200 OK

```json
{
  "data": [
    {
      "id": "note_101",
      "title": "Learning JavaScript",
      "body": "Practise API requests.",
      "createdAt": "2026-10-18T10:00:00Z",
      "updatedAt": "2026-10-18T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

An empty collection returns `data: []` and a total of zero.

## 4. Create a Note

### Request

`POST /v1/notes`

Headers:

`Authorization: Bearer <access_token>`

`Content-Type: application/json`

Request body:

```json
{
  "title": "My first note",
  "body": "This is my note."
}
```

The title is required and must contain 1–100 characters after trimming. The body is optional.

### Response — 201 Created

```json
{
  "data": {
    "id": "note_102",
    "title": "My first note",
    "body": "This is my note.",
    "createdAt": "2026-10-18T10:05:00Z",
    "updatedAt": "2026-10-18T10:05:00Z"
  }
}
```

The response includes a `Location` header pointing to `/v1/notes/note_102`.

## 5. Update and Delete Notes

### Update

`PATCH /v1/notes/{id}`

Example request:

```json
{
  "title": "Updated note title"
}
```

A successful update returns `200 OK` and the updated note.

### Delete

`DELETE /v1/notes/{id}`

A successful deletion returns `204 No Content` with no response body. Deleting a note that does not exist or is not accessible returns `404 Not Found`.

## 6. Error Status Codes

| Status | Name | Meaning |
|---|---|---|
| 400 | Bad Request | Invalid input or malformed JSON |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated user lacks permission |
| 404 | Not Found | Resource does not exist or is not accessible |
| 409 | Conflict | Duplicate resource or conflicting operation |
| 422 | Unprocessable Entity | Valid JSON that fails field validation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server-side failure |
| 503 | Service Unavailable | Service temporarily unavailable |

### Example Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "title",
        "message": "Title is required and must not exceed 100 characters."
      }
    ],
    "requestId": "req_a82f91"
  }
}
```

Error responses use a consistent structure. The `requestId` helps the support and engineering teams investigate failures without exposing sensitive information.

## 7. Pagination and Security

The list endpoint supports `page` and `limit` parameters. The server enforces a maximum page size of 100 records.

The API must validate input, use parameterised database queries, enforce per-user authorisation, rate-limit abusive requests and avoid returning passwords, tokens or internal error details. Production traffic must use HTTPS.

## 8. JSONPlaceholder vs the Real API

JSONPlaceholder is a practice API used by the browser client to demonstrate GET, POST and DELETE. Its write operations are simulated and are not permanently stored.

The real QuickNotes backend will authenticate users, persist notes in a database, enforce ownership, return consistent errors and provide durable create, update and delete operations.
