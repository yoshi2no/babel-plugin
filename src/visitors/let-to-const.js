// AST内のすべての変数宣言(VariableDeclaration)を訪れ、そのkindがletであるものをconstに変更します。
module.exports = function (babel) {
  // var t = babel.types;
  return {
    visitor: {
      VariableDeclaration(path) {
        if (path.node.kind === "let") {
          path.node.kind = "const";
        }
      },
    },
  };
};
