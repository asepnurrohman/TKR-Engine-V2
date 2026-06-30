/**
 * ==========================================================
 * TKR ENGINE V2
 * Router Engine
 * Version 0.1
 * ==========================================================
 */

class Router {

    constructor() {

        this.routes = {};

        this.current = null;

    }

    /**
     * Register route
     */

    add(name, callback = null) {

        this.routes[name] = callback;

        return this;

    }

    /**
     * Open route
     */

    navigate(name) {

        if (!this.routes[name]) {

            console.warn("Route not found:", name);

            return;

        }

        this.current = name;

        if (Engine.ui) {

            Engine.ui.open(name);

        }

        if (typeof this.routes[name] === "function") {

            this.routes[name]();

        }

        if (Engine.events) {

            Engine.events.emit("router:change", name);

        }

        location.hash = "#" + name;

    }

    /**
     * Current route
     */

    getCurrent() {

        return this.current;

    }

    /**
     * Listen hash
     */

    listen() {

        window.addEventListener(

            "hashchange",

            () => {

                const hash =

                    location.hash

                    .replace("#","");

                if (

                    this.routes[hash]

                ) {

                    this.navigate(hash);

                }

            }

        );

    }

    /**
     * Start
     */

    start(defaultRoute="dashboard") {

        this.listen();

        const hash=

            location.hash

            .replace("#","");

        if(hash){

            this.navigate(hash);

        }

        else{

            this.navigate(defaultRoute);

        }

    }

}

Engine.registerService(

    "router",

    new Router()

);
