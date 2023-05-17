const Sequelize = require('sequelize')
const { DataTypes, op } = Sequelize

//connection 
const sequelize = new Sequelize( 'test',
'me',
'621654', {
    dialect: 'mysql',
    host: '127.0.0.1',
    logging: false
})

const Customer = sequelize.define('customer',{
    name: {
        type: DataTypes.STRING,
    }
})

const Product = sequelize.define('product', {
    name: {
        type: DataTypes.STRING,
    }
})
const CustomerProduct = sequelize.define('customerproduct', {
    name: {
        type: DataTypes.STRING,
    }
})
//const Cart = sequelize.define('cart')
// 1 ---- M
//we use both has one and belongs to so we can add utility methods get set create add 
Customer.belongsToMany(Product, { through: CustomerProduct })
Product.belongsToMany(Customer, { through: CustomerProduct })

    sequelize.sync({force:true})//{force:true}
        .then(async () => {
            const customers = await Customer.bulkCreate([{
                name: 'Mohamed'
            }, {
                name: 'Elsayed'
            }, {
                name: 'Abd El-fattah'
            }, {
                name: 'Ibrahim'
                },])
            
            const products = await Product.bulkCreate([{
                name: '1'
            }, {
                name: '2'
            }, {
                name: '3'
            }, {
                name: '4'
                },])
        
            await customers[0].addProduct(products[0], { through: { name: products[0].name } })
            
            await products[1].addCustomers(customers, { through: { name: products[0].name } })
            
            const customerProducts = await customers[0].getProducts()
            
            console.log(customerProducts[0].toJSON())

        
        }).catch((e) => {
            console.log(e)
        })
