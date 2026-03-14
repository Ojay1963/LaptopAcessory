import crypto from 'crypto'
import { env } from './env.js'

export function getCloudinaryConfig() {
  return {
    cloudName: env.cloudinaryCloudName,
    apiKey: env.cloudinaryApiKey,
    apiSecret: env.cloudinaryApiSecret,
    folder: env.cloudinaryFolder || 'oj-devices',
  }
}

export function isCloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()
  return Boolean(cloudName && apiKey && apiSecret)
}

export function createCloudinarySignature({ folder, timestamp, publicId }) {
  const { apiSecret } = getCloudinaryConfig()
  const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  return crypto.createHash('sha1').update(signatureBase).digest('hex')
}

export function buildSignedUploadPayload({ publicId }) {
  const { cloudName, apiKey, folder } = getCloudinaryConfig()
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = createCloudinarySignature({
    folder,
    timestamp,
    publicId,
  })

  return {
    cloudName,
    apiKey,
    folder,
    timestamp,
    publicId,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  }
}
