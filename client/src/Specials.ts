import { SyncNode, SyncNodeSocket, SyncData } from "./SyncNode/SyncNode"
import { SyncView, SyncApp, SyncList, SyncUtils, SyncReloader } from "./SyncNode/SyncView"


import { SpecialItemData } from './Types'
import { Input, Modal, SimpleHeader } from './Components'

export class SpecialsListView extends SyncView<SyncData> {
	header = this.addView(new SimpleHeader({ title: 'Specials' }), ' SimpleHeader_header_style');
	addModal = this.addView(new Modal({ view: AddSpecialModal }), '');
	list = this.addView(new SyncList({ item: SpecialItemView }), '');
	editModal = this.addView(new Modal({ view: EditSpecialModal }), '');
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' ';
		this.el.className += ' SpecialsListView_style';
		this.header.on('add', () => { 
            this.addModal.show();
         });
		this.addBinding('addModal', 'update', 'data');
		this.list.on('edit', (view: SpecialItemView, data: SpecialItemData) => { 
            this.editModal.update(data);
            this.editModal.show(); 
         });
		this.addBinding('list', 'update', 'data');
	}
	updateAdminMode(val: boolean) {
        this.header.showButtons(val);
    }
	init() {
        this.header.title.innerHTML = this.options.title || 'Specials';
        this.updateAdminMode(false);
    }
}

SyncView.addGlobalStyle('.SimpleHeader_header_style', ` padding-bottom: 1em; color: #AAA; `);
export class SpecialItemView extends SyncView<SpecialItemData> {
	row1 = this.addView(new SpecialItemViewRow1(), 'col-nofill SpecialItemViewRow1_row1_style');
	description = this.add('span', {"innerHTML":"","className":"col-fill span_description_style col-fill"});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' col hover-blue';
		this.el.className += ' SpecialItemView_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.addBinding('row1', 'update', 'data');
		this.addBinding('description', 'innerHTML', 'data.description');
	}
	onClick() { this.emit('edit', this.data); }
}

SyncView.addGlobalStyle('.SpecialItemViewRow1_row1_style', ` font-weight: bold; `);
SyncView.addGlobalStyle('.span_description_style', ` font-style: italic; padding-left: 1em; `);
export class SpecialItemViewRow1 extends SyncView<SpecialItemData> {
	title = this.add('span', {"innerHTML":"","className":"row-fill row-fill"});
	price = this.add('span', {"innerHTML":"","className":"row-nofill row-nofill"});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' row';
		this.el.className += ' SpecialItemViewRow1_style';
		this.addBinding('title', 'innerHTML', 'data.title');
		this.addBinding('price', 'innerHTML', 'data.price');
	}
}

export class EditSpecialModal extends SyncView<SyncData> {
	title = this.addView(new Input({ label: 'Name', key: 'title' }), '');
	description = this.addView(new Input({ label: 'Description', key: 'description' }), '');
	price = this.addView(new Input({ label: 'Price', key: 'price' }), '');
	link = this.addView(new Input({ label: 'Link', key: 'link' }), '');
	btnDelete = this.add('button', {"innerHTML":"Delete","className":""});
	btnClose = this.add('button', {"innerHTML":"Close","className":""});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' ';
		this.el.className += ' EditSpecialModal_style';
		this.addBinding('title', 'update', 'data');
		this.addBinding('description', 'update', 'data');
		this.addBinding('price', 'update', 'data');
		this.addBinding('link', 'update', 'data');
		this.btnDelete.addEventListener('click', () => {  
        if(confirm('Delete item?')) {
            this.data.parent.remove(this.data.key);
            this.emit('hide');
        }
      });
		this.btnClose.addEventListener('click', () => {  this.emit('hide');  });
	}
}

export class AddSpecialModal extends SyncView<SyncData> {
	title = this.addView(new Input({ label: 'Name', key: 'title', twoway: false }), '');
	description = this.addView(new Input({ label: 'Description', key: 'description', twoway: false }), '');
	price = this.addView(new Input({ label: 'Price', key: 'price', twoway: false }), '');
	link = this.addView(new Input({ label: 'Link', key: 'link', twoway: false }), '');
	btnAdd = this.add('button', {"innerHTML":"Add","className":""});
	btnClose = this.add('button', {"innerHTML":"Cancel","className":""});
	constructor(options: any = {}) {
		super(options);
		this.options = SyncUtils.mergeMap({}, options);
		this.el.className += ' ';
		this.el.className += ' AddSpecialModal_style';
		this.addBinding('title', 'update', 'data');
		this.addBinding('description', 'update', 'data');
		this.addBinding('price', 'update', 'data');
		this.addBinding('link', 'update', 'data');
		this.btnAdd.addEventListener('click', () => { 
            let item = {
               title: this.title.value(),
               description: this.description.value(),
               price: this.price.value(),
               link: this.link.value()
            } as SpecialItemData;
            (this.data as SyncData).setItem(item);
            this.emit('hide');
         });
		this.btnClose.addEventListener('click', () => {  this.emit('hide');  });
	}
	init() { this.update({} as SyncData); }
}

SyncView.addGlobalStyle('.SpecialsListView_style', ` padding: 0 1em; `);
SyncView.addGlobalStyle('.SpecialItemView_style', ` padding: 0.25em 0; `);
SyncView.addGlobalStyle('.SpecialItemViewRow1_style', ` border-bottom: 1px dashed #999; `);
SyncView.addGlobalStyle('.EditSpecialModal_style', `
        background-color: #FFF;
        width: 500px;
        padding: 1em;
    `);
SyncView.addGlobalStyle('.AddSpecialModal_style', `
        background-color: #FFF;
        width: 500px;
        padding: 1em;
    `);
