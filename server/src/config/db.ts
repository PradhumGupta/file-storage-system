import { error } from "console";
import mongoose from "mongoose";

const connectDb = async () => {
    return mongoose.connect(process.env.DB_URI as string)
        .then(db => console.log("Database connected", db.connection))
        .catch(error => {
            console.error(error);
            return error;
        })
};

export default connectDb;