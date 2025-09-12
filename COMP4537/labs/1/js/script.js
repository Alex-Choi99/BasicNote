/**
 * Alex Choi A01323994
 */

/**
 * Note class representing a single note
 */
class Button {
    constructor(id, onClick) {
        this.button = document.getElementById(id);
        if (this.button && onClick) {
            this.button.addEventListener('click', onClick);
        }
    }
    show() { if (this.button) this.button.style.display = 'block'; }
    hide() { if (this.button) this.button.style.display = 'none'; }
    get element() { return this.button; }
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

const backButton = new Button("BackButton", () => window.location.href = "index.html");
const readerButton = new Button("ReaderButton", () => window.location.href = "reader.html");
const writerButton = new Button("WriterButton", () => window.location.href = "writer.html");
const noteContainer = document.getElementById('NoteContainer');
const addNoteButton = document.getElementById('AddNote');
const lastSavedTimeElement = document.getElementById('last-saved-time');
const setIntervalTime = 2000;

let notes = [];

// A button that appears when holding Ctrl key. When clicked, removes all localstorage notes.
const clearNotesButton = new Button('ClearNotesButton', () => {
    localStorage.removeItem('notes');
    notes = [];
    while (noteContainer.firstChild && noteContainer.firstChild !== addNoteButton) {
        noteContainer.removeChild(noteContainer.firstChild);
    }
});

if (clearNotesButton.element) {
    clearNotesButton.hide();
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Control') {
            clearNotesButton.show();
        }
        if (event.key === 'Escape') {
            clearNotesButton.hide();
        }
    });
}

/**
 * Add a new note to the notes array and update the DOM
 */
function addNote() {
    const newNote = new Note();
    notes.push(newNote);
    const noteElement = createNoteElement(newNote.ID, newNote.content);
    noteContainer.insertBefore(noteElement, addNoteButton);
    saveNotes();
}

/**
 * Create a note element with textarea and remove button
 * @param {number} noteID - The unique ID of the note
 * @param {string} noteContent - The content of the note (default empty string)
 * @returns {HTMLElement} noteItem
 */
function createNoteElement(noteID, noteContent = '') {
    const noteItem = document.createElement('div');
    noteItem.classList.add('note-item');

    const textarea = document.createElement('textarea');
    textarea.value = noteContent;

    // Detect if we are in reader mode (readonly, no add/remove)
    const isReader = document.querySelector('.note-container.reader') !== null;

    if (isReader) {
        textarea.readOnly = true;
        noteItem.appendChild(textarea);
        return noteItem;
    }

    // Remove button as OOP
    const removeButton = new Button(null, null);
    removeButton.button = document.createElement('button');
    removeButton.button.textContent = 'Remove';
    removeButton.button.classList.add('remove-button');
    removeButton.button.addEventListener('click', () => {
        const index = notes.findIndex(note => note.ID === noteID);
        if (index > -1) {
            notes.splice(index, 1);
            saveNotes();
            noteItem.remove();
        }
    });

    textarea.addEventListener('input', () => {
        const index = notes.findIndex(note => note.ID === noteID);
        if (index > -1) {
            notes[index].content = textarea.value;
        }
    });

    noteItem.appendChild(textarea);
    noteItem.appendChild(removeButton.button);
    return noteItem;
}

/**
 * Save notes to localStorage and update last saved time
 */
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    lastSavedTimeElement.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
}

/**
 * Load notes from localStorage and populate the notes array and DOM
 */
function clearNoteContainer() {
    // Remove all notes (but not the add button)
    while (noteContainer.firstChild) {
        if (noteContainer.firstChild === addNoteButton) break;
        noteContainer.removeChild(noteContainer.firstChild);
    }
}

/**
 * Load notes from localStorage and populate the notes array and DOM
 */
function loadNotes() {
    // Save focus and caret position if a textarea is focused
    let focusedNoteID = null;
    let caretPos = null;
    const active = document.activeElement;
    if (active && active.tagName === 'TEXTAREA' && active.parentElement && active.parentElement.classList.contains('note-item')) {
        // Find the note ID by matching textarea value and DOM order
        const noteItems = Array.from(noteContainer.getElementsByClassName('note-item'));
        const idx = noteItems.findIndex(item => item.contains(active));
        if (idx !== -1 && notes[idx]) {
            focusedNoteID = notes[idx].ID;
            caretPos = active.selectionStart;
        }
    }

    clearNoteContainer();
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
        const isReader = document.querySelector('.note-container.reader') !== null;
        notes.forEach(note => {
            const noteElement = createNoteElement(note.ID, note.content);
            if (isReader) {
                noteContainer.appendChild(noteElement);
            } else {
                noteContainer.insertBefore(noteElement, addNoteButton);
            }
        });
        // Restore focus and caret position if possible
        if (focusedNoteID !== null && !isReader) {
            const noteItems = Array.from(noteContainer.getElementsByClassName('note-item'));
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].ID === focusedNoteID) {
                    const textarea = noteItems[i]?.querySelector('textarea');
                    if (textarea) {
                        textarea.focus();
                        if (caretPos !== null) textarea.setSelectionRange(caretPos, caretPos);
                    }
                    break;
                }
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const isReader = document.querySelector('.note-container.reader') !== null;
    if (!isReader && addNoteButton) {
        addNoteButton.addEventListener('click', addNote);
    }

    setInterval(() => {
        if (!isReader) saveNotes();
        loadNotes();
    }, setIntervalTime);

    loadNotes();
});
