const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getTodoLists); //
router.get("/list/:id", controller.getTodoListByListId); //
router.get("/user/:id", controller.getTodoListByUserId); //
router.post("/", controller.addTodoList); //
router.put("/list/:id", controller.updateTodoListName); //
router.delete("/list/:id", controller.removeTodoListByListId);

module.exports = router;

/*
Mostly for todos 
    checkOwner, - For update,
    checkWritePermission,
  };
*/