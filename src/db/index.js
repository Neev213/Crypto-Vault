import mongoose from 'mongoose'; // import mongoose to connect to mongodb

// function to connect to mongodb database
const connectDB = async () => {

    try {

        // attempt to connect to mongodb using the uri from .env file
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI || process.env.MONGO_URI
        );
        // mongoose.connect returns a connection instance
        // process.env.MONGO_URI is the mongodb connection string from .env file
        // example MONGO_URI: mongodb+srv://username:password@cluster.mongodb.net/cryptoDB

        console.log(`\n MongoDB connected successfully`);
        console.log(`MongoDB host: ${connectionInstance.connection.host}`);
        // connectionInstance.connection.host tells you which mongodb server you connected to
        // useful for knowing if you're connected to local or cloud database

    } catch (error) {

        console.error(`MongoDB connection failed: ${error.message}`);
        // log the error message so you know what went wrong

        process.exit(1);
        // exit the node process with code 1 — means failure
        // code 0 means success, code 1 means something went wrong
        // if database connection fails there is no point running the server
    }
};

export default connectDB; // export as default export