import { AbstractControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteComponent, BooleanComponent, ButtonFieldComponent, ColorComponent, DatePickerComponent, EditorComponent, FileFieldComponent, FloatedInputComponent, FormAccordionComponent, InputGroupComponent, InputMaskComponent, InputNumberComponent, MapComponent, PasswordComponent, RadioComponent, RatingComponent, RepeatArrayTypeComponent, RepeatTypeComponent, SelectComponent, SeparatorComponent, SwitchComponent, TextareaComponent, TreeComponent } from '@shared';
import { constants } from './constants';
import { FormlyTranslateExtension } from './translate.extension';

export function EmailValidator(control: AbstractControl) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value) ? null : { 'email': true };
};

export function MobileValidator(control: AbstractControl) {
  return /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/.test(control.value) ? null : { 'mobile': true };
};

export function fieldMatchValidator(control: AbstractControl) {
  const { password, password_confirmation } = control.value;
  return password_confirmation === password ? null : { fieldMatch: true }
};

export function onlyNumbersValidator(control: AbstractControl) {
  const isValid = /^\d+$/.test(control.value);
  return isValid ? null : { onlyNumbers: true };
};

export function urlValidator(control: AbstractControl) {
  const isValidUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(control.value);
  return isValidUrl ? null : { invalidUrl: true };
}

export function customFormlyConfig(translate: TranslateService) {
  return {
    validators: [
      { name: "email", validation: EmailValidator },
      { name: "mobile", validation: MobileValidator },
      { name: "onlyNumbers", validation: onlyNumbersValidator },
      { name: "invalidUrl", validation: urlValidator },
      { name: "fieldMatch", validation: fieldMatchValidator }
    ],
    validationMessages: [
      {
        name: 'required',
        message(error: any, field: FormlyFieldConfig) {
          return translate.stream(_('This Field Is Required'));
        },
      },
      {
        name: 'minLength',
        message() {
          return translate.stream(_('fields.validation_min_length'), { minLength: constants.MIN_LENGTH_TEXT_INPUT });
        }
      },
      {
        name: 'maxLength',
        message() {
          return translate.stream(_('fields.validation_max_length'), { maxLength: constants.MAX_LENGTH_TEXT_INPUT });
        }
      },
      {
        name: 'email',
        message() {
          return translate.stream(_('This Field Is Not Formated Email'));
        },
      },
      {
        name: 'mobile',
        message() {
          return translate.stream(_('fields.mobile'));
        },
      },
      {
        name: 'onlyNumbers',
        message() {
          return translate.stream(_('fields.only_numbers'));
        },
      },
      {
        name: 'min', message: (error: any, field: FormlyFieldConfig) => {
          return translate.stream(_('fields.validation_min'), { min: field.props?.min });
        }
      },
      {
        name: 'max', message: (error: any, field: FormlyFieldConfig) => {
          return translate.stream(_('fields.validation_max'), { max: field.props?.max });
        }
      },
      {
        name: 'invalidUrl',
        message() {
          return translate.stream(_('fields.validation_invalidUrl'));
        }
      },
      {
        name: 'fieldMatch',
        message() {
          return translate.stream(_('fields.validation_compare_password_error'));
        }
      },
    ],
    presets: [],
    extensions: [
      {
        name: 'translate-extension',
        extension: new FormlyTranslateExtension(translate),
        priority: 3
      },
    ],
    types: [
      { name: "separator-field", component: SeparatorComponent },
      { name: "select-field", component: SelectComponent },
      { name: "floated-input-field", component: FloatedInputComponent },
      { name: "textarea-field", component: TextareaComponent },
      { name: "tree-field", component: TreeComponent },
      { name: "button-field", component: ButtonFieldComponent },
      { name: "switch-field", component: SwitchComponent },
      { name: "boolean-field", component: BooleanComponent },
      { name: "radio-field", component: RadioComponent },
      { name: "rating-field", component: RatingComponent },
      { name: "map-field", component: MapComponent },
      { name: "mask-field", component: InputMaskComponent },
      { name: "number-field", component: InputNumberComponent },
      { name: "repeat-field", component: RepeatTypeComponent },
      { name: "file-field", component: FileFieldComponent },
      { name: "repeat-array-field", component: RepeatArrayTypeComponent },
      { name: "password-field", component: PasswordComponent },
      { name: "autocomplete-field", component: AutocompleteComponent },
      { name: "input-group-field", component: InputGroupComponent },
      { name: "accordion-field", component: FormAccordionComponent },
      { name: "color-field", component: ColorComponent },
      { name: "date-field", component: DatePickerComponent },
      { name: "editor-field", component: EditorComponent },
    ],
  };
}
