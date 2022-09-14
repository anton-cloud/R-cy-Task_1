export function getCurrentDate(currentDate) {
    let monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let date = currentDate.getDate();
    let month = monthsList[currentDate.getMonth()];
    let year = currentDate.getFullYear();
    return `${month} ${date}, ${year}`
}