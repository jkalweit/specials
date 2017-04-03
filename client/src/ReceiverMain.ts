import { SyncNode, SyncNodeSocket, SyncData } from "./SyncNode/SyncNode"
import { SyncView, SyncApp, SyncList, SyncUtils, SyncReloader } from "./SyncNode/SyncView"


    import { MainData, PageData } from './Types'
    import { Input } from './Components'
    import { SpecialsListView } from './Specials'
    import { CastReceiver } from './CastReceiver'


    import * as smoothscroll from './lib/smoothscroll'
    smoothscroll.polyfill();

export class EventHub extends SyncView<SyncData> {

        isAdminMode: boolean = false;
    
 	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' ';
	}
	toggleAdminMode() {
        this.isAdminMode = !this.isAdminMode;
        this.emit('isAdminModeChanged', this.isAdminMode);
    }
	init() {
        document.addEventListener('keypress', e => {
			if(e.keyCode === 94) { // 94 = '^'
				this.toggleAdminMode();
			}
		});
    }
}

export class MainView extends SyncView<MainData> {
 
        selectedPage: PageData;
        isInited: boolean = false;
    
 	editor = this.addView(new PageEditor(), 'row-fill');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row';
		this.el.className += ' MainView_style';
	}
	init() {
        let receiver = new CastReceiver();
        receiver.start();
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
	title = this.add('h1', {"innerHTML":"Pages32","className":""});
	addBtn = this.add('button', {"innerHTML":"Add Page","className":" button_addBtn_style"});
	itemList = this.addView(new SyncList({ item: PageItem }), ' SyncList_itemList_style');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row-nofill';
		this.el.className += ' PageList_style';
		this.hideDrawer.addEventListener('click', () => { 
            this.isClosed = !this.isClosed;
            this.el.style.width = this.isClosed ? '50px' : '200px';
            this.hideDrawer.innerHTML = this.isClosed ? '>' : '<';
         });
		this.addBtn.addEventListener('click', () => { 
            let page = {
                title: 'New Page',
                specials: {},
                wines: {},
                cocktails: {},
                drafts: {},
                bottles: {}
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
		this.options = SyncUtils.mergeMap({}, options);
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
	title = this.addView(new Input({ twoway: true, label: 'Title', key: 'title' }), 'row-nofill Input_title_style');
	fill = this.add('div', {"innerHTML":"","className":"row-fill row-fill"});
	delBtn = this.add('button', {"innerHTML":"Delete Page","className":"row-nofill row-nofill"});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row';
		this.addBinding('title', 'update', 'data');
		this.delBtn.addEventListener('click', () => {  
        if(confirm('Delete page?')) {
            this.data.parent.remove(this.data.key); 
        }
     });
	}
}

SyncView.addGlobalStyle('.Input_title_style', ` width: 350px; `);
export class PageEditor extends SyncView<PageData> {
	cols = this.addView(new PageEditorColumns(), 'col-fill');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row-fill col';
		this.el.className += ' PageEditor_style';
		this.addBinding('cols', 'update', 'data');
	}
	render() {
        if(this.data) this.show();
        else this.hide();
    }
}

export class PageEditorColumns extends SyncView<SyncData> {
	specialsList = this.addView(new SpecialsListView({title: 'Specials'}), 'row-fill SpecialsListView_specialsList_style');
	cocktailsList = this.addView(new SpecialsListView({title: 'Cocktails'}), 'row-fill SpecialsListView_cocktailsList_style');
	draftWineColumn = this.addView(new DraftWineColumn(), 'row-fill DraftWineColumn_draftWineColumn_style');
	bottlesList = this.addView(new SpecialsListView({title: 'Bottles'}), 'row-fill SpecialsListView_bottlesList_style');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row';
		this.addBinding('specialsList', 'update', 'data.specials');
		this.addBinding('cocktailsList', 'update', 'data.cocktails');
		this.addBinding('draftWineColumn', 'update', 'data');
		this.addBinding('bottlesList', 'update', 'data.bottles');
	}
	init() {
        eventHub.on('isAdminModeChanged', (isAdminMode) => {
            this.specialsList.updateAdminMode(isAdminMode);
            this.cocktailsList.updateAdminMode(isAdminMode);
            this.bottlesList.updateAdminMode(isAdminMode);
        });
    }
}

SyncView.addGlobalStyle('.SpecialsListView_specialsList_style', ` min-width: 200px; margin-right: 2em; `);
SyncView.addGlobalStyle('.SpecialsListView_cocktailsList_style', ` min-width: 200px; margin-right: 2em; `);
SyncView.addGlobalStyle('.DraftWineColumn_draftWineColumn_style', ` min-width: 200px; margin-right: 2em; `);
SyncView.addGlobalStyle('.SpecialsListView_bottlesList_style', ` min-width: 200px; margin-right: 2em; `);
export class DraftWineColumn extends SyncView<SyncData> {
	draftsList = this.addView(new SpecialsListView({title: 'Drafts'}), 'col-fill SpecialsListView_draftsList_style');
	winesList = this.addView(new SpecialsListView({title: 'Wines'}), 'col-fill SpecialsListView_winesList_style');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' col';
		this.addBinding('draftsList', 'update', 'data.drafts');
		this.addBinding('winesList', 'update', 'data.wines');
	}
	init() {
        eventHub.on('isAdminModeChanged', (isAdminMode: boolean) => {
            this.draftsList.updateAdminMode(isAdminMode);
            this.winesList.updateAdminMode(isAdminMode);
        });
    }
}

SyncView.addGlobalStyle('.SpecialsListView_draftsList_style', ` min-width: 200px; `);
SyncView.addGlobalStyle('.SpecialsListView_winesList_style', ` min-width: 200px; margin-right: 2em; `);

    let eventHub = new EventHub();
    eventHub.init();
    let app = new SyncApp<SyncData>(new MainView());
    app.start();
    new SyncReloader().start();

SyncView.addGlobalStyle('.MainView_style', ` 
        position: absolute;
        left: 0; top: 0; right: 0; bottom: 0;
        color: #FFF;
        background-color: #000;
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
SyncView.addGlobalStyle('.PageEditor_style', `
        padding: 1em;
    `);
