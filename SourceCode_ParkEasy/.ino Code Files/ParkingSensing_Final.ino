// "Park easy Module 1"
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
// Define pin connections for 2 proximity sensors and 2 LED
#define sensorTrigPin1    16
#define sensorEchoPin1    5
#define led1 14

#define  sensorTrigPin2 4
#define sensorEchoPin2 0
#define led2 12

// Wifi ssid and password - needs to be changed for testing
const char* ssid = "Hobbes";
const char* password = "5104324382";

// Initializing server host value
const char* host = "afternoon-peak-89776.herokuapp.com";
const int httpsPort = 443;

WiFiClientSecure client;

void setup() {
  // Wifi connection setup
  Serial.begin(115200);
  Serial.println();
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  // Initializing pin modes of sensors and LEDs
  pinMode(sensorTrigPin1, OUTPUT);
  pinMode(sensorEchoPin1, INPUT);
  pinMode(led1, OUTPUT);
  pinMode(sensorTrigPin2, OUTPUT);
  pinMode(sensorEchoPin2, INPUT);
  pinMode(led2, OUTPUT);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Use WiFiClientSecure class to create TLS connection
  WiFiClientSecure client;
  Serial.print("connecting to ");
  Serial.println(host);
  if (!client.connect(host, httpsPort)) {
    Serial.println("connection failed");
    return;
  }
}

// flag values to check the status of parking spot
boolean isOccupied1 = false;
boolean isOccupied2 = false;
boolean occupyReq1 = false;
boolean occupyReq2 = false;
boolean removeReq1 = false;
boolean removeReq2 = false;
boolean state1 = false;
boolean state2 = false;

void loop() {

   int pulseWidth1 = 0;
   float dist1 = 0;
   int pulseWidth2 = 0;
   float dist2 = 0;

   if (!client.connect(host, httpsPort)) {
    Serial.println("connection failed");
    return;
  }

  // Getting the distance of the car from the proximity sensor for parking spot 1
    digitalWrite(sensorTrigPin1, LOW);
    delayMicroseconds(2);
    digitalWrite(sensorTrigPin1, HIGH);
    delayMicroseconds(10);
    digitalWrite(sensorTrigPin1, LOW);

   // Calculating distance in centimeter and setting a flag if the distance is less than 10cm which means parking spot is occupied
    pulseWidth1 = pulseIn(sensorEchoPin1, HIGH);
    dist1 = (pulseWidth1/2) / 29.1;
    if (dist1 < 10.0) {
      digitalWrite(led1,HIGH);
      isOccupied1 = true;
    }
    else {
      digitalWrite(led1, LOW);
      isOccupied1 = false;
      removeReq1 = false;
    }

    // Getting the distance of the car from the proximity sensor for parking Spot2
    digitalWrite(sensorTrigPin2, LOW);
    delayMicroseconds(2);
    digitalWrite(sensorTrigPin2, HIGH);
    delayMicroseconds(10);
    digitalWrite(sensorTrigPin2, LOW);

    // Calculating distance in centimeter and setting a flag if the distance is less than 10cm which means parking spot is occupied
    pulseWidth2 = pulseIn(sensorEchoPin2, HIGH);
    dist2 = (pulseWidth2 / 2) / 29.1;
    if (dist2 < 10.0) {
      digitalWrite(led2,HIGH);
      isOccupied2 = true;
    }
    else {
      digitalWrite(led2, LOW);
      isOccupied2 = false;
      removeReq2 = false;
    }

    // These flag values are set so that server can not send request repeatadely
    if(state1 != isOccupied1){
      state1 = isOccupied1;
      occupyReq1 = false;
      removeReq1 = false;
    }

    if(state2 != isOccupied2){
      state2 = isOccupied2;
      occupyReq2 = false;
      removeReq2 = false;
    }

    Serial.print("Distance of spot1=");
    Serial.println(dist1);
    Serial.print("Distance of spot2 =");
    Serial.println(dist2);
    delay(1000);

    // if the parking spot is occupied then send add car request for that parking spot and if the car is not available or moved from the parking spot then send remove car request for that parking spot.
    if (isOccupied1 == true) {
      if (!occupyReq1) {
         //send occupy request for 1
        requestHttpOccupy("1");
        occupyReq1 = true;
      }
    }
    else { //isOccupied1 == false
      if(!removeReq1) {
        // send remove request for 1
        requestHttpRemove("1");
        removeReq1 = true;
      }
    }

    if (isOccupied2 == true) {
      if (!occupyReq2) {
         //send occupy request for 2
        requestHttpOccupy("2");
        occupyReq2 = true;
      }
    }
    else { //isOccupied1 == false
      if(!removeReq2) {
        // send remove request for 2
        requestHttpRemove("2");
        removeReq2 = true;
      }
    }
}

// This function sends request to server to add the car
void requestHttpOccupy(String spot) {
  String url = "/api/addspot?spot=" + spot;
  Serial.print("requesting URL: ");
  Serial.println(host+url);

  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "User-Agent: BuildFailureDetectorESP8266\r\n" +
               "Connection: close\r\n\r\n");

  Serial.println("request sent");
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }
  String line = client.readStringUntil('\n');
  if (line.startsWith("{\"state\":\"success\"")) {
    Serial.println("Added!");
  } else {
    Serial.println("Failed");
  }
  Serial.println("reply was:");
  Serial.println("==========");
  Serial.println(line);
  Serial.println("==========");
  Serial.println("closing connection");
  }



// This function sends request to server to remove the car
void requestHttpRemove(String spot) {
  String url = "/api/deleterecords?spot=" + spot;
  Serial.print("requesting URL: ");
  Serial.println(host+url);

  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "User-Agent: BuildFailureDetectorESP8266\r\n" +
               "Connection: close\r\n\r\n");

  Serial.println("request sent");
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }
  String line = client.readStringUntil('\n');
  if (line.startsWith("{\"state\":\"success\"")) {
    Serial.println("Deleted!!");
  } else {
    Serial.println("Failed");
  }
  Serial.println("reply was:");
  Serial.println("==========");
  Serial.println(line);
  Serial.println("==========");
  Serial.println("closing connection");
  }

