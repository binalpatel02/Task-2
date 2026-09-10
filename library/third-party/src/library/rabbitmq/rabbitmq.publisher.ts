import { getRabbitMQChannel } from "./rabbitmq.connection.js";

export const publishMessage = async ( exchange: string, routingKey: string, message: unknown ) => {

    const channel = await getRabbitMQChannel();

    await channel.assertExchange( exchange, "topic",
        {
            durable: true
        }
    );

    const messageBuffer =Buffer.from(JSON.stringify(message));

    channel.publish( exchange, routingKey, messageBuffer,
        {
            persistent: true
        }
    );
};