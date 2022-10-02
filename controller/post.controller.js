const mongoose = require("mongoose")
const PostSchema = require("../model/post.model")


const GetPosts = async(req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 6
        const STARTINDEX = (Number(page) - 1) * LIMIT
        const TOTAL = await PostSchema.countDocuments()

        const posts = await PostSchema.find().sort({ _id: -1 }).limit(LIMIT).skip(STARTINDEX)
        return res.status(200).json({ posts, currentPage: Number(page), numberOfPage: Math.ceil(TOTAL / LIMIT) })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const GetSingle = async(req, res) => {
    const id = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No Post Found!!' })
        }

        const post = await PostSchema.findOne({ _id: new mongoose.Types.ObjectId(id) })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const CreatePost = async(req, res) => {
    const { title, name, imageFile, tags, message } = req.body
    try {

        if (!title || !name || !imageFile || !tags || !message) {
            return res.status(400).json({ error: 'Field Cannot Be Empty!!' })
        }

        if (!tags.length || tags[0] == '') {
            return res.status(400).json({ error: 'Tags Cannot Be Empty!!' })
        }

        const text = tags.join()
        const pureText = text.replace(/,/g, '')

        if (pureText.length > 61) {
            return res.status(400).json({ error: 'Tags Must Be Less Than 60 Word!!' })
        }

        if (title.length > 21) {
            return res.status(400).json({ error: 'Title Must Be Less Than 20 Word!!' })
        }

        const newPost = new PostSchema({ title, name, tags, message, imageFile, creator: req.userId })
        await newPost.save()
        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const DeletePost = async(req, res) => {
    const PostId = req.params.id
    const userId = req.userId
    const postCreator = req.headers.creator

    try {
        if (!PostId || !userId || !postCreator) {
            return res.status(400).json({ error: 'Post Not Found!!' })
        }
        if (postCreator !== userId) {
            return res.status(400).json({ error: 'You Are Not The Creator!!' })
        }


        return await PostSchema.deleteOne({ _id: PostId })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const UpdatePost = async(req, res) => {
    const id = req.params.id
    const userId = req.userId
    const postCreator = req.headers.creator
    const { title, name, imageFile, tags, message } = req.body

    if (!title || !name || !imageFile || !tags || !message) {
        return res.status(400).json({ error: 'Field Cannot Be Empty!!' })
    }

    if (tags.length < 0 || tags[0] == '') {
        return res.status(400).json({ error: 'Tags Cannot Be Empty!!' })
    }

    const text = tags.join()
    const pureText = text.replace(/,/g, '')

    if (pureText.length > 61) {
        return res.status(400).json({ error: 'Tags Must Be Less Than 60 Word!!' })
    }

    if (title.length > 21) {
        return res.status(400).json({ error: 'Title Must Be Less Than 20 Word!!' })
    }

    if (!id || !userId || !postCreator) {
        return res.status(400).json({ error: 'Post Not Found!!' })
    }
    if (postCreator !== userId) {
        return res.status(400).json({ error: 'You Are Not The Creator!!' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No Post Found!!' })
    }


    try {
        const updatedPost = await PostSchema.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, req.body, { new: true })
        return res.status(200).json(updatedPost)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


const LikePost = async(req, res) => {
    const id = req.params.id
    try {
        if (!id) {
            return res.status(400).json({ error: 'No Post Found!' })
        }
        if (!req.userId) {
            return res.status(400).json({ error: 'You Have To Login!!' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No Post Found!' })
        }

        const post = await PostSchema.findById(id)
        const index = post.likes.findIndex((id) => id === String(req.userId))

        if (index === -1) {
            post.likes.push(req.userId)
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId))
        }

        const updatePost = await PostSchema.findByIdAndUpdate(id, post, { new: true })

        return res.status(200).json(updatePost)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


const GetSearch = async(req, res) => {
    const { searchText, tags } = req.query
    try {
        const title = new RegExp(searchText, 'i') //case insensitive
        const posts = await PostSchema.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] }) //find match title/tags

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


const comments = async(req, res) => {
    const userId = req.userId
    const id = req.params.id
    const data = req.body

    if (!data) {
        return res.status(400).json({ error: 'Field Cannot be Empty!!' })
    }
    if (!id) {
        return res.status(400).json({ error: 'No Post Found!' })
    }
    if (!userId) {
        return res.status(400).json({ error: 'You Have To Login!!' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No Post Found!' })
    }

    try {
        const post = await PostSchema.findById(id)

        if (!post) {
            return res.status(400).json({ error: 'No Post Found!' })
        }

        post.comments.push(data)
        const updatePost = await PostSchema.findByIdAndUpdate(id, post, { new: true })

        return res.status(201).json(updatePost)
    } catch (er) {
        return res.status(400).json({ error: er.message })
    }
}


module.exports = {
    GetPosts,
    CreatePost,
    DeletePost,
    UpdatePost,
    GetSingle,
    LikePost,
    GetSearch,
    comments
}