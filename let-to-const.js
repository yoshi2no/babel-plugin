// AST内のすべての変数宣言(VariableDeclaration)を訪れ、そのkindがletであるものをconstに変更します。
// module.exports = function (babel) {
//   // var t = babel.types;
//   return {
//     visitor: {
//       VariableDeclaration(path) {
//         if (path.node.kind === "let") {
//           path.node.kind = "const";
//         }
//       },
//     },
//   };
// };


// このプラグインはlet宣言を探し、その宣言に関連するすべてのバインディング（つまり、その変数名を持つ変数）を取得します。それぞれのバインディングについて、constantViolationsプロパティが空でなければ、そのバインディングは再代入が行われていることを意味します。
// したがって、再代入が行われているlet宣言はconstに変更されません。
// 各バインディングについてconstantViolationsプロパティが空（再代入が行われていない）であるかをチェックします。
// すべてのバインディングが再代入されていない場合にのみ、shouldChangeToConstをtrueに設定します。逆に、再代入が検出された場合にはすぐにループを終了し、let宣言はそのままとなります。
module.exports = function(babel) {
  // ASTノードを生成するためのユーティリティ関数を提供する
  var t = babel.types;

  return {
    visitor: {
      VariableDeclaration(path) {
        if (path.node.kind !== 'let') return;
        const bindings = path.getBindingIdentifiers();
        let shouldChangeToConst = true;
        for (let name in bindings) {
          const binding = path.scope.getBinding(name);
          shouldChangeToConst = binding && binding.constantViolations.length === 0;
          if (!shouldChangeToConst) break;
        }
        if (shouldChangeToConst) {
          path.node.kind = 'const';
        }
      }
    }
  };
};