import { Consumer } from "kafkajs";
import { getKafka } from "./kafka.connection.js";

export const createKafkaConsumer = async ( groupId: string ) => {

    const kafka = getKafka();

    const consumer: Consumer = kafka.consumer({ groupId, allowAutoTopicCreation: true });

    await consumer.connect();

    console.log(`Kafka consumer connected: ${groupId}`);

    return consumer;
};


export const consumeKafkaMessage = async ( groupId: string, topic: string | string[],
    handler: ( message: any, topic: string ) => Promise<void> 
) => {

    const consumer = await createKafkaConsumer(groupId);

     if (Array.isArray(topic)) {
        await consumer.subscribe({ topics: topic, fromBeginning: false });
    } else {
        await consumer.subscribe({ topic, fromBeginning: false });
    }

    await consumer.run({
        eachMessage: async ({ topic: currentTopic, partition, message }) => {

        console.log("KAFKA MESSAGE RECEIVED");
        console.log("TOPIC:", currentTopic);

        const value = message.value?.toString();

        console.log("RAW MESSAGE:", value);

        if (!value) return;

        const data = JSON.parse(value);

        console.log("PARSED MESSAGE:", data);

        await handler(data, currentTopic);
    }
});

    return consumer;
};