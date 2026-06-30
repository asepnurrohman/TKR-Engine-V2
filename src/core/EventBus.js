/**
 * ============================================================
 * TKR ENGINE V2
 * ------------------------------------------------------------
 * File        : EventBus.js
 * Module      : Core
 * Description : Event Management System
 * Version     : 0.2.0-alpha
 * License     : MIT
 * ============================================================
 */

"use strict";

/* ============================================================
 * EVENT BUS
 * ============================================================
 */

class EventBus {

    /**
     * Constructor
     */
    constructor() {

        /**
         * Event Collection
         *
         * Map<String, Array<Listener>>
         *
         * @private
         */
        this._events = new Map();

        /**
         * Before Middleware
         *
         * @private
         */
        this._before = [];

        /**
         * After Middleware
         *
         * @private
         */
        this._after = [];

        /**
         * Event History
         *
         * @private
         */
        this._history = [];

        /**
         * Debug Mode
         *
         * @private
         */
        this._debug = false;

        /**
         * Pause State
         *
         * @private
         */
        this._paused = false;

    }

    /* ========================================================
     * REGISTER EVENT
     * ======================================================== */

    /**
 * Register Event Listener.
 *
 * @param {String} event
 * @param {Function} callback
 * @param {Object} options
 * @returns {EventBus}
 */
on(event, callback, options = {}) {

    if (typeof callback !== "function") {

        throw new TypeError("Callback must be a function.");

    }

    if (!this._events.has(event)) {

        this._events.set(event, []);

    }

    const listener = {

        callback,

        once: false,

        priority: options.priority || 0,

        createdAt: Date.now()

    };

    const list = this._events.get(event);

    list.push(listener);

    list.sort((a, b) => b.priority - a.priority);

    return this;

}

    /* ========================================================
     * REGISTER ONCE
     * ======================================================== */

    /**
     * Register One-Time Listener.
     *
     * @param {String} event
     * @param {Function} callback
     * @returns {EventBus}
     */
    once(event, callback, options = {}) {

    if (typeof callback !== "function") {

        throw new TypeError("Callback must be a function.");

    }

    if (!this._events.has(event)) {

        this._events.set(event, []);

    }

    const listener = {

        callback,

        once: true,

        priority: options.priority || 0,

        createdAt: Date.now()

    };

    const list = this._events.get(event);

    list.push(listener);

    list.sort((a, b) => b.priority - a.priority);

    return this;

}

    /* ========================================================
     * REMOVE EVENT
     * ======================================================== */

    /**
     * Remove Listener.
     *
     * @param {String} event
     * @param {Function} callback
     * @returns {EventBus}
     */
    off(event, callback) {

        if (!this._events.has(event)) {

            return this;

        }

        if (!callback) {

            this._events.delete(event);

            return this;

        }

        const listeners = this._events.get(event);

        this._events.set(

            event,

            listeners.filter(listener =>

                listener.callback !== callback

            )

        );

        if (this._events.get(event).length === 0) {

            this._events.delete(event);

        }

        return this;

    }

    /* ========================================================
     * HAS EVENT
     * ======================================================== */

    /**
     * Check Event Exists.
     *
     * @param {String} event
     * @returns {Boolean}
     */
    has(event) {

        return this._events.has(event);

    }

    /* ========================================================
     * LISTENER COUNT
     * ======================================================== */

    /**
     * Get Listener Count.
     *
     * @param {String} event
     * @returns {Number}
     */
    listenerCount(event) {

        if (!this._events.has(event)) {

            return 0;

        }

        return this._events.get(event).length;

    }

    /* ========================================================
     * GET LISTENERS
     * ======================================================== */

    /**
     * Get Listeners.
     *
     * @param {String} event
     * @returns {Array}
     */
    listeners(event) {

        if (!this._events.has(event)) {

            return [];

        }

        return [...this._events.get(event)];

    }

    /* ========================================================
     * CLEAR EVENTS
     * ======================================================== */

    /**
     * Clear Event.
     *
     * Jika event kosong,
     * seluruh listener akan dihapus.
     *
     * @param {String|null} event
     * @returns {EventBus}
     */
    clear(event = null) {

        if (event === null) {

            this._events.clear();

            return this;

        }

        this._events.delete(event);

        return this;

    }
      /* ========================================================
     * EMIT EVENT
     * ======================================================== */

    /**
     * Emit event.
     *
     * @param {String} event
     * @param {*} payload
     * @returns {Boolean}
     */
    emit(const eventObject = this._createEvent(
    event,
    payload
);

this._runBefore(eventObject);

this._addHistory(
    event,
    payload
);

if (this._debug) {

    console.info(

        "[EVENT]",

        eventObject

    );

}

this._dispatch(
    event,
    eventObject
);

this._dispatchWildcard(
    event,
    eventObject
);

this._runAfter(eventObject);

return true;) {

        if (this._paused) {

            return false;

        }

        this._addHistory(event, payload);

        if (this._debug) {

            console.info(
                "[EVENT]",
                event,
                payload
            );

        }

        this._dispatch(event, payload);

        this._dispatchWildcard(event, payload);

        return true;

    }

    /* ========================================================
     * DISPATCH
     * ======================================================== */

    /**
     * Dispatch event ke listener.
     *
     * @private
     *
     * @param {String} event
     * @param {*} payload
     */
    _dispatch(event, eventObject) {

        if (!this._events.has(event)) {

            return;

        }

        const listeners = [

            ...this._events.get(event)

        ];

        listeners.forEach(listener => {

            try {

                listener.callback(eventObject);

            }

            catch (error) {

                console.error(

                    "[EventBus]",

                    error

                );

            }

            if (listener.once) {

                this.off(

                    event,

                    listener.callback

                );

            }

        });

    }

    /* ========================================================
     * WILDCARD
     * ======================================================== */

    /**
     * Dispatch wildcard event.
     *
     * quiz:start
     *
     * quiz:*
     *
     * @private
     *
     * @param {String} event
     * @param {*} payload
     */
    _dispatchWildcard(event, payload) {

        const parts = event.split(":");

        if (parts.length < 2) {

            return;

        }

        const wildcard =

            parts[0] + ":*";

        if (!this._events.has(wildcard)) {

            return;

        }

        const listeners = [

            ...this._events.get(wildcard)

        ];

        listeners.forEach(listener => {

            try {

                listener.callback(eventObject);

            }

            catch (error) {

                console.error(

                    "[Wildcard]",

                    error

                );

            }

            if (listener.once) {

                this.off(

                    wildcard,

                    listener.callback

                );

            }

        });

    }

    /* ========================================================
     * HISTORY
     * ======================================================== */

    /**
     * Tambahkan history event.
     *
     * @private
     *
     * @param {String} event
     * @param {*} payload
     */
    _addHistory(event, payload) {

        this._history.push({

            event,

            payload,

            time: Date.now()

        });

        if (

            this._history.length > 100

        ) {

            this._history.shift();

        }

    }

    /* ========================================================
     * ASYNC EMIT
     * ======================================================== */

    /**
     * Emit async.
     *
     * Listener async akan dijalankan
     * secara berurutan.
     *
     * @param {String} event
     * @param {*} payload
     * @returns {Promise<Boolean>}
     */
    async emitAsync(event, payload = null) {

        if (!this._events.has(event)) {

            return false;

        }

        const listeners = [

            ...this._events.get(event)

        ];

        for (const listener of listeners) {

            try {

                await listener.callback(

                    payload

                );

            }

            catch (error) {

                console.error(

                    "[Async Event]",

                    error

                );

            }

            if (listener.once) {

                this.off(

                    event,

                    listener.callback

                );

            }

        }

        return true;

    }
  /* ========================================================
 * EVENT OBJECT
 * ======================================================== */

/**
 * Membuat Event Object.
 *
 * @private
 *
 * @param {String} name
 * @param {*} payload
 * @returns {Object}
 */
_createEvent(name, payload) {

    const parts = name.split(":");

    return {

        name,

        namespace: parts[0] || "",

        action: parts[1] || "",

        payload,

        timestamp: Date.now(),

        target: this

    };

}

/* ========================================================
 * MIDDLEWARE
 * ======================================================== */

/**
 * Before middleware.
 *
 * @param {Function} callback
 * @returns {EventBus}
 */
before(callback) {

    if (typeof callback !== "function") {

        throw new TypeError("Middleware must be a function.");

    }

    this._before.push(callback);

    return this;

}

/**
 * After middleware.
 *
 * @param {Function} callback
 * @returns {EventBus}
 */
after(callback) {

    if (typeof callback !== "function") {

        throw new TypeError("Middleware must be a function.");

    }

    this._after.push(callback);

    return this;

}

/**
 * Menjalankan before middleware.
 *
 * @private
 *
 * @param {Object} event
 */
_runBefore(event) {

    this._before.forEach(fn => {

        try {

            fn(event);

        }

        catch (error) {

            console.error(

                "[Before Middleware]",

                error

            );

        }

    });

}

/**
 * Menjalankan after middleware.
 *
 * @private
 *
 * @param {Object} event
 */
_runAfter(event) {

    this._after.forEach(fn => {

        try {

            fn(event);

        }

        catch (error) {

            console.error(

                "[After Middleware]",

                error

            );

        }

    });

}

/* ========================================================
 * HISTORY
 * ======================================================== */

/**
 * Mengambil history event.
 *
 * @returns {Array}
 */
history() {

    return [...this._history];

}

/**
 * Menghapus history.
 *
 * @returns {EventBus}
 */
clearHistory() {

    this._history = [];

    return this;

}

/* ========================================================
 * DEBUG
 * ======================================================== */

/**
 * Mengaktifkan Debug.
 *
 * @param {Boolean} state
 * @returns {EventBus}
 */
debug(state = true) {

    this._debug = state;

    return this;

}

/**
 * Status Debug.
 *
 * @returns {Boolean}
 */
isDebug() {

    return this._debug;

}

/* ========================================================
 * PAUSE
 * ======================================================== */

/**
 * Pause EventBus.
 *
 * @returns {EventBus}
 */
pause() {

    this._paused = true;

    return this;

}

/**
 * Resume EventBus.
 *
 * @returns {EventBus}
 */
resume() {

    this._paused = false;

    return this;

}

/**
 * Status pause.
 *
 * @returns {Boolean}
 */
isPaused() {

    return this._paused;

}

}
/* ============================================================
 * SINGLETON
 * ============================================================
 */

Engine.events = new EventBus();

/* ============================================================
 * ENGINE HELPER
 * ============================================================
 */

Engine.on = (...args) => Engine.events.on(...args);

Engine.once = (...args) => Engine.events.once(...args);

Engine.off = (...args) => Engine.events.off(...args);

Engine.emit = (...args) => Engine.events.emit(...args);

Engine.emitAsync = (...args) => Engine.events.emitAsync(...args);

/* ============================================================
 * VERSION
 * ============================================================
 */

EventBus.VERSION = "0.2.0-alpha";

/* ============================================================
 * FREEZE
 * ============================================================
 */

Object.freeze(EventBus);

Object.freeze(Engine.events);

/* ============================================================
 * EXPORT
 * ============================================================
 */

if (typeof module !== "undefined") {

    module.exports = {

        EventBus

    };

}
