const Post = require("../models/post");
const getAllPosts = (req,res)=>{
    Post.find({PostedBy:{$in : req.profile.following}})
    .populate("comments","text created")
    .populate("comments.commentedBy","_id name")
    .populate("postedBy","_id name")
    .sort("-createdAt")
    .exec((err,posts)=>{
        if(err) res.json({error:err});
        res.json(posts);
    });
};

const getUserPosts = (req,res)=>{
    Post.find({PostedBy:req.profile._id})
    .populate("comments","text created")
    .populate("comments.commentedBy","_id name")
    .populate("postedBy","_id name")
    .sort("-createdAt")
    .exec((err,posts)=>{
        if(err) res.json({error:err});
        res.json(posts);
    });
};

const getPostById = (req,res,next,id)=>{
    Post.findById(id)
    .populate("comments","text created")
    .populate("comments.commentedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,post)=>{
        if(err) res.json({error:err});
        req.post = post;
        next();
    });
};

const isOwner = (req,res,next)=>{
    let isMatch = req.post && req.auth && req.post.PostedBy._id == req.auth
    if(!isMatch){
        return res.json({error:"Not Authorized"});
    }
    next();
} 

const addPost = (req,res)=>{
    const {text} = req.body;
    let post = new Post({text,PostedBy:req.profile._id});
    post.save((err,data)=>{
        if(err) res.json({error:err});
        res.json(data);
    });
};

const deletPost = (req,res)=>{
    let postToDelet = req.post;
    postToDelet.remove((err,deletPost)=>{
        if(err) res.json({error:err});
        res.json({meesage:"Post removed"});
    });
};

const likePost = (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.body.userId}},{new:true})
    .exec((err,result)=>{
        if(err) res.json({error : err});
        res.json(result);
    });
};

const unLikePost = (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,
        {$pull:{likes:req.body.userId}},
        {new:true})
    .exec((err,result)=>{
        if(err) res.json({error : err});
        res.json(result);
    });
};

const addComment = (req,res)=>{
    let comment = {text: req.body.text};
    comment.commentedBy = req.body.userId; 
    Post.findByIdAndUpdate(req.body.postId,
        {$push:{comments:comment}},
        {new:true})
    .exec((err,result)=>{
        if(err) res.json({error : err});
        res.json(result);
    });
};

const deleteComment = (req,res)=>{
    let commentId = req.body.commentId;
    Post.findByIdAndUpdate(req.body.postId,
        {$pull:{comments:{_id : commentId}}},
        {new:true})
    .exec((err,result)=>{
        if(err) res.json({error : err});
        res.json(result);
    });
};

module.exports = {
    getAllPosts,
    addPost,
    getUserPosts,
    getPostById,
    isOwner,
    deletPost,
    likePost,
    unLikePost,
    addComment,
    deleteComment
}