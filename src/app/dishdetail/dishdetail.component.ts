import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 5;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = 1;
  value = 0;
  vertical = true;
  tickInterval = 1;

  commentForm: FormGroup;
  comment: Comment;

  @ViewChild('fform') commentFormDirective: NgForm;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be at least 2 character long.',
      'maxlength': 'Author Name cannot be more than 25 characters long. '
    },

    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 1 character long. '
    }
  };



  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;


  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 

this.createForm();
}

  ngOnInit(): void {
    

    
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];

  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
        author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['',[Validators.required, Validators.minLength(1)] ],
        rating: '',
        date: ''
      
    });
        this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages 
  }

  // This method is or the onValueChanged
  onValueChanged(data?: any) {
    // Checking if the feedbackForm has not been created on the method called tshould return without anything
    if (!this.commentForm) { return; }
    // Defining a constant of feedBackForm
    const form = this.commentForm;
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
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      comment: '',
      date: '',
      rating: 5

      
    });
    this.commentFormDirective.resetForm();
  }



}
