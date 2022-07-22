import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { User } from 'app/main/module/user/user.model';
import { CommonService } from 'app/shared/service/common.service';
import { confirmPasswordValidator } from 'app/shared/validators/confirm-password';
import { CustomValidators } from 'app/shared/validators/custom-validators';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { InvitationVerify } from './Invitation.model';
import { InvitationAuthService } from './invitation.service';

@Component({
  selector: 'invitation-auth',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations
    ]
})
export class InvitationAuthComponent implements OnInit, OnDestroy {

  // Private
  private _unsubscribeAll: Subject<any>;

  invitationForm: FormGroup;
  invitation: InvitationVerify;
  user: User;

  isLoading: boolean;
  copyRightYear: number;

  recaptchaSiteKey: string;
  invitationAccepted: boolean;
  invalidAccess: boolean;
  linkExpired: boolean;

  termsModel: any;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _fuseConfigService: FuseConfigService,
    private _invitationService: InvitationAuthService,
    private _commonService: CommonService,
    public _matDialog: MatDialog,
  ) {

    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        style: 'vertical-layout-2',
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };

    // Set defaults
    this.copyRightYear = DateTimeHelper.now().year();

    this.isLoading = false;
    this.invitationAccepted = false;
    this.invalidAccess = false;
    this.linkExpired = false;

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this.invitationForm = this.createInvitationForm();

  }

  ngOnInit() {

    console.log('client invitation !!!');

    this._document.body.classList.add('page-content-reset');

    // Subscribe to invitation list changes
    this._invitationService
      .onInvitationTokenVerified
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        console.log('[client invitations]', response);

        if (_.isNull(response)) {
          this.invalidAccess = true;
        }
        else {
          if (response.expired) {
            this.linkExpired = true;
          }

          this.invitation = response;

          // get parent detail
          if (this.invitation.childId) {
            this.isLoading = true;

            this._invitationService
              .getUserData(this.invitation.email)
              .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => this.isLoading = false)
              )
              .subscribe(
                (user: User) => {
                  this.user = user;

                  this.setValues();
                },
                error => {
                  throw error;
                }
              );
          }
        }
      });

  }

  setValues(): void {
    if (this.user) {
      this.invitationForm.get('first_name').patchValue(this.user.firstName, { emitEvent: false });
      this.invitationForm.get('last_name').patchValue(this.user.lastName, { emitEvent: false });
      this.invitationForm.get('date_of_birth').patchValue(this.user.dob, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this._document.body.classList.remove('page-content-reset');

    // Close all dialogs
    this._matDialog.closeAll();

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  get formVal(): any {
    return this.invitationForm.controls;
}

createInvitationForm(): FormGroup {
  return new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9_)(-\-\']+')]),
      last_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9_)(-\-\']+')]),
      date_of_birth: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      address_line_1: new FormControl(''),
      address_line_2: new FormControl(''),
      password: new FormControl('', [
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
          Validators.minLength(6)
      ]),
      passwordConfirm: new FormControl('', [Validators.required, confirmPasswordValidator]),
      terms: new FormControl(false, [Validators.requiredTrue]),
  });
}

getPasswordErrorMessage(): any 
{
    return this.invitationForm.get('password').hasError('required') ? 'You must enter a value' :
        this.invitationForm.get('password').hasError('hasNumber') ? 'Must contain at least 1 number' :
        this.invitationForm.get('password').hasError('hasCapitalCase') ? 'Must contain at least 1 in Capital Case' :
        this.invitationForm.get('password').hasError('hasSmallCase') ? 'Must contain at least 1 Letter in Small Case' :
        this.invitationForm.get('password').hasError('hasSpecialCharacters') ? 'Must contain at least 1 Special Character' :
        this.invitationForm.get('password').hasError('minlength') ? 'Your password should have at least 6 characters' :
        '';
}

onFormSubmit(e: MouseEvent): void {
  e.preventDefault();

  if (this.invitationForm.invalid) {
      return;
  }

  const data = {
      reference: this.invitation.id,
      first: this.formVal.first_name.value,
      last: this.formVal.last_name.value,
      dob: DateTimeHelper.getUtcDate(this.formVal.date_of_birth.value),
      address1: this.formVal.address_line_1.value,
      address2: this.formVal.address_line_2.value,
      phone: this.formVal.phone.value,
      password: this.formVal.password.value
  };

  console.log('[invitation object]', data);

  this.isLoading = true;

  this._invitationService
      .acceptInvitation(data)
      .pipe(
          takeUntil(this._unsubscribeAll),
          finalize(() => this.isLoading = false)
      )
      .subscribe(
          res =>
          {
              this.invitationAccepted = true;

              // update parent scroll
              this._commonService._updateParentScroll.next();
          },
          error => 
          {

              throw error;
          },
          () => {
              console.log('😀 all good. 🍺');
          }
      );
}


}
