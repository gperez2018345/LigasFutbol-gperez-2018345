exports.verAdmin = function (req, res, next) {
    if (req.user.rol !== "ROL_ADMIN")
      return res
        .status(403)
        .send({ mesnaje: "Sin permisos" });
    next();
  };
  
  exports.verUsuario = function (req, res, next) {
    if (req.user.rol !== "ROL_USUARIO")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
  };
  