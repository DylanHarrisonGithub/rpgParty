import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    alpha: /^[a-zA-Z]*$/,
    numeric: /^[0-9]*$/,
    alphaNumeric: /^[a-zA-Z0-9]*$/,
    alphaNumericSpaces: /^[a-zA-Z0-9 ]*$/,
    commonWriting: /^[A-Za-z0-9 \-_.,?!()"'/$&]*$/,
    password: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/
  }

  constructor() { }

  public validate(input, schema) {

    let errors = [];
    for (let key in schema) {

      if (input.hasOwnProperty(key) && input[key]) {

        if (typeof schema[key]['type'] === 'object') {

          if (Array.isArray(input[key])) {
            for (let item of input[key]) {
              errors = errors.concat(this.validate(item, schema[key]['type']));
            }
          } else {
            errors = errors.concat(this.validate(input[key], schema[key]['type']));
          }

        } else {

          if (schema[key]['type'] === (typeof input[key])) {

            if (['number', 'string', 'boolean'].indexOf(typeof input[key]) > -1) {
              errors = errors.concat(this._validateLeafNode(key, input[key], schema[key]));
            } else {
              errors.push({
                key: key,
                message: key + ' is not of a supported type'
              });
            }

          } else {

            if (Array.isArray(input[key])) {

              for (let item of input[key]) {
                errors = errors.concat(this._validateLeafNode(key, item, schema[key]));
              }

            } else {
              errors.push({
                key: key,
                message: key + ' does not match specified type.'
              });
            }

          }
        }

      } else {
        if (schema[key].hasOwnProperty('required') && schema[key]['required']) {
          errors.push({
            key: key,
            message: key + ' is required.'
          });
        }
      }
    }

    return errors;
  }

  private _validateLeafNode(key, input, schema) {

    let errors = [];

    if (schema.hasOwnProperty('minLength')) {
      if ((<string>input).length < schema['minLength']) {
        errors.push({ key: key, message: key + ' must be at least ' + schema['minLength'] + ' characters long.'});
      }
    }
    if (schema.hasOwnProperty('maxLength')) {
      if ((<string>input).length > schema['maxLength']) {
        errors.push({ key: key, message: key + ' cannot exceed ' + schema['maxLength'] + ' characters.'});
      }
    }
    if (schema.hasOwnProperty('isAlpha') && schema['isAlpha']) {
      if (!this.regex.alpha.test(input)) {
        errors.push({ key: key, message: key + ' can only contain letters.' });
      }
    }
    if (schema.hasOwnProperty('isAlphaNumeric') && schema['isAlphaNumeric']) {
      if (!this.regex.alphaNumeric.test(input)) {
        errors.push({ key: key, message: key + ' can only contain letters and numbers.' });
      }
    }
    if (schema.hasOwnProperty('isAlphaNumericSpaces') && schema['isAlphaNumericSpaces']) {
      if (!this.regex.alphaNumericSpaces.test(input)) {
        errors.push({ key: key, message: key + ' can only contain letters, numbers and spaces.' });
      }
    }
    if (schema.hasOwnProperty('isCommonWriting') && schema['isCommonWriting']) {
      if (!this.regex.commonWriting.test(input)) {
        errors.push({ key: key, message: key + ' can only contain letters, numbers, spaces and punctuation.' });
      }
    }
    if (schema.hasOwnProperty('isEmail') && schema['isEmail']) {
      if (!this.regex.email.test(input)) {
        errors.push({ key: key, message: key + ' must be a valid email.' });
      }
    }
    if (schema.hasOwnProperty('isPassword') && schema['isPassword']) {
      if (!this.regex.password.test(input)) {
        errors.push({ key: key, message: key + ' must contain at least one lowercase and uppercase letter, number, and special character.' });
      }
    }
    if (schema.hasOwnProperty('regex')) {
      if (!(<RegExp>schema['regex']).test(input)) {
        errors.push({ key: key, message: key + ' does not match format.' });
      }
    }
    if (schema.hasOwnProperty('min')) {
      if (input < schema['min']) {
        errors.push({ key: key, message: key + ' must be at least ' + schema['min'] + '.'});
      }
    }
    if (schema.hasOwnProperty('max')) {
      if (input > schema['max']) {
        errors.push({ key: key, message: key + ' cannot exceed ' + schema['max'] + '.'});
      }
    }
    return errors;
  }
}