module.exports = {
    assetsDir: 'static',
    // outputDir: ../src/main/resources/static,
    // indexPath: '../src/main/resources/static/index.html',
    outputDir: process.env.VUE_APP_OUTPUT_DIR,
    indexPath: process.env.VUE_APP_INDEX_PATH,
    devServer: {
        proxy: {
            '^/v1': {
                target:'http://localhost:9200',
                // target: 'http://192.168.5.192:9200',
                // target: 'http://192.168.134.109:9200',
                // target:'http://192.168.5.192:8989/backoffice',
                // target:'http://10.110.203.194:8989/backoffice',
                changeOrigin: true,
                // logLevel: "debug"
                // pathRewrite: {'/backoffice' : ''}
            },
            '^/routes': {
                target:'http://localhost:9201',
                // target: 'http://192.168.5.192:9201',
                // target: 'http://192.168.134.109:9201',
                // target:'http://192.168.5.192:8989/routes',
                // target:'http://10.110.203.194:8989/routes',
                // target:'http://10.110.203.194:9201',
                changeOrigin: true,
                // logLevel: "debug",
                pathRewrite: {'^/routes' : ''}
            },
        }
    },
    chainWebpack: config => {
        config.module.rule('fonts').use('url-loader').tap(options => {
          options.limit = 1
          return options
        })
      }
}