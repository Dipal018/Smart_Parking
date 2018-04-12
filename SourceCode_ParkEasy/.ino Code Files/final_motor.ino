// "Park easy Module 2"
// Define pin connections for 1 proximity sensor1, motor and LED

#define sensorTrigPin    14
#define sensorEchoPin    4
#define LEDout 2
#define motor_pin 5
#define motor_direction 10
int openonce = 1;
boolean isCarPresent = false;
boolean isCarNotPresent = true;

void setup()
{
    Serial.begin(115200);
    pinMode(sensorTrigPin, OUTPUT);
    pinMode(sensorEchoPin, INPUT);
    pinMode(motor_pin, OUTPUT);
    pinMode(motor_direction, OUTPUT);
    digitalWrite(motor_pin, LOW);
    digitalWrite(motor_direction, LOW);
    Serial.println("Starting....");
    pinMode(LEDout, OUTPUT);

}

void loop()
{
    delay(1000);
    int pulseWidth = 0;
    float dist = 0;

    // Initializing pin modes of sensors and LEDs
    digitalWrite(sensorTrigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(sensorTrigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(sensorTrigPin, LOW);


    // Getting the distance of the car from the proximity sensor at the arrivale gate
    pulseWidth = pulseIn(sensorEchoPin, HIGH);
    dist = (pulseWidth/2) / 29.1;

    Serial.print("Distance  ");
    Serial.println(dist);

    // If distance is less than 10cm means the car has arrived so this will request motor to open the door.
    if (dist < 10.0) {
      isCarPresent = true;
      if(isCarPresent && isCarNotPresent){
        isCarNotPresent = false;

      digitalWrite(LEDout,HIGH);
      digitalWrite(motor_pin, HIGH);
    Serial.println("garage door open");

    delay(400);

    Serial.println("motor stopped");
    digitalWrite(motor_pin, LOW);
    digitalWrite(motor_direction, LOW);
      }
    }
    else {
      delay(1000);
      isCarNotPresent = true;
      if(isCarPresent && isCarNotPresent){
        isCarPresent = false;
        digitalWrite(motor_pin, HIGH);
        digitalWrite(LEDout,LOW);
        Serial.println("garage door closing ");
        delay(1110);
        digitalWrite(motor_pin, LOW);
        }
    }
}
