import {functions} from '../firebase';

export const sendContactForm = functions.httpsCallable('sendContactForm');
