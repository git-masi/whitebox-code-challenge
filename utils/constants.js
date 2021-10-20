const shippingSpeeds = Object.freeze([
  'standard',
  'expedited',
  'nextDay',
  'intlEconomy',
  'intlExpedited',
]);

const workSheetNames = Object.freeze({
  standard: 'Domestic Standard Rates',
  expedited: 'Domestic Expedited Rates',
  nextDay: 'Domestic Next Day Rates',
  intlEconomy: 'International Economy Rates',
  intlExpedited: 'International Expedited Rates',
});

module.exports = { shippingSpeeds, workSheetNames };
