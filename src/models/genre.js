import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const genreModel = mongoose.model("Genre", schema)

export default genreModel