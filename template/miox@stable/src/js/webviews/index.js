import { webview } from 'miox';

export default class WEBVIEW extends webview {
    constructor(node){
        super(node);
    }

    render(){
        return `
            <appview>
                <appview-head>
                    <navgation>
                        <navgation-item left>Left</navgation-item>
                        <navgation-item center>Miox Demo</navgation-item>
                        <navgation-item right>Right</navgation-item>
                    </navgation>
                </appview-head>
                <appview-body>
                    <aspect align="center">
                        <middle >Hello Guy!<br />Welcome to use Miox building app.</middle>
                    </aspect>
                </appview-body>
            </appview>
        `
    }
}
