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

const User = sequelize.define('user',{
    name: {
        type: DataTypes.STRING,
    }
})

const Post = sequelize.define('post', {
    message: {
        type: DataTypes.STRING,
    }
})
const Cart = sequelize.define('cart')
// 1 ---- M
//we use both has one and belongs to so we can add utility methods get set create add 
User.hasMany(Post, { onDelete: 'CASCADE' })
Post.belongsTo(User, { onDelete: 'CASCADE' })

    sequelize.sync({force:true})//{force:true}
        .then(async () => {
            const users = await User.bulkCreate([{
                name: 'Mohamed'
            }, {
                name: 'Elsayed'
            }, {
                name: 'Abd El-fattah'
            }, {
                name: 'Ibrahim'
                },])
            
            await users[0].createPost({ message: "dadasdasdasdasdadsasdsa" })// 1

            const posts = await Post.bulkCreate([
                { message: "dadasdasdasdasdadsasdsa" },
                { message: "dadasdasdasdasdadsasdsa" },
                { message: "dadasdasdasdasdadsasdsa" },
                { message: "dadasdasdasdasdadsasdsa" },
                { message: "dadasdasdasdasdadsasdsa" },
                { message: "dadasdasdasdasdadsasdsa" },
                { message: "dadasdasdasdasdadsasdsa" }
            ])

            await users[1].addPosts(posts)// 2 add products to cart for example

            // sets foreign key to null
            await users[1].removePost(posts[0])

            console.log(await users[1].countPosts()) // 3

            // changing the foreign key to different user
            await posts[3].setUser(users[3])


        }).catch((e) => {
            console.log(e)
        })
