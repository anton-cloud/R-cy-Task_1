export function renderArchiveTable(notesArchiveList, notesArchive) {
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