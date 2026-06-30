/**
 * ==========================================================
 * Bootstrap Engine
 * ==========================================================
 */

class Bootstrap {

    constructor(){

        this.loaded=false;

    }

    init(){

        console.group("Bootstrap");

        Engine.boot();
        
        Engine.devtools.init();

        this.registerPages();

        this.registerRoutes();

        this.startRouter();

        this.loaded=true;

        console.groupEnd();

    }

    registerPages(){

        if(Engine.ui){

            Engine.ui.registerAll();

        }

    }

    registerRoutes(){

        if(!Engine.router){

            return;

        }

        [
            "dashboard",
            "lesson",
            "quiz",
            "tefa",
            "nilai",
            "setting"
        ].forEach(route=>{

            Engine.router.add(route);

        });

    }

    startRouter(){

        Engine.router.start("dashboard");

    }

}

Engine.registerService(

    "bootstrap",

    new Bootstrap()

);
