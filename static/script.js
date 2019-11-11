/*const xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
        renderTable(JSON.parse(xmlHttp.responseText));
};
xmlHttp.open("GET", "http://127.0.0.1:5000/api", true);
xmlHttp.send();*/

renderTable([]);

function renderTable(data) {
    const configs = getConfigs();
    console.log(configs);
    console.log(data); // TODO: Use DSB data
    const cells = document.querySelector("#timetable tbody").getElementsByTagName('td');
    for (let i = 0, cell; cell = cells[i]; i++) {
        try {
            const available = [];
            const subjects = cell.getAttribute("data-subject").split("|");
            const teachers = cell.getAttribute("data-teacher").split("|");
            const rooms = cell.getAttribute("data-room").split("|");

            subjects.forEach((elem, index) => {
                if ((elem.split("@").length > 1 && elem.split("@")[1].includes(getWeekType())) || elem.split("@").length === 1) {
                    const subject = elem.split("@")[0];
                    if (
                        (subject === "f" && !configs.f) || (subject === "f" && teachers[index] !== configs.f) ||
                        (subject === "ph" && !configs.ph) || (subject === "ph" && teachers[index] !== configs.ph) ||
                        (subject === "phl" && !configs.ph) || (subject === "phl" && teachers[index] !== configs.ph) ||
                        (subject === "ch" && !configs.ch) || (subject === "ch" && teachers[index] !== configs.ch) ||
                        (subject === "s" && teachers[index] !== configs.s) ||
                        (subject === "eth" && configs.e !== "eth") ||
                        (subject === "evr" && configs.e !== "evr") ||
                        (subject === "krl" && configs.e !== "krl") ||
                        (cell.getAttribute("data-flag") === "f" && !configs.f) ||
                        (["b", "m+", "bk", "sgt"].includes(subject) && !configs.w)
                    ) {
                        console.log("skipped", subject, teachers[index])
                    } else {
                        available.push({
                            subject: subject.toUpperCase(),
                            teacher: teachers[index].toUpperCase(),
                            room: rooms[index].toUpperCase()
                        })
                    }
                }
            });

            cell.innerHTML = `<b>${available[0].subject}</b><br>${available[0].teacher}<br><small>${available[0].room}</small><br>`;
        } catch (e) {
            //
        }
    }

    document.querySelectorAll("#weekdays col")[(new Date()).getDay()].style.backgroundColor = "rgba(250,255,0,0.42)";
}

function getConfigs() {
    // Defaults to personal preferences
    const url = new URL(window.location.href);
    const french = url.searchParams.get("f") || false;
    const sports = url.searchParams.get("s") || "at";
    const physics = url.searchParams.get("p") || "gm";
    const chemistry = url.searchParams.get("c") || false;
    const elective = url.searchParams.get("w") || false;
    const ethnicity = url.searchParams.get("e") || "eth";

    return {
        f: french === "false" ? false : french,
        s: sports,
        ph: physics === "false" ? false : physics,
        ch: chemistry === "false" ? false : chemistry,
        w: elective === "false" ? false : elective,
        e: ethnicity
    }
}

function getWeekType() {
    Date.prototype.getWeek = function () {
        const firstJan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);
    };
    const table = {
        37: "a",
        38: "b",
        39: "c",
        40: "d",
        41: "e",
        42: "f",
        43: "g",
        45: "h",
        46: "a",
        47: "b",
        48: "c",
        49: "d",
        50: "e",
        51: "f",
        2: "g",
        3: "h",
        4: "a",
        5: "b",
        6: "c",
        7: "d",
        8: "e",
        10: "f",
        11: "g",
        12: "h",
        13: "a",
        14: "b",
        17: "c",
        18: "d",
        19: "e",
        20: "f",
        21: "g",
        22: "h",
        25: "a",
        26: "b",
        27: "c",
        28: "d",
        29: "e",
        30: "f",
        31: "g"
    };

    const date = new Date();

    try {
        return table[date.getWeek()]
    } catch (e) {
	alert("Ferien!");
        return "a"
    }
}
