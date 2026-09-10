import { Consumer } from "kafkajs";
import { getKafka } from "./kafka.connection.js";

export const createKafkaConsumer = async ( groupId: string ) => {

    const kafka = getKafka();

    const consumer: Consumer = kafka.consumer({ groupId });

    await consumer.connect();

    console.log(`Kafka consumer connected: ${groupId}`);

    return consumer;
};


export const consumeKafkaMessage = async ( groupId: string, topic: string,
    handler: ( message: any ) => Promise<void>
) => {

    const consumer = await createKafkaConsumer(groupId);

    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({

        eachMessage: async ({ topic, partition, message }) => {

            try {

                const value = message.value?.toString();

                if (!value) {
                    return;
                }

                const data = JSON.parse(value);

                await handler(data);

            } catch (error) {

                console.error(`Kafka consumer error [${topic}]:`, error);

            }
        }

    });

    return consumer;
};