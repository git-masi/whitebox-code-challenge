const path = require('path');
const {
  createNewWorkBook,
  addWorkSheet,
  writeWorkBook,
} = require('./utils/excel');
const { getDataByClientId, closeDbConnection } = require('./utils/db');
const { shippingSpeeds, workSheetNames } = require('./utils/constants');

// Run the function to create an excel spreadsheet with data from db
createShippingRatesExcelSheet();

async function createShippingRatesExcelSheet() {
  try {
    const queryResult = await getDataByClientId(1240);
    const groupedBySpeed = groupByShippingSpeed(queryResult);
    const hasExpectedData =
      shippingSpeeds.length === Object.keys(groupedBySpeed).length;
    const workBookData = createWorkBookData(groupedBySpeed);
    const workBook = createNewWorkBook();
    const filePath = path.resolve(__dirname + '/output.xlsx');

    addWorkSheets(workBook, workBookData, hasExpectedData);

    writeWorkBook(workBook, filePath);
  } catch (error) {
    console.error(error);
  }

  // Destroy the connection because this is not a server
  // so we don't need a pool of connections open constantly
  await closeDbConnection();

  function groupByShippingSpeed(queryResult) {
    return queryResult.reduce((acc, curr) => {
      const { shipping_speed } = curr;

      if (!(shipping_speed in acc)) {
        acc[shipping_speed] = [];
      }

      acc[shipping_speed].push(curr);

      return acc;
    }, {});
  }

  function createWorkBookData(groupedQueryResults) {
    return Object.entries(groupedQueryResults).map(mapEntriesToWorkBookData);

    function mapEntriesToWorkBookData(entry) {
      const [shippingSpeed, data] = entry;
      const groupedByStartAndEndWeight = data.reduce(reduceDataToRows, {});
      const rows = Object.values(groupedByStartAndEndWeight);

      return [shippingSpeed, rows];

      function reduceDataToRows(acc, row) {
        const { start_weight, end_weight, zone, rate } = row;
        const key = `${start_weight}#${end_weight}`;

        if (!(key in acc)) {
          acc[key] = {
            'Start Weight': start_weight,
            'End Weight': end_weight,
          };
        }

        acc[key][`Zone ${zone}`] = rate;

        return acc;
      }
    }
  }

  function addWorkSheets(workBook, workBookData, hasExpectedData) {
    workBookData.forEach(([shippingSpeed, data]) => {
      const workSheetName = workSheetNames[shippingSpeed];
      // Ideally we'd want to see if there is data for each column (zone) in the row
      const columnNames = Object.keys(data[0]);
      const workSheetData = data.map((obj) => Object.values(obj));

      addWorkSheet(workBook, workSheetName, columnNames, workSheetData);
    });

    // Add a worksheet to display missing data if any
    if (!hasExpectedData) {
      const hasSpeed = shippingSpeeds.reduce((acc, speed) => {
        acc[speed] = `Has data: ${speed in groupedBySpeed}`;
        return acc;
      }, {});

      addWorkSheet(workBook, 'Missing Data', Object.keys(hasSpeed), [
        Object.values(hasSpeed),
      ]);
    }
  }
}
