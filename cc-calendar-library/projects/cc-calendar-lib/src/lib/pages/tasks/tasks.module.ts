import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing.module';

import { AntDesignModule } from '../../ant-design.module';
import { CreateTaskComponent } from './create-task/create-task.component';

@NgModule({
  declarations: [CreateTaskComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    AntDesignModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[CreateTaskComponent],
  providers:[DatePipe]
})
export class TasksModule {}
