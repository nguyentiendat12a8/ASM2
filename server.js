var express = require('express')
var hbs = require('hbs')

var app= express()
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://nguyentiendat12a8:sofm27112000@cluster0.eztba.mongodb.net/test';  

app.get('/', async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let results = await dbo.collection("student").find({}).toArray();
    res.render('index',{model:results})
})
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/search',(req,res)=>{
    res.render('search')
})

app.get('/insert',(req,res)=>{
    res.render('insert')
})

app.post('/doDelete', async(req,res)=>{
    let id = req.query.id;
    var ProductID = require("mongodb").ProductID;
    console.log(id)
    let Delete = {"_id":ProductID(id)};
    let client= await MongoClient.connect(url);
        let dbo = client.db("ProductDB");
        await dbo.collection("student").deleteOne(Delete);
        
        res.render('/')

})

app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let colorInput = req.body.txtColor;
    let priceInput = req.body.txtPrice;
    let errorMsg =  {
        name : '',
        price: ''
    }
    if(nameInput !=null && nameInput.length <5){
        errorMsg.name = "Name's length >=5";
    }
    if(priceInput !=null && eval(priceInput)< 0){
        errorMsg.price = 'Price must >=0'
    }
    if(errorMsg.name.length !=0 || errorMsg.price.length){
        res.render('insert',{error:errorMsg})
    }else{
            let newProduct = {
            productName : nameInput,
            price: priceInput,
            color: colorInput
        }
        let client= await MongoClient.connect(url);
        let dbo = client.db("ProductDB");
        await dbo.collection("student").insertOne(newProduct);
        res.redirect('/')
    }
    
})

app.post('/doSearch',async (req,res)=>{
    let nameSearch = req.body.txtSearch;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let results = await dbo.collection("student").find({productName:nameSearch}).toArray();
    res.render('index',{model:results})
})

//a
const PORT = process.env.PORT || 3000;
app.listen(PORT)
console.log('Server is running')