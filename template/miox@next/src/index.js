/**
 * Created by evio on 16/7/25.
 */
'use strict';

import 'normalize.css';
import './index.scss';
import { Bootstrap } from 'miox';
import MioxAnimate from 'miox-animate';
import MioxVueComponents from 'miox-vue-components';
import { Engine, plugin } from 'miox-vue-engine';
import Router from './router';

/**
 * 程序启动闭包
 */
(async () => {
    const app = await Bootstrap();
    app.engine(Engine);
    plugin(MioxVueComponents);
    app.animate(MioxAnimate({ effect: 'slide' }));
    app.use(Router.routes());
    await app.listen();
})().catch(console.error);