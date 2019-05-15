const MockMethod = require('./mock-method'),
    Assert = require('./assert');

module.exports = class Feta {

    /**
     * Create a mocked version of an object, or a new object ready to be mocked.
     * 
     * * Object is defined: mock this object.
     * * Object is false-y: create a new empty object ready to be mocked.
     * 
     * Although it is not entirely necessary to call this method on an object you wish to mock, it is recommended.
     * It will block out (by throwing an error if they are called) any existing methods, so that you can't call through to the
     * original non-mocked function by mistake.
     * 
     * It also keeps a record of the original object so that it can be restored via ```Feta.restore(object)```
     * @param {*} object 
     */
    static mock(object) {
        if (object) {
            const originalObject = Object.assign({}, object);
            for (const key in object) {
                object[key] = () => {
                    throw new Error(`method ${key} was called but never mocked`);
                };
            }
            object.feta = { originalObject };
            return object;
        } else {
            return {
                feta: {
                    originalObject: {}
                }
            };
        }
    }

    /**
     * Create a 'when' statement, which can be used to mock a method on a mocked object.
     * 
     * For example:
     * ```
     * when(mockObject, 'myMethod').thenReturn('Hello World!');
     * ```
     * 
     * @param {*} object 
     * @param {string} method 
     */
    static when(object, method) {
        return new MockMethod(object, method);
    }

    /**
     * Restore a mocked object to its original state.
     *
     * @param {*} object The object to restore.
     * @throws {Error} If the object was never mocked in the first place.
     */
    static restore(object) {
        if (!object.feta) {
            throw new Error('Object was never mocked, cannot restore');
        } else {
            Object.assign(object, object.feta.originalObject);
        }
    }

    /**
     * Asserts that the JSON.stringified values of two objects are identical.
     *
     * @param {*} actual The actual object.
     * @param {*} expected The expected object.
     * @returns {boolean} True if the two objects are identical.
     * @throws {Error} If the two objects are not identical.
     */
    static assertEquals(actual, expected) {
        return Assert.assertEquals(actual, expected);
    }
};