const express = require('express');
const appRouter = express.Router();

appRouter.get('/',(req,res)=>{
	console.log("hello");
});

module.exports = appRouter;