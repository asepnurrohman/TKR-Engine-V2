class DashboardModule extends Module{

    constructor(){

        super("dashboard");

    }

    init(){

        super.init();

        console.log(

            "Dashboard Init"

        );

    }

    render(){

        super.render();

        document.getElementById(

            "dashboard"

        ).innerHTML=

        `

        <h1>

            Dashboard

        </h1>

        <div class="card-grid">

            <div class="card">

                <h3>

                    Engine

                </h3>

                <p>

                    READY

                </p>

            </div>

            <div class="card">

                <h3>

                    Version

                </h3>

                <p>

                    ${Engine.version}

                </p>

            </div>

        </div>

        `;

    }

}

Engine.registerModule(

"dashboard",

new DashboardModule()

);
