import express from 'express';
import csrf from 'csurf'
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import propiertiesRoutes from './routes/propertiesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js'
/*Crear la app*/
const app = express()

/** Habilitar lectura de formularios */
app.use(express.urlencoded({extended:true}))

/**Cookie-Parser */
app.use(cookieParser())

app.use(csrf({cookie:true}))

/*Conexion DB */
try {
    await db.authenticate();
    db.sync()
    console.log('Conexión Correcta a la Base de Datos')
} catch (error) {
    console.log(error)
}

/*Habilitar Pug*/
app.set('view engine', 'pug')
app.set('views', './views')

/*Carpeta publica*/
app.use(express.static('public'))

/*Routing*/
app.use('/',appRoutes)
app.use('/auth',userRoutes)
app.use('/', propiertiesRoutes)
app.use('/api',apiRoutes)


/*Definir un puerto*/
const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});