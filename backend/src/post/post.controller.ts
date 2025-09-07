import * as express from "express";
import { Post } from "./post.interface";
import { postModel } from "./post.model";
import { validationMidleware } from "../midleware/validation.midleware";
import { CreatePostDto } from "./create-post.dto";
import { PostNotFoundException } from "../exception/post-not-found.exception";
import { authMidleware } from "../midleware/auth.midleware";
import { RequestWithUser } from "interface/request-with-user.interface";

export class PostController {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // GET ALL
    this.router.get(this.path, this.getAllPosts);
    // GET BY ID
    this.router.get(`${this.path}/:id`, this.getPostById);
    // POST, PATCH, DELETE WITH AUTH
    this.router
      .all(`${this.path}{*splat}`, authMidleware)
      .post(this.path, validationMidleware(CreatePostDto), this.createPost)
      .patch(
        `${this.path}/:id`,
        validationMidleware(CreatePostDto, true),
        this.modifyPost,
      )
      .delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    this.post.find().then((posts) => res.send(posts));
  };

  getPostById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;

    this.post.findById(id).then((post) => {
      if (post) {
        res.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  createPost = async (req: RequestWithUser, res: express.Response) => {
    const postData: Post = req.body;
    const createdPost = new this.post({ ...postData, author: req.user._id });

    const savedPost = await createdPost.save();
    await savedPost.populate("author", "-password");

    res.send(savedPost);
  };

  modifyPost = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const postData = req.body;

    this.post.findByIdAndUpdate(id, postData, { new: true }).then((newPost) => {
      if (newPost) {
        res.send(newPost);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  deletePost = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;

    this.post.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        res.send(200);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };
}
