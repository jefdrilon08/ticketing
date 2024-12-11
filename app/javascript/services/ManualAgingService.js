import axios from 'axios';
import { 
  BASE_URL
} from 'env';
import { buildHeaders, buildFileUploadHeaders } from '../helpers/AppHelper';

export const fetchManualAging = (id, args) => {
  return axios.get(
    `${BASE_URL}/api/manual_aging/${id}`,
    {
      headers: buildHeaders()
    }
  )
}
