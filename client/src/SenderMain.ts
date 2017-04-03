import { SyncNode, SyncNodeSocket, SyncData } from "./SyncNode/SyncNode"
import { SyncView, SyncApp, SyncList, SyncUtils, SyncReloader } from "./SyncNode/SyncView"


import { Input, Modal, SimpleHeader } from './Components'
import { CastSender } from './CastSender'

export class SenderView extends SyncView<SyncData> {
	header = this.addView(new SimpleHeader({ title: 'Ready to Cast SVML' }), ' SimpleHeader_header_style');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' ';
		this.el.className += ' SenderView_style';
	}
	render() {}
}

SyncView.addGlobalStyle('.SimpleHeader_header_style', ` padding-bottom: 1em; color: #AAA; `);

    new SyncReloader().start();
    let sender = new CastSender();
    sender.start();
    let app = new SyncApp<SyncData>(new SenderView());
    app.start();

SyncView.addGlobalStyle('.SenderView_style', ` padding: 0 1em; `);
