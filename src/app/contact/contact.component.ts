import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ContactType, Feedback } from '../shared/feedback';
import { flyInOut } from '../animations/app.animation';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {

  
//  declaring feedback variable to FormGroup which is the form model
  feedbackForm: FormGroup;
  // declare the data model
  feedback: Feedback;
  // declare  contactType variable which is of the contactType string array
  contactType = ContactType;

  // With this, the form allow the form to be reset to its prestine value
  @ViewChild('fform') feedbackFormDirective: NgForm;
  
  // This formErrors object contain all errors in the form
  formErrors = {
    'firstname':'',
    'lastname': '',
    'telnum': '',
    'email': ''
  
  };

   validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  // inject the FormBuilder into the constructor
  constructor(private fb: FormBuilder) {
    // create a method createForm this will be invoked when the FormBuilder class is built the form will be created
    this.createForm();
   }

  ngOnInit(): void {
  }

// Adding validators
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname:  ['', [Validators.required,  Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]], 
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages 
  }

// This method is or the onValueChanged
  onValueChanged(data?: any) {
    // Checking if the feedbackForm has not been created on the method called tshould return without anything
    if (!this.feedbackForm) { return; }
    // Defining a constant of feedBackForm
    const form = this.feedbackForm;
    // Checking errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        // if each fiels is not field or dirty
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  

                                  

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    // Reseting form after form is bieng submitted
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contactype: 'None',
      message: ''

    });
    this.feedbackFormDirective.resetForm();
  }

}
