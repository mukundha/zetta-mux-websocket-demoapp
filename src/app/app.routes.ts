import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
import { About } from './about';
import { NoContent } from './no-content';
import {App} from './app.component'
import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: App },
  
];
