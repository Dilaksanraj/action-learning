import {FormControl, ValidationErrors} from '@angular/forms';

export class YesValidator {

    static YesOnly(control: FormControl): ValidationErrors | null 
    {
        const fieldValue = control.value;

        if (!(fieldValue || fieldValue === 'Yes' || fieldValue === 'true')) 
        {
            return {
                requireValue: {
                    parsedValue: 'Yes'
                }
            }
        }
        
        return null;
    }
}
