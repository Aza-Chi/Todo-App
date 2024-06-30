const express = require('express');
const router = express.Router();
const controller = require('./controller.js');

// Get all todos
router.get('/', controller.getTodos); //

// Get todo by list ID
router.get('/list/:id', controller.getTodoByListId);//

// Get todo by todo ID
router.get('/:id', controller.getTodoByTodoId);//

// Add new todo
router.post('/', controller.addTodo);//

// Update todo by todo ID
router.put('/:id', controller.updateTodoByTodoId);//

// Remove todo by todo ID
router.delete('/:id', controller.removeTodoByTodoId);//

// Remove todos by list ID
router.delete('/list/:id', controller.removeTodoByListId);//

module.exports = router;
/*
Mostly for todos 
    checkOwner, - For update,
    checkWritePermission,
  };
*/