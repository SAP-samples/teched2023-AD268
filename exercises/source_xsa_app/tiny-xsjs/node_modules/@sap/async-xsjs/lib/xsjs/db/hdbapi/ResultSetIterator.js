'use strict';

module.exports = ResultSetIterator;

/**
 * @class $.hdb.ResultSetIterator
 * @classdesc Represents an iterator over a $.hdb.ResultSet object.
 * @constructor
 * @example
 * var result = connection.executeQuery('SELECT FLAVOR, PRICE, QUANTITY FROM "DB_EXAMPLE"."ICECREAM"');
 * var iterator = result.getIterator();
 * var totalPrice = 0;
 * while(iterator.next()) {
 *     var currentRow = iterator.value();
 *     totalPrice += currentRow['PRICE'];
 * }
 */
function ResultSetIterator(data) {
  this._data = data;
  this._at = -1;
}

/** Checks if the underlying $.hdb.ResultSet has more rows and sets the value of the iterator to the next row if it exists.
 * @returns {boolean} True if the result set has more rows otherwise returns false.
 */
ResultSetIterator.prototype.next = function() {
  ++this._at;
  return this._at < this._data.length;
};

/** Returns the current row that the iterator's value is set to. Should always be called after a call to next();
 * @returns {object} An object representing the row of a $.hdb.ResultSet.
 * @throws Throws an error if next() was not previously called or if there are no rows in the result set.
 */
ResultSetIterator.prototype.value = function() {
  if (this._at === -1 || this._at >= this._data.length) {
    throw new Error('Cannot read past the end of the result set.');
  }
  return this._data[this._at];
};
