import { IScope } from "angular";
import { ComponentNg15, DocumentViewModel, eventBus, Order, documentsService, DocumentType } from "./external";

// this attribute works similarly to Angular 2+ Component attribute
@ComponentNg15({
  selector: "documents-gallery",
  bindings: {
    order: "<",
    editImage: "&",
    viewImage: "&",
    deleteImage: "&",
  },
  templateUrl: "documents/documents-gallery.html",
})
export class DocumentsGallery {
  documentTypes: DocumentType[];
  documents: DocumentViewModel[];
  order: Order;
  editImage: (doc: any) => Promise<any>;
  viewImage: (doc: any) => Promise<any>;
  deleteImage: (doc: any) => Promise<any>;

  static $inject = ["$scope"]

  constructor(private $scope: IScope) {
    this.initDocuments();
    this.documentTypes = documentsService.getAvailableDocumentTypes();
  }

  editImageClick(doc: DocumentViewModel) {
    return this.editImage({ doc })
      .then(() => this.initDocuments())
      .catch(e => console.error(e));
  }

  viewImageClick(doc: DocumentViewModel) {
    return this.viewImage({ doc }).catch(e => console.error(e));
  }

  deleteImageClick(doc: DocumentViewModel) {
    return this.deleteImage({ doc })
      .then(() => this.initDocuments())
      .catch(e => console.error(e));
  }

  getImages(): DocumentViewModel[] {
    return this.documents.filter(doc => {
      return doc.blob && doc.blob.type !== "application/pdf";
    });
  }

  getDocuments(): DocumentViewModel[] {
    return this.documents.filter(doc => {
      return doc.blob && doc.blob.type === "application/pdf";
    });
  }

  getDocumentHeading(doc: DocumentViewModel): string {
    if (!doc.itemLocalId) return "Order Document";

    const item = this.order.Items.find(item => item.LocalId === doc.itemLocalId);
    return "Item " + item.ItemNo + (item.location ? ": " + item.location : "");
  }

  attachImage() {
    eventBus.publish("attach-image");
  }

  getDocumentType(typeId: number): string {
    return this.documentTypes.find(d => d.id === typeId).name;
  }

  private async initDocuments() {
    const documents = await documentsService.getAllDocuments();

    this.$scope.applyAsync(() => {
      this.documents = documents.map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        typeId: d.typeId
      }))
    })
  }
}

