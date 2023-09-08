const dataFilePath = "words_freq.csv";
let parsedCsv;
let frequencyMap;
let inputEl;
let runButtonEl;
let outputEl;

function initElements() {
    inputEl = document.getElementById("input");
    runButtonEl = document.getElementById("runButton");
    outputEl = document.getElementById("output");

    runButtonEl.addEventListener("click", function() { run() });
}

function getNormalForm(word) {
    let normalForm = word
        .toLowerCase()
        .trim()
        .replace(new RegExp(`^to `), "")
        .replace(new RegExp(`^a `), "")
        .replace(new RegExp(`^an `), "")
        .trim();
    return normalForm;
}

function run() {
    words = inputEl.value
            .split("\n")
            .filter(line => line.trim() !== '');
    inputEl.value = words.join('\n');

    wordsSortedByFreq = words
            .map(word => [word, frequencyMap.get(getNormalForm(word)) ?? -1])
            .sort((a, b) => b[1] - a[1]);

    output = wordsSortedByFreq
            .map(wordWithFreq => `${wordWithFreq[0]} (${wordWithFreq[1] === -1 ? "Not found" : wordWithFreq[1]})`)
            .join('\n');
    outputEl.value = output;
}

function loadAndParseCSV() {
    const csvFilePath = 'your_csv_file.csv';

    return new Promise((resolve, reject) => {
        fetch(dataFilePath)
            .then((response) => {
                if (!response.ok) {
                    reject(new Error(`HTTP error! Status: ${response.status}`));
                }
                return response.text();
            })
            .then((csvData) => {
                Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    complete: function (results) {
                        console.log("Data is fetched:", results.data.length);
                        resolve(results.data);
                    },
                    error: function (error) {
                        console.error('CSV parsing error:', error);
                        reject(error);
                    },
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error);
            });
    });
}

function mkFrequencyMap(csv) {
    let map = new Map();
    csv.forEach(row => {
        map.set(row["word"], row["count"])
    });
    return map;
}


window.onload = function () {
    initElements();
    loadAndParseCSV()
        .then((parsedData) => {
            parsedCsv = parsedData;
            frequencyMap = mkFrequencyMap(parsedData);    
            runButtonEl.disabled = false;
            console.log('CSV data is loaded and parsed:', parsedData.length);
        })
        .catch((error) => {
            console.error('CSV loading or parsing error:', error);
        });
};