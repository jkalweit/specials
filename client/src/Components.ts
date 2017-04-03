import { SyncNode, SyncNodeSocket, SyncData } from "./SyncNode/SyncNode"
import { SyncView, SyncApp, SyncList, SyncUtils, SyncReloader } from "./SyncNode/SyncView"

export class Input extends SyncView<SyncData> {
	label = this.add('span', {"innerHTML":"","className":""});
	input = this.add('input', {"innerHTML":"","className":" input_input_style"});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({ twoway: true, labelWidth: '100px' }, options);
		this.el.className += ' ';
		this.el.className += ' Input_style';
		this.el.addEventListener('change', this.onChange.bind(this));
	}
	onChange() { 
        let val = this.input.value;
        if(this.options.twoway && this.options.key) {
            this.data.set(this.options.key, val);
        }
        this.emit('change', val); 
    }
	value() {
        return this.input.value;
    }
	init() {
        this.label.style.width = this.options.labelWidth;
    }
	render() {		
        if(this.options.label) {
            this.label.innerHTML = this.options.label;
        }
        this.label.style.display = this.options.label ? 'flex' : 'none';
        if(this.data) {
            this.input.value = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';
        }
    }
}

SyncView.addGlobalStyle('.input_input_style', `
            flex: 1;
            font-size: 1em;
            padding: 0.5em 0;
            background-color: transparent;
            border: none;
            border-bottom: 1px solid rgba(0,0,0,0.5);
    `);
export class Modal extends SyncView<SyncData> {

        view: SyncView<SyncData>;
    
 	viewContainer = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({ hideOnClick: true }, options);
		this.el.className += ' ';
		this.el.className += ' Modal_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.viewContainer.addEventListener('click', (e) => {  e.stopPropagation();  });
	}
	onClick() { if(this.options.hideOnClick) { this.hide(); } }
	init() {
        this.hide();
        if(this.options.view) {
            this.view = new this.options.view();
            var _me = this;
            let handler = function(eventName: string) {
                if(eventName === 'hide') { _me.hide(); }
                _me.emit.apply(_me, arguments);
            };
            this.view.onAny(handler.bind(this));
            this.viewContainer.appendChild(this.view.el);
        }
    }
	render() {
        if(this.view) this.view.update(this.data);
    }
}

export class SimpleHeader extends SyncView<SyncData> {
	title = this.add('span', {"innerHTML":"","className":"row-fill span_title_style row-fill"});
	addBtn = this.add('button', {"innerHTML":"Add","className":"row-nofill row-nofill"});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row';
		this.addBtn.addEventListener('click', () => {  this.emit('add')  });
	}
	showButtons(val: boolean) {
        this.addBtn.style.display = val ? 'flex' : 'none';
    }
	init() {
        this.title.innerHTML = this.options.title;
    }
}

SyncView.addGlobalStyle('.span_title_style', ` 
            font-weight: bold; 
            font-size: 1.5em;
        `);
SyncView.addGlobalStyle('.Input_style', ` 
        width: 100%;
        display: flex; 
    `);
SyncView.addGlobalStyle('.Modal_style', ` 
        position: fixed;
        left: 0; right: 0; top: 0; bottom: 0;
        background-color: rgba(0,0,0,0.7);
        overflow-y: scroll;
        display: flex;
        align-items: center;
        justify-content: center;	
    `);
