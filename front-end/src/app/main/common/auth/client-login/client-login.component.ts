import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConst } from 'app/shared/AppConst';
import { AuthUser } from 'app/shared/model/authUser';
import { AuthService } from 'app/shared/service/auth.service';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login-2',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ClientLoginComponent implements OnInit {

  loginForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    isLoading: boolean = false;
    user:AuthUser

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthService,
    private _httpClient: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute
  )
  {
      // Configure the layout
      this._fuseConfigService.config = {
          layout: {
              navbar   : {
                  hidden: true
              },
              toolbar  : {
                  hidden: true
              },
              footer   : {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      this.loginForm = this._formBuilder.group({
          email   : ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
      });
  }

  submit(){
    const formData = this.loginForm.getRawValue();

    const data = {
        username: 'chase.cummerata@example.net',//formData.email,
        password: 'password',//formData.password,
        grant_type: 'password',
        client_id: 2,
        client_secret: 'JfqP2ck0gZiAo16lsXfYY9PZo6avq1EX8lxekS08',
        scope: '*'
    }

    this._httpClient.post(`${AppConst.apiBaseUrl}/oauth/token`, data)
    .subscribe((result:any)=> {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);
        
        // this._router.navigateByUrl('/dashboard');
        // this._router.navigate(['dashboard'], {replaceUrl:true});
        this._router.navigate(['dashboard'], {relativeTo: this._route})

        console.log(this._router.url);
        
        // get user using access token
        this._authenticationService.getAuthUser()
        .subscribe(data => {
            console.log(data);
        });

        
        // this.resolveDefaultPath();

    },
    error => {
        console.log('error');
    }
    )
    
}

resolveDefaultPath(): void
{
  console.log('resolver');
    this._router.navigate(['/apps/dashboards/analytics'],{replaceUrl:true});
        // this._router.navigate(['/pages/login'],{replaceUrl:true});
}

setUser(){

    const header = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });
    this._httpClient.get(`${AppConst.apiBaseUrl}/api/user`, {headers:header})
    .subscribe(
        result=>{

            this.user = new AuthUser(result);
            
            
        }
    );

}

ngOnDestroy(): void
{

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
}

}
