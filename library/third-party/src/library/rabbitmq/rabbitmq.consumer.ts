import { getRabbitMQChannel } from "./rabbitmq.connection.js";

export const consumeMessage = async (queueName: string,exchange: string,routingKey: string,
    handler: (message: any) => Promise<void>
) => {

    const channel = await getRabbitMQChannel();


    await channel.assertExchange( exchange, "topic",
        {
            durable: true
        }
    );


    await channel.assertQueue( queueName,
        {
            durable: true
        }
    );


    await channel.bindQueue( queueName, exchange, routingKey );


    channel.prefetch(1);


    await channel.consume(
        queueName,
        async (message) => {

            if (!message) {
                return;
            }

            try {

                const data =JSON.parse(message.content.toString());

                await handler(data);

                channel.ack(message);

            } catch (error) {

                console.error( "RabbitMQ consumer error:", error);

                channel.nack( message, false, false );
            }
        }
    );
}