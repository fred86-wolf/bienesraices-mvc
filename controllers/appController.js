import { Sequelize } from 'sequelize'
import {Price,Property,Category} from '../models/index.js'

const home = async (req,res)  => {

    const [categories,prices,houses,apartments] = await Promise.all([
        Category.findAll({raw:true}),
        Price.findAll({raw:true}),
        Property.findAll({
            limit:3,
            where:{
                idCategory:1
            },
            include:[
                {model:Price,as:'price'}
            ],
            order:[
                ['createdAt','DESC']
            ]
        }),
        Property.findAll({
            limit:3,
            where:{
                idCategory:2
            },
            include:[
                {model:Price,as:'price'}
            ],
            order:[
                ['createdAt','DESC']
            ]
        })
    ])

    res.render('start',{
        page:'Inicio',
        categories,
        prices,
        houses,
        apartments,
        csrfToken:req.csrfToken()
    })

}

const categories = async (req,res) => {
    const {id} = req.params

    const category = await Category.findByPk(id)
    if (!category) {
        return res.redirect('/404')
    }

    const properties = await Property.findAll({
        where:{
            idCategory:id
        },
        include:[
            {model:Price,as:'price'}
        ]
    })

    res.render('category',{
        page:`${category.name}s en Venta`,
        properties,
        csrfToken:req.csrfToken()
    })
}

const notFound = (req,res) => {
    res.render('404',{
        page:'No Encontrada',
        csrfToken:req.csrfToken()
    })
}

const search = async (req,res) => {
    const {term} = req.body

    if(!term.trim()){
        return res.redirect('back')
    }

    const properties = await Property.findAll({
        where:{
            title:{
                [Sequelize.Op.like] : '%' + term + '%'
            }
        },
        include:[
            {model:Price,as:'price'}
        ]
    })

    res.render('search',{
        page:'Resultados de la Búsqueda',
        properties,
        csrfToken:req.csrfToken()
    })
}

export {
    home,
    categories,
    notFound,
    search
}