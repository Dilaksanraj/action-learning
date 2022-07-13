import { ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { switchMap, catchError, map, debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { of } from 'rxjs';

import { CommonService } from '../service/common.service';

export function valueExists(_commonService: CommonService, property: string = '', index: string = ''): AsyncValidatorFn
{
    return (control: AbstractControl) => control
        .valueChanges
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(() => _commonService.isValueExists(control.value, property, index)),
            map((unique: any) => (!unique.found ? null : { exists: true, name: unique.name, type: unique.type })),
            catchError(() => of({ exists: true })),
            first()
        );
}
