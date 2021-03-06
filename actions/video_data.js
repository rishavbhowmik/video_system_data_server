const {DB} = require('./connect_db')
const mongodb = require('mongodb')

class VideoData{
    /**
     * @returns {Promise<{
     *      _id: string,
     *      title: string,
     *      upload_time: number,
     *      duration: number,
     *      stream_manifest: {144:{duration: number}, 360:{duration: number}, 720:{duration: number}}
     * }>}
     * @param {string} user_id - user_id of the video owner
     * @param {number} limit - number of tupples to return
     */
    static async list_user_videos(user_id, limit = 5){
        const videos_collection = (await DB.mongodb_video_system()).collection('videos')
        const results = await videos_collection.find(
            {user_id},
            {limit}
        ).project({title:1, upload_time:1, "stream_manifest.144.duration":1, "stream_manifest.360.duration":1, "stream_manifest.720.duration":1}).toArray()
        return results.map(r=>{
            try{
                r.duration = r.stream_manifest["144"].duration||r.stream_manifest["360"].duration||r.stream_manifest["720"].duration
            }catch(e){
                r.duration = null
            }
            
            r._id = r._id.toString()
            return r
        })
    }
    /**
     * @param {string} video_id
     * @returns {Promise<{
            _id: mongodb.ObjectId,
            title: string,
            upload_time: number,
            upload_id: mongodb.ObjectId,
            user_id: string,
            stream_manifest: {
                '144': {
                    user_id: string,
                    video_id: string,
                    duration: number,
                    chunks: [{
                        "object_id": string,
                        "height": 144,
                        "width": number,
                        "start_time": number,
                        "end_time": number,
                        "byte_length": number
                    }]
                },
                '360': {
                    user_id: string,
                    video_id: string,
                    duration: number,
                    chunks: [{
                        "object_id": string,
                        "height": 144,
                        "width": number,
                        "start_time": number,
                        "end_time": number,
                        "byte_length": number
                    }]
                },
                '720': {
                    user_id: string,
                    video_id: string,
                    duration: number,
                    chunks: [{
                        "object_id": string,
                        "height": 144,
                        "width": number,
                        "start_time": number,
                        "end_time": number,
                        "byte_length": number
                    }]
                }
            }
        }>}
     */
    static async get_video_manifest(video_id){
        const videos_collection = (await DB.mongodb_video_system()).collection('videos')
        const results = await videos_collection.findOne(
            {_id:mongodb.ObjectId(video_id)}
        )
        return results
    }
}

module.exports = {VideoData}

//unit tests
/*
VideoData.list_user_videos('5fd6424181605b4294e1aa71')
.then(r=>console.table(r))
.catch(e=>console.log(e))
*/
/*
VideoData.get_video_manifest('600932b1e7984934f8bd01e6')
.then(r=>console.log(r))
.catch(e=>console.log(e))
*/
