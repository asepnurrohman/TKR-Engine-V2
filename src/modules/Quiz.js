class QuizModule extends Module{

    constructor(){

        super("quiz");

    }

    render(){

        super.render();

    }

}

Engine.registerModule(

"quiz",

new QuizModule()

);
