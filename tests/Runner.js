/**
 * ===========================================================
 * Engine Test Runner
 * ===========================================================
 */

const EngineTest = {

    tests: [],

    passed: 0,

    failed: 0,

    add(name, fn) {

        this.tests.push({
            name,
            fn
        });

    },

    assert(condition, message) {

        if (!condition) {

            throw new Error(message);

        }

    },

    equal(actual, expected, message = "") {

        if (actual !== expected) {

            throw new Error(
                message ||
                `Expected ${expected}, got ${actual}`
            );

        }

    },

    run() {

        console.clear();

        console.log("================================");

        console.log("ENGINE V2 TEST");

        console.log("================================");

        this.passed = 0;
        this.failed = 0;

        this.tests.forEach(test => {

            try {

                test.fn();

                console.log("✓", test.name);

                this.passed++;

            }

            catch (e) {

                console.error("✗", test.name);

                console.error(e.message);

                this.failed++;

            }

        });

        console.log("--------------------------------");

        console.log("Passed :", this.passed);

        console.log("Failed :", this.failed);

        console.log("--------------------------------");

    }

};
