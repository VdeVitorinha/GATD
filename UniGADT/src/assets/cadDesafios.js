'use strict'

const openModal = () =>{
    document.getElementById('modal').classList.add('active');
}

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

const getLocalStorage = () =>JSON.parse(localStorage.getItem('listaDesafios')) ?? [];

const setLocalStorage = (listaDesafios) => {
    localStorage.setItem('listaDesafios', JSON.stringify(listaDesafios));
}

//CRUD 

const deleteDesafio = (index) => {
    const listaDesafios = readDesafios();
    listaDesafios.splice(index, 1);
    setLocalStorage(listaDesafios);
}

const updateDesafios = (index, desafio) => {
    const listaDesafios = readDesafios();
    listaDesafios[index] = desafio;
    setLocalStorage(listaDesafios);
}

const readDesafios = () =>getLocalStorage();

const createDesafio = (desafios) => {
    const listaDesafios = getLocalStorage();
    listaDesafios.push(desafios);
    setLocalStorage(listaDesafios);
}



const isValidFields = () =>{
    return document.getElementById('form').reportValidity();
}

//Interação com a DOM 
const clearFields = () => {
    const campos = document.querySelectorAll('.modal-field');
    campos.forEach(campo => campo.value = "");
    document.getElementById('desafio').dataset.index = 'new';
    document.querySelector(".modal-header > h2").textContent = 'Novo Desafio';
}

const saveDesafio = () =>{
    if(isValidFields()){
        const desafios = {
            desafio: document.getElementById('desafio').value, 

            professor: document.getElementById('professor').value,            
            
            descricao: document.getElementById('desc').value
        }
        const index = document.getElementById('desafio').dataset.index;

        if(index == 'new'){
            createDesafio(desafios);
            updateTable();
            closeModal();
        }else{
            updateDesafios(index, desafios);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (desafios, index) =>{
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${desafios.desafio}</td>
        <td>${desafios.professor}</td>
        <td>${desafios.descricao}</td>
        <td>
            <button type="button" class="btn-action" id="edit-${index}">Editar</button>
            <button type="button" class="btn-action" id="delete-${index}">Excluir</button>
        </td>
    `;
    document.querySelector('#tableDesafios>tbody').appendChild(newRow);
}

const clearTable = () =>{
    const rows = document.querySelectorAll('#tableDesafios>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));//Alterar aqui 
    console.log('limpou a tabela!!');
}

const updateTable = () =>{
    const desafios = readDesafios();
    clearTable();
    desafios.forEach(createRow);
    console.log(desafios);
}

const fillCampos = (desafios) => {
    document.getElementById('desafio').value = desafios.desafio;
    document.getElementById('professor').value = desafios.professor;
    document.getElementById('desc').value = desafios.descricao;
    document.getElementById('desafio').dataset.index = desafios.index;
}

const editDesafio = (index) =>{
    const desafios = readDesafios()[index];
    desafios.index = index;
    fillCampos(desafios);
    document.querySelector(".modal-header>h2").innerText = `Editando ${desafios.desafio}`;
    openModal();
}

const editDelete = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-');
        if(action == 'edit'){
            editDesafio(index);
        }else{
            const desafios = readDesafios()[index];
            const response = confirm(`Deseja reamente excluir este desafio ${desafios.desafio}`);
            if(response){
                deleteDesafio(index);
                updateTable();
            }
        } 
    }
}

updateTable();

//eventos HTML
document.getElementById('cadastrarDesafios').addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', saveDesafio);

document.querySelector('#tableDesafios>tbody').addEventListener('click', editDelete);

document.getElementById('cancelar').addEventListener('click', closeModal);