

# QuickNotes Data Model

## 1. Overview

QuickNotes will use PostgreSQL, a relational SQL database. It supports transactions, foreign keys, indexes and reliable relationships between users, notes and tags.

## 2. Entities and Columns

### Users

| Column | Type | Key / Constraint |
|---|---|---|
| id | BIGINT GENERATED ALWAYS AS IDENTITY | Primary key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default current time |

### Notes

| Column | Type | Key / Constraint |
|---|---|---|
| id | BIGINT GENERATED ALWAYS AS IDENTITY | Primary key |
| user_id | BIGINT | Foreign key to users(id), NOT NULL |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | Nullable |
| created_at | TIMESTAMPTZ | NOT NULL, default current time |
| updated_at | TIMESTAMPTZ | NOT NULL, default current time |

### Tags

| Column | Type | Key / Constraint |
|---|---|---|
| id | BIGINT GENERATED ALWAYS AS IDENTITY | Primary key |
| user_id | BIGINT | Foreign key to users(id), NOT NULL |
| name | VARCHAR(50) | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default current time |
| (user_id, name) | — | Unique constraint |

### Note Tags

| Column | Type | Key / Constraint |
|---|---|---|
| note_id | BIGINT | Foreign key to notes(id), part of primary key |
| tag_id | BIGINT | Foreign key to tags(id), part of primary key |
| created_at | TIMESTAMPTZ | NOT NULL, default current time |

The composite primary key `(note_id, tag_id)` prevents attaching the same tag to a note more than once.

## 3. Relationships

- **Users to notes — one-to-many:** One user can own many notes. Each note belongs to one user through `notes.user_id`.
- **Users to tags — one-to-many:** One user can create many tags. Each tag belongs to one user through `tags.user_id`.
- **Notes to tags — many-to-many:** A note can have multiple tags, and a tag can be applied to multiple notes. The `note_tags` junction table connects them.

Deleting a user or note should remove dependent records using appropriate foreign-key cascades. The application must also enforce tag ownership so users cannot attach another user's tag to their note.

## 4. CREATE TABLE Statements

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 100),
    body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id, tag_id)
);
```

## 5. Indexes

Primary keys and unique constraints automatically create indexes in PostgreSQL.

```sql
CREATE INDEX idx_notes_user_created
ON notes (user_id, created_at DESC);

CREATE INDEX idx_note_tags_tag
ON note_tags (tag_id);
```

The notes index supports retrieving a user's notes in newest-first order. The `note_tags` index supports finding notes associated with a tag.

## 6. Example SQL Queries

### Query 1: List a user's newest notes

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 20;
```

### Query 2: Retrieve a note with its owner's details

```sql
SELECT n.id, n.title, n.body, u.name, u.email
FROM notes AS n
JOIN users AS u ON u.id = n.user_id
WHERE n.id = 101 AND n.user_id = 1;
```

The user ID condition ensures that the query returns only a note owned by the requesting user.

### Query 3: Find all tags on a note

```sql
SELECT t.id, t.name
FROM tags AS t
JOIN note_tags AS nt ON nt.tag_id = t.id
JOIN notes AS n ON n.id = nt.note_id
WHERE n.id = 101 AND n.user_id = 1
ORDER BY t.name;
```

### Query 4: Count notes per user

```sql
SELECT u.id, u.name, COUNT(n.id) AS note_count
FROM users AS u
LEFT JOIN notes AS n ON n.user_id = u.id
GROUP BY u.id, u.name
ORDER BY note_count DESC;
```

## 7. SQL vs NoSQL Decision

PostgreSQL is the preferred choice because QuickNotes has clear relationships between users, notes and tags. Relational constraints protect data integrity, transactions make multi-step operations reliable, and SQL joins make reporting and tag searches straightforward.

PostgreSQL can scale through indexing, query optimisation, read replicas, caching and partitioning when necessary. A NoSQL database could be useful for certain high-volume or flexible document workloads, but it would make these relationships and consistency rules more complex to maintain without a clear need.
