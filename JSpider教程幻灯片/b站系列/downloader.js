function downloadSheet(afterParse, name) {
    let newbook = XLSX.utils.book_new();
    let sheet = XLSX.utils.json_to_sheet(afterParse);

    XLSX.utils.book_append_sheet(newbook, sheet, "爬取结果");
    console.log(newbook);
    XLSX.writeFile(newbook, name + ".xlsx");
}
function downloadExcel(json, name) {
    let newbook = XLSX.utils.book_new();

    Object.entries(json).forEach((sheetName, result) => {
        let sheet = XLSX.utils.json_to_sheet(result);
        XLSX.utils.book_append_sheet(newbook, sheet, sheetName);
    });

    console.log(newbook);
    XLSX.writeFile(newbook, name + ".xlsx");
}
export { downloadSheet, downloadExcel };
