import { validationResult } from 'express-validator'
import {unlink} from 'node:fs/promises'
import {Price,Category,Property}from '../models/index.js'
import {isSeller} from '../helpers/index.js'

const admin = async (req,res) => {

    
    const {pagina} = req.query
    const regx = /^[1-9]$/

    if (!regx.test(pagina)) {
        return res.redirect('/your-properties?pagina=1')
    }

    try {
        const {id} = req.user

        const limit = 5
        const offset = ((pagina * limit) - limit)


        const [properties,total] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where:{
                    idUser:id
                },
                include:[
                    {model:Price,as:'price'},
                    {model:Category, as:'category'}
                ],
            }),
            Property.count({
                where:{
                    idUser:id
                }
            })
        ])
        


    res.render('properties/admin',{
        page:'Mis Propiedades',
        csrfToken:req.csrfToken(),
        properties,
        paginas:Math.ceil(total/limit),
        currentPage:Number(pagina),
        total,
        limit,
        offset
    })
    } catch (error) {
        console.log(error)
    }
}

const createProperty = async(req,res) => {
    const [categories,prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])
    res.render('properties/create',{
        page:'Crear Propiedad',
        csrfToken:req.csrfToken(),
        categories,
        prices,
        data:{}
    })
}

const saveProperty = async(req,res) => {
    //Validtion
    let result = validationResult(req)

    if (!result.isEmpty()) {
        const [categories,prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/create',{
            page:'Crear Propiedad',
            csrfToken:req.csrfToken(),
            categories,
            prices,
            errors:result.array(),
            data:req.body
        })
    }

    const {title,description,category:idCategory,price:idPrice,bedrooms,garage,wc,street,lat,lng} = req.body
    const {id:idUser} = req.user
    

    try {
        const propertySaved = await Property.create({
            title,
            description,
            bedrooms,
            garage,
            wc,
            street,
            lat,
            lng,
            image:'',
            idPrice,
            idCategory,
            idUser
        })

        const {id} = propertySaved

        res.redirect(`/properties/add-image/${id}`)

    } catch (error) {
        console.log(error)
    }

}

const addImage = async (req,res) => {

    const {id} = req.params
    
    const property = await Property.findByPk(id)

    /**If exits property */
    if (!property) {
        return res.redirect('/your-properties')
    }

    /** Posted */
    if (property.posted) {
        return res.redirect('/your-properties')
    }

    /** Is your property */
    if (req.user.id.toString() !==  property.idUser.toString()) {
        return res.redirect('/your-properties')
    }



    res.render('properties/add-image',{
        page:`Agregar Imagen: ${property.title}`,
        csrfToken:req.csrfToken(),
        property
    })
}

const storeImage = async (req,res,next) => {

    const {id} = req.params
    
    const property = await Property.findByPk(id)

    /**If exits property */
    if (!property) {
        return res.redirect('/your-properties')
    }

    /** Posted */
    if (property.posted) {
        return res.redirect('/your-properties')
    }

    /** Is your property */
    if (req.user.id.toString() !==  property.idUser.toString()) {
        return res.redirect('/your-properties')
    }

    try {

        property.image = req.file.filename
        property.posted = 1

        /**Store image */
        await property.save()

        next()
    } catch (error) {
        console.log(error)
    }
}


const updateProperty = async(req,res) => {
    const {id} = req.params
    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/your-properties')
    }

    if (property.idUser.toString() !== req.user.id.toString()) {
        return res.redirect('/your-properties')
    }

    const [categories,prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])
    res.render('properties/update',{
        page:`Editar Propiedad: ${property.title}`,
        csrfToken:req.csrfToken(),
        categories,
        prices,
        data:property
    })
}

const saveChanges = async(req,res) => {

    let result = validationResult(req)

    if (!result.isEmpty()) {
        const [categories,prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/update',{
            page:'Editar Propiedad',
            csrfToken:req.csrfToken(),
            categories,
            prices,
            errors:result.array(),
            data:req.body
        })
    }

    const {id} = req.params

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/your-properties')
    }

    if (property.idUser.toString() !== req.user.id.toString()) {
        return res.redirect('/your-properties')
    }


    try {
        const {title,description,category:idCategory,price:idPrice,bedrooms,garage,wc,street,lat,lng} = req.body

        property.set({
            title,
            description,
            bedrooms,
            garage,
            wc,
            street,
            lat,
            lng,
            idPrice,
            idCategory
        })

        await property.save()

        res.redirect('/your-properties')

    } catch (error) {
        console.log(error)
    }



}

const deleteProperty = async (req,res) => {
    
    const {id} = req.params

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/your-properties')
    }

    if (property.idUser.toString() !== req.user.id.toString()) {
        return res.redirect('/your-properties')
    }

    await unlink(`public/uploads/${property.image}`)

    await property.destroy()
    res.redirect('/your-properties')
}

const viewProperty = async (req,res) => {

    const {id} = req.params

    const property = await Property.findByPk(id,{
        include:[
            {model:Price, as:'price'},
            {model:Category, as:'category'}
        ]
    })

    if (!property) {
        return res.redirect('/404')
    }

    res.render('properties/view',{
        property,
        page:property.title,
        csrfToken:req.csrfToken(),
        user:req.user,
        isSeller:isSeller(req.user?.id,property.idUser)
    })
}


const sendMessage = async (req,res) => {

    const {id} = req.params

    const property = await Property.findByPk(id,{
        include:[
            {model:Price, as:'price'},
            {model:Category, as:'category'}
        ]
    })

    if (!property) {
        return res.redirect('/404')
    }

    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('properties/view',{
            property,
            page:property.title,
            csrfToken:req.csrfToken(),
            user:req.user,
            isSeller:isSeller(req.user?.id,property.idUser),
            errors:result.array()
        })
    }

    res.render('properties/view',{
        property,
        page:property.title,
        csrfToken:req.csrfToken(),
        user:req.user,
        isSeller:isSeller(req.user?.id,property.idUser)
    })

}

export {
    admin,
    createProperty,
    saveProperty,
    addImage,
    storeImage,
    updateProperty,
    saveChanges,
    deleteProperty,
    viewProperty,
    sendMessage
}