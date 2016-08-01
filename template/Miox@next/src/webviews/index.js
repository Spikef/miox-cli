/**
 * Created by evio on 16/8/1.
 */
'use strict';

import './index.scss';

import { Webview } from 'miox-vue-engine';

export default class IndexPage extends Webview {
    constructor(el){
        super(el);
    }

    data(data){
        data.title = 'Demo Page';
        data.keyword = 'Hello World';
    }

    template(){
        return `
            <appview>
                <appview-head>
                    <navgation>
                        <navgation-item center>{{title}}</navgation-item>
                    </navgation>
                </appview-head>
                <appview-body>
                    <middle align="center">{{keyword}}</middle>
                </appview-body>
            </appview>
        `;
    }
}