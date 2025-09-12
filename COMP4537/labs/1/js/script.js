const backButton = document.getElementById("BackButton");
const readerButton = document.getElementById("ReaderButton");
const writerButton = document.getElementById("WriterButton");
const noteContainer = document.getElementById('NoteContainer');
const addNoteButton = document.getElementById('AddNote');
const lastSavedTimeElement = document.getElementById('last-saved-time');
const setIntervalTime = 2000;

let notes = [];

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    lastSavedTimeElement.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
}

// A button that appears when holding Ctrl key. When clicked, removes all localstorage notes.
const clearNotesButton = document.getElementById('ClearNotesButton');
if (clearNotesButton) {
    clearNotesButton.style.display = 'none'; // Initially hidden
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Control') {
            clearNotesButton.style.display = 'block';
        }
        if (event.key === 'Escape') {
            clearNotesButton.style.display = 'none';
        }
    });

    clearNotesButton.addEventListener('click', () => {
        localStorage.removeItem('notes');
        notes = [];
        noteContainer.innerHTML = '';
    });
}

/**
 * Note class representing a single note
 */
class Note {
    /**
     * Constructor to initialize a new note with a unique ID, empty content, and the current date as the last edit date
     */
    constructor() {
        this.ID = Date.now();
        this.content = '';
        this.lastEditDate = new Date();
    }
}

/**
 * Add a new note to the notes array and update the DOM
 */
function addNote() {
    const newNote = new Note();

    notes.push(newNote);
    // insert a new div containing textarea and remove button into NoteContainer as a new row of the grid
    const noteElement = createNoteElement();
    noteContainer.insertBefore(noteElement, addNoteButton);
    saveNotes();
}

/**
 * Create a note element with textarea and remove button
 * @param {*} noteContent | default to empty string
 * @returns {HTMLElement} noteItem
 */
function createNoteElement(noteContent = '') {
    const noteItem = document.createElement('div');
    noteItem.classList.add('note-item');

    const textarea = document.createElement('textarea');
    textarea.value = noteContent;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button');

    removeButton.addEventListener('click', () => {
        const index = notes.findIndex(note => note.content === textarea.value);
        if (index > -1) {
            notes.splice(index, 1);
            saveNotes();
            noteItem.remove();
        }
    });

    textarea.addEventListener('input', () => {
        const index = notes.findIndex(note => note.content === noteContent);
        if (index > -1) {
            notes[index].content = textarea.value;
        }
    });

    noteItem.appendChild(textarea);
    noteItem.appendChild(removeButton);

    return noteItem;
}

/**
 * Load notes from localStorage and populate the notes array and DOM
 */
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
        notes.forEach(note => {
            const noteElement = createNoteElement(note.content);
            noteContainer.insertBefore(noteElement, addNoteButton);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addNoteButton?.addEventListener('click', addNote);

    [
        [readerButton, "reader.html"],
        [writerButton, "writer.html"],
    ].forEach(([button, url]) => button?.addEventListener("click", () => window.location.href = url));

    backButton?.addEventListener("click", () => window.location.href = "index.html");

    setInterval(saveNotes, setIntervalTime);

    loadNotes();
});
