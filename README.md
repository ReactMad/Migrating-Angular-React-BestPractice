The task is to convert the component from AngularJs to React. Ignore external dependencies and for implementation please use functional component with hooks. Resulting code has to be correct and idiomatic to React, but it does not have to be runnable. The solution should be in TypeScript.

```
<documents-gallery
    order="vm.order"
    edit-image="vm.editImage(doc})" 
    view-image="vm.viewImage(doc)" 
    delete-image="vm.deleteImage(doc)">
</documents-gallery>
```


```
<DocumentsGallery
    order={order}
    edit-image="{editImage}" 
    view-image="{viewImage}" 
    delete-image="{deleteImage}">
</DocumentsGallery>
```
