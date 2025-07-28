const User = require("../controllers/users.controllers");

module.exports=function(app){
    app.get("/users",User.getAllUsers);
    app.post("/users",User.createUser);
    app.get("/users/:id",User.getUserXId);
    app.patch("/users/:id",User.updUserEstado);
    app.patch("/users/:id",User.updUserPerfil);
    app.delete("/users/:id",User.delUserXId);
}