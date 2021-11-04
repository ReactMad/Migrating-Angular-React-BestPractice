import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
	DocumentViewModel,
	eventBus,
	Order,
	documentsService,
	DocumentType,
	OrderDocument,
	OrderItem
} from './external'

// helper functions
function attachImage(): void {
	eventBus.publish('attach-image')
}

type ImageFunc = (doc: DocumentViewModel) => Promise<any>
type DocumentsGalleryProps = {
	order: Order;
	editImage: ImageFunc;
	viewImage: ImageFunc;
	deleteImage: ImageFunc;
}
export const DocumentsGallery: React.FC<DocumentsGalleryProps> = (props: DocumentsGalleryProps) => {
	const { order, editImage, viewImage, deleteImage } = props
	const [documents, setDocuments] = useState<DocumentViewModel[]>([])
	const [docTypes, setDocTypes] = useState<DocumentType[]>([])

	const initDocuments = useCallback(async () => {
		try {
			const documents = await documentsService.getAllDocuments()
			const docs = documents.map((doc: OrderDocument) => ({
				id: doc.id,
				name: doc.name,
				description: doc.description,
				typeId: doc.typeId
			}))

			setDocuments(docs)
			setDocTypes(documentsService.getAvailableDocumentTypes())
		} catch (e: any) {
			console.error(e)
		}
	}, [])

	useEffect(() => {
		initDocuments()
	}, [])

	const handleEditImage = useCallback(async (doc: DocumentViewModel) => {
		try {
			await editImage(doc)
			await initDocuments()
		} catch (e: any) {
			console.error(e)
		}
	}, [editImage])

	const handleDeleteImage = useCallback(async (doc: DocumentViewModel) => {
		try {
			await deleteImage(doc)
			await initDocuments()
		} catch (e: any) {
			console.error(e)
		}
	}, [deleteImage])

	const handleViewImage = useCallback(async (doc: DocumentViewModel) => {
		try {
			await viewImage(doc)
		} catch (e: any) {
			console.error(e)
		}
	}, [viewImage])

	const images = useMemo(() => {
		return documents.filter(doc => doc.blob && doc.blob.type !== "application/pdf")
	}, [documents])

	const pdfDocs = useMemo(() => {
		return documents.filter(doc => doc.blob && doc.blob.type !== "application/pdf")
	}, [documents])

	if (images.length === 0 && pdfDocs.length === 0) {
		return (
			<div className='empty documents__empty-states'>
				<div className="empty-icon">
					<svg width="2em"
						height="2em"
						viewBox="0 0 16 16"
						className="bi bi-file-earmark-richtext"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					/>
				</div>
				<p className="empty-title h4">No documents</p>
				<p className="empty-subtitle">Click the button to attach file</p>
				<div className="empty-action">
					<button className="btn btn-primary" onClick={attachImage}>
						<i className="glyphicon glyphicon-plus"></i> Attach file
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="table-responsive document-list" style={{ marginTop: 20 }}>
			<h3> Images </h3>
			<div className="documents-img-box">
				{images.map((image: DocumentViewModel) => (
					<Document
						order={order}
						doc={image}
						type='image'
						types={docTypes}
						handleViewImage={handleViewImage}
						handleEditImage={handleEditImage}
						handleDeleteImage={handleDeleteImage}
					/>
				))}
			</div>
			<div>
				<h3>Documents</h3>
				<div className='documents-pdf-box'>
					{pdfDocs.map((doc: DocumentViewModel) => (
						<Document
							order={order}
							doc={doc}
							type='pdf'
							types={docTypes}
							handleViewImage={handleViewImage}
							handleEditImage={handleEditImage}
							handleDeleteImage={handleDeleteImage}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

interface ImageInterface {
	handleViewImage: ImageFunc;
	handleEditImage: ImageFunc;
	handleDeleteImage: ImageFunc;
}
interface DocumentProps extends ImageInterface {
	order: Order;
	doc: DocumentViewModel;
	docTypes: DocumentType[];
	type: 'pdf' | 'image';
}
const Document: React.FC<DocumentProps> = (props: DocumentProps) => {
	const {
		order,
		doc,
		type,
		docTypes,
		handleViewImage,
		handleEditImage,
		handleDeleteImage
	} = props

	const getDocumentType = useCallback((typeId: number) => {
		return docTypes.find(d => d.id === typeId).name
	}, [docTypes])

	const getDocumentHeading = useCallback((doc: DocumentViewModel) => {
		if (!doc.itemLocalId) return "Order Document"

		const item = order.Items.find((item: OrderItem) => item.LocalId === doc.itemLocalId)
		return "Item " + item.ItemNo + (item.location ? ": " + item.location : "")
	}, [order.Items])

	if (type === 'pdf') {
		return (
			<div className='pdf-box'>
				<span>Type: {getDocumentType(doc.typeId)}</span>
				<div className='svg-box'>
					<svg
						width='1em'
						height='1em'
						viewBox='0 0 16 16'
						className='bi bi-file-earmark-text'
						style={{ cursor: 'pointer' }}
						onClick={() => handleViewImage(doc)}
					/>
				</div>
				<div className='pdf-box-details'>
					<p
						onClick={() => handleEditImage(doc)}
						className='documents__edit-image-button'
					>
						{getDocumentHeading(doc)}
					</p>
					<p className='documents__description'>{doc.description}</p>
					<div className='pdf-box-dlt'>
						<button
							type='button'
							className='btn dlt-btn'
							onClick={() => handleDeleteImage(doc)}
							title='Delete'
						>
							<i className='glyphicon glyphicon-trash' style={{ float: 'right' }}></i>
						</button>
					</div>
				</div>
			</div>
		)
	}

	if (type === 'image') {
		<div className='img-box'>
			<img
				render-image-blob={doc.blob}
				style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }}
				onClick={() => handleViewImage(doc)}
			/>
			<div className='img-box-details'>
				<span>
					<p
						onClick={() => handleEditImage(doc)}
						className='documents__edit-image-button'
					>
						{getDocumentHeading(doc)}
					</p>
				</span>
				<span className='documents__description'>
					{doc.description}
				</span>
				<div className='img-box-dlt'>
					<button
						className='btn dlt-btn'
						onClick={() => handleDeleteImage(doc)}
						title='Delete'
					>
						<i className='glyphicon glyphicon-trash' style={{ float: 'right' }} />
					</button>
				</div>
			</div>
		</div>
	}
}
