const User = require("../controllers/users.controllers");
const { protect, validateOwnResource, adminOnly } = require('../middlewares/authorization.middleware');
module.exports=function(app){
    //app.get("/users",User.getAllUsers);
    app.get("/users",protect, adminOnly, User.getAllUsers);
    app.post("/users/login",User.loginUser);
    app.post("/users",User.createUser);
    //app.get("/users/:id",User.getUserXId);

    // ✅ CAMBIO: Proteger para que solo admin o el propio usuario puedan ver la info
    app.get("/users/:id", protect, validateOwnResource, User.getUserXId);

    //app.patch("/users/:id",User.updUserEstado);
    // para actualizar el estado del usuario, solo el admin puede hacerlo
    app.patch("/users/:id/estado",protect, adminOnly,User.updUserEstado);
    app.patch("/users/:id/infoPerfil",protect, validateOwnResource, User.updUserPerfil);
//  Permitir que admin o el propio usuario puedan eliminar la cuenta
    app.delete("/users/:id", protect, validateOwnResource, User.delUserXId);}