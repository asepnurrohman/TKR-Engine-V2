/**
 * ============================================================
 * TKR Engine V2
 * ------------------------------------------------------------
 * File        : Config.js
 * Module      : Core
 * Description : Configuration Manager
 * Version     : 0.2.0-alpha
 * Author      : Asep
 * License     : MIT
 * ============================================================
 */

"use strict";

/* ============================================================
 * ENGINE NAMESPACE
 * ============================================================
 */

const Engine = globalThis.Engine || {};

/* ============================================================
 * ENGINE CONSTANT
 * ============================================================
 */

const ENGINE_VERSION = "0.2.0-alpha";

const ENGINE_NAME = "TKR Engine";

const CONFIG_SCHEMA_VERSION = "1.0.0";

/* ============================================================
 * DEFAULT CONFIGURATION
 * ============================================================
 */

const DEFAULT_CONFIG = Object.freeze({

    app: {

        name: "TKR Engine",

        version: ENGINE_VERSION,

        schema: CONFIG_SCHEMA_VERSION,

        author: "Asep",

        organization: "SMK",

        language: "id",

        debug: false

    },

    ui: {

        animation: true,

        ripple: true,

        loading: true,

        transition: 250,

        rounded: true

    },

    sidebar: {

        collapsed: false,

        autoClose: true,

        width: 280,

        remember: true

    },

    router: {

        defaultPage: "home",

        scrollBehavior: "smooth",

        rememberLastPage: true

    },

    theme: {

        mode: "light",

        allowDarkMode: true,

        allowPrint: true,

        color: "#1976D2"

    },

    search: {

        enabled: true,

        minLength: 2,

        highlight: true

    },

    lesson: {

        autoNumber: true,

        progressTracking: true

    },

    quiz: {

        enabled: true,

        shuffleQuestion: false,

        shuffleOption: false,

        showAnswer: true,

        passingGrade: 75,

        timer: 0

    },

    storage: {

        prefix: "TKR_ENGINE",

        autoSave: true,

        rememberTheme: true,

        rememberProgress: true

    },

    gas: {

        enabled: false,

        autoSync: false

    },

    debug: {

        log: false,

        performance: false

    }

});

/* ============================================================
 * PRIVATE HELPER
 * ============================================================
 */

/**
 * Deep Clone Object
 *
 * @param {*} value
 * @returns {*}
 */
function deepClone(value){

    if(typeof structuredClone==="function"){

        return structuredClone(value);

    }

    return JSON.parse(JSON.stringify(value));

}

/**
 * Deep Freeze Object
 *
 * @param {Object} object
 * @returns {Object}
 */
function deepFreeze(object){

    Object.freeze(object);

    Object.getOwnPropertyNames(object).forEach(key=>{

        const value=object[key];

        if(

            value!==null &&

            typeof value==="object" &&

            !Object.isFrozen(value)

        ){

            deepFreeze(value);

        }

    });

    return object;

}

/**
 * Resolve Path
 *
 * app.name
 *
 * @param {Object} object
 * @param {String} path
 * @returns {*}
 */
function resolvePath(object,path){

    return path

        .split(".")

        .reduce((current,key)=>{

            if(current===undefined){

                return undefined;

            }

            return current[key];

        },object);

}

/**
 * Create Path
 *
 * @param {Object} object
 * @param {String} path
 * @param {*} value
 */
function createPath(object,path,value){

    const keys=path.split(".");

    const lastKey=keys.pop();

    let current=object;

    keys.forEach(key=>{

        if(

            typeof current[key]!=="object" ||

            current[key]===null

        ){

            current[key]={};

        }

        current=current[key];

    });

    current[lastKey]=value;

}

/**
 * Check Plain Object
 *
 * @param {*} value
 * @returns {Boolean}
 */
function isObject(value){

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
function deepMerge(target,source){

    Object.keys(source).forEach(key=>{

        const value=source[key];

        if(isObject(value)){

            if(!target[key]){

                target[key]={};

            }

            deepMerge(target[key],value);

        }else{

            target[key]=value;

        }

    });

    return target;

}
/* ============================================================
 * CONFIG MANAGER
 * ============================================================
 */

/**
 * Configuration Manager
 *
 * Menangani seluruh konfigurasi Engine V2.
 */
class ConfigManager {

    /**
     * Constructor
     *
     * @param {Object} config
     */
    constructor(config = {}) {

        /**
         * Internal Configuration
         * @private
         */
        this._config = deepClone(DEFAULT_CONFIG);

        /**
         * Merge custom config
         */
        if (Object.keys(config).length > 0) {

            deepMerge(this._config, config);

        }

    }

    /* ========================================================
     * GETTER
     * ========================================================
     */

    /**
     * Mengambil nilai konfigurasi.
     *
     * @param {String} path
     * @param {*} defaultValue
     * @returns {*}
     */
    get(path = "", defaultValue = null) {

        if (!path) {

            return deepClone(this._config);

        }

        const value = resolvePath(this._config, path);

        return value === undefined ? defaultValue : deepClone(value);

    }

    /* ========================================================
     * SETTER
     * ========================================================
     */

    /**
     * Mengubah konfigurasi.
     *
     * @param {String} path
     * @param {*} value
     * @returns {ConfigManager}
     */
    set(path, value) {

        if (!path) {

            throw new Error("Config path is required.");

        }

        createPath(this._config, path, value);

this._notify(path, value);

return this;

    }

    /* ========================================================
     * HAS
     * ========================================================
     */

    /**
     * Mengecek apakah path tersedia.
     *
     * @param {String} path
     * @returns {Boolean}
     */
    has(path) {

        return resolvePath(this._config, path) !== undefined;

    }

    /* ========================================================
     * REMOVE
     * ========================================================
     */

    /**
     * Menghapus konfigurasi.
     *
     * @param {String} path
     * @returns {Boolean}
     */
    remove(path) {

        if (!path) {

            return false;

        }

        const keys = path.split(".");

        const last = keys.pop();

        let object = this._config;

        for (const key of keys) {

            if (!(key in object)) {

                return false;

            }

            object = object[key];

        }

        if (!(last in object)) {

            return false;

        }

        delete object[last];

      this._notify(path, undefined);  
      return true;

    }

    /* ========================================================
     * ALL
     * ========================================================
     */

    /**
     * Mengambil seluruh konfigurasi.
     *
     * @returns {Object}
     */
    all() {

        return deepClone(this._config);

    }

    /* ========================================================
     * RESET
     * ========================================================
     */

    /**
     * Reset seluruh konfigurasi.
     *
     * @returns {ConfigManager}
     */
    reset() {

        this._config = deepClone(DEFAULT_CONFIG);

        return this;

    }

    /* ========================================================
     * REPLACE
     * ========================================================
     */

    /**
     * Mengganti seluruh konfigurasi.
     *
     * @param {Object} config
     * @returns {ConfigManager}
     */
    replace(config = {}) {

        this._config = deepClone(DEFAULT_CONFIG);

        deepMerge(this._config, config);

        return this;

    }

    /* ========================================================
     * VERSION
     * ========================================================
     */

    /**
     * Mengambil versi Engine.
     *
     * @returns {String}
     */
    version() {

        return ENGINE_VERSION;

    }

    /* ========================================================
     * INFO
     * ========================================================
     */

    /**
     * Informasi aplikasi.
     *
     * @returns {Object}
     */
    info() {

        return this.get("app");

    }
    /* ========================================================
     * MERGE
     * ======================================================== */

    /**
     * Merge konfigurasi baru ke konfigurasi aktif.
     *
     * @param {Object} config
     * @returns {ConfigManager}
     */
    merge(config = {}) {

        if (!isObject(config)) {
            throw new TypeError("Config must be an object.");
        }

        deepMerge(this._config, config);

        this._notify("*", this._config);

        return this;

    }

    /* ========================================================
     * EXPORT
     * ======================================================== */

    /**
     * Export konfigurasi ke JSON.
     *
     * @param {Boolean} pretty
     * @returns {String}
     */
    export(pretty = true) {

        return JSON.stringify(
            this._config,
            null,
            pretty ? 2 : 0
        );

    }

    /* ========================================================
     * IMPORT
     * ======================================================== */

    /**
     * Import konfigurasi dari JSON.
     *
     * @param {String|Object} data
     * @returns {ConfigManager}
     */
    import(data) {

        let config = data;

        if (typeof data === "string") {

            config = JSON.parse(data);

        }

        this.replace(config);

        this._notify("*", this._config);

        return this;

    }

    /* ========================================================
     * VALIDATE
     * ======================================================== */

    /**
     * Validasi konfigurasi.
     *
     * @returns {Boolean}
     */
    validate() {

        return (

            this.has("app.name") &&
            this.has("app.version") &&
            this.has("theme.mode") &&
            this.has("storage.prefix")

        );

    }

    /* ========================================================
     * FREEZE
     * ======================================================== */

    /**
     * Freeze konfigurasi.
     *
     * @returns {Object}
     */
    freeze() {

        return deepFreeze(this._config);

    }

    /* ========================================================
     * WATCHER
     * ======================================================== */

    /**
     * Daftar watcher.
     * @private
     */
    _watchers = {};

    /**
     * Menambahkan watcher.
     *
     * @param {String} path
     * @param {Function} callback
     * @returns {ConfigManager}
     */
    watch(path, callback) {

        if (!this._watchers[path]) {

            this._watchers[path] = [];

        }

        this._watchers[path].push(callback);

        return this;

    }

    /**
     * Menghapus watcher.
     *
     * @param {String} path
     * @param {Function} callback
     * @returns {ConfigManager}
     */
    unwatch(path, callback) {

        if (!this._watchers[path]) {

            return this;

        }

        this._watchers[path] =

            this._watchers[path]

                .filter(fn => fn !== callback);

        return this;

    }

    /**
     * Memanggil seluruh watcher.
     *
     * @private
     *
     * @param {String} path
     * @param {*} value
     */
    _notify(path, value) {

        if (!this._watchers[path]) {

            return;

        }

        this._watchers[path].forEach(fn => {

            fn(value);

        });

    }
}
/* ============================================================
 * CONFIG FACTORY
 * ============================================================
 */

/**
 * Membuat instance ConfigManager.
 *
 * @param {Object} config
 * @returns {ConfigManager}
 */
function createConfig(config = {}) {

    return new ConfigManager(config);

}

/* ============================================================
 * ENGINE CONFIG SINGLETON
 * ============================================================
 */

Engine.config = createConfig();

/* ============================================================
 * READ ONLY MODE
 * ============================================================
 */

/**
 * Mengunci konfigurasi agar tidak dapat diubah.
 *
 * Setelah dikunci,
 * method set(), merge(), replace(), reset()
 * akan melempar Error.
 */

Engine.config.lock = function () {

    this._locked = true;

    return this;

};

Engine.config.unlock = function () {

    this._locked = false;

    return this;

};

Engine.config.isLocked = function () {

    return !!this._locked;

};

/* ============================================================
 * PATCH MUTATOR
 * ============================================================
 */

[
    "set",
    "merge",
    "replace",
    "reset",
    "import",
    "remove"
].forEach(method => {

    const original = Engine.config[method];

    Engine.config[method] = function (...args) {

        if (this.isLocked()) {

            throw new Error(

                "Configuration is locked."

            );

        }

        return original.apply(this, args);

    };

});

/* ============================================================
 * ENGINE INFO
 * ============================================================
 */

Engine.info = function () {

    return {

        name: ENGINE_NAME,

        version: ENGINE_VERSION,

        schema: CONFIG_SCHEMA_VERSION

    };

};

/* ============================================================
 * CONFIG READY
 * ============================================================
 */

Object.freeze(Engine.info);

/* ============================================================
 * EXPORT
 * ============================================================
 */

if (typeof module !== "undefined") {

    module.exports = {

        Engine,

        ConfigManager,

        DEFAULT_CONFIG

    };

}
