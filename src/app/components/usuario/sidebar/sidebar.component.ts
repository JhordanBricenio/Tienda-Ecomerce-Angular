import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/sercices/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public authServcice:AuthService, private route:Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.authServcice.logout();
    this.route.navigate(['/']);

  }
}
