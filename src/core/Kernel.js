/**
 * ==========================================================
 * TKR ENGINE V2
 * Kernel
 * ==========================================================
 */

(function (global) {
    "use strict";

    // Hindari membuat Engine dua kali
    if (global.Engine) {
        return;
    }

    const Engine = {

        name: "TKR Engine",

        version: "0.2.0-alpha",

        build: "2026.06",

        started: null,

        services: {},

        modules: {},

        booted: false

    };

    /**
     * Register Service
     */
    Engine.registerService = function (name, service) {

        this.services[name] = service;

        this[name] = service;

        return this;

    };

    /**
     * Register Module
     */
    Engine.registerModule = function (name, module) {

        this.modules[name] = module;

        return this;

    };

    /**
     * Get Module
     */
    Engine.module = function (name) {

        return this.modules[name];

    };

    /**
     * Boot Engine
     */
    Engine.boot = function () {

        if (this.booted) return;

        this.started = Date.now();

        console.log("=================================");
        console.log("TKR Engine V2");
        console.log("Version :", this.version);
        console.log("=================================");

        this.booted = true;

        if (this.events && this.events.emit) {

            this.events.emit("engine:boot");

        }

    };

    /**
     * Shutdown
     */
    Engine.shutdown = function () {

        this.booted = false;

    };

    global.Engine = Engine;

})(this);
