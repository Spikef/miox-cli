/**
 * Created by evio on 16/7/25.
 */
'use strict';

import MioxRouter from 'miox-router';
import INDEX from './webviews/index';
const Router = new MioxRouter();
Router.patch('/', async ctx => await ctx.render(INDEX));
export default Router;
