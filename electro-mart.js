//  DEPENDENCIES
const { BSONSymbol } = require("mongodb");
const { bot, API_DATABASE, ENDPOINT_DATABASE } = require("./settings");
let { lang, BUTTONS } = require("./settings");
let { verifica_datos, translateMessage, translateBtn, log } = require("./utils/utils");

// START MENU

bot.on('/start', (msg) => {

    async function registro() {
        try { await API_DATABASE.post(ENDPOINT_DATABASE.createUser + `?id=${msg.from.id}`) }
        catch (Error) { console.log(Error) }
    }

    async function verificando() {

        try {

            let call = await API_DATABASE.get(ENDPOINT_DATABASE.findUser + `?id=${msg.from.id}`)
            let verificador = call.data;

            if (verificador == 0) {
                let replyMarkup = bot.keyboard([
                    [BUTTONS.products.label, BUTTONS.carrito.label],
                    [BUTTONS.info.label, BUTTONS.opciones.label]
                ], { resize: true });
                let text = `Bienvenido , ${ msg.from.username }.\n\n¡Es hora de empezar 🤖!\n\n¿Cómo puedo ayudarte?`
                translateMessage(msg, lang, text, replyMarkup);
                registro();

            } else {
            
                let userName = String(msg.chat.first_name);
                let replyMarkup = bot.keyboard([
                    [BUTTONS.products.label, BUTTONS.carrito.label],
                    [BUTTONS.info.label, BUTTONS.opciones.label]
                ], { resize: true });

                let text = `Bienvenido , ${ msg.from.username }.\n\n¡Es hora de empezar 🤖!\n\n¿Cómo puedo ayudarte?`

                return translateMessage(msg, lang, text, replyMarkup);

            }

        } catch (Error) { console.log(Error) };
    }

    verificando();



});

//  SHOW PRODUCTS

bot.on('/products', (msg) => {

    async function getProducts() {
        try {

            let call = await API_DATABASE.get(ENDPOINT_DATABASE.adminDB); //NOTA: CAMBIAR DIRECCIÓN

            let producto = call.data;
            let len = producto.length;

            let resultado = `id  |  Nombre                           |  Precio\n`;
            for (let i = 0; i < len; i++) {
                resultado += `${producto[i].id}  | ${producto[i].name.substring(0, 20)} | $${producto[i].price} \n`;
            }

            return bot.sendMessage(msg.chat.id, ` ${resultado}`);

        } catch (error) {
            console.log(error);
        }
    }

    getProducts();
    let replyMarkup = bot.keyboard([
        [BUTTONS.products.label, BUTTONS.buscar.label],
        [BUTTONS.verCarrito.label, BUTTONS.añadirCarrito.label],
        [BUTTONS.close.label]
    ], { resize: true });

    translateMessage(msg, lang, 'Elige tu opción favorita 🤗', replyMarkup);
});


//  SEARCH PRODUCT
bot.on('/buscar', (msg) => {

translateMessage(msg, lang, `A continuacion introduzca el id del producto que desea consultar. Ejemplo:  2
        
⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️`,false,'id')
    
})


// SELECT PRODUCT
bot.on('ask.id', msg => {
         let mensaje = msg.text.toLowerCase();
         mensaje.trim();
        if(mensaje=='salir' || mensaje=='exit' ) {return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente');        
    }

        const id = Number(msg.text);

        if (!id || id <= 0 || id > 20) {
            return translateMessage(msg, lang, 'Introduzca un id valido. Ej: 2', false, 'id');

        }

        async function getProductID(id) {

            let call = await API_DATABASE.get(ENDPOINT_DATABASE.getProducts + `?id=${id}`)
            let producto = call.data;

            let resultado = `id: ${producto[0].id}\n Nombre: ${producto[0].name}\n 
            Precio: $${producto[0].price} \n Descripcion: \n ${producto[0].description} \n ${producto[0].image} \n
            Categoria: ${producto[0].category}\n
            Valoracion: promedio ${producto[0].rating.rate} de ${producto[0].rating.count} valoraciones \n`;

            bot.sendMessage(msg.chat.id, `${resultado}`);
        }

        getProductID(id)

        return translateMessage(msg, lang, 'Aqui se encuentra el producto solicitado ✅');

    }
);


// DELIVERY METHODS

bot.on('/info', (msg) => {

    if(lang=='es'){ 
        
        const replyMarkupI = bot.inlineKeyboard([[bot.inlineButton('Envianos tus comentarios!', { callback: '/valorar' })]]);
        translateMessage(msg, lang, `
⬛️ MÉTODOS DE PAGO 💸\n
🔹 Efectivo 
🔹 Transferencia 
🔹 Crypto:
    -BTC
    -ETH
    -USDT


⬛️ Zonas de Entrega 🗺️\n
🔹 Maracaibo 
🔹 Caracas 
🔹 Valencia
🔹 Maracay`, replyMarkupI);

} else {

        
     const replyMarkupI = bot.inlineKeyboard([[bot.inlineButton('Send us your feedback!', { callback: '/valorar' })]]);
    
    //SE ENVIA UN STICKER QUE DIGA MÉTODOS DE PAGO
    translateMessage(msg, lang, `
⚫️ MÉTODOS DE PAGO 💸\n
🔹 Efectivo 
🔹 Transferencia 
🔹 Crypto:
    -BTC
    -ETH
    -USDT


⚫️ Zonas de Entrega 🗺️\n
🔹 Maracaibo 
🔹 Caracas 
🔹 Valencia
🔹 Maracay`, replyMarkupI);
}   ;


});


//  CHANGE BOT LANGUAGE
bot.on('/lang', (msg) => {

    lang == "es" ? lang = "en" : lang = "es";
    translateBtn(lang); 
    let replyMarkup = bot.keyboard([[BUTTONS.switch.label]], { resize: true });
    let text = "Ahora hablamos el mismo idioma 😉";
    return translateMessage(msg, lang, text, replyMarkup);

});

// BOT OPTIONS
bot.on('/opciones', (msg) => {

    let replyMarkup = bot.keyboard([
        [BUTTONS.language.label],
        [BUTTONS.close.label]
    ], { resize: true });
    translateMessage(msg, lang, 'Presione la opción deseada: ⌨️', replyMarkup);



});


bot.on('/addToCart', (msg) => {
    

    translateMessage(msg, lang, `
    Ingresa los productos a agregar al carrito siguiendo el formato a continuación:
    
    ID Producto,Cantidad de ese ID Producto

    Ejemplo: 1,2,5,3 (Añade 2 del ID 1 y 3 del ID 5)

    NOTA: Los productos ingresados tomarán en cuenta a los añadidos previamente: Si en el carrito tenías 1 producto ID 1 con el mensaje ejemplo pasarás a tener 3.

    ⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️
    `, false, 'prod')


});


bot.on('/modCart', (msg) => {


    translateMessage(msg, lang, `
    Ingresa los productos a agregar al carrito siguiendo el formato a continuación:

    ID Producto,Cantidad de ese ID Producto

    Ejemplo: 1,2,5,3 (Añade 2 del ID 1 y 3 del ID 5)

    NOTA: Los productos ingresados sustituirán a los añadidos previamente: Si en el carrito tenías 1 producto ID 1 con el mensaje ejemplo pasarás a tener 2.

    ⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️
    `, false, 'mod')

});

bot.on('ask.prod', (msg) => {
    let mensaje = msg.text.toLowerCase();
    

    if(mensaje=='salir' || mensaje=='exit' ) {return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente')};   

    let text = `
    Ingresa los productos a agregar al carrito siguiendo el formato a continuación:
    
    ID Producto,Cantidad de ese ID Producto

    Ejemplo: 1,2,5,3 (Añade 2 del ID 1 y 3 del ID 5)

    NOTA: Los productos ingresados tomarán en cuenta a los añadidos previamente: Si en el carrito tenías 1 producto ID 1 con el mensaje ejemplo pasarás a tener 3.

    ⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️
    `;

    let datos = msg.text.split(',');
    let datosLen = datos.length;
    if (datosLen % 2 != 0) { return translateMessage(msg, lang, text , false, 'prod') }

    
    let verifyData = datos.map(el => Number(el));

    if (verifyData.includes(NaN)) { return translateMessage(msg, lang,text , false, 'prod') }

    let i = 0;
    while (i < datosLen) {
        if (verifyData[i] <= 0 || verifyData[i] > 20) {
            return translateMessage(msg, lang, text, false, 'prod')
        }
        i += 2;
    }

    async function addItems() {
        try { await API_DATABASE.put(ENDPOINT_DATABASE.addToCart + `?id=${msg.from.id}&msg=${msg.text}`); }
        catch (error) { console.log(error); }
    }

    addItems();
    return translateMessage(msg, lang, 'Productos añadidos satisfactoriamente ✅');


});

bot.on('ask.mod', (msg) => {


    let mensaje = msg.text.toLowerCase();
    

    if(mensaje=='salir' || mensaje=='exit' ) {return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente')};   


    let text = `
    Ingresa los productos a agregar al carrito siguiendo el formato a continuación:
    
    ID Producto,Cantidad de ese ID Producto

    Ejemplo: 1,2,5,3 (Añade 2 del ID 1 y 3 del ID 5)

    NOTA: Los productos ingresados sustituirán a los añadidos previamente: Si en el carrito tenías 1 producto ID 1 con el mensaje ejemplo pasarás a tener 2.
    `;

    let datos = msg.text.split(',');
    let datosLen = datos.length;
    if (datosLen % 2 != 0) { return translateMessage(msg, lang, text , false, 'prod') }


    let verifyData = datos.map(el => Number(el));

    if (verifyData.includes(NaN)) { return translateMessage(msg, lang, text, false, 'prod') }

    let i = 0;
    while (i < datosLen) {
        if (verifyData[i] <= 0 || verifyData[i] > 20) {
            return translateMessage(msg, lang, text , false, 'prod')
        }
        i += 2;
    }

    async function addItems() {
        try { await API_DATABASE.put(ENDPOINT_DATABASE.modCart + `?id=${msg.from.id}&msg=${msg.text}`); }
        catch (error) { console.log(error); }
    }

    addItems();
    return translateMessage(msg, lang, 'Carrito modificado satisfactoriamente ✅');

});


bot.on('/registrar', (msg) => {


   

     translateMessage(msg, lang, `
     Ingresa tus datos siguiendo el formato a continuación:
     Correo,Nombre,Apellido,Ciudad,Método de Pago

     Ejemplo: ernestodelacruz@gmail.com,Ernesto,De la Cruz,Maracaibo,Efectivo

     ■ MÉTODOS DE PAGO 💸\n
     • Efectivo 
     • Transferencia 
     • BTC
     • ETH
     • USDT
         
         
     ■ Zonas de Entrega 🗺️\n
     • Maracaibo 
     • Caracas 
     • Valencia
     • Maracay
     
     ⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️
     `,
     false, 'datos')

})



bot.on('ask.datos', msg => {

    
    let mensaje=msg.text.toLowerCase();
   
    if(mensaje=='salir' || mensaje=='exit' ) {
        
        let replyMarkup = bot.keyboard([
            [BUTTONS.products.label, BUTTONS.carrito.label],
            [BUTTONS.info.label, BUTTONS.opciones.label]
        ], { resize: true });
        return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente',replyMarkup)};   

    let replyMarkup = bot.keyboard([
        [BUTTONS.products.label, BUTTONS.buscar.label],
        [BUTTONS.verCarrito.label, BUTTONS.añadirCarrito.label],
        [BUTTONS.close.label]
    ], { resize: true });
    const replyMarkupI = bot.inlineKeyboard([[bot.inlineButton('Enviar Factura', { callback: '/enviarFactura' })]]);
    async function revisa() {

        
        let datos = msg.text.split(',');
        if (datos.length < 5) {
            translateMessage(msg, lang, '😲 Oops!\nCampos invalidos. Por favor, intentalo nuevamente: ', false, 'datos');
        }
        else if (datos.length > 5) {
            translateMessage(msg, lang, '😲 Oops!\nCampos invalidos. Por favor, intentalo nuevamente: ', false, 'datos');
        }
        else {
            let valida = await verifica_datos(lang, msg, datos);
            if (valida) {

                try {

                    await API_DATABASE.put(ENDPOINT_DATABASE.userData + `?id=${msg.from.id}&msg=${msg.text}`)
                    translateMessage(msg, lang, 'Sus datos han sido registrados satisfactoriamente ✅', replyMarkup)
                    translateMessage(msg, lang, 'Presione el botón adjunto para enviar la factura', replyMarkupI)

                } catch (error) { log(error) }


            }
            else {

                translateMessage(msg, lang, `😲 Oops! Ha ocurrido un error.\nPor favor, ingresa tus datos nuevamente:`, false, 'datos');

            }
        }
    }
    revisa();

})


bot.on('/carrito', (msg) => {

    let replyMarkup = bot.keyboard([
        [BUTTONS.verCarrito.label, BUTTONS.modCarrito.label],
        [BUTTONS.deleteCarrito.label, BUTTONS.close.label]
    ], { resize: true });

    return translateMessage(msg, lang, `
    
    🔰 Opciones del carrito de compras:
    
    ■ Ver Carrito
    Muestra los productos añadidos al carrito de compras
    
    ■ Modificar Carrito 
    Modifica los productos actuales en el carrito de compras

    ■ Vaciar Carrito
    Elimina todos los productos añadidos al carrito de compras 

    
    `, replyMarkup)

})

bot.on('/verCarrito', (msg) => {

    registro();
    translateMessage(msg, lang, 'Carrito de compras actual:')

    async function registro() {
        try {

            let call = await API_DATABASE.get(ENDPOINT_DATABASE.showCart + `?id=${msg.from.id}`)
            let resultado = call.data;

            const replyMarkup = bot.inlineKeyboard([[bot.inlineButton('Crear Factura', { callback: '/factura' })]]);
            return bot.sendMessage(msg.from.id, `${resultado}`, { replyMarkup });

        }
        catch (Error) { console.log(Error) }
    }
})


bot.on('/factura', (msg) => {

    async function verify () {
        try {
        let call = await API_DATABASE.get(ENDPOINT_DATABASE.showCart + `?id=${msg.from.id}` );
        let resultado = call.data;

        if(resultado=='No se han añadido productos al carrito'){
          return  translateMessage(msg,lang,`⚠️ Error creando factura: No se han añadido productos al carrito`)
        } else {
            let replyMarkup = bot.keyboard([[BUTTONS.registrar.label]], { resize: true });
            translateMessage(msg, lang, 'Presione el botón y siga los pasos indicados: ', replyMarkup);
        }
        } catch (error) {
            log(error)
        }
        

    }
    
    verify();
    

})

bot.on('/enviarFactura', (msg) => {
    const replyMarkupI = bot.inlineKeyboard([[bot.inlineButton('Envianos tus comentarios!', { callback: '/valorar' })]]);

    async function enviar() {
        try {
            let callMail = await API_DATABASE.post(ENDPOINT_DATABASE.sendMail + `?id=${msg.from.id}`)
            translateMessage(msg, lang, callMail.data, replyMarkupI);
        } catch (error) { log(error) }
    }

    enviar();
})


bot.on('/vaciarCarrito', (msg) => {

    vaciar();

    async function vaciar() {
        try {

            await API_DATABASE.put(ENDPOINT_DATABASE.putCart + `?id=${msg.from.id}`)


            return translateMessage(msg, lang, 'Carrito Vaciado Satisfactoriamente ✅');
        }
        catch (Error) { console.log(Error) }
    }

});





bot.on('/admin', (msg) => {

    let replyMarkup = bot.keyboard([
        [BUTTONS.password.label, BUTTONS.close.label]
        
    ], { resize: true });

   return translateMessage(msg,lang,'Presiona el botón para continuar con el menú de administrador.', replyMarkup)          

})

bot.on('/contraseña', (msg) => {

    
   return translateMessage(msg,lang,'Ingrese la contraseña:\n\n⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️', false, 'contraseña')          

})

bot.on('ask.contraseña', (msg) => {
   
    
    let mensaje=msg.text.toLowerCase();
    
    if(mensaje=="salir" || mensaje=="exit") {return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente');  }
   
    if(mensaje=="contraseña"){
      
        translateMessage(msg,lang,'Ingrese el mensaje global que desea enviar:\n\n⚠️ PARA CANCELAR LA ACCIÓN INGRESE LA PALABRA "SALIR" ⚠️ ', false , 'mensaje')
        
    } else {
        translateMessage(msg,lang,'La contraseña ingresada no es correcta')
    }


})


bot.on('ask.mensaje', (msg) => {

let mensaje=msg.text;
mensaje.toLowerCase();
if(mensaje=="salir" || mensaje=="exit"){return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente');  }
async function global() {
    try {

         await API_DATABASE.get(ENDPOINT_DATABASE.sendMessage + `?msg=${mensaje}`)
        
    }
    catch (Error) { console.log(Error) }

}

global();

}); 



bot.on('/valorar', (msg) => {


    translateMessage(msg,lang,'Ingresa tu comentario,crítica o consejo: ', false , 'comentario')
    
    }); 

//666240988
bot.on('ask.comentario', (msg) => {

        let mensaje=msg.text.toLowerCase();
        if(mensaje=="salir" || mensaje=="exit"){return translateMessage(msg, lang, 'Acción cancelada satisfactoriamente', false);  }      
        bot.sendMessage(-666240988, mensaje);
        }); 
    



// START POLLING UPDATES

bot.start(); // also bot.connect()