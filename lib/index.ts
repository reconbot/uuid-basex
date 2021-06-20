import {v4 as uuidv4, V4Options } from 'uuid'
import baseX, { BaseConverter } from 'base-x'

const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

// borrowed from nanoid https://github.com/ai/nanoid/blob/307a1e0b651b8931e3f212a6f1be96baea62fe1e/url-alphabet/index.js
const baseURLSafe = baseX('ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW')

const UUID_LENGTH = 128 / 8 * 2 // hex encoding is 2 characters for every byte

export class UUIDX {
  public base: baseX.BaseConverter

  static base62(): UUIDX {
    return new UUIDX(base62)
  }

  static urlSafe(): UUIDX {
    return new UUIDX(baseURLSafe)
  }

  constructor(alphabet: string | BaseConverter) {
    this.base = typeof alphabet === 'string' ? baseX(alphabet) : alphabet
  }

  v4(options?: V4Options): string {
    const uuid = uuidv4(options, Buffer.alloc(16))
    return this.base.encode(uuid)
  }

  toUUID(input: string): string {
    const res = this.decode(input)
    if (res.length !== 16) {
      throw new Error('Invalid encoded UUID')
    }
    const hex = res.toString('hex')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  fromUUID(input: string): string {
    const data = Buffer.from(input.replace(/-/g, ''), 'hex')
    if (data.length !== 16) {
      throw new Error('Invalid UUID')
    }
    return this.base.encode(data)
  }

  private decode(input: string): Buffer {
    try {
      return this.base.decode(input)
    } catch (error) {
      if (error instanceof Error && error.message?.slice(0, 8) === 'Non-base') {
        throw new Error('Invalid encoded UUID')
      }
      throw error
    }
  }
}