class Tarea{
    constructor(id,texto,estado,contenedor){
        this.id = id;
        this.texto = texto;
        this.DOM = null;
        this.editando = false;//esta propiedad determina el estado de la tarea, si estamos o no editandola

        this.crearDOM(contenedor,estado);
    }
    crearDOM(contenedor,estado){
        //contenedor 
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        //texto de la tarea (h2)
        let textTarea = document.createElement("h2");
        textTarea.classList.add("visible");
        textTarea.innerText = this.texto;

        //input para editar tarea
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type","text");
        editorTarea.value = this.texto;

        //botom editar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click",() => this.editarTexto());

        //boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click",() => {
            this.borrarTarea();
        });

        //boton estado (toggle)
        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${estado ? "terminada": ""}`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click",()=>{
            this.toggleEstado()
            .then(() => botonEstado.classList.toggle("terminada"))
            .catch(()=> console.log("mostrar error al usuario"));
        });



        //añadir elementos al DOM
        this.DOM.appendChild(textTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);

    }
    borrarTarea(){
        fetch(`http://localhost:4000/tareas/borrar/${this.id}`,{
            method: "DELETE"
        })
        .then(resultado => resultado.json())
        .then(({resultado,error}) => {
            if(!error){
               return this.DOM.remove();
            }
        });
    }
    toggleEstado(){
        return new Promise((ok,ko)=>{
            fetch(`http://localhost:4000/tareas/actualizar/${this.id}/2`,{
                method: "PUT"
            })
            .then(resultado => resultado.json())
            .then(({resultado,error}) => {
                console.log(resultado,error)
                if(!error){
                   return ok();
                }
                ko();
            });
        });
    }
    async editarTexto(){
        if(this.editando){
            //intentar guardar los cambios
            let posibleText = this.DOM.children[1].value.trim();
            if(posibleText != "" && posibleText !=this.texto ){                
                let {error} = await fetch(`http://localhost:4000/tareas/actualizar/${this.id}/1`,{
                    method: "PUT",
                    body : JSON.stringify({tarea : posibleText}),
                    headers : {
                        "content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json());
                if(!error){
                    return this.texto = posibleText;
                 }
                console.log("error al usuario");
            }
            
            //desactivar interface de edicion
            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[0].innerText = this.texto;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[2].innerText = "editar";

            this.editando = false;
        }else{
            //activar la interface de edicion
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.texto;
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";

            this.editando = true;
        }
    }
}