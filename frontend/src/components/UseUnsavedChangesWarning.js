import React, { Fragment } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function UseUnsavedChangesWarning({ visible, declareUserDecision }) {
    const cancelRouting = () => {
        declareUserDecision(false);
    };
    const ignoreChanges = () => {
        declareUserDecision(true);
    };

    const removeItemDialogFooter = (
        <Fragment>
            <div className="flex justify-content-center">
                <Button label="Yes" icon="pi pi-check" severity="success" className="w-3" onClick={ignoreChanges} />
                <Button label="No" icon="pi pi-times" severity="danger" className="w-3" onClick={cancelRouting} />
            </div>
        </Fragment>
    );

    return (
        <Dialog visible={visible} style={{ width: '40rem' }} modal closable={false} footer={removeItemDialogFooter}>
            <div className="flex align-items-center justify-content-center text-xl">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'tomato' }} />
                <span>There are some unsaved changes do you want to continue?</span>
            </div>
        </Dialog>
    );
}
