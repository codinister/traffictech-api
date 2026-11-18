import { z } from 'zod';

export default z.object({
  firstname: z.string().min(1, 'First name required!'),
  lastname: z.string().min(1, 'Last name required!'),
  email: z.string().min(3, 'Email required!'),
  password: z.string().min(6, 'Password should be more than 5 characters'),
  phone: z.string().min(10, 'valid phone required!'),
});
