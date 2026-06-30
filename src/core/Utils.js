/**
 * ============================================================
 * TKR ENGINE V2
 * ------------------------------------------------------------
 * File        : Utils.js
 * Module      : Core
 * Description : Core Utility Library
 * Version     : 0.2.0-alpha
 * License     : MIT
 * ============================================================
 */

"use strict";

/* ============================================================
 * UTILS
 * ============================================================
 */

class Utils {

    /* ========================================================
     * OBJECT
     * ======================================================== */

    /**
     * Deep Clone
     *
     * @param {*} value
     * @returns {*}
     */
    static clone(value){

        if(typeof structuredClone==="function"){

            return structuredClone(value);

        }

        return JSON.parse(JSON.stringify(value));

    }

    /**
     * Check Plain Object
     *
     * @param {*} value
     * @returns {Boolean}
     */
    static isObject(value){

        return(

            value!==null &&

            typeof value==="object" &&

            !Array.isArray(value)

        );

    }

    /**
     * Deep Merge
     *
     * @param {Object} target
     * @param {Object} source
     * @returns {Object}
     */
    static merge(target,source){

        Object.keys(source).forEach(key=>{

            const value=source[key];

            if(Utils.isObject(value)){

                if(!Utils.isObject(target[key])){

                    target[key]={};

                }

                Utils.merge(target[key],value);

            }else{

                target[key]=Utils.clone(value);

            }

        });

        return target;

    }

    /**
     * Deep Freeze
     *
     * @param {Object} object
     * @returns {Object}
     */
    static freeze(object){

        Object.freeze(object);

        Object.getOwnPropertyNames(object)

            .forEach(key=>{

                const value=object[key];

                if(

                    value &&

                    typeof value==="object" &&

                    !Object.isFrozen(value)

                ){

                    Utils.freeze(value);

                }

            });

        return object;

    }

    /**
     * Deep Compare
     *
     * @param {*} a
     * @param {*} b
     * @returns {Boolean}
     */
    static deepEqual(a,b){

        return JSON.stringify(a)

            ===

            JSON.stringify(b);

    }

    /**
     * Resolve Object Path
     *
     * Utils.resolve(obj,"theme.mode")
     *
     * @param {Object} object
     * @param {String} path
     * @returns {*}
     */
    static resolve(object,path){

        if(!path){

            return object;

        }

        return path

            .split(".")

            .reduce(

                (current,key)=>{

                    if(current===undefined){

                        return undefined;

                    }

                    return current[key];

                },

                object

            );

    }

    /**
     * Create Object Path
     *
     * Utils.set(config,"theme.mode","dark");
     *
     * @param {Object} object
     * @param {String} path
     * @param {*} value
     * @returns {Object}
     */
    static set(object,path,value){

        const keys=path.split(".");

        const last=keys.pop();

        let current=object;

        keys.forEach(key=>{

            if(

                !Utils.isObject(current[key])

            ){

                current[key]={};

            }

            current=current[key];

        });

        current[last]=value;

        return object;

    }

    /**
     * Remove Path
     *
     * @param {Object} object
     * @param {String} path
     * @returns {Boolean}
     */
    static remove(object,path){

        const keys=path.split(".");

        const last=keys.pop();

        let current=object;

        for(const key of keys){

            if(!(key in current)){

                return false;

            }

            current=current[key];

        }

        if(!(last in current)){

            return false;

        }

        delete current[last];

        return true;

    }

    /**
     * Has Path
     *
     * @param {Object} object
     * @param {String} path
     * @returns {Boolean}
     */
    static has(object,path){

        return Utils.resolve(

            object,

            path

        )!==undefined;

    }
/* ========================================================
 * STRING
 * ======================================================== */

/**
 * Capitalize first letter.
 *
 * @param {String} text
 * @returns {String}
 */
static capitalize(text = "") {

    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);

}

/**
 * Convert to Title Case.
 *
 * @param {String} text
 * @returns {String}
 */
static title(text = "") {

    return text

        .toLowerCase()

        .split(" ")

        .map(word => Utils.capitalize(word))

        .join(" ");

}

/**
 * Convert string menjadi slug.
 *
 * @param {String} text
 * @returns {String}
 */
static slug(text = "") {

    return text

        .toLowerCase()

        .trim()

        .replace(/[^\w\s-]/g, "")

        .replace(/\s+/g, "-")

        .replace(/-+/g, "-");

}

/**
 * Camel Case.
 *
 * hello world
 *
 * helloWorld
 *
 * @param {String} text
 * @returns {String}
 */
static camelCase(text = "") {

    const words = text

        .toLowerCase()

        .split(/[\s_-]+/);

    return words

        .map((word, index) =>

            index === 0

                ? word

                : Utils.capitalize(word)

        )

        .join("");

}

/**
 * Pascal Case.
 *
 * @param {String} text
 * @returns {String}
 */
static pascalCase(text = "") {

    return Utils.capitalize(

        Utils.camelCase(text)

    );

}

/**
 * Escape HTML.
 *
 * @param {String} text
 * @returns {String}
 */
static escapeHTML(text = "") {

    const map = {

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        "\"": "&quot;",

        "'": "&#039;"

    };

    return text.replace(/[&<>"']/g, m => map[m]);

}

/* ========================================================
 * ARRAY
 * ======================================================== */

/**
 * Remove duplicate value.
 *
 * @param {Array} array
 * @returns {Array}
 */
static unique(array = []) {

    return [...new Set(array)];

}

/**
 * Shuffle array.
 *
 * Fisher-Yates
 *
 * @param {Array} array
 * @returns {Array}
 */
static shuffle(array = []) {

    const result = [...array];

    for (

        let i = result.length - 1;

        i > 0;

        i--

    ) {

        const j = Math.floor(

            Math.random() * (i + 1)

        );

        [

            result[i],

            result[j]

        ] = [

            result[j],

            result[i]

        ];

    }

    return result;

}

/**
 * Group array.
 *
 * @param {Array} array
 * @param {Function} callback
 * @returns {Object}
 */
static groupBy(array = [], callback) {

    return array.reduce((groups, item) => {

        const key = callback(item);

        if (!groups[key]) {

            groups[key] = [];

        }

        groups[key].push(item);

        return groups;

    }, {});

}

/**
 * Sort object array.
 *
 * @param {Array} array
 * @param {String} key
 * @returns {Array}
 */
static sortBy(array = [], key) {

    return [...array].sort((a, b) => {

        if (a[key] > b[key]) return 1;

        if (a[key] < b[key]) return -1;

        return 0;

    });

}

/* ========================================================
 * NUMBER
 * ======================================================== */

/**
 * Random integer.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
static random(min = 0, max = 100) {

    return Math.floor(

        Math.random() * (max - min + 1)

    ) + min;

}

/**
 * Clamp value.
 *
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
static clamp(value, min, max) {

    return Math.min(

        Math.max(value, min),

        max

    );

}

/**
 * Format number.
 *
 * @param {Number} value
 * @returns {String}
 */
static formatNumber(value) {

    return new Intl.NumberFormat("id-ID")

        .format(value);

}

/* ========================================================
 * DATE
 * ======================================================== */

/**
 * Current Date.
 *
 * @returns {Date}
 */
static now() {

    return new Date();

}

/**
 * ISO Date.
 *
 * @returns {String}
 */
static isoDate() {

    return new Date()

        .toISOString();

}

/**
 * Format Date.
 *
 * @param {Date|String} date
 * @param {String} locale
 * @returns {String}
 */
static formatDate(

    date,

    locale = "id-ID"

) {

    return new Date(date)

        .toLocaleDateString(locale);

}

/**
 * Timestamp.
 *
 * @returns {Number}
 */
static timestamp() {

    return Date.now();

}
  /* ========================================================
 * DOM HELPER
 * ======================================================== */

/**
 * Query Selector
 *
 * @param {String} selector
 * @param {HTMLElement|Document} parent
 * @returns {HTMLElement|null}
 */
static $(selector, parent = document) {

    return parent.querySelector(selector);

}

/**
 * Query Selector All
 *
 * @param {String} selector
 * @param {HTMLElement|Document} parent
 * @returns {NodeList}
 */
static $$(selector, parent = document) {

    return parent.querySelectorAll(selector);

}

/**
 * Create Element
 *
 * @param {String} tag
 * @param {Object} attributes
 * @returns {HTMLElement}
 */
static create(tag = "div", attributes = {}) {

    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {

        if (key === "text") {

            element.textContent = value;

        } else if (key === "html") {

            element.innerHTML = value;

        } else {

            element.setAttribute(key, value);

        }

    });

    return element;

}

/**
 * Remove Element
 *
 * @param {HTMLElement} element
 */
static removeElement(element) {

    if (element) {

        element.remove();

    }

}

/**
 * Show Element
 *
 * @param {HTMLElement} element
 */
static show(element) {

    if (element) {

        element.style.display = "";

    }

}

/**
 * Hide Element
 *
 * @param {HTMLElement} element
 */
static hide(element) {

    if (element) {

        element.style.display = "none";

    }

}

/**
 * Toggle Element
 *
 * @param {HTMLElement} element
 */
static toggle(element) {

    if (!element) return;

    element.style.display =

        element.style.display === "none"

            ? ""

            : "none";

}

/**
 * Toggle Class
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
static toggleClass(element, className) {

    if (element) {

        element.classList.toggle(className);

    }

}

/**
 * Add Class
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
static addClass(element, className) {

    if (element) {

        element.classList.add(className);

    }

}

/**
 * Remove Class
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
static removeClass(element, className) {

    if (element) {

        element.classList.remove(className);

    }

}

/* ========================================================
 * VALIDATOR
 * ======================================================== */

/**
 * Empty Checker
 *
 * @param {*} value
 * @returns {Boolean}
 */
static isEmpty(value) {

    return (

        value === null ||

        value === undefined ||

        value === "" ||

        (Array.isArray(value) && value.length === 0)

    );

}

/**
 * Email Validator
 *
 * @param {String} email
 * @returns {Boolean}
 */
static isEmail(email = "") {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        .test(email);

}

/**
 * URL Validator
 *
 * @param {String} url
 * @returns {Boolean}
 */
static isURL(url = "") {

    try {

        new URL(url);

        return true;

    } catch {

        return false;

    }

}

/**
 * Numeric Checker
 *
 * @param {*} value
 * @returns {Boolean}
 */
static isNumeric(value) {

    return !isNaN(value);

}

/* ========================================================
 * PERFORMANCE
 * ======================================================== */

/**
 * Sleep
 *
 * @param {Number} ms
 * @returns {Promise}
 */
static sleep(ms = 500) {

    return new Promise(resolve =>

        setTimeout(resolve, ms)

    );

}

/**
 * Debounce
 *
 * @param {Function} callback
 * @param {Number} delay
 * @returns {Function}
 */
static debounce(callback, delay = 300) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/**
 * Throttle
 *
 * @param {Function} callback
 * @param {Number} delay
 * @returns {Function}
 */
static throttle(callback, delay = 300) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}

/* ========================================================
 * DEVICE
 * ======================================================== */

/**
 * Mobile Device
 *
 * @returns {Boolean}
 */
static isMobile() {

    return /Android|iPhone|iPad|iPod/i

        .test(navigator.userAgent);

}

/**
 * Dark Mode
 *
 * @returns {Boolean}
 */
static prefersDarkMode() {

    return window.matchMedia(

        "(prefers-color-scheme: dark)"

    ).matches;

}

/**
 * Online Status
 *
 * @returns {Boolean}
 */
static isOnline() {

    return navigator.onLine;

}
  /* ========================================================
 * GENERATOR
 * ======================================================== */

/**
 * Generate UUID v4.
 *
 * @returns {String}
 */
static uuid() {

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

        .replace(/[xy]/g, c => {

            const r = Math.random() * 16 | 0;

            const v = c === "x"

                ? r

                : (r & 0x3 | 0x8);

            return v.toString(16);

        });

}

/**
 * Random ID.
 *
 * @param {Number} length
 * @returns {String}
 */
static id(length = 10) {

    const chars =

        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {

        result += chars.charAt(

            Math.floor(

                Math.random() * chars.length

            )

        );

    }

    return result;

}

/* ========================================================
 * CLIPBOARD
 * ======================================================== */

/**
 * Copy text ke Clipboard.
 *
 * @param {String} text
 * @returns {Promise}
 */
static async copy(text = "") {

    if (navigator.clipboard) {

        return navigator.clipboard.writeText(text);

    }

    const textarea = document.createElement("textarea");

    textarea.value = text;

    document.body.appendChild(textarea);

    textarea.select();

    document.execCommand("copy");

    textarea.remove();

}

/* ========================================================
 * DOWNLOAD
 * ======================================================== */

/**
 * Download file.
 *
 * @param {String} filename
 * @param {String} content
 * @param {String} mime
 */
static download(

    filename,

    content,

    mime = "text/plain"

) {

    const blob = new Blob(

        [content],

        {

            type: mime

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);

}

/* ========================================================
 * LOGGER
 * ======================================================== */

/**
 * Logger.
 */
static log(...args) {

    console.log(

        "[ENGINE]",

        ...args

    );

}

static info(...args) {

    console.info(

        "[INFO]",

        ...args

    );

}

static warn(...args) {

    console.warn(

        "[WARN]",

        ...args

    );

}

static error(...args) {

    console.error(

        "[ERROR]",

        ...args

    );

}

/* ========================================================
 * GOOGLE APPS SCRIPT
 * ======================================================== */

/**
 * Promise Wrapper
 *
 * Utils.run("saveData",data)
 *
 * @param {String} functionName
 * @param {...*} args
 * @returns {Promise}
 */
static run(functionName, ...args) {

    return new Promise((resolve, reject) => {

        if (

            typeof google === "undefined" ||

            !google.script ||

            !google.script.run

        ) {

            reject(

                new Error(

                    "google.script.run unavailable."

                )

            );

            return;

        }

        google.script.run

            .withSuccessHandler(resolve)

            .withFailureHandler(reject)

            [functionName](...args);

    });

}

/* ========================================================
 * RETRY
 * ======================================================== */

/**
 * Retry async operation.
 *
 * @param {Function} callback
 * @param {Number} retries
 * @returns {Promise}
 */
static async retry(

    callback,

    retries = 3

) {

    let error;

    while (retries--) {

        try {

            return await callback();

        }

        catch (e) {

            error = e;

        }

    }

    throw error;

}

/* ========================================================
 * VERSION
 * ======================================================== */

static version() {

    return "0.2.0-alpha";

}
  /* ============================================================
 * FREEZE
 * ============================================================
 */

Object.freeze(Utils);
}
