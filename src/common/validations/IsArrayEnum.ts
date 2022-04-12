import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isArrayEnum', async: false })
export class IsArrayEnum implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const enumValues = propertyValue.split(',');
    let isValid = true;

    for (const value of enumValues) {
      isValid = (<any>Object).values(args.constraints[0]).includes(value);
      if (!isValid) return isValid;
    }

    return isValid;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" harus berupa isian yang valid.`;
  }
}
