import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "@library/schema";
import { startUserConsumer, startProductConsumer} from "../src/library/index.js"

const PORT = Number(process.env.PORT) || 3002;

const MONGO_URI = process.env.MONGO_URI;

const startServer = async (): Promise<void> => {

    try {        

        if (!MONGO_URI) {
            throw new Error( "MONGO_URI is not defined" );
        }

        await connectDatabase( MONGO_URI );

        app.listen( PORT, () => { 
            console.log(`Order Service running on port ${PORT}`);
        });

        startUserConsumer()
            .then(() => {
                console.log("User Kafka consumer started");
            })
            .catch((error) => {
                console.error("Failed to start User Kafka consumer:", error);
            });

        startProductConsumer()
            .then(() => {
                console.log("Product Kafka consumer started");
            })
            .catch((error) => {
                console.error("Failed to start Product Kafka consumer:", error);
            });
        }
    
    catch (error) {

        console.error("Order Service startup failed:", error);

        process.exit(1);
    }
};


startServer();