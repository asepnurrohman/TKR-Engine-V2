class LessonModule extends Module{

constructor(){

super("lesson");

}

render(){

super.render();

document.getElementById(

"lesson"

).innerHTML=

`

<h1>

Lesson

</h1>

<p>

Coming Soon

</p>

`;

}

}

Engine.registerModule(

"lesson",

new LessonModule()

);
