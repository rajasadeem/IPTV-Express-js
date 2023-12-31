import mongoose, { mongo } from 'mongoose';
// import genreSeriesModel from '../models/genre.series.js';
// import seasonModel from '../models/season.js';
// import seriesModel from '../models/series.js';
import genreModel from './../models/genre.js';

export const genreServices = {

    add: async (data) => {
        try{
            const genreExist = await genreModel.find({ name: data.name})
            if( genreExist.length > 0){
                throw new Error("Genre already exist with this name")
            } 
            else {
                return await genreModel.create(data)
            }
        }
        catch(error){
            throw error
        }
    },

    get: async (pageNumber, limit) => {
        const skip = limit * pageNumber - limit
        return genreModel.find().limit(limit).skip(skip)
    },

    getById: async (id) => {
        return genreModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            }
        ])
    },

    updateOne: async (id, data) => {
        try{
            const genre = await genreModel.find({ name: data.name})
            if(genre.length > 0){
                throw new Error("Genre name already exists")
            }
            else{
                return genreModel.findByIdAndUpdate(id, data, { new: true })
            }
        }
        catch (error) {
            throw error
        }
    },

    deleteOne: async (id) => {
        return genreModel.deleteOne({ _id: id })
    },

    getSeriesBygenreId: async (genre_id) => {
        // return genreModel.aggregate([
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(genre_id)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "genreseries",
        //             localField: "_id",
        //             foreignField: "genre_id",
        //             as: "Genre_Series"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "series",
        //             localField: "Genre_Series.series_id",
        //             foreignField: "_id",
        //             as: "Series"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "files",
        //             localField: "Series.thumbnail_id",
        //             foreignField: "_id",
        //             as: "Thumbnail"
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             name: 1,
        //             description: 1,
        //             trailer_id: 1,
        //             thumbnail_id: "$Thumbnail",
        //             createdAt: 1,
        //             updatedAt: 1,
        //             __v: 1
        //         }
        //     }
        // ])
        return genreModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(genre_id)
                }
            },
            {
                $lookup: {
                    from: "genreseries",
                    localField: "_id",
                    foreignField: "genre_id",
                    as: "Genre_Series"
                }
            },
            {
                $lookup: {
                    from: "series",
                    localField: "Genre_Series.series_id",
                    foreignField: "_id",
                    as: "Series"
                }
            },
            {
                $lookup: {
                    from: "files",
                    localField: "Series.thumbnail_id",
                    foreignField: "_id",
                    as: "Thumbnail"
                }
            },
            {
                $addFields: {
                    "Series": {
                        $map: {
                            input: "$Series",
                            as: "series",
                            in: {
                                $mergeObjects: [
                                    "$$series",
                                    {
                                        thumbnail_id: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$Thumbnail",
                                                        as: "thumbnail",
                                                        cond: {
                                                            $eq: ["$$thumbnail._id", "$$series.thumbnail_id"]
                                                        }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    trailer_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1,
                    Genre_Series: 1,
                    Series: 1
                }
            }
        ]);
        
    },

    getAllSeasonOfAllSeriesByGenreId: async (genre_id) => {
        return genreModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(genre_id)
                }
            },
            {
                $lookup: {
                    from: "genreseries",
                    localField: "_id",
                    foreignField: "genre_id",
                    as: "Genre_Series"
                }
            },
            {
                $lookup: {
                    from: "series",
                    localField: "Genre_Series.series_id",
                    foreignField: "_id",
                    as: "Series"
                }
            },
            {
                $lookup: {
                    from: "seasons",
                    localField: "Series._id",
                    foreignField: "series_id",
                    as: "Seasons"
                }
            }
        ])
        //     const genreSeries = await genreSeriesModel.find({ genre_id })
        //     if(genreSeries){
        //         const seriesIDs = genreSeries.map(e => e.series_id)
        //         const ids = seriesIDs.map((id) => new mongoose.Types.ObjectId(id))
        //         const series = await seriesModel.find({ _id: { $in: ids}})
        //         if(series){
        //             const seriesIDS = series.map(e => e._id)
        //             const IDS = seriesIDS.map((id) => new mongoose.Types.ObjectId(id))
        //             const season = await seasonModel.find({ series_id: { $in: IDS }})
        //             return season
        //         }
        //     }
        //     else return null
    }
}
