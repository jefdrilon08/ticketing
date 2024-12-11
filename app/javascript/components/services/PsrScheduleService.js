import axios from 'axios';

export const generate = (args, token) => {
  return axios.post(
    '/api/psr_schedules/generate',
    args,
    {
      headers: {
        'X-KOINS-ACCESS-TOKEN': token
      }
    }
  )
}
