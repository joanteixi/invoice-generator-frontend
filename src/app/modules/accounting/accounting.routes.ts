import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoiceDetail.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { invoiceViewComponent } from './invoice/invoice-view/invoiceView.component';
import { invoiceSharedComponent } from './invoice/invoice-shared/invoiceShared.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';


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
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        path: '',
        component: InvoiceComponent
    },

    {
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        path: 'edit/:id',
        component: InvoiceDetailComponent,
    }, 
    {
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        path: 'view/:id',
        component: invoiceViewComponent
    },
    {
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        path: 'shared_version/:url_id',
        component: invoiceSharedComponent,
        data: {
            layout: 'empty'
        },

    }
] as Routes;
