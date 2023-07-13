import express from 'express' 
import {home,
    categories,
    notFound,
    search} from '../controllers/appController.js'

const router = express.Router()

router.get('/',home)

router.get('/categories/:id',categories)

router.get('/404',notFound)

router.post('/search',search)


export default router