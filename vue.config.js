module.exports = {
    assetsDir: 'static',
    // outputDir: ../src/main/resources/static,
    // indexPath: '../src/main/resources/static/index.html',
    outputDir: process.env.VUE_APP_OUTPUT_DIR,
    indexPath: process.env.VUE_APP_INDEX_PATH,
    devServer: {
        proxy: {
            '/v1/*': {
                // target:'http://localhost:9200',
                // target: 'http://192.168.5.192:9200',
                target:'http://10.110.203.194:8989/backoffice',
                changeOrigin: true,
                // pathRewrite: {'/backoffice' : ''}
            },
            // '/v1/*': {
            //     // target:'http://localhost:9200',
            //     // target: 'http://192.168.5.192:9200',
            //     target:'http://10.110.203.194:8989/routes',
            //     changeOrigin: true,
            //     pathRewrite: {'/route' : ''}
            // },
        }
    }
}