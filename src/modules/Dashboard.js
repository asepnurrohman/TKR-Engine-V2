class DashboardModule extends Module{

    constructor(){

        super("dashboard");

    }

    init(){

        super.init();

        console.log("Dashboard initialized");

    }

    render(){

        super.render();

        console.log("Dashboard render");

    }

    destroy(){

        super.destroy();

        console.log("Dashboard destroy");

    }

}

Engine.registerModule(

    "dashboard",

    new DashboardModule()

);
