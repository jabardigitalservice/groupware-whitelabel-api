import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { permitAcknowledged } from '../../models/days-off/enums/permit-acknowledged.enums';

@ValidatorConstraint({ name: 'isArrayEnum', async: false })
export class IsArrayEnum implements ValidatorConstraintInterface {
  validate(propertyValue: string) {
    const enumValues = propertyValue.split(',');

    let isValid = true;
    enumValues.forEach((value) => {
      isValid = (<any>Object).values(permitAcknowledged).includes(value);
    });
    return isValid;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" harus berupa isian yang valid.`;
  }
}
