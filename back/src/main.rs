use futures::stream::StreamExt;
use futures::SinkExt;
use rand::{rngs::StdRng, Rng, SeedableRng};
use serde::Serialize;
use std::collections::HashMap;
use std::f32::consts::E;
use std::net::{IpAddr, Ipv4Addr, UdpSocket};
use tokio::net::{TcpListener, TcpStream};
use tokio::time::Duration;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;

#[derive(Serialize)]
struct Individual {
    id: u32,
    position: [i32; 2],
    movement_speed: u32,
    grid_size: i32,
    is_infected: bool,
    infected_time: f32,
    alive: bool,
}

impl Individual {
    fn new(
        id: u32,
        position: [i32; 2],
        movement_speed: u32,
        grid_size: i32,
        is_infected: bool,
    ) -> Self {
        Individual {
            id,
            position,
            movement_speed,
            grid_size,
            is_infected,
            infected_time: 0.0,
            alive: true,
        }
    }

    fn move_ind(&mut self) {
        let mut rng = rand::thread_rng();
        let movement_speed = self.movement_speed as i32;
        let movement = [
            rng.gen_range(-movement_speed..=movement_speed),
            rng.gen_range(-movement_speed..=movement_speed),
        ];
        self.position[0] = (self.position[0] + movement[0]).rem_euclid(self.grid_size);
        self.position[1] = (self.position[1] + movement[1]).rem_euclid(self.grid_size);
    }

    fn dead_treated(&mut self, probability: f32) {
        let mut rng = rand::thread_rng();
        if rng.gen_range(0.0..1.0) < E.powf(-probability * self.infected_time as f32) {
            if self.infected_time > 4.0 {
                self.is_infected = false;
                self.infected_time = 0.0;
            } else {
                self.infected_time += 0.0017;
            }
        } else {
            self.alive = false;
            self.is_infected = false;
        }
    }
}

fn distance(ind1: [i32; 2], ind2: [i32; 2]) -> f32 {
    let dx = (ind1[0] - ind2[0]) as f32;
    let dy = (ind1[1] - ind2[1]) as f32;
    (dx.powf(2.0) + dy.powf(2.0)).sqrt()
}

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
        let _map: HashMap<String, String> = match serde_json::from_str(&msg.to_string()) {
            Ok(map) => map,
            Err(e) => {
                eprintln!("Error parsing message: {:?}", e);
                return;
            }
        };

        let grid_size = 500;
        let movement_speed = 5;
        let num_individuals = 100;
        let initial_infected_index = 0;
        let num_iterations = 100000;
        let infection_radius = 20;
        let infection_probability = 0.2;
        let probability_of_dying = 0.000005;

        let mut population: Vec<Individual> = Vec::new();
        let mut rng = StdRng::from_entropy();
        println!("Starting Algorithm");
        for i in 0..num_individuals {
            let individual = Individual::new(
                i,
                [rng.gen_range(0..grid_size), rng.gen_range(0..grid_size)],
                movement_speed,
                grid_size,
                false,
            );
            population.push(individual);
        }
        println!("{:?}", population[initial_infected_index].position);
        population[initial_infected_index].is_infected = true;
        for _ in 0..num_iterations * 60 {
            let json_message = serde_json::to_string(&population).unwrap();
            let ws_message = Message::Text(json_message);
            if let Err(e) = ws_sender.send(ws_message).await {
                eprintln!("Error sending message: {:?}", e);
                return;
            }
            tokio::time::sleep(Duration::from_millis(17)).await;
            for i in 0..population.len() {
                if population[i].alive {
                    population[i].move_ind();
                }
                if population[i].is_infected {
                    for j in 0..population.len() {
                        if i != j && population[j].is_infected {
                            population[j].dead_treated(probability_of_dying);
                            continue;
                        }
                        if !population[j].alive {
                            continue;
                        }
                        let dist = distance(population[i].position, population[j].position);
                        if dist <= infection_radius as f32
                            && rng.gen_range(0.0..1.0) <= infection_probability
                        {
                            population[j].is_infected = true;
                        }
                    }
                }
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
