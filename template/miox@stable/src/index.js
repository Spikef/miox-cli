import './resource'; // 加载资源文件

// load miox and miox-components
import * as miox from 'miox';
import mioxs from 'miox-components';

// import webviews.
import IndexWebviewPage from './js/webviews/index';

// install native components on miox.
mioxs(miox);

// when dom ready
// start to build app
miox.ready(function(){
    const app = miox.bootstrap({
        backgroundColor: '#eee',
        debug: true,
        animate:'drown'     //  slide|fade|scale|drown
    })

    app.define('/', IndexWebviewPage);

    app.listen();
});
