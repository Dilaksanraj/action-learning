import { FormArray, ValidatorFn } from '@angular/forms';

export function minSelectedCheckboxes(options?: { isObject?: boolean, min?: number }): ValidatorFn
{
    const _isObject = options ? options.isObject : false;
    const _min = options ? options.min : 1;

    const validator: ValidatorFn = (formArray: FormArray) => 
    {
        const totalSelected = formArray.controls
            .map(control => _isObject ? control.value.isSelected : control.value)
            .reduce((prev, next) => next ? prev + next : prev, 0);

        return totalSelected >= _min ? null : { required: true };
    };

    return validator;
}
