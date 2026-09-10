import amqp, { Channel, Connection } from "amqplib";

let channel: Channel | null = null;

export const getRabbitMQChannel = async () => {

    if (channel) {
        return channel;
    }

    const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672";

    const connection = await amqp.connect( rabbitmqUrl );

    channel = await connection.createChannel();

    console.log("RabbitMQ connected");

    return channel;
};