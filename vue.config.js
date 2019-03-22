module.exports = {
  publicPath: "./",
  outputDir: "oplan_simluate",
  devServer: {
    proxy: {
      "/oraitStatic": {
        target: "https://orait.oss-cn-hangzhou.aliyuncs.com",
        ws: true,
        changeOrigin: true
      }
    }
  },
  pages: {
    login: {
      // page 的入口
      entry: "src/views/login/login.js",
      // 模板来源
      template: "src/views/login/login.html",
      // 在 dist/index.html 的输出
      filename: "login.html"
    },
    wpSimluate: {
      // page 的入口
      entry: "src/views/wpSimluate/wpSimluate.js",
      // 模板来源
      template: "src/views/wpSimluate/wpSimluate.html",
      // 在 dist/index.html 的输出
      filename: "wpSimluate.html"
    },
    mainPlan: {
      // page 的入口
      entry: "src/views/mainPlan/mainPlan.js",
      // 模板来源
      template: "src/views/mainPlan/mainPlan.html",
      // 在 dist/mainPlan.html 的输出
      filename: "mainPlan.html"
    },
    fileSystem: {
      // page 的入口
      entry: "src/views/fileSystem/fileSystem.js",
      // 模板来源
      template: "src/views/fileSystem/fileSystem.html",
      // 在 dist/fileSystem.html 的输出
      filename: "fileSystem.html"
    }
  }
};
