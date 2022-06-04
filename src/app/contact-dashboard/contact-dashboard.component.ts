import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../shared/api.service';
import {ContactModel} from './contact-dash board.model';
import {LoaderService} from '../shared/loader/loader.service';

@Component({
  selector: 'app-contact-dashboard',
  templateUrl: './contact-dashboard.component.html',
  styleUrls: ['./contact-dashboard.component.css']
})
export class ContactDashboardComponent implements OnInit {

  formValue !: FormGroup;
  contactModelObj: ContactModel = new ContactModel();
  contactObj: ContactModel [] = [];
  showAdd !: boolean;
  showUpdate !: boolean;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,public loaderService: LoaderService,
              private api: ApiService) {
  }

  ngOnInit(): void {
    // this.loading = true;
    // this.api.getContact().subscribe(data => {
    //   // set the status of loading to false so the template can update
    //   this.loading = false;
    //   console.log("Remote Data:" + JSON.stringify(data));
    //   //console.log(data);
    // });
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      salary: [''],
    })
    this.getAllContact();
  }

  clickAddContact() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postContactDetails() {
    this.contactModelObj.firstName = this.formValue.value.firstName;
    this.contactModelObj.lastName = this.formValue.value.lastName;
    // this.contactModelObj.email = this.formValue.value.email;
    this.contactModelObj.mobile = this.formValue.value.mobile;
    this.contactModelObj.salary = this.formValue.value.salary;


    this.api.postContact(this.contactModelObj)
      .subscribe(res => {
          console.log(res);
          const data = this.contactObj.find(spec => spec.email === res.email)
          if (data) {
            alert("Email has already exists!")
            return;
          } else {
            alert("Contact added successfully!")
            let ref = document.getElementById('cancel')
            ref?.click();
            this.formValue.reset();
            this.getAllContact();
          }
        },
        err => {
          alert("Something went wrong!");
        })
  }

  getAllContact() {
    this.api.getContact()
      .subscribe(res => {
        this.contactObj = res;
      })
  }


  deleteContact(data: any) {
    this.api.deleteContact(data.id)
      .subscribe(res => {
        this.getAllContact();
        window.location.reload();
      })
  }

  onEdiContact(data: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.contactModelObj.id = data.id;
    this.formValue.controls['firstName'].setValue(data.firstName);
    this.formValue.controls['lastName'].setValue(data.lastName);
    // this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['salary'].setValue(data.salary);
  }

  updateContactDetails() {
    this.contactModelObj.firstName = this.formValue.value.firstName;
    this.contactModelObj.lastName = this.formValue.value.lastName;
    // this.contactModelObj.email = this.formValue.value.email;
    this.contactModelObj.mobile = this.formValue.value.mobile;
    this.contactModelObj.salary = this.formValue.value.salary;

    this.api.updateContact(this.contactModelObj, this.contactModelObj.id)
      .subscribe(res => {
        // const data = this.contactObj.find(spec => spec.email === res.email)
        // if (data) {
        //   alert("Email has already exists!")
        //   return;
        // } else {
          alert("Updated successfully!");
          let ref = document.getElementById('cancel')
          ref?.click();
          this.formValue.reset();
          this.getAllContact();
      })
  }


}
