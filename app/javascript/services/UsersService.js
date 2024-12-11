import axios from 'axios';
import { 
  BASE_URL
} from 'env';
import { buildHeaders, buildFileUploadHeaders } from '../helpers/AppHelper';

export const fetchUserBranches = (id) => {
  return axios.get(
    `${BASE_URL}/api/v3/user_branches/${id}/fetch`,
    {
      headers: buildFileUploadHeaders()
    }
  )
}

export const toggleUserBranch = (id) => {
  return axios.post(
    `${BASE_URL}/api/v3/user_branches/toggle`,
    {
      id: id
    },
    {
      headers: buildFileUploadHeaders()
    }
  )
}

export const deleteUser = (id) => {
  return axios.delete(
    `${BASE_URL}/api/v3/users/${id}`,
    {
      headers: buildFileUploadHeaders()
    }
  )
}

export const fetchUsers = (args) => {
  return axios.get(
    `${BASE_URL}/api/v3/users`,
    {
      params: args,
      headers: buildHeaders()
    }
  )
}

export const fetchUser = (id) => {
  return axios.get(
    `${BASE_URL}/api/v3/users/${id}`,
    {
      headers: buildHeaders()
    }
  )
}

export const saveUser = (args) => {
  console.log(args);
  let formData = new FormData();

  formData.append("first_name", args.first_name);
  formData.append("last_name", args.last_name);
  formData.append("username", args.username);
  formData.append("identification_number", args.identification_number);
  formData.append("email", args.email);
  formData.append("roles", args.roles);
  formData.append("incentivized_date", args.incentivized_date);
  formData.append("password", args.password);
  formData.append("password_confirmation", args.password_confirmation);

  if (args.is_regular) {
    formData.append("is_regular", true);
  }

  if (args.profile_picture) {
    formData.append("profile_picture", args.profile_picture);
  }

  if (args.id) {
    return axios.put(
      `${BASE_URL}/api/v3/users/${args.id}`,
      formData,
      {
        headers: buildFileUploadHeaders()
      }
    )
  } else {
    return axios.post(
      `${BASE_URL}/api/v3/users`,
      formData,
      {
        headers: buildFileUploadHeaders()
      }
    )
  }
}

export const forgotPassword = (args) => {
  return axios.post(
    `${BASE_URL}/api/forgot_password`,
    args
  )
}
