'use strict'
console.log('carregou!!');
const openModal = () => {
    //console.log("carregou!!");
    document.getElementById('modal').classList.add('active');
}

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('listaCurso')) ?? [];

const setLocalStorage = (listaCurso) => localStorage.setItem("listaCurso", JSON.stringify(listaCurso));

//CRUD da Pagina curso
const deleteCurso = (index) =>{
    const listaCurso = readCursos();
    listaCurso.splice(index, 1);
    setLocalStorage(listaCurso);
    console.log('carregou deleteCurso');
}

const updateCurso = (index, curso) =>{
    const listaCurso = readCursos();
    listaCurso[index] = curso;
    setLocalStorage(listaCurso);
    console.log('carregou updateCurso');
}

const readCursos = () => getLocalStorage(); console.log('carregou readCurso');

const createCurso = (curso) =>{
    const listaCurso = getLocalStorage();
    listaCurso.push(curso);
    setLocalStorage(listaCurso);
    console.log('carregou createCurso');
}

const isValidFields = () => {
    console.log('carregou validação');
    return document.getElementById('form').reportValidity();
}

//Interagindo com a DOM 
const clearFields = () => {
    const campos = document.querySelectorAll('.modal-field');
    campos.forEach(campo => campo.value = "");
    document.getElementById('curso').dataset.index = 'new';
    document.querySelector(".modal-header > h2").textContent = 'Novo Curso';
    console.log('limpou so campos!');
}

const saveCurso = () =>{
    if(isValidFields()){
        const curso = {
            curso: document.getElementById('curso').value,
            turno: document.getElementById('turno').value,
            periodo: document.getElementById('periodo').value
        }
        const index = document.getElementById('curso').dataset.index;

        if(index == 'new'){
            createCurso(curso);
            updateTable();
            closeModal();
        }else{
            updateCurso(index, curso);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (curso, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${curso.curso}</td>
        <td>${curso.turno}</td>
        <td>${curso.periodo}</td>
        <td>
            <button type="button" class="btn-action" id="edit-${index}">Editar</button>
            <button type="button" class="btn-action" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableCurso>tbody').appendChild(newRow);
    console.log("Criou uma nova linha!!");
};

const clearTable = () =>{
    const rows = document.querySelectorAll('#tableCurso>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));//Alterar aqui 
    console.log('limpou a tabela!!');
}

const updateTable = () => {
    const curso = readCursos();
    clearTable();
    curso.forEach(createRow);
    console.log('update table');
}

const fillCampos = (curso) => {
    document.getElementById('curso').value = curso.curso;
    document.getElementById('turno').value = curso.turno;
    document.getElementById('periodo').value = curso.periodo;
    document.getElementById('curso').dataset.index = curso.index;
    console.log('carregou o fillCampos');
}

const editCurso = (index) =>{
    const curso = readCursos()[index];
    curso.index = index;
    fillCampos(curso);
    console.log(curso);
    document.querySelector(".modal-header>h2").innerText = `Editando ${curso.curso}`;
    openModal();
    console.log(openModal);
    console.log("Carregou p editClient");
}

const editDelete = (event) =>{
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-');
        if(action == 'edit'){
            editCurso(index);
        }else{
            const curso = readCursos()[index];
            const response =  confirm(`Deseja realemnte excluir o curso ${curso.curso}`);
            if(response){
                deleteCurso(index);
                updateTable();
            }
        }
    }
    console.log('carregou o editDelete');
}

updateTable();

//Eventos no HTML 
document.getElementById('cadastrarCurso').addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', saveCurso);

document.querySelector('#tableCurso>tbody').addEventListener('click', editDelete);

document.getElementById('cancelar').addEventListener('click', closeModal);

