const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./untils/geocode')
const forecast = require('./untils/forecast')

const app = express()
const port  = process.env.PORT || 3000


//Define paths for Express config
const publicDirectorypath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and view location
app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialPath)

//Setup directory to server
app.use(express.static(publicDirectorypath))

app.get('',(req,res) => {
    res.render('index',{
        title: 'Weather',
        name :'Tien Anh'
    })
})

app.get('/about',(req,res) =>{
    res.render('about',{
        title : 'About page',
        name : 'Tien Anh'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        title : 'Help Page',
        name : 'Tien Anh'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/products',(req,res) => {
    if(!req.query.search){
        return res.send({
            error:'You must provide a seach term'
        })
    }

    console.log(req.query.search)
    res.send({
        product :[]
    })
})

app.get('/help/*',(req,res) => {
    res.render('404',{
        title:'404 Page',
        name:'Tien anh',
        message:'Help article not found'
    })
})
app.get('*',(req,res) => {
    res.render('404',{
        title:'404 Page',
        name:'Tien anh',
        message: 'Page not found'
    })
})


app.listen(port,() => {
    console.log('Server is running on port '+port)
})