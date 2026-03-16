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

export async function importImageFromRemoteUrl({ imageUrl, publicId }) {
  const { cloudName, apiKey, apiSecret, folder } = getCloudinaryConfig()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured yet.')
  }

  const body = new URLSearchParams({
    file: imageUrl,
    folder,
    public_id: publicId,
  })

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error?.message || 'Unable to import image into Cloudinary.')
  }

  return payload
}
