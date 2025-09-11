const backButton = document.getElementById("BackButton");
const noteContainer = document.getElementById('NoteContainer');
const addNoteButton = document.getElementById('AddNote');
const lastSavedTimeElement = document.getElementById('last-saved-time');
const setIntervalTime = 2000;

let notes = [];

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    lastSavedTimeElement.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
}

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

function addNote() {
    const newNote = { content: '' };

    notes.push(newNote);
    const newNoteElement = createNoteElement(newNote.content);
    noteContainer.insertBefore(newNoteElement, addNoteButton);
}

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
    addNoteButton.addEventListener('click', addNote());
    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    setInterval(saveNotes, setIntervalTime);

    loadNotes();
});
