require('dotenv').config()


require('colors');

const { leerInput, pausa, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require('./models/busquedas');



const main = async() => {

    const busquedas = new Busquedas();
    let opt = '';
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1: 
            //Mostrar mensaje para que la persona escriba
            const termino = await leerInput('Ciudad: ');

            //Buscar los lugar
            const lugares = await busquedas.ciudad(termino);
            
            //Seleccionar el lugar
            const id =  await listarLugares(lugares);
            if (id === '0') continue;

            
            const lugarSel = lugares.find(l => l.id === id);

            //guardar en DB
            busquedas.agregarHistorial(lugarSel.nombre);
            
            //Clima datos
            const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

            //Mostrar resultadis
            console.log('\nInformación de la ciudad\n'.green)

            console.log('Ciudad: ',lugarSel.nombre.bold.green.underline)
            console.log('Lat: ',lugarSel.lat)
            console.log('Lng: ',lugarSel.lng)
            console.log('Temperatura:',clima.temp)
            console.log('Temperatura min:',clima.min)
            console.log('Temperatura max:',clima.max)
            console.log('Como esta el clima:',clima.desc.underline.green)
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}`.green;
                    console.log(`${idx} ${lugar}`)
                })

                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);
}


main();