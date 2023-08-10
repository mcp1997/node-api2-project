// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.json(posts)
    })
    .catch(err => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack
      })
    })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  Post.findById(id)
    .then(post => {
      if(!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        })
      } else {
        res.json(post)
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack
      })
    })
})

router.post('/', (req, res) => {
  const { title, contents } = req.body
  if(!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    })
  } else {
    Post.insert({ title, contents })
    .then(({ id }) => {
      return Post.findById(id)
    })
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an error while saving the post to the database",
        err: err.message,
        stack: err.stack
      })
    })
  }
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { title, contents } = req.body
  if(!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    })
  } else {
    Post.update(id, { title, contents })
      .then(() => {
        return Post.findById(id)
      })
      .then(post => {
        if(!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist"
          })
        } else {
          res.json(post)
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "The post information could not be modified",
          err: err.message,
          stack: err.stack
        })
      })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const deletedPost = await Post.findById(id)
  if(!deletedPost) {
    res.status(404).json({
      message: "The post with the specified ID does not exist"
    })
  } else {
    Post.remove(id)
      .then(() => {
        res.json(deletedPost)
      })
      .catch(err => {
        res.status(500).json({
          message: "The post could not be removed",
          err: err.message,
          stack: err.stack
        })
      }) 
  }
})

router.get('/:id/comments', async (req, res) => {
  const id = req.params.id
  const post = await Post.findById(id)
  if(!post) {
    res.status(404).json({
      message: "The post with the specified ID does not exist"
    })
  } else {
    Post.findPostComments(id)
     .then(comments => {
      res.json(comments)
     })
     .catch(err => {
      res.status(500).json({
        message: "The comments information could not be retrieved",
        err: err.message,
        stack: err.stack
      })
    }) 
  }
})

module.exports = router
