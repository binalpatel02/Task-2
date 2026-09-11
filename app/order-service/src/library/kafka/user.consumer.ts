import { consumeKafkaMessage } from "@library/third-party/kafka";

import { USER_TOPICS, USER_CONSUMER_GROUP } from "./topic.js";

export const startUserConsumer = async () => {

    await consumeKafkaMessage(
        USER_CONSUMER_GROUP,
        [
            USER_TOPICS.CREATED,
            USER_TOPICS.UPDATED,
            USER_TOPICS.DELETED
        ],
        async (message, topic) => {

            console.log("User event received by Order Service");
            console.log("Topic:", topic);
            console.log("Message:", message);

            switch (topic) {

                case USER_TOPICS.CREATED:
                    
                    break;

                case USER_TOPICS.UPDATED:
                    
                    break;

                case USER_TOPICS.DELETED:
                    
                    break;

                default:
                    
            }
        }
    )
};
