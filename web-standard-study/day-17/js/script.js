async function loadTimeTable() {
    const response = await fetch('timetableData.json');
    const timetableData = await response.json();

    console.log(timetableData);
}
