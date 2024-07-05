import { Component } from '@angular/core';
import { RouterModule,  } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, MatToolbarModule, MatButtonModule,],
  templateUrl: './app.component.html',

})
export class AppComponent {
  title = 'frontend-sinapsis';
}
