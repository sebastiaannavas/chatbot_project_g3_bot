// DEPENDENCIES

const Telebot = require('telebot');
const axios = require('axios');
const translate = require('translate-google');
let yup = require("yup");

// INITIAL LANGUAGE

let lang = 'es';

// KEYBOARD BUTTONS

let BUTTONS = {};

let keys = ["products", "carrito", "info", "buscar", "close", 
            "registrar", "factura", "verCarrito", "language", "opciones", "pago", "modify",
            "enviar","deleteCarrito", "modCarrito","añadirCarrito", "switch"];

let labels = ["🛍️ Lista de productos", "🛒 Carrito de Compra", "📃 Info Tienda", "🆔 Elegir producto", "🔙 Volver al menu inicial",
              "🔑 Ingresar Datos", "📝 Crear Factura", "👁️‍🗨️ Ver Carrito de Compra", "🔤 Cambiar idioma", "⚙️ Configuraciones", "💳 Métodos de Pago", "📧 Modificar Correo Asociado",
               "📤 Enviar Factura", "🛒 Vaciar Carrito", "🔧🛒 Modificar Carrito", "➕ Añadir Productos al Carrito", "/restart"];
              

let commands = ["/products", "/carrito", "/info", "/buscar", "/start",
                "/registrar", "/factura", "/verCarrito", "/lang", "/opciones", "/pay", "/modify",
                "/enviarFactura","/vaciarCarrito","/modCart", "/addToCart",  "/start"];

let idx = 0, keysLen = keys.length;

for (; idx < keysLen ; idx++) {
    BUTTONS[keys[idx]] = { label: labels[idx], command: commands[idx] };
}

// BOT SETTINGS

const bot = new Telebot({
    //token: '5573269354:AAG0Z4nfZAvq-g41dtHavn0yDsTg5DYTtcM',
    token: "5388284212:AAHmEF3VaQ12caV7U1QhDwXD1jT19yEsqZw",
    usePlugins: ['namedButtons', 'askUser', 'commandButton'],
    pluginConfig: {
        namedButtons: {
            buttons: BUTTONS
        }
    }
});


// Instancia Axios para la base de datos
const API_DATABASE = axios.create({
    baseURL: 'https://62bfacf716537f6573afd4e0--luminous-crisp-2d239d.netlify.app',
    timeout: 10000,
});



//  ENDPOINTS
const ENDPOINT_DATABASE = {

    connectDB:"/connectDB",
    findUser:"/findUser",
    createUser:"/createUser",
    getProducts:"/getProducts",
    adminDB:"/adminDB",
    deleteCart:"/putCart",
    showCart:"/showCart",
    addToCart:"/addToCart",
    putCart:"/putCart",
    modCart:"/modCart",
    userData:"/userData",
    createTicket:"/createTicket",
    sendMail:"/sendMail"
}

module.exports = { translate, bot, lang, BUTTONS, keys, labels, API_DATABASE, ENDPOINT_DATABASE, yup };