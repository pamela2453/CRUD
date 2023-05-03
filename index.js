const container = document.querySelector("#container")
const myModal = document.querySelector("#exampleModal")
const form = document.querySelector("#myfrom")
const spinerModal = document.querySelector("#spinerModal")
const btnModal = document.querySelector("#btnModal")

const API = "https://api.escuelajs.co/api/v1/"


const fetchData = async (url, options = {}) => {
    try {
        let response = await fetch(url, options);
        let data = await response.json();
        return data
        // console.log(data)
    } catch (error) {
        console.log(error)
    }
}


const tablaproducts = (results) => {

    let guardar = ""

    results.forEach((element, index) => {
        let card = `
        <table class=" table table-dark table-striped-columns">
        <th scope="row">${index + 1}#</th>
        <td class="table-dark">${element.title}</td>
        <td class="table-dark" style="width:13rem;">${element.description}</td>
        <td class="table-dark" style="width:10rem;">${element.price}</td>
        <td class="table-dark" style="width:10rem;">${element.category.id}</td>    
        <td class="table-dark"><img src="${element.images[0]}" style="max-width: 150px;"></td>
        <td class="table-dark">
        <button value="${element.id}" name="editar" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"
        style="width: 5rem margin-left: 1rem solid;" class="btn btn-outline-success">Editar</button>    

            <button onclick="deleProduct(${element.id})" value="${element.id}" name="eliminar" type="button" "
             style="width: 5rem margin-left: 1rem solid;" class="btn btn-outline-danger">Eliminar</button>
        </td>
        
    </tr>
    </table>`
        guardar += card
    });

    container.innerHTML = guardar
}



const cargaInicio = async () => {
    let data = await fetchData(`${API}products`)
    tablaproducts(data)
}

cargaInicio()




const createOrproducts = async (event) => {
    let title = document.querySelector("#name").value;
    let price = document.querySelector("#price").value;
    let description = document.querySelector("#decription").value;
    let category = document.querySelector("#selectcategori").value;
    let images = document.querySelector("#image").value;

    let options = {
        headers: {
            "content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            title,
            price,
            description,
            "categoryId": category,
            "images": [images]
        })
    }

    let url = `${API}products/`
    let product;

    switch (event.target.name) {
        case "crear":
            console.log("esta creando un producto")

            product = await fetchData(url, options);

            alert(`su producto ${product.title} ha sido agregado`)
            break;
        case "actualizar":
            console.log("esta actualizando un producto")

            options = {
                headers: {
                    "content-type": "application/json"
                },
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    price,
                    description,
                    "categoryId": category,
                    "images": [images]
                })
            }

            product = await fetchData(`${url}${event.target.value}`, options);
            alert(`${product.title} fue Actualizado`)
            break;
    }
}



myModal.addEventListener('shown.bs.modal', async (event) => {
    switch (event.relatedTarget.name) {
        case "crear":
            btnModal.textContent = "Crear Producto"
            btnModal.value = ""
            btnModal.name = "crear"
            spinerModal.classList.add("d-none")
            form.classList.remove("d-none");
            break;
        case "editar":
            let id = event.relatedTarget.value;
            btnModal.textContent = "Actuallizar Producto";
            btnModal.value = id
            btnModal.name = "actualizar"

            let product = await fetchData(`${API}products/${id}`);
            spinerModal.classList.add("d-none")
            form.classList.remove("d-none");

            document.querySelector("#name").value = product.title;
            document.querySelector("#price").value = product.price;
            document.querySelector("#decription").value = product.description;
            document.querySelector("#selectcategori").value = product.category.id;
            document.querySelector("#image").value = product.images;

            break;
    }
})

myModal.addEventListener("hidden.bs.modal", () => {
    form.reset()
    spinerModal.classList.remove("d-none")
    form.classList.add("d-none")
})

let deletp;

const deleProduct = (id) => {
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()

    let options = {
        headers: {
            "content-type": "application/json"
        },
        method: 'DELETE',
    }

    let btnconfirm = document.querySelector("#btnconfirm")
    btnconfirm.removeEventListener("click", deletp);

    deletp = async () => {
        try {
            await fetchData(`${API}products/${id}`, options)
            alert("se ha Eliminado")
            toast.hide()

        } catch (error) {
            console.log(error);

        }
    }

    btnconfirm.addEventListener("click", deletp)
}


const categoris = async () => {
    let categoriesProduct = await fetchData(`${API}categories`)
    console.log(categoriesProduct)
    let selectCategory = document.querySelector("#selectcategori")

    categoriesProduct.forEach(element => {
        selectCategory.innerHTML += ` <option value="${element.id}">${element.name}</option>`
    })
}
categoris()