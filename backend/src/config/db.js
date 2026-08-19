const neo4j = require('neo4j-driver');
require('dotenv').config();

let driver;

function getDriver() {
  if (!driver) {
    driver = neo4j.driver(
      process.env.COGNODB_URI,
      neo4j.auth.basic(
        process.env.COGNODB_USERNAME,
        process.env.COGNODB_PASSWORD
      )
    );
  }

  return driver;
}

async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

module.exports = {
  getDriver,
  closeDriver
};