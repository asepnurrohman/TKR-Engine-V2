/**
 * ==========================================================
 * Base Module
 * Semua module harus mewarisi class ini.
 * ==========================================================
 */

class Module {

    constructor(name){

        this.name=name;

        this.initialized=false;

        this.rendered=false;

    }

    init(){

        this.initialized=true;

    }

    render(){

        this.rendered=true;

    }

    destroy(){

        this.rendered=false;

    }

    activate(){

        this.render();

    }

    deactivate(){

        this.destroy();

    }

}
