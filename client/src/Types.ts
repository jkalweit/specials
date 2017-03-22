import { SyncData } from './SyncNode/SyncNode'


export interface MainData extends SyncData {
    pages: {[key: string]: PageData};
}

export interface PageData extends SyncData {
    title: string;
    specials: { [key: string]: SpecialItemData }
    drafts: { [key: string]: SpecialItemData }
    bottles: { [key: string]: SpecialItemData }
    wines: { [key: string]: SpecialItemData }
    cocktails: { [key: string]: SpecialItemData }
}

export interface ItemData extends SyncData {
    title: string;
    description: string;
}

export interface SpecialItemData extends ItemData {
    price: string;
    link: string;
}