const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jamdrup:BzbVtWzeZXVb1Nc5@cluster0.ekpan.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
var userCollection;
var orderCollection;

client.connect(err => {
   userCollection = client.db("giftdelivery").collection("users");
   orderCollection = client.db("giftdelivery").collection("orders");
   
  // perform actions on the collection object
  console.log ('Database up!\n')
 
});


app.get('/', (req, res) => {
  res.send('<h3>Welcome to Gift Delivery server app!</h3>')
})

 
app.get('/getUserDataTest', (req, res) => {

	console.log("GET request received\n"); 

	userCollection.find({}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
			console.log("Some error.. " + err + "\n");
			res.send(err); 
		} else {
			console.log( JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>"); 
		}

	});

});


app.get('/getOrderDataTest', (req, res) => {

	console.log("GET request received\n"); 

	orderCollection.find({},{projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.send(err); 
		} else {
			console.log( JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>"); 
		}

	});

});


app.post('/verifyUser', (req, res) => {

	console.log("POST request received : " + JSON.stringify(req.body) + "\n"); 

	loginData = req.body;

	userCollection.find({email:loginData.email, password:loginData.password}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
		    console.log(JSON.stringify(docs) + " have been retrieved.\n");
		   	res.status(200).send(docs);
		}	   
		
	  });

});


app.post('/postOrderData', function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body) + "\n"); 
    
    orderCollection.insertOne(req.body, function(err, result) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		}else {
			console.log("Order record with ID "+ result.insertedId + " have been inserted\n"); 
			res.status(200).send(result);
		}
		
	});
       
});

app.post('/postUserData', function (req, res) {
    console.log("User POST request received: " + JSON.stringify(req.body) + "\n");

    //const userData = Array.isArray(req.body) ? req.body : [req.body];

    userCollection.insertOne(req.body, function(err, result) {
	if (err) {
            console.error("Error inserting data: " + err + "\n");
            res.status(500).send({ error: "An error occurred while inserting data." });
        } else {
            //console.log("Order record with ID " + result.insertedId + " has been inserted\n");
            res.status(200).send(result);
        }
    });
});

app.get('/getPastOrder', (req, res) => {
	console.log("GET request received\n" );
	let email = req.query.email 
	
	orderCollection.find({customerEmail:email}).toArray( function(err, docs) {
		if (err) {
            console.error("Error fetching orders: " + err + "\n");
            res.status(500).send({ error: "An error occurred while fetching orders." });
        } else {
			//console.log(docs)
            res.status(200).send(docs);
        }
    });

});

app.get('/getDeleteOrder', (req, res) => {
	console.log("GET request received\n" );
	let email = req.query.email 
	
	orderCollection.find({customerEmail:email}).toArray( function(err, docs) {
		if (err) {
            console.error("Error fetching orders: " + err + "\n");
            res.status(500).send({ error: "An error occurred while fetching orders." });
        } else {
			//console.log(docs)
            res.status(200).send(docs);
        }
    });

});


app.post('/deleteOrders', async (req, res) => {
    const ordersToDelete = req.body.orders;
    try {
        
        const result =  orderCollection.deleteMany({ orderId: { $in: ordersToDelete } });
        res.json({ deletedCount: result.deletedCount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting orders');
    }
});

  
app.listen(port, () => {
  console.log(`Gift Delivery server app listening at http://localhost:${port}`) 
});
