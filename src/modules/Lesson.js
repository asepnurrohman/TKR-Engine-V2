class LessonModule extends Module{

    constructor(){

        super("lesson");

    }

    render(){

        super.render();

    }

}

Engine.registerModule(

"lesson",

new LessonModule()

);
