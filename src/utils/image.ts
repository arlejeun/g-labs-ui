//const gravatar = require('gravatar');

import * as gravatar from 'gravatar'

export const getAvatarUrl = (email: string) => {
  return gravatar.url(email, {s: '200', r: 'pg', d: 'robohash'})
}
