import { SyncNode, SyncNodeSocket, SyncData } from "\\SyncNode\\SyncNode"
import { SyncView, SyncApp, SyncList, SyncUtils, SyncReloader } from ".\\SyncNode\\SyncView"


    import { parse, ProgNode, ChapterNode, PromptNode, PromptOptionNode, NextNode } from './parser';
    import * as smoothscroll from './lib/smoothscroll'

    smoothscroll.polyfill();


    declare var CodeMirror: any;

    export interface MainData extends SyncData {
        pages: {[key: string]: PageData};
    }

    export interface PageData extends SyncData {
        title: string;
    }

export class MainView extends SyncView<MainData> {
 
        selectedPage: PageData;
        isInited: boolean = false;
    
 	pageList = this.addView(new PageList(), '');
	editor = this.addView(new PageEditor(), '');
	constructor(options: any = {}) {
		super(options);
		this.el.className += ' row';
		this.el.className += ' MainView_style';
		this.pageList.on('selected', (page: PageData) => { 
            this.selectedPage = page;
            this.editor.update(page);
         });
		this.addBinding('pageList', 'update', 'data.pages');
	}
	render() { 
        if(!this.data.pages) this.data.set('pages', {});
        if(this.selectedPage) this.selectedPage = this.data.pages[this.selectedPage.key];
        if(!this.isInited) {
            this.isInited = true;
            let pages = SyncUtils.toArray(this.data.pages);
            if(pages.length > 0) this.selectedPage = pages[0];
        }
        this.editor.update(this.selectedPage);
    }
}

export class PageList extends SyncView<SyncData> {

        isClosed: boolean = false;
    
 	hideDrawer = this.add('button', {"innerHTML":"<","className":" button_hideDrawer_style"});
	title = this.add('h1', {"innerHTML":"Pages","className":""});
	addBtn = this.add('button', {"innerHTML":"Add Page","className":" button_addBtn_style"});
	itemList = this.addView(new SyncList({ item: PageItem }), ' SyncList_itemList_style');
	constructor(options: any = {}) {
		super(options);
		this.el.className += ' row-nofill';
		this.el.className += ' PageList_style';
		this.hideDrawer.addEventListener('click', () => { 
            this.isClosed = !this.isClosed;
            this.el.style.width = this.isClosed ? '50px' : '200px';
            this.hideDrawer.innerHTML = this.isClosed ? '>' : '<';
         });
		this.addBtn.addEventListener('click', () => { 
            let page = {
                title: 'New Page'
            } as PageData;
            this.data.setItem(page)
         });
		this.itemList.on('selected', (view: PageItem, page: PageData) => {  this.emit('selected', page);  });
		this.addBinding('itemList', 'update', 'data');
	}
}

SyncView.addGlobalStyle('.button_hideDrawer_style', ` position: absolute; top: 0; right: 0; `);
SyncView.addGlobalStyle('.button_addBtn_style', ` width: 100%; `);
SyncView.addGlobalStyle('.SyncList_itemList_style', ` width: 100%; margin-top: 1em; `);
export class PageItem extends SyncView<SyncData> {
	title = this.add('span', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(options);
		this.el.className += ' ';
		this.el.className += ' PageItem_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.addBinding('title', 'innerHTML', 'data.title');
	}
	onClick() { 
        this.emit('selected', this.data)
    }
}

export class PageEditorControls extends SyncView<SyncData> {
	title = this.addView(new Input({ twoway: true, label: 'Title', key: 'title' }), '');
	fill = this.add('div', {"innerHTML":"","className":" row-fill"});
	delBtn = this.add('button', {"innerHTML":"Delete Page","className":" row-nofill"});
	constructor(options: any = {}) {
		super(options);
		this.el.className += ' row';
		this.addBinding('title', 'update', 'data');
		this.delBtn.addEventListener('click', () => {  
        if(confirm('Delete page?')) {
            this.data.parent.remove(this.data.key); 
        }
     });
	}
}

export class PageAndPreview extends SyncView<PageData> {
 
        saveHandle: number; 
        cm: any;
    
 	constructor(options: any = {}) {
		super(options);
		this.el.className += ' row';
		this.el.className += ' PageAndPreview_style';
	}
}

export class PageEditor extends SyncView<SyncData> {
	controls = this.addView(new PageEditorControls(), ' PageEditorControls_controls_style');
	pageAndPreview = this.addView(new PageAndPreview(), '');
	constructor(options: any = {}) {
		super(options);
		this.el.className += ' row-fill col';
		this.el.className += ' PageEditor_style';
		this.addBinding('controls', 'update', 'data');
		this.addBinding('pageAndPreview', 'update', 'data');
	}
	render() {
        if(this.data) this.show();
        else this.hide();
    }
}

SyncView.addGlobalStyle('.PageEditorControls_controls_style', ` padding-bottom: 1em; `);
export class Input extends SyncView<SyncData> {
	input = this.add('input', {"innerHTML":"","className":" input_input_style"});
	constructor(options: any = {}) {
		super(options);
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
	render() {		
        if(this.data) {
            this.input.value = this.options.key ? this.data.get(this.options.key) : this.data;
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
SyncView.addGlobalStyle('.MainView_style', ` 
        position: absolute;
        left: 0; top: 0; right: 0; bottom: 0;
    `);
SyncView.addGlobalStyle('.PageList_style', `
        border-right: 1px solid #BBB;
        width: 200px;
        padding: 0 1em;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
    `);
SyncView.addGlobalStyle('.PageItem_style', ` 
        width: 100%; 
        border: 1px solid #DDD;
        `);
SyncView.addGlobalStyle('.PageAndPreview_style', ` height: 100%; `);
SyncView.addGlobalStyle('.PageEditor_style', `
        padding: 1em;
    `);
SyncView.addGlobalStyle('.Input_style', ` 
        width: 100%;
        display: flex; 
    `);

let app = new SyncApp<SyncData>(new MainView());
app.start();

new SyncReloader().start();
