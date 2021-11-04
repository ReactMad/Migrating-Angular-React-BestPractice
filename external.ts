export interface OrderItem {
    LocalId: number;
    ItemNo: number;
    location: string;
}

export interface Order {
    Items: OrderItem[];
}

export const eventBus = {
    publish(eventName: string) { },
    subscribe() { }
};

export interface DocumentViewModel {
    id: number;
    typeId: number;
    name: string;
    description: string;
    blob?: Blob;
    itemLocalId?: number;
}

export interface OrderDocument {
    id: number;
    typeId: number;
    name: string;
    description: string;
    dateAdded: Date;
}

export interface DocumentType{
    id: number;
    name: string;
}

export function ComponentNg15(opts: any) {
    return (target: any) => { };
}

interface DocumentsService {
    getAllDocuments(): Promise<OrderDocument[]>

    getAvailableDocumentTypes():DocumentType[];
}

export let documentsService: DocumentsService;