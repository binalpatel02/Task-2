import { consumeKafkaMessage } from "@library/third-party/kafka";

import { PRODUCT_TOPICS, PRODUCT_CONSUMER_GROUP } from "./topic.js";

export const startProductConsumer = async () => {

    await consumeKafkaMessage(
        PRODUCT_CONSUMER_GROUP,
        [
            PRODUCT_TOPICS.CREATED,
            PRODUCT_TOPICS.UPDATED,
            PRODUCT_TOPICS.DELETED
        ],
        async (message, topic) => {

            console.log("Product event received by Order Service");
            console.log("Topic:", topic);
            console.log("Message:", message);

            switch (topic) {

                case PRODUCT_TOPICS.CREATED:
                    console.log("Order Service: Product created");
                    break;

                case PRODUCT_TOPICS.UPDATED:
                    console.log("Order Service: Product updated");
                    break;

                case PRODUCT_TOPICS.DELETED:
                    console.log("Order Service: Product deleted");
                    break;

                default:
                    console.log("Unknown product topic");
            }
        }
    );
};