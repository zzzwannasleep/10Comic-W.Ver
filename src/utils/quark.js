import {
  listPanDirectoryFolders,
  parsePanShareInput,
  parsePanShareLine,
  transferPanShare,
  verifyPanCookie
} from '@/utils/pan'

export const parseQuarkShareLine = (line = '') => {
  return parsePanShareLine('quark', line)
}

export const parseQuarkShareInput = (text = '') => {
  return parsePanShareInput('quark', text)
}

export const verifyQuarkCookie = async(cookie) => {
  return verifyPanCookie('quark', cookie)
}

export const listQuarkDirectoryFolders = async(cookie, pdirFid = '0') => {
  return listPanDirectoryFolders('quark', cookie, pdirFid)
}

export const transferQuarkShare = async(options = {}) => {
  return transferPanShare({
    ...options,
    providerKey: 'quark'
  })
}
