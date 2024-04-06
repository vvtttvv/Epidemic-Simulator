mod algorithm;

use algorithm::algorithm;
use std::collections::HashMap;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};

fn receive_data(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();
    let request = String::from_utf8_lossy(&buffer[..]);
    println!("Received data from frontend: {}", request);
    let mut data_map = HashMap::new();
    let trimmed_request = request.trim_start_matches('{').trim_end_matches('}'); // Remove leading and trailing '{' and '}'
    for param in trimmed_request.split(',') {
        if let Some((key, value)) = param.split_once(":") {
            let key = key.trim().trim_matches('"').to_string(); // Remove leading and trailing quotes from the key
            let value = value.trim().trim_matches('"').to_string(); // Remove leading and trailing quotes from the value
            data_map.insert(key, value);
        }
    }

    let _ = send_data(data_map, stream);
}

fn send_data(data_map: HashMap<String, String>, mut stream: TcpStream) -> Result<(), ()> {
    let iterations = match data_map.get("iterations") {
        Some(val) => val.parse::<u32>().unwrap_or(1),
        None => 1,
    };

    for _ in 0..iterations {
        let response: Vec<HashMap<String, String>> = algorithm();
        let json_response = serde_json::to_string(&response).unwrap();

        let mut response_headers = String::new();
        response_headers.push_str("HTTP/1.1 200 OK\r\n");
        response_headers.push_str("Content-Type: application/json\r\n");
        response_headers.push_str("Access-Control-Allow-Origin: *\r\n"); // Allow requests from any origin (for testing purposes)
        response_headers.push_str("Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"); // Allow POST, GET, OPTIONS requests
        response_headers.push_str("Access-Control-Allow-Headers: Content-Type\r\n"); // Allow Content-Type header
        response_headers.push_str(&format!("Content-Length: {}\r\n\r\n", json_response.len()));

        let final_response = format!("{}{}", response_headers, json_response);
        if let Err(_) = stream.write_all(final_response.as_bytes()) {
            return Err(());
        }
    }

    Ok(())
}

fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
    println!("Server listening on port 8080...");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("New connection: {}", stream.peer_addr().unwrap());
                receive_data(stream);
            }
            Err(e) => {
                println!("Error: {}", e);
            }
        }
    }
}
