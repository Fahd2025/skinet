import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {

  @ViewChild('input', { static: true }) input: ElementRef | undefined;
  @Input() type = 'text';
  @Input() label = '';  
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    if (control) {
      const validator = control.validator ? [control.validator] : [];
      const asyncValidator = control.asyncValidator ? [control.asyncValidator] : [];
      control.setValidators(validator);
      control.setAsyncValidators(asyncValidator);
      control.updateValueAndValidity();
    }
  }

  initialOnChange(event: any)
  {
    if(event){
      const value = (<HTMLInputElement>event).value;
      this.onChange(value);
    }  
  }

  writeValue(obj: any): void {
    if (this.input) {
      this.input.nativeElement.value = obj || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
