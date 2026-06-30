class DevTools{

    constructor(){

        this.window=null;

        this.overlay=null;

    }

    init(){

        this.window=document.getElementById(

            "devtools"

        );

        this.overlay=document.getElementById(

            "devtools-overlay"

        );

    }

    open(){

        this.window.classList.add(

            "open"

        );

        this.overlay.classList.add(

            "open"

        );

    }

    close(){

        this.window.classList.remove(

            "open"

        );

        this.overlay.classList.remove(

            "open"

        );

    }

    toggle(){

        this.window.classList.contains(

            "open"

        )

        ? this.close()

        : this.open();

    }

}

Engine.registerService(

"devtools",

new DevTools()

);
