import { Producer } from "kafkajs";
import { getKafka } from "./kafka.connection.js";

let producer: Producer | null = null;

export const getKafkaProducer = async () => {

    if (producer) {
        return producer;
    }

    const kafka = getKafka();

    producer = kafka.producer();

    await producer.connect();

    console.log("Kafka producer connected");

    return producer;
};


export const publishKafkaMessage = async ( topic: string, message: unknown, key?: string ) => {

    const kafkaProducer = await getKafkaProducer();

    const response = await kafkaProducer.send({
        topic,

        messages: [
            {
                key,
                value: JSON.stringify(message)
            }
        ]
    });
    console.log("Kafka accepted payload details:", response); 
};