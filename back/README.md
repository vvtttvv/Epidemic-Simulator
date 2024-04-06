# Rust web server

## Overview

This web server is a simple HTTP server implemented in Rust using the `std::net` module. It listens for incoming TCP connections on port 8080, receives data from clients, processes it using an algorithm module, and sends back responses in JSON format.

## Modules

### Algorithm

The `algorithm` module contains the logic for processing the data received from the frontend. It simulates an algorithm that generates a vector of hash maps representing the responses. The algorithm's behavior can be customized or replaced with a different algorithm module as needed.

### Main

The `main` module contains the main server logic. It handles incoming TCP connections, reads data from clients, processes the data using the algorithm module, and sends back responses.

## Usage

1. Start the server by running the executable.
2. Send data to the server using a TCP client (e.g., telnet, curl).
3. The server will process the data and send back responses in JSON format.

## Example

### Sending Data

Sent data should be in this format:

```json
{
	"parametr_name": "parametr_value",
	... ,
	...,
}
```

In the list should be all the parameters needed for algorithm

### Response

The server will respond with a JSON array containing the algorithm's simulated responses:

```json
[
{  "id": "value", "position_x": "value", "position_y": "value", "infected": "value", "dead": "value"},
{.....},
... ,
]
```

For all points that are simulated(the response will be sent several times per second, depending of frame rate)

## Dependencies

- `serde_json`: For serializing and deserializing JSON data.

## Code explanation

### Main function

#### variables

- listener - is TCP listener that is used to listen to incoming data on bind 127.0.0.1:8080
- stream - is the incoming data from front

#### logic

Using listener it accepts incoming data, checks it for errors and sent it to the receive_data function

### Receive_data function

#### variables

- buffer - a buffer for received data
- request - data from buffer in string format
- data_map - data from request in HashMap

#### logic

It reads data from stream and store in buffer, then transform it in string (request) and parse it in a HashMap(data_map) and then sent this HashMap and stream to sent_data

### Sent_data function

#### variables

- iterations - how many times the simulation will take
- response - is the received data from algorithm
- json_response - response in json format
- response_header - HTTP response header
- final_response - is a merge from response_header and json_response that will be sent to front

#### logic

It gets the iterations number from data_map and store it in iteration variable then makes a for loop from 0 to iteration number. In the loop is called algorithm and return value stored in response and after in json format in json_response. After is created a response header. And finally is created the final response and sent back to front with checking the errors.
