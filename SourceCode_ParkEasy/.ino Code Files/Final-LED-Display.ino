// "Park easy Module 3"
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include "LedControl.h"

// Arduino Pin 5 to DIN, 4 to Clk, 2 to LOAD, no.of devices is 1
LedControl lc = LedControl(5, 4, 2, 1);

// Wifi ssid and password - needs to be changed for testing
const char* ssid = "iPhone ank";
const char* password = "fluffyfire714";

// Initializing server host value
const char* host = "afternoon-peak-89776.herokuapp.com";
const int httpsPort = 443;

// Use web browser to view and copy
// SHA1 fingerprint of the certificate
const char* fingerprint = "CF 05 98 89 CA FF 8E D8 5E 5C E0 C2 E4 F7 E6 C3 C7 50 DD 5C";

// initialize display
void msg(int p,char m){
  lc.setChar(0, p, m, false);
}

void digits2screen(){
    lc.clearDisplay(0); // Clear dsplay register
    //serChar needs single ' not double "
    lc.setChar(0, 6, 'E', false);
    lc.setDigit(0, 5, 5, false);
    lc.setChar(0, 4, 'P', false);
    lc.setDigit(0, 3, 8, false);
    lc.setDigit(0, 2, 2, false);
    lc.setDigit(0, 1, 6, false);
    lc.setDigit(0, 0, 6, false);
}

WiFiClientSecure client;

void setup() {
   // Initialize the MAX7219 device
  lc.shutdown(0, false); // Enable display
  lc.setIntensity(0, 10); // Set brightness level (0 is min, 15 is max)
  lc.clearDisplay(0); // Clear dsplay register

  Serial.begin(115200);
  Serial.println();
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
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

  if (client.verify(fingerprint, host)) {
    Serial.println("certificate matches");
  } else {
    Serial.println("certificate doesn't match");
  }
}

void loop() {

   if (!client.connect(host, httpsPort)) {
    Serial.println("connection failed");
    return;
  }
  String url = "/api/parkingspot";
  Serial.print("requesting URL: ");
  Serial.println(host+url);

  // Sending request to server to check the next available parking spot.
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
  Serial.println("reply was:");
  Serial.println("==========");
  Serial.println(line);
  Serial.println("==========");
  Serial.println("closing connection");

  // LED display will display the next available parking spot.
  int pos = 0;
        for(int p = line.length() - 1; p >=  0; p--){
          msg(pos,line.charAt(p));
          pos++;
        }

}
