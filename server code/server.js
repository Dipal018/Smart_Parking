var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var nodemailer = require('nodemailer');
var cors = require('cors');
var ObjectID = mongodb.ObjectID;

var RECORDS_COLLECTION = "records";

var app = express();
app.use(bodyParser.json());
app.use(cors());

const accountSid = 'AC5224a26d5ab4610413b0090a087e559c';
const authToken = '2a0a997afc54c47825822d59247b4308';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);


// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parking.ninjasz@gmail.com',
    pass: 'spidermanne1.'
  }
});

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/records", function(req, res) {
  db.collection(RECORDS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/api/addspot", function(req, res) {
  
  var newRecord = {spot: Number(req.query.spot)};
  newRecord.user = null;
  newRecord.emailId = null;
  newRecord.phone = null;
  newRecord.checked = false;
  newRecord.halfchecked = false;
  newRecord.createDate = new Date();
  if (!req.query.spot) {
    handleError(res, "Invalid user input", "Must provide a spot.", 400);
  }

  db.collection(RECORDS_COLLECTION).findOne({ spot: Number(req.query.spot)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get spot");
    } else {
      if(doc === null){
        db.collection(RECORDS_COLLECTION).insertOne(newRecord, function(err, doc) {
          if (err) {
            handleError(res, err.message, "Failed to create new contact.");
          } else {
            res.status(201).json(doc);
          }
        });
      }else{
        res.status(200).json("spot already taken by other car");
      }
      
    }
  });
});

app.get("/api/getrecords", function(req, res) {
  db.collection(RECORDS_COLLECTION).findOne({ spot: Number(req.query.spot)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get spot");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/api/user", function(req, res) {
  db.collection(RECORDS_COLLECTION).findOne({ spot: Number(req.query.spot)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to add spot");
    } else {
      if(doc === null){
        res.status(200).json("no car parked at that spot")
      }else if(doc.user != null){
        res.status(200).json("Other person has registered at that spot. Please check your spot")
      }
      else{
        db.collection(RECORDS_COLLECTION).findOneAndUpdate({ spot: Number(req.query.spot)}, {$set:{user:req.query.name,emailId:req.query.email,phone:req.query.phone}}, {new: true},  function(err, doc) {
          if (err) {
            handleError(res, err.message, "Failed to get spot");
          } else {
              res.status(200).json(doc);
          }
        });
      }
    }
  });
});

app.get("/api/deleterecords/", function(req, res) {
  db.collection(RECORDS_COLLECTION).deleteOne({spot: Number(req.query.spot)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(result);
    }
  });
});

function checkTime(){
  db.collection(RECORDS_COLLECTION).find({}).toArray(function(err, docs) {
    if(docs){
      for(var i = 0; i < docs.length;i++){
        var date = new Date();
        var temp = Math.abs(date - docs[i].createDate)/1000;
    
        if(temp > 120 && temp < 240 && docs[i].halfchecked != true){
          if(docs[i].emailId != null){
            var mailOptions = {
              from: 'parking.ninjasz@gmail.com',
              to: docs[i].emailId,
              subject: 'Parking Alert',
              text: 'Half time limit for parking is completed. Please plan to leave the car before time expires'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
          }
          if(docs[i].phone != null){
            client.messages.create({
              to: '+1'+docs[i].phone, 
              from: '+14696175433', //Twilio number
              body: 'Your parking time limit is halfway! Please plan to remove your car from parking spot before it ends',
            })
            .then(message => console.log(message));
          }
          db.collection(RECORDS_COLLECTION).findOneAndUpdate({ spot: Number(docs[i].spot)}, {$set:{halfchecked:true}}, {new: true},  function(err, doc) {
            if (err) {
              handleError(res, err.message, "Failed to update checked");
            } 
          });

        }
        else if(temp > 240  && docs[i].checked != true){
          
          if(docs[i].emailId != null){
            var mailOptions = {
              from: 'kaushal.kabra@aol.com',
              to: docs[i].emailId,
              subject: 'Parking Alert from Parking Ninjas',
              text: 'Parking time limit for your spot is over. Please remove it quickly otherwise car will be towed in sometime.'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
          }
          var mailOptionsTow = {
            from: 'parking.ninjasz@gmail.com',
            to: 'ankitabatni@gmail.com',
            subject: 'Parking Alert',
            text: 'time over at spot '+docs[i].spot + ' .Please remove the car from the parking spot.'
          };
          transporter.sendMail(mailOptionsTow, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
          });
          if(docs[i].phone != null){
            client.messages.create({
              to: '+1'+docs[i].phone, 
              from: '+14696175433', //Twilio number
              body: 'Your parking time is expired! Please remove your car from parking spot otherwise it will be towed',
            })
            .then(message => console.log(message));
          }
          

          db.collection(RECORDS_COLLECTION).findOneAndUpdate({ spot: Number(docs[i].spot)}, {$set:{checked:true}}, {new: true},  function(err, doc) {
            if (err) {
              handleError(res, err.message, "Failed to update checked");
            } 
          });
        }
      }
      
    }
  });
}

app.get("/api/parkingspot", function(req, res) {
  db.collection(RECORDS_COLLECTION).find({}).sort({"spot": 1}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      var i;
      for(i = 0; i < docs.length;i++){
        if(Number(docs[i].spot) > i+1){
          break;
        }
      }
      checkTime();
      var ans = i+1 > 2 ? 0 : i+1;
      res.status(200).json("P-0"+ans);
    }
  });
});