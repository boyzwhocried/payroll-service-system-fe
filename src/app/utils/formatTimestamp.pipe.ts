import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatTimestamp',
    standalone: true,
})
export class FormatTimestampPipe implements PipeTransform {
    transform(value: string): string {
        const messageDate = new Date(value);
        const today = new Date();

        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
}
