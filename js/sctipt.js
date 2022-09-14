import { categories } from "../data/categories.js";
import { icons } from "../data/icons.js";
import { notes as initialNotes } from "../data/notes.js";
import { notesArchive as initialNotesArchive } from "../data/notesArchive.js";
import { getCurrentDate } from "./services/getCurrentDate.js";
import { getDatesFromStr } from "./services/getDatesFromStr.js";
import { updateArchiveData } from "./services/updateArchiveData.js";
import { renderArchiveTable } from "./UI/renderArchiveTable.js";
import { renderNotesTable } from "./UI/renderNotesTable.js";

const notes = [...initialNotes]
const notesArchive = [...initialNotesArchive]

//state
let isActiveNotes = true;
let editModalOpen = false;
let changeNodeId = null;

// all eventlisteners
const notesList = document.querySelector(".notes-table__list");
const notesArchiveList = document.querySelector(".notes-archive-table__list");
const createNoteBtn = document.querySelector(".create-node")
const modal = document.querySelector(".modal")
const modalContent = document.querySelector('.modal__content')
const form = document.getElementById("form");
const active = document.querySelector("#active");
const archived = document.querySelector("#atchived")

notesList.addEventListener('click', deleteNote);
notesList.addEventListener('click', editNote);
notesList.addEventListener('click', archiveNote);

createNoteBtn.addEventListener('click', () => { modal.classList.add("active") })
modal.addEventListener("click", () => { modal.classList.remove("active"), changeNodeId = null, form.reset() })
modalContent.addEventListener('click', (e) => { e.stopPropagation() })
form.addEventListener('submit', handleSubmit)
active.addEventListener('click', () => {
  isActiveNotes = true;
  renderNotesTable(isActiveNotes, notes, notesList),
    active.classList.add("notes-archive-table__item_chacked"),
    archived.classList.remove("notes-archive-table__item_chacked")
})
archived.addEventListener('click', () => {
  isActiveNotes = false;
  renderNotesTable(isActiveNotes, notes, notesList),
    active.classList.remove("notes-archive-table__item_chacked"),
    archived.classList.add("notes-archive-table__item_chacked")
})

renderNotesTable(isActiveNotes, notes, notesList)
updateArchiveData(notesArchive, notes)
renderArchiveTable(notesArchiveList, notesArchive)

// archive a note 
function archiveNote(e) {
  try {
    if (e.target.classList.contains('archive-note-btn')) {
      const currentNodeId = e.target.parentElement.parentElement.dataset.id;
      const index = notes.findIndex((note) => note.id === Number(currentNodeId))
      notes[index].active = !notes[index].active
      // render
      renderNotesTable(isActiveNotes, notes, notesList)
      updateArchiveData(notesArchive, notes)
      renderArchiveTable(notesArchiveList, notesArchive)
    }
  } catch (error) {
    console.log("archiveNote:", error);
  }

}

// delete a note 
function deleteNote(e) {
  try {
    if (e.target.classList.contains('delete-note-btn')) {
      const currentNodeId = e.target.parentElement.parentElement.dataset.id;
      const index = notes.findIndex((note) => note.id === Number(currentNodeId))
      notes.splice(index, 1);
      e.target.parentElement.parentElement.remove(); // removing from DOM
      // render
      renderNotesTable(isActiveNotes, notes, notesList)
      updateArchiveData(notesArchive, notes)
      renderArchiveTable(notesArchiveList, notesArchive)
    }
  } catch (error) {
    console.log("deleteNote:", error);
  }
}

// edit a note 
function editNote(e) {
  try {
    if (e.target.classList.contains('edit-note-btn')) {
      editModalOpen = !editModalOpen;

      const currentId = e.target.parentElement.parentElement.dataset.id;
      const currentNote = notes.find((note) => note.id.toString() === currentId.toString())
      const formName = document.querySelector('[name="name"]');
      const formCategory = document.querySelector('[name="category"]');
      const formContent = document.querySelector('[name="content"]');

      changeNodeId = Number(currentId);
      modal.classList.add("active")

      formName.value = currentNote?.name;
      formCategory.selected = currentNote?.category;
      formContent.value = currentNote?.content;
      // render
      renderNotesTable(isActiveNotes, notes, notesList)
      updateArchiveData(notesArchive, notes)
      renderArchiveTable(notesArchiveList, notesArchive)
    }
  } catch (error) {
    console.log("editNote:", error);
  }

}

// submit 
function handleSubmit(e) {
  e.preventDefault();

  try {
    const {
      elements: { name, category, content }
    } = e.currentTarget;

    if (name.value === "" || category.value === "" || content.value === "") {
      return;
    }

    const newNote = {
      id: changeNodeId ? changeNodeId : Date.now(),
      name: name.value,
      created: getCurrentDate(new Date()),
      category: categories[category.value],
      content: content.value,
      dates: getDatesFromStr(content.value),
      active: true,
      icon: icons[category.value],
    }

    modal.classList.remove("active")

    if (changeNodeId) {
      let changeableNoteIdx = notes.findIndex((note) => note.id === changeNodeId)
      notes[changeableNoteIdx] = { ...notes[changeableNoteIdx], ...newNote }
    } else {
      notes.push(newNote)
    }
    // render
    renderNotesTable(isActiveNotes, notes, notesList)
    updateArchiveData(notesArchive, notes)
    renderArchiveTable(notesArchiveList, notesArchive)

    changeNodeId = null;
    form.reset();
  } catch (error) {
    console.log("handleSubmit:", error);
  }
}

