import axios from 'axios';
import { 
  BASE_URL
} from 'env';
import { buildHeaders, buildFileUploadHeaders } from '../helpers/AppHelper';

export const fetchRepaymentRate = (id, args) => {
  return axios.get(
    `${BASE_URL}/api/repayment_rates/${id}`,
    {
      headers: buildHeaders()
    }
  )
}
