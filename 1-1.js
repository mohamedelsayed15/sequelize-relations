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

const Country = sequelize.define('country',{
    countryName: {
        type: DataTypes.STRING,
        unique:true
    }
})

const Capital = sequelize.define('capital', {
    capitalName: {
        type: DataTypes.STRING,
        unique:true
    }
})
// 1 ---- 1
//we use both has one and belongs to so we can add utility methods (get set create)
Country.hasOne(Capital, { onDelete: 'CASCADE' })
// means when parent is destroyed all Foreign keys associated will be removed 
Capital.belongsTo(Country, { onDelete: 'CASCADE' })

    sequelize.sync({force:true})//{force:true}
        .then(async () => {
            const countries = await Country.bulkCreate([{
                countryName: 'Egypt'
            }, {
                countryName: 'Spain'
            }, {
                countryName: 'Greece'
            }, {
                countryName: 'Libya'
            }, {
                countryName: 'Tunisia'
            },])
            console.log(countries[0].toJSON())

            //first way we create capital and set it directly to country
            countries[0].createCapital({ capitalName: "cairo" })// 1 

            // second way we create capital first
            let capital = await Capital.create({
                capitalName: "Madrid"
            })
            // then we assign it to its country
            await countries[1].setCapital(capital) // 2

            await countries[1].destroy() // CASCADE delete all foreign keys
            // get the capital
            capital = await countries[1].getCapital() // 3
            
            console.log(capital)

        })
        .catch((e) => {
            console.log(e)
        })
