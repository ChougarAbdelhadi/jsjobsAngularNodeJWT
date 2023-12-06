import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  decodeToken: any = null;
  isAdmin = false;

  userEmail = '';


  constructor(private authService: AuthService, private jobService: JobService) { }

  ngOnInit(): void {
    if (this.authService.userIsLoggedIn()) {

      const jbbTokenString = localStorage.getItem('jbb-data');

      if (jbbTokenString !== null) {
        const jbbToken = JSON.parse(jbbTokenString);

        this.decodeToken = this.authService.decodeToken(jbbToken.token);

        console.log('token de proile : ', this.decodeToken);

        if (this.decodeToken && this.decodeToken.role === 'admin') {
          this.isAdmin = true;
        }

        this.userEmail = this.decodeToken.email; // recupere le mail depuis le token
        this.loadJobs(this.userEmail) // methode loadjobs
      } else {
        console.error("La clé 'jbb-data' n'a pas été trouvée dans le stockage local.");
      }
    }
  }

  // elle appel la methode get jobs by email from jobServices
  loadJobs(userEmail: string) {
    this.jobService.getJobsByUserEmail(userEmail)
      .subscribe({
        next : data => console.log('get jobs by emails data : ' ,data),
        error: err => console.error(err)        
      });
  }

}
