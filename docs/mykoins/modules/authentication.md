# MyKoins Authentication API

## Overview

Login using a member's username and password. A member account must meet the follwing criteria:
* `status` should be `active`
* `username` is based on the `identification_number`
* `password_hash` is not null

## Technical Documentation

### URL Endpoint

**`POST /api/members/login`**

### Required Parameters

1. `username`: Username of the member
2. `password`: Password of the member

### Valid Response

Returns the token of the user

```
{
    "token": "jwt-token",
    "member": {
        "username": "x",
        "first_name": "x",
        "middle_name": "x",
        "last_name": "x",
        "full_name": "x",
        "identification_number": "x",
        "branch": "x",
        "center": "x"
    }
}
```
