import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { NzModalRef, UploadFile, NzMessageService } from 'ng-zorro-antd';

import { Course } from 'src/app/models/course';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Observable, Observer } from 'rxjs';
import { CourseService } from '../../../../services/course.service';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',

  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {
  currentUser: User = this.userService.getUser();
  validateForm: FormGroup;
  fileList: UploadFile[] = [];
  course: Course;
  allTeachers: User[];

  @Input() course_id: number;
  @Input() setType: string;
  // 用于更新课程以后回显重刷新操作
  @Output() change = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private userService: UserService,
    private msg: NzMessageService,
    private courseService: CourseService,
    private adminService: AdminService
  ) {
    this.validateForm = this.fb.group({
      c_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      point: ['', [Validators.required]],
      t_id: ['', [Validators.required]],
      image: ['', [this.uploadValidator]],
    });
  }

  // 和新建项目类似，需要先判断调用模块时的方式
  ngOnInit(): void {
    this.adminService.getAllTeachers().subscribe((data) => {
      this.allTeachers = data.data;
    });
    if (this.setType == 'edit') {
      this.courseService.getCourse(this.course_id).subscribe((data) => {
        this.course = data.data.course;
        this.userService
          .getUserById(String(this.course.t_id))
          .subscribe((data) => {
            this.currentUser = data.data.user;
            this.validateForm.controls.t_id.updateValueAndValidity();
          });

        this.validateForm.controls.c_name.setValue(this.course.c_name);
        this.validateForm.controls.description.setValue(
          this.course.description
        );
        this.validateForm.controls.point.setValue(this.course.point);
        this.validateForm.controls.image.setValidators([]);
        this.validateForm.controls.t_id.setValue(this.currentUser.u_id);
        for (const key in this.validateForm.controls) {
          this.validateForm.controls[key].updateValueAndValidity();
        }
      });
    } else {
      // 如果是老师，限定不能修改任课教师
      if (this.currentUser.type == 'teacher') {
        this.validateForm.controls.t_id.setValue(this.currentUser.u_id);
        this.validateForm.controls.t_id.updateValueAndValidity();
      }
    }
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(value: Course): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    // 提交时，根据传入的调用方式使用不同的后端api进行操作
    if (this.setType == 'edit') {
      this.course = {
        c_id: this.course.c_id,
        c_name: this.validateForm.controls.c_name.value,
        description: this.validateForm.controls.description.value,
        t_id: this.validateForm.controls.t_id.value,
        point: this.validateForm.controls.point.value,
        status: 1,
        image_URL: this.course.image_URL,
      };
      if (this.fileList.length < 1) {
        this.courseService.changeCourse(this.course).subscribe((data: any) => {
          if (data.code == 200) {
            this.msg.success('编辑课程成功！');
            this.change.emit();
            this.modal.destroy(1);
          } else {
            this.msg.error('编辑课程失败!');
          }
        });
      } else {
        // 修改课程封面时涉及到上传文件，所以需要单独使用api进行操作
        this.courseService
          .changeCourseWithImg(this.course, this.fileList[0])
          .subscribe((data: any) => {
            if (data.body.code == 200) {
              this.msg.success('编辑课程成功！');
              this.change.emit();
              this.modal.destroy(1);
            } else {
              this.msg.error('编辑课程失败!');
            }
          });
      }
    } else {
      this.course = {
        c_id: null,
        c_name: this.validateForm.controls.c_name.value,
        description: this.validateForm.controls.description.value,
        t_id: this.validateForm.controls.t_id.value,
        point: this.validateForm.controls.point.value,
        status: 1,
        image_URL: null,
      };

      this.courseService
        .createCourse(this.course, this.fileList[0])
        .subscribe((data: any) => {
          console.log(data.body);
          if (data.body.code == 200) {
            this.msg.success('新建课程成功！');
            this.modal.destroy(1);
          } else {
            this.msg.error('新建课程失败!');
          }
        });
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    if (this.currentUser.type == 'teacher') {
      this.validateForm.controls.t_id.setValue(this.currentUser.u_id);
      this.validateForm.controls.t_id.updateValueAndValidity();
    }
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.fileList = [];
  }

  // 移除上传的图片时需要情况image并且重新检查，防止无图片提交
  Remove = (file: UploadFile): boolean => {
    this.fileList = [];
    this.validateForm.controls.image.setValue(null);
    this.validateForm.controls.image.updateValueAndValidity();
    return true;
  }

  // 限定文件上传大小
  beforeUpload = (file: UploadFile): boolean => {
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('图片必须小于2MB!');
      return false;
    }

    this.fileList = [file];
    this.validateForm.controls.image.setValue(1);
    this.validateForm.controls.image.updateValueAndValidity();
    return false;
  }

  uploadValidator = (control: FormControl): { [s: string]: boolean } => {
    if (this.fileList.length < 1 || !control.value) {
      return { error: true, required: true };
    }
    return {};
  }
}
