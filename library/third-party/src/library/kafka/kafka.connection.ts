import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "task-2",
    brokers: (
        process.env.KAFKA_BROKERS || "127.0.0.1:9092"
    ).split(",")
});

export const getKafka = () => {
    return kafka;
};