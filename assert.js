module.exports = class Assert {

    /**
     * Asserts that the JSON.stringified values of two objects are identical.
     *
     * @param {*} actual The actual object.
     * @param {*} expected The expected object.
     * @returns {boolean} True if the two objects are identical.
     * @throws {Error} If the two objects are not identical.
     */
    static assertEquals(actual, expected) {
        const actualString = JSON.stringify(actual);
        const expectedString = JSON.stringify(expected);
        if (actualString === expectedString) {
            return true;
        } else {
            throw new Error(`Assertion error\nExpected: ${expectedString}\nActual:   ${actualString}`);
        }
    }
};