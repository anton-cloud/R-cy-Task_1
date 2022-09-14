export function renderNotesTable(isActiveNotes, notes, notesList) {
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