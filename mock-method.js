const Assert = require('./assert');

module.exports = class MockMethod {

    /**
     * Construct a MockMethod.
     * @param {*} object 
     * @param {Function} method 
     */
    constructor(object, method) {
        this._object = object;
        this._method = method;
    }

    /**
     * Validate the parameters passed into the mocked method when called.
     * 
     * E.g.
     * ```
     * Feta.when(mockedObject, 'methodToMock')
     *    .assert(arg1 => feta.assertEquals(arg1, 'World!'))
     *    .then(arg1 => console.log(`Hello ${arg1}`));
     * ```
     * 
     * **Note:** You are in charge of throwing an exception / failing the test inside the callback
     * if necessary.
     * @param {Function} callback A function that takes the arguments passed to the mocked function
     *                              as _it's_ arguments, and validates them.
     */
    assert(callback) {
        this.assertCallback = callback;
        return this;
    }

    /**
     * Validate the parameters passed into the mocked method when called.
     * 
     * E.g.
     * ```
     * Feta.when(mockedObject, 'methodToMock')
     *    .assertParams('Hello', 'World!')
     *    .then((arg1, arg2) => console.log(`${arg1} ${arg2}`));
     * ```
     * @param {*} expectedParams The parameters you expect to be passed into the mocked function when called.
     */
    assertParams(...expectedParams) {
        return this.assert((...params) => {
            const expectedParamCount = expectedParams.length;
            for (let i = 0; i < expectedParamCount; i++) {
                Assert.assertEquals(params[i], expectedParams[i]);
            }
        });
    }

    /**
     * Return a specific value when this method is called.
     * 
     * Equivalent to ```.then(() => value);```
     * @param {*} value The value hat the mocked method should return.
     */
    thenReturn(value) {
        this.then(() => value);
    }

    /**
     * Return void (undefined) from this method when called.
     * 
     * Equivalent to ```.then(() => undefined)```
     */
    thenReturnVoid() {
        this.then(() => undefined);
    }

    /**
     * When this mocked method is called, instead call the function passed in here, e.g:
     * 
     * ```
     * Feta.when(mockedObject, 'methodToMock')
     *    .then(arg1 => console.log(`Hello ${arg1}`));
     * ```
     * @param {Function} func The mock function to call.
     */
    then(func) {
        const self = this;
        function overrideFunc(...params) {
            overrideFunc.calls++;
            if (self.assertCallback) {
                self.assertCallback(...params);
            }
            return func(...params);
        }
        overrideFunc.calls = 0;
        this._object[this._method] = overrideFunc;
    }
};