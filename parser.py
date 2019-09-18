import urllib.request
import pydsb
from flask import Flask, jsonify, render_template, send_from_directory
from bs4 import BeautifulSoup

app = Flask(__name__)


@app.route("/api")
def get():
    dsb = pydsb.PyDSB("~", "~")
    dsb.login()

    data = {
        "Montag": [],
        "Dienstag": [],
        "Mittwoch": [],
        "Donnerstag": [],
        "Freitag": []
    }

    url = dsb.get_plans()[0]["url"]
    contents = urllib.request.urlopen(url).read()
    parsed = BeautifulSoup(contents, "lxml")
    tables = parsed.find_all("table", {"class": "mon_list"})
    for table in tables:
        rows = table.find_all("tr")
        for row in rows:
            table_data = row.find_all("td")
            if len(table_data) > 0:
                if "TGM12/1" in table_data[0].b.text:
                    data[rows[1].b.text].append({
                        "Woche": table.parent.find("div", {"class": "mon_title"}).text[-1:],
                        "Stunde": table_data[1].b.text,
                        "Fach": table_data[2].text,
                        "Raum": table_data[3].text,
                        "Typ": table_data[4].text,
                    })
    return jsonify(data)
