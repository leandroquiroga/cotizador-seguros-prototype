// Funciones Globales
const selector = (element) => document.querySelector(element);
const create = (element) => document.createElement(element);
const selectorAll = (element) => document.querySelectorAll(element);
// Variables glogales
let inputName = selector('#name-complete');
let inputLastName = selector('#last-name-complete');
let inputTel = selector('#tel');
let inputEmail = selector('#email');
let form = selector('#form-cotizar');
let inputCountry = selector('#country');
let inputSeg = selector('#seguro');

// checkea si todos los campos de tipo text NO estan vacios
const checkValue = (name, lastName, tel, email) => name.value !== '' && lastName.value !== '' && tel.value !== '' && email.value !== '';
// checkea si todos los campos de tipo text estan vacios
const valueNovalid = (name, lastName, tel, email) =>  name.value === '' && lastName.value === '' && tel.value === '' && email.value === '';
// Aplica estilos al border de los inputs que no pasan la validacion
const borderStyle = (elemento, style) => elemento.style.border = style;
// recorre el array y agrega los options correspondientes
const optionsValue = (array, select) => {
    for (let i = 0; i < array.length; i++) {
        let option = create('option');
        option.value = array[i];
        option.textContent = array[i];
        select.appendChild(option);
    }
    return select
}
// calcula el valor del seguro segun el pais seleccionado
const getValue = (base,valor) => base * valor;
// calcula el monto segun el pais seleccionado 
const calcularMonto = (country, base) => {
    /*
     retorna por cada pais seleccionado el valor en 
     pesos segun que le corresponda  
     */
    switch (country) {
        case 'Argentina': return getValue(base, 105.41);
        case 'Brasil': return getValue(base, 5.26);
        case 'Chile': return getValue(base, 784.48);
        case 'Mexico': return getValue(base, 19.916);
        case 'Colombia': return getValue(base, 3830.8);
        case 'Estados Unidos': return  base;
        default: break;
    }
}
// aplica un estilo de borde segun si los campos estan completos o no.
const applyBorder = (inputName, inputLastName, inputTel ,inputEmail, styleBorder ) => {
    borderStyle(inputName, styleBorder);
    borderStyle(inputLastName, styleBorder);
    borderStyle(inputTel, styleBorder);
    borderStyle(inputEmail, styleBorder);
}
//Coloca un borde especial si cumplen con la condicion
const valueClean = (name, lastName, tel, email) => {
    if (name === '') borderStyle(inputName, '1px solid #e00909');
    if (lastName === '') borderStyle(inputLastName, '1px solid #e00909');
    if (tel === '') borderStyle(inputTel, '1px solid #e00909');
    if ( email === '') borderStyle(inputEmail, '1px solid #e00909');
}
// Evalua el pais procedente y retorna el valor del importe en peso local
const currentFormat = (precio, country) => {
    let mount = numeral(precio);

    switch (country) {
        case 'Argentina':
            numeral.defaultFormat('AR0,0.00');
            return `AR  ${mount.format()}`;
        case 'Brasil':
            numeral.defaultFormat('R0,0.00');
            return `R ${mount.format()}`;
        case 'Chile':
            numeral.defaultFormat('CL0,0.00');
            return `CL ${mount.format()}`;
        case 'Mexico':
            numeral.defaultFormat('MX0,0.00');
            return `MX ${mount.format()}`;
        case 'Colombia':
            numeral.defaultFormat('COL0,0.00');
            return `COL ${mount.format()}`;
        case 'Estados Unidos':
            numeral.defaultFormat('U$S0,0.00');
            return `U$S ${mount.format()}`;
        default:
            break;
    }
} 
// Constructores
function Cotizador(nameComplete,last,country,seguro) {
    this.name = nameComplete;
    this.lastName = last;
    this.country = country;
    this.seguro = seguro;
}
function UI() { }

// Creamos las instancias
const ui = new UI();

Cotizador.prototype.cotizarSeguro = function () {
    // Precios de los planes 
    let low = 100;
    let bronce = low * 1.50;
    let plata = bronce * 1.50;
    let gold = plata * 1.50;

    switch (this.seguro) {
        case 'Gold': return calcularMonto(this.country, gold);
        case 'Plata': return calcularMonto(this.country, plata);
        case 'Bronce': return calcularMonto(this.country, bronce);
        case 'Low cost': return calcularMonto(this.country, low);
        default: break;
    }
}
// Opciones de los paises
UI.prototype.optionsFull = () => {
    const arrayCountry = ['Argentina', 'Brasil', 'Chile', 'Mexico', 'Estados Unidos', 'Colombia'];
    const arrayService = ['Gold', 'Plata', 'Bronce', 'Low cost'];
    let selectService = selector('#seguro');
    let selectCountry = selector('#country');

    optionsValue(arrayService, selectService);
    optionsValue(arrayCountry, selectCountry);
}

// Muestra alertas en pantallas
UI.prototype.alert = (tipo, message) => {
    let divCheck = selector('.checkValue');
    let div = create('div');
    let p = create('p');

    div.classList.add('resValidator');
    if (tipo === 'Correcto') {
        p.classList.add('text-validator','check');
        p.textContent = message;
        div.appendChild(p);
        divCheck.insertBefore(div, divCheck.childNodes[2]);
    } else {
        let article = selector('.seccion-input');
        p.classList.add('text-validator','error');
        p.textContent = message;
        div.appendChild(p)
        article.insertBefore(div, article.childNodes[5]);

    }
    setTimeout(() => {
        div.remove();
    }, 2500)
}

UI.prototype.resumen = (name, last, tipo, price, country) => {
    let divParent = selector('.result');
    let divChild = create('div');
    let divTitle = create('div');
    let divContent = create('div');
    let pNameFull = create('p');
    let pLast = create('p');
    let pTipo = create('p');
    let pPrice = create('p'); 

    divChild.classList.add('dialog-resumen');
    divTitle.classList.add('title-resumen');
    divTitle.textContent = 'Tu resumen';
    
    divContent.classList.add('content-resumen');
    pNameFull.classList.add('info-resumen');
    pLast.classList.add('info-resumen');
    pTipo.classList.add('info-resumen');
    pPrice.classList.add('info-resumen');

    pNameFull.textContent = `Nombre Completo: ${name}`;
    pLast.textContent = `Apellido: ${last}`;
    pTipo.textContent = `Seguro contratado: ${tipo}`;
    pPrice.textContent = `Precio: ${currentFormat(price, country)}`;

    divContent.insertBefore(pNameFull, divContent.childNodes[0]);
    divContent.insertBefore(pLast,divContent.childNodes[1]);
    divContent.insertBefore(pTipo,divContent.childNodes[2]);
    divContent.insertBefore(pPrice,divContent.childNodes[3]);


    divChild.insertBefore(divTitle, divChild.childNodes[0]);
    divChild.insertBefore(divContent, divChild.childNodes[1])
    divParent.appendChild(divChild);

}
const cotizarSeguro = (e) => {
    let spinner = selector('.spinner');
    let divParent = selector('.dialog-resumen');
    const seguro = new Cotizador(inputName.value, inputLastName.value, inputCountry.value, inputSeg.value);
    if (divParent != null) divParent.remove()
    e.preventDefault();
    if (checkValue(inputName, inputLastName, inputTel, inputEmail)) {
        applyBorder(inputName, inputLastName, inputTel, inputEmail, '1px solid #10e03a');
        spinner.classList.remove('hidden')
        ui.alert('Correcto', 'Cargando datos');
        let total = seguro.cotizarSeguro();
        setTimeout(() => {
            ui.resumen(inputName.value, inputLastName.value, inputSeg.value, total, inputCountry.value);
            spinner.classList.add('hidden')            
        }, 2500)
        return;

    } else {
        valueClean(inputName.value, inputLastName.value, inputTel.value, inputEmail.value);
        if(valueNovalid(inputName, inputLastName, inputTel, inputEmail)) ui.alert('Error', 'Todos los campos son obligatorios')

        setTimeout(() => {
            applyBorder(inputName, inputLastName, inputTel, inputEmail, 'none');
            spinner.classList.add('hidden');
            form.reset();
        }, 2500);
    }
}

const cleanCotizador = () => {
    let divParent = selector('.dialog-resumen');
    applyBorder(inputName, inputLastName, inputTel, inputEmail, 'none');
    divParent.remove();
}

const initApp = () => {
    let form = selector('#form-cotizar');
    let reset = selector('#cleanForm');

    document.addEventListener('DOMContentLoaded', () => {
        ui.optionsFull();
    });
    form.addEventListener('submit', cotizarSeguro);
    reset.addEventListener('click', cleanCotizador);
}

initApp()