import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoiceDetail.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { invoiceViewComponent } from './invoice/invoice-view/invoiceView.component';


const canDeactivateContactsDetails = (
    component: InvoiceDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/accounting')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    // return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: InvoiceComponent
    },

    {
        path: 'edit/:id',
        component: InvoiceDetailComponent,
    }, 
    {
        path: 'view/:id',
        component: invoiceViewComponent
    }
] as Routes;
