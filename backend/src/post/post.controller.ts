import * as express from "express";
import { Post } from "./post.interface";
import { validationMidleware } from "../midleware/validation.midleware";
import { CreatePostDto } from "./create-post.dto";
import { PostNotFoundException } from "../exception/post-not-found.exception";
import { RequestWithUser } from "interface/request-with-user.interface";
import { dataSource } from "../orm-data-source";
import { PostEntity } from "./post.entity";

export class PostController {
  public path = "/posts";
  public router = express.Router();
  private postRepository = dataSource.getRepository(PostEntity);

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // GET ALL
    this.router.get(this.path, this.getAllPosts);
    // GET BY ID
    this.router.get(`${this.path}/:id`, this.getPostById);
    // POST
    this.router.post(
      this.path,
      validationMidleware(CreatePostDto),
      this.createPost,
    );
    // PATCH
    this.router.patch(
      `${this.path}/:id`,
      validationMidleware(CreatePostDto, true),
      this.modifyPost,
    );
    // DELETE
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    const posts = this.postRepository.find();

    return posts;
  };

  getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;

    const post = await this.postRepository.findOneBy({ id: Number(id) });

    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  createPost = async (req: RequestWithUser, res: express.Response) => {
    const postData: Post = req.body;
    const newPost = this.postRepository.create(postData);
    await this.postRepository.save(newPost);

    res.send(newPost);
  };

  modifyPost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const postData = req.body;

    await this.postRepository.update(id, postData);

    const updatedPost = this.postRepository.findOneBy({ id: +id });

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  deletePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;

    const deleteResponse = await this.postRepository.delete(id);

    if (deleteResponse.raw[1]) {
      res.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}
