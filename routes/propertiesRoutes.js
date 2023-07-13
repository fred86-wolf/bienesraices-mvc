import express from 'express';
import {body} from 'express-validator'
import {admin, createProperty,saveProperty,addImage,storeImage,updateProperty,saveChanges,deleteProperty,viewProperty,sendMessage} from '../controllers/propertyController.js'
import routeProtected from '../middleware/routeProtected.js';
import upload from '../middleware/uploadImage.js';
import getIndentifyUser from '../middleware/getUser.js'
const router = express.Router()

router.get('/your-properties', routeProtected,admin)
router.get('/properties/create',routeProtected,createProperty)
router.post('/properties/create',
routeProtected,
body('title').notEmpty().withMessage('El Titulo del anuncio es obligatorio'),
body('description')
.notEmpty().withMessage('La Descrición del anuncio es obligatorio')
.isLength({max:100}).withMessage('La Descrición es muy larga'),
body('category').isNumeric().withMessage('Selecciona una Categoria'),
body('price').isNumeric().withMessage('Selecciona un rango de Precios'),
body('bedrooms').isNumeric().withMessage('Selecciona la cantidad Habitaciones'),
body('garage').isNumeric().withMessage('Selecciona la cantidad Estacionamientos'),
body('wc').isNumeric().withMessage('Selecciona la cantidad Baños'),
body('lat').notEmpty().withMessage('Ubica la propiedad en el Mapa'),
saveProperty)

router.get('/properties/add-image/:id',routeProtected,addImage)
router.post('/properties/add-image/:id',routeProtected,upload.single('image'),storeImage)

router.get('/properties/update/:id',routeProtected,updateProperty)

router.post('/properties/update/:id',
routeProtected,
body('title').notEmpty().withMessage('El Titulo del anuncio es obligatorio'),
body('description')
.notEmpty().withMessage('La Descrición del anuncio es obligatorio')
.isLength({max:100}).withMessage('La Descrición es muy larga'),
body('category').isNumeric().withMessage('Selecciona una Categoria'),
body('price').isNumeric().withMessage('Selecciona un rango de Precios'),
body('bedrooms').isNumeric().withMessage('Selecciona la cantidad Habitaciones'),
body('garage').isNumeric().withMessage('Selecciona la cantidad Estacionamientos'),
body('wc').isNumeric().withMessage('Selecciona la cantidad Baños'),
body('lat').notEmpty().withMessage('Ubica la propiedad en el Mapa'),
saveChanges)

router.post('/properties/delete/:id',
routeProtected,
deleteProperty
)

router.get('/property/:id',getIndentifyUser,viewProperty)


router.post('/property/:id',
body('message').isLength({min:10}).withMessage('El mensaje no puede ir vacío o es muy corto'),
sendMessage)

export default router