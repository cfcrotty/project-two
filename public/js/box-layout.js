
const boxHandler = {
    rows: [],
    drawBoxes: function () {
        $("#box-container").empty();
        this.rows.forEach((row, rowIndex) => {
            let newRow = $(`<div class="row"></div>`);
            row.columns.forEach((col, colIndex, colArray) => {
                let newCol = $(`<div class="content-col col-md-${col.width}"></div>`)
                newCol.append($(`<button data-rowindex="${rowIndex}" data-colindex="${colIndex}" class="box-control-btn split-btn btn btn-primary">Split Column</button>`));
                newCol.append($(`<button data-rowindex="${rowIndex}" data-colindex="${colIndex}" class="box-control-btn delete-btn btn btn-primary">Delete Column</button>`));
                if (colIndex !== 0 && colArray.length > 1 && colArray[colIndex - 1].width > 1) {
                    newCol.append($(`<button data-rowindex="${rowIndex}" data-colindex="${colIndex}" class="box-control-btn expand-left-btn btn btn-primary">Expand Column Left</button>`));
                }
                if (colIndex !== colArray.length - 1 && colArray[colIndex + 1].width > 1) {
                    newCol.append($(`<button data-rowindex="${rowIndex}" data-colindex="${colIndex}" class="box-control-btn expand-right-btn btn btn-primary">Expand Column Right</button>`));
                }
                newRow.append(newCol);
            });
            $("#box-container").append(newRow);
        });
    },
    addRow: function () {
        this.rows.push(new Row());
        this.rows[this.rows.length - 1].columns.push(new Column(12));
    }
}

$(document).ready(function () {
    boxHandler.addRow();
    boxHandler.drawBoxes();
});

$(document).on("click", "button", function (event) {
    let clicked = $(this)[0];
    console.log(clicked);
    if (clicked.id === "add-row-button") {
        boxHandler.addRow();
        boxHandler.drawBoxes();
    }

    if (clicked.id === "submit-layout-button") {
        $.ajax({
            url: "/api/layout",
            method: "POST",
            data: {
              data: JSON.stringify(boxHandler.rows)
            }
        }).then(res => {
            console.log(res);
        })
    }

    if ($(clicked).attr("class").includes("split-btn")) {
        let rowIndex = parseInt($(clicked).data("rowindex"));
        let colIndex = parseInt($(clicked).data("colindex"));
        let oldWidth = boxHandler.rows[rowIndex].columns[colIndex].width;
        if (oldWidth > 1) {
            let oddOffset = 0;
            if (oldWidth % 2 === 1) {
                oldWidth -= 1;
                oddOffset++;
            }
            newWidth = oldWidth / 2;
            boxHandler.rows[rowIndex].columns[colIndex].width = newWidth + oddOffset;
            boxHandler.rows[rowIndex].columns.splice(colIndex, 0, new Column(newWidth));
            boxHandler.drawBoxes();
        }
    }

    if ($(clicked).attr("class").includes("delete-btn")) {
        let rowIndex = parseInt($(clicked).data("rowindex"));
        let colIndex = parseInt($(clicked).data("colindex"));
        let oldWidth = boxHandler.rows[rowIndex].columns[colIndex].width;
        if (oldWidth < 12) {
            boxHandler.rows[rowIndex].columns[Math.abs(colIndex - 1)].width += oldWidth;
            boxHandler.rows[rowIndex].columns.splice(colIndex, 1);
        }
        boxHandler.drawBoxes();
    }

    if ($(clicked).attr("class").includes("expand-left-btn")) {
        let rowIndex = parseInt($(clicked).data("rowindex"));
        let colIndex = parseInt($(clicked).data("colindex"));
        boxHandler.rows[rowIndex].columns[colIndex].width++;
        boxHandler.rows[rowIndex].columns[colIndex-1].width--;
        boxHandler.drawBoxes();
    }

    if ($(clicked).attr("class").includes("expand-right-btn")) {
        let rowIndex = parseInt($(clicked).data("rowindex"));
        let colIndex = parseInt($(clicked).data("colindex"));
        boxHandler.rows[rowIndex].columns[colIndex].width++;
        boxHandler.rows[rowIndex].columns[colIndex+1].width--;
        boxHandler.drawBoxes();
    }
});

function Row() {
    this.columns = [];
}

function Column(width) {
    this.width = width;
    this.contents = { key: "Placeholder" }
}