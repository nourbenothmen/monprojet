import { Component, OnInit } from '@angular/core'; // Ajout de OnInit
import { animate, style, transition, trigger } from '@angular/animations';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { AuthService } from '../../../../../demo/pages/authentication/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, ChatUserListComponent, ChatMsgComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit {
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  userName: string = 'Utilisateur'; // Valeur par défaut

  constructor(
    private auth: AuthService,
    private router: Router,
    config: NgbDropdownConfig
  ) {
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  ngOnInit() {
    // Mettre à jour le nom de l'utilisateur au chargement
    const name = this.auth.getUserName();
    if (name) {
      this.userName = name;
    }
  }

  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}