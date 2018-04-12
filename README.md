Title: Smart_Parking

Desciption:

An IoT based parking automation system where 
sensor detects the parking lot occupancy which can be used to detect the available parking spot and sends message 
to car owner if the time limit is about to expire. Used ESP8266 board, sensors as hardwares, Arduino IDE in C for hardware development, 
Angular.js, HTML, CSS for web interface design and PhoneGap for mobile app development.

Components:
- Microcontroller-based sensor module 
- Phonegap Mobile App 
- RESTful API web server (middleware) 
- User-facing web application.

Block Diagram:

![Alt text](https://i0.wp.com/dipalsblog.files.wordpress.com/2018/04/c.png?ssl=1&w=450 "Optional title") 

Prerequisites:
- ESP8266 controllers
- Proximity Sensors, LED display, Motor
- Arduino IDE
- JDK
- PhoneGap
- Twilio

Screenshots:

Web Interface:

![Alt text](https://i0.wp.com/dipalsblog.files.wordpress.com/2018/04/cc.jpg?ssl=1&w=450 "Optional title") 

Mobile App:

![Alt text](https://i1.wp.com/dipalsblog.files.wordpress.com/2018/04/ccc.png?ssl=1&w=450 "Optional title")

![Alt text](https://i1.wp.com/dipalsblog.files.wordpress.com/2018/04/cccc.png?ssl=1&w=450 "Optional title")

Model:

![Alt text](https://i0.wp.com/dipalsblog.files.wordpress.com/2018/04/mvimg_20180316_154806.jpg?ssl=1&w=450 "Optional title")

Getting Started: 
To build and run the server, follow the below given instructions:
Open terminal and install npm, node.js for your laptop from the link http://blog.teamtreehouse.com/install-node-js-npm-mac.
Open terminal in your laptop and change the directory to the server folder.
Run a npm install command in the terminal to install all dependencies like express, cors, twilio, nodemailer.
Then run node server.js in the terminal to run the server

To build and run the web application, follow the below given instructions:
Open terminal and install npm, node.js for your laptop from the link http://blog.teamtreehouse.com/install-node-js-npm-mac.
Then open terminal and run “npm install -g create-react-app” in terminal.
Run “cd iotwebapp” in terminal to go to the iotwebapp directory.
Run “npm install” command in terminal to install all dependencies and node modules required for the application. (Require npm in your laptop.)
Run command “yarn start” or “npm start” in terminal to start the application. 

To build and run the phonegap application, follow the below given instructions:
Open the folder Phonegap in phonegap application or add it as project in phonegap application.
Run it on the  phonegap application and you will get a server url with port number.
Open the phonegap developer app in mobile and put the url with port number to use application on phone.

To Access Web Interface of the application use the following link:
	https://parkingninjas.herokuapp.com/

Following are the REST endpoints for the application:
To get the next available parking spot
https://afternoon-peak-89776.herokuapp.com/api/parkingspot

To add the parking spot occupied in the database
	https://afternoon-peak-89776.herokuapp.com/api/addspot?spot=spotNumber

To remove the spot from the database after time limit is over
https://afternoon-peak-89776.herokuapp.com/api/deleterecords?spot=spotNumber

To see all the car parked status 
https://afternoon-peak-89776.herokuapp.com/api/records

To add user to the specified parking spot
https://afternoon-peak-89776.herokuapp.com/api/user?spot=1&name=username

Demo:
https://www.youtube.com/watch?v=tQEayq2EdTY&feature=youtu.be


