
const DATA = [
  { region: "Region A", year: 2015, coverage: 71 }, { region: "Region A", year: 2016, coverage: 73 },
  { region: "Region A", year: 2017, coverage: 76 }, { region: "Region A", year: 2018, coverage: 79 },
  { region: "Region A", year: 2019, coverage: 82 }, { region: "Region A", year: 2020, coverage: 77 },
  { region: "Region A", year: 2021, coverage: 78 }, { region: "Region A", year: 2022, coverage: 84 },
  { region: "Region A", year: 2023, coverage: 50 },

  { region: "Region B", year: 2015, coverage: 88 }, { region: "Region B", year: 2016, coverage: 89 },
  { region: "Region B", year: 2017, coverage: 90 }, { region: "Region B", year: 2018, coverage: 91 },
  { region: "Region B", year: 2019, coverage: 91 }, { region: "Region B", year: 2020, coverage: 86 },
  { region: "Region B", year: 2021, coverage: 87 }, { region: "Region B", year: 2022, coverage: 90 },
  { region: "Region B", year: 2023, coverage: 92 },

  { region: "Region C", year: 2015, coverage: 58 }, { region: "Region C", year: 2016, coverage: 60 },
  { region: "Region C", year: 2017, coverage: 61 }, { region: "Region C", year: 2018, coverage: 65 },
  { region: "Region C", year: 2019, coverage: 66 }, { region: "Region C", year: 2020, coverage: 59 },
  { region: "Region C", year: 2021, coverage: 62 }, { region: "Region C", year: 2022, coverage: 68 },
  { region: "Region C", year: 2023, coverage: 72 }
];
const TARGET = 90; 

const regions = [...new Set(DATA.map(d => d.region))];
const years = [...new Set(DATA.map(d => d.year))].sort((a, b) => a - b);
const colors = ["#1d6fa5", "#7a4fa3", "#2f8f6b", "#b5562b"];


const fieldset = document.getElementById("regions");
regions.forEach(name => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${name}" checked> ${name}`;
  label.querySelector("input").addEventListener("change", update);
  fieldset.appendChild(label);
});

function selectedRegions() {
  return [...fieldset.querySelectorAll("input:checked")].map(el => el.value);
}


const chart = new Chart(document.getElementById("chart"), {
  type: "line",
  data: { labels: years, datasets: [] },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 40, max: 100, title: { display: true, text: "Children fully vaccinated (%)" } },
      x: { title: { display: true, text: "Year" } }
    }
  }
});


function update() {
  const chosen = selectedRegions();

  chart.data.datasets = chosen.map(name => ({
    label: name,
    data: years.map(y => DATA.find(d => d.region === name && d.year === y)?.coverage ?? null),
    borderColor: colors[regions.indexOf(name) % colors.length],
    backgroundColor: colors[regions.indexOf(name) % colors.length],
    tension: 0.25
  }));

  chart.data.datasets.push({
    label: `Target (${TARGET}%)`,
    data: years.map(() => TARGET),
    borderColor: "#c98a00",
    borderDash: [6, 6],
    pointRadius: 0
  });
  chart.update();

  const summary = document.getElementById("summary");
  if (chosen.length === 0) {
    summary.innerHTML = "<p>Tick at least one region to see its trend.</p>";
    return;
  }
  const first = years[0], last = years[years.length - 1];
  summary.innerHTML = chosen.map(name => {
    const start = DATA.find(d => d.region === name && d.year === first).coverage;
    const end = DATA.find(d => d.region === name && d.year === last).coverage;
    const change = end - start;
    const status = end >= TARGET ? "meets" : `is ${TARGET - end} points below`;
    return `<p><strong>${name}:</strong> ${end}% in ${last}, up ${change} points since ${first}. It ${status} the ${TARGET}% target.</p>`;
  }).join("");
}

update();
