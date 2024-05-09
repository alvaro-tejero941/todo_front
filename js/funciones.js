const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputText = document.querySelector('form input[type="text"]');

//carga inicial de los datos
fetch("http://localhost:4000/tareas")
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas);
    });
});
formulario.addEventListener("submit", async evento =>{
    evento.preventDefault();
    console.log(inputText.value);
    if(inputText.value.trim() != ""){

        let tarea = inputText.value.trim();
        let {id,error} = await fetch("http://localhost:4000/tareas/nueva",{
            method : "POST",
            body : JSON.stringify({tarea}),
            headers : {
                "content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        if(!error){
            new Tarea (id,tarea,false,contenedorTareas);
            return inputText.value = "";
        }
    }
    console.log("mostrar error al usuario");
});

//
