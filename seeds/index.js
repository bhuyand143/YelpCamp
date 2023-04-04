const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seed-Helper');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Mongo Connection Open!')
    })
    .catch(err => {
        console.log('Oh no Mongo Connection Error!')
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randcity = sample(cities);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '642631bc430f06a915a8a6ec',
            location: `${randcity.city}, ${randcity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet suscipit nobis eos assumenda veniam, nam sequi accusamus sed laborum, officiis maxime velit aut illo incidunt culpa, provident dicta! Commodi, iste.',
            price,// same as price:price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dvikc6svo/image/upload/v1680567334/YelpCamp/ib5tkfxy6ttrmtgdlppn.jpg',
                    filename: 'YelpCamp/ib5tkfxy6ttrmtgdlppn',
                },
                {
                    url: 'https://res.cloudinary.com/dvikc6svo/image/upload/v1680567334/YelpCamp/rpuhwdphiy2qprfmzqva.jpg',
                    filename: 'YelpCamp/rpuhwdphiy2qprfmzqva',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});