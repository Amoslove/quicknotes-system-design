

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const status = document.getElementById("status");
const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");

let notes = [];

// Reusable function for sending requests to the API.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return {
    data: response.status === 204 ? null : await response.json(),
    status: response.status
  };
}

function showStatus(message, type = "") {
  status.textContent = message;
  status.className = type;
}



function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No notes to display. Load or create a note.";
    notesList.appendChild(emptyMessage);
    return;
  }

  notes.forEach((note) => {
    const item = document.createElement("li");
    const title = document.createElement("h3");
    const body = document.createElement("p");
    const deleteButton = document.createElement("button");

    title.textContent = note.title;
    body.textContent = note.body || "(No body provided)";
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      deleteNote(note.id, deleteButton, item);
    });

    item.append(title, body, deleteButton);
    notesList.appendChild(item);
  });
}








// Task 1: Load the first 10 notes.
async function loadNotes() {
  loadButton.disabled = true;
  showStatus("Loading notes...");

  try {
    const result = await request(`${API_URL}?_limit=10`);
    notes = result.data;
    renderNotes();

    if (notes.length === 0) {
      showStatus("No notes were found.", "success");
    } else {
      showStatus(`Loaded ${notes.length} notes from the server.`, "success");
    }
  } catch (error) {
    showStatus("Sorry, we couldn't load notes. Please try again.", "error");
    console.error("Loading notes failed:", error);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadNotes);





loadButton.addEventListener("click", loadNotes);

// Task 2: Create a note using POST.
noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showStatus("Please enter a note title.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must not exceed 100 characters.", "error");
    titleInput.focus();
    return;
  }

  submitButton.disabled = true;
  showStatus("Creating note...");

  try {
    const result = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1,
      }),
    });

    const newNote = result.data;

    // JSONPlaceholder simulates creation but does not persist the note.
    // Keep it in our local list so the user can see the returned result.
    notes.unshift(newNote);
    renderNotes();

    showStatus(
      `Note created (status ${result.status}, id ${newNote.id}).`,
      "success",
    );

    noteForm.reset();
  } catch (error) {
    showStatus(
      "Sorry, we couldn't create your note. Please try again.",
      "error",
    );
    console.error("Creating note failed:", error);
  } finally {
    submitButton.disabled = false;
  }
});






async function deleteNote(id, deleteButton, item) {
  deleteButton.disabled = true;
  showStatus("Deleting note...");

  try {
    await request(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    // JSONPlaceholder does not permanently store created notes or
    // maintain our local list. Remove the note locally after a successful
    // simulated DELETE response so the interface stays consistent.
    notes = notes.filter((note) => note.id !== id);
    renderNotes();

    showStatus("Note deleted successfully.", "success");
  } catch (error) {
    deleteButton.disabled = false;
    showStatus(
      "Sorry, we couldn't delete this note. Please try again.",
      "error",
    );
    console.error("Deleting note failed:", error);
  }
}


