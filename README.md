# Flight Booking System - Microservice Architecture

This project is a Flight Booking System built using Node.js and MySQL, following a microservice architecture. It consists of multiple microservices such as API gateway, booking service, flight and search service, and notification service. The communication between the microservices is facilitated by RabbitMQ, which acts as the message queue.


## Microservices


1. [API-gateway-flights](https://github.com/hossain-asif/API-gateway-flights)

   - Responsible for user authentication and authorization.
   - Manages user accounts, login, and registration.
   - Generates and verifies JSON Web Tokens (JWT) for secure API access.
   - Serves as the entry point for external requests to the system.
   - Provides a unified API interface for clients to communicate with various microservices.
   - Performs request validation, rate limiting, and routing to the appropriate microservice.

2. [Flight-booking-service](https://github.com/hossain-asif/Flight-booking-service)

   - Handles flight bookings and related operations.
   - Allows users to select seats, make reservations and make payment.
   - Manages booking details and communicates with the flight and search service.

3. [Flight and Search Service](https://github.com/hossain-asif/Flights-service)

   - Manages flight information, including available seats, prices, and schedules.
   - Provides search functionality for users to find flights based on criteria such as origin, destination, and date.
   - Sends notifications to the booking service about flight availability and updates.

4. [Flight-notification-service](https://github.com/hossain-asif/Flight-notification-service)

   - Sends reminders and notifications to users about upcoming flights, check-in details, and booking updates.
   - Integrates with external notification systems (e.g., email, SMS) to deliver messages.


## Database

The Flight Booking Service interacts with the MySQL database to store and retrieve flight booking information. The necessary database tables and their structure can be found in the `database` folder.

Ensure that you have set up the database connection details correctly in the configuration file of the Booking Service.

## RabbitMQ Integration

The Flight Booking Service integrates with RabbitMQ, the message queue system, to receive notifications and updates from other microservices, such as the Flight and Search Service. This enables real-time communication and synchronization between different components of the Flight Booking System.

Make sure to configure the RabbitMQ connection details in the Booking Service's configuration file to establish a connection and listen to the relevant message queues.




## Acknowledgments

I would like to acknowledge the following resources and libraries that contributed to the development of the Booking Service:

- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/
- RabbitMQ: https://www.rabbitmq.com/
- Express.js: https://expressjs.com/
- Other dependencies mentioned in the `package.json` file.