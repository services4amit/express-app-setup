import { Router } from "express";

import { Todo } from "../models/todo";
import { TodoNum } from "../models/todonum";

type RequestBody = { text: string };
type RequestBodyNumber = { text: number };

let todos: Todo[] = [];
let todosNum: TodoNum[] = [];

const router = Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/todostring", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({ message: "Added Todo", todo: newTodo, todos: todos });
});

router.post("/todonumber", (req, res, next) => {
  const body = req.body as RequestBodyNumber;
  const newTodo: TodoNum = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todosNum.push(newTodo);

  res
    .status(201)
    .json({ message: "Added TodoNum", todo: newTodo, todosNum: todosNum });
});

export default router;
