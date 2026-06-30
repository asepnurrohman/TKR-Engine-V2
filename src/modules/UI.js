/**
 * ============================================
 * UI ENGINE
 * ============================================
 */

class UIEngine{

    constructor(){

        this.pages={};

        this.current=null;

    }

    register(name){

        const page=document.getElementById(name);

        if(page){

            this.pages[name]=page;

        }

        return this;

    }

    registerAll(){

        document

        .querySelectorAll(".page")

        .forEach(page=>{

            this.pages[page.id]=page;

        });

    }

    open(name){

        Object.values(this.pages)

        .forEach(page=>{

            page.classList.remove(

                "active"

            );

        });

        if(this.pages[name]){

            this.pages[name]

            .classList.add(

                "active"

            );

            this.current=name;

            if(

                Engine.emit

            ){

                Engine.emit(

                    "ui:open",

                    name

                );

            }

        }

    }

    hide(name){

        if(

            this.pages[name]

        ){

            this.pages[name]

            .classList.remove(

                "active"

            );

        }

    }

    show(name){

        this.open(name);

    }

    toggle(name){

        if(

            this.current===name

        ){

            return;

        }

        this.open(name);

    }

    currentPage(){

        return this.current;

    }

}

Engine.ui=new UIEngine();
