import Property from './Property.js'
import Price from './Price.js'
import Category from './Category.js'
import User from './User.js'
import Message from './Message.js'

Property.belongsTo(Price,{foreignKey:'idPrice'})
Property.belongsTo(Category,{foreignKey:'idCategory'})
Property.belongsTo(User,{foreignKey:'idUser'})
Message.belongsTo(Property, {foreignKey:'idProperty'})
Message.belongsTo(User,{foreignKey:'idUser'})


export {
    Property,
    Price,Category,User,Message
}