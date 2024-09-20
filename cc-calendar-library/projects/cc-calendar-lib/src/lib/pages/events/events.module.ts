import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateEventComponent } from './create-event/create-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../../ant-design.module';

@NgModule({
  declarations: [CreateEventComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AntDesignModule],
  providers: [DatePipe],
  exports: [CreateEventComponent],
})
export class EventsModule {}
