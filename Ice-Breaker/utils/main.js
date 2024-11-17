const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Represents pipe information.
 */
class Pipe {
    /**
     * 
     * @param {string} pipeName - Name of the pipe.
     * @param {number[]} time - Time of recording.
     * @param {number[]} currentVolume - Current measurement for instantaneous injection gas meter volume.
     * @param {number[]} targetVolume - Target for instantaneous injection gas meter volume.
     * @param {number[]} valveOpenPercentage - Percentage of injection gas valve opening.
     */
    constructor(pipeName, time, currentVolume, targetVolume, valveOpenPercentage) {
        this.pipeName = "";
        this.time = [];
        this.currentVolume = [];
        this.targetVolume = [];
        this.valveOpenPercentage = [];
    }
    //should add validation that the correct param data types are being used
}

/**
 * Array of pipes that will be used.
 * @type {Pipe[]}
 */
let pipeLocations = [ // fetch info from csv
    // new Pipe("Bold", 375.5, 400.0, 27.0),
    // new Pipe("Courageous", 963.4, 975.0, 50.0),
    // new Pipe("Fearless", 560.0, 550.0, 45.0), 
    // new Pipe("test", 243.0, 300.0, 80.0), 
];
/**
 * @type {string[]}
 * Empty array to then store list of file paths to all csv files.
 */
let CSVFiles = [];

/**
 * Finds all .csv files in a directory.
 * @param {string} dir - Directory to search in.
 * @param {string[]} fileArray - Array to add filepaths to.
 */
async function findCSVFiles(dir, fileArray) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.csv') {
            fileArray.push(file);
        }
    });
}

/**
 * Reads CSV data
 * @param {string[]} CSVFileArray - Array of CSV filepaths.
 * @param {Pipe[]} pipeArray - Array of pipes, should be empty, if not, will empty the array!
 */
async function readCSV(CSVFileArray, pipeArray) {
    pipeArray.length = 0;
    await Promise.all(
        CSVFileArray.map(csvfile => {
            return new Promise((resolve, reject) => {
                /**
                 * @type {Pipe}
                 */
                let currentPipe = new Pipe();
                fs.createReadStream(csvfile)
                    .pipe(csv())
                    .on('data', (row) => {
                        // Convert row data to appropriate types (float for numeric values, date for time)
                        currentPipe.pipeName = path.basename(csvfile).split('_')[0];
                        currentPipe.time.push(row['Time'])
                        currentPipe.currentVolume.push(row['Inj Gas Meter Volume Instantaneous'] ? parseFloat(row['Inj Gas Meter Volume Instantaneous']) : undefined),
                            currentPipe.targetVolume.push(row['Inj Gas Meter Volume Setpoint'] ? parseFloat(row['Inj Gas Meter Volume Setpoint']) : undefined),
                            currentPipe.valveOpenPercentage.push(row['Inj Gas Valve Percent Open'] ? (parseFloat(row['Inj Gas Valve Percent Open'])) / 100 : undefined)
                    })
                    .on('end', () => {
                        pipeArray.push(currentPipe);
                        resolve();
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        })
    );
}

/**
 * Helper function to interpolate missing values in an array as the next value found in the array. Also sets first undefined values to next defined values.
 * @param {number[]} array - Array to sort through
 */
async function interpolateValue(array) {
    let unassignedValues = []; //Empty array to locate unassigned indexes
    let lastKnownData = 0; //Most recent value that is defined

    let startIndex = 0;
    while (startIndex < array.length && array[startIndex] == undefined) {
        array[startIndex] = -1;
        startIndex++;
    }

    for (let i = startIndex; i < array.length; i++) {
        if (array[i] != undefined) { //If the data value exists,
            lastKnownData = array[i]; //Define it as the most recent data value.
            if (unassignedValues.length > 0) { //If there are values that are currently unassigned,
                for (let j = 0; j < unassignedValues.length; j++) {
                    array[unassignedValues[j]] = lastKnownData; //Assign them to the value we found.
                }
                unassignedValues.length = 0; //Reset the array.
            }
        } else { //If the data value does not exist,
            unassignedValues.push(i); //Push it into an array. This will contain the index of values that do not have a value yet.
        }
    }

    if (unassignedValues.length > 0) {
        for (let k = 0; k < unassignedValues.length; k++) {
            array[unassignedValues[k]] = lastKnownData;
        }
    }

    unassignedValues.length = 0;
    let firstValue = -1;
    for (let l = 0; l < array.length; l++) {
        if (array[l] == -1) {
            unassignedValues.push(l);
        } else {
            firstValue = array[l];
            break;
        }
    }
    for (let m = 0; m < unassignedValues.length; m++) {
        array[unassignedValues[m]] = firstValue;
    }
}

/**
 * Ensures no undefines are in the program.
 * @param {Pipe} pipeLocation - Pipe location.
 */
async function validatePipe(pipeLocation) {
    await interpolateValue(pipeLocation.currentVolume);
    await interpolateValue(pipeLocation.targetVolume);
    await interpolateValue(pipeLocation.valveOpenPercentage);
}


/**
 * Likelihood of a hydrate being present.
 * @type {number}
 */
let hydrateLikelihood;

//AlertApp function
/**
 * Sends an alert to the application that there has been a hydrate detected.
 * @param {Pipe} pipeInput - Pipe input of the hydrate detection.
 * @param {number[]} risk - Risk level. 0 for none-to-low, 1 for medium, 2 for high.
 */
function alertApp(pipeInput, risk) { //Sends an alert if hydrate is detected!
    //if(hydrateChance != undefined) console.log(`${risk} risk detected! There is a ${((Math.round(hydrateChance * 100) / 100).toString())}% chance that there is a hydrate in pipe "${pipeInput.pipeName}"!`);
    //else
    let riskText = "Low";
    let medCount = 0;
    let highCount = 0;
    risk.forEach(num => {
        if (num == 1) {
            medCount += 1;
        }
        if (num == 2) {
            highCount += 1;
        }
    });
    if (medCount > 10 || (highCount > (medCount - 3) && highCount > 3 && medCount > 3)) {
        riskText = "Medium";
        if (highCount > (medCount - 3) && highCount != medCount) riskText = "High";
    }
    console.log(`${riskText} risk detected of a hydrate at ${pipeInput.pipeName}!\n\n`);
    //console.log(`MedCount: ${medCount}\n\nHighCount: ${highCount}`);
}



//CalculateHydrateChance function
/**
 * Calculates a percentage based on inputs currentVolume, targetVolume, and valveOpenPercentage.
 * @param {Pipe} pipeInput - Pipe to pass information from.
 * @param {number} outChance - Stores value in outChance variable.
 */
async function calculateHydrateChance(pipeInput, outChance) {
    await validatePipe(pipeInput);
    /**
     * @type {number}
     * Percentage measuring offset from target injection.
    */
    const hydrateThreshold = 0.1; //10% deviation threshold 
    /**
     * @type {number}
     * Minimum percentage to run normally.
    */
    const valveThresholdLow = 0.2; // 20% valve position
    /**
     * @type {number}
     * Maximum percentage to run normally.
    */
    const valveThresholdHigh = 0.8; // 80% valve position

    let hydrateRisk = [];
    pipeInput.time.map((entry, index) => {
        if (index != 0) {
            if (pipeInput.currentVolume[index] + 100 < pipeInput.targetVolume[index] || pipeInput.currentVolume[index] - 100 > pipeInput.targetVolume[index]) {
                // console.log(`2 detected at ${pipeInput.pipeName}.`);
                hydrateRisk.push(2);
            }
            if (pipeInput.currentVolume[index] + 50 < pipeInput.targetVolume[index] || pipeInput.currentVolume[index] - 50 > pipeInput.targetVolume[index]) {
                // console.log(`1 detected at ${pipeInput.pipeName}.`);
                hydrateRisk.push(1);
            }
            //this doesn't account for non-simultaneous increases OR outliers
            if (pipeInput.currentVolume[index] - pipeInput.currentVolume[index - 1] > 200 && pipeInput.valveOpenPercentage[index] * 100 - pipeInput.valveOpenPercentage[index - 1] * 100 > 100) {
                // console.log(`2 detected at ${pipeInput.pipeName}.`);
                hydrateRisk.push(2);
            }
            if (pipeInput.currentVolume[index] - pipeInput.currentVolume[index - 1] > 50 && pipeInput.valveOpenPercentage[index] * 100 - pipeInput.valveOpenPercentage[index - 1] * 100 > 5) {
                // console.log(`1 detected at ${pipeInput.pipeName}.`);
                hydrateRisk.push(1);
            }
        }
    });
    alertApp(pipeInput, hydrateRisk);
}



//ContinousCheckHydrate function {MAY NOT NEED ANYMORE}
/**
 * Continously checks if hydrate is formed based on levels of pipe.
 * @param {Pipe} pipeInput - Pipe to pass information from.
 */
// async function continuousCheckHydrate(pipeInput){
//     await validatePipe(pipeInput);
//     pipeInput.time.map((entry, index) => {
//         if(index != 0){
//         //this doesn't account for non-simultaneous increases

//         }
//     });
// }

//CheckPipes function
/**
 * The actual checking of each pipe happens here.
 * @param {Pipe[]} pipeArray - Array of pipes to check.
 * @param {number} outChance - Output of chance of hydrate.
 * @param {string[]} CSVFileArray - Array of files
 */
async function checkPipes(pipeArray, outChance, CSVFileArray) {
    console.log(`Reading files...`);
    await findCSVFiles('./', CSVFileArray);
    await readCSV(CSVFileArray, pipeArray).then(() => {
        console.log(`Files read!`);
    }).catch(err => {
        console.error('Error: ', err);
    });
    console.log("Interpolating and validating pipe data...");
    pipeArray.forEach(async currentPipe => {
        //Validate pipe data
        await validatePipe(currentPipe);
    });
    pipeArray.forEach(async currentPipe => {
        //Title pipe being checked
        console.log(`\n\nCurrent pipe being checked: ${currentPipe.pipeName}\n\nProcessing pipe information...`);
        //if the gas input is too far below the target
        //await continuousCheckHydrate(currentPipe);
        //likelyhood of a hydrate
        await calculateHydrateChance(currentPipe, outChance);
    });
    console.log("\n\n\n\nAll pipes checked!\n\n\n\n");
    return 0;
}

app.get('/api/checkpipes', async (req, res) => {
    try {
        const pipes = checkPipes(pipeLocations, hydrateLikelihood, CSVFiles);

        res.json(pipes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});

//checkPipes(pipeLocations, hydrateLikelihood, CSVFiles);

module.exports = { checkPipes, readCSV, Pipe };