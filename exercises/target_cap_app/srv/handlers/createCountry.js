'use strict';

/**
 * This asynchronous function is responsible for creating a new entry in the tiny world application.
 * @async
 * @function createCountry
 * @param {Object} req - The request object carrying all details of the incoming request.
 * @returns {Promise} - Returns a promise that resolves into the request data upon successful creation and rejects with a message on error.
 */

async function createCountry(req) {
  try {
    const query = `CALL "TINYWORLD_TINYDB_CREATECOUNTRY"('${req.data.ValueFields.IM_COUNTRY}', '${req.data.ValueFields.IM_CONTINENT}', ?)`;
    const output = await cds.run(query);
    if (output.EX_ERROR) {
      return req.error(400, 
      `Error in Data Insertion: ${output.EX_ERROR}`);
    }
    return  req.info({
        "code": 201,
        "message": `Data Inserted Successfully`,
        "numericSeverity": 1
    })
  }
  catch (e) {
    return req.error(
      500,
      `Error in Data Insertion: ${ e.message }`
    )
  }
}

module.exports = { createCountry };