import { getToken, getCurrentUser } from '../services/AuthService';

export const initPages = (page, offset=5, numPages) => {
  let _pages = [];

  let startPage = page;

  if (page - offset <= 0) {
    startPage = 1;
  } else {
    startPage = page - offset;
  }

  let endPage = page + offset;

  if (endPage > numPages) {
    endPage = numPages;
  }

  for (var i = startPage; i <= endPage; i++) {
    _pages.push(i);
  }

  return _pages;
}

export const buildHeaders = (args) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

export const buildFileUploadHeaders = (args) => {
  return {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${getToken()}`
  }
}

export const hasFormError = (errors, key) => {
  return errors[key] && errors[key].length > 0
}
