import { notes as initialNotes } from "../data/notes.js";
import { notesArchive as initialNotesArchive } from "../data/notesArchive.js";

const notes = [...initialNotes]
const notesArchive = [...initialNotesArchive]
const icons = { task: "fa-list-check", idea: "fa-lightbulb", random_thought: "fa-star" }
let isActiveNotes = false;

function updateArchiveData() {

  notesArchive[0].active = getActiveCountTask(notes)
  notesArchive[0].archived = getArchivedCountTask(notes)

  notesArchive[1].active = getActiveCountRandomThought(notes)
  notesArchive[1].archived = geArchivedCountRandomThought(notes)

  notesArchive[2].active = getActiveCountIdea(notes)
  notesArchive[2].archived = getArchivedCountIdea(notes)
}

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
  renderNotesTable(isActiveNotes),
    active.classList.add("notes-archive-table__item_chacked"),
    archived.classList.remove("notes-archive-table__item_chacked")
})
archived.addEventListener('click', () => {
  isActiveNotes = false;
  renderNotesTable(isActiveNotes),
    active.classList.remove("notes-archive-table__item_chacked"),
    archived.classList.add("notes-archive-table__item_chacked")

})


function getActiveCountTask(notes) {
  const activeTaskArr = notes.filter((note) => note.category === "task" && note.active)
  return activeTaskArr.length;
}

function getArchivedCountTask(notes) {
  const archivedTaskArr = notes.filter((note) => note.category === "task" && !note.active)
  return archivedTaskArr.length;
}

function getActiveCountRandomThought(notes) {
  const activeRandomThoughtArr = notes.filter((note) => note.category === "random_thought" && note.active)
  return activeRandomThoughtArr.length;
}

function geArchivedCountRandomThought(notes) {
  const archivedRandomThoughtArr = notes.filter((note) => note.category === "random_thought" && !note.active)
  return archivedRandomThoughtArr.length;
}

function getActiveCountIdea(notes) {
  const activeIdeaArr = notes.filter((note) => note.category === "idea" && note.active)
  return activeIdeaArr.length;
}

function getArchivedCountIdea(notes) {
  const archivedIdeaArr = notes.filter((note) => note.category === "idea" && !note.active)
  return archivedIdeaArr.length;
}

// const notesTableMarkup

function renderNotesTable(isActiveNotes) {
  console.log("render renderNotesTable");
  notesList.innerHTML = notes.map((note) => {
    if (isActiveNotes ? note.active : !note.active) {
      return ` <tr data-id=${note.id}>
    <td class="first-col">
    <div><i class="fa-sharp fa-solid ${note.icon}"></i></div>
    ${note.name}
    </td>
    <td>${note.created}</td>
    <td>${note.category}</td>
    <td>${note.content}</td>
    <td>${note.dates}</td>
    <td>
    <button class="btn edit-note-btn">
    <i class="fa-sharp fa-solid fa-pencil"></i>
    </button>
    <button class="btn archive-note-btn">
    <i class="fa-sharp fa-solid fa-download"></i>
    </button>
    <button class="btn delete-note-btn">
    <i class="fa-sharp fa-solid fa-trash"></i>
    </button>
    </td>
    </tr >`}
  }).join('')
}

function renderArchiveTable() {
  console.log("render renderArchiveTable");
  notesArchiveList.innerHTML = notesArchive.map((note) => {
    return ` <tr>
  <td class="first-col">
  <div><i class="fa-sharp fa-solid ${note.icon}"></i></div>
  ${note.category}
  </td >
  <td >${note.active}</td>
  <td>${note.archived}</td>
  </tr> `
  }).join("")
}

renderNotesTable(isActiveNotes)
updateArchiveData()
renderArchiveTable()

// archive a note 
function archiveNote(e) {
  if (e.target.classList.contains('archive-note-btn')) {
    console.log('click');
    const currentNodeId = e.target.parentElement.parentElement.dataset.id;
    const index = notes.findIndex((note) => note.id === Number(currentNodeId))
    console.log(index);
    notes[index].active = !notes[index].active

    renderNotesTable(isActiveNotes)
    updateArchiveData()
    renderArchiveTable()
  }
}
// delete a note 
function deleteNote(e) {
  if (e.target.classList.contains('delete-note-btn')) {
    const currentNodeId = e.target.parentElement.parentElement.dataset.id;
    const index = notes.findIndex((note) => note.id === Number(currentNodeId))
    notes.splice(index, 1);
    e.target.parentElement.parentElement.remove(); // removing from DOM
    console.log(notes);
    renderNotesTable(isActiveNotes)
    renderArchiveTable()
  }
}

// edit a note 
function editNote(e) {
  if (e.target.classList.contains('edit-note-btn')) {
    editModalOpen = !editModalOpen;

    const currentId = e.target.parentElement.parentElement.dataset.id;
    console.log(currentId);
    const currentNote = notes.find((note) => note.id.toString() === currentId.toString())
    const formName = document.querySelector('[name="name"]');
    const formCategory = document.querySelector('[name="category"]');
    const formContent = document.querySelector('[name="content"]');

    changeNodeId = Number(currentId);
    console.log(changeNodeId);
    modal.classList.add("active")

    formName.value = currentNote?.name;
    formCategory.selected = currentNote?.category;
    formContent.value = currentNote?.content;
    // formButton.textContent = "change";
    console.log(notes);
    renderNotesTable(isActiveNotes)
    updateArchiveData()
    renderArchiveTable()
  }
}

// submit 
function handleSubmit(e) {
  event.preventDefault();

  const {
    elements: { name, category, content }
  } = event.currentTarget;

  if (name.value === "" || category.value === "" || content.value === "") {
    return;
  }

  console.log(category.value);
  const newNote = {
    id: changeNodeId ? changeNodeId : Date.now(),
    name: name.value,
    created: Date.now(),
    category: category.value,
    content: content.value,
    dates: null,
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


  renderNotesTable(isActiveNotes)
  updateArchiveData()
  renderArchiveTable()

  changeNodeId = null;
  form.reset();
  console.log(notes);
}
