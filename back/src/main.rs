use futures::stream::StreamExt;
use futures::SinkExt;
use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, UdpSocket};
use tokio::net::TcpListener;
use tokio::net::TcpStream;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;

#[tokio::main]
async fn main() {
    let addr = "0.0.0.0:8080";
    let listener = TcpListener::bind(addr).await.expect("Failed to bind");
    let ip = get_local_ip().unwrap();
    println!("Server running on {}:8080", ip);

    let mut clients: HashMap<usize, String> = HashMap::new();

    while let Ok((stream, addr)) = listener.accept().await {
        let client_id = clients.len() + 1;
        clients.insert(client_id, addr.to_string());
        println!("Client {} connected", client_id);
        tokio::spawn(handle_connection(stream, client_id));
    }
}

async fn handle_connection(stream: TcpStream, client_id: usize) {
    let ws_stream = accept_async(stream)
        .await
        .expect("Error during WebSocket handshake");

    let (mut ws_sender, mut ws_receiver) = ws_stream.split();

    while let Some(msg) = ws_receiver.next().await {
        let msg = msg.expect(format!("Error receiving message from client {}", client_id).as_str());
        println!("{}", msg);
        let map: HashMap<String, String> = match serde_json::from_str(&msg.to_string()) {
            Ok(map) => map,
            Err(e) => {
                eprintln!("Error parsing message: {:?}", e);
                return;
            }
        };
        println!("Parsed map:");
        for (key, value) in &map {
            println!("{}: {}", key, value);
        }
        for i in 0..1000 {
            let message = Message::Text(format!("Message {}", i));
            if let Err(e) = ws_sender.send(message).await {
                eprintln!("Error sending message: {:?}", e);
                return;
            }
        }
    }
}

fn get_local_ip() -> Option<Ipv4Addr> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    match socket.local_addr().ok()?.ip() {
        IpAddr::V4(ipv4) => Some(ipv4),
        _ => None,
    }
}
