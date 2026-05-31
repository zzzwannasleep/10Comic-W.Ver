// ==UserScript==
// @name         10图漫
// @namespace    http://tampermonkey2.net/
<<<<<<< HEAD
// @version      2.0.12.20260531073304
// @build        20260531073304
=======
// @version      2.0.12.20260531070138
// @build        20260531070138
>>>>>>> ef7c7d419c525092f41e999e15e97985a9706330
// @description  Multi-site comic search and chapter download userscript.
// @author       journey3510
// @homepageURL  https://github.com/zzzwannasleep/10Comic-W.Ver
// @supportURL   https://github.com/zzzwannasleep/10Comic-W.Ver/issues
// @updateURL    https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.meta.js
// @downloadURL  https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.user.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        unsafeWindow
// @resource   vantcss   https://unpkg.com/vant@2.12/lib/index.css
// @require      https://unpkg.com/vue@2.6.12/dist/vue.min.js
// @require      https://unpkg.com/vant@2.12/lib/vant.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
//
// @license      GPLv3
// @include      *
// @connect      *
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9742:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 8764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(9742)
const ieee754 = __webpack_require__(645)
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ 8217:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".van-cell__title {\n  text-align: left;\n}\n.van-cell-group__title--inset {\n  text-align: left;\n}\n.van-button--default {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled {\n  opacity: 1 !important;\n}\n.van-tag--default {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow {\n  color: #d9d9d9 !important;\n}\n.van-popover__content {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n.van-cell__title {\n  text-align: left;\n}\n.van-cell-group__title--inset {\n  text-align: left;\n}\n.van-button--default {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled {\n  opacity: 1 !important;\n}\n.van-tag--default {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow {\n  color: #d9d9d9 !important;\n}\n.van-popover__content {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 2213:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".yi-ling-app * {\n  font-size: 14px ;\n}\n.yi-ling-app .app-container {\n  background-color: #f8f8f8;\n  padding: 10px;\n}\n.yi-ling-app ::-webkit-scrollbar {\n  width: 4px;\n  height: 5px;\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.yi-ling-app ::-webkit-scrollbar-track-piece {\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.yi-ling-app ::-webkit-scrollbar-thumb:vertical {\n  height: 5px;\n  background-color: #66ccff88;\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.yi-ling-app ::-webkit-scrollbar-thumb:horizontal {\n  width: 4px;\n  background-color: rgba(144, 147, 153, 0.5);\n  border-radius: 15px;\n  -webkit-border-radius: 15px;\n}\n.van-cell__title {\n  text-align: left;\n}\n.van-cell-group__title--inset {\n  text-align: left;\n}\n.van-button--default {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled {\n  opacity: 1 !important;\n}\n.van-tag--default {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow {\n  color: #d9d9d9 !important;\n}\n.van-popover__content {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 4871:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*[data-v-5ef48958] {\n  margin: 0;\n  padding: 0;\n}\n.custom-indicator[data-v-5ef48958] {\n  position: absolute;\n  height: 700px;\n  right: 5px;\n  bottom: 5px;\n  padding: 2px 5px;\n  font-size: 14px;\n  background: rgba(0, 0, 0, 0.1);\n}\n#thebtn[data-v-5ef48958] {\n  position: fixed;\n  top: 150px;\n  right: 600px;\n  z-index: 999999 !important;\n}\n.van-cell__title[data-v-5ef48958] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-5ef48958] {\n  text-align: left;\n}\n.van-button--default[data-v-5ef48958] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-5ef48958] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-5ef48958] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-5ef48958] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-5ef48958] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-5ef48958] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-5ef48958] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3502:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".yi-ling-app[data-v-5ef48958] {\n  position: fixed;\n  z-index: 100000;\n}\n.yi-ling-app #app-right[data-v-5ef48958] {\n  height: 800px;\n  width: 420px;\n  position: fixed;\n  right: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  transform-origin: right top;\n  z-index: 999999 !important;\n}\n.card[data-v-5ef48958] {\n  background-color: #f8f8f8;\n  border: solid 1px #66ccffee;\n  border-radius: 25px;\n  transition: all 0.5s;\n  box-shadow: 2px 3px 3px 2px #66ccff55;\n}\n.card #border-top-set[data-v-5ef48958] {\n  border-top-left-radius: 25px;\n  border-top-right-radius: 25px;\n  overflow: hidden;\n}\n.card #border-bottom-set[data-v-5ef48958] {\n  border-bottom-left-radius: 25px;\n  border-bottom-right-radius: 25px;\n  overflow: hidden;\n}\n.card .swipeitem[data-v-5ef48958] {\n  height: 697px;\n  padding-bottom: 5px;\n}\n.card__btn[data-v-5ef48958] {\n  transition: all 0.5s;\n  border-radius: 30px 0 0 30px;\n  width: 30px;\n  height: 60px;\n  background-color: #66ccff96;\n  cursor: pointer;\n  position: absolute;\n  right: 100%;\n  top: 50%;\n  text-align: center;\n}\n.card__btn svg[data-v-5ef48958] {\n  height: 20px;\n  width: 20px;\n  position: absolute;\n  right: 5px;\n  top: 20px;\n  transition: all 0.5s;\n  color: #ee000088;\n}\n.card--hide[data-v-5ef48958] {\n  transform: translate(100%, -50%) !important;\n}\n.card--hide .card__btn svg[data-v-5ef48958] {\n  transform: rotate(180deg);\n}\n.test[data-v-5ef48958] {\n  position: absolute;\n  position: relative;\n  cursor: default;\n  height: 600px;\n}\n.van-cell__title[data-v-5ef48958] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-5ef48958] {\n  text-align: left;\n}\n.van-button--default[data-v-5ef48958] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-5ef48958] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-5ef48958] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-5ef48958] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-5ef48958] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-5ef48958] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-5ef48958] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 9322:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".import-page[data-v-3e5333e4] {\n  display: flex;\n  flex-direction: column;\n  margin-top: 5px;\n  height: 620px;\n  max-height: 620px;\n  justify-content: space-between;\n}\n.import-page #codeTextarea[data-v-3e5333e4] {\n  border-color: #66ccff88;\n  border-radius: 8px;\n  padding: 2px;\n}\n.van-cell__title[data-v-3e5333e4] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-3e5333e4] {\n  text-align: left;\n}\n.van-button--default[data-v-3e5333e4] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-3e5333e4] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-3e5333e4] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-3e5333e4] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-3e5333e4] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-3e5333e4] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-3e5333e4] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3655:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#search-page[data-v-4ad41bb8] {\n  width: 1100px;\n  height: 600px;\n  max-height: 600px;\n  overflow: hidden;\n  position: fixed;\n  top: 50%;\n  left: 40%;\n  transform: translate(-50%, -50%);\n  border: 1px solid #ee000066;\n  border-radius: 15px;\n  box-shadow: 2px 4px 4px 2px #ee000022;\n  background-color: #fff;\n  z-index: 9999999;\n}\n#search-page #search-page-top[data-v-4ad41bb8] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 5px;\n  border-bottom: 1px solid #66ccff88;\n}\n#search-page #search-page-top .search-input-btn[data-v-4ad41bb8] {\n  margin-left: 400px;\n  margin-top: 10px;\n  width: 320px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#search-page #search-page-top .search-input-btn input[data-v-4ad41bb8] {\n  border: 1px solid #66ccff88;\n  height: 20px;\n  width: 200px;\n  border-radius: 5px;\n  background: #fff;\n  font-size: 15px;\n  line-height: 20px;\n  padding-left: 15px;\n}\n#search-page #search-page-top .search-input-btn[data-v-4ad41bb8] .van-button--small {\n  height: 25px;\n}\n#search-page #search-page-top #close-search-btn[data-v-4ad41bb8] {\n  color: #66ccff88;\n  display: flex;\n  margin-top: 2px;\n  font-size: 40px;\n  height: 40px;\n  background-color: #fff;\n  border-radius: 20px;\n  margin-top: 5px;\n  margin-right: 5px;\n}\n#search-page #search-page-top #close-search-btn[data-v-4ad41bb8]:hover {\n  color: red;\n  transform: rotate(180deg);\n  transition: all 1s;\n}\n#search-page #search-page-bottom[data-v-4ad41bb8] {\n  height: 530px;\n  max-height: 530px;\n  overflow-y: scroll;\n}\n#search-page #search-page-bottom .origin-image-list[data-v-4ad41bb8] {\n  display: flex;\n  width: 120px;\n  flex-direction: row;\n  display: inline-block;\n  text-align: center;\n  cursor: pointer;\n  margin: 2px;\n  padding: 1px;\n}\n#search-page #search-page-bottom .origin-image-list p[data-v-4ad41bb8] {\n  overflow: hidden;\n  white-space: nowrap;\n}\n#search-page #search-page-bottom .origin-image-list[data-v-4ad41bb8]:hover {\n  border: 2px solid #66ccff88;\n}\n.van-cell__title[data-v-4ad41bb8] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-4ad41bb8] {\n  text-align: left;\n}\n.van-button--default[data-v-4ad41bb8] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-4ad41bb8] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-4ad41bb8] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-4ad41bb8] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-4ad41bb8] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-4ad41bb8] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-4ad41bb8] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 2139:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".cover-page[data-v-5204468d] {\n  margin: 15px;\n  max-height: 680px;\n  overflow: auto;\n}\n.cover-hint[data-v-5204468d] {\n  color: #999;\n  font-size: 13px;\n}\n.cover-card[data-v-5204468d] {\n  margin-top: 12px;\n  padding: 12px;\n  background: #fff;\n  border-radius: 14px;\n}\n.cover-title[data-v-5204468d] {\n  margin-bottom: 10px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n.cover-desc[data-v-5204468d] {\n  color: #666;\n  font-size: 13px;\n  line-height: 1.6;\n}\n.cover-actions[data-v-5204468d] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.cover-preview[data-v-5204468d] {\n  display: block;\n  max-width: 220px;\n  max-height: 280px;\n  width: auto;\n  height: auto;\n  margin-top: 10px;\n  border-radius: 10px;\n  border: 1px solid #eee;\n}\n.cover-file-input[data-v-5204468d] {\n  display: none;\n}\n.chapter-grid[data-v-5204468d] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px;\n}\n.chapter-thumb[data-v-5204468d] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 6px;\n  border: 1px solid #e5e5e5;\n  border-radius: 10px;\n  background: #fff;\n  cursor: pointer;\n}\n.chapter-thumb img[data-v-5204468d] {\n  width: 100%;\n  height: 120px;\n  object-fit: cover;\n  border-radius: 8px;\n}\n.chapter-thumb span[data-v-5204468d] {\n  color: #666;\n  font-size: 12px;\n}\n.chapter-thumb--active[data-v-5204468d] {\n  border-color: #1989fa;\n  box-shadow: 0 0 0 1px #1989fa inset;\n}\n.cover-bottom[data-v-5204468d] {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n.van-cell__title[data-v-5204468d] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-5204468d] {\n  text-align: left;\n}\n.van-button--default[data-v-5204468d] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-5204468d] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-5204468d] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-5204468d] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-5204468d] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-5204468d] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-5204468d] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3240:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#downcontext[data-v-1e855a88] {\n  margin: 15px 15px;\n  max-height: 680px;\n  border-radius: 15px;\n  overflow: auto;\n}\n.comicnametag1[data-v-1e855a88] {\n  margin-left: 10px ;\n  height: 15px;\n  margin-top: 4px;\n  display: inline-block;\n  max-width: 200px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  background-color: #ee000088 !important;\n}\n#downlist[data-v-1e855a88] {\n  margin: 10px 5px;\n  padding: 5px 0px;\n  border-radius: 15px;\n  width: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  max-height: 500px;\n}\n#downlist .downitem[data-v-1e855a88] {\n  display: flex;\n  flex-direction: column;\n  width: 98%;\n}\n#downlist .downitem .itemname[data-v-1e855a88] {\n  display: flex;\n  justify-content: space-between;\n  margin: 2px 5px;\n}\n#downlist .downitem .itemname .comicnametag[data-v-1e855a88] {\n  display: inline-block;\n  width: 60px;\n  max-width: 60px;\n  text-align: center;\n  height: 18px;\n  line-height: 18px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  cursor: pointer;\n}\n#downlist .downitem .itemname .chapterspan[data-v-1e855a88] {\n  display: inline-block;\n  margin-left: 10px;\n  max-width: 200px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n#downlist .downitem .itemname .hasError[data-v-1e855a88] {\n  color: red;\n}\n.van-cell__title[data-v-1e855a88] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-1e855a88] {\n  text-align: left;\n}\n.van-button--default[data-v-1e855a88] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-1e855a88] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-1e855a88] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-1e855a88] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-1e855a88] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-1e855a88] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-1e855a88] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 386:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".follow-page[data-v-2da631cb] {\n  margin: 15px;\n  max-height: 680px;\n  overflow: auto;\n}\n.follow-page .follow-toolbar[data-v-2da631cb] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.follow-page .follow-keyword-toolbar[data-v-2da631cb] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 12px;\n  align-items: center;\n}\n.follow-page .follow-site-panel[data-v-2da631cb],\n.follow-page .follow-result-panel[data-v-2da631cb] {\n  padding: 12px;\n  margin-bottom: 12px;\n  background: #fff;\n  border-radius: 12px;\n}\n.follow-page .follow-panel-header[data-v-2da631cb] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 10px;\n  color: #333;\n  font-size: 14px;\n  font-weight: 600;\n}\n.follow-page .follow-site-actions[data-v-2da631cb] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-bottom: 10px;\n}\n.follow-page .follow-site-grid[data-v-2da631cb] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px 12px;\n}\n.follow-page .follow-site-check[data-v-2da631cb] {\n  margin: 0;\n}\n.follow-page .candidate-cell[data-v-2da631cb] .van-cell__title {\n  flex: 1;\n  min-width: 0;\n}\n.follow-page .candidate-actions[data-v-2da631cb] {\n  display: flex;\n  gap: 6px;\n}\n.follow-page .candidate-label[data-v-2da631cb] {\n  margin-top: 4px;\n  color: #666;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.follow-page .candidate-label--sub[data-v-2da631cb] {\n  font-size: 12px;\n}\n.follow-page .follow-hint[data-v-2da631cb] {\n  color: #999;\n  font-size: 13px;\n}\n.follow-page .follow-list[data-v-2da631cb] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.follow-page .follow-card[data-v-2da631cb] {\n  overflow: hidden;\n}\n.follow-page .pending-list[data-v-2da631cb] {\n  padding: 0 16px 8px;\n  color: #666;\n  font-size: 13px;\n}\n.follow-page .pending-item[data-v-2da631cb] {\n  margin-bottom: 4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.follow-page .follow-actions[data-v-2da631cb] {\n  display: flex;\n  gap: 8px;\n  padding: 0 16px 12px;\n  flex-wrap: wrap;\n}\n.van-cell__title[data-v-2da631cb] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-2da631cb] {\n  text-align: left;\n}\n.van-button--default[data-v-2da631cb] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-2da631cb] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-2da631cb] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-2da631cb] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-2da631cb] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-2da631cb] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-2da631cb] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 647:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".homeindex[data-v-7eb2bc79] {\n  margin-top: 12px;\n  overflow-y: auto;\n  max-height: 675px;\n  min-height: 600px;\n}\n.homeindex #selectId[data-v-7eb2bc79] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.homeindex #selectId[data-v-7eb2bc79] .van-collapse-item__wrapper {\n  position: absolute;\n  width: 100%;\n}\n.homeindex #selectId[data-v-7eb2bc79] .van-collapse-item__wrapper .van-collapse-item__content {\n  background-color: #eeeeee !important;\n  border-bottom-left-radius: 15px;\n  border-bottom-right-radius: 15px;\n}\n.homeindex #selectId[data-v-7eb2bc79] .van-collapse-item__wrapper .van-collapse-item__content div:hover {\n  color: red;\n}\n.homeindex #selectId #search-ico[data-v-7eb2bc79] {\n  cursor: pointer;\n  color: #ee000088;\n  margin-right: 15px;\n}\n.van-cell__title[data-v-7eb2bc79] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-7eb2bc79] {\n  text-align: left;\n}\n.van-button--default[data-v-7eb2bc79] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-7eb2bc79] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-7eb2bc79] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-7eb2bc79] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-7eb2bc79] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-7eb2bc79] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-7eb2bc79] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 757:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".metadata-page[data-v-78dd89c9] {\n  margin: 15px;\n  max-height: 680px;\n  overflow: auto;\n}\n.metadata-loading[data-v-78dd89c9] {\n  display: flex;\n  justify-content: center;\n  margin-top: 100px;\n}\n.metadata-hint[data-v-78dd89c9],\n.metadata-top__desc[data-v-78dd89c9],\n.metadata-preview-note[data-v-78dd89c9] {\n  color: #777;\n  font-size: 12px;\n  line-height: 1.6;\n}\n.metadata-empty-btn[data-v-78dd89c9] {\n  margin-top: 12px;\n}\n.metadata-top[data-v-78dd89c9] {\n  margin-bottom: 12px;\n}\n.metadata-top__title[data-v-78dd89c9] {\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n.metadata-group-title[data-v-78dd89c9] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  gap: 10px;\n}\n.metadata-group-title__main[data-v-78dd89c9] {\n  max-width: 240px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.metadata-card[data-v-78dd89c9] {\n  margin-top: 12px;\n  padding: 12px;\n  background: #fff;\n  border-radius: 12px;\n}\n.metadata-preview-stack[data-v-78dd89c9] {\n  padding-bottom: 8px;\n}\n.metadata-preview-title[data-v-78dd89c9] {\n  margin-bottom: 8px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n.metadata-preview[data-v-78dd89c9] {\n  margin-top: 10px;\n  padding: 10px;\n  border-radius: 10px;\n  background: #f5f7fa;\n  white-space: pre-wrap;\n  word-break: break-word;\n  font-size: 12px;\n  line-height: 1.5;\n  color: #333;\n}\n.metadata-bottom[data-v-78dd89c9] {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n.van-cell__title[data-v-78dd89c9] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-78dd89c9] {\n  text-align: left;\n}\n.van-button--default[data-v-78dd89c9] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-78dd89c9] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-78dd89c9] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-78dd89c9] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-78dd89c9] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-78dd89c9] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-78dd89c9] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 6018:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".pan-page[data-v-27ff97f3] {\n  margin: 15px;\n  max-height: 680px;\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.pan-card[data-v-27ff97f3] {\n  padding: 12px;\n  background: #fff;\n  border-radius: 14px;\n}\n.pan-card__title[data-v-27ff97f3] {\n  color: #333;\n  font-size: 15px;\n  font-weight: 600;\n}\n.pan-card__hint[data-v-27ff97f3] {\n  margin-top: 6px;\n  color: #666;\n  font-size: 12px;\n  line-height: 1.6;\n  white-space: pre-wrap;\n}\n.pan-actions[data-v-27ff97f3] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-top: 12px;\n}\n.pan-provider-group[data-v-27ff97f3] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-top: 12px;\n}\n.pan-provider-radio[data-v-27ff97f3] {\n  margin-right: 0;\n}\n.pan-inline-note[data-v-27ff97f3] {\n  margin-top: 10px;\n  color: #1989fa;\n  font-size: 12px;\n  line-height: 1.5;\n  word-break: break-all;\n}\n.pan-empty-hint[data-v-27ff97f3] {\n  margin-top: 10px;\n  color: #999;\n  font-size: 12px;\n  line-height: 1.6;\n}\n.pan-folder-list[data-v-27ff97f3] {\n  margin-top: 10px;\n}\n.pan-card--logs[data-v-27ff97f3] {\n  min-height: 180px;\n}\n.pan-log-list[data-v-27ff97f3] {\n  margin-top: 10px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.pan-log-item[data-v-27ff97f3] {\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: #f6f7fb;\n  color: #444;\n  font-size: 12px;\n  line-height: 1.5;\n  word-break: break-word;\n}\n.pan-log-item--success[data-v-27ff97f3] {\n  background: #eef8f2;\n  color: #1f8a4c;\n}\n.pan-log-item--error[data-v-27ff97f3] {\n  background: #fff1f0;\n  color: #cf3d34;\n}\n.pan-log-time[data-v-27ff97f3] {\n  margin-right: 8px;\n  color: inherit;\n  opacity: 0.75;\n}\n.pan-log-text[data-v-27ff97f3] {\n  color: inherit;\n}\n.van-cell__title[data-v-27ff97f3] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-27ff97f3] {\n  text-align: left;\n}\n.van-button--default[data-v-27ff97f3] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-27ff97f3] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-27ff97f3] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-27ff97f3] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-27ff97f3] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-27ff97f3] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-27ff97f3] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n.van-cell__title[data-v-27ff97f3] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-27ff97f3] {\n  text-align: left;\n}\n.van-button--default[data-v-27ff97f3] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-27ff97f3] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-27ff97f3] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-27ff97f3] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-27ff97f3] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-27ff97f3] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-27ff97f3] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 9082:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".setindex .swipeitem[data-v-234d1526] {\n  display: flex;\n  flex-direction: column;\n  margin: 20px 18px 15px 18px;\n  flex: 1;\n  height: 680px;\n  max-height: 680px;\n  justify-content: space-between;\n}\n.setindex .swipeitem #setup-return[data-v-234d1526] {\n  flex: 1;\n  margin-bottom: 15px;\n  cursor: pointer;\n  font-size: 17px;\n}\n.setindex .swipeitem #setup-return[data-v-234d1526]:hover {\n  color: #ee000088;\n}\n.setindex #setpart[data-v-234d1526] {\n  border-radius: 15px;\n  background-color: #ffffff;\n  overflow: auto;\n  width: 100%;\n}\n.setindex #setpart .van-cell-group__title[data-v-234d1526] {\n  color: #78a5ff;\n  font-size: 15px;\n}\n.setindex #setpart .van-cell[data-v-234d1526] {\n  width: 100%;\n  padding: 10px 1px;\n  overflow: visible !important;\n}\n.setindex #setpart .van-cell .van-cell__value[data-v-234d1526] {\n  overflow: visible !important;\n}\n.setindex #setpart .van-cell .cellleftvalue[data-v-234d1526] {\n  flex: 1;\n}\n.setindex #setpart .van-cell .cellrightvalue[data-v-234d1526] {\n  flex: 0.5 !important;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropbtn[data-v-234d1526] {\n  width: 90px;\n  background-color: #aadafb;\n  color: white;\n  padding: 2px 5px;\n  font-size: 16px;\n  border: none;\n  cursor: pointer;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropbtn[data-v-234d1526]:hover,\n.setindex #setpart .van-cell .cellrightvalue .dropbtn[data-v-234d1526]:focus {\n  background-color: #47b1f7;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown[data-v-234d1526] {\n  position: relative;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown-content[data-v-234d1526] {\n  position: absolute;\n  right: 0;\n  background-color: #fff;\n  min-width: 90px;\n  overflow: auto;\n  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n  z-index: 1;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown-content a[data-v-234d1526] {\n  color: black;\n  padding: 0px 2px;\n  text-decoration: none;\n  text-align: center;\n  display: block;\n}\n.setindex #setpart .van-cell .cellrightvalue .dropdown a[data-v-234d1526]:hover {\n  background-color: #ddd;\n}\n.setindex #setpart .van-cell .cellrightvalue .show[data-v-234d1526] {\n  display: block;\n}\n.setindex #setpart .van-cell .rightbutton[data-v-234d1526] {\n  flex-direction: row-reverse;\n}\n.setindex #setpart .van-cell .custom-title[data-v-234d1526] {\n  text-align: left;\n}\n.setindex #setpart .van-cell .img-down-range-input[data-v-234d1526] {\n  width: 40px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n}\n.setindex #setpart .van-cell .long-input[data-v-234d1526] {\n  width: 190px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n  padding: 0 8px;\n}\n.setindex #setpart .van-cell #max-splicing-height-input[data-v-234d1526] {\n  width: 80px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n}\n.setindex #setpart .van-cell #max-splicing-height-input[data-v-234d1526]::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n}\n.setindex #setpart .van-cell #max-splicing-height-input[data-v-234d1526]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n}\n.setindex #setpart .van-cell #hot-key-input[data-v-234d1526] {\n  width: 35px;\n  height: 18px;\n  margin-right: 2px;\n  border: 1px #66ccff solid;\n  border-radius: 10px;\n  text-align: center;\n  background: #fff;\n}\n.setindex #setpart .van-cell .rightslider[data-v-234d1526] {\n  margin: 10px 15px;\n  width: 120px;\n}\n.setindex #setpart .van-cell .rightslider .custom-button[data-v-234d1526] {\n  width: 20px;\n  color: #fff;\n  font-size: 14px;\n  line-height: 15px;\n  text-align: center;\n  background-color: #ee0a24;\n  border-radius: 100px;\n}\n.setindex #set-bottom[data-v-234d1526] {\n  display: flex;\n  justify-content: center;\n  margin-top: 7px;\n  margin-bottom: 5px;\n}\n.van-cell__title[data-v-234d1526] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-234d1526] {\n  text-align: left;\n}\n.van-button--default[data-v-234d1526] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-234d1526] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-234d1526] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-234d1526] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-234d1526] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-234d1526] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-234d1526] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 2614:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".comiclist[data-v-657d4b24] {\n  margin-top: 10px;\n  position: relative;\n  height: 690px;\n  font-size: 14px !important;\n}\n#overlayDom[data-v-657d4b24] {\n  background-color: #eeeeeece;\n}\n#select-list[data-v-657d4b24] {\n  margin: 0 15px;\n}\n#select-list #select-list-top[data-v-657d4b24] {\n  display: flex;\n  flex-direction: column;\n  background-color: #fff;\n  padding: 0 10px 0 10px;\n  min-height: 30px;\n  border-bottom: 1px solid #ccc5;\n  border-radius: 10px;\n}\n#select-list #select-list-top #select-list-info[data-v-657d4b24] {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  flex: 1;\n  min-height: 30px;\n}\n#select-list #select-list-top #select-list-info #select-list-info-left[data-v-657d4b24] {\n  display: flex;\n  width: 95px;\n  justify-content: space-between;\n  align-items: center;\n}\n#select-list #select-list-top #select-list-info #select-list-info-left span.span-circle[data-v-657d4b24] {\n  width: 14px;\n  height: 14px;\n  display: flex;\n  border-radius: 7px;\n  cursor: pointer;\n}\n#select-list #select-list-top #select-list-info #select-show-edit[data-v-657d4b24] {\n  margin: 10px;\n}\n#select-list #select-list-2[data-v-657d4b24] {\n  margin-top: 5px;\n  overflow: hidden;\n}\n#select-list #select-list-2 #select-list-2-1[data-v-657d4b24] {\n  max-height: 585px;\n  overflow-y: auto;\n}\n#select-list #select-list-2 #select-list-2-1[data-v-657d4b24] ::-webkit-scrollbar-track-piece {\n  background-color: #fff !important;\n}\n#select-list #select-list-2 #select-list-2-1 .input-chaptername[data-v-657d4b24] {\n  border: 1px solid #66ccff88;\n  flex: 1;\n  border-radius: 5px;\n  background: #fff;\n  line-height: 20px;\n  padding-left: 15px;\n  padding-top: 1px;\n}\n#select-list .van-cell-group--inset[data-v-657d4b24] {\n  margin: 0 0 !important;\n  overflow: hidden;\n  border-radius: 8px;\n}\n#editItem[data-v-657d4b24] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  margin: 3px 20px !important;\n  color: #ee000088;\n  flex-wrap: wrap;\n}\n#editItem .editItem-center[data-v-657d4b24] {\n  font-size: 18px;\n}\n#comicinfo[data-v-657d4b24] {\n  width: 280px;\n  margin: 20px auto;\n}\n#comicinfo .van-cell__title[data-v-657d4b24] {\n  max-width: 80px !important;\n}\ninput[data-v-657d4b24] {\n  margin-left: 5px;\n  margin-right: 5px;\n  width: 50px;\n}\n.van-cell__title[data-v-657d4b24] {\n  text-align: left;\n}\n.van-cell-group__title--inset[data-v-657d4b24] {\n  text-align: left;\n}\n.van-button--default[data-v-657d4b24] {\n  color: #000000;\n  background-color: #66ccff96 !important;\n  border: 1px solid #ffffff6e;\n}\n.van-button--disabled[data-v-657d4b24] {\n  opacity: 1 !important;\n}\n.van-tag--default[data-v-657d4b24] {\n  background-color: #66ccff;\n}\n.van-checkbox__icon--checked .van-icon[data-v-657d4b24] {\n  color: #ee0000 !important;\n  background-color: #66ccff55 !important;\n  border-color: #66ccff88 !important;\n}\n.van-popover--light[data-v-657d4b24] {\n  font-size: 14px !important;\n  color: #8d8de7 !important;\n}\n.van-popover--light .van-popover__arrow[data-v-657d4b24] {\n  color: #d9d9d9 !important;\n}\n.van-popover__content[data-v-657d4b24] {\n  border: 1px solid !important;\n  padding: 2px 9px !important;\n  margin-top: 3px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3645:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 688:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(2399).Buffer);

// Multibyte codec. In this scheme, a character is represented by 1 or more bytes.
// Our codec supports UTF-16 surrogates, extensions for GB18030 and unicode sequences.
// To save memory and loading time, we read table files only when requested.

exports._dbcs = DBCSCodec;

var UNASSIGNED = -1,
    GB18030_CODE = -2,
    SEQ_START  = -10,
    NODE_START = -1000,
    UNASSIGNED_NODE = new Array(0x100),
    DEF_CHAR = -1;

for (var i = 0; i < 0x100; i++)
    UNASSIGNED_NODE[i] = UNASSIGNED;


// Class DBCSCodec reads and initializes mapping tables.
function DBCSCodec(codecOptions, iconv) {
    this.encodingName = codecOptions.encodingName;
    if (!codecOptions)
        throw new Error("DBCS codec is called without the data.")
    if (!codecOptions.table)
        throw new Error("Encoding '" + this.encodingName + "' has no data.");

    // Load tables.
    var mappingTable = codecOptions.table();


    // Decode tables: MBCS -> Unicode.

    // decodeTables is a trie, encoded as an array of arrays of integers. Internal arrays are trie nodes and all have len = 256.
    // Trie root is decodeTables[0].
    // Values: >=  0 -> unicode character code. can be > 0xFFFF
    //         == UNASSIGNED -> unknown/unassigned sequence.
    //         == GB18030_CODE -> this is the end of a GB18030 4-byte sequence.
    //         <= NODE_START -> index of the next node in our trie to process next byte.
    //         <= SEQ_START  -> index of the start of a character code sequence, in decodeTableSeq.
    this.decodeTables = [];
    this.decodeTables[0] = UNASSIGNED_NODE.slice(0); // Create root node.

    // Sometimes a MBCS char corresponds to a sequence of unicode chars. We store them as arrays of integers here. 
    this.decodeTableSeq = [];

    // Actual mapping tables consist of chunks. Use them to fill up decode tables.
    for (var i = 0; i < mappingTable.length; i++)
        this._addDecodeChunk(mappingTable[i]);

    this.defaultCharUnicode = iconv.defaultCharUnicode;

    
    // Encode tables: Unicode -> DBCS.

    // `encodeTable` is array mapping from unicode char to encoded char. All its values are integers for performance.
    // Because it can be sparse, it is represented as array of buckets by 256 chars each. Bucket can be null.
    // Values: >=  0 -> it is a normal char. Write the value (if <=256 then 1 byte, if <=65536 then 2 bytes, etc.).
    //         == UNASSIGNED -> no conversion found. Output a default char.
    //         <= SEQ_START  -> it's an index in encodeTableSeq, see below. The character starts a sequence.
    this.encodeTable = [];
    
    // `encodeTableSeq` is used when a sequence of unicode characters is encoded as a single code. We use a tree of
    // objects where keys correspond to characters in sequence and leafs are the encoded dbcs values. A special DEF_CHAR key
    // means end of sequence (needed when one sequence is a strict subsequence of another).
    // Objects are kept separately from encodeTable to increase performance.
    this.encodeTableSeq = [];

    // Some chars can be decoded, but need not be encoded.
    var skipEncodeChars = {};
    if (codecOptions.encodeSkipVals)
        for (var i = 0; i < codecOptions.encodeSkipVals.length; i++) {
            var val = codecOptions.encodeSkipVals[i];
            if (typeof val === 'number')
                skipEncodeChars[val] = true;
            else
                for (var j = val.from; j <= val.to; j++)
                    skipEncodeChars[j] = true;
        }
        
    // Use decode trie to recursively fill out encode tables.
    this._fillEncodeTable(0, 0, skipEncodeChars);

    // Add more encoding pairs when needed.
    if (codecOptions.encodeAdd) {
        for (var uChar in codecOptions.encodeAdd)
            if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
                this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
    }

    this.defCharSB  = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = this.encodeTable[0]['?'];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = "?".charCodeAt(0);


    // Load & create GB18030 tables when needed.
    if (typeof codecOptions.gb18030 === 'function') {
        this.gb18030 = codecOptions.gb18030(); // Load GB18030 ranges.

        // Add GB18030 decode tables.
        var thirdByteNodeIdx = this.decodeTables.length;
        var thirdByteNode = this.decodeTables[thirdByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        var fourthByteNodeIdx = this.decodeTables.length;
        var fourthByteNode = this.decodeTables[fourthByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        for (var i = 0x81; i <= 0xFE; i++) {
            var secondByteNodeIdx = NODE_START - this.decodeTables[0][i];
            var secondByteNode = this.decodeTables[secondByteNodeIdx];
            for (var j = 0x30; j <= 0x39; j++)
                secondByteNode[j] = NODE_START - thirdByteNodeIdx;
        }
        for (var i = 0x81; i <= 0xFE; i++)
            thirdByteNode[i] = NODE_START - fourthByteNodeIdx;
        for (var i = 0x30; i <= 0x39; i++)
            fourthByteNode[i] = GB18030_CODE
    }        
}

DBCSCodec.prototype.encoder = DBCSEncoder;
DBCSCodec.prototype.decoder = DBCSDecoder;

// Decoder helpers
DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
    var bytes = [];
    for (; addr > 0; addr >>= 8)
        bytes.push(addr & 0xFF);
    if (bytes.length == 0)
        bytes.push(0);

    var node = this.decodeTables[0];
    for (var i = bytes.length-1; i > 0; i--) { // Traverse nodes deeper into the trie.
        var val = node[bytes[i]];

        if (val == UNASSIGNED) { // Create new node.
            node[bytes[i]] = NODE_START - this.decodeTables.length;
            this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
        }
        else if (val <= NODE_START) { // Existing node.
            node = this.decodeTables[NODE_START - val];
        }
        else
            throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
    }
    return node;
}


DBCSCodec.prototype._addDecodeChunk = function(chunk) {
    // First element of chunk is the hex mbcs code where we start.
    var curAddr = parseInt(chunk[0], 16);

    // Choose the decoding node where we'll write our chars.
    var writeTable = this._getDecodeTrieNode(curAddr);
    curAddr = curAddr & 0xFF;

    // Write all other elements of the chunk to the table.
    for (var k = 1; k < chunk.length; k++) {
        var part = chunk[k];
        if (typeof part === "string") { // String, write as-is.
            for (var l = 0; l < part.length;) {
                var code = part.charCodeAt(l++);
                if (0xD800 <= code && code < 0xDC00) { // Decode surrogate
                    var codeTrail = part.charCodeAt(l++);
                    if (0xDC00 <= codeTrail && codeTrail < 0xE000)
                        writeTable[curAddr++] = 0x10000 + (code - 0xD800) * 0x400 + (codeTrail - 0xDC00);
                    else
                        throw new Error("Incorrect surrogate pair in "  + this.encodingName + " at chunk " + chunk[0]);
                }
                else if (0x0FF0 < code && code <= 0x0FFF) { // Character sequence (our own encoding used)
                    var len = 0xFFF - code + 2;
                    var seq = [];
                    for (var m = 0; m < len; m++)
                        seq.push(part.charCodeAt(l++)); // Simple variation: don't support surrogates or subsequences in seq.

                    writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
                    this.decodeTableSeq.push(seq);
                }
                else
                    writeTable[curAddr++] = code; // Basic char
            }
        } 
        else if (typeof part === "number") { // Integer, meaning increasing sequence starting with prev character.
            var charCode = writeTable[curAddr - 1] + 1;
            for (var l = 0; l < part; l++)
                writeTable[curAddr++] = charCode++;
        }
        else
            throw new Error("Incorrect type '" + typeof part + "' given in "  + this.encodingName + " at chunk " + chunk[0]);
    }
    if (curAddr > 0xFF)
        throw new Error("Incorrect chunk in "  + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
}

// Encoder helpers
DBCSCodec.prototype._getEncodeBucket = function(uCode) {
    var high = uCode >> 8; // This could be > 0xFF because of astral characters.
    if (this.encodeTable[high] === undefined)
        this.encodeTable[high] = UNASSIGNED_NODE.slice(0); // Create bucket on demand.
    return this.encodeTable[high];
}

DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;
    if (bucket[low] <= SEQ_START)
        this.encodeTableSeq[SEQ_START-bucket[low]][DEF_CHAR] = dbcsCode; // There's already a sequence, set a single-char subsequence of it.
    else if (bucket[low] == UNASSIGNED)
        bucket[low] = dbcsCode;
}

DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
    
    // Get the root of character tree according to first character of the sequence.
    var uCode = seq[0];
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;

    var node;
    if (bucket[low] <= SEQ_START) {
        // There's already a sequence with  - use it.
        node = this.encodeTableSeq[SEQ_START-bucket[low]];
    }
    else {
        // There was no sequence object - allocate a new one.
        node = {};
        if (bucket[low] !== UNASSIGNED) node[DEF_CHAR] = bucket[low]; // If a char was set before - make it a single-char subsequence.
        bucket[low] = SEQ_START - this.encodeTableSeq.length;
        this.encodeTableSeq.push(node);
    }

    // Traverse the character tree, allocating new nodes as needed.
    for (var j = 1; j < seq.length-1; j++) {
        var oldVal = node[uCode];
        if (typeof oldVal === 'object')
            node = oldVal;
        else {
            node = node[uCode] = {}
            if (oldVal !== undefined)
                node[DEF_CHAR] = oldVal
        }
    }

    // Set the leaf to given dbcsCode.
    uCode = seq[seq.length-1];
    node[uCode] = dbcsCode;
}

DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
    var node = this.decodeTables[nodeIdx];
    for (var i = 0; i < 0x100; i++) {
        var uCode = node[i];
        var mbCode = prefix + i;
        if (skipEncodeChars[mbCode])
            continue;

        if (uCode >= 0)
            this._setEncodeChar(uCode, mbCode);
        else if (uCode <= NODE_START)
            this._fillEncodeTable(NODE_START - uCode, mbCode << 8, skipEncodeChars);
        else if (uCode <= SEQ_START)
            this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
    }
}



// == Encoder ==================================================================

function DBCSEncoder(options, codec) {
    // Encoder state
    this.leadSurrogate = -1;
    this.seqObj = undefined;
    
    // Static data
    this.encodeTable = codec.encodeTable;
    this.encodeTableSeq = codec.encodeTableSeq;
    this.defaultCharSingleByte = codec.defCharSB;
    this.gb18030 = codec.gb18030;
}

DBCSEncoder.prototype.write = function(str) {
    var newBuf = Buffer.alloc(str.length * (this.gb18030 ? 4 : 3)),
        leadSurrogate = this.leadSurrogate,
        seqObj = this.seqObj, nextChar = -1,
        i = 0, j = 0;

    while (true) {
        // 0. Get next character.
        if (nextChar === -1) {
            if (i == str.length) break;
            var uCode = str.charCodeAt(i++);
        }
        else {
            var uCode = nextChar;
            nextChar = -1;    
        }

        // 1. Handle surrogates.
        if (0xD800 <= uCode && uCode < 0xE000) { // Char is one of surrogates.
            if (uCode < 0xDC00) { // We've got lead surrogate.
                if (leadSurrogate === -1) {
                    leadSurrogate = uCode;
                    continue;
                } else {
                    leadSurrogate = uCode;
                    // Double lead surrogate found.
                    uCode = UNASSIGNED;
                }
            } else { // We've got trail surrogate.
                if (leadSurrogate !== -1) {
                    uCode = 0x10000 + (leadSurrogate - 0xD800) * 0x400 + (uCode - 0xDC00);
                    leadSurrogate = -1;
                } else {
                    // Incomplete surrogate pair - only trail surrogate found.
                    uCode = UNASSIGNED;
                }
                
            }
        }
        else if (leadSurrogate !== -1) {
            // Incomplete surrogate pair - only lead surrogate found.
            nextChar = uCode; uCode = UNASSIGNED; // Write an error, then current char.
            leadSurrogate = -1;
        }

        // 2. Convert uCode character.
        var dbcsCode = UNASSIGNED;
        if (seqObj !== undefined && uCode != UNASSIGNED) { // We are in the middle of the sequence
            var resCode = seqObj[uCode];
            if (typeof resCode === 'object') { // Sequence continues.
                seqObj = resCode;
                continue;

            } else if (typeof resCode == 'number') { // Sequence finished. Write it.
                dbcsCode = resCode;

            } else if (resCode == undefined) { // Current character is not part of the sequence.

                // Try default character for this sequence
                resCode = seqObj[DEF_CHAR];
                if (resCode !== undefined) {
                    dbcsCode = resCode; // Found. Write it.
                    nextChar = uCode; // Current character will be written too in the next iteration.

                } else {
                    // TODO: What if we have no default? (resCode == undefined)
                    // Then, we should write first char of the sequence as-is and try the rest recursively.
                    // Didn't do it for now because no encoding has this situation yet.
                    // Currently, just skip the sequence and write current char.
                }
            }
            seqObj = undefined;
        }
        else if (uCode >= 0) {  // Regular character
            var subtable = this.encodeTable[uCode >> 8];
            if (subtable !== undefined)
                dbcsCode = subtable[uCode & 0xFF];
            
            if (dbcsCode <= SEQ_START) { // Sequence start
                seqObj = this.encodeTableSeq[SEQ_START-dbcsCode];
                continue;
            }

            if (dbcsCode == UNASSIGNED && this.gb18030) {
                // Use GB18030 algorithm to find character(s) to write.
                var idx = findIdx(this.gb18030.uChars, uCode);
                if (idx != -1) {
                    var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 12600); dbcsCode = dbcsCode % 12600;
                    newBuf[j++] = 0x30 + Math.floor(dbcsCode / 1260); dbcsCode = dbcsCode % 1260;
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 10); dbcsCode = dbcsCode % 10;
                    newBuf[j++] = 0x30 + dbcsCode;
                    continue;
                }
            }
        }

        // 3. Write dbcsCode character.
        if (dbcsCode === UNASSIGNED)
            dbcsCode = this.defaultCharSingleByte;
        
        if (dbcsCode < 0x100) {
            newBuf[j++] = dbcsCode;
        }
        else if (dbcsCode < 0x10000) {
            newBuf[j++] = dbcsCode >> 8;   // high byte
            newBuf[j++] = dbcsCode & 0xFF; // low byte
        }
        else {
            newBuf[j++] = dbcsCode >> 16;
            newBuf[j++] = (dbcsCode >> 8) & 0xFF;
            newBuf[j++] = dbcsCode & 0xFF;
        }
    }

    this.seqObj = seqObj;
    this.leadSurrogate = leadSurrogate;
    return newBuf.slice(0, j);
}

DBCSEncoder.prototype.end = function() {
    if (this.leadSurrogate === -1 && this.seqObj === undefined)
        return; // All clean. Most often case.

    var newBuf = Buffer.alloc(10), j = 0;

    if (this.seqObj) { // We're in the sequence.
        var dbcsCode = this.seqObj[DEF_CHAR];
        if (dbcsCode !== undefined) { // Write beginning of the sequence.
            if (dbcsCode < 0x100) {
                newBuf[j++] = dbcsCode;
            }
            else {
                newBuf[j++] = dbcsCode >> 8;   // high byte
                newBuf[j++] = dbcsCode & 0xFF; // low byte
            }
        } else {
            // See todo above.
        }
        this.seqObj = undefined;
    }

    if (this.leadSurrogate !== -1) {
        // Incomplete surrogate pair - only lead surrogate found.
        newBuf[j++] = this.defaultCharSingleByte;
        this.leadSurrogate = -1;
    }
    
    return newBuf.slice(0, j);
}

// Export for testing
DBCSEncoder.prototype.findIdx = findIdx;


// == Decoder ==================================================================

function DBCSDecoder(options, codec) {
    // Decoder state
    this.nodeIdx = 0;
    this.prevBuf = Buffer.alloc(0);

    // Static data
    this.decodeTables = codec.decodeTables;
    this.decodeTableSeq = codec.decodeTableSeq;
    this.defaultCharUnicode = codec.defaultCharUnicode;
    this.gb18030 = codec.gb18030;
}

DBCSDecoder.prototype.write = function(buf) {
    var newBuf = Buffer.alloc(buf.length*2),
        nodeIdx = this.nodeIdx, 
        prevBuf = this.prevBuf, prevBufOffset = this.prevBuf.length,
        seqStart = -this.prevBuf.length, // idx of the start of current parsed sequence.
        uCode;

    if (prevBufOffset > 0) // Make prev buf overlap a little to make it easier to slice later.
        prevBuf = Buffer.concat([prevBuf, buf.slice(0, 10)]);
    
    for (var i = 0, j = 0; i < buf.length; i++) {
        var curByte = (i >= 0) ? buf[i] : prevBuf[i + prevBufOffset];

        // Lookup in current trie node.
        var uCode = this.decodeTables[nodeIdx][curByte];

        if (uCode >= 0) { 
            // Normal character, just use it.
        }
        else if (uCode === UNASSIGNED) { // Unknown char.
            // TODO: Callback with seq.
            //var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            i = seqStart; // Try to parse again, after skipping first byte of the sequence ('i' will be incremented by 'for' cycle).
            uCode = this.defaultCharUnicode.charCodeAt(0);
        }
        else if (uCode === GB18030_CODE) {
            var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            var ptr = (curSeq[0]-0x81)*12600 + (curSeq[1]-0x30)*1260 + (curSeq[2]-0x81)*10 + (curSeq[3]-0x30);
            var idx = findIdx(this.gb18030.gbChars, ptr);
            uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
        }
        else if (uCode <= NODE_START) { // Go to next trie node.
            nodeIdx = NODE_START - uCode;
            continue;
        }
        else if (uCode <= SEQ_START) { // Output a sequence of chars.
            var seq = this.decodeTableSeq[SEQ_START - uCode];
            for (var k = 0; k < seq.length - 1; k++) {
                uCode = seq[k];
                newBuf[j++] = uCode & 0xFF;
                newBuf[j++] = uCode >> 8;
            }
            uCode = seq[seq.length-1];
        }
        else
            throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);

        // Write the character to buffer, handling higher planes using surrogate pair.
        if (uCode > 0xFFFF) { 
            uCode -= 0x10000;
            var uCodeLead = 0xD800 + Math.floor(uCode / 0x400);
            newBuf[j++] = uCodeLead & 0xFF;
            newBuf[j++] = uCodeLead >> 8;

            uCode = 0xDC00 + uCode % 0x400;
        }
        newBuf[j++] = uCode & 0xFF;
        newBuf[j++] = uCode >> 8;

        // Reset trie node.
        nodeIdx = 0; seqStart = i+1;
    }

    this.nodeIdx = nodeIdx;
    this.prevBuf = (seqStart >= 0) ? buf.slice(seqStart) : prevBuf.slice(seqStart + prevBufOffset);
    return newBuf.slice(0, j).toString('ucs2');
}

DBCSDecoder.prototype.end = function() {
    var ret = '';

    // Try to parse all remaining chars.
    while (this.prevBuf.length > 0) {
        // Skip 1 character in the buffer.
        ret += this.defaultCharUnicode;
        var buf = this.prevBuf.slice(1);

        // Parse remaining as usual.
        this.prevBuf = Buffer.alloc(0);
        this.nodeIdx = 0;
        if (buf.length > 0)
            ret += this.write(buf);
    }

    this.nodeIdx = 0;
    return ret;
}

// Binary search for GB18030. Returns largest i such that table[i] <= val.
function findIdx(table, val) {
    if (table[0] > val)
        return -1;

    var l = 0, r = table.length;
    while (l < r-1) { // always table[l] <= val < table[r]
        var mid = l + Math.floor((r-l+1)/2);
        if (table[mid] <= val)
            l = mid;
        else
            r = mid;
    }
    return l;
}



/***/ }),

/***/ 5990:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// Description of supported double byte encodings and aliases.
// Tables are not require()-d until they are needed to speed up library load.
// require()-s are direct to support Browserify.

module.exports = {
    
    // == Japanese/ShiftJIS ====================================================
    // All japanese encodings are based on JIS X set of standards:
    // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
    //              Has several variations in 1978, 1983, 1990 and 1997.
    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
    //              2 planes, first is superset of 0208, second - revised 0212.
    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)

    // Byte encodings are:
    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
    //               0x00-0x7F       - lower part of 0201
    //               0x8E, 0xA1-0xDF - upper part of 0201
    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
    //               Used as-is in ISO2022 family.
    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
    //                0201-1976 Roman, 0208-1978, 0208-1983.
    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
    //
    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
    //
    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html

    'shiftjis': {
        type: '_dbcs',
        table: function() { return __webpack_require__(7014) },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
        encodeSkipVals: [{from: 0xED40, to: 0xF940}],
    },
    'csshiftjis': 'shiftjis',
    'mskanji': 'shiftjis',
    'sjis': 'shiftjis',
    'windows31j': 'shiftjis',
    'ms31j': 'shiftjis',
    'xsjis': 'shiftjis',
    'windows932': 'shiftjis',
    'ms932': 'shiftjis',
    '932': 'shiftjis',
    'cp932': 'shiftjis',

    'eucjp': {
        type: '_dbcs',
        table: function() { return __webpack_require__(1532) },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
    },

    // TODO: KDDI extension to Shift_JIS
    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.


    // == Chinese/GBK ==========================================================
    // http://en.wikipedia.org/wiki/GBK
    // We mostly implement W3C recommendation: https://www.w3.org/TR/encoding/#gbk-encoder

    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
    'gb2312': 'cp936',
    'gb231280': 'cp936',
    'gb23121980': 'cp936',
    'csgb2312': 'cp936',
    'csiso58gb231280': 'cp936',
    'euccn': 'cp936',

    // Microsoft's CP936 is a subset and approximation of GBK.
    'windows936': 'cp936',
    'ms936': 'cp936',
    '936': 'cp936',
    'cp936': {
        type: '_dbcs',
        table: function() { return __webpack_require__(3336) },
    },

    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
    'gbk': {
        type: '_dbcs',
        table: function() { return (__webpack_require__(3336).concat)(__webpack_require__(4346)) },
    },
    'xgbk': 'gbk',
    'isoir58': 'gbk',

    // GB18030 is an algorithmic extension of GBK.
    // Main source: https://www.w3.org/TR/encoding/#gbk-encoder
    // http://icu-project.org/docs/papers/gb18030.html
    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
    'gb18030': {
        type: '_dbcs',
        table: function() { return (__webpack_require__(3336).concat)(__webpack_require__(4346)) },
        gb18030: function() { return __webpack_require__(6258) },
        encodeSkipVals: [0x80],
        encodeAdd: {'€': 0xA2E3},
    },

    'chinese': 'gb18030',


    // == Korean ===============================================================
    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
    'windows949': 'cp949',
    'ms949': 'cp949',
    '949': 'cp949',
    'cp949': {
        type: '_dbcs',
        table: function() { return __webpack_require__(7348) },
    },

    'cseuckr': 'cp949',
    'csksc56011987': 'cp949',
    'euckr': 'cp949',
    'isoir149': 'cp949',
    'korean': 'cp949',
    'ksc56011987': 'cp949',
    'ksc56011989': 'cp949',
    'ksc5601': 'cp949',


    // == Big5/Taiwan/Hong Kong ================================================
    // There are lots of tables for Big5 and cp950. Please see the following links for history:
    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
    // Variations, in roughly number of defined chars:
    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
    //    Plus, it has 4 combining sequences.
    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
    // 
    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.

    'windows950': 'cp950',
    'ms950': 'cp950',
    '950': 'cp950',
    'cp950': {
        type: '_dbcs',
        table: function() { return __webpack_require__(4284) },
    },

    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
    'big5': 'big5hkscs',
    'big5hkscs': {
        type: '_dbcs',
        table: function() { return (__webpack_require__(4284).concat)(__webpack_require__(3480)) },
        encodeSkipVals: [0xa2cc],
    },

    'cnbig5': 'big5hkscs',
    'csbig5': 'big5hkscs',
    'xxbig5': 'big5hkscs',
};


/***/ }),

/***/ 6934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


// Update this array if you add/rename/remove files in this directory.
// We support Browserify by skipping automatic module discovery and requiring modules directly.
var modules = [
    __webpack_require__(1025),
    __webpack_require__(1279),
    __webpack_require__(758),
    __webpack_require__(9068),
    __webpack_require__(288),
    __webpack_require__(7018),
    __webpack_require__(688),
    __webpack_require__(5990),
];

// Put all encoding/alias/codec definitions to single object and export it. 
for (var i = 0; i < modules.length; i++) {
    var module = modules[i];
    for (var enc in module)
        if (Object.prototype.hasOwnProperty.call(module, enc))
            exports[enc] = module[enc];
}


/***/ }),

/***/ 1025:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(2399).Buffer);

// Export Node.js internal encodings.

module.exports = {
    // Encodings
    utf8:   { type: "_internal", bomAware: true},
    cesu8:  { type: "_internal", bomAware: true},
    unicode11utf8: "utf8",

    ucs2:   { type: "_internal", bomAware: true},
    utf16le: "ucs2",

    binary: { type: "_internal" },
    base64: { type: "_internal" },
    hex:    { type: "_internal" },

    // Codec.
    _internal: InternalCodec,
};

//------------------------------------------------------------------------------

function InternalCodec(codecOptions, iconv) {
    this.enc = codecOptions.encodingName;
    this.bomAware = codecOptions.bomAware;

    if (this.enc === "base64")
        this.encoder = InternalEncoderBase64;
    else if (this.enc === "cesu8") {
        this.enc = "utf8"; // Use utf8 for decoding.
        this.encoder = InternalEncoderCesu8;

        // Add decoder for versions of Node not supporting CESU-8
        if (Buffer.from('eda0bdedb2a9', 'hex').toString() !== '💩') {
            this.decoder = InternalDecoderCesu8;
            this.defaultCharUnicode = iconv.defaultCharUnicode;
        }
    }
}

InternalCodec.prototype.encoder = InternalEncoder;
InternalCodec.prototype.decoder = InternalDecoder;

//------------------------------------------------------------------------------

// We use node.js internal decoder. Its signature is the same as ours.
var StringDecoder = (__webpack_require__(2553)/* .StringDecoder */ .s);

if (!StringDecoder.prototype.end) // Node v0.8 doesn't have this method.
    StringDecoder.prototype.end = function() {};


function InternalDecoder(options, codec) {
    StringDecoder.call(this, codec.enc);
}

InternalDecoder.prototype = StringDecoder.prototype;


//------------------------------------------------------------------------------
// Encoder is mostly trivial

function InternalEncoder(options, codec) {
    this.enc = codec.enc;
}

InternalEncoder.prototype.write = function(str) {
    return Buffer.from(str, this.enc);
}

InternalEncoder.prototype.end = function() {
}


//------------------------------------------------------------------------------
// Except base64 encoder, which must keep its state.

function InternalEncoderBase64(options, codec) {
    this.prevStr = '';
}

InternalEncoderBase64.prototype.write = function(str) {
    str = this.prevStr + str;
    var completeQuads = str.length - (str.length % 4);
    this.prevStr = str.slice(completeQuads);
    str = str.slice(0, completeQuads);

    return Buffer.from(str, "base64");
}

InternalEncoderBase64.prototype.end = function() {
    return Buffer.from(this.prevStr, "base64");
}


//------------------------------------------------------------------------------
// CESU-8 encoder is also special.

function InternalEncoderCesu8(options, codec) {
}

InternalEncoderCesu8.prototype.write = function(str) {
    var buf = Buffer.alloc(str.length * 3), bufIdx = 0;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        // Naive implementation, but it works because CESU-8 is especially easy
        // to convert from UTF-16 (which all JS strings are encoded in).
        if (charCode < 0x80)
            buf[bufIdx++] = charCode;
        else if (charCode < 0x800) {
            buf[bufIdx++] = 0xC0 + (charCode >>> 6);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
        else { // charCode will always be < 0x10000 in javascript.
            buf[bufIdx++] = 0xE0 + (charCode >>> 12);
            buf[bufIdx++] = 0x80 + ((charCode >>> 6) & 0x3f);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
    }
    return buf.slice(0, bufIdx);
}

InternalEncoderCesu8.prototype.end = function() {
}

//------------------------------------------------------------------------------
// CESU-8 decoder is not implemented in Node v4.0+

function InternalDecoderCesu8(options, codec) {
    this.acc = 0;
    this.contBytes = 0;
    this.accBytes = 0;
    this.defaultCharUnicode = codec.defaultCharUnicode;
}

InternalDecoderCesu8.prototype.write = function(buf) {
    var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, 
        res = '';
    for (var i = 0; i < buf.length; i++) {
        var curByte = buf[i];
        if ((curByte & 0xC0) !== 0x80) { // Leading byte
            if (contBytes > 0) { // Previous code is invalid
                res += this.defaultCharUnicode;
                contBytes = 0;
            }

            if (curByte < 0x80) { // Single-byte code
                res += String.fromCharCode(curByte);
            } else if (curByte < 0xE0) { // Two-byte code
                acc = curByte & 0x1F;
                contBytes = 1; accBytes = 1;
            } else if (curByte < 0xF0) { // Three-byte code
                acc = curByte & 0x0F;
                contBytes = 2; accBytes = 1;
            } else { // Four or more are not supported for CESU-8.
                res += this.defaultCharUnicode;
            }
        } else { // Continuation byte
            if (contBytes > 0) { // We're waiting for it.
                acc = (acc << 6) | (curByte & 0x3f);
                contBytes--; accBytes++;
                if (contBytes === 0) {
                    // Check for overlong encoding, but support Modified UTF-8 (encoding NULL as C0 80)
                    if (accBytes === 2 && acc < 0x80 && acc > 0)
                        res += this.defaultCharUnicode;
                    else if (accBytes === 3 && acc < 0x800)
                        res += this.defaultCharUnicode;
                    else
                        // Actually add character.
                        res += String.fromCharCode(acc);
                }
            } else { // Unexpected continuation byte
                res += this.defaultCharUnicode;
            }
        }
    }
    this.acc = acc; this.contBytes = contBytes; this.accBytes = accBytes;
    return res;
}

InternalDecoderCesu8.prototype.end = function() {
    var res = 0;
    if (this.contBytes > 0)
        res += this.defaultCharUnicode;
    return res;
}


/***/ }),

/***/ 9068:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(2399).Buffer);

// Single-byte codec. Needs a 'chars' string parameter that contains 256 or 128 chars that
// correspond to encoded bytes (if 128 - then lower half is ASCII). 

exports._sbcs = SBCSCodec;
function SBCSCodec(codecOptions, iconv) {
    if (!codecOptions)
        throw new Error("SBCS codec is called without the data.")
    
    // Prepare char buffer for decoding.
    if (!codecOptions.chars || (codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256))
        throw new Error("Encoding '"+codecOptions.type+"' has incorrect 'chars' (must be of len 128 or 256)");
    
    if (codecOptions.chars.length === 128) {
        var asciiString = "";
        for (var i = 0; i < 128; i++)
            asciiString += String.fromCharCode(i);
        codecOptions.chars = asciiString + codecOptions.chars;
    }

    this.decodeBuf = Buffer.from(codecOptions.chars, 'ucs2');
    
    // Encoding buffer.
    var encodeBuf = Buffer.alloc(65536, iconv.defaultCharSingleByte.charCodeAt(0));

    for (var i = 0; i < codecOptions.chars.length; i++)
        encodeBuf[codecOptions.chars.charCodeAt(i)] = i;

    this.encodeBuf = encodeBuf;
}

SBCSCodec.prototype.encoder = SBCSEncoder;
SBCSCodec.prototype.decoder = SBCSDecoder;


function SBCSEncoder(options, codec) {
    this.encodeBuf = codec.encodeBuf;
}

SBCSEncoder.prototype.write = function(str) {
    var buf = Buffer.alloc(str.length);
    for (var i = 0; i < str.length; i++)
        buf[i] = this.encodeBuf[str.charCodeAt(i)];
    
    return buf;
}

SBCSEncoder.prototype.end = function() {
}


function SBCSDecoder(options, codec) {
    this.decodeBuf = codec.decodeBuf;
}

SBCSDecoder.prototype.write = function(buf) {
    // Strings are immutable in JS -> we use ucs2 buffer to speed up computations.
    var decodeBuf = this.decodeBuf;
    var newBuf = Buffer.alloc(buf.length*2);
    var idx1 = 0, idx2 = 0;
    for (var i = 0; i < buf.length; i++) {
        idx1 = buf[i]*2; idx2 = i*2;
        newBuf[idx2] = decodeBuf[idx1];
        newBuf[idx2+1] = decodeBuf[idx1+1];
    }
    return newBuf.toString('ucs2');
}

SBCSDecoder.prototype.end = function() {
}


/***/ }),

/***/ 7018:
/***/ ((module) => {

"use strict";


// Generated data for sbcs codec. Don't edit manually. Regenerate using generation/gen-sbcs.js script.
module.exports = {
  "437": "cp437",
  "737": "cp737",
  "775": "cp775",
  "850": "cp850",
  "852": "cp852",
  "855": "cp855",
  "856": "cp856",
  "857": "cp857",
  "858": "cp858",
  "860": "cp860",
  "861": "cp861",
  "862": "cp862",
  "863": "cp863",
  "864": "cp864",
  "865": "cp865",
  "866": "cp866",
  "869": "cp869",
  "874": "windows874",
  "922": "cp922",
  "1046": "cp1046",
  "1124": "cp1124",
  "1125": "cp1125",
  "1129": "cp1129",
  "1133": "cp1133",
  "1161": "cp1161",
  "1162": "cp1162",
  "1163": "cp1163",
  "1250": "windows1250",
  "1251": "windows1251",
  "1252": "windows1252",
  "1253": "windows1253",
  "1254": "windows1254",
  "1255": "windows1255",
  "1256": "windows1256",
  "1257": "windows1257",
  "1258": "windows1258",
  "28591": "iso88591",
  "28592": "iso88592",
  "28593": "iso88593",
  "28594": "iso88594",
  "28595": "iso88595",
  "28596": "iso88596",
  "28597": "iso88597",
  "28598": "iso88598",
  "28599": "iso88599",
  "28600": "iso885910",
  "28601": "iso885911",
  "28603": "iso885913",
  "28604": "iso885914",
  "28605": "iso885915",
  "28606": "iso885916",
  "windows874": {
    "type": "_sbcs",
    "chars": "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "win874": "windows874",
  "cp874": "windows874",
  "windows1250": {
    "type": "_sbcs",
    "chars": "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
  },
  "win1250": "windows1250",
  "cp1250": "windows1250",
  "windows1251": {
    "type": "_sbcs",
    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "win1251": "windows1251",
  "cp1251": "windows1251",
  "windows1252": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "win1252": "windows1252",
  "cp1252": "windows1252",
  "windows1253": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
  },
  "win1253": "windows1253",
  "cp1253": "windows1253",
  "windows1254": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
  },
  "win1254": "windows1254",
  "cp1254": "windows1254",
  "windows1255": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
  },
  "win1255": "windows1255",
  "cp1255": "windows1255",
  "windows1256": {
    "type": "_sbcs",
    "chars": "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
  },
  "win1256": "windows1256",
  "cp1256": "windows1256",
  "windows1257": {
    "type": "_sbcs",
    "chars": "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
  },
  "win1257": "windows1257",
  "cp1257": "windows1257",
  "windows1258": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "win1258": "windows1258",
  "cp1258": "windows1258",
  "iso88591": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "cp28591": "iso88591",
  "iso88592": {
    "type": "_sbcs",
    "chars": " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
  },
  "cp28592": "iso88592",
  "iso88593": {
    "type": "_sbcs",
    "chars": " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
  },
  "cp28593": "iso88593",
  "iso88594": {
    "type": "_sbcs",
    "chars": " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
  },
  "cp28594": "iso88594",
  "iso88595": {
    "type": "_sbcs",
    "chars": " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
  },
  "cp28595": "iso88595",
  "iso88596": {
    "type": "_sbcs",
    "chars": " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
  },
  "cp28596": "iso88596",
  "iso88597": {
    "type": "_sbcs",
    "chars": " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
  },
  "cp28597": "iso88597",
  "iso88598": {
    "type": "_sbcs",
    "chars": " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
  },
  "cp28598": "iso88598",
  "iso88599": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
  },
  "cp28599": "iso88599",
  "iso885910": {
    "type": "_sbcs",
    "chars": " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
  },
  "cp28600": "iso885910",
  "iso885911": {
    "type": "_sbcs",
    "chars": " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "cp28601": "iso885911",
  "iso885913": {
    "type": "_sbcs",
    "chars": " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
  },
  "cp28603": "iso885913",
  "iso885914": {
    "type": "_sbcs",
    "chars": " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
  },
  "cp28604": "iso885914",
  "iso885915": {
    "type": "_sbcs",
    "chars": " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "cp28605": "iso885915",
  "iso885916": {
    "type": "_sbcs",
    "chars": " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
  },
  "cp28606": "iso885916",
  "cp437": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm437": "cp437",
  "csibm437": "cp437",
  "cp737": {
    "type": "_sbcs",
    "chars": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
  },
  "ibm737": "cp737",
  "csibm737": "cp737",
  "cp775": {
    "type": "_sbcs",
    "chars": "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
  },
  "ibm775": "cp775",
  "csibm775": "cp775",
  "cp850": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm850": "cp850",
  "csibm850": "cp850",
  "cp852": {
    "type": "_sbcs",
    "chars": "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
  },
  "ibm852": "cp852",
  "csibm852": "cp852",
  "cp855": {
    "type": "_sbcs",
    "chars": "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
  },
  "ibm855": "cp855",
  "csibm855": "cp855",
  "cp856": {
    "type": "_sbcs",
    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm856": "cp856",
  "csibm856": "cp856",
  "cp857": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
  },
  "ibm857": "cp857",
  "csibm857": "cp857",
  "cp858": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm858": "cp858",
  "csibm858": "cp858",
  "cp860": {
    "type": "_sbcs",
    "chars": "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm860": "cp860",
  "csibm860": "cp860",
  "cp861": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm861": "cp861",
  "csibm861": "cp861",
  "cp862": {
    "type": "_sbcs",
    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm862": "cp862",
  "csibm862": "cp862",
  "cp863": {
    "type": "_sbcs",
    "chars": "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm863": "cp863",
  "csibm863": "cp863",
  "cp864": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"
  },
  "ibm864": "cp864",
  "csibm864": "cp864",
  "cp865": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm865": "cp865",
  "csibm865": "cp865",
  "cp866": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "
  },
  "ibm866": "cp866",
  "csibm866": "cp866",
  "cp869": {
    "type": "_sbcs",
    "chars": "������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "
  },
  "ibm869": "cp869",
  "csibm869": "cp869",
  "cp922": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"
  },
  "ibm922": "cp922",
  "csibm922": "cp922",
  "cp1046": {
    "type": "_sbcs",
    "chars": "ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"
  },
  "ibm1046": "cp1046",
  "csibm1046": "cp1046",
  "cp1124": {
    "type": "_sbcs",
    "chars": " ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"
  },
  "ibm1124": "cp1124",
  "csibm1124": "cp1124",
  "cp1125": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "
  },
  "ibm1125": "cp1125",
  "csibm1125": "cp1125",
  "cp1129": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "ibm1129": "cp1129",
  "csibm1129": "cp1129",
  "cp1133": {
    "type": "_sbcs",
    "chars": " ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"
  },
  "ibm1133": "cp1133",
  "csibm1133": "cp1133",
  "cp1161": {
    "type": "_sbcs",
    "chars": "��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "
  },
  "ibm1161": "cp1161",
  "csibm1161": "cp1161",
  "cp1162": {
    "type": "_sbcs",
    "chars": "€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "ibm1162": "cp1162",
  "csibm1162": "cp1162",
  "cp1163": {
    "type": "_sbcs",
    "chars": " ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "ibm1163": "cp1163",
  "csibm1163": "cp1163",
  "maccroatian": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
  },
  "maccyrillic": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
  },
  "macgreek": {
    "type": "_sbcs",
    "chars": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"
  },
  "maciceland": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macroman": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macromania": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macthai": {
    "type": "_sbcs",
    "chars": "«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู﻿​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"
  },
  "macturkish": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macukraine": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
  },
  "koi8r": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8u": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8ru": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8t": {
    "type": "_sbcs",
    "chars": "қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "armscii8": {
    "type": "_sbcs",
    "chars": " �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"
  },
  "rk1048": {
    "type": "_sbcs",
    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "tcvn": {
    "type": "_sbcs",
    "chars": "\u0000ÚỤ\u0003ỪỬỮ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010ỨỰỲỶỸÝỴ\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"
  },
  "georgianacademy": {
    "type": "_sbcs",
    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "georgianps": {
    "type": "_sbcs",
    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "pt154": {
    "type": "_sbcs",
    "chars": "ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "viscii": {
    "type": "_sbcs",
    "chars": "\u0000\u0001Ẳ\u0003\u0004ẴẪ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013Ỷ\u0015\u0016\u0017\u0018Ỹ\u001a\u001b\u001c\u001dỴ\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"
  },
  "iso646cn": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
  },
  "iso646jp": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
  },
  "hproman8": {
    "type": "_sbcs",
    "chars": " ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"
  },
  "macintosh": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "ascii": {
    "type": "_sbcs",
    "chars": "��������������������������������������������������������������������������������������������������������������������������������"
  },
  "tis620": {
    "type": "_sbcs",
    "chars": "���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  }
}

/***/ }),

/***/ 288:
/***/ ((module) => {

"use strict";


// Manually added data to be used by sbcs codec in addition to generated one.

module.exports = {
    // Not supported by iconv, not sure why.
    "10029": "maccenteuro",
    "maccenteuro": {
        "type": "_sbcs",
        "chars": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
    },

    "808": "cp808",
    "ibm808": "cp808",
    "cp808": {
        "type": "_sbcs",
        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
    },

    "mik": {
        "type": "_sbcs",
        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },

    // Aliases of generated encodings.
    "ascii8bit": "ascii",
    "usascii": "ascii",
    "ansix34": "ascii",
    "ansix341968": "ascii",
    "ansix341986": "ascii",
    "csascii": "ascii",
    "cp367": "ascii",
    "ibm367": "ascii",
    "isoir6": "ascii",
    "iso646us": "ascii",
    "iso646irv": "ascii",
    "us": "ascii",

    "latin1": "iso88591",
    "latin2": "iso88592",
    "latin3": "iso88593",
    "latin4": "iso88594",
    "latin5": "iso88599",
    "latin6": "iso885910",
    "latin7": "iso885913",
    "latin8": "iso885914",
    "latin9": "iso885915",
    "latin10": "iso885916",

    "csisolatin1": "iso88591",
    "csisolatin2": "iso88592",
    "csisolatin3": "iso88593",
    "csisolatin4": "iso88594",
    "csisolatincyrillic": "iso88595",
    "csisolatinarabic": "iso88596",
    "csisolatingreek" : "iso88597",
    "csisolatinhebrew": "iso88598",
    "csisolatin5": "iso88599",
    "csisolatin6": "iso885910",

    "l1": "iso88591",
    "l2": "iso88592",
    "l3": "iso88593",
    "l4": "iso88594",
    "l5": "iso88599",
    "l6": "iso885910",
    "l7": "iso885913",
    "l8": "iso885914",
    "l9": "iso885915",
    "l10": "iso885916",

    "isoir14": "iso646jp",
    "isoir57": "iso646cn",
    "isoir100": "iso88591",
    "isoir101": "iso88592",
    "isoir109": "iso88593",
    "isoir110": "iso88594",
    "isoir144": "iso88595",
    "isoir127": "iso88596",
    "isoir126": "iso88597",
    "isoir138": "iso88598",
    "isoir148": "iso88599",
    "isoir157": "iso885910",
    "isoir166": "tis620",
    "isoir179": "iso885913",
    "isoir199": "iso885914",
    "isoir203": "iso885915",
    "isoir226": "iso885916",

    "cp819": "iso88591",
    "ibm819": "iso88591",

    "cyrillic": "iso88595",

    "arabic": "iso88596",
    "arabic8": "iso88596",
    "ecma114": "iso88596",
    "asmo708": "iso88596",

    "greek" : "iso88597",
    "greek8" : "iso88597",
    "ecma118" : "iso88597",
    "elot928" : "iso88597",

    "hebrew": "iso88598",
    "hebrew8": "iso88598",

    "turkish": "iso88599",
    "turkish8": "iso88599",

    "thai": "iso885911",
    "thai8": "iso885911",

    "celtic": "iso885914",
    "celtic8": "iso885914",
    "isoceltic": "iso885914",

    "tis6200": "tis620",
    "tis62025291": "tis620",
    "tis62025330": "tis620",

    "10000": "macroman",
    "10006": "macgreek",
    "10007": "maccyrillic",
    "10079": "maciceland",
    "10081": "macturkish",

    "cspc8codepage437": "cp437",
    "cspc775baltic": "cp775",
    "cspc850multilingual": "cp850",
    "cspcp852": "cp852",
    "cspc862latinhebrew": "cp862",
    "cpgr": "cp869",

    "msee": "cp1250",
    "mscyrl": "cp1251",
    "msansi": "cp1252",
    "msgreek": "cp1253",
    "msturk": "cp1254",
    "mshebr": "cp1255",
    "msarab": "cp1256",
    "winbaltrim": "cp1257",

    "cp20866": "koi8r",
    "20866": "koi8r",
    "ibm878": "koi8r",
    "cskoi8r": "koi8r",

    "cp21866": "koi8u",
    "21866": "koi8u",
    "ibm1168": "koi8u",

    "strk10482002": "rk1048",

    "tcvn5712": "tcvn",
    "tcvn57121": "tcvn",

    "gb198880": "iso646cn",
    "cn": "iso646cn",

    "csiso14jisc6220ro": "iso646jp",
    "jisc62201969ro": "iso646jp",
    "jp": "iso646jp",

    "cshproman8": "hproman8",
    "r8": "hproman8",
    "roman8": "hproman8",
    "xroman8": "hproman8",
    "ibm1051": "hproman8",

    "mac": "macintosh",
    "csmacintosh": "macintosh",
};



/***/ }),

/***/ 1279:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(2399).Buffer);

// Note: UTF16-LE (or UCS2) codec is Node.js native. See encodings/internal.js

// == UTF16-BE codec. ==========================================================

exports.utf16be = Utf16BECodec;
function Utf16BECodec() {
}

Utf16BECodec.prototype.encoder = Utf16BEEncoder;
Utf16BECodec.prototype.decoder = Utf16BEDecoder;
Utf16BECodec.prototype.bomAware = true;


// -- Encoding

function Utf16BEEncoder() {
}

Utf16BEEncoder.prototype.write = function(str) {
    var buf = Buffer.from(str, 'ucs2');
    for (var i = 0; i < buf.length; i += 2) {
        var tmp = buf[i]; buf[i] = buf[i+1]; buf[i+1] = tmp;
    }
    return buf;
}

Utf16BEEncoder.prototype.end = function() {
}


// -- Decoding

function Utf16BEDecoder() {
    this.overflowByte = -1;
}

Utf16BEDecoder.prototype.write = function(buf) {
    if (buf.length == 0)
        return '';

    var buf2 = Buffer.alloc(buf.length + 1),
        i = 0, j = 0;

    if (this.overflowByte !== -1) {
        buf2[0] = buf[0];
        buf2[1] = this.overflowByte;
        i = 1; j = 2;
    }

    for (; i < buf.length-1; i += 2, j+= 2) {
        buf2[j] = buf[i+1];
        buf2[j+1] = buf[i];
    }

    this.overflowByte = (i == buf.length-1) ? buf[buf.length-1] : -1;

    return buf2.slice(0, j).toString('ucs2');
}

Utf16BEDecoder.prototype.end = function() {
}


// == UTF-16 codec =============================================================
// Decoder chooses automatically from UTF-16LE and UTF-16BE using BOM and space-based heuristic.
// Defaults to UTF-16LE, as it's prevalent and default in Node.
// http://en.wikipedia.org/wiki/UTF-16 and http://encoding.spec.whatwg.org/#utf-16le
// Decoder default can be changed: iconv.decode(buf, 'utf16', {defaultEncoding: 'utf-16be'});

// Encoder uses UTF-16LE and prepends BOM (which can be overridden with addBOM: false).

exports.utf16 = Utf16Codec;
function Utf16Codec(codecOptions, iconv) {
    this.iconv = iconv;
}

Utf16Codec.prototype.encoder = Utf16Encoder;
Utf16Codec.prototype.decoder = Utf16Decoder;


// -- Encoding (pass-through)

function Utf16Encoder(options, codec) {
    options = options || {};
    if (options.addBOM === undefined)
        options.addBOM = true;
    this.encoder = codec.iconv.getEncoder('utf-16le', options);
}

Utf16Encoder.prototype.write = function(str) {
    return this.encoder.write(str);
}

Utf16Encoder.prototype.end = function() {
    return this.encoder.end();
}


// -- Decoding

function Utf16Decoder(options, codec) {
    this.decoder = null;
    this.initialBytes = [];
    this.initialBytesLen = 0;

    this.options = options || {};
    this.iconv = codec.iconv;
}

Utf16Decoder.prototype.write = function(buf) {
    if (!this.decoder) {
        // Codec is not chosen yet. Accumulate initial bytes.
        this.initialBytes.push(buf);
        this.initialBytesLen += buf.length;
        
        if (this.initialBytesLen < 16) // We need more bytes to use space heuristic (see below)
            return '';

        // We have enough bytes -> detect endianness.
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        this.initialBytes.length = this.initialBytesLen = 0;
    }

    return this.decoder.write(buf);
}

Utf16Decoder.prototype.end = function() {
    if (!this.decoder) {
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);

        var res = this.decoder.write(buf),
            trail = this.decoder.end();

        return trail ? (res + trail) : res;
    }
    return this.decoder.end();
}

function detectEncoding(buf, defaultEncoding) {
    var enc = defaultEncoding || 'utf-16le';

    if (buf.length >= 2) {
        // Check BOM.
        if (buf[0] == 0xFE && buf[1] == 0xFF) // UTF-16BE BOM
            enc = 'utf-16be';
        else if (buf[0] == 0xFF && buf[1] == 0xFE) // UTF-16LE BOM
            enc = 'utf-16le';
        else {
            // No BOM found. Try to deduce encoding from initial content.
            // Most of the time, the content has ASCII chars (U+00**), but the opposite (U+**00) is uncommon.
            // So, we count ASCII as if it was LE or BE, and decide from that.
            var asciiCharsLE = 0, asciiCharsBE = 0, // Counts of chars in both positions
                _len = Math.min(buf.length - (buf.length % 2), 64); // Len is always even.

            for (var i = 0; i < _len; i += 2) {
                if (buf[i] === 0 && buf[i+1] !== 0) asciiCharsBE++;
                if (buf[i] !== 0 && buf[i+1] === 0) asciiCharsLE++;
            }

            if (asciiCharsBE > asciiCharsLE)
                enc = 'utf-16be';
            else if (asciiCharsBE < asciiCharsLE)
                enc = 'utf-16le';
        }
    }

    return enc;
}




/***/ }),

/***/ 758:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var Buffer = (__webpack_require__(2399).Buffer);

// UTF-7 codec, according to https://tools.ietf.org/html/rfc2152
// See also below a UTF-7-IMAP codec, according to http://tools.ietf.org/html/rfc3501#section-5.1.3

exports.utf7 = Utf7Codec;
exports.unicode11utf7 = 'utf7'; // Alias UNICODE-1-1-UTF-7
function Utf7Codec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7Codec.prototype.encoder = Utf7Encoder;
Utf7Codec.prototype.decoder = Utf7Decoder;
Utf7Codec.prototype.bomAware = true;


// -- Encoding

var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;

function Utf7Encoder(options, codec) {
    this.iconv = codec.iconv;
}

Utf7Encoder.prototype.write = function(str) {
    // Naive implementation.
    // Non-direct chars are encoded as "+<base64>-"; single "+" char is encoded as "+-".
    return Buffer.from(str.replace(nonDirectChars, function(chunk) {
        return "+" + (chunk === '+' ? '' : 
            this.iconv.encode(chunk, 'utf16-be').toString('base64').replace(/=+$/, '')) 
            + "-";
    }.bind(this)));
}

Utf7Encoder.prototype.end = function() {
}


// -- Decoding

function Utf7Decoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64Regex = /[A-Za-z0-9\/+]/;
var base64Chars = [];
for (var i = 0; i < 256; i++)
    base64Chars[i] = base64Regex.test(String.fromCharCode(i));

var plusChar = '+'.charCodeAt(0), 
    minusChar = '-'.charCodeAt(0),
    andChar = '&'.charCodeAt(0);

Utf7Decoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '+'
            if (buf[i] == plusChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64Chars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) {// "+-" -> "+"
                    res += "+";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString();
                    res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus is absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString();

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7Decoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(Buffer.from(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}


// UTF-7-IMAP codec.
// RFC3501 Sec. 5.1.3 Modified UTF-7 (http://tools.ietf.org/html/rfc3501#section-5.1.3)
// Differences:
//  * Base64 part is started by "&" instead of "+"
//  * Direct characters are 0x20-0x7E, except "&" (0x26)
//  * In Base64, "," is used instead of "/"
//  * Base64 must not be used to represent direct characters.
//  * No implicit shift back from Base64 (should always end with '-')
//  * String must end in non-shifted position.
//  * "-&" while in base64 is not allowed.


exports.utf7imap = Utf7IMAPCodec;
function Utf7IMAPCodec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
Utf7IMAPCodec.prototype.bomAware = true;


// -- Encoding

function Utf7IMAPEncoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = Buffer.alloc(6);
    this.base64AccumIdx = 0;
}

Utf7IMAPEncoder.prototype.write = function(str) {
    var inBase64 = this.inBase64,
        base64Accum = this.base64Accum,
        base64AccumIdx = this.base64AccumIdx,
        buf = Buffer.alloc(str.length*5 + 10), bufIdx = 0;

    for (var i = 0; i < str.length; i++) {
        var uChar = str.charCodeAt(i);
        if (0x20 <= uChar && uChar <= 0x7E) { // Direct character or '&'.
            if (inBase64) {
                if (base64AccumIdx > 0) {
                    bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
                    base64AccumIdx = 0;
                }

                buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
                inBase64 = false;
            }

            if (!inBase64) {
                buf[bufIdx++] = uChar; // Write direct character

                if (uChar === andChar)  // Ampersand -> '&-'
                    buf[bufIdx++] = minusChar;
            }

        } else { // Non-direct character
            if (!inBase64) {
                buf[bufIdx++] = andChar; // Write '&', then go to base64 mode.
                inBase64 = true;
            }
            if (inBase64) {
                base64Accum[base64AccumIdx++] = uChar >> 8;
                base64Accum[base64AccumIdx++] = uChar & 0xFF;

                if (base64AccumIdx == base64Accum.length) {
                    bufIdx += buf.write(base64Accum.toString('base64').replace(/\//g, ','), bufIdx);
                    base64AccumIdx = 0;
                }
            }
        }
    }

    this.inBase64 = inBase64;
    this.base64AccumIdx = base64AccumIdx;

    return buf.slice(0, bufIdx);
}

Utf7IMAPEncoder.prototype.end = function() {
    var buf = Buffer.alloc(10), bufIdx = 0;
    if (this.inBase64) {
        if (this.base64AccumIdx > 0) {
            bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
            this.base64AccumIdx = 0;
        }

        buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
        this.inBase64 = false;
    }

    return buf.slice(0, bufIdx);
}


// -- Decoding

function Utf7IMAPDecoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64IMAPChars = base64Chars.slice();
base64IMAPChars[','.charCodeAt(0)] = true;

Utf7IMAPDecoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.
    // It is forgiving, closer to standard UTF-7 (for example, '-' is optional at the end).

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '&'
            if (buf[i] == andChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64IMAPChars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) { // "&-" -> "&"
                    res += "&";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString().replace(/,/g, '/');
                    res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus may be absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString().replace(/,/g, '/');

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7IMAPDecoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(Buffer.from(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}




/***/ }),

/***/ 5395:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var BOMChar = '\uFEFF';

exports.PrependBOM = PrependBOMWrapper
function PrependBOMWrapper(encoder, options) {
    this.encoder = encoder;
    this.addBOM = true;
}

PrependBOMWrapper.prototype.write = function(str) {
    if (this.addBOM) {
        str = BOMChar + str;
        this.addBOM = false;
    }

    return this.encoder.write(str);
}

PrependBOMWrapper.prototype.end = function() {
    return this.encoder.end();
}


//------------------------------------------------------------------------------

exports.StripBOM = StripBOMWrapper;
function StripBOMWrapper(decoder, options) {
    this.decoder = decoder;
    this.pass = false;
    this.options = options || {};
}

StripBOMWrapper.prototype.write = function(buf) {
    var res = this.decoder.write(buf);
    if (this.pass || !res)
        return res;

    if (res[0] === BOMChar) {
        res = res.slice(1);
        if (typeof this.options.stripBOM === 'function')
            this.options.stripBOM();
    }

    this.pass = true;
    return res;
}

StripBOMWrapper.prototype.end = function() {
    return this.decoder.end();
}



/***/ }),

/***/ 4914:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// Some environments don't have global Buffer (e.g. React Native).
// Solution would be installing npm modules "buffer" and "stream" explicitly.
var Buffer = (__webpack_require__(2399).Buffer);

var bomHandling = __webpack_require__(5395),
    iconv = module.exports;

// All codecs and aliases are kept here, keyed by encoding name/alias.
// They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
iconv.encodings = null;

// Characters emitted in case of error.
iconv.defaultCharUnicode = '�';
iconv.defaultCharSingleByte = '?';

// Public API.
iconv.encode = function encode(str, encoding, options) {
    str = "" + (str || ""); // Ensure string.

    var encoder = iconv.getEncoder(encoding, options);

    var res = encoder.write(str);
    var trail = encoder.end();
    
    return (trail && trail.length > 0) ? Buffer.concat([res, trail]) : res;
}

iconv.decode = function decode(buf, encoding, options) {
    if (typeof buf === 'string') {
        if (!iconv.skipDecodeWarning) {
            console.error('Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding');
            iconv.skipDecodeWarning = true;
        }

        buf = Buffer.from("" + (buf || ""), "binary"); // Ensure buffer.
    }

    var decoder = iconv.getDecoder(encoding, options);

    var res = decoder.write(buf);
    var trail = decoder.end();

    return trail ? (res + trail) : res;
}

iconv.encodingExists = function encodingExists(enc) {
    try {
        iconv.getCodec(enc);
        return true;
    } catch (e) {
        return false;
    }
}

// Legacy aliases to convert functions
iconv.toEncoding = iconv.encode;
iconv.fromEncoding = iconv.decode;

// Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
iconv._codecDataCache = {};
iconv.getCodec = function getCodec(encoding) {
    if (!iconv.encodings)
        iconv.encodings = __webpack_require__(6934); // Lazy load all encoding definitions.
    
    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
    var enc = iconv._canonicalizeEncoding(encoding);

    // Traverse iconv.encodings to find actual codec.
    var codecOptions = {};
    while (true) {
        var codec = iconv._codecDataCache[enc];
        if (codec)
            return codec;

        var codecDef = iconv.encodings[enc];

        switch (typeof codecDef) {
            case "string": // Direct alias to other encoding.
                enc = codecDef;
                break;

            case "object": // Alias with options. Can be layered.
                for (var key in codecDef)
                    codecOptions[key] = codecDef[key];

                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;
                
                enc = codecDef.type;
                break;

            case "function": // Codec itself.
                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;

                // The codec function must load all tables and return object with .encoder and .decoder methods.
                // It'll be called only once (for each different options object).
                codec = new codecDef(codecOptions, iconv);

                iconv._codecDataCache[codecOptions.encodingName] = codec; // Save it to be reused later.
                return codec;

            default:
                throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '"+enc+"')");
        }
    }
}

iconv._canonicalizeEncoding = function(encoding) {
    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
    return (''+encoding).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
}

iconv.getEncoder = function getEncoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        encoder = new codec.encoder(options, codec);

    if (codec.bomAware && options && options.addBOM)
        encoder = new bomHandling.PrependBOM(encoder, options);

    return encoder;
}

iconv.getDecoder = function getDecoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        decoder = new codec.decoder(options, codec);

    if (codec.bomAware && !(options && options.stripBOM === false))
        decoder = new bomHandling.StripBOM(decoder, options);

    return decoder;
}


// Load extensions in Node. All of them are omitted in Browserify build via 'browser' field in package.json.
var nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node;
if (nodeVer) {

    // Load streaming support in Node v0.10+
    var nodeVerArr = nodeVer.split(".").map(Number);
    if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
        __webpack_require__(9331)(iconv);
    }

    // Load Node primitive extensions.
    __webpack_require__(9527)(iconv);
}

if (false) {}


/***/ }),

/***/ 645:
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 9509:
/***/ ((module, exports, __webpack_require__) => {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(8764)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ 2399:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint-disable node/no-deprecated-api */



var buffer = __webpack_require__(8764)
var Buffer = buffer.Buffer

var safer = {}

var key

for (key in buffer) {
  if (!buffer.hasOwnProperty(key)) continue
  if (key === 'SlowBuffer' || key === 'Buffer') continue
  safer[key] = buffer[key]
}

var Safer = safer.Buffer = {}
for (key in Buffer) {
  if (!Buffer.hasOwnProperty(key)) continue
  if (key === 'allocUnsafe' || key === 'allocUnsafeSlow') continue
  Safer[key] = Buffer[key]
}

safer.Buffer.prototype = Buffer.prototype

if (!Safer.from || Safer.from === Uint8Array.from) {
  Safer.from = function (value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value)
    }
    if (value && typeof value.length === 'undefined') {
      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' + typeof value)
    }
    return Buffer(value, encodingOrOffset, length)
  }
}

if (!Safer.alloc) {
  Safer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
    }
    if (size < 0 || size >= 2 * (1 << 30)) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
    var buf = Buffer(size)
    if (!fill || fill.length === 0) {
      buf.fill(0)
    } else if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
    return buf
  }
}

if (!safer.kStringMaxLength) {
  try {
    safer.kStringMaxLength = process.binding('buffer').kStringMaxLength
  } catch (e) {
    // we can't determine kStringMaxLength in environments where process.binding
    // is unsupported, so let's not set it
  }
}

if (!safer.constants) {
  safer.constants = {
    MAX_LENGTH: safer.kMaxLength
  }
  if (safer.kStringMaxLength) {
    safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength
  }
}

module.exports = safer


/***/ }),

/***/ 2553:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = (__webpack_require__(9509).Buffer);
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.s = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ 3379:
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ 9216:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 3565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 7795:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 4589:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ 555:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _config_setup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2393);
/* harmony import */ var vant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8871);
/* harmony import */ var vant__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vant__WEBPACK_IMPORTED_MODULE_1__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'Importpage',
  data() {
    return {
      codeText: ''
    }
  },
  methods: {
    getCode() {
      try {
        // eslint-disable-next-line no-eval
        const code = eval(this.codeText)
        const userWebInfo = (0,_config_setup__WEBPACK_IMPORTED_MODULE_0__/* .getStorage */ .cF)('userWebInfo')
        if (code.length > 0) {
          code.forEach(element => {
            userWebInfo.unshift(element)
          })
        }
        (0,_config_setup__WEBPACK_IMPORTED_MODULE_0__/* .setStorage */ .po)('userWebInfo', userWebInfo)
        this.$bus.$emit('getWeb')
        ;(0,vant__WEBPACK_IMPORTED_MODULE_1__.Toast)({
          message: '已导入',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.$bus.$emit('changeSetupFirstPage')
        }, 1000)
      } catch (error) {
        (0,vant__WEBPACK_IMPORTED_MODULE_1__.Toast)({
          message: '请粘贴正确JSON文字',
          getContainer: '.card',
          position: 'bottom'
        })
      }
    }
  }
});


/***/ }),

/***/ 6758:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hi": () => (/* binding */ AppDownloadUrl),
/* harmony export */   "KR": () => (/* binding */ AppSupportUrl),
/* harmony export */   "QW": () => (/* binding */ AppUpdateUrl),
/* harmony export */   "W1": () => (/* binding */ AppReleaseVersion),
/* harmony export */   "YQ": () => (/* binding */ AppBuildId),
/* harmony export */   "bF": () => (/* binding */ AppVersion),
/* harmony export */   "lW": () => (/* binding */ AppName),
/* harmony export */   "r8": () => (/* binding */ isDev),
/* harmony export */   "x5": () => (/* binding */ AppHomepageUrl)
/* harmony export */ });
/* unused harmony export AppEnv */
/* eslint-disable no-undef */
const AppName = "10图漫"
const AppVersion = "2.0.12"
<<<<<<< HEAD
const AppReleaseVersion = "2.0.12.20260531073304"
const AppBuildId = "20260531073304"
=======
const AppReleaseVersion = "2.0.12.20260531070138"
const AppBuildId = "20260531070138"
>>>>>>> ef7c7d419c525092f41e999e15e97985a9706330
const AppEnv = "production"
const AppHomepageUrl = "https://github.com/zzzwannasleep/10Comic-W.Ver"
const AppSupportUrl = "https://github.com/zzzwannasleep/10Comic-W.Ver/issues"
const AppUpdateUrl = "https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.meta.js"
const AppDownloadUrl = "https://raw.githubusercontent.com/zzzwannasleep/10Comic-W.Ver/main/release/10comic.user.js"
const isDev = AppEnv === 'development'




/***/ }),

/***/ 2393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Iq": () => (/* binding */ appLoadinit),
/* harmony export */   "cF": () => (/* binding */ getStorage),
/* harmony export */   "po": () => (/* binding */ setStorage),
/* harmony export */   "z1": () => (/* binding */ defaultPanSettings),
/* harmony export */   "zU": () => (/* binding */ setinit)
/* harmony export */ });
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6758);
/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-undef */


const defaultPanSettings = {
  activeProvider: 'quark',
  quarkCookie: '',
  quarkTargetDirId: '0',
  ucCookie: '',
  ucTargetDirId: '0',
  pan123Cookie: '',
  pan123TargetDirId: '0'
}

const configDefault = {
  version: _config_index__WEBPACK_IMPORTED_MODULE_0__/* .AppVersion */ .bF,
  appLoadDefault: {
    isShowUI: false,
    loadHotKey: 'V',
    rightSize: 100,
    centerSize: 100
  },
  maxChapterNum: 2,
  maxPictureNum: 3,
  downType: 0,
  maxSplicingHeight: 20000,
  imgIndexBitNum: 3,
  batchFolderPrefix: '#',
  imgSplicingFlag: true,
  imgDownRange: [1, -1],
  zipNameTemplate: '[站点名字][作者名][漫画名称][章节名称][多少P]',
  metadataSettings: {
    enableComicInfoXml: true,
    enableSeriesJson: false,
    enableSeriesCover: false,
    enableMetadataPreview: false,
    enableBangumiScrape: false,
    bangumiAccessToken: '',
    bangumiIncludeNsfw: false,
    languageISO: 'zh',
    publisher: ''
  },
  followSettings: {
    autoCheckOnLoad: true,
    checkCooldownMinutes: 30
  },
  updateSettings: {
    autoCheckOnLoad: true,
    checkIntervalHours: 12
  },
  followCheckState: {
    lastCheckAt: 0,
    lastUpdateCount: 0
  },
  updateCheckState: {
    lastCheckAt: 0,
    lastSuccessCheckAt: 0,
    lastFailureCheckAt: 0,
    lastPromptVersion: '',
    lastPromptReleaseKey: '',
    latestVersion: '',
    latestBuildId: '',
    latestDownloadUrl: '',
    latestUpdateUrl: '',
    lastResult: 'idle',
    lastReason: '',
    lastSourceUrl: ''
  },
  followList: [],
  followSearchWebNames: [],
  bangumiMetadataCache: {},
  panSettings: { ...defaultPanSettings },
  userWebInfo: [],
  rootDir: ''
}

const localStorageDefault = {
  ylComicDownHistory: '[]'
}

const abandonDefault = ['downHistory']

const appLoadinit = () => {
  if (_config_index__WEBPACK_IMPORTED_MODULE_0__/* .isDev */ .r8) {
    return
  }

  for (const key in localStorageDefault) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, localStorageDefault[key])
    }
  }

  for (const key in configDefault) {
    if (GM_getValue(key) === undefined) {
      GM_setValue(key, configDefault[key])
    }
  }

  if (GM_getValue('rootDir') === '10Comic') {
    GM_setValue('rootDir', '')
  }

  if (GM_getValue('version') !== undefined && GM_getValue('version') === _config_index__WEBPACK_IMPORTED_MODULE_0__/* .AppVersion */ .bF) {
    return
  }

  abandonDefault.forEach((word) => {
    if (GM_getValue(word) !== undefined) {
      GM_deleteValue(word)
    }
  })

  GM_setValue('version', _config_index__WEBPACK_IMPORTED_MODULE_0__/* .AppVersion */ .bF)
  GM_setValue('maxChapterNum', 2)

  return true
}

const setinit = async() => {
  return new Promise((resolve) => {
    if (_config_index__WEBPACK_IMPORTED_MODULE_0__/* .isDev */ .r8) {
      resolve(false)
      return
    }
    for (const key in configDefault) {
      GM_setValue(key, configDefault[key])
    }
    resolve(true)
  })
}

const setStorage = (key, value, key2 = null) => {
  if (key2) {
    const obj = GM_getValue(key) || {}
    obj[key2] = value
    value = obj
  }
  GM_setValue(key, value)
  return true
}

const getStorage = (key) => {
  return GM_getValue(key)
}


/***/ }),

/***/ 8872:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EQ": () => (/* binding */ getSearchableWebList),
/* harmony export */   "HL": () => (/* binding */ matchWeb),
/* harmony export */   "HN": () => (/* binding */ requestTextWithGuard),
/* harmony export */   "Iw": () => (/* binding */ searchComicsAcrossWebs),
/* harmony export */   "KK": () => (/* binding */ getComicInfoFromHtml),
/* harmony export */   "Ni": () => (/* binding */ searchFunTemplate_1),
/* harmony export */   "Os": () => (/* binding */ comicsWebInfo),
/* harmony export */   "Po": () => (/* binding */ currentComics),
/* harmony export */   "eT": () => (/* binding */ getWebList),
/* harmony export */   "jL": () => (/* binding */ findWebByUrl),
/* harmony export */   "lb": () => (/* binding */ getCurrentComicMeta)
/* harmony export */ });
/* unused harmony exports isChallengePage, searchComicOnWeb, getAuthorNameFromDom, getChapterListFromRoot */
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3624);
/* harmony import */ var iconv_lite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4914);
/* harmony import */ var iconv_lite__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(iconv_lite__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_setup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2393);
/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */

// eslint-disable-next-line no-unused-vars





const challengePageReg = /challenge-platform|cf-browser-verification|cf-chl-|cf-turnstile|cf-challenge|cf-wrapper|verify you are human|attention required|checking if the site connection is secure|security check to access|just a moment\.\.\.|why do i have to complete a captcha/i

const getResponseText = (response) => {
  if (!response) {
    return ''
  }
  if (typeof response === 'string') {
    return response
  }
  return response.responseText || response.response || ''
}

const resolveUrl = (url, baseUrl) => {
  if (!url) {
    return ''
  }
  try {
    return new URL(url, baseUrl).href
  } catch (error) {
    return url
  }
}

const getSearchResultAnchor = (element, namelinkIndex = 0) => {
  const preferredAnchor = element.querySelector('h1 a, h2 a, h3 a, h4 a, dt a, .title a, .comic-title a, .comic__title a, .book-title a')
  if (preferredAnchor) {
    return preferredAnchor
  }
  const anchorList = [...element.querySelectorAll('a')]
  const targetAnchor = anchorList.find(anchor => (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(anchor?.getAttribute('title') || anchor?.innerText || anchor?.textContent || ''))
  return targetAnchor || anchorList[namelinkIndex] || anchorList[0] || null
}

const toCleanText = (value = '') => {
  return String(value || '')
    .replace(/\r|\n/g, '')
    .trim()
}

const toUint8Array = (value) => {
  if (!value) {
    return new Uint8Array()
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value)
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  }
  return new Uint8Array()
}

const encodeTextByCharset = (text, charset = 'utf-8') => {
  const encoded = iconv_lite__WEBPACK_IMPORTED_MODULE_1___default().encode(String(text || ''), charset)
  const bytes = toUint8Array(encoded)
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

const decodeBinaryByCharset = (value, charset = 'utf-8') => {
  return iconv_lite__WEBPACK_IMPORTED_MODULE_1___default().decode(toUint8Array(value), charset)
}

const isChallengePage = (html) => {
  return challengePageReg.test(String(html || ''))
}

const requestTextWithGuard = async({ method = 'get', url, data = '', headers = '', useCookie = false, purpose = '页面', openVerifyOnChallenge = true, verifyUrl = '' }) => {
  const response = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method, url, data, headers, useCookie })
  const responseText = getResponseText(response)
  if (!responseText) {
    throw new Error(`未获取到${purpose}`)
  }
  if (isChallengePage(responseText)) {
    if (openVerifyOnChallenge) {
      (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .openVerifyPage */ .XB)(verifyUrl || url)
    }
    throw new Error(`检测到 Cloudflare 验证，已打开${purpose}，请手动通过后重试`)
  }
  return responseText
}

const searchFunTemplate_1 = async(data, keyword) => {
  // eslint-disable-next-line prefer-const
  let { search_add_url, search_pre, alllist_dom_css, minlist_dom_css, namelink_index, img_src, use_background, img_reg, match_reg_num } = data.searchTemplate_1
  namelink_index ? namelink_index-- : namelink_index = 0
  const searchPathList = Array.isArray(search_add_url) ? search_add_url : [search_add_url]
  let headers = ''
  data.headers ? headers = data.headers : ''
  const currentKeyword = encodeURIComponent(String(keyword || '').trim())
  let lastError = null

  for (let i = 0; i < searchPathList.length; i++) {
    const searchUrl = (search_pre || data.homepage) + searchPathList[i] + currentKeyword
    try {
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        data: '',
        headers,
        purpose: `${data.webName} 搜索页`
      })
      const dom = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText).querySelector(alllist_dom_css)
      if (!dom) {
        continue
      }

      const domList = dom.querySelectorAll(minlist_dom_css)
      const searchList = []
      domList.forEach(element => {
        const obj = {}
        try {
          const anchorDom = getSearchResultAnchor(element, namelink_index)
          obj.name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(anchorDom?.getAttribute('title') || anchorDom?.innerText || anchorDom?.textContent || '')
          obj.url = resolveUrl(anchorDom?.getAttribute('href') || '', searchUrl)

          if (!use_background) {
            if (!img_reg) {
              const imgDom = element.querySelector('img')
              const rawImageUrl = imgDom?.getAttribute(img_src || 'src') ||
                imgDom?.getAttribute('data-src') ||
                imgDom?.getAttribute('data-original') ||
                imgDom?.getAttribute('data-lazy-src') ||
                imgDom?.getAttribute('src') ||
                ''
              if (rawImageUrl) {
                obj.imageUrl = resolveUrl(rawImageUrl, searchUrl)
              } else if (img_src) {
                const reg2 = eval('/' + img_src + `=('|")(.*?)('|")` + '/')
                obj.imageUrl = resolveUrl(element.innerHTML.match(reg2)?.[2] || '', searchUrl)
              } else {
                obj.imageUrl = ''
              }
            } else {
              obj.imageUrl = resolveUrl(element.innerHTML.match(img_reg)?.[match_reg_num] || '', searchUrl)
            }
          } else {
            obj.imageUrl = resolveUrl(element.innerHTML.match(/background.*?(url)\('?(.*?)'?\)/)?.[2] || '', searchUrl)
          }

          if (obj.name === '') {
            let titleArr = element.innerHTML.match(/title=('|")(.*?)('|")/)
            ;(titleArr && titleArr.length >= 2) ? (obj.name = titleArr[2])
              : (titleArr = element.innerHTML.match(/alt=('|")(.*?)('|")/),
              (titleArr && titleArr.length >= 2) ? obj.name = titleArr[2] : '')
            obj.name === '' ? obj.name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(element.querySelectorAll('a')[namelink_index]?.innerText || '') : ''
          }
        } catch (error) {
          console.log('error: ', data.webName, error)
        }
        if (obj.name || obj.url) {
          searchList.push(obj)
        }
      })

      if (searchList.length > 0 || domList.length === 0) {
        return searchList
      }
    } catch (error) {
      lastError = error
      if (String(error?.message || '').includes('Cloudflare')) {
        throw error
      }
    }
  }

  if (lastError) {
    throw lastError
  }
  return []
}

const searchComicOnWeb = async(webRule, keyword) => {
  const currentWebRule = normalizeWebRule(webRule)
  if (!currentWebRule?.searchTemplate_1 && !currentWebRule?.searchFun) {
    return []
  }

  if (currentWebRule.searchTemplate_1) {
    return searchFunTemplate_1(currentWebRule, keyword)
  }

  if (currentWebRule.searchFun) {
    return currentWebRule.searchFun(keyword)
  }

  return []
}

const NHENTAI_API_ROOT = 'https://nhentai.net/api/v2'
const NHENTAI_API_HEADERS = {
  Accept: 'application/json',
  'User-Agent': '10Comic-W.Ver/nhentai (https://github.com/zzzwannasleep/10Comic-W.Ver)'
}
const NHENTAI_DOWNLOAD_SOURCE_API = 'api'
const NHENTAI_DOWNLOAD_SOURCE_WEB = 'web'
const NHENTAI_DOWNLOAD_SOURCE_OPTIONS = [
  { text: 'API', value: NHENTAI_DOWNLOAD_SOURCE_API },
  { text: '网页', value: NHENTAI_DOWNLOAD_SOURCE_WEB }
]

let nhentaiCdnConfigPromise = null

const getJsonByGuard = async(url, purpose, headers = '') => {
  const responseText = await requestTextWithGuard({
    method: 'get',
    url,
    headers,
    purpose,
    verifyUrl: 'https://nhentai.net/'
  })
  try {
    return JSON.parse(responseText)
  } catch (error) {
    throw new Error(`${purpose} response is not valid JSON`)
  }
}

const getNhentaiGalleryId = (url = '') => {
  const match = String(url || '').match(/\/g\/(\d+)(?:\/\d+)?\/?/i)
  return match?.[1] || ''
}

const normalizeNhentaiGalleryUrl = (url = '') => {
  const galleryId = getNhentaiGalleryId(url)
  if (!galleryId) {
    return url
  }
  return `https://nhentai.net/g/${galleryId}/`
}

const getNhentaiApiJson = async(path, purpose) => {
  return getJsonByGuard(`${NHENTAI_API_ROOT}${path}`, purpose, NHENTAI_API_HEADERS)
}

const getNhentaiCdnConfig = async() => {
  if (!nhentaiCdnConfigPromise) {
    nhentaiCdnConfigPromise = getNhentaiApiJson('/cdn', 'nhentai CDN config').catch((error) => {
      nhentaiCdnConfigPromise = null
      throw error
    })
  }
  return nhentaiCdnConfigPromise
}

const getNhentaiGallery = async(galleryId) => {
  if (!galleryId) {
    throw new Error('Failed to parse nhentai gallery id')
  }
  return getNhentaiApiJson(`/galleries/${galleryId}`, `nhentai gallery ${galleryId}`)
}

const getNhentaiTitleText = (title = {}) => {
  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(title.pretty || title.english || title.japanese || '')
}

const getNhentaiTitleFromPageTitle = (rawTitle = '') => {
  const title = String(rawTitle || '')
    .replace(/\s*[»禄]\s*nhentai.*$/i, '')
    .replace(/\s*-\s*Page\s+\d+\s*$/i, '')
    .trim()
  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(title)
}

const getNhentaiRootTitle = (root) => {
  const selectorList = ['h1 .pretty', 'h1.title', 'h1', 'title']
  for (let i = 0; i < selectorList.length; i++) {
    try {
      const dom = root?.querySelector(selectorList[i])
      const text = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(dom?.innerText || dom?.textContent || '')
      if (text) {
        return getNhentaiTitleFromPageTitle(text)
      }
    } catch (error) {
      //
    }
  }

  try {
    const docTitle = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(root?.title || '')
    if (docTitle) {
      return getNhentaiTitleFromPageTitle(docTitle)
    }
  } catch (error) {
    //
  }

  return getNhentaiTitleFromPageTitle(document?.title || '')
}

const getNhentaiTagNames = (tags = [], tagType = '') => {
  return (tags || [])
    .filter(item => !tagType || item?.type === tagType)
    .map(item => (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(item?.name || ''))
    .filter(Boolean)
}

const getNhentaiLanguageIso = (tags = []) => {
  const languageNameList = getNhentaiTagNames(tags, 'language').map(item => item.toLowerCase())
  const languageMap = {
    english: 'en',
    chinese: 'zh',
    japanese: 'ja',
    korean: 'ko',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    russian: 'ru',
    portuguese: 'pt',
    italian: 'it',
    thai: 'th',
    vietnamese: 'vi'
  }

  for (let i = 0; i < languageNameList.length; i++) {
    if (languageMap[languageNameList[i]]) {
      return languageMap[languageNameList[i]]
    }
  }
  return ''
}

const getNhentaiDownloadSource = (context = {}) => {
  const source = String(context?.imageSource || context?.downloadSource || '').trim().toLowerCase()
  return source === NHENTAI_DOWNLOAD_SOURCE_WEB ? NHENTAI_DOWNLOAD_SOURCE_WEB : NHENTAI_DOWNLOAD_SOURCE_API
}

const getNhentaiReaderPageUrl = (galleryId, pageNumber) => {
  if (!galleryId || !pageNumber) {
    return ''
  }
  return `https://nhentai.net/g/${galleryId}/${pageNumber}/`
}

const uniqUrlList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const getNhentaiNumberText = (value = '') => {
  const match = String(value || '').match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

const getNhentaiGalleryPageUrlsFromRoot = (root, pageUrl = '') => {
  const pageUrlList = []
  try {
    root?.querySelectorAll('a.gallerythumb[href*="/g/"]').forEach((item) => {
      const href = item?.getAttribute('href') || ''
      if (href) {
        pageUrlList.push(resolveUrl(href, pageUrl))
      }
    })
  } catch (error) {
    //
  }

  const uniquePageUrlList = uniqUrlList(pageUrlList)
  if (uniquePageUrlList.length > 0) {
    return uniquePageUrlList
  }

  const galleryId = getNhentaiGalleryId(pageUrl) ||
    getNhentaiGalleryId(root?.querySelector('.go-back[href*="/g/"]')?.getAttribute('href') || '')
  const numPages = getNhentaiNumberText(
    root?.querySelector('.reader-pagination .num-pages, .page-number .num-pages')?.textContent || ''
  )
  if (!galleryId || !numPages) {
    return []
  }

  return Array.from({ length: numPages }, (_, index) => getNhentaiReaderPageUrl(galleryId, index + 1)).filter(Boolean)
}

const getNhentaiReaderImageUrlFromRoot = (root, pageUrl = '') => {
  const selectorList = [
    '#image-container img',
    'section#image-container img',
    'img[alt^="Page "]'
  ]

  for (let i = 0; i < selectorList.length; i++) {
    try {
      const dom = root?.querySelector(selectorList[i])
      const rawUrl = dom?.getAttribute('data-src') ||
        dom?.getAttribute('data-lazy-src') ||
        dom?.getAttribute('src') ||
        ''
      if (rawUrl) {
        return resolveUrl(rawUrl, pageUrl)
      }
    } catch (error) {
      //
    }
  }

  return ''
}

const getNhentaiGalleryPageUrls = async(pageUrl, responseText = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText) : null
  let pageUrlList = getNhentaiGalleryPageUrlsFromRoot(currentRoot, currentPageUrl)
  if (pageUrlList.length > 0) {
    return pageUrlList
  }

  const galleryUrl = normalizeNhentaiGalleryUrl(currentPageUrl)
  if (!galleryUrl || galleryUrl === currentPageUrl) {
    return pageUrlList
  }

  const galleryText = await requestTextWithGuard({
    method: 'get',
    url: galleryUrl,
    purpose: 'nhentai gallery page',
    verifyUrl: galleryUrl
  })
  const galleryRoot = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(galleryText)
  pageUrlList = getNhentaiGalleryPageUrlsFromRoot(galleryRoot, galleryUrl)
  return pageUrlList
}

const getNhentaiWebImageList = async(pageUrl, responseText = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText) : null
  const directImageUrl = getNhentaiReaderImageUrlFromRoot(currentRoot, currentPageUrl)
  const pageUrlList = await getNhentaiGalleryPageUrls(currentPageUrl, responseText)

  if (pageUrlList.length === 0) {
    return directImageUrl ? [directImageUrl] : []
  }

  const imageUrlList = []
  const batchSize = 4
  for (let i = 0; i < pageUrlList.length; i += batchSize) {
    const batchList = pageUrlList.slice(i, i + batchSize)
    const batchResult = await Promise.all(batchList.map(async(currentReaderPageUrl) => {
      if (currentReaderPageUrl === currentPageUrl && directImageUrl) {
        return directImageUrl
      }

      const readerText = await requestTextWithGuard({
        method: 'get',
        url: currentReaderPageUrl,
        purpose: `nhentai reader page ${i + 1}`,
        verifyUrl: normalizeNhentaiGalleryUrl(currentReaderPageUrl)
      })
      const readerRoot = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(readerText)
      return getNhentaiReaderImageUrlFromRoot(readerRoot, currentReaderPageUrl)
    }))
    imageUrlList.push(...batchResult.filter(Boolean))
  }

  return imageUrlList
}

const buildNhentaiChapterName = (pageCount = 0) => {
  return pageCount > 0 ? `Full Gallery (${pageCount}P)` : 'Full Gallery'
}

const buildNhentaiChapterList = ({ galleryId, comicName = '', authorName = '', pageUrl = '', numPages = 0 }) => {
  if (!galleryId) {
    return []
  }

  const normalizedPageUrl = normalizeNhentaiGalleryUrl(pageUrl || `https://nhentai.net/g/${galleryId}/`)
  return [{
    comicName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName),
    authorName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(authorName),
    comicPageUrl: normalizedPageUrl,
    webName: 'nhentai',
    chapterNumStr: '',
    chapterName: buildNhentaiChapterName(numPages),
    downChapterName: '',
    url: normalizedPageUrl,
    characterType: 'one',
    readtype: 1,
    isPay: false,
    isSelect: false
  }]
}

const getNhentaiChapterListFromRoot = (root, pageUrl, comicName = '', authorName = '') => {
  const normalizedPageUrl = normalizeNhentaiGalleryUrl(pageUrl || window.location.href)
  const galleryId = getNhentaiGalleryId(normalizedPageUrl)
  if (!galleryId) {
    return []
  }

  const resolvedComicName = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName || getNhentaiRootTitle(root) || `nhentai ${galleryId}`)
  const numPages = getNhentaiGalleryPageUrlsFromRoot(root, normalizedPageUrl).length
  return buildNhentaiChapterList({
    galleryId,
    comicName: resolvedComicName,
    authorName,
    pageUrl: normalizedPageUrl,
    numPages
  })
}

const getNhentaiSearchResultName = (item = {}) => {
  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(item.english_title || item.japanese_title || `nhentai ${item.id || ''}`)
}

const getNhentaiSearchList = async(keyword) => {
  const currentKeyword = String(keyword || '').trim()
  if (!currentKeyword) {
    return []
  }

  const [searchResult, cdnConfig] = await Promise.all([
    getNhentaiApiJson(`/search?query=${encodeURIComponent(currentKeyword)}`, 'nhentai search'),
    getNhentaiCdnConfig()
  ])
  const thumbBaseUrl = `${cdnConfig?.thumb_servers?.[0] || 'https://t1.nhentai.net'}/`

  return (searchResult?.result || []).map((item) => {
    return {
      name: getNhentaiSearchResultName(item),
      url: `https://nhentai.net/g/${item.id}/`,
      imageUrl: resolveUrl(item.thumbnail, thumbBaseUrl)
    }
  })
}

const getNhentaiApiImageList = async(pageUrl) => {
  const galleryId = getNhentaiGalleryId(pageUrl)
  const [gallery, cdnConfig] = await Promise.all([
    getNhentaiGallery(galleryId),
    getNhentaiCdnConfig()
  ])
  const imageBaseUrl = `${cdnConfig?.image_servers?.[0] || 'https://i1.nhentai.net'}/`
  return (gallery?.pages || []).map(item => resolveUrl(item.path, imageBaseUrl))
}

const getNhentaiImageList = async(pageUrl, responseText = '', processData = {}) => {
  if (getNhentaiDownloadSource(processData) === NHENTAI_DOWNLOAD_SOURCE_WEB) {
    return getNhentaiWebImageList(pageUrl, responseText)
  }
  return getNhentaiApiImageList(pageUrl)
}

const getNhentaiMetadata = async(downloadItem = {}) => {
  if (getNhentaiDownloadSource(downloadItem) === NHENTAI_DOWNLOAD_SOURCE_WEB) {
    return null
  }

  const pageUrl = downloadItem?.comicPageUrl || downloadItem?.url || window.location.href
  const galleryId = getNhentaiGalleryId(pageUrl)
  if (!galleryId) {
    return null
  }

  const [gallery, cdnConfig] = await Promise.all([
    getNhentaiGallery(galleryId),
    getNhentaiCdnConfig()
  ])
  const artistList = getNhentaiTagNames(gallery?.tags, 'artist')
  const groupList = getNhentaiTagNames(gallery?.tags, 'group')
  const tagList = (gallery?.tags || [])
    .filter(item => !['artist', 'group', 'language', 'category'].includes(item?.type))
    .map(item => (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(item?.name || ''))
    .filter(Boolean)
  const coverBaseUrl = `${cdnConfig?.image_servers?.[0] || 'https://i1.nhentai.net'}/`

  return {
    source: 'nhentai API',
    seriesTitle: getNhentaiTitleText(gallery?.title) || downloadItem?.comicName || '',
    originalTitle: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(gallery?.title?.japanese || '') || getNhentaiTitleText(gallery?.title) || downloadItem?.comicName || '',
    summary: '',
    writers: artistList.length > 0 ? artistList : groupList,
    illustrators: artistList,
    tags: tagList,
    publisher: groupList[0] || '',
    issueCount: downloadItem?.seriesChapterCount || undefined,
    releaseDate: gallery?.upload_date ? new Date(gallery.upload_date * 1000).toISOString().slice(0, 10) : '',
    status: 'ended',
    ageRating: 'R18+',
    languageISO: getNhentaiLanguageIso(gallery?.tags),
    subjectUrl: normalizeNhentaiGalleryUrl(pageUrl),
    coverUrl: gallery?.cover?.path ? resolveUrl(gallery.cover.path, coverBaseUrl) : ''
  }
}

const EHENTAI_HOMEPAGE = 'https://e-hentai.org/'
const EHENTAI_API_URL = 'https://api.e-hentai.org/api.php'
const EHENTAI_GALLERY_PAGE_SIZE = 20
const EHENTAI_IMAGE_LINK_TEXT_REG = /download original|full[-\s]size image|open full[-\s]size image/i
const EHENTAI_IMAGE_PLACEHOLDER_REG = /\/(?:blank|mr)\.gif(?:$|[?#])/i

const postJsonByGuard = async(url, payload, purpose, headers = {}) => {
  const responseText = await requestTextWithGuard({
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    data: JSON.stringify(payload || {}),
    purpose,
    verifyUrl: EHENTAI_HOMEPAGE
  })

  try {
    return JSON.parse(responseText)
  } catch (error) {
    throw new Error(`${purpose} response is not valid JSON`)
  }
}

const getEhentaiApiJson = async(payload, purpose) => {
  return postJsonByGuard(EHENTAI_API_URL, payload, purpose)
}

const getEhentaiGalleryMatch = (url = '') => {
  return String(url || '').match(/\/g\/(\d+)\/([^/?#]+)/i)
}

const getEhentaiGalleryId = (url = '') => {
  return getEhentaiGalleryMatch(url)?.[1] || ''
}

const getEhentaiGalleryToken = (url = '') => {
  return getEhentaiGalleryMatch(url)?.[2] || ''
}

const getEhentaiReaderMatch = (url = '') => {
  const match = String(url || '').match(/\/s\/([^/?#]+)\/(\d+)-(\d+)/i)
  if (!match) {
    return null
  }

  return {
    pageToken: match[1],
    gid: match[2],
    pageNumber: parseInt(match[3]) || 0
  }
}

const getEhentaiGalleryBaseUrl = (url = '', galleryToken = '') => {
  const galleryMatch = getEhentaiGalleryMatch(url)
  if (galleryMatch) {
    return `${EHENTAI_HOMEPAGE}g/${galleryMatch[1]}/${galleryMatch[2]}/`
  }

  const readerMatch = getEhentaiReaderMatch(url)
  if (readerMatch?.gid && galleryToken) {
    return `${EHENTAI_HOMEPAGE}g/${readerMatch.gid}/${galleryToken}/`
  }

  return ''
}

const normalizeEhentaiGalleryUrl = (url = '') => {
  return getEhentaiGalleryBaseUrl(url) || url
}

const getEhentaiGalleryPageIndex = (url = '') => {
  try {
    return Math.max(parseInt(new URL(url || EHENTAI_HOMEPAGE).searchParams.get('p') || '0') || 0, 0)
  } catch (error) {
    return 0
  }
}

const getEhentaiGalleryPageUrl = (galleryBaseUrl = '', pageIndex = 0) => {
  if (!galleryBaseUrl) {
    return ''
  }
  return pageIndex > 0 ? `${galleryBaseUrl}?p=${pageIndex}` : galleryBaseUrl
}

const getEhentaiNumberText = (value = '') => {
  const match = String(value || '').match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

const getEhentaiTitleFromPageTitle = (rawTitle = '') => {
  const title = String(rawTitle || '')
    .replace(/\s*-\s*E-Hentai Galleries.*$/i, '')
    .replace(/^E-Hentai Galleries:\s*/i, '')
    .replace(/\s*-\s*Page\s+\d+\s*$/i, '')
    .trim()

  if (/^E-Hentai Galleries$/i.test(title) || /The Free Hentai Doujinshi/i.test(title)) {
    return ''
  }

  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(title)
}

const getEhentaiRootTitle = (root) => {
  const selectorList = ['#gn', '#gj', 'title']
  for (let i = 0; i < selectorList.length; i++) {
    try {
      const dom = root?.querySelector(selectorList[i])
      const text = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(dom?.innerText || dom?.textContent || '')
      if (text) {
        return getEhentaiTitleFromPageTitle(text)
      }
    } catch (error) {
      //
    }
  }

  try {
    const docTitle = toCleanText(root?.title || '')
    if (docTitle) {
      return getEhentaiTitleFromPageTitle(docTitle)
    }
  } catch (error) {
    //
  }

  return getEhentaiTitleFromPageTitle(document?.title || '')
}

const getEhentaiDetailMapFromRoot = (root) => {
  const detailMap = {}
  try {
    root?.querySelectorAll('#gdd tr').forEach((item) => {
      const label = toCleanText(item.querySelector('.gdt1')?.textContent || '')
        .replace(/:$/, '')
        .trim()
        .toLowerCase()
      const value = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(item.querySelector('.gdt2')?.textContent || '')
      if (label) {
        detailMap[label] = value
      }
    })
  } catch (error) {
    //
  }
  return detailMap
}

const getEhentaiLengthFromRoot = (root) => {
  const detailMap = getEhentaiDetailMapFromRoot(root)
  const lengthFromDetail = getEhentaiNumberText(detailMap.length || '')
  if (lengthFromDetail > 0) {
    return lengthFromDetail
  }

  const pageCountText = toCleanText(root?.querySelector('.gpc')?.textContent || '')
  const match = pageCountText.match(/of\s+(\d+)\s+images/i)
  return match?.[1] ? parseInt(match[1]) : 0
}

const getEhentaiGalleryPageCount = (imageCount = 0) => {
  if (!imageCount) {
    return 0
  }
  return Math.max(1, Math.ceil(imageCount / EHENTAI_GALLERY_PAGE_SIZE))
}

const getEhentaiGalleryUrlFromRoot = (root, pageUrl = '') => {
  const currentGalleryUrl = getEhentaiGalleryBaseUrl(pageUrl)
  if (currentGalleryUrl) {
    return currentGalleryUrl
  }

  const html = String(root?.innerHTML || '')
  const gidMatch = html.match(/var\s+gid\s*=\s*(\d+)\s*;/i)
  const tokenMatch = html.match(/var\s+token\s*=\s*"([^"]+)"/i)
  if (gidMatch?.[1] && tokenMatch?.[1]) {
    return `${EHENTAI_HOMEPAGE}g/${gidMatch[1]}/${tokenMatch[1]}/`
  }

  const selectorList = [
    '#i5 a[href*="/g/"]',
    '.sn a[href*="/g/"]',
    '#bread a[href*="/g/"]'
  ]

  for (let i = 0; i < selectorList.length; i++) {
    try {
      const href = root?.querySelector(selectorList[i])?.getAttribute('href') || ''
      if (href) {
        return getEhentaiGalleryBaseUrl(resolveUrl(href, pageUrl))
      }
    } catch (error) {
      //
    }
  }

  if (getEhentaiReaderMatch(pageUrl)) {
    const galleryUrlList = uniqUrlList([...(root?.querySelectorAll?.('a[href*="/g/"]') || [])]
      .map(item => getEhentaiGalleryBaseUrl(resolveUrl(item?.getAttribute('href') || '', pageUrl)))
      .filter(Boolean))
    if (galleryUrlList.length === 1) {
      return galleryUrlList[0]
    }
  }

  return ''
}

const getEhentaiReaderPageUrlsFromRoot = (root, pageUrl = '') => {
  const pageUrlList = []
  try {
    root?.querySelectorAll('#gdt a[href*="/s/"]').forEach((item) => {
      const href = item?.getAttribute('href') || ''
      if (href) {
        pageUrlList.push(resolveUrl(href, pageUrl))
      }
    })
  } catch (error) {
    //
  }
  return uniqUrlList(pageUrlList)
}

const isEhentaiUsableImageUrl = (url = '') => {
  const value = String(url || '').trim()
  if (!value || value.startsWith('data:')) {
    return false
  }
  if (EHENTAI_IMAGE_PLACEHOLDER_REG.test(value)) {
    return false
  }
  return true
}

const getEhentaiReaderImageUrlFromRoot = (root, pageUrl = '') => {
  if (!root) {
    return ''
  }

  try {
    const anchorList = [...root.querySelectorAll('a[href]')]
    for (let i = 0; i < anchorList.length; i++) {
      const anchor = anchorList[i]
      const text = toCleanText(anchor?.innerText || anchor?.textContent || anchor?.getAttribute('title') || '')
      if (!EHENTAI_IMAGE_LINK_TEXT_REG.test(text)) {
        continue
      }
      const href = anchor?.getAttribute('href') || ''
      const resolvedUrl = resolveUrl(href, pageUrl)
      if (isEhentaiUsableImageUrl(resolvedUrl)) {
        return resolvedUrl
      }
    }
  } catch (error) {
    //
  }

  const selectorList = ['#img', 'img#img', '#i3 img', '#i3 a img']
  for (let i = 0; i < selectorList.length; i++) {
    try {
      const dom = root?.querySelector(selectorList[i])
      const rawUrl = dom?.getAttribute('data-src') ||
        dom?.getAttribute('data-lazy-src') ||
        dom?.getAttribute('src') ||
        ''
      const resolvedUrl = resolveUrl(rawUrl, pageUrl)
      if (isEhentaiUsableImageUrl(resolvedUrl)) {
        return resolvedUrl
      }
    } catch (error) {
      //
    }
  }

  const html = String(root?.innerHTML || '')
  const match = html.match(/(?:Download original|full-size image)[\s\S]{0,300}?href="([^"]+)"/i)
  if (match?.[1]) {
    const resolvedUrl = resolveUrl(match[1], pageUrl)
    if (isEhentaiUsableImageUrl(resolvedUrl)) {
      return resolvedUrl
    }
  }

  return ''
}

const getEhentaiResolvedGalleryUrl = async(pageUrl, responseText = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText) : null

  const galleryUrlFromRoot = getEhentaiGalleryUrlFromRoot(currentRoot, currentPageUrl)
  if (galleryUrlFromRoot) {
    return galleryUrlFromRoot
  }

  return ''
}

const getEhentaiGalleryMetadataByApi = async(galleryUrl = '') => {
  const galleryId = getEhentaiGalleryId(galleryUrl)
  const galleryToken = getEhentaiGalleryToken(galleryUrl)
  if (!galleryId || !galleryToken) {
    return null
  }

  const result = await getEhentaiApiJson({
    method: 'gdata',
    gidlist: [[parseInt(galleryId), galleryToken]],
    namespace: 1
  }, `E-Hentai gallery ${galleryId} metadata`)

  const metadata = Array.isArray(result?.gmetadata) ? result.gmetadata[0] : null
  if (!metadata || metadata.error) {
    return null
  }

  return metadata
}

const getEhentaiGalleryReaderPageUrls = async(pageUrl, responseText = '', resolvedGalleryUrl = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText) : null
  const currentGalleryBaseUrl = getEhentaiGalleryBaseUrl(currentPageUrl)
  const galleryBaseUrl = resolvedGalleryUrl || currentGalleryBaseUrl || await getEhentaiResolvedGalleryUrl(currentPageUrl, responseText)

  if (!galleryBaseUrl) {
    return currentRoot ? getEhentaiReaderPageUrlsFromRoot(currentRoot, currentPageUrl) : []
  }

  let galleryRoot = null
  let currentGalleryPageIndex = 0

  if (currentGalleryBaseUrl && currentRoot) {
    galleryRoot = currentRoot
    currentGalleryPageIndex = getEhentaiGalleryPageIndex(currentPageUrl)
  } else {
    const galleryText = await requestTextWithGuard({
      method: 'get',
      url: galleryBaseUrl,
      purpose: 'E-Hentai gallery page',
      verifyUrl: galleryBaseUrl
    })
    galleryRoot = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(galleryText)
  }

  const totalImageCount = getEhentaiLengthFromRoot(galleryRoot)
  const uniquePageUrlList = uniqUrlList(getEhentaiReaderPageUrlsFromRoot(
    galleryRoot,
    getEhentaiGalleryPageUrl(galleryBaseUrl, currentGalleryPageIndex)
  ))
  if (totalImageCount > 0 && uniquePageUrlList.length >= totalImageCount) {
    return uniquePageUrlList.slice(0, totalImageCount)
  }

  const totalGalleryPages = getEhentaiGalleryPageCount(totalImageCount || uniquePageUrlList.length)
  if (totalGalleryPages <= 1) {
    return uniquePageUrlList
  }

  const pageIndexList = []
  for (let i = 0; i < totalGalleryPages; i++) {
    if (i !== currentGalleryPageIndex) {
      pageIndexList.push(i)
    }
  }

  const batchSize = 3
  for (let i = 0; i < pageIndexList.length; i += batchSize) {
    const batchList = pageIndexList.slice(i, i + batchSize)
    const batchResult = await Promise.all(batchList.map(async(pageIndex) => {
      const nextGalleryPageUrl = getEhentaiGalleryPageUrl(galleryBaseUrl, pageIndex)
      const galleryText = await requestTextWithGuard({
        method: 'get',
        url: nextGalleryPageUrl,
        purpose: `E-Hentai gallery page ${pageIndex + 1}`,
        verifyUrl: galleryBaseUrl
      })
      const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(galleryText)
      return getEhentaiReaderPageUrlsFromRoot(root, nextGalleryPageUrl)
    }))
    uniquePageUrlList.push(...batchResult.flat())
  }

  const normalizedList = uniqUrlList(uniquePageUrlList)
  return totalImageCount > 0 ? normalizedList.slice(0, totalImageCount) : normalizedList
}

const getEhentaiImageList = async(pageUrl, responseText = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const currentRoot = responseText ? (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText) : null
  const directImageUrl = getEhentaiReaderImageUrlFromRoot(currentRoot, currentPageUrl)
  const galleryBaseUrl = await getEhentaiResolvedGalleryUrl(currentPageUrl, responseText)
  const pageUrlList = await getEhentaiGalleryReaderPageUrls(currentPageUrl, responseText, galleryBaseUrl)

  if (pageUrlList.length === 0) {
    return directImageUrl ? [directImageUrl] : []
  }

  const imageUrlList = []
  const batchSize = 4
  for (let i = 0; i < pageUrlList.length; i += batchSize) {
    const batchList = pageUrlList.slice(i, i + batchSize)
    const batchResult = await Promise.all(batchList.map(async(currentReaderPageUrl) => {
      let readerText = ''
      if (currentReaderPageUrl === currentPageUrl && responseText) {
        readerText = responseText
      } else {
        readerText = await requestTextWithGuard({
          method: 'get',
          url: currentReaderPageUrl,
          purpose: `E-Hentai reader page ${i + 1}`,
          verifyUrl: galleryBaseUrl || EHENTAI_HOMEPAGE
        })
      }
      const readerRoot = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(readerText)
      return getEhentaiReaderImageUrlFromRoot(readerRoot, currentReaderPageUrl)
    }))
    imageUrlList.push(...batchResult.filter(Boolean))
  }

  return uniqUrlList(imageUrlList)
}

const buildEhentaiChapterName = (pageCount = 0) => {
  return pageCount > 0 ? `Full Gallery (${pageCount}P)` : 'Full Gallery'
}

const buildEhentaiChapterList = ({ comicName = '', authorName = '', comicPageUrl = '', downloadUrl = '', numPages = 0 }) => {
  const resolvedComicPageUrl = comicPageUrl || downloadUrl
  const resolvedDownloadUrl = downloadUrl || comicPageUrl
  if (!resolvedDownloadUrl) {
    return []
  }

  return [{
    comicName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName),
    authorName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(authorName),
    comicPageUrl: resolvedComicPageUrl,
    webName: 'E-Hentai',
    chapterNumStr: '',
    chapterName: buildEhentaiChapterName(numPages),
    downChapterName: '',
    url: resolvedDownloadUrl,
    characterType: 'one',
    readtype: 1,
    isPay: false,
    isSelect: false
  }]
}

const getEhentaiChapterListFromRoot = (root, pageUrl, comicName = '', authorName = '') => {
  const currentPageUrl = pageUrl || window.location.href
  const galleryPageUrl = getEhentaiGalleryUrlFromRoot(root, currentPageUrl)
  const readerInfo = getEhentaiReaderMatch(currentPageUrl)
  if (!galleryPageUrl && !readerInfo) {
    return []
  }

  const galleryId = getEhentaiGalleryId(galleryPageUrl || currentPageUrl) || readerInfo?.gid || ''
  const resolvedComicName = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName || getEhentaiRootTitle(root) || `E-Hentai ${galleryId}`)
  const numPages = getEhentaiLengthFromRoot(root) || getEhentaiReaderPageUrlsFromRoot(root, currentPageUrl).length
  const resolvedDownloadUrl = galleryPageUrl || currentPageUrl

  return buildEhentaiChapterList({
    comicName: resolvedComicName,
    authorName,
    comicPageUrl: galleryPageUrl || resolvedDownloadUrl,
    downloadUrl: resolvedDownloadUrl,
    numPages
  })
}

const getEhentaiSearchList = async(keyword) => {
  const currentKeyword = String(keyword || '').trim()
  if (!currentKeyword) {
    return []
  }

  const searchUrl = `${EHENTAI_HOMEPAGE}?f_search=${encodeURIComponent(currentKeyword)}`
  const responseText = await requestTextWithGuard({
    method: 'get',
    url: searchUrl,
    purpose: 'E-Hentai search result',
    verifyUrl: EHENTAI_HOMEPAGE
  })

  const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText)
  const searchList = []
  root.querySelectorAll('table.itg.gltc tr, table.itg tr').forEach((item) => {
    const anchor = item.querySelector('td.gl3c.glname a[href*="/g/"], td.gl1e a[href*="/g/"], a[href*="/g/"]')
    const titleDom = item.querySelector('.glink')
    const name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(
      titleDom?.innerText ||
      titleDom?.textContent ||
      anchor?.getAttribute('title') ||
      anchor?.innerText ||
      anchor?.textContent ||
      ''
    )
    const url = resolveUrl(anchor?.getAttribute('href') || '', searchUrl)
    const imgDom = item.querySelector('.glthumb img, img')
    const rawImageUrl = imgDom?.getAttribute('data-src') ||
      imgDom?.getAttribute('data-lazy-src') ||
      imgDom?.getAttribute('src') ||
      ''
    const imageUrl = isEhentaiUsableImageUrl(rawImageUrl) ? resolveUrl(rawImageUrl, searchUrl) : ''

    if (!name || !url || searchList.some(result => result.url === url)) {
      return
    }

    searchList.push({
      name,
      url,
      imageUrl
    })
  })

  return searchList
}

const getEhentaiTagMapFromRoot = (root) => {
  const tagMap = {}
  try {
    root?.querySelectorAll('#taglist tr').forEach((item) => {
      const namespace = toCleanText(item.querySelector('.tc')?.textContent || '')
        .replace(/:$/, '')
        .trim()
        .toLowerCase()
      if (!namespace) {
        return
      }

      const valueList = [...item.querySelectorAll('a')]
        .map(link => toCleanText(link?.textContent || ''))
        .filter(Boolean)

      if (valueList.length > 0) {
        tagMap[namespace] = valueList
      }
    })
  } catch (error) {
    //
  }
  return tagMap
}

const getEhentaiLanguageIsoByText = (value = '') => {
  const text = String(value || '').trim().toLowerCase()
  const languageMap = {
    english: 'en',
    chinese: 'zh',
    japanese: 'ja',
    korean: 'ko',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    russian: 'ru',
    portuguese: 'pt',
    italian: 'it',
    thai: 'th',
    vietnamese: 'vi'
  }

  if (languageMap[text]) {
    return languageMap[text]
  }

  const match = text.match(/[a-z]{2,3}/)
  return match ? match[0] : ''
}

const getEhentaiCategoryFromRoot = (root) => {
  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(
    root?.querySelector('#gdc .cs')?.textContent ||
    root?.querySelector('.gl1c .cn')?.textContent ||
    ''
  )
}

const getEhentaiCoverUrlFromRoot = (root, pageUrl = '') => {
  try {
    const imgDom = root?.querySelector('#gd1 img')
    const rawImageUrl = imgDom?.getAttribute('data-src') || imgDom?.getAttribute('src') || ''
    if (rawImageUrl) {
      return resolveUrl(rawImageUrl, pageUrl)
    }
  } catch (error) {
    //
  }

  try {
    const styleValue = root?.querySelector('#gd1 > div')?.getAttribute('style') || ''
    const match = styleValue.match(/url\((['"]?)(.*?)\1\)/i)
    if (match?.[2]) {
      return resolveUrl(match[2], pageUrl)
    }
  } catch (error) {
    //
  }

  return ''
}

const getEhentaiReleaseDateText = (value = '') => {
  const match = String(value || '').match(/(\d{4})[-/.年](\d{1,2})(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return ''
  }

  const year = match[1]
  const month = String(parseInt(match[2])).padStart(2, '0')
  const day = match[3] ? String(parseInt(match[3])).padStart(2, '0') : ''
  return [year, month, day].filter(Boolean).join('-')
}

const getEhentaiMetadata = async(downloadItem = {}) => {
  const pageUrl = downloadItem?.comicPageUrl || downloadItem?.url || window.location.href
  const galleryUrl = await getEhentaiResolvedGalleryUrl(pageUrl)
  if (!galleryUrl) {
    return null
  }

  let apiMetadata = null
  try {
    apiMetadata = await getEhentaiGalleryMetadataByApi(galleryUrl)
  } catch (error) {
    apiMetadata = null
  }

  let root = null
  if (window.location.href === galleryUrl && document?.querySelector('#gdd')) {
    root = document
  } else {
    const responseText = await requestTextWithGuard({
      method: 'get',
      url: galleryUrl,
      purpose: 'E-Hentai gallery metadata',
      verifyUrl: galleryUrl
    })
    root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText)
  }

  const detailMap = getEhentaiDetailMapFromRoot(root)
  const tagMap = getEhentaiTagMapFromRoot(root)
  const domArtistList = tagMap.artist || []
  const domGroupList = tagMap.group || []
  const apiTagList = Array.isArray(apiMetadata?.tags) ? apiMetadata.tags.filter(Boolean) : []
  const getNamespaceValuesFromApi = (namespace) => {
    const prefix = `${namespace}:`
    return uniqUrlList(apiTagList
      .filter(tag => String(tag || '').startsWith(prefix))
      .map(tag => String(tag || '').slice(prefix.length).trim())
      .filter(Boolean))
  }
  const artistList = apiTagList.length > 0 ? getNamespaceValuesFromApi('artist') : domArtistList
  const groupList = apiTagList.length > 0 ? getNamespaceValuesFromApi('group') : domGroupList
  const languageText = apiTagList.length > 0
    ? (getNamespaceValuesFromApi('language')[0] || (tagMap.language || [])[0] || detailMap.language || '')
    : ((tagMap.language || [])[0] || detailMap.language || '')
  const domTagList = Object.entries(tagMap).flatMap(([namespace, valueList]) => {
    if (['artist', 'group', 'language'].includes(namespace)) {
      return []
    }
    return valueList.map(value => `${namespace}:${value}`)
  })
  const tagList = apiTagList.length > 0
    ? apiTagList.filter(tag => !/^(artist|group|language):/i.test(String(tag || '')))
    : domTagList
  const uploaderName = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(
    apiMetadata?.uploader ||
    root?.querySelector('#gdn a[href*="/uploader/"]')?.textContent ||
    ''
  )
  const category = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(apiMetadata?.category || getEhentaiCategoryFromRoot(root))
  const title = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(apiMetadata?.title || getEhentaiRootTitle(root) || downloadItem?.comicName || '')
  const originalTitle = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(apiMetadata?.title_jpn || title)
  const coverUrl = getEhentaiCoverUrlFromRoot(root, galleryUrl) || resolveUrl(apiMetadata?.thumb || '', EHENTAI_HOMEPAGE)

  return {
    source: apiMetadata ? 'E-Hentai API + WebPage' : 'WebPage',
    seriesTitle: title,
    originalTitle,
    summary: '',
    writers: artistList.length > 0 ? artistList : uniqUrlList([uploaderName, ...groupList].filter(Boolean)),
    illustrators: artistList,
    tags: uniqUrlList(tagList),
    publisher: groupList[0] || '',
    issueCount: downloadItem?.seriesChapterCount || undefined,
    releaseDate: apiMetadata?.posted
      ? new Date(parseInt(apiMetadata.posted) * 1000).toISOString().slice(0, 10)
      : getEhentaiReleaseDateText(detailMap.posted || ''),
    status: 'ended',
    ageRating: /non-h/i.test(category) ? '' : 'R18+',
    languageISO: getEhentaiLanguageIsoByText(languageText),
    subjectUrl: galleryUrl,
    coverUrl
  }
}

const comicsWebInfo = [
  {
    domain: ['nhentai.net', 'www.nhentai.net'],
    homepage: 'https://nhentai.net/',
    webName: 'nhentai',
    comicNameCss: 'h1 .pretty, h1.title, h1, title',
    authorCss: '#tags a[href*="/artist/"] .name, #tags a[href*="/group/"] .name, a[href*="/artist/"] .name, a[href*="/group/"] .name',
    chapterCss: '.__nhentai_single_gallery__',
    normalizeDownloadUrl: normalizeNhentaiGalleryUrl,
    defaultImageSource: NHENTAI_DOWNLOAD_SOURCE_API,
    downloadSourceOptions: NHENTAI_DOWNLOAD_SOURCE_OPTIONS,
    readtype: 1,
    searchFun: async function(keyword) {
      return getNhentaiSearchList(keyword)
    },
    getChaptersFromRoot: function(root, pageUrl, comicName, authorName) {
      return getNhentaiChapterListFromRoot(root, pageUrl, comicName, authorName)
    },
    getImgs: async function(context, processData) {
      return getNhentaiImageList(processData?.url || window.location.href, context, processData)
    },
    getMetadata: async function(downloadItem) {
      return getNhentaiMetadata(downloadItem)
    }
  },
  {
    domain: ['e-hentai.org', 'www.e-hentai.org'],
    homepage: EHENTAI_HOMEPAGE,
    webName: 'E-Hentai',
    comicNameCss: '#gn, #gj, title',
    authorCss: '#taglist a[id^="ta_artist:"], #taglist a[id^="ta_group:"], #gdn a[href*="/uploader/"], .gl4c a[href*="/uploader/"]',
    chapterCss: '.__ehentai_single_gallery__',
    normalizeDownloadUrl: normalizeEhentaiGalleryUrl,
    readtype: 1,
    searchFun: async function(keyword) {
      return getEhentaiSearchList(keyword)
    },
    getChaptersFromRoot: function(root, pageUrl, comicName, authorName) {
      return getEhentaiChapterListFromRoot(root, pageUrl, comicName, authorName)
    },
    getImgs: async function(context, processData) {
      return getEhentaiImageList(processData?.url || window.location.href, context)
    },
    getMetadata: async function(downloadItem) {
      return getEhentaiMetadata(downloadItem)
    }
  },
  {
    domain: ['mangabz.com', 'www.mangabz.com'],
    homepage: 'https://mangabz.com/',
    webName: 'Mangabz',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '#chapterlistload',
    headers: {
      referer: 'https://mangabz.com/'
    },
    downHeaders: {
      referer: 'https://mangabz.com/'
    },
    readtype: 0,
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.container .mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/MANGABZ_MID=(\d+?);.*MANGABZ_CID=(\d+?);.*MANGABZ_IMAGE_COUNT=(\d+?);.*MANGABZ_VIEWSIGN="(.*?)".*MANGABZ_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://mangabz.com/m${group[2]}/chapterimage.ashx?cid=${group[2]}&page=${page}&key=&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5]}&_sign=${group[4]}`

      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', reqUrl)
      const codeText = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(codeText, /(function.*return .*?})/g)

      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'manhua.zaimanhua.com',
    homepage: 'https://manhua.zaimanhua.com/',
    webName: '再漫画',
    comicNameCss: '.wrap_intro_l_comic h1 a',
    chapterCss: '.tab-content-selected',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(1.5)
      const page_url = iframeWindow.__NUXT__.data.getChapters.data.chapterInfo.page_url
      document.getElementById(processData.frameId).remove()
      return page_url
    }
  },
  {
    domain: 'www.dm5.com',
    homepage: 'https://www.dm5.com/',
    webName: '动漫屋',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://www.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      use_background: true
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://www.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url: reqUrl, useCookie: processData.isPay })

      const codeText = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'tel.dm5.com',
    homepage: 'https://tel.dm5.com/',
    webName: '动漫屋2',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://tel.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      use_background: true
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://tel.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url: reqUrl, useCookie: processData.isPay })
      const codeText = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'godamh.com',
    homepage: 'https://godamh.com/',
    webName: 'GoDa',
    comicNameCss: '.container nav > ol > li:nth-child(3) a',
    chapterCss: '.chapterlists',
    chapterNameReg: /data-ct="(.*?)"/,
    readtype: 1,
    headers: {
      referer: 'https://godamh.com/'
    },
    getImgs: async function(context) {
      const ms = context.match(/data-ms="(\d+)".*data-cs="(\d+)"/)[1]
      const cs = context.match(/data-ms="(\d+)".*data-cs="(\d+)"/)[2]

      const url = `https://api-get-v2.mgsearcher.com/api/chapter/getinfo?m=${ms}&c=${cs}`
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('GET', url)

      const info = JSON.parse(responseText).data.info
      const domain = info.images.line === 2 ? 'https://f40-1-4.g-mh.online' : 'https://t40-1-4.g-mh.online'
      const images = info.images.images.map(element => {
        return domain + element.url
      })
      return images
    }
  },
  {
    domain: 'www.comemh8.com',
    homepage: 'https://www.comemh8.com/',
    webName: '来漫画',
    comicNameCss: '.title h1',
    chapterCss: '#play_0 ul ',
    readtype: 1,
    searchFun: async function(keyword) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=gb2312',
        referer: this.homepage
      }
      const data = encodeTextByCharset(`key=${keyword}`, 'gb2312')
      const response = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({
        method: 'post',
        url: this.homepage + 'e/search/',
        headers,
        data,
        responseType: 'arraybuffer'
      })
      const responseText = decodeBinaryByCharset(response?.response || response, 'gb2312')

      if (!responseText) {
        throw new Error(`未获取到${this.webName} 搜索页`)
      }
      if (isChallengePage(responseText)) {
        (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .openVerifyPage */ .XB)(this.homepage)
        throw new Error(`检测到 Cloudflare 验证，已打开${this.webName} 搜索页，请手动通过后重试`)
      }

      const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText)
      if (root.querySelector('.noresult')) {
        return []
      }

      const searchList = []
      root.querySelectorAll('#dmList li').forEach((item) => {
        const titleAnchor = item.querySelector('dt a')
        const imgDom = item.querySelector('.pic img')
        const name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(titleAnchor?.getAttribute('title') || titleAnchor?.innerText || titleAnchor?.textContent || '')
        const url = resolveUrl(titleAnchor?.getAttribute('href') || '', this.homepage)
        const imageUrl = resolveUrl(imgDom?.getAttribute('src') || '', this.homepage)
        if (name && url) {
          searchList.push({
            name,
            url,
            imageUrl
          })
        }
      })
      return searchList
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const arr = iframeWindow.getUrlpics()
      const host = iframeWindow.gethost()
      const image = arr.map(element => host + element)
      console.log('image: ', image)
      document.getElementById(processData.frameId).remove()
      return image
    }
  },
  {
    domain: 'www.rumanhua1.com',
    homepage: 'http://www.rumanhua1.com/',
    webName: 'R如漫画',
    comicNameCss: 'h1.name_mh',
    chapterCss: '.chapterList .chapterlistload ul',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(1.5)
      const image = [...iframeDom.querySelectorAll('.main_img img')].map(img => img.dataset.src ?? img.src)
      document.getElementById(processData.frameId).remove()
      return image
    }
  },

  {
    domain: 'www.dongmanmanhua.cn',
    homepage: 'https://www.dongmanmanhua.cn/',
    webName: '咚漫',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = `${this.homepage}search?keyword=${encodeURIComponent(String(keyword || '').trim())}`
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        headers: this.headers,
        purpose: `${this.webName} search page`
      })
      const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText)
      const searchList = []
      root.querySelectorAll('.card_wrap.search ul.card_lst > li').forEach((item) => {
        const anchor = item.querySelector('a.card_item')
        const titleDom = item.querySelector('.subj')
        const imgDom = item.querySelector('img')
        const name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(titleDom?.innerText || titleDom?.textContent || '')
        const url = resolveUrl(anchor?.getAttribute('href') || '', this.homepage)
        const imageUrl = resolveUrl(imgDom?.getAttribute('src') || '', this.homepage)
        if (name && url) {
          searchList.push({
            name,
            url,
            imageUrl
          })
        }
      })
      return searchList
    },
    headers: {
      referer: 'https://www.dongmanmanhua.cn/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?input/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.gaonaojin.com',
    homepage: 'https://www.gaonaojin.com/',
    webName: '仙漫网',
    comicNameCss: 'h1',
    chapterCss: '#detail-list-select-1',
    readtype: 1,
    getImgs: function(context) {
      const imgDomain = context.match(/imgDomain = '(.*?)'/)[1]
      let imgStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /(function.*?return \S})(\(.*?{}\))/g)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      const imgarr = []
      imgArray.forEach(element => {
        imgarr.push(imgDomain + element)
      })
      return imgarr
    }
  },
  {
    domain: 'www.webtoons.com',
    homepage: 'https://www.webtoons.com/',
    webName: 'webtoons',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = `${this.homepage}en/search?keyword=${encodeURIComponent(String(keyword || '').trim())}`
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        headers: this.headers,
        purpose: `${this.webName} search page`
      })
      const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(responseText)
      const searchList = []
      root.querySelectorAll('.webtoon_list_wrap ul.webtoon_list > li').forEach((item) => {
        const anchor = item.querySelector('a._card_item')
        const titleDom = item.querySelector('.info_text .title')
        const imgDom = item.querySelector('img')
        const name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(titleDom?.innerText || titleDom?.textContent || '')
        const url = resolveUrl(anchor?.getAttribute('href') || '', this.homepage)
        const imageUrl = resolveUrl(imgDom?.getAttribute('src') || '', this.homepage)
        if (name && url) {
          searchList.push({
            name,
            url,
            imageUrl
          })
        }
      })
      return searchList
    },
    webDesc: '？需要魔法？',
    headers: {
      referer: 'https://www.webtoons.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?class="viewer_ad_area"/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.manshiduo.net',
    homepage: 'https://www.manshiduo.net/',
    webName: '漫士多',
    comicNameCss: '.comic-title',
    chapterCss: 'ul.chapter__list-box',
    readtype: 1,
    getImgs: async function(context) {
      const imgobj = context.matchAll(/data-original="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'comic.naver.com',
    homepage: 'https://comic.naver.com/',
    webName: 'comic.naver',
    comicNameCss: '#content > div.EpisodeListInfo__comic_info--yRAu0 > div > h2',
    chapterCss: '#content ul',
    chapterNameReg: /span.*?>(.*?)<\/span>/,
    webDesc: '找到漫画目录页再使用, 新打开页面需“重载列表”',
    readtype: 1,
    headers: {
      referer: 'https://comic.naver.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="wt_viewer"[\s\S]*?(<\/div>)/)[0]
      const imgobj = str.matchAll(/img src="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'komiic.com',
    homepage: 'https://komiic.com/',
    webName: 'Komiic漫画',
    comicNameCss: '.ComicMain__info .text-h6',
    chapterCss: '.v-card-text .v-container .v-row',
    chapterNameReg: / class="serial">(.*?)<\/span>/,
    webDesc: 'SPA页面, 新页面需“重载列表”重新匹配新名称',
    headers: {
      referer: 'https://komiic.com/'
    },
    readtype: 1,
    getImgs: async function(context, processData) {
      const { url } = processData
      const chapter_id = url.match(/chapter\/(\d*)\/images/)[1]
      const postUrl = 'https://komiic.com/api/query'
      const data = {
        'operationName': 'imagesByChapterId',
        'variables': {
          'chapterId': chapter_id
        },
        'query': 'query imagesByChapterId($chapterId: ID!) {\n  imagesByChapterId(chapterId: $chapterId) {\n    id\n    kid\n    height\n    width\n    __typename\n  }\n}\n'
      }
      const headers = { 'Content-Type': 'application/json' }
      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'post', url: postUrl, headers, data: JSON.stringify(data) })
      const img_data = JSON.parse(responseText).data.imagesByChapterId
      const saveImg = []
      img_data.forEach(element => {
        saveImg.push('https://komiic.com/api/image/' + element.kid)
      })
      return saveImg
    }
  },
  {
    domain: ['www.darpou.com', 'darpou.com'],
    homepage: 'https://www.darpou.com/',
    webName: '百漫谷',
    comicNameCss: '.fed-part-eone.fed-font-xvi a',
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    readtype: 1,
    getImgs: async function(context) {
      const txtUrl = context.match(/http(\S*).txt/gi)[0]
      const txtRes = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', txtUrl)
      let txtContext = txtRes.responseText
      txtContext = txtContext.replace(/img2.manga8.xyz/g, 'img4.manga8.xyz')
      txtContext = txtContext.replace(/img.manga8.xyz/g, 'img3.manga8.xyz')
      const imgReg = /http(\S*)jpg/g
      return txtContext.match(imgReg)
    }
  },
  {
    domain: ['www.copymanga.tv', 'www.mangacopy.com'],
    homepage: 'https://www.mangacopy.com/',
    webName: '拷贝漫画',
    comicNameCss: 'div.container .comicParticulars-title-right h6',
    chapterCss: '.tab-content > div.active > ul:nth-child(1)',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      const iframeWindow = document.getElementById(processData.frameId).contentWindow

      // 存在加载慢的可能性，10秒内持续检测是否存在数据
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .doThingsEachSecond */ .w1)(10, () => parseInt(iframeDom.querySelector('.comicCount')?.innerText))
      const totalNum = parseInt(iframeDom.querySelector('.comicCount')?.innerText)
      console.log('totalNum: ', totalNum)
      const contentEle = iframeDom.querySelector('ul.comicContent-list')

      // 结束滚动条件
      const end_condition_1 = () => {
        const curHeight = iframeWindow.innerHeight + iframeWindow.scrollY
        return curHeight >= contentEle.offsetHeight
      }
      const end_condition_2 = () => contentEle.childElementCount === totalNum

      // 等待滚动结果
      const result = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .startScroll */ .qs)(iframeWindow, [end_condition_1, end_condition_2])
      console.log('result: ', result)
      clearInterval(result[0])

      document.getElementById(processData.frameId).remove()

      return [...contentEle.querySelectorAll('img')].map(img => img.dataset.src ?? img.src)
    }
  },
  {
    domain: 'www.fengchemh.com',
    homepage: 'https://www.fengchemh.com/',
    webName: '风车漫画',
    comicNameCss: 'h1',
    chapterCss: '#ewave-playlist-1',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const images = iframeWindow.params.images
      document.getElementById(processData.frameId).remove()
      return images
    }
  },
  {
    domain: ['manhuagui.com'],
    homepage: 'https://www.manhuagui.com/',
    webName: '漫画柜',
    comicNameCss: '.book-title h1',
    chapterCss: '.chapter-list',
    readtype: 1,
    // context 章节请求正文
    getImgs: function(context) {
      // 获取到 html请求正文 context 的一段js代码字符 并执行这代码获取到 图片地址信息
      // window["\x65\x76\x61\x6c"]  => eval
      // (function[\s\S]+?return \S*?}) 匿名函数部分
      // (\([\s\S]+?{}\)) 需要的参数
      const dataStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /window\["\\x65\\x76\\x61\\x6c"\]\((function[\s\S]+?return \S*?})(\([\s\S]+?{}\))/g)
      const matchObj = /"files":(?<files>.*?),"finished".*"path":"(?<path>.*?)".*"e":(?<e>\d*),"m":"(?<m>.*)"}/g.exec(dataStr)
      var { files, path, e, m } = matchObj.groups
      files = JSON.parse(files)
      const image = files.map(ele => {
        return 'https://i.hamreus.com' + path + ele + '?e=' + e + '&m=' + m
      })
      return image
    }
  },
  {
    domain: 'www.gufengmh9.com',
    homepage: 'https://www.gufengmh9.com/',
    webName: '古风漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '.chapter-body',
    readtype: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.book-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      const josnRes = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      let imgarr = JSON.parse(strArr[0])
      imgarr = imgarr.map((item) => {
        if (imgarr[0].search('http') === -1) {
          return imageDomian + '/' + strArr[1] + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: 'comic.acgn.cc',
    homepage: 'https://comic.acgn.cc/',
    webName: '动漫戏说',
    comicNameCss: '.list_navbox h3 a',
    chapterCss: '#comic_chapter > ul',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/_src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.77mh.xyz',
    homepage: 'https://www.77mh.xyz/',
    webName: '新新漫画',
    comicNameCss: '.ar_list_coc h1',
    chapterCss: '.ar_list_coc .ar_rlos_bor',
    readtype: 1,
    downHeaders: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    searchTemplate_1: {
      search_add_url: 'k.php?k=',
      search_pre: 'https://so.77mh.xyz/',
      alllist_dom_css: '.ar_list_co ul',
      minlist_dom_css: 'dl',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      const imgStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const params = imgStr.match(/var atsvr="(.*?)";var msg='(.*?)'.*img_s=(.*?);.*colist_(.*?).htm/)
      let imgArray = params[2].split('|')

      const coid = window.location.href.match(/colist_(\d*?).html/)[1]
      const reqUrl = `https://css.gdbyhtl.net:5443/img_v1/cnlo_svr.asp?z=${params[1]}&s=${params[3]}&cid=${params[4]}&coid=${coid}`

      const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', reqUrl)
      const getImgPre = responseText.match(/= "(.*?)"/)[1]

      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return getImgPre + item
        })
      }
      return imgArray
    }
  },
  {
    domain: 'www.mhua5.com',
    homepage: 'https://www.mhua5.com/',
    webName: '漫画屋',
    comicNameCss: '.comic-title.j-comic-title',
    chapterCss: '.chapter__list-box.clearfix',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'index.php/search?key=',
      alllist_dom_css: '.cate-comic-list',
      minlist_dom_css: '.common-comic-item',
      img_src: 'data-original'
    },
    getImgs: function(context) {
      const group = context.matchAll(/data-original="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.yymanhua.com',
    homepage: 'https://www.yymanhua.com/',
    webName: 'yymanhua',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '.detail-list-form-con',
    readtype: 1,
    headers: {
      referer: 'https://www.yymanhua.com/'
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const cid = iframe.YYMANHUA_CID
      let page
      const _cid = iframe.YYMANHUA_CID
      const _mid = iframe.COMIC_MID
      const _dt = iframe.YYMANHUA_VIEWSIGN_DT
      const _sign = iframe.YYMANHUA_VIEWSIGN

      const imageArray = []
      const count = iframe.YYMANHUA_IMAGE_COUNT

      let currentCount = 0
      while (currentCount < count) {
        page = currentCount + 1
        console.log('page: ', page)
        const url = `https://www.yymanhua.com/m${cid}/chapterimage.ashx?cid=${cid}&page=${page}&key=&_cid=${_cid}&_mid=${_mid}&_dt=${_dt}&_sign=${_sign}`
        const { response } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url })
        console.log('response: ', response)
        const funStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(response, /(function.*?return \S;})(\(.*?{}\))/g)
        const newImgs = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(funStr, /(function.*?return .*?})()/g)
        imageArray.push(...newImgs)
        currentCount = imageArray.length
        await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(0.5)
      }
      document.getElementById(processData.frameId).remove()
      return imageArray
    }
  },
  {
    domain: ['www.xmanhua.com', 'xmanhua.com'],
    homepage: 'https://xmanhua.com/',
    webName: 'xmanhua',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '.detail-list-form-con',
    readtype: 1,
    headers: {
      referer: 'https://xmanhua.com/'
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow

      const cid = iframe.XMANHUA_CID
      let page
      const _cid = iframe.XMANHUA_CID
      const _mid = iframe.COMIC_MID
      const _dt = iframe.XMANHUA_VIEWSIGN_DT
      const _sign = iframe.XMANHUA_VIEWSIGN

      const imageArray = []
      const count = iframe.XMANHUA_IMAGE_COUNT
      let currentCount = 0
      while (currentCount < count) {
        page = currentCount + 1
        console.log('page: ', page)
        const url = `https://xmanhua.com/m${cid}/chapterimage.ashx?cid=${cid}&page=${page}&key=&_cid=${_cid}&_mid=${_mid}&_dt=${_dt}&_sign=${_sign}`
        const { response } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)({ method: 'get', url })
        const funStr = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(response, /(function.*?return \S;})(\(.*?{}\))/g)
        const newImgs = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData */ .D)(funStr, /(function.*?return .*?})()/g)
        imageArray.push(...newImgs)
        currentCount = imageArray.length
        await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(0.5)
      }
      document.getElementById(processData.frameId).remove()
      return imageArray
    }
  },
  {
    domain: 'www.cartoonmad.com',
    homepage: 'https://www.cartoonmad.com/',
    webName: '动漫狂',
    comicNameCss: 'table > tbody > tr:nth-child(3) > td:nth-child(2) > a:nth-child(6)',
    chapterCss: '#info',
    readtype: 1,
    downHeaders: {
      referer: 'https://www.cartoonmad.com/'
    },
    getImgs: function(context) {
      const preImgUrl = 'https:' + context.match(/<img src="(.*?)001.*?"/)[1]
      const suffix = context.match(/<img src="(.*?)001\.(.*?)"/)[2]
      const pageTotalNum = context.match(/<\/option>.*html">.*?(\d+).*?<\/select>/)[1]
      const imgArray = []
      for (let i = 0; i < pageTotalNum; i++) {
        const imgUrl = preImgUrl + (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .addZeroForNum */ .xo)(i + 1, 3) + '.' + suffix
        imgArray.push(imgUrl)
      }
      return imgArray
    }
  },
  {
    domain: 'www.6mh1.com',
    homepage: 'http://www.6mh1.com/',
    webName: '六漫画',
    comicNameCss: 'h1.name_mh',
    chapterCss: '#chapter-list1',
    readtype: 1,
    useFrame: true,
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const newImgs = JSON.parse(JSON.stringify(iframe.newImgs))
      document.getElementById(processData.frameId).remove()
      return newImgs
    }
  },
  {
    domain: ['www.baozimhcn.com', 'www.baozimh.com', 'cn.baozimhcn.com'],
    homepage: 'https://www.baozimh.com/',
    webName: '包子漫画',
    comicNameCss: 'h1.comics-detail__title',
    chapterCss: '.comics-detail > .l-content:nth-of-type(3) #chapter-items',
    chapterCss_2: '.comics-detail > .l-content:nth-of-type(3) .pure-g',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keyword=',
      alllist_dom_css: '.pure-g.classify-items',
      minlist_dom_css: 'div.comics-card',
      img_reg: /src=('|")(.*?)\?/,
      match_reg_num: 2
    },
    getImgs: async function(context, processData) {
      const imgArray = []
      const nextReg = /next_chapter"><a href="(.*)?"[\s\S]{1,10}点击进入下一页/
      let hasNext = false
      let nextHtml = ''
      do {
        const group = context.matchAll(/<img.*src="(.*?)"/g)
        for (const item of group) {
          if (!imgArray.includes(item[1])) {
            imgArray.push(item[1])
          }
        }
        hasNext = nextReg.test(context)
        if (hasNext) {
          nextHtml = context.match(nextReg)[1]
          const { responseText } = await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY)('get', nextHtml)
          context = responseText
        }
      } while (hasNext)
      return imgArray
    }
  },
  {
    domain: ['bakamh.com', 'www.bakamh.com'],
    homepage: 'https://bakamh.com/',
    webName: 'bakamh巴卡漫画',
    comicNameCss: '#manga-title h1',
    authorCss: '.author-content',
    chapterCss: '.listing-chapters_main',
    readtype: 1,
    useFrame: true,
    headers: {
      referer: 'https://bakamh.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchFun: async function(keyword) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer: this.homepage
      }
      const data = `action=wp-manga-search-manga&title=${encodeURIComponent(keyword)}`
      const responseText = await requestTextWithGuard({
        method: 'post',
        url: this.homepage + 'wp-admin/admin-ajax.php',
        headers,
        data,
        purpose: `${this.webName} 搜索页`,
        verifyUrl: this.homepage
      })

      let searchData = []
      try {
        const jsonData = JSON.parse(responseText || '{}')
        searchData = Array.isArray(jsonData.data) ? jsonData.data : []
      } catch (error) {
        searchData = []
      }

      const searchList = []
      for (let i = 0; i < searchData.length; i++) {
        const item = searchData[i]
        const name = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(item?.title || item?.label || '')
        const url = item?.url ? new URL(item.url, this.homepage).href : ''
        if (!name || !url) {
          continue
        }

        let imageUrl = ''
        try {
          const detailText = await requestTextWithGuard({
            method: 'get',
            url,
            headers: this.headers || '',
            purpose: `${this.webName} 详情页`
          })
          const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(detailText || '')
          const imgDom = root.querySelector('.summary_image img')
          const rawImageUrl = imgDom?.getAttribute('data-src') || imgDom?.getAttribute('data-lazy-src') || imgDom?.getAttribute('src') || ''
          imageUrl = rawImageUrl ? new URL(rawImageUrl, url).href : ''
        } catch (error) {
          imageUrl = ''
        }

        searchList.push({
          name,
          url,
          imageUrl
        })
      }

      return searchList
    },
    getImgs: async function(context, processData) {
      const iframeDom = document.getElementById(processData.frameId).contentDocument
      await (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .gw)(0.5)
      const selectorList = [
        'img.wp-manga-chapter-img',
        '.reading-content img[data-manga-src]',
        '.reading-content img[data-src]',
        '.reading-content img'
      ]
      const imgNodeList = selectorList.reduce((result, selector) => {
        const nodeList = [...iframeDom.querySelectorAll(selector)]
        nodeList.forEach((item) => {
          if (!result.includes(item)) {
            result.push(item)
          }
        })
        return result
      }, [])
      const imgArray = imgNodeList
        .map(img => (
          img.getAttribute('data-manga-src') ||
          img.dataset.mangaSrc ||
          img.getAttribute('data-src') ||
          img.getAttribute('data-lazy-src') ||
          img.getAttribute('src') ||
          ''
        ).trim())
        .filter(url => /^https?:\/\//i.test(url))

      if (imgArray.length === 0) {
        const pageHtml = String(iframeDom.documentElement?.outerHTML || '').toLowerCase()
        document.getElementById(processData.frameId).remove()

        if (isChallengePage(pageHtml)) {
          (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .openVerifyPage */ .XB)(processData.url)
          throw new Error('检测到 Cloudflare 验证，已打开章节页，请手动通过后重试下载')
        }

        throw new Error('未获取到章节图片，页面结构可能已变化')
      }

      document.getElementById(processData.frameId).remove()
      return [...new Set(imgArray)]
    }
  },
  {
    domain: 'www.guoman.net',
    homepage: 'https://www.guoman.net/',
    webName: '爱国漫',
    comicNameCss: '.detail-info > .detail-info-title',
    chapterCss: '#chapterlistload',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search?key=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/<img.*src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: ['zcymh.com', 'www.zcymh.com'],
    homepage: 'https://zcymh.com/',
    webName: '最次元',
    comicNameCss: 'h1',
    chapterCss: '#detail-chapter .bd',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/chapter-pid="[\s\S]*?<img src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.kanman.com',
    homepage: 'https://www.kanman.com/',
    webName: '看漫画',
    comicNameCss: 'h1.title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = `${this.homepage}api/getsortlist/?search_key=${encodeURIComponent(String(keyword || '').trim())}`
      const responseText = await requestTextWithGuard({
        method: 'get',
        url: searchUrl,
        purpose: `${this.webName} search api`
      })
      const result = JSON.parse(responseText)
      const dataList = Array.isArray(result?.data) ? result.data : []
      return dataList.map((item) => {
        const comicId = item?.comic_id || item?.comic_newid
        return {
          name: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(item?.comic_name || ''),
          url: resolveUrl(`/${comicId}/`, this.homepage),
          imageUrl: resolveUrl(item?.cover_img || '', this.homepage)
        }
      }).filter(item => item.name && item.url && !item.url.endsWith('/undefined/'))
    },
    getImgs: async function(context) {
      const imgStr = context.match(/chapter_img_list:(\[.*?\])/)[1]
      let imgArray = eval(imgStr)
      imgArray = imgArray.map(element => {
        element = element.replace('hw-chapter2', 'hw-chapter3')
        return element
      })
      return imgArray
    }
  },
  {
    domain: 'www.manhua88888.com',
    homepage: 'https://www.manhua88888.com/',
    webName: '好漫8',
    comicNameCss: '.content .title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    getImgs: function(context) {
      const group = context.matchAll(/data-echo="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  }
]

const getUserStorageList = (key) => {
  const data = (0,_config_setup__WEBPACK_IMPORTED_MODULE_2__/* .getStorage */ .cF)(key) || []
  if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(data) === 'Array') {
    return data
  }
  if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(data) === 'String') {
    return eval(data || '[]')
  }
  return []
}

const getWebList = () => {
  const userWebInfo = getUserStorageList('userWebInfo')
  const originalInfo = comicsWebInfo
  return { originalInfo, userWebInfo }
}

const getUserWebList = () => {
  return getUserStorageList('userWebInfo')
}

const normalizeWebRule = (webRule) => {
  if (webRule && typeof webRule.getImgs === 'string') {
    window.request = _utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY
    webRule.getImgs = funSplicing(webRule.getImgs)
  }
  if (webRule && typeof webRule.searchFun === 'string') {
    window.request = _utils_index__WEBPACK_IMPORTED_MODULE_0__/* .request */ .WY
    webRule.searchFun = funSplicing(webRule.searchFun)
  }
  return webRule
}

const getAllWebList = () => {
  return comicsWebInfo.concat(getUserWebList()).map(item => normalizeWebRule(item))
}

const getSearchableWebList = () => {
  return getAllWebList().filter(item => item.searchTemplate_1 || item.searchFun)
}

const searchComicsAcrossWebs = async(keyword, selectedWebNames = []) => {
  const result = []
  const selectedWebNameSet = new Set((selectedWebNames || []).filter(Boolean))
  const webList = getSearchableWebList().filter((item) => {
    if (selectedWebNameSet.size === 0) {
      return true
    }
    return selectedWebNameSet.has(item.webName)
  })
  for (let i = 0; i < webList.length; i++) {
    const webRule = webList[i]
    try {
      const findres = await searchComicOnWeb(webRule, keyword)
      result.push({
        webName: webRule.webName,
        webRule,
        findres: Array.isArray(findres) ? findres : []
      })
    } catch (error) {
      result.push({
        webName: webRule.webName,
        webRule,
        findres: [],
        error
      })
    }
  }
  return result
}

const findWebByUrl = (url) => {
  const hname = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getdomain */ .m1)(url)
  const allWebList = getAllWebList()

  for (let i = 0; i < allWebList.length; i++) {
    const webRule = allWebList[i]
    if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(webRule.domain) === 'Array') {
      if (webRule.domain.some(domain => hname.includes(domain) || domain.includes(hname))) {
        return normalizeWebRule(webRule)
      }
    } else if (hname.includes(webRule.domain)) {
      return normalizeWebRule(webRule)
    }
  }
  return null
}

const getDomText = (root, selector) => {
  try {
    const dom = root.querySelector(selector)
    if (!dom) {
      return ''
    }
    return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)((dom.innerText || dom.textContent || '').trim())
  } catch (error) {
    return ''
  }
}

const authorPrefixReg = /^(作者|作者名|作者\/作画|作者\/作畫|作画|作畫|漫畫|漫画|原著|原作|编剧|編劇|脚本|腳本|著者|繪者|绘者|畫師|画师|原案|author(?:\(s\))?|writer(?:\(s\))?|artist(?:\(s\))?|illustrator(?:\(s\))?|creator(?:\(s\))?|story|story by|written by|script|script by|art by|illustrated by)\s*[：:：-]?\s*/i
const authorHintReg = /(作者|作者名|作画|作畫|原著|原作|编剧|編劇|脚本|腳本|著者|繪者|绘者|畫師|画师|原案|\bauthor\b|\bwriter\b|\bartist\b|\billustrator\b|\bcreator\b|\bstory\b|\bscript\b|\bwritten by\b|\bart by\b|\billustrated by\b)/i
const authorNoiseReg = /(状态|狀態|连载中|連載中|已完结|已完結|完结|完結|题材|題材|标签|標籤|类型|類型|分类|分類|更新|最新|人气|人氣|地区|地區|年份|别名|別名|简介|簡介|评分|評分|收藏|点击|點擊|进度|進度|\bstatus\b|\bongoing\b|\bcompleted\b|\bcomplete\b|\bgenre\b|\btag(?:s)?\b|\btype\b|\bcategory\b|\bcategories\b|\bupdate(?:d)?\b|\blatest\b|\bpopular(?:ity)?\b|\bregion\b|\byear\b|\balias(?:es)?\b|\bsummary\b|\bdescription\b|\brating\b|\bscore\b|\bfavorite(?:s)?\b|\bviews?\b|\bprogress\b)/i
const authorStopPatterns = [
  /状态/i, /狀態/i, /连载中/i, /連載中/i, /已完结/i, /已完結/i, /完结/i, /完結/i,
  /题材/i, /題材/i, /标签/i, /標籤/i, /类型/i, /類型/i, /分类/i, /分類/i,
  /更新/i, /最新/i, /人气/i, /人氣/i, /地区/i, /地區/i, /年份/i, /别名/i, /別名/i,
  /简介/i, /簡介/i, /评分/i, /評分/i, /收藏/i, /点击/i, /點擊/i, /进度/i, /進度/i,
  /\bstatus\b/i, /\bongoing\b/i, /\bcompleted\b/i, /\bcomplete\b/i,
  /\bgenre\b/i, /\btag\b/i, /\btags\b/i, /\btype\b/i, /\bcategory\b/i, /\bcategories\b/i,
  /\bupdate\b/i, /\bupdated\b/i, /\blatest\b/i, /\bpopularity\b/i, /\bpopular\b/i,
  /\bregion\b/i, /\byear\b/i, /\balias\b/i, /\baliases\b/i, /\bsummary\b/i, /\bdescription\b/i,
  /\brating\b/i, /\bscore\b/i, /\bfavorites\b/i, /\bfavorite\b/i, /\bview\b/i, /\bviews\b/i, /\bprogress\b/i
]

const splitAuthorTextSegments = (text) => {
  return String(text || '')
    .replace(/\r/g, '\n')
    .split(/\n|[|｜;；]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const stripAuthorNoise = (text) => {
  let value = String(text || '').trim()
  let stopIndex = value.length
  authorStopPatterns.forEach((pattern) => {
    const match = value.match(pattern)
    if (match && match.index > 0 && match.index < stopIndex) {
      stopIndex = match.index
    }
  })
  if (stopIndex !== value.length) {
    value = value.slice(0, stopIndex)
  }
  value = value
    .replace(/^[\s:：/／|｜,，;；·•\-()[\]{}<>]+/, '')
    .replace(/[\s:：/／|｜,，;；·•\-()[\]{}<>]+$/, '')
    .replace(/\b(?:by)\b\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return value
}

const normalizeAuthorName = (text, allowLoose = false) => {
  if (!text) {
    return ''
  }

  const segments = splitAuthorTextSegments(text)
  const candidateList = segments.length > 0 ? segments : [String(text)]
  const preferredSegments = candidateList.filter(item => authorHintReg.test(item))
  const targetSegments = preferredSegments.length > 0 ? preferredSegments : (allowLoose ? candidateList : [])

  for (let i = 0; i < targetSegments.length; i++) {
    let authorName = targetSegments[i]
    const hasPrefix = authorPrefixReg.test(authorName)
    authorName = authorName.replace(authorPrefixReg, '')
    authorName = stripAuthorNoise(authorName)
    if (!authorName) {
      continue
    }
    if (authorNoiseReg.test(authorName)) {
      continue
    }
    if (!allowLoose && !hasPrefix) {
      continue
    }
    if (authorName.length > 40) {
      continue
    }
    return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(authorName)
  }
  return ''
}

const getAuthorNameFromDom = (root, webConfig) => {
  const selectors = []
  if (webConfig?.authorCss) {
    if ((0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .getType */ .oL)(webConfig.authorCss) === 'Array') {
      selectors.push(...webConfig.authorCss)
    } else {
      selectors.push(webConfig.authorCss)
    }
  }
  selectors.push(
    '[itemprop="author"]',
    '[itemprop="creator"]',
    '[class*=author i]',
    '[id*=author i]',
    '[class*=writer i]',
    '[class*=artist i]',
    '[class*=creator i]',
    '[class*=illustrator i]',
    '[id*=writer i]',
    '[id*=artist i]',
    '[id*=creator i]',
    '[id*=illustrator i]',
    '[data-testid*=author i]'
  )

  for (let i = 0; i < selectors.length; i++) {
    const authorName = normalizeAuthorName(getDomText(root, selectors[i]), true)
    if (authorName) {
      return authorName
    }
  }

  try {
    const textDomList = root.querySelectorAll('p, span, div, li, dd, dt, a, strong')
    for (let i = 0; i < textDomList.length; i++) {
      const text = (textDomList[i].innerText || textDomList[i].textContent || '').trim()
      if (text.length === 0 || text.length > 120) {
        continue
      }
      if (authorHintReg.test(text)) {
        const authorName = normalizeAuthorName(text)
        if (authorName) {
          return authorName
        }
      }
    }
  } catch (error) {
    //
  }
  return ''
}

const getCurrentComicMeta = (webConfig, root = document) => {
  const comicName = webConfig?.comicNameCss ? getDomText(root, webConfig.comicNameCss).split('\n')[0] : ''
  const authorName = getAuthorNameFromDom(root, webConfig)
  return {
    comicName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName),
    authorName
  }
}

const getChapterNameByElement = (element, chapterNameReg) => {
  let chapterName = ''
  try {
    if (!chapterNameReg) {
      chapterName = element.innerText || element.textContent || ''
    } else {
      chapterName = element.outerHTML.match(chapterNameReg)[1]
    }
  } catch (error) {
    chapterName = ''
  }
  return (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(chapterName)
}

const getElementUrl = (element, baseUrl) => {
  const href = element.getAttribute('href')
  if (!href || href.startsWith('javascript:')) {
    return 'javascript:void();'
  }
  try {
    return new URL(href, baseUrl).href
  } catch (error) {
    return href
  }
}

const pushChapterData = (list, nodeList, currentWeb, type, pageUrl, comicName, authorName) => {
  const hasSpend = currentWeb.hasSpend
  const chapterNameReg = currentWeb.chapterNameReg
  nodeList.forEach(dom => {
    const urls = dom.querySelectorAll('a')
    const readtype = currentWeb.readtype

    urls.forEach((element) => {
      const chapterName = getChapterNameByElement(element, chapterNameReg)
      let currentIsPay = false
      if (hasSpend) {
        const payKey = currentWeb.payKey
        const parent = element.parentElement
        if (parent && parent.outerHTML.indexOf(payKey) > 0) {
          currentIsPay = true
        }
      }

      const data = {
        comicName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(comicName),
        authorName: (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .trimSpecial */ .Sc)(authorName || ''),
        comicPageUrl: pageUrl,
        webName: currentWeb.webName,
        chapterNumStr: '',
        chapterName,
        downChapterName: '',
        url: getElementUrl(element, pageUrl),
        characterType: type,
        readtype,
        isPay: currentIsPay,
        isSelect: false
      }

      if (data.chapterName !== '') {
        list.push(data)
      }
    })
  })
}

const getChapterListFromRoot = (root, currentWeb, pageUrl, comicName, authorName = '') => {
  if (typeof currentWeb?.getChaptersFromRoot === 'function') {
    const customList = currentWeb.getChaptersFromRoot(root, pageUrl, comicName, authorName)
    if (Array.isArray(customList)) {
      return customList
    }
  }

  const list = []
  const nodeList = root.querySelectorAll(currentWeb.chapterCss)
  pushChapterData(list, nodeList, currentWeb, 'one', pageUrl, comicName, authorName)

  if (currentWeb.chapterCss_2) {
    const nodeList2 = root.querySelectorAll(currentWeb.chapterCss_2)
    pushChapterData(list, nodeList2, currentWeb, 'many', pageUrl, comicName, authorName)
  }
  return list
}

const getComicInfoFromHtml = (html, currentWeb, pageUrl) => {
  const root = (0,_utils_index__WEBPACK_IMPORTED_MODULE_0__/* .parseToDOM */ .U3)(html)
  const { comicName, authorName } = getCurrentComicMeta(currentWeb, root)
  const chapters = getChapterListFromRoot(root, currentWeb, pageUrl, comicName, authorName)
  return {
    comicName,
    authorName,
    chapters
  }
}

let currentComics = null

// 网站匹配
const matchWeb = (url) => {
  currentComics = findWebByUrl(url)
}

function funSplicing(funStr) {
  const getImgsGroup = funStr.match(/((async )?function\(.*{)([\s\S]*)/)
  const funHead = getImgsGroup[1]
  const funTail = getImgsGroup[3]
  let insertCode = ''
  if (funStr.includes('funstrToData')) {
    insertCode = insertCode + _utils_index__WEBPACK_IMPORTED_MODULE_0__/* .funstrToData.toString */ .D.toString() + '\n'
  }
  if (funStr.includes('request')) {
    insertCode = insertCode + 'const request = window.request' + '\n'
  }
  const code = `
  (function(){
    return ${funHead}
  // 注入开始
  ${insertCode}
  // 注入结束
  ${funTail}
  })()`
  const fun = eval(code)
  // console.log('fun: ', fun.toString())
  return fun
}



/***/ }),

/***/ 3624:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => (/* binding */ funstrToData),
/* harmony export */   "HM": () => (/* binding */ loadStyle2),
/* harmony export */   "Sc": () => (/* binding */ trimSpecial),
/* harmony export */   "U3": () => (/* binding */ parseToDOM),
/* harmony export */   "WY": () => (/* binding */ request),
/* harmony export */   "XB": () => (/* binding */ openVerifyPage),
/* harmony export */   "Xr": () => (/* binding */ loadStyle),
/* harmony export */   "gJ": () => (/* binding */ getImage),
/* harmony export */   "gw": () => (/* binding */ delay),
/* harmony export */   "m1": () => (/* binding */ getdomain),
/* harmony export */   "oL": () => (/* binding */ getType),
/* harmony export */   "qs": () => (/* binding */ startScroll),
/* harmony export */   "w1": () => (/* binding */ doThingsEachSecond),
/* harmony export */   "xo": () => (/* binding */ addZeroForNum),
/* harmony export */   "zd": () => (/* binding */ downFile)
/* harmony export */ });
/* unused harmony export getCookie */
/* harmony import */ var _utils_comics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8872);
/* harmony import */ var _config_setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2393);



const loadStyle = (url, name, text) => {
  const head = document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.name = name
  style.id = name
  style.innerText = text
  head.appendChild(style)
}

const loadStyle2 = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = url
    link.media = 'all'
    head.appendChild(link)
    setTimeout(() => {
      resolve(true)
    }, 1200)
  })
}

function trimSpecial(string) {
  if (string !== '') {
    const pattern = /[`~!@#$^\&*|{}'<>?:;~']/g
    string = string.replace(pattern, '')
    string = string.replace(/\n|\r/g, '').trim()
  }
  return string
}

const getType = (obj) => {
  const type = typeof obj
  if (type !== 'object') {
    return type
  }
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
}

const getFrameContent = async(id, url) => {
  const iframePromise = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.id = id
    iframe.height = 150
    iframe.class = '10comicframe'
    iframe.style.visibility = 'hidden'
    iframe.src = url
    document.body.appendChild(iframe)
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function() {
        resolve(iframe.contentDocument.body.outerHTML)
      })
    } else {
      iframe.onload = function() {
        resolve(iframe.contentDocument.body.outerHTML)
      }
    }
  })

  return new Promise((resolve, reject) => {
    iframePromise.then(
      (success) => {
        resolve(success)
      },
      error => {
        console.log(error)
        reject('')
      }
    )
  })
}

const getImage = async(processData) => {
  try {
    const url = processData.url
    let response = ''
    // 获取网页内容
    if (!_utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics.useFrame */ .Po.useFrame) {
      const data = await request({ method: 'get', url, useCookie: processData.isPay })
      response = data.response
    } else {
      const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      const random1 = Math.round(Math.random() * 25) + 0
      const random2 = Math.round(Math.random() * 25) + 0
      const id = 'ifr' + new Date().getTime() + arr[random1] + arr[random2]
      response = await getFrameContent(id, url)
      processData.frameId = id
    }

    const imgs = await _utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics.getImgs */ .Po.getImgs(response, processData)
    return new Promise((resolve, reject) => {
      resolve(imgs)
    })
  } catch (error) {
    console.log('getImageError: ', error)
    return new Promise((resolve, reject) => {
      reject([])
    })
  }
}

const request = async function request(...details) {
  let method, url, data, headers, responseType, timeout, useCookie, cookie, onload, onerror, ontimeout, tail
  // 只有一个参数
  if (details.length === 1) {
    ({ method, url, data, headers, responseType, timeout, useCookie, cookie, onload, onerror, ontimeout } = details[0])
    if (useCookie && !cookie) {
      cookie = document.cookie
    }
  } else { // 含多个参数时 [*method, *url, data, headers]
    [method, url, ...tail] = details
    if (tail) {
      tail.length > 0 ? (data = tail[0]) : ''
      tail.length > 1 ? (headers = tail[1]) : ''
    }
  }

  // 设置currentComics中的 headers
  if (!headers && _utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics */ .Po !== null) {
    headers = _utils_comics__WEBPACK_IMPORTED_MODULE_0__/* .currentComics.headers */ .Po.headers
  }

  // 无效地址
  if (url === null || url === '') {
    return new Promise((resolve, reject) => {
      resolve('')
    })
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method,
      url,
      headers: (headers || ''),
      data: (data || null),
      responseType,
      timeout: (timeout || 30 * 1000),
      cookie: (cookie || ''),
      onload: (onload || function(res) {
        resolve(res)
      }),
      onerror: (onerror || function(e) {
        console.log('request-e: ', e)
        resolve('onerror')
      }),
      ontimeout: (ontimeout || function() {
        console.log('ontimeout: ', ontimeout)
        resolve('timeout')
      })
    })
  })
}

const openVerifyPage = (url) => {
  if (!url) {
    return null
  }

  try {
    // eslint-disable-next-line no-undef
    if (typeof GM_openInTab !== 'undefined') {
      // eslint-disable-next-line no-undef
      return GM_openInTab(url, {
        active: true,
        insert: true,
        setParent: true
      })
    }
  } catch (error) {
    console.log('openVerifyPageError: ', error)
  }

  return window.open(url, '_blank')
}

const getRootDir = () => {
  try {
    const value = String((0,_config_setup__WEBPACK_IMPORTED_MODULE_1__/* .getStorage */ .cF)('rootDir') || '').trim()
    if (value === '10Comic') {
      return ''
    }
    return value
  } catch (error) {
    return ''
  }
}

const downFile = async(...detail) => {
  let url, name, headers, onload, onerror, ontimeout
  if (detail.length === 1) {
    ({ url, name, headers, onload, onerror, ontimeout } = detail[0])
  } else {
    url = detail[0]
    name = detail[1]
  }
  name = name.replace(/\s+/ig, ' ')
  const rootDir = getRootDir()
  const downloadName = rootDir ? rootDir + '\\' + name : name

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_download({
      url,
      name: downloadName,
      headers: headers,
      onload: (onload || function(res) {
        resolve(true)
      }),
      onerror: (onerror || function(e) {
        console.log('downFile-e: ', e)
        resolve(false)
      }),
      ontimeout: (ontimeout || function() {
        resolve(false)
      })
    })
  })
}

const addZeroForNum = (num, bitNum) => {
  let newNum = num + ''
  if (newNum.length < bitNum) {
    const zeroStr = new Array(bitNum + 1).join('0')
    newNum = zeroStr + newNum
    newNum = newNum.slice(-bitNum)
    return newNum
  }
  return newNum
}

// 网站匹配
const getdomain = (url) => {
  if (!url) {
    url = window.location.href
  }
  let hname = ''
  var domain = url.split('/')
  if (domain[2]) {
    hname = domain[2]
  } else {
    hname = ''
  }
  return hname
}

const parseToDOM = (str) => {
  var div = document.createElement('div')
  if (typeof str === 'string') {
    div.innerHTML = str
  }
  return div
}

function delay(n) {
  return new Promise(function(resolve) {
    setTimeout(resolve, n * 1000)
  })
}

// 在规定时间内坚持做某事，直到事情成功为止
// @param {num, func} (secondNum, somethimefunc)
// * secondNum 秒数
// * somethimefunc  事情函数，执行时返回值为“true”代表成功了
async function doThingsEachSecond(secondNum, somethimefunc) {
  let i = 0; let res
  do {
    res = somethimefunc()
    if (res) {
      i = secondNum // res 成功了，还没有结束，偷偷改个时间吧
    } else {
      await delay(1)
    }
    i++
  } while (i < secondNum)
}

// 窗口滚动
// @param {window, funcArray} (scrollWindow, conditions)
// * scrollWindow 滚动窗口
// * conditions  结束滚动窗口条件函数数组
async function startScroll(scrollWindow, conditions) {
  return new Promise((resolve, reject) => {
    const id = setInterval(function() {
      scrollWindow.scrollBy(0, 50)
      conditions.forEach((func, index) => {
        // 执行func
        if (func()) {
          clearInterval(id)
          resolve([id, `condition_${index + 1}`])
        }
      })
    }, 200)
  })
}

const funstrToData = function funstrToData(str, reg) {
  const group = str.matchAll(reg)
  const func = []
  for (const item of group) {
    // 匿名函数主体
    // function (str){
    //     console.log(str);
    // }
    func.push(item[1])
    // 函数 执行参数部分
    func.push(item[2]) // ("aaaaa")
  }
  // 如没有 参数
  if (!func[1]) {
    func[1] = '()'
  }
  const code = '(' + func[0] + ')' + func[1]
  // code =>
  // (function (str){
  //   //此时会输出 aaaaa
  //   console.log(str);
  // })("aaaaa")

  // eslint-disable-next-line no-eval
  const data = eval(code)
  return data
}

const getCookie = (cookieName) => {
  const strCookie = document.cookie
  const cookieList = strCookie.split(';')

  for (let i = 0; i < cookieList.length; i++) {
    const arr = cookieList[i].split('=')
    if (cookieName === arr[0].trim()) {
      return arr[1]
    }
  }

  return ''
}


/***/ }),

/***/ 8871:
/***/ ((module) => {

"use strict";
module.exports = vant;

/***/ }),

/***/ 9527:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 9331:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 3480:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["8740","䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"],["8767","綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"],["87a1","𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"],["8840","㇀",4,"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"],["88a1","ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"],["8940","𪎩𡅅"],["8943","攊"],["8946","丽滝鵎釟"],["894c","𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"],["89a1","琑糼緍楆竉刧"],["89ab","醌碸酞肼"],["89b0","贋胶𠧧"],["89b5","肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"],["89c1","溚舾甙"],["89c5","䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"],["8a40","𧶄唥"],["8a43","𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"],["8a64","𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"],["8a76","䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"],["8aa1","𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"],["8aac","䠋𠆩㿺塳𢶍"],["8ab2","𤗈𠓼𦂗𠽌𠶖啹䂻䎺"],["8abb","䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"],["8ac9","𪘁𠸉𢫏𢳉"],["8ace","𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"],["8adf","𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"],["8af6","𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"],["8b40","𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"],["8b55","𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"],["8ba1","𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"],["8bde","𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"],["8c40","倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"],["8ca1","𣏹椙橃𣱣泿"],["8ca7","爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"],["8cc9","顨杫䉶圽"],["8cce","藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"],["8ce6","峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"],["8d40","𠮟"],["8d42","𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"],["8da1","㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"],["8e40","𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"],["8ea1","繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"],["8f40","蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"],["8fa1","𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"],["9040","趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"],["90a1","𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"],["9140","𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"],["91a1","鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"],["9240","𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"],["92a1","働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"],["9340","媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"],["93a1","摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"],["9440","銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"],["94a1","㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"],["9540","𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"],["95a1","衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"],["9640","桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"],["96a1","𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"],["9740","愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"],["97a1","𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"],["9840","𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"],["98a1","咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"],["9940","䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"],["99a1","䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"],["9a40","鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"],["9aa1","黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"],["9b40","𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"],["9b62","𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"],["9ba1","椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"],["9c40","嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"],["9ca1","㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"],["9d40","𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"],["9da1","辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"],["9e40","𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"],["9ea1","鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"],["9ead","𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"],["9ec5","㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"],["9ef5","噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"],["9f40","籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"],["9f4f","凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"],["9fa1","椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"],["9fae","酙隁酜"],["9fb2","酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"],["9fc1","𤤙盖鮝个𠳔莾衂"],["9fc9","届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"],["9fdb","歒酼龥鮗頮颴骺麨麄煺笔"],["9fe7","毺蠘罸"],["9feb","嘠𪙊蹷齓"],["9ff0","跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"],["a040","𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"],["a055","𡠻𦸅"],["a058","詾𢔛"],["a05b","惽癧髗鵄鍮鮏蟵"],["a063","蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"],["a073","坟慯抦戹拎㩜懢厪𣏵捤栂㗒"],["a0a1","嵗𨯂迚𨸹"],["a0a6","僙𡵆礆匲阸𠼻䁥"],["a0ae","矾"],["a0b0","糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"],["a0d4","覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"],["a0e2","罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"],["a3c0","␀",31,"␡"],["c6a1","①",9,"⑴",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",23],["c740","す",58,"ァアィイ"],["c7a1","ゥ",81,"А",5,"ЁЖ",4],["c840","Л",26,"ёж",25,"⇧↸↹㇏𠃌乚𠂊刂䒑"],["c8a1","龰冈龱𧘇"],["c8cd","￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"],["c8f5","ʃɐɛɔɵœøŋʊɪ"],["f9fe","￭"],["fa40","𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"],["faa1","鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"],["fb40","𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"],["fba1","𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"],["fc40","廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"],["fca1","𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"],["fd40","𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"],["fda1","𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"],["fe40","鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"],["fea1","𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"]]');

/***/ }),

/***/ 3336:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["0","\\u0000",127,"€"],["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],["9980","檧檨檪檭",114,"欥欦欨",6],["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],["a2a1","ⅰ",9],["a2b1","⒈",19,"⑴",19,"①",9],["a2e5","㈠",9],["a2f1","Ⅰ",11],["a3a1","！＂＃￥％",88,"￣"],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],["a6ee","︻︼︷︸︱"],["a6f4","︳︴"],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],["a8bd","ńň"],["a8c0","ɡ"],["a8c5","ㄅ",36],["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],["a959","℡㈱"],["a95c","‐"],["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],["a980","﹢",4,"﹨﹩﹪﹫"],["a996","〇"],["a9a4","─",75],["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],["bb40","籃",9,"籎",36,"籵",5,"籾",9],["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],["bd40","紷",54,"絯",7],["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],["be40","継",12,"綧",6,"綯",42],["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],["bf40","緻",62],["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],["c040","繞",35,"纃",23,"纜纝纞"],["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],["d440","訞",31,"訿",8,"詉",21],["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],["d540","誁",7,"誋",7,"誔",46],["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],["d640","諤",34,"謈",27],["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],["d740","譆",31,"譧",4,"譭",25],["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],["d940","貮",62],["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],["dd40","軥",62],["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],["e240","釦",62],["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],["e340","鉆",45,"鉵",16],["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],["e440","銨",5,"銯",24,"鋉",31],["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],["e540","錊",51,"錿",10],["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],["e640","鍬",34,"鎐",27],["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],["e740","鏎",7,"鏗",54],["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],["ee40","頏",62],["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],["f040","餈",4,"餎餏餑",28,"餯",26],["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],["f140","馌馎馚",10,"馦馧馩",47],["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],["f240","駺",62],["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],["f540","魼",62],["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],["f640","鯜",62],["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],["f740","鰼",62],["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],["f840","鳣",62],["f880","鴢",32],["f940","鵃",62],["f980","鶂",32],["fa40","鶣",62],["fa80","鷢",32],["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]]');

/***/ }),

/***/ 7348:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["0","\\u0000",127],["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],["8361","긝",18,"긲긳긵긶긹긻긼"],["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],["8741","놞",9,"놩",15],["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],["8a61","둧",4,"둭",18,"뒁뒂"],["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],["8c41","똀",15,"똒똓똕똖똗똙",4],["8c61","똞",6,"똦",5,"똭",6,"똵",5],["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],["8d41","뛃",16,"뛕",8],["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],["8e61","럂",4,"럈럊",19],["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],["8f41","뢅",7,"뢎",17],["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],["9061","륾",5,"릆릈릋릌릏",15],["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],["9461","봞",5,"봥",6,"봭",12],["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],["9641","뺸",23,"뻒뻓"],["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],["9741","뾃",16,"뾕",8],["9761","뾞",17,"뾱",7],["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],["9841","쁀",16,"쁒",5,"쁙쁚쁛"],["9861","쁝쁞쁟쁡",6,"쁪",15],["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],["9a41","숤숥숦숧숪숬숮숰숳숵",16],["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],["9b61","쌳",17,"썆",7],["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],["9c61","쏿",8,"쐉",6,"쐑",9],["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],["9d41","쒪",13,"쒹쒺쒻쒽",8],["9d61","쓆",25],["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],["a141","좥좦좧좩",18,"좾좿죀죁"],["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],["a241","줐줒",5,"줙",18],["a261","줭",6,"줵",18],["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],["a361","즑",6,"즚즜즞",16],["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],["a481","쨦쨧쨨쨪",28,"ㄱ",93],["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],["a561","쩫",17,"쩾",5,"쪅쪆"],["a581","쪇",16,"쪙",14,"ⅰ",9],["a5b0","Ⅰ",9],["a5c1","Α",16,"Σ",6],["a5e1","α",16,"σ",6],["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],["a761","쬪",22,"쭂쭃쭄"],["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],["a841","쭭",10,"쭺",14],["a861","쮉",18,"쮝",6],["a881","쮤",19,"쮹",11,"ÆÐªĦ"],["a8a6","Ĳ"],["a8a8","ĿŁØŒºÞŦŊ"],["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],["a941","쯅",14,"쯕",10],["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],["aa81","챳챴챶",29,"ぁ",82],["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],["acd1","а",5,"ёж",25],["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],["ae41","췆",5,"췍췎췏췑",16],["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],["af41","츬츭츮츯츲츴츶",19],["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],["b041","캚",5,"캢캦",5,"캮",12],["b061","캻",5,"컂",19],["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],["b161","켥",6,"켮켲",5,"켹",11],["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],["b261","쾎",18,"쾢",5,"쾩"],["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],["b541","킕",14,"킦킧킩킪킫킭",5],["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],["b641","턅",7,"턎",17],["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],["b741","텮",13,"텽",6,"톅톆톇톉톊"],["b761","톋",20,"톢톣톥톦톧"],["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],["b841","퇐",7,"퇙",17],["b861","퇫",8,"퇵퇶퇷퇹",13],["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],["be41","퐸",7,"푁푂푃푅",14],["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],["bf41","풞",10,"풪",14],["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],["c061","픞",25],["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],["c161","햌햍햎햏햑",19,"햦햧"],["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],["c361","홢",4,"홨홪",5,"홲홳홵",11],["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],["c641","힍힎힏힑",6,"힚힜힞",5],["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]]');

/***/ }),

/***/ 4284:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["0","\\u0000",127],["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],["a3a1","ㄐ",25,"˙ˉˊˇˋ"],["a3e1","€"],["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]]');

/***/ }),

/***/ 1532:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["0","\\u0000",127],["8ea1","｡",62],["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],["a2ba","∈∋⊆⊇⊂⊃∪∩"],["a2ca","∧∨￢⇒⇔∀∃"],["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["a2f2","Å‰♯♭♪†‡¶"],["a2fe","◯"],["a3b0","０",9],["a3c1","Ａ",25],["a3e1","ａ",25],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["ada1","①",19,"Ⅰ",9],["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],["f4a1","堯槇遙瑤凜熙"],["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["fcf1","ⅰ",9,"￢￤＇＂"],["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],["8fa2c2","¡¦¿"],["8fa2eb","ºª©®™¤№"],["8fa6e1","ΆΈΉΊΪ"],["8fa6e7","Ό"],["8fa6e9","ΎΫ"],["8fa6ec","Ώ"],["8fa6f1","άέήίϊΐόςύϋΰώ"],["8fa7c2","Ђ",10,"ЎЏ"],["8fa7f2","ђ",10,"ўџ"],["8fa9a1","ÆĐ"],["8fa9a4","Ħ"],["8fa9a6","Ĳ"],["8fa9a8","ŁĿ"],["8fa9ab","ŊØŒ"],["8fa9af","ŦÞ"],["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],["8fabbd","ġĥíìïîǐ"],["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]]');

/***/ }),

/***/ 6258:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"uChars":[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],"gbChars":[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189000]}');

/***/ }),

/***/ 4346:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["a140","",62],["a180","",32],["a240","",62],["a280","",32],["a2ab","",5],["a2e3","€"],["a2ef",""],["a2fd",""],["a340","",62],["a380","",31,"　"],["a440","",62],["a480","",32],["a4f4","",10],["a540","",62],["a580","",32],["a5f7","",7],["a640","",62],["a680","",32],["a6b9","",7],["a6d9","",6],["a6ec",""],["a6f3",""],["a6f6","",8],["a740","",62],["a780","",32],["a7c2","",14],["a7f2","",12],["a896","",10],["a8bc",""],["a8bf","ǹ"],["a8c1",""],["a8ea","",20],["a958",""],["a95b",""],["a95d",""],["a989","〾⿰",11],["a997","",12],["a9f0","",14],["aaa1","",93],["aba1","",93],["aca1","",93],["ada1","",93],["aea1","",93],["afa1","",93],["d7fa","",4],["f8a1","",93],["f9a1","",93],["faa1","",93],["fba1","",93],["fca1","",93],["fda1","",93],["fe50","⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"],["fe80","䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",6,"䶮",93]]');

/***/ }),

/***/ 7014:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[["0","\\u0000",128],["a1","｡",62],["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],["81b8","∈∋⊆⊇⊂⊃∪∩"],["81c8","∧∨￢⇒⇔∀∃"],["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["81f0","Å‰♯♭♪†‡¶"],["81fc","◯"],["824f","０",9],["8260","Ａ",25],["8281","ａ",25],["829f","ぁ",82],["8340","ァ",62],["8380","ム",22],["839f","Α",16,"Σ",6],["83bf","α",16,"σ",6],["8440","А",5,"ЁЖ",25],["8470","а",5,"ёж",7],["8480","о",17],["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["8740","①",19,"Ⅰ",9],["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["877e","㍻"],["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["eeef","ⅰ",9,"￢￤＇＂"],["f040","",62],["f080","",124],["f140","",62],["f180","",124],["f240","",62],["f280","",124],["f340","",62],["f380","",124],["f440","",62],["f480","",124],["f540","",62],["f580","",124],["f640","",62],["f680","",124],["f740","",62],["f780","",124],["f840","",62],["f880","",124],["f940",""],["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: external "Vue"
const external_Vue_namespaceObject = Vue;
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_namespaceObject);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=template&id=5ef48958&scoped=true&
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "yi-ling-app" },
    [
      _c(
        "div",
        {
          staticClass: "card",
          class: { "card--hide": _vm.isHide },
          attrs: { id: "app-right" },
        },
        [
          _c(
            "div",
            [
              _c("van-nav-bar", {
                attrs: { id: "border-top-set", title: _vm.titles[this.active] },
              }),
              _vm._v(" "),
              _c(
                "van-swipe",
                {
                  ref: "swipe",
                  staticClass: "my-swipe",
                  staticStyle: { cursor: "default" },
                  attrs: {
                    "indicator-color": "white",
                    touchable: false,
                    duration: 5,
                    "initial-swipe": _vm.active,
                    "show-indicators": false,
                  },
                },
                [
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Home")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Table")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Cover")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Down")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Follow")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Setting")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Metadata")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "van-swipe-item",
                    { staticClass: "swipeitem" },
                    [_c("Pan")],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "app-container" },
                [
                  _c(
                    "van-tabbar",
                    {
                      staticStyle: { position: "absolute" },
                      attrs: {
                        id: "border-bottom-set",
                        "active-color": "#ee0000",
                        "inactive-color": "#000",
                      },
                      model: {
                        value: _vm.active,
                        callback: function ($$v) {
                          _vm.active = $$v
                        },
                        expression: "active",
                      },
                    },
                    [
                      _c("van-tabbar-item", { attrs: { icon: "home-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "todo-list-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "photo-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "underway-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "clock-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "setting-o" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "description" } }),
                      _vm._v(" "),
                      _c("van-tabbar-item", { attrs: { icon: "share-o" } }),
                    ],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c("div", { staticClass: "card__btn", on: { click: _vm.hide } }, [
                _c(
                  "svg",
                  {
                    staticClass: "icon",
                    attrs: {
                      t: "1663828267105",
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      "p-id": "2601",
                    },
                  },
                  [
                    _c("path", {
                      attrs: {
                        d: "M312.888889 995.555556c-17.066667 0-28.444444-5.688889-39.822222-17.066667-22.755556-22.755556-17.066667-56.888889 5.688889-79.644445l364.088888-329.955555c11.377778-11.377778 17.066667-22.755556 17.066667-34.133333 0-11.377778-5.688889-22.755556-17.066667-34.133334L273.066667 187.733333c-22.755556-22.755556-28.444444-56.888889-5.688889-79.644444 22.755556-22.755556 56.888889-28.444444 79.644444-5.688889l364.088889 312.888889c34.133333 28.444444 56.888889 73.955556 56.888889 119.466667s-17.066667 85.333333-51.2 119.466666l-364.088889 329.955556c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778z",
                        "p-id": "2134",
                        fill: "#ee000088",
                      },
                    }),
                  ]
                ),
              ]),
            ],
            1
          ),
        ]
      ),
      _vm._v(" "),
      _c("Search"),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


;// CONCATENATED MODULE: ./src/app.vue?vue&type=template&id=5ef48958&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=template&id=7eb2bc79&scoped=true&
var homevue_type_template_id_7eb2bc79_scoped_true_render = function () {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "homeindex" },
    [
      _c(
        "div",
        {
          style: {
            position: "relative",
            margin: "-5px 0 2px 15px",
            zIndex: 999999,
          },
          attrs: { id: "selectId" },
          on: { mouseleave: _vm.leaveCollapse },
        },
        [
          _c(
            "van-collapse",
            {
              staticStyle: { width: "200px" },
              model: {
                value: _vm.activeNames,
                callback: function ($$v) {
                  _vm.activeNames = $$v
                },
                expression: "activeNames",
              },
            },
            [
              _c(
                "van-collapse-item",
                {
                  staticClass: "xxx",
                  attrs: { title: _vm.checkTitle, name: "1" },
                },
                [
                  _c(
                    "div",
                    {
                      on: {
                        click: function ($event) {
                          return _vm.checkContent(1, "原列表")
                        },
                      },
                    },
                    [_vm._v("原列表")]
                  ),
                  _vm._v(" "),
                  _c("br"),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      on: {
                        click: function ($event) {
                          return _vm.checkContent(2, "导入规则列表")
                        },
                      },
                    },
                    [_vm._v("导入规则列表")]
                  ),
                ]
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("van-icon", {
            attrs: {
              id: "search-ico",
              name: "search",
              size: "30",
              color: "#ee0000",
            },
            on: {
              click: function () {
                this$1.$bus.$emit("showSearchPage")
              },
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _vm.checkValue == 1
        ? _c(
            "van-cell-group",
            { attrs: { inset: "" } },
            _vm._l(_vm.originalInfo, function (item, index) {
              return _c("van-cell", {
                key: index,
                attrs: { "is-link": "" },
                on: {
                  click: function ($event) {
                    return _vm.jump(item.homepage)
                  },
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "title",
                      fn: function () {
                        return [
                          _c("span", [_vm._v(_vm._s(item.webName))]),
                          _vm._v(" "),
                          item.webDesc
                            ? _c("van-icon", {
                                attrs: {
                                  title: item.webDesc,
                                  name: "info-o",
                                  color: "red",
                                },
                              })
                            : _vm._e(),
                        ]
                      },
                      proxy: true,
                    },
                  ],
                  null,
                  true
                ),
              })
            }),
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.checkValue == 2
        ? _c(
            "div",
            [
              _c(
                "van-cell-group",
                { attrs: { inset: "" } },
                _vm._l(_vm.userWebInfo, function (item, index) {
                  return _c("van-cell", {
                    key: index,
                    attrs: { "is-link": "" },
                    on: {
                      click: function ($event) {
                        return _vm.jump(item.homepage)
                      },
                    },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", [_vm._v(_vm._s(item.webName))]),
                              _vm._v(" "),
                              item.webDesc
                                ? _c("van-icon", {
                                    attrs: {
                                      title: item.webDesc,
                                      name: "info-o",
                                      color: "red",
                                    },
                                  })
                                : _vm._e(),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      true
                    ),
                  })
                }),
                1
              ),
            ],
            1
          )
        : _vm._e(),
    ],
    1
  )
}
var homevue_type_template_id_7eb2bc79_scoped_true_staticRenderFns = []
homevue_type_template_id_7eb2bc79_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/home.vue?vue&type=template&id=7eb2bc79&scoped=true&

// EXTERNAL MODULE: ./src/utils/comics.js
var comics = __webpack_require__(8872);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const homevue_type_script_lang_js_ = ({
  name: 'Index',
  data() {
    return {
      originalInfo: [],
      userWebInfo: [],
      //
      activeNames: [1],
      checkValue: 1,
      checkTitle: '原列表'

    }
  },
  created() {
    this.getWeb()
  },
  mounted() {
    this.$bus.$on('getWeb', this.getWeb)
  },
  methods: {
    getWeb() {
      const { originalInfo, userWebInfo } = (0,comics/* getWebList */.eT)()
      this.originalInfo = originalInfo.filter((item) => { return item.showInList !== false })
      this.userWebInfo = userWebInfo
    },
    checkContent(val, title) {
      this.checkValue = val
      this.checkTitle = title
      this.activeNames = []
    },
    leaveCollapse() {
      this.activeNames = []
    },
    jump(url) {
      window.open(url, '_blank')
      // window.location.href = url
    }
  }
});

;// CONCATENATED MODULE: ./src/views/home.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_homevue_type_script_lang_js_ = (homevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(3379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(3565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(9216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(4589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=style&index=0&id=7eb2bc79&lang=less&scoped=true&
var homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_ = __webpack_require__(647);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/home.vue?vue&type=style&index=0&id=7eb2bc79&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default */.Z, options);




       /* harmony default export */ const views_homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_ = (homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default */.Z && homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default.locals */.Z.locals ? homevue_type_style_index_0_id_7eb2bc79_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/home.vue?vue&type=style&index=0&id=7eb2bc79&lang=less&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./src/views/home.vue



;


/* normalize component */

var component = normalizeComponent(
  views_homevue_type_script_lang_js_,
  homevue_type_template_id_7eb2bc79_scoped_true_render,
  homevue_type_template_id_7eb2bc79_scoped_true_staticRenderFns,
  false,
  null,
  "7eb2bc79",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/home.vue"
/* harmony default export */ const home = (component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=template&id=657d4b24&scoped=true&
var tablevue_type_template_id_657d4b24_scoped_true_render = function () {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { ref: "comiclist", staticClass: "comiclist" },
    [
      _c(
        "van-popup",
        {
          style: {
            position: "absolute",
            width: "100%",
            height: "40%",
            borderTop: "1px solid #fcadad",
            marginTop: "-15px",
          },
          attrs: {
            "get-container": "#chapterpage",
            round: "",
            position: "top",
          },
          model: {
            value: _vm.show,
            callback: function ($$v) {
              _vm.show = $$v
            },
            expression: "show",
          },
        },
        [
          _c(
            "van-cell-group",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                width: "350px",
                margin: "10px auto",
              },
              attrs: { title: "选项", inset: "" },
            },
            [
              _c(
                "label",
                {
                  staticStyle: {
                    "margin-top": "5px",
                    "margin-left": "16px",
                    "text-align": "left",
                  },
                },
                [_vm._v("本次下载(临时更改)")]
              ),
              _vm._v(" "),
              _c("van-cell", {
                attrs: { title: "" },
                scopedSlots: _vm._u([
                  {
                    key: "right-icon",
                    fn: function () {
                      return [
                        _c("br"),
                        _vm._v(" "),
                        _c(
                          "van-radio-group",
                          {
                            attrs: { direction: "horizontal" },
                            model: {
                              value: _vm.downType,
                              callback: function ($$v) {
                                _vm.downType = $$v
                              },
                              expression: "downType",
                            },
                          },
                          [
                            _c("van-radio", { attrs: { name: 0 } }, [
                              _vm._v("直接下载"),
                            ]),
                            _vm._v(" "),
                            _c("van-radio", { attrs: { name: 1 } }, [
                              _vm._v("压缩下载"),
                            ]),
                            _vm._v(" "),
                            _c(
                              "van-radio",
                              {
                                attrs: {
                                  name: 2,
                                  title: "拼接后单张高度不超过 10000 像素",
                                },
                              },
                              [
                                _vm._v("拼接下载"),
                                _c("van-icon", {
                                  attrs: { name: "info-o", color: "red" },
                                }),
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c(
                              "van-radio",
                              {
                                attrs: {
                                  name: 3,
                                  title:
                                    "创建漫画总文件夹，并在里面按章节生成子文件夹",
                                },
                              },
                              [_vm._v("批量下载")]
                            ),
                          ],
                          1
                        ),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              }),
              _vm._v(" "),
              _vm.getDownloadSourceOptions().length > 1
                ? _c("van-cell", {
                    attrs: { title: "图片来源" },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "right-icon",
                          fn: function () {
                            return [
                              _c(
                                "van-radio-group",
                                {
                                  attrs: { direction: "horizontal" },
                                  model: {
                                    value: _vm.imageSource,
                                    callback: function ($$v) {
                                      _vm.imageSource = $$v
                                    },
                                    expression: "imageSource",
                                  },
                                },
                                _vm._l(
                                  _vm.getDownloadSourceOptions(),
                                  function (item) {
                                    return _c(
                                      "van-radio",
                                      {
                                        key: item.value,
                                        attrs: { name: item.value },
                                      },
                                      [_vm._v(_vm._s(item.text))]
                                    )
                                  }
                                ),
                                1
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      false,
                      2067699353
                    ),
                  })
                : _vm._e(),
              _vm._v(" "),
              _c("van-cell", [
                _c(
                  "div",
                  {
                    style: { display: "flex", justifyContent: "space-between" },
                  },
                  [
                    _c(
                      "van-checkbox",
                      {
                        attrs: { "label-position": "left" },
                        on: { change: _vm.characterSequenceChange },
                        model: {
                          value: _vm.useCharacterNum,
                          callback: function ($$v) {
                            _vm.useCharacterNum = $$v
                          },
                          expression: "useCharacterNum",
                        },
                      },
                      [_vm._v("章节补充序号\n          ")]
                    ),
                    _vm._v(" "),
                    _c(
                      "van-checkbox",
                      {
                        attrs: {
                          disabled: !_vm.useCharacterNum,
                          "label-position": "left",
                        },
                        on: { change: _vm.characterSequenceChange },
                        model: {
                          value: _vm.characterNumSequence,
                          callback: function ($$v) {
                            _vm.characterNumSequence = $$v
                          },
                          expression: "characterNumSequence",
                        },
                      },
                      [_vm._v("—序号反序\n          ")]
                    ),
                  ],
                  1
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticStyle: {
                    "margin-top": "8px",
                    display: "flex",
                    height: "25px",
                    "line-height": "25px",
                    "justify-content": "space-between",
                  },
                },
                [
                  _c(
                    "label",
                    {
                      staticStyle: {
                        "margin-left": "16px",
                        "text-align": "left",
                      },
                      attrs: { for: "" },
                    },
                    [_vm._v("下载当前阅读章节 (测试)")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { type: "default", size: "mini" },
                      on: { click: _vm.getCurrentWebData },
                    },
                    [_vm._v("获取")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c("van-cell", {
                staticStyle: { "padding-top": "0px" },
                attrs: { title: "" },
                scopedSlots: _vm._u([
                  {
                    key: "right-icon",
                    fn: function () {
                      return [
                        _c("van-field", {
                          attrs: {
                            name: "defineComicName",
                            placeholder: "漫画名",
                          },
                          model: {
                            value: _vm.defineComicName,
                            callback: function ($$v) {
                              _vm.defineComicName = $$v
                            },
                            expression: "defineComicName",
                          },
                        }),
                        _vm._v(" "),
                        _c("van-field", {
                          attrs: {
                            name: "definechapterName",
                            placeholder: "章节名",
                          },
                          model: {
                            value: _vm.definechapterName,
                            callback: function ($$v) {
                              _vm.definechapterName = $$v
                            },
                            expression: "definechapterName",
                          },
                        }),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { attrs: { id: "editItem" } }, [
        _c(
          "div",
          [
            _c(
              "van-button",
              {
                attrs: { size: "mini", disabled: !_vm.showSelectList },
                on: { click: _vm.selectAll },
              },
              [_vm._v("全选")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                attrs: { size: "mini", disabled: !_vm.showSelectList },
                on: { click: _vm.CancelSelect },
              },
              [_vm._v("取消")]
            ),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "editItem-center" },
          [
            _vm._v("\n      选\n      "),
            _c("van-icon", {
              style: { cursor: "pointer" },
              attrs: { name: "more-o", color: "#ee0000", size: "25" },
              on: {
                click: function () {
                  this$1.show = !this$1.show
                },
              },
            }),
            _vm._v(" 项\n    "),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticStyle: { display: "flex", gap: "8px" } },
          [
            _c(
              "van-button",
              {
                staticStyle: { width: "95px" },
                attrs: {
                  size: "mini",
                  round: "",
                  disabled: _vm.comicName === "------",
                },
                on: { click: _vm.addCurrentComicToFollow },
              },
              [_vm._v("加入追更")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                staticStyle: { width: "80px" },
                attrs: {
                  size: "mini",
                  round: "",
                  disabled: !_vm.showSelectList,
                },
                on: { click: _vm.downSelectList },
              },
              [_vm._v("下载")]
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c(
        "van-divider",
        {
          style: {
            color: "#1989fa",
            borderColor: "#1989fa",
            padding: "0 15px",
            height: "10px",
          },
        },
        [
          _c(
            "code",
            {
              staticStyle: { cursor: "pointer" },
              on: { click: _vm.reloadList },
            },
            [_vm._v("重载列表")]
          ),
        ]
      ),
      _vm._v(" "),
      !_vm.showSelectList
        ? _c(
            "div",
            [
              _c("van-empty", { attrs: { description: "漫画章节" } }, [
                _c(
                  "div",
                  {
                    staticStyle: {
                      display: "flex",
                      gap: "10px",
                      "justify-content": "center",
                    },
                  },
                  [
                    _c(
                      "van-button",
                      {
                        staticClass: "bottom-button",
                        staticStyle: { width: "120px" },
                        attrs: {
                          round: "",
                          disabled: _vm.comicName === "------",
                        },
                        on: { click: _vm.getSelectList },
                      },
                      [_vm._v(" 加载 ")]
                    ),
                    _vm._v(" "),
                    _c(
                      "van-button",
                      {
                        staticClass: "bottom-button",
                        staticStyle: { width: "120px" },
                        attrs: {
                          round: "",
                          disabled: _vm.comicName === "------",
                        },
                        on: { click: _vm.addCurrentComicToFollow },
                      },
                      [_vm._v(" 加入追更 ")]
                    ),
                  ],
                  1
                ),
              ]),
              _vm._v(" "),
              _c(
                "van-cell-group",
                { attrs: { id: "comicinfo", inset: "" } },
                [
                  _c("van-cell", {
                    attrs: { title: "网站", value: _vm.webname },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: { title: "漫画", value: _vm.comicName },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: { title: "作者", value: _vm.authorName || "--" },
                  }),
                ],
                1
              ),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c("van-overlay", { attrs: { id: "overlayDom", show: _vm.overlayShow } }),
      _vm._v(" "),
      _vm.showSelectList
        ? _c(
            "div",
            {
              staticStyle: { "border-radius": "25px" },
              attrs: { id: "select-list" },
            },
            [
              _c("div", { attrs: { id: "select-list-top" } }, [
                _c("div", { attrs: { id: "select-list-info" } }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c(
                    "div",
                    { attrs: { id: "select-list-info-right" } },
                    [
                      _c("van-icon", {
                        style: { cursor: "pointer" },
                        attrs: {
                          name: "edit",
                          color: "#66ccff",
                          size: "18",
                          title: "编辑",
                        },
                        on: { click: _vm.editList },
                      }),
                      _vm._v(" "),
                      _c("van-icon", {
                        style: { cursor: "pointer" },
                        attrs: {
                          name: "sort",
                          color: "#ee000088",
                          size: "18",
                          title: "排序",
                        },
                        on: { click: _vm.reverseList },
                      }),
                    ],
                    1
                  ),
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.isEditList,
                        expression: "isEditList",
                      },
                    ],
                    attrs: { id: "select-show-edit" },
                  },
                  [
                    _c(
                      "div",
                      {
                        staticStyle: {
                          display: "flex",
                          "align-items": "center",
                        },
                      },
                      [
                        _c(
                          "label",
                          {
                            staticStyle: {
                              "text-align": "left",
                              "margin-right": "20px",
                            },
                            attrs: { for: "" },
                          },
                          [_vm._v("删除所选章节首个字符")]
                        ),
                        _vm._v(" "),
                        _c(
                          "van-button",
                          {
                            attrs: { type: "default", size: "mini" },
                            on: {
                              click: function ($event) {
                                return _vm.delOnechapterNameFont(1)
                              },
                            },
                          },
                          [_vm._v("删除")]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticStyle: {
                          display: "flex",
                          "align-items": "center",
                          "margin-top": "3px",
                          "margin-bottom": "3px",
                        },
                      },
                      [
                        _c(
                          "label",
                          {
                            staticStyle: {
                              "text-align": "left",
                              "margin-right": "20px",
                            },
                            attrs: { for: "" },
                          },
                          [_vm._v("删除所选章节末尾一个字符")]
                        ),
                        _vm._v(" "),
                        _c(
                          "van-button",
                          {
                            attrs: { type: "default", size: "mini" },
                            on: {
                              click: function ($event) {
                                return _vm.delOnechapterNameFont(-1)
                              },
                            },
                          },
                          [_vm._v("删除")]
                        ),
                      ],
                      1
                    ),
                  ]
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "select-list-2" } },
                [
                  _c(
                    "van-cell-group",
                    {
                      style: _vm.isEditList
                        ? "max-height: 530px;"
                        : "max-height: 585px;",
                      attrs: { id: "select-list-2-1", inset: "" },
                    },
                    _vm._l(_vm.list, function (item, index) {
                      return _c("van-cell", {
                        key: index,
                        style: _vm.titleStyle(
                          item.url,
                          item.isPay,
                          item.characterType
                        ),
                        attrs: {
                          title: _vm.showComicTitleName(
                            item.chapterNumStr,
                            item.chapterName
                          ),
                        },
                        scopedSlots: _vm._u(
                          [
                            _vm.isEditList
                              ? {
                                  key: "title",
                                  fn: function () {
                                    return [
                                      _c(
                                        "div",
                                        {
                                          staticStyle: {
                                            display: "flex",
                                            "justify-content": "space-around",
                                          },
                                        },
                                        [
                                          _c(
                                            "label",
                                            {
                                              attrs: {
                                                for: item.chapterNumStr,
                                              },
                                            },
                                            [_vm._v(_vm._s(item.chapterNumStr))]
                                          ),
                                          _vm._v(" "),
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: item.chapterName,
                                                expression: "item.chapterName",
                                              },
                                            ],
                                            staticClass: "input-chaptername",
                                            attrs: { type: "text" },
                                            domProps: {
                                              value: item.chapterName,
                                            },
                                            on: {
                                              input: function ($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.$set(
                                                  item,
                                                  "chapterName",
                                                  $event.target.value
                                                )
                                              },
                                            },
                                          }),
                                        ]
                                      ),
                                    ]
                                  },
                                  proxy: true,
                                }
                              : null,
                            {
                              key: "right-icon",
                              fn: function () {
                                return [
                                  _c("van-checkbox", {
                                    staticClass: "selectChapter",
                                    attrs: {
                                      name: index,
                                      disabled:
                                        item.url !== "javascript:void();"
                                          ? false
                                          : true,
                                      "icon-size": "24px",
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.radioSelect(
                                          item.isSelect,
                                          index
                                        )
                                      },
                                    },
                                    model: {
                                      value: item.isSelect,
                                      callback: function ($$v) {
                                        _vm.$set(item, "isSelect", $$v)
                                      },
                                      expression: "item.isSelect",
                                    },
                                  }),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      })
                    }),
                    1
                  ),
                ],
                1
              ),
            ]
          )
        : _vm._e(),
    ],
    1
  )
}
var tablevue_type_template_id_657d4b24_scoped_true_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { attrs: { id: "select-list-info-left" } }, [
      _c("span", [_vm._v("颜色")]),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "blue" },
        attrs: { title: "免费" },
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "#AA6680" },
        attrs: { title: "最新/其它/单行本/卷" },
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "red" },
        attrs: { title: "付费" },
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "span-circle",
        staticStyle: { background: "#ccc" },
        attrs: { title: "无效" },
      }),
    ])
  },
]
tablevue_type_template_id_657d4b24_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/table.vue?vue&type=template&id=657d4b24&scoped=true&

// EXTERNAL MODULE: ./src/config/setup.js
var setup = __webpack_require__(2393);
// EXTERNAL MODULE: ./src/utils/index.js
var utils = __webpack_require__(3624);
;// CONCATENATED MODULE: ./src/utils/follow.js




const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value || []))
}

const dedupeChapters = (chapterList) => {
  const urlSet = new Set()
  const result = []
  chapterList.forEach((item) => {
    if (!item?.url || item.url === 'javascript:void();' || urlSet.has(item.url)) {
      return
    }
    urlSet.add(item.url)
    result.push(item)
  })
  return result
}

const normalizeCompareText = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .toLowerCase()
    .replace(/[【】\[\]()（）「」『』《》〈〉]/g, '')
    .replace(/[·•:：]/g, '')
    .replace(/\s+/g, '')
}

const scoreSearchResultName = (keyword, resultName) => {
  const target = normalizeCompareText(keyword)
  const current = normalizeCompareText(resultName)
  if (!target || !current) {
    return 0
  }
  if (target === current) {
    return 120
  }
  if (current.includes(target) || target.includes(current)) {
    return 80
  }
  let prefixLen = 0
  while (prefixLen < target.length && prefixLen < current.length && target[prefixLen] === current[prefixLen]) {
    prefixLen++
  }
  if (prefixLen >= 2) {
    return 30 + prefixLen
  }
  return 0
}

const pickBestSearchResult = (keyword, resultList = []) => {
  const candidates = (resultList || [])
    .map(item => ({
      ...item,
      _score: scoreSearchResultName(keyword, item.name)
    }))
    .filter(item => item._score > 0)
    .sort((a, b) => b._score - a._score)

  if (candidates.length === 0 || candidates[0]._score < 60) {
    return null
  }
  return candidates[0]
}

const mergeKnownUrl = (item, chapterUrls) => {
  const urlSet = new Set(item.knownChapterUrls || [])
  chapterUrls.forEach(url => urlSet.add(url))
  item.knownChapterUrls = [...urlSet]
}

const getFollowInfoByRequest = async(webRule, comicPageUrl) => {
  const responseText = await (0,comics/* requestTextWithGuard */.HN)({
    method: 'get',
    url: comicPageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule?.webName || '站点'} 漫画页`
  })
  return (0,comics/* getComicInfoFromHtml */.KK)(responseText, webRule, comicPageUrl)
}

const searchFollowCandidatesByKeyword = async(keyword, selectedWebNames = []) => {
  const currentKeyword = (0,utils/* trimSpecial */.Sc)(keyword || '')
  if (!currentKeyword) {
    return {
      candidates: [],
      skippedSites: []
    }
  }

  const searchResultList = await (0,comics/* searchComicsAcrossWebs */.Iw)(currentKeyword, selectedWebNames)
  const candidates = []
  const skippedSites = []

  for (let i = 0; i < searchResultList.length; i++) {
    const item = searchResultList[i]
    const bestResult = pickBestSearchResult(currentKeyword, item.findres || [])
    if (!bestResult?.url) {
      skippedSites.push({
        webName: item.webName,
        reason: item.error ? 'search-error' : 'no-match'
      })
      continue
    }

    try {
      const info = await getFollowInfoByRequest(item.webRule || (0,comics/* findWebByUrl */.jL)(bestResult.url), bestResult.url)
      const chapterList = dedupeChapters(info.chapters || [])
      if (chapterList.length === 0) {
        skippedSites.push({
          webName: item.webName,
          reason: 'no-chapters'
        })
        continue
      }
      candidates.push({
        key: `${item.webName}__${bestResult.url}`,
        comicName: info.comicName || bestResult.name || currentKeyword,
        authorName: info.authorName || '',
        webName: item.webName,
        comicPageUrl: bestResult.url,
        chapters: chapterList,
        seriesChapterCount: chapterList.length,
        latestChapterName: chapterList[0]?.chapterName || '',
        latestChapterUrl: chapterList[0]?.url || '',
        matchedName: bestResult.name || ''
      })
    } catch (error) {
      skippedSites.push({
        webName: item.webName,
        reason: 'fetch-error',
        error
      })
    }
  }

  return {
    candidates,
    skippedSites
  }
}

const addFollowCandidates = (candidateList = []) => {
  const addedItems = []
  candidateList.forEach((candidate) => {
    const followItem = upsertFollowItem({
      comicName: candidate.comicName,
      authorName: candidate.authorName,
      webName: candidate.webName,
      comicPageUrl: candidate.comicPageUrl,
      chapters: candidate.chapters || []
    })
    addedItems.push(followItem)
  })
  return addedItems
}

const addFollowItemsByKeyword = async(keyword, selectedWebNames = []) => {
  const result = await searchFollowCandidatesByKeyword(keyword, selectedWebNames)
  const matchedItems = addFollowCandidates(result.candidates)
  return {
    matchedItems,
    skippedSites: result.skippedSites
  }
}

const getFollowList = () => {
  return cloneData((0,setup/* getStorage */.cF)('followList') || [])
}

const saveFollowList = (followList) => {
  ;(0,setup/* setStorage */.po)('followList', followList)
  return true
}

const getFollowSettings = () => {
  return (0,setup/* getStorage */.cF)('followSettings') || {}
}

const getFollowCheckState = () => {
  return (0,setup/* getStorage */.cF)('followCheckState') || { lastCheckAt: 0, lastUpdateCount: 0 }
}

const setFollowCheckState = (state) => {
  ;(0,setup/* setStorage */.po)('followCheckState', state)
}

const canAutoCheckFollow = () => {
  const settings = getFollowSettings()
  if (settings.autoCheckOnLoad === false) {
    return false
  }
  const state = getFollowCheckState()
  const cooldownMinutes = parseInt(settings.checkCooldownMinutes || 30)
  return Date.now() - (state.lastCheckAt || 0) >= cooldownMinutes * 60 * 1000
}

const findFollowItem = (comicPageUrl, webName, comicName) => {
  const followList = getFollowList()
  return followList.find(item => {
    return (comicPageUrl && item.comicPageUrl === comicPageUrl) ||
      (item.webName === webName && item.comicName === comicName)
  }) || null
}

const buildFollowItem = ({ comicName, authorName, webName, comicPageUrl, chapters }) => {
  const latestChapter = chapters[0] || null
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    comicName,
    authorName: authorName || '',
    webName,
    comicPageUrl,
    knownChapterUrls: chapters.map(item => item.url),
    pendingChapters: [],
    latestChapterName: latestChapter?.chapterName || '',
    latestChapterUrl: latestChapter?.url || '',
    seriesChapterCount: chapters.length,
    lastCheckedAt: Date.now(),
    lastError: '',
    autoDownload: false
  }
}

const upsertFollowItem = (followPayload) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.comicPageUrl === followPayload.comicPageUrl)
  if (index === -1) {
        const followItem = buildFollowItem(followPayload)
    followList.unshift(followItem)
    saveFollowList(followList)
    return followItem
  }

  const currentItem = followList[index]
  currentItem.comicName = followPayload.comicName
  currentItem.authorName = followPayload.authorName || currentItem.authorName || ''
  currentItem.webName = followPayload.webName
  currentItem.seriesChapterCount = followPayload.chapters.length
  currentItem.latestChapterName = followPayload.chapters[0]?.chapterName || currentItem.latestChapterName
  currentItem.latestChapterUrl = followPayload.chapters[0]?.url || currentItem.latestChapterUrl
  currentItem.lastCheckedAt = Date.now()
  currentItem.lastError = ''
  followList.splice(index, 1, currentItem)
  saveFollowList(followList)
  return currentItem
}

const updateFollowItem = (followItemId, updater) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.id === followItemId)
  if (index === -1) {
    return null
  }
  const nextItem = updater(cloneData(followList[index]))
  followList.splice(index, 1, nextItem)
  saveFollowList(followList)
  return nextItem
}

const removeFollowItem = (followItemId) => {
  const followList = getFollowList().filter(item => item.id !== followItemId)
  saveFollowList(followList)
  return followList
}

const clearPendingChapters = (followItemId, chapterUrls = []) => {
  return updateFollowItem(followItemId, (item) => {
    const clearSet = new Set(chapterUrls)
    if (chapterUrls.length > 0) {
      mergeKnownUrl(item, chapterUrls)
      item.pendingChapters = (item.pendingChapters || []).filter(chapter => !clearSet.has(chapter.url))
    } else {
      mergeKnownUrl(item, (item.pendingChapters || []).map(chapter => chapter.url))
      item.pendingChapters = []
    }
    return item
  })
}

const syncFollowItem = async(followItem) => {
  const webRule = (0,comics/* findWebByUrl */.jL)(followItem.comicPageUrl)
  if (!webRule) {
    return {
      ...followItem,
      lastCheckedAt: Date.now(),
      lastError: '未找到站点规则'
    }
  }

  const info = await getFollowInfoByRequest(webRule, followItem.comicPageUrl)
  const chapterList = dedupeChapters(info.chapters || [])
  const knownUrlSet = new Set([...(followItem.knownChapterUrls || []), ...((followItem.pendingChapters || []).map(item => item.url))])
  const newChapters = chapterList.filter(item => !knownUrlSet.has(item.url))

  const nextItem = cloneData(followItem)
  nextItem.comicName = info.comicName || followItem.comicName
  nextItem.authorName = followItem.authorName || info.authorName || ''
  nextItem.latestChapterName = chapterList[0]?.chapterName || followItem.latestChapterName
  nextItem.latestChapterUrl = chapterList[0]?.url || followItem.latestChapterUrl
  nextItem.seriesChapterCount = chapterList.length
  nextItem.lastCheckedAt = Date.now()
  nextItem.lastError = ''
  nextItem.pendingChapters = dedupeChapters([...(followItem.pendingChapters || []), ...newChapters])
  return nextItem
}

const checkFollowItem = async(followItemId) => {
  const followList = getFollowList()
  const index = followList.findIndex(item => item.id === followItemId)
  if (index === -1) {
    return null
  }

  try {
    const nextItem = await syncFollowItem(followList[index])
    followList.splice(index, 1, nextItem)
    saveFollowList(followList)
    return nextItem
  } catch (error) {
    followList[index].lastCheckedAt = Date.now()
    followList[index].lastError = error.message || String(error)
    saveFollowList(followList)
    return followList[index]
  }
}

const checkAllFollowItems = async() => {
  const followList = getFollowList()
  const result = []

  for (let i = 0; i < followList.length; i++) {
    try {
      const nextItem = await syncFollowItem(followList[i])
      followList.splice(i, 1, nextItem)
      result.push(nextItem)
    } catch (error) {
      followList[i].lastCheckedAt = Date.now()
      followList[i].lastError = error.message || String(error)
      result.push(followList[i])
    }
  }
  saveFollowList(followList)
  const updateCount = followList.reduce((sum, item) => sum + ((item.pendingChapters || []).length > 0 ? 1 : 0), 0)
  setFollowCheckState({
    lastCheckAt: Date.now(),
    lastUpdateCount: updateCount
  })
  return followList
}

// EXTERNAL MODULE: external "vant"
var external_vant_ = __webpack_require__(8871);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









/* harmony default export */ const tablevue_type_script_lang_js_ = ({
  name: 'Table',
  data() {
    return {
      list: [],
      downResult: [],
      lastSelectIndex: null,
      onShfit: false,

      showSelectList: false,
      overlayShow: false,
      show: false,
      isEditList: false,

      currentComics: '',
      webname: '未匹配',
      comicName: '------',
      authorName: '',

      paylogoArr: [],
      downType: 0,
      imageSource: '',
      useCharacterNum: false,
      characterNumSequence: false,

      defineComicName: '',
      definechapterName: ''

    }
  },
  computed: {

  },
  mounted() {
    this.watchKeyEvent()
    this.getInfo()
  },
  methods: {
    titleStyle: function(url, isPay, type) {
      if (url === 'javascript:void();') {
        return { color: '#ccc' }
      }
      if (isPay === true) {
        return { color: 'red' }
      }
      if (type === 'many') {
        return { color: '#AA6680' }
      }
      return `color: blue`
    },
    showComicTitleName(numStr, name) {
      let showname = ''
      if (numStr !== '') {
        const newname = name === '' ? '' : ('-' + name)
        showname = numStr + newname
        return showname
      }
      return name
    },
    editList() {
      this.overlayShow = true
      this.isEditList = !this.isEditList
      this.overlayShow = false
    },
    // 删除章节一个字符
    delOnechapterNameFont(pos) {
      this.list.forEach((element, index) => {
        if (element.isSelect === true && element.chapterName.length >= 1) {
          if (pos === 1) {
            element.chapterName = element.chapterName.slice(1)
          } else {
            element.chapterName = element.chapterName.slice(0, -1)
          }
        }
      })
    },
    getInfo(times) {
      try {
        this.currentComics = comics/* currentComics */.Po
        if (comics/* currentComics */.Po === null) {
          return
        }
        this.webname = comics/* currentComics.webName */.Po.webName
        const { comicName, authorName } = (0,comics/* getCurrentComicMeta */.lb)(this.currentComics)
        const followItem = findFollowItem(window.location.href, this.currentComics.webName, comicName)

        this.comicName = comicName
        this.authorName = followItem?.authorName || authorName || ''
        if (this.comicName === '') {
          setTimeout(() => {
            this.getInfo(1)
          }, 1500)
          return
        }
        this.$bus.$emit('getComicName', this.comicName)
        //
        this.downType = (0,setup/* getStorage */.cF)('downType')
        this.syncDownloadSource()
      // eslint-disable-next-line no-empty
      } catch (error) {
        if (times === undefined) {
          setTimeout(() => {
            this.getInfo(1)
          }, 1500)
        }
        console.log('getInfo-e: ', error)
      }
      this.lastSelectIndex = null
      return
    },
    getDownloadSourceOptions() {
      if (!Array.isArray(this.currentComics?.downloadSourceOptions)) {
        return []
      }
      return this.currentComics.downloadSourceOptions
    },
    getSelectedImageSource() {
      const optionList = this.getDownloadSourceOptions()
      if (optionList.length === 0) {
        return ''
      }
      const defaultSource = this.currentComics?.defaultImageSource || optionList[0].value
      if (optionList.some(item => item.value === this.imageSource)) {
        return this.imageSource
      }
      return defaultSource
    },
    syncDownloadSource() {
      const nextSource = this.getSelectedImageSource()
      if (nextSource !== this.imageSource) {
        this.imageSource = nextSource
      }
    },
    decorateChapterList(list) {
      const followItem = findFollowItem(window.location.href, comics/* currentComics.webName */.Po.webName, this.comicName)
      const authorName = followItem?.authorName || this.authorName || ''
      const seriesChapterCount = list.length
      return list.map((item, index) => {
        return {
          webName: comics/* currentComics.webName */.Po.webName,
          authorName,
          comicPageUrl: window.location.href,
          seriesChapterCount,
          chapterIndex: item.chapterIndex || (index + 1),
          ...item,
          imageSource: item.imageSource || this.getSelectedImageSource()
        }
      })
    },
    reverseList() {
      this.overlayShow = true
      this.list = this.list.reverse()
      this.lastSelectIndex = null
      this.overlayShow = false
    },
    selectAll() {
      this.list.forEach((element, index) => {
        if (element.url !== 'javascript:void();') {
          element.isSelect = true
        }
      })
      this.lastSelectIndex = null
    },
    CancelSelect() {
      this.list.forEach((element, index) => {
        element.isSelect = false
      })
      this.lastSelectIndex = null
    },
    radioSelect(isSelect, index) {
      if (!isSelect) {
        this.lastSelectIndex = null
        return
      }
      let minIndex, maxIndex
      if (this.lastSelectIndex < index) {
        minIndex = this.lastSelectIndex
        maxIndex = index
      } else {
        minIndex = index
        maxIndex = this.lastSelectIndex
      }

      if (this.onShfit && this.lastSelectIndex !== null) {
        for (let i = minIndex; i < maxIndex; i++) {
          if (this.list[i].url !== 'javascript:void();') {
            this.list[i].isSelect = true
          }
        }
      }
      this.lastSelectIndex = index
    },
    watchKeyEvent() {
      const setKeyStatus = (keyCode, status) => {
        switch (keyCode) {
          case 16:
            if (this.onShfit === status) return
            this.onShfit = status
            break
        }
      }
      const dom = this.$refs.comiclist
      dom.onkeydown = (e) => {
        setKeyStatus(e.keyCode, true)
      }
      dom.onkeyup = (e) => {
        setKeyStatus(e.keyCode, false)
      }
    },
    /*
    async getSelectList() {
      this.overlayShow = true
      try {
        // 优先 getComicInfo 获取章节信息
        if (currentComics.getComicInfo) {
          const list = await currentComics.getComicInfo(this.comicName)
          if (list) {
            this.list = this.decorateChapterList(list)
            this.overlayShow = false
            this.showSelectList = true
            return
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100))
        // 单章数据
        const nodeList = document.querySelectorAll(currentComics.chapterCss)
        this.getChapterData(nodeList, currentComics, 'one')

        // （如果存在）分卷数据
        if (currentComics.chapterCss_2) {
          const nodeList_2 = document.querySelectorAll(currentComics.chapterCss_2)
          this.getChapterData(nodeList_2, currentComics, 'many')
        }

        this.list = this.decorateChapterList(this.list)

        this.overlayShow = false
        this.showSelectList = true
      } catch (error) {
        console.log('getSelectList-e: ', error)
        Toast({
          message: '网站未匹配或方法已失效',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.overlayShow = false
        }, 3000)
      }
    },
    // 获取章节数据
    getChapterData(nodeList, currentComics, type) {
      const hasSpend = currentComics.hasSpend
      const chapterNameReg = currentComics.chapterNameReg
      nodeList.forEach(dom => {
        const urls = dom.querySelectorAll('a')
        const readtype = currentComics.readtype

        urls.forEach((element, index) => {
          let chapterName = ''
          try {
            if (!chapterNameReg) {
              chapterName = element.innerText
            } else {
              chapterName = element.outerHTML.match(chapterNameReg)[1]
            }
            chapterName = trimSpecial(chapterName)
          } catch (error) {
            // console.log()
          }

          // 获取付费标志
          let currentIsPay = false
          if (hasSpend) {
            const payKey = currentComics.payKey
            const parent = element.parentElement
            if (parent.outerHTML.indexOf(payKey) > 0) {
              currentIsPay = true
            } else {
              currentIsPay = false
            }
          }

          const data = {
            comicName: trimSpecial(this.comicName),
            chapterNumStr: '',
            chapterName,
            downChapterName: '',
            url: element.href,
            characterType: type,
            readtype,
            isPay: currentIsPay,
            isSelect: false
          }

          if (data.chapterName !== '') {
            this.list.push(data)
          }
        })
      })
    },
    */
    async getSelectList() {
      this.overlayShow = true
      this.list = []
      this.syncDownloadSource()
      try {
        if (comics/* currentComics.getComicInfo */.Po.getComicInfo) {
          const list = await comics/* currentComics.getComicInfo */.Po.getComicInfo(this.comicName)
          if (list) {
            this.list = this.decorateChapterList(list)
            this.overlayShow = false
            this.showSelectList = true
            return
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100))

        const { comicName, authorName } = (0,comics/* getCurrentComicMeta */.lb)(comics/* currentComics */.Po)
        if (typeof comics/* currentComics.getChaptersFromRoot */.Po.getChaptersFromRoot === 'function') {
          const list = await comics/* currentComics.getChaptersFromRoot */.Po.getChaptersFromRoot(
            document,
            window.location.href,
            comicName || this.comicName,
            authorName || this.authorName
          )
          if (Array.isArray(list) && list.length > 0) {
            this.list = this.decorateChapterList(list)
            this.overlayShow = false
            this.showSelectList = true
            return
          }
        }

        const nodeList = document.querySelectorAll(comics/* currentComics.chapterCss */.Po.chapterCss)
        this.getChapterData(nodeList, comics/* currentComics */.Po, 'one')

        if (comics/* currentComics.chapterCss_2 */.Po.chapterCss_2) {
          const nodeList_2 = document.querySelectorAll(comics/* currentComics.chapterCss_2 */.Po.chapterCss_2)
          this.getChapterData(nodeList_2, comics/* currentComics */.Po, 'many')
        }

        this.list = this.decorateChapterList(this.list)
        this.overlayShow = false
        this.showSelectList = true
      } catch (error) {
        console.log('getSelectList-e: ', error)
        ;(0,external_vant_.Toast)({
          message: 'Site is not matched or method failed',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.overlayShow = false
        }, 3000)
      }
    },

    // 已进入原网站漫画章节页面阅读，获取章节 下载
    getChapterData(nodeList, currentComics, type) {
      const hasSpend = currentComics.hasSpend
      const chapterNameReg = currentComics.chapterNameReg
      nodeList.forEach(dom => {
        const urls = dom.querySelectorAll('a')
        const readtype = currentComics.readtype

        urls.forEach((element) => {
          let chapterName = ''
          try {
            if (!chapterNameReg) {
              chapterName = element.innerText
            } else {
              chapterName = element.outerHTML.match(chapterNameReg)[1]
            }
            chapterName = (0,utils/* trimSpecial */.Sc)(chapterName)
          } catch (error) {
            //
          }

          let currentIsPay = false
          if (hasSpend) {
            const payKey = currentComics.payKey
            const parent = element.parentElement
            if (parent.outerHTML.indexOf(payKey) > 0) {
              currentIsPay = true
            } else {
              currentIsPay = false
            }
          }

          const data = {
            comicName: (0,utils/* trimSpecial */.Sc)(this.comicName),
            chapterNumStr: '',
            chapterName,
            downChapterName: '',
            url: element.href,
            characterType: type,
            readtype,
            isPay: currentIsPay,
            isSelect: false
          }

          if (data.chapterName !== '') {
            this.list.push(data)
          }
        })
      })
    },
    startDownload(downloadItems) {
      const nextItems = downloadItems.map(item => ({
        originTab: 1,
        ...item
      }))
      if (nextItems.length === 1 && nextItems[0].downType === 1) {
        this.$bus.$emit('openCoverSelector', nextItems[0])
        this.$bus.$emit('changTab', 2)
        return
      }
      this.$bus.$emit('selectDown', nextItems)
      this.$bus.$emit('changTab', 3)
    },
    getCurrentWebData() {
      if (!comics/* currentComics */.Po) {
        (0,external_vant_.Toast)({
          message: '未在匹配网站',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.defineComicName === '' || this.definechapterName === '') {
        (0,external_vant_.Toast)({
          message: '请输入名称',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      this.syncDownloadSource()
      const currentDownloadUrl = typeof comics/* currentComics.normalizeDownloadUrl */.Po.normalizeDownloadUrl === 'function'
        ? comics/* currentComics.normalizeDownloadUrl */.Po.normalizeDownloadUrl(window.location.href)
        : window.location.href
      const item = {
        comicName: this.defineComicName,
        authorName: this.authorName,
        webName: comics/* currentComics.webName */.Po.webName,
        comicPageUrl: window.location.href,
        seriesChapterCount: 1,
        chapterIndex: 1,
        chapterNumStr: '',
        chapterName: this.definechapterName,
        downChapterName: this.definechapterName,
        url: currentDownloadUrl,
        characterType: 'one',
        readtype: comics/* currentComics.readtype */.Po.readtype,
        isPay: comics/* currentComics.hasSpend */.Po.hasSpend,
        downType: this.downType,
        imageSource: this.getSelectedImageSource(),
        downHeaders: comics/* currentComics.downHeaders */.Po.downHeaders
      }
      this.downResult.push(item)
      this.startDownload(this.downResult)
      this.downResult = []
      this.show = false
    },
    downSelectList() {
      let hasSelect = false
      this.syncDownloadSource()
      this.list.forEach((item, index) => {
        if (item.isSelect) {
          item.downType = this.downType
          item.imageSource = this.getSelectedImageSource()
          item.downHeaders = comics/* currentComics.downHeaders */.Po.downHeaders
          if (!hasSelect && item.isSelect) {
            hasSelect = true
          }

          if (item.chapterNumStr !== '' && item.chapterNumStr !== undefined) {
            const newName = item.chapterName === '' ? '' : ('-' + item.chapterName)
            item.downChapterName = item.chapterNumStr + newName
          } else {
            item.downChapterName = item.chapterName
          }

          // 下载的章节名可能修改为空，为空跳过
          if (item.downChapterName !== '') {
            this.downResult.push(item)
            item.isSelect = false
          }
        }
      })

      if (!hasSelect) {
        (0,external_vant_.Toast)({
          message: '请选择章节',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      this.startDownload(this.downResult)
      this.downResult = []
    },
    async addCurrentComicToFollow() {
      if (!comics/* currentComics */.Po || this.comicName === '------') {
        (0,external_vant_.Toast)({
          message: '请先进入漫画目录页',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      if (this.list.length === 0) {
        await this.getSelectList()
      }

      if (this.list.length === 0) {
        (0,external_vant_.Toast)({
          message: '当前页面未获取到章节列表',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      const followItem = upsertFollowItem({
        comicName: this.comicName,
        authorName: this.authorName,
        webName: comics/* currentComics.webName */.Po.webName,
        comicPageUrl: window.location.href,
        chapters: this.decorateChapterList(this.list).map(item => ({
          ...item,
          imageSource: item.imageSource || this.getSelectedImageSource()
        }))
      })
      this.authorName = followItem.authorName || this.authorName
      this.$bus.$emit('refreshFollowList')
      this.$bus.$emit('changTab', 4)
      ;(0,external_vant_.Toast)({
        message: '已加入追更',
        getContainer: '.card',
        position: 'bottom'
      })
    },
    reloadList() {
      this.list = []
      this.getInfo(1)
      this.getSelectList()
    },
    characterSequenceChange() {
      const bitNum = (0,setup/* getStorage */.cF)('imgIndexBitNum') || 3
      if (!this.useCharacterNum) {
        // 删除 前几个字符
        this.list.forEach((item, index) => {
          item.chapterNumStr = ''
        })
        return
      }

      if (this.characterNumSequence === true) {
        const len = this.list.length
        this.list.forEach((item, index) => {
          item.chapterNumStr = (0,utils/* addZeroForNum */.xo)(len - index, bitNum)
        })
      } else {
        this.list.forEach((item, index) => {
          item.chapterNumStr = (0,utils/* addZeroForNum */.xo)(index + 1, bitNum)
        })
      }
    }

  }
});

;// CONCATENATED MODULE: ./src/views/table.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_tablevue_type_script_lang_js_ = (tablevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=style&index=0&id=657d4b24&lang=less&scoped=true&
var tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_ = __webpack_require__(2614);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/table.vue?vue&type=style&index=0&id=657d4b24&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options = {};

tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default */.Z, tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_options);




       /* harmony default export */ const views_tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_ = (tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default */.Z && tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default.locals */.Z.locals ? tablevue_type_style_index_0_id_657d4b24_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/table.vue?vue&type=style&index=0&id=657d4b24&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/table.vue



;


/* normalize component */

var table_component = normalizeComponent(
  views_tablevue_type_script_lang_js_,
  tablevue_type_template_id_657d4b24_scoped_true_render,
  tablevue_type_template_id_657d4b24_scoped_true_staticRenderFns,
  false,
  null,
  "657d4b24",
  null
  
)

/* hot reload */
if (false) { var table_api; }
table_component.options.__file = "src/views/table.vue"
/* harmony default export */ const table = (table_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=template&id=5204468d&scoped=true&
var covervue_type_template_id_5204468d_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "cover-page" },
    [
      !_vm.pendingItem
        ? _c("van-empty", { attrs: { description: "暂无待设置封面的章节" } }, [
            _c("p", { staticClass: "cover-hint" }, [
              _vm._v("单章压缩下载时会自动跳转到这里。"),
            ]),
          ])
        : [
            _c(
              "van-cell-group",
              { attrs: { inset: "" } },
              [
                _c("van-cell", {
                  attrs: { title: "漫画", value: _vm.pendingItem.comicName },
                }),
                _vm._v(" "),
                _c("van-cell", {
                  attrs: {
                    title: "章节",
                    value:
                      _vm.pendingItem.downChapterName ||
                      _vm.pendingItem.chapterName,
                  },
                }),
                _vm._v(" "),
                _c("van-cell", {
                  attrs: { title: "输出", value: ".cbz + 同名封面图(按需)" },
                }),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "cover-card" },
              [
                _c("div", { staticClass: "cover-title" }, [_vm._v("封面来源")]),
                _vm._v(" "),
                _c(
                  "van-radio-group",
                  {
                    on: { change: _vm.handleModeChange },
                    model: {
                      value: _vm.coverMode,
                      callback: function ($$v) {
                        _vm.coverMode = $$v
                      },
                      expression: "coverMode",
                    },
                  },
                  [
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "first"
                          _vm.handleModeChange("first")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "first" } }, [
                                _vm._v("使用章节第一张"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "upload"
                          _vm.handleModeChange("upload")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "upload" } }, [
                                _vm._v("导入自定义封面"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "chapter"
                          _vm.handleModeChange("chapter")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "chapter" } }, [
                                _vm._v("从章节图片里选择"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { clickable: "" },
                      on: {
                        click: function ($event) {
                          _vm.coverMode = "bangumi"
                          _vm.handleModeChange("bangumi")
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("van-radio", { attrs: { name: "bangumi" } }, [
                                _vm._v("使用 Bangumi 封面"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
              ],
              1
            ),
            _vm._v(" "),
            _vm.coverMode === "first"
              ? _c(
                  "div",
                  { staticClass: "cover-card" },
                  [
                    _c("div", { staticClass: "cover-title" }, [
                      _vm._v("默认封面"),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "cover-desc" }, [
                      _vm._v(
                        "Komga 会直接使用章节第一页作为这本 CBZ 的默认封面。"
                      ),
                    ]),
                    _vm._v(" "),
                    _vm.chapterImageUrls[0]
                      ? _c("img", {
                          staticClass: "cover-preview",
                          attrs: {
                            src: _vm.chapterImageUrls[0],
                            alt: "default cover",
                          },
                        })
                      : _vm.chapterLoading
                      ? _c("van-loading", { attrs: { size: "24px" } }, [
                          _vm._v("加载章节图片中"),
                        ])
                      : _vm._e(),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.coverMode === "upload"
              ? _c("div", { staticClass: "cover-card" }, [
                  _c("div", { staticClass: "cover-title" }, [
                    _vm._v("自定义封面"),
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    ref: "coverUploadInput",
                    staticClass: "cover-file-input",
                    attrs: { type: "file", accept: "image/*" },
                    on: { change: _vm.handleUploadChange },
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "cover-actions" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: { size: "small", type: "primary" },
                          on: { click: _vm.triggerUpload },
                        },
                        [_vm._v("选择图片")]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.uploadedCoverDataUrl
                    ? _c("img", {
                        staticClass: "cover-preview",
                        attrs: {
                          src: _vm.uploadedCoverDataUrl,
                          alt: "uploaded cover",
                        },
                      })
                    : _vm._e(),
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.coverMode === "chapter"
              ? _c(
                  "div",
                  { staticClass: "cover-card" },
                  [
                    _c("div", { staticClass: "cover-title" }, [
                      _vm._v("章节图片"),
                    ]),
                    _vm._v(" "),
                    _vm.chapterLoading
                      ? _c("van-loading", { attrs: { size: "24px" } }, [
                          _vm._v("加载章节图片中"),
                        ])
                      : _vm.chapterImageUrls.length === 0
                      ? _c("div", { staticClass: "cover-desc" }, [
                          _vm._v("当前没有可选图片。"),
                        ])
                      : _c(
                          "div",
                          { staticClass: "chapter-grid" },
                          _vm._l(_vm.chapterImageUrls, function (url, index) {
                            return _c(
                              "button",
                              {
                                key: index + "_" + url,
                                staticClass: "chapter-thumb",
                                class: {
                                  "chapter-thumb--active":
                                    _vm.selectedChapterImageUrl === url,
                                },
                                attrs: { type: "button" },
                                on: {
                                  click: function ($event) {
                                    _vm.selectedChapterImageUrl = url
                                  },
                                },
                              },
                              [
                                _c("img", {
                                  attrs: {
                                    src: url,
                                    alt: "chapter-" + (index + 1),
                                  },
                                }),
                                _vm._v(" "),
                                _c("span", [_vm._v(_vm._s(index + 1))]),
                              ]
                            )
                          }),
                          0
                        ),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.coverMode === "bangumi"
              ? _c("div", { staticClass: "cover-card" }, [
                  _c("div", { staticClass: "cover-title" }, [
                    _vm._v("Bangumi 封面"),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "cover-actions" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: {
                            size: "small",
                            type: "primary",
                            loading: _vm.bangumiLoading,
                          },
                          on: { click: _vm.loadBangumiCover },
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(
                                _vm.bangumiCoverUrl ? "重新获取" : "获取封面"
                              ) +
                              "\n        "
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.bangumiCoverUrl
                    ? _c("img", {
                        staticClass: "cover-preview",
                        attrs: {
                          src: _vm.bangumiCoverUrl,
                          alt: "bangumi cover",
                        },
                      })
                    : !_vm.bangumiLoading
                    ? _c("div", { staticClass: "cover-desc" }, [
                        _vm._v("未获取到 Bangumi 封面。"),
                      ])
                    : _vm._e(),
                ])
              : _vm._e(),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "cover-bottom" },
              [
                _c(
                  "van-button",
                  { attrs: { round: "" }, on: { click: _vm.cancelSelection } },
                  [_vm._v("返回")]
                ),
                _vm._v(" "),
                _c(
                  "van-button",
                  {
                    attrs: {
                      round: "",
                      type: "primary",
                      loading: _vm.submitting,
                    },
                    on: { click: _vm.confirmSelection },
                  },
                  [_vm._v("开始下载")]
                ),
              ],
              1
            ),
          ],
    ],
    2
  )
}
var covervue_type_template_id_5204468d_scoped_true_staticRenderFns = []
covervue_type_template_id_5204468d_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/cover.vue?vue&type=template&id=5204468d&scoped=true&

;// CONCATENATED MODULE: ./src/utils/metadata.js



const invalidFileNameReg = /[\\/:*?"<>|]/g
const metadataListSplitReg = /[\n,，/、|]+/g

const defaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]'
const legacyDefaultZipNameTemplate = '[站点名字][作者名][漫画名称][章节名称][多少P]P'

const metadataSettingsDefault = {
  enableComicInfoXml: true,
  enableSeriesJson: false,
  enableSeriesCover: false,
  enableMetadataPreview: false,
  enableBangumiScrape: false,
  bangumiAccessToken: '',
  bangumiIncludeNsfw: false,
  languageISO: 'zh',
  publisher: ''
}

const escapeXml = (value) => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const cleanFileName = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .replace(invalidFileNameReg, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const toMetadataText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  return (0,utils/* trimSpecial */.Sc)(String(value)).trim()
}

const toMetadataList = (value) => {
  if (Array.isArray(value)) {
    return uniqList(value.map(item => toMetadataText(item)).filter(Boolean))
  }
  return uniqList(String(value || '')
    .split(metadataListSplitReg)
    .map(item => toMetadataText(item))
    .filter(Boolean))
}

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const match = String(value).match(/(\d+)/)
  return match ? parseInt(match[1]) : undefined
}

const normalizeMetadataDraft = (metadata = {}) => {
  return {
    seriesTitle: toMetadataText(metadata.seriesTitle || metadata.name || ''),
    originalTitle: toMetadataText(metadata.originalTitle || ''),
    summary: toMetadataText(metadata.summary || metadata.description_text || ''),
    writers: toMetadataList(metadata.writers || metadata.writer || metadata.authorName || ''),
    illustrators: toMetadataList(metadata.illustrators || metadata.penciller || ''),
    tags: toMetadataList(metadata.tags || metadata.genre || ''),
    publisher: toMetadataText(metadata.publisher || ''),
    issueCount: parseOptionalNumber(metadata.issueCount || metadata.total_issues),
    volumeCount: parseOptionalNumber(metadata.volumeCount),
    releaseDate: toMetadataText(metadata.releaseDate || metadata.date || ''),
    status: toMetadataText(metadata.status || ''),
    ageRating: toMetadataText(metadata.ageRating || metadata.age_rating || ''),
    languageISO: toMetadataText(metadata.languageISO || metadata.language || ''),
    subjectUrl: toMetadataText(metadata.subjectUrl || ''),
    source: toMetadataText(metadata.source || '')
  }
}

const normalizeStandaloneMetadataDraft = (metadata = {}) => {
  const baseDraft = normalizeMetadataDraft(metadata)
  return {
    ...baseDraft,
    entryTitle: toMetadataText(metadata.entryTitle || metadata.title || metadata.bookTitle || metadata.name || ''),
    entryNumber: toMetadataText(metadata.entryNumber || metadata.number || metadata.volume || ''),
    pageCount: parseOptionalNumber(metadata.pageCount || metadata.pages),
    isbn: toMetadataText(metadata.isbn || metadata.ISBN || '')
  }
}

const mergeMetadataSources = (...sources) => {
  const merged = normalizeMetadataDraft()
  sources.forEach((source) => {
    if (!source) {
      return
    }
    const current = normalizeMetadataDraft(source)
    if (current.seriesTitle) merged.seriesTitle = current.seriesTitle
    if (current.originalTitle) merged.originalTitle = current.originalTitle
    if (current.summary) merged.summary = current.summary
    if (current.publisher) merged.publisher = current.publisher
    if (current.issueCount !== undefined) merged.issueCount = current.issueCount
    if (current.volumeCount !== undefined) merged.volumeCount = current.volumeCount
    if (current.releaseDate) merged.releaseDate = current.releaseDate
    if (current.status) merged.status = current.status
    if (current.ageRating) merged.ageRating = current.ageRating
    if (current.languageISO) merged.languageISO = current.languageISO
    if (current.subjectUrl) merged.subjectUrl = current.subjectUrl
    if (current.source) merged.source = current.source
    merged.writers = uniqList([...merged.writers, ...current.writers])
    merged.illustrators = uniqList([...merged.illustrators, ...current.illustrators])
    merged.tags = uniqList([...merged.tags, ...current.tags])
  })
  return merged
}

const getTokenMap = (downloadItem, pageCount) => {
  return {
    '[站点名字]': cleanFileName(downloadItem.webName),
    '[作者名]': cleanFileName(downloadItem.authorName),
    '[漫画名称]': cleanFileName(downloadItem.comicName),
    '[章节名称]': cleanFileName(downloadItem.downChapterName || downloadItem.chapterName),
    '[章节序号]': cleanFileName(downloadItem.chapterNumStr),
    '[多少P]': String(pageCount || 0)
  }
}

const pushXmlTag = (arr, name, value) => {
  if (value === undefined || value === null || value === '') {
    return
  }
  arr.push(`  <${name}>${escapeXml(value)}</${name}>`)
}

const getChapterNumber = (downloadItem) => {
  if (downloadItem.chapterNumStr) {
    return downloadItem.chapterNumStr
  }
  const match = String(downloadItem.chapterName || '').match(/(\d+(\.\d+)?)/)
  return match ? match[1] : ''
}

const splitDateParts = (dateValue) => {
  if (!dateValue) {
    return {}
  }
  const match = String(dateValue).match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return {}
  }
  return {
    year: match[1],
    month: match[2] ? String(parseInt(match[2])) : '',
    day: match[3] ? String(parseInt(match[3])) : ''
  }
}

const getMetadataSettings = () => {
  return {
    ...metadataSettingsDefault,
    ...((0,setup/* getStorage */.cF)('metadataSettings') || {})
  }
}

const buildDefaultMetadataDraft = (downloadItem = {}) => {
  const settings = getMetadataSettings()
  return normalizeMetadataDraft({
    seriesTitle: downloadItem.comicName || '',
    originalTitle: downloadItem.comicName || '',
    writers: downloadItem.authorName ? [downloadItem.authorName] : [],
    issueCount: downloadItem.seriesChapterCount,
    languageISO: settings.languageISO || 'zh'
  })
}

const getResolvedMetadata = (downloadItem, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const metadata = mergeMetadataSources(
    buildDefaultMetadataDraft(downloadItem),
    externalMetadata
  )
  if (downloadItem?.metadataOverride) {
    const override = normalizeMetadataDraft(downloadItem.metadataOverride)
    metadata.seriesTitle = override.seriesTitle
    metadata.originalTitle = override.originalTitle
    metadata.summary = override.summary
    metadata.writers = override.writers
    metadata.illustrators = override.illustrators
    metadata.tags = override.tags
    metadata.publisher = override.publisher
    metadata.issueCount = override.issueCount
    metadata.volumeCount = override.volumeCount
    metadata.releaseDate = override.releaseDate
    metadata.status = override.status
    metadata.ageRating = override.ageRating
    metadata.languageISO = override.languageISO
    metadata.subjectUrl = override.subjectUrl || metadata.subjectUrl
    metadata.source = override.source || metadata.source
  }
  if (!metadata.seriesTitle) {
    metadata.seriesTitle = toMetadataText(downloadItem?.comicName || '')
  }
  if (!metadata.originalTitle) {
    metadata.originalTitle = metadata.seriesTitle
  }
  if (!metadata.issueCount && downloadItem?.seriesChapterCount) {
    metadata.issueCount = downloadItem.seriesChapterCount
  }
  if (!metadata.languageISO) {
    metadata.languageISO = settings.languageISO || 'zh'
  }
  return metadata
}

const buildNotes = (downloadItem, metadata) => {
  const notes = []
  if (downloadItem.webName) {
    notes.push(`来源站点: ${downloadItem.webName}`)
  }
  if (metadata?.originalTitle && metadata.originalTitle !== metadata.seriesTitle) {
    notes.push(`原始标题: ${metadata.originalTitle}`)
  }
  if (metadata?.subjectUrl) {
    notes.push(`Metadata: ${metadata.subjectUrl}`)
  }
  return notes.join('\n')
}

const getSeriesName = (downloadItem, metadata) => {
  return metadata?.seriesTitle || downloadItem.comicName
}

const getPublisher = (settings, metadata) => {
  return metadata?.publisher || settings.publisher || ''
}

const getIssueCount = (downloadItem, metadata) => {
  return metadata?.issueCount || metadata?.volumeCount || downloadItem.seriesChapterCount || undefined
}

const getWriter = (downloadItem, metadata) => {
  const writerList = uniqList(metadata?.writers || [])
  return writerList.join(', ')
}

const getPenciller = (metadata) => {
  return uniqList(metadata?.illustrators || []).join(', ')
}

const getGenre = (metadata) => {
  return uniqList(metadata?.tags || []).join(', ')
}

const buildComicInfoXmlContent = ({
  seriesName = '',
  title = '',
  number = '',
  count = undefined,
  summary = '',
  writer = '',
  penciller = '',
  genre = '',
  tags = '',
  pageCount = undefined,
  webUrl = '',
  publisher = '',
  languageISO = '',
  releaseDate = '',
  notes = ''
} = {}) => {
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<ComicInfo>']
  const dateParts = splitDateParts(releaseDate)

  pushXmlTag(lines, 'Series', seriesName)
  pushXmlTag(lines, 'Title', title)
  pushXmlTag(lines, 'Number', number)
  pushXmlTag(lines, 'Count', count)
  pushXmlTag(lines, 'Summary', summary)
  pushXmlTag(lines, 'Writer', writer)
  pushXmlTag(lines, 'Penciller', penciller)
  pushXmlTag(lines, 'Genre', genre)
  pushXmlTag(lines, 'Tags', tags)
  pushXmlTag(lines, 'PageCount', pageCount)
  pushXmlTag(lines, 'Web', webUrl)
  pushXmlTag(lines, 'Publisher', publisher)
  pushXmlTag(lines, 'LanguageISO', languageISO)
  pushXmlTag(lines, 'Year', dateParts.year)
  pushXmlTag(lines, 'Month', dateParts.month)
  pushXmlTag(lines, 'Day', dateParts.day)
  pushXmlTag(lines, 'Notes', notes)
  lines.push('</ComicInfo>')
  return lines.join('\n')
}

const buildStandaloneNotes = (metadata) => {
  const notes = []
  if (metadata?.source) {
    notes.push(`来源: ${metadata.source}`)
  }
  if (metadata?.originalTitle && metadata.originalTitle !== metadata.seriesTitle) {
    notes.push(`原标题: ${metadata.originalTitle}`)
  }
  if (metadata?.subjectUrl) {
    notes.push(`Metadata: ${metadata.subjectUrl}`)
  }
  if (metadata?.isbn) {
    notes.push(`ISBN: ${metadata.isbn}`)
  }
  return notes.join('\n')
}

const getZipNameTemplate = () => {
  const currentTemplate = (0,setup/* getStorage */.cF)('zipNameTemplate')
  if (!currentTemplate || currentTemplate === legacyDefaultZipNameTemplate) {
    return defaultZipNameTemplate
  }
  return currentTemplate
}

const buildArchiveName = (downloadItem, pageCount) => {
  let result = getZipNameTemplate()
  const tokenMap = getTokenMap(downloadItem, pageCount)
  Object.keys(tokenMap).forEach((key) => {
    result = result.replaceAll(key, tokenMap[key] || '')
  })
  result = cleanFileName(result).replace(/\[\]/g, '')
  return result || cleanFileName(downloadItem.downChapterName || downloadItem.chapterName || downloadItem.comicName || 'chapter')
}

const buildComicInfoXml = (downloadItem, pageCount, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const metadata = getResolvedMetadata(downloadItem, externalMetadata)
  return buildComicInfoXmlContent({
    seriesName: getSeriesName(downloadItem, metadata),
    title: downloadItem.downChapterName || downloadItem.chapterName,
    number: getChapterNumber(downloadItem),
    count: getIssueCount(downloadItem, metadata),
    summary: metadata?.summary || '',
    writer: getWriter(downloadItem, metadata),
    penciller: getPenciller(metadata),
    genre: getGenre(metadata),
    tags: getGenre(metadata),
    pageCount,
    webUrl: downloadItem.url || downloadItem.comicPageUrl,
    publisher: getPublisher(settings, metadata),
    languageISO: metadata?.languageISO || settings.languageISO || 'zh',
    releaseDate: metadata?.releaseDate || '',
    notes: buildNotes(downloadItem, metadata)
  })
}

const buildSeriesJson = (downloadItem, externalMetadata = null) => {
  const settings = getMetadataSettings()
  const metadata = getResolvedMetadata(downloadItem, externalMetadata)
  const dateParts = splitDateParts(metadata?.releaseDate)
  const seriesInfo = {
    name: getSeriesName(downloadItem, metadata) || '',
    publisher: getPublisher(settings, metadata),
    description_text: metadata?.summary || `${downloadItem.webName || ''}`.trim(),
    total_issues: getIssueCount(downloadItem, metadata),
    status: metadata?.status || undefined,
    age_rating: metadata?.ageRating || undefined,
    year: dateParts.year || undefined
  }
  return JSON.stringify(seriesInfo, null, 2)
}

const buildMetadataPreviewFiles = (downloadItem, pageCount = 0, externalMetadata = null) => {
  return {
    comicInfoXml: buildComicInfoXml(downloadItem, pageCount, externalMetadata),
    seriesJson: buildSeriesJson(downloadItem, externalMetadata)
  }
}

const buildStandaloneComicInfoXml = (metadata = {}) => {
  const settings = getMetadataSettings()
  const draft = normalizeStandaloneMetadataDraft(metadata)
  const seriesName = draft.seriesTitle || draft.entryTitle || ''
  const title = draft.entryTitle || draft.seriesTitle || ''
  const issueCount = draft.issueCount || draft.volumeCount || undefined

  return buildComicInfoXmlContent({
    seriesName,
    title,
    number: draft.entryNumber || '',
    count: issueCount,
    summary: draft.summary || '',
    writer: uniqList(draft.writers || []).join(', '),
    penciller: uniqList(draft.illustrators || []).join(', '),
    genre: uniqList(draft.tags || []).join(', '),
    tags: uniqList(draft.tags || []).join(', '),
    pageCount: draft.pageCount,
    webUrl: draft.subjectUrl || '',
    publisher: draft.publisher || settings.publisher || '',
    languageISO: draft.languageISO || settings.languageISO || 'zh',
    releaseDate: draft.releaseDate || '',
    notes: buildStandaloneNotes(draft)
  })
}

const buildStandaloneSeriesJson = (metadata = {}) => {
  const settings = getMetadataSettings()
  const draft = normalizeStandaloneMetadataDraft(metadata)
  const dateParts = splitDateParts(draft.releaseDate)
  const seriesInfo = {
    name: draft.seriesTitle || draft.entryTitle || '',
    publisher: draft.publisher || settings.publisher || '',
    description_text: draft.summary || '',
    total_issues: draft.issueCount || draft.volumeCount || undefined,
    status: draft.status || undefined,
    age_rating: draft.ageRating || undefined,
    year: dateParts.year || undefined
  }
  return JSON.stringify(seriesInfo, null, 2)
}

const buildStandaloneSeriesComicXml = (metadata = {}) => {
  const settings = getMetadataSettings()
  const draft = normalizeStandaloneMetadataDraft(metadata)
  const seriesName = draft.seriesTitle || draft.entryTitle || ''

  return buildComicInfoXmlContent({
    seriesName,
    title: seriesName,
    count: draft.issueCount || draft.volumeCount || undefined,
    summary: draft.summary || '',
    writer: uniqList(draft.writers || []).join(', '),
    penciller: uniqList(draft.illustrators || []).join(', '),
    genre: uniqList(draft.tags || []).join(', '),
    tags: uniqList(draft.tags || []).join(', '),
    webUrl: draft.subjectUrl || '',
    publisher: draft.publisher || settings.publisher || '',
    languageISO: draft.languageISO || settings.languageISO || 'zh',
    releaseDate: draft.releaseDate || '',
    notes: buildStandaloneNotes(draft)
  })
}

const buildStandaloneMetadataFiles = (mode, metadata = {}) => {
  switch (mode) {
    case 'bangumi-single':
    case 'bookwalker-book':
      return [{
        key: 'comicInfoXml',
        name: 'ComicInfo.xml',
        type: 'application/xml',
        content: buildStandaloneComicInfoXml(metadata)
      }]
    case 'bookwalker-series':
      return [
        {
          key: 'seriesJson',
          name: 'series.json',
          type: 'application/json',
          content: buildStandaloneSeriesJson(metadata)
        },
        {
          key: 'seriesComicXml',
          name: 'comic.xml',
          type: 'application/xml',
          content: buildStandaloneSeriesComicXml(metadata)
        }
      ]
    default:
      return []
  }
}

const getMetadataFileFlags = () => {
  const settings = getMetadataSettings()
  return {
    enableComicInfoXml: settings.enableComicInfoXml !== false,
    enableSeriesJson: settings.enableSeriesJson === true,
    enableSeriesCover: settings.enableSeriesCover === true,
    enableMetadataPreview: settings.enableMetadataPreview === true,
    enableBangumiScrape: settings.enableBangumiScrape === true
  }
}

const shouldPreviewMetadataForItems = (downloadItems = []) => {
  const { enableComicInfoXml, enableSeriesJson, enableMetadataPreview } = getMetadataFileFlags()
  if (!enableMetadataPreview || !Array.isArray(downloadItems) || downloadItems.length === 0) {
    return false
  }
  const hasUnconfirmedItem = downloadItems.some(item => item?.metadataConfirmed !== true)
  if (!hasUnconfirmedItem) {
    return false
  }
  if (enableSeriesJson) {
    return true
  }
  return enableComicInfoXml && downloadItems.some(item => item?.downType === 1)
}

;// CONCATENATED MODULE: ./src/utils/bangumi.js





const BANGUMI_SEARCH_API = 'https://api.bgm.tv/v0/search/subjects'
const BANGUMI_SUBJECT_API = 'https://api.bgm.tv/v0/subjects'
const BANGUMI_WEB_URL = 'https://bgm.tv/subject'
const CACHE_KEY = 'bangumiMetadataCache'
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000
const MAX_CANDIDATE_COUNT = 4
const pendingMetadataMap = new Map()

const normalizeText = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .replace(/[【】\[\]()（）「」『』《》〈〉]/g, ' ')
    .replace(/[·•:：]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const bangumi_normalizeCompareText = (value) => {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, '')
}

const normalizeKeyword = (value) => {
  return normalizeText(value)
    .replace(/(?:第?\s*\d+(?:\.\d+)?\s*(?:话|話|卷|章|冊|集)|单行本|單行本|漫画|漫畫|コミック|comics?)$/i, '')
    .trim()
}

const buildCacheKey = (downloadItem) => {
  return [
    bangumi_normalizeCompareText(downloadItem.comicName),
    bangumi_normalizeCompareText(downloadItem.authorName),
    bangumi_normalizeCompareText(downloadItem.webName)
  ].join('::')
}

const bangumi_cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

const getCacheMap = () => {
  return (0,setup/* getStorage */.cF)(CACHE_KEY) || {}
}

const getCachedMetadata = (cacheKey) => {
  const cacheMap = getCacheMap()
  const item = cacheMap[cacheKey]
  if (!item?.savedAt || !item.data) {
    return null
  }
  if (Date.now() - item.savedAt > CACHE_TTL) {
    return null
  }
  return bangumi_cloneData(item.data)
}

const saveCachedMetadata = (cacheKey, data) => {
  const cacheMap = getCacheMap()
  cacheMap[cacheKey] = {
    savedAt: Date.now(),
    data
  }
  ;(0,setup/* setStorage */.po)(CACHE_KEY, cacheMap)
  return data
}

const getBangumiHeaders = (settings) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': '10Comic Metadata Scraper'
  }
  if (settings.bangumiAccessToken) {
    headers.Authorization = `Bearer ${settings.bangumiAccessToken}`
  }
  return headers
}

const parseResponseJson = (response) => {
  const raw = response?.responseText || response?.response || ''
  if (!raw) {
    return null
  }
  if (typeof raw === 'object') {
    return raw
  }
  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

const toText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim()
  }
  if (Array.isArray(value)) {
    return value.map(item => toText(item)).filter(Boolean).join(' / ')
  }
  if (typeof value === 'object') {
    return toText(value.v || value.value || value.k || value.name || '')
  }
  return ''
}

const getInfoboxEntries = (subject) => {
  return Array.isArray(subject?.infobox) ? subject.infobox : []
}

const matchInfoboxKey = (key = '', words = []) => {
  return words.some(word => key.toLowerCase().includes(word.toLowerCase()))
}

const pickInfoboxTexts = (subject, keyWords = []) => {
  return getInfoboxEntries(subject)
    .filter(item => matchInfoboxKey(item?.key || '', keyWords))
    .map(item => toText(item?.value))
    .filter(Boolean)
}

const pickFirstInfoboxText = (subject, keyWords = []) => {
  return pickInfoboxTexts(subject, keyWords)[0] || ''
}

const buildAliasList = (subject) => {
  const aliases = []
  ;['别名', '中文名', '英文名', '日文名', '罗马字', 'romanji', 'alias'].forEach((keyWord) => {
    pickInfoboxTexts(subject, [keyWord]).forEach((item) => aliases.push(item))
  })
  if (subject?.name_cn) {
    aliases.push(subject.name_cn)
  }
  if (subject?.name) {
    aliases.push(subject.name)
  }
  return [...new Set(aliases.map(item => normalizeText(item)).filter(Boolean))]
}

const parseCount = (value) => {
  const match = String(value || '').match(/(\d+)/)
  return match ? parseInt(match[1]) : undefined
}

const splitPersonNames = (value) => {
  return String(value || '')
    .split(/[\/／&＆,，、]/)
    .map(item => normalizeText(item))
    .filter(Boolean)
}

const dedupeList = (list = []) => {
  return [...new Set((list || []).map(item => normalizeText(item)).filter(Boolean))]
}

const buildSearchKeywords = (downloadItem) => {
  const keywords = []
  const title = normalizeKeyword(downloadItem.comicName)
  const authorName = normalizeText(downloadItem.authorName)
  if (title) {
    keywords.push(title)
  }
  if (title && authorName) {
    keywords.push(`${title} ${authorName}`)
  }
  if (downloadItem.comicName && downloadItem.comicName !== title) {
    keywords.push(normalizeText(downloadItem.comicName))
  }
  return [...new Set(keywords.filter(Boolean))]
}

const searchBangumiSubjects = async(keyword, settings) => {
  const query = `${BANGUMI_SEARCH_API}?limit=10&offset=0`
  const payload = {
    keyword,
    sort: 'rank',
    filter: {
      type: [1],
      nsfw: settings.bangumiIncludeNsfw === true
    }
  }
  const response = await (0,utils/* request */.WY)({
    method: 'post',
    url: query,
    data: JSON.stringify(payload),
    headers: getBangumiHeaders(settings)
  })
  const result = parseResponseJson(response)
  if (!result) {
    return []
  }
  if (Array.isArray(result)) {
    return result
  }
  if (Array.isArray(result.data)) {
    return result.data
  }
  if (Array.isArray(result.list)) {
    return result.list
  }
  return []
}

const getBangumiSubject = async(subjectId, settings) => {
  const response = await (0,utils/* request */.WY)({
    method: 'get',
    url: `${BANGUMI_SUBJECT_API}/${subjectId}`,
    headers: getBangumiHeaders(settings)
  })
  return parseResponseJson(response)
}

const getBangumiSubjectPersons = async(subjectId, settings) => {
  try {
    const response = await (0,utils/* request */.WY)({
      method: 'get',
      url: `${BANGUMI_SUBJECT_API}/${subjectId}/persons`,
      headers: getBangumiHeaders(settings)
    })
    const result = parseResponseJson(response)
    if (Array.isArray(result)) {
      return result
    }
    if (Array.isArray(result?.data)) {
      return result.data
    }
  } catch (error) {
    //
  }
  return []
}

const getPlatformPenalty = (subject) => {
  const platform = normalizeText(subject?.platform || pickFirstInfoboxText(subject, ['平台', '类型', '類型']))
  if (!platform) {
    return 0
  }
  if (/(小说|小説|novel)/i.test(platform)) {
    return -80
  }
  if (/(漫画|漫畫|コミック|manga)/i.test(platform)) {
    return 30
  }
  return 0
}

const hasAuthorMatch = (subject, downloadItem) => {
  const authorName = bangumi_normalizeCompareText(downloadItem.authorName)
  if (!authorName) {
    return false
  }
  const authorFields = [
    ...pickInfoboxTexts(subject, ['作者', '作画', '作畫', '原作', '脚本', '脚本协力', '漫畫']),
    ...(subject._personNames || [])
  ]
  return authorFields.some(item => bangumi_normalizeCompareText(item).includes(authorName) || authorName.includes(bangumi_normalizeCompareText(item)))
}

const scoreBangumiSubject = (subject, downloadItem) => {
  const targetTitle = bangumi_normalizeCompareText(downloadItem.comicName)
  const compareTitles = dedupeList([subject?.name_cn, subject?.name, ...buildAliasList(subject)])
  let score = 0

  compareTitles.forEach((title) => {
    const value = bangumi_normalizeCompareText(title)
    if (!value) {
      return
    }
    if (value === targetTitle) {
      score += 140
      return
    }
    if (value.includes(targetTitle) || targetTitle.includes(value)) {
      score += 80
    }
  })

  if (hasAuthorMatch(subject, downloadItem)) {
    score += 70
  }

  score += getPlatformPenalty(subject)

  if (subject?.rating?.score) {
    score += Math.min(Math.round(subject.rating.score * 2), 20)
  }

  if (subject?.rank) {
    score += Math.max(0, 20 - Math.floor(subject.rank / 100))
  }

  if (subject?.date) {
    score += 5
  }

  return score
}

const enrichWithPersons = async(subject, settings) => {
  const persons = await getBangumiSubjectPersons(subject.id, settings)
  const writerList = []
  const illustratorList = []
  const personNames = []

  persons.forEach((person) => {
    const name = normalizeText(person?.name_cn || person?.name || '')
    const relation = normalizeText(person?.relation || person?.type || '')
    if (!name) {
      return
    }
    personNames.push(name)
    if (/(作者|原作|脚本|编剧|編劇)/i.test(relation)) {
      writerList.push(name)
    }
    if (/(作画|作畫|绘师|繪師|插画|插畫)/i.test(relation)) {
      illustratorList.push(name)
    }
  })

  return {
    ...subject,
    _personNames: personNames,
    _personWriters: dedupeList(writerList),
    _personIllustrators: dedupeList(illustratorList)
  }
}

const buildStatus = (subject) => {
  const statusText = pickFirstInfoboxText(subject, ['连载状态', '連載狀態', '状态', '狀態'])
  if (/(完结|完結|已完|finished|completed)/i.test(statusText)) {
    return 'ended'
  }
  if (/(连载|連載|ongoing|连载中|連載中)/i.test(statusText)) {
    return 'ongoing'
  }
  if (pickFirstInfoboxText(subject, ['结束', '完结', '完結'])) {
    return 'ended'
  }
  return undefined
}

const normalizeScrapedMetadata = (subject) => {
  const writers = dedupeList([
    ...splitPersonNames(pickFirstInfoboxText(subject, ['作者', '原作', '脚本', '编剧', '編劇'])),
    ...(subject?._personWriters || [])
  ])
  const illustrators = dedupeList([
    ...splitPersonNames(pickFirstInfoboxText(subject, ['作画', '作畫', '绘师', '繪師', '插画', '插畫'])),
    ...(subject?._personIllustrators || [])
  ])
  const tags = dedupeList((subject?.tags || []).slice(0, 8).map(item => item?.name || item))
  const publisher = pickFirstInfoboxText(subject, ['出版社', '连载杂志', '連載雜誌', 'レーベル', 'label'])
  const issueCount = parseCount(pickFirstInfoboxText(subject, ['话数', '話數', '章节数', '章數', '总话数', '總話數']))
  const volumeCount = parseCount(pickFirstInfoboxText(subject, ['册数', '冊數', '卷数', '卷數', '单行本', '單行本']))
  const subjectUrl = `${BANGUMI_WEB_URL}/${subject.id}`
  const seriesTitle = normalizeText(subject?.name_cn || subject?.name)

  return {
    source: 'Bangumi',
    subjectId: subject.id,
    subjectUrl,
    seriesTitle,
    originalTitle: normalizeText(subject?.name),
    aliases: buildAliasList(subject),
    summary: (0,utils/* trimSpecial */.Sc)(subject?.summary || ''),
    publisher,
    writers,
    illustrators,
    tags,
    issueCount,
    volumeCount,
    releaseDate: subject?.date || '',
    status: buildStatus(subject),
    coverUrl: subject?.images?.large || subject?.images?.common || subject?.images?.medium || subject?.images?.small || '',
    languageISO: '',
    confidence: subject?._matchScore || 0
  }
}

const pickBestSubject = async(searchResults, downloadItem, settings) => {
  const detailCandidates = await Promise.all(
    searchResults
      .slice(0, MAX_CANDIDATE_COUNT)
      .map(async(item) => {
        const subject = await getBangumiSubject(item.id, settings)
        if (!subject) {
          return null
        }
        const enrichedSubject = await enrichWithPersons(subject, settings)
        enrichedSubject._matchScore = scoreBangumiSubject(enrichedSubject, downloadItem)
        return enrichedSubject
      })
  )

  const validCandidates = detailCandidates.filter(Boolean).sort((a, b) => b._matchScore - a._matchScore)
  if (validCandidates.length === 0) {
    return null
  }
  if (validCandidates[0]._matchScore < 60) {
    return null
  }
  return validCandidates[0]
}

const fetchBangumiMetadata = async(downloadItem, settings) => {
  const keywords = buildSearchKeywords(downloadItem)
  for (let i = 0; i < keywords.length; i++) {
    const searchResults = await searchBangumiSubjects(keywords[i], settings)
    if (searchResults.length === 0) {
      continue
    }
    const bestSubject = await pickBestSubject(searchResults, downloadItem, settings)
    if (bestSubject) {
      return normalizeScrapedMetadata(bestSubject)
    }
  }
  return null
}

const getBangumiMetadata = async(downloadItem, options = {}) => {
  const settings = getMetadataSettings()
  if (settings.enableBangumiScrape !== true && options.force !== true) {
    return null
  }

  const cacheKey = buildCacheKey(downloadItem)
  const cachedData = getCachedMetadata(cacheKey)
  if (cachedData) {
    return cachedData
  }

  if (pendingMetadataMap.has(cacheKey)) {
    return pendingMetadataMap.get(cacheKey)
  }

  const promise = fetchBangumiMetadata(downloadItem, settings)
    .then((data) => {
      if (!data) {
        return null
      }
      return saveCachedMetadata(cacheKey, data)
    })
    .finally(() => {
      pendingMetadataMap.delete(cacheKey)
    })

  pendingMetadataMap.set(cacheKey, promise)
  return promise
}

;// CONCATENATED MODULE: ./src/utils/chapterImages.js



const applyImageRange = (imgList) => {
  const imgDownRange = (0,setup/* getStorage */.cF)('imgDownRange') || [1, -1]
  const start = Math.max(parseInt(imgDownRange[0] || 1), 1)
  const end = parseInt(imgDownRange[1] || -1)
  if (end === -1) {
    return imgList.slice(start - 1)
  }
  return imgList.slice(start - 1, end + 1)
}

const getChapterImageUrls = async(downloadItem) => {
  if (!downloadItem) {
    return []
  }

  if (downloadItem.readtype === 1) {
    const imgs = await (0,utils/* getImage */.gJ)({
      url: downloadItem.url,
      isPay: downloadItem.isPay,
      imageSource: downloadItem.imageSource
    })
    return applyImageRange(Array.isArray(imgs) ? imgs : [])
  }

  const imageUrls = []
  const visitedPageUrls = new Set()
  const processData = {
    url: downloadItem.url,
    imgIndex: 0,
    totalNumber: 0,
    isPay: downloadItem.isPay,
    imageSource: downloadItem.imageSource,
    otherData: undefined
  }

  while (processData.url && !visitedPageUrls.has(processData.url)) {
    visitedPageUrls.add(processData.url)
    const result = await (0,utils/* getImage */.gJ)(processData)
    const currentList = Array.isArray(result?.imgUrlArr) ? result.imgUrlArr : []
    imageUrls.push(...currentList)
    processData.otherData = result?.otherData
    processData.totalNumber = parseInt(result?.imgCount || imageUrls.length || 0)

    if (!result?.nextPageUrl || (processData.totalNumber > 0 && imageUrls.length >= processData.totalNumber)) {
      break
    }

    processData.imgIndex = imageUrls.length
    processData.url = result.nextPageUrl
  }

  return applyImageRange(imageUrls)
}

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






const covervue_type_script_lang_js_cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

/* harmony default export */ const covervue_type_script_lang_js_ = ({
  name: 'Cover',
  data() {
    return {
      pendingItem: null,
      coverMode: 'first',
      chapterImageUrls: [],
      selectedChapterImageUrl: '',
      chapterLoading: false,
      bangumiLoading: false,
      bangumiCoverUrl: '',
      uploadedCoverDataUrl: '',
      uploadedCoverMimeType: 'image/jpeg',
      submitting: false
    }
  },
  mounted() {
    this.$bus.$on('openCoverSelector', this.openCoverSelector)
  },
  methods: {
    resetCoverState() {
      this.coverMode = 'first'
      this.chapterImageUrls = []
      this.selectedChapterImageUrl = ''
      this.chapterLoading = false
      this.bangumiLoading = false
      this.bangumiCoverUrl = ''
      this.uploadedCoverDataUrl = ''
      this.uploadedCoverMimeType = 'image/jpeg'
      this.submitting = false
      if (this.$refs.coverUploadInput) {
        this.$refs.coverUploadInput.value = ''
      }
    },
    async openCoverSelector(item) {
      this.pendingItem = covervue_type_script_lang_js_cloneData(item)
      this.resetCoverState()
      await this.loadChapterImages()
    },
    async loadChapterImages() {
      if (!this.pendingItem || this.chapterLoading || this.chapterImageUrls.length > 0) {
        return
      }
      this.chapterLoading = true
      try {
        const imageUrls = await getChapterImageUrls(this.pendingItem)
        this.chapterImageUrls = imageUrls
        this.selectedChapterImageUrl = imageUrls[0] || ''
      } catch (error) {
        (0,external_vant_.Toast)({
          message: '章节图片加载失败',
          getContainer: '.card',
          position: 'bottom'
        })
      } finally {
        this.chapterLoading = false
      }
    },
    async loadBangumiCover() {
      if (!this.pendingItem || this.bangumiLoading) {
        return
      }
      this.bangumiLoading = true
      try {
        const metadata = await getBangumiMetadata(this.pendingItem, { force: true })
        this.bangumiCoverUrl = metadata?.coverUrl || ''
        if (!this.bangumiCoverUrl) {
          (0,external_vant_.Toast)({
            message: '未匹配到 Bangumi 封面',
            getContainer: '.card',
            position: 'bottom'
          })
        }
      } finally {
        this.bangumiLoading = false
      }
    },
    handleModeChange(mode) {
      if (mode === 'chapter' || mode === 'first') {
        this.loadChapterImages()
      }
      if (mode === 'bangumi' && !this.bangumiCoverUrl) {
        this.loadBangumiCover()
      }
    },
    triggerUpload() {
      this.$refs.coverUploadInput?.click()
    },
    handleUploadChange(event) {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.uploadedCoverDataUrl = reader.result
        this.uploadedCoverMimeType = file.type || 'image/jpeg'
        this.coverMode = 'upload'
      }
      reader.readAsDataURL(file)
    },
    cancelSelection() {
      this.$bus.$emit('changTab', 1)
    },
    async confirmSelection() {
      if (!this.pendingItem) {
        return
      }
      if (this.coverMode === 'upload' && !this.uploadedCoverDataUrl) {
        (0,external_vant_.Toast)({
          message: '请先导入封面',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.coverMode === 'chapter' && !this.selectedChapterImageUrl) {
        (0,external_vant_.Toast)({
          message: '请选择章节图片',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.coverMode === 'bangumi' && !this.bangumiCoverUrl) {
        await this.loadBangumiCover()
        if (!this.bangumiCoverUrl) {
          return
        }
      }

      this.submitting = true
      const nextItem = {
        ...covervue_type_script_lang_js_cloneData(this.pendingItem),
        originTab: 2,
        coverOption: this.buildCoverOption()
      }
      this.$bus.$emit('selectDown', [nextItem])
      this.$bus.$emit('changTab', 3)
      this.submitting = false
    },
    buildCoverOption() {
      switch (this.coverMode) {
        case 'upload':
          return {
            type: 'upload',
            dataUrl: this.uploadedCoverDataUrl,
            mimeType: this.uploadedCoverMimeType
          }
        case 'chapter':
          return {
            type: 'chapter',
            imageUrl: this.selectedChapterImageUrl
          }
        case 'bangumi':
          return {
            type: 'bangumi',
            imageUrl: this.bangumiCoverUrl
          }
        default:
          return {
            type: 'first'
          }
      }
    }
  }
});

;// CONCATENATED MODULE: ./src/views/cover.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_covervue_type_script_lang_js_ = (covervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=style&index=0&id=5204468d&lang=less&scoped=true&
var covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_ = __webpack_require__(2139);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/cover.vue?vue&type=style&index=0&id=5204468d&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options = {};

covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default */.Z, covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_options);




       /* harmony default export */ const views_covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_ = (covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default */.Z && covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default.locals */.Z.locals ? covervue_type_style_index_0_id_5204468d_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/cover.vue?vue&type=style&index=0&id=5204468d&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/cover.vue



;


/* normalize component */

var cover_component = normalizeComponent(
  views_covervue_type_script_lang_js_,
  covervue_type_template_id_5204468d_scoped_true_render,
  covervue_type_template_id_5204468d_scoped_true_staticRenderFns,
  false,
  null,
  "5204468d",
  null
  
)

/* hot reload */
if (false) { var cover_api; }
cover_component.options.__file = "src/views/cover.vue"
/* harmony default export */ const cover = (cover_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=template&id=1e855a88&scoped=true&
var downvue_type_template_id_1e855a88_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "downcontext" } },
    [
      _c(
        "van-collapse",
        {
          model: {
            value: _vm.collapseActiveName,
            callback: function ($$v) {
              _vm.collapseActiveName = $$v
            },
            expression: "collapseActiveName",
          },
        },
        [
          _c(
            "van-collapse-item",
            {
              attrs: { title: "下载中", name: "1" },
              scopedSlots: _vm._u([
                {
                  key: "title",
                  fn: function () {
                    return [
                      _c(
                        "div",
                        { style: { display: "flex", lineHeight: "25px" } },
                        [
                          _vm._v("下载中\n          "),
                          _vm.comicName
                            ? _c("van-tag", { staticClass: "comicnametag1" }, [
                                _vm._v(_vm._s(_vm.comicName)),
                              ])
                            : _vm._e(),
                        ],
                        1
                      ),
                    ]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "downlist" } },
                _vm._l(_vm.queue.worker, function (item, index) {
                  return _c("div", { key: index, staticClass: "downitem" }, [
                    item !== undefined
                      ? _c(
                          "div",
                          [
                            _c("div", { staticClass: "itemname" }, [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v(_vm._s(item.downChapterName)),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("van-progress", {
                              ref: "progress",
                              refInFor: true,
                              staticStyle: {
                                width: "100%",
                                "margin-top": "10px",
                              },
                              attrs: {
                                percentage: item.progress,
                                "pivot-color": "#66ccff",
                                color:
                                  "linear-gradient(to right, #66ccff22, ##66ccff)",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-divider", {
                              style: {
                                margin: "13px 0px",
                                padding: "0 0px",
                                height: "1px",
                              },
                            }),
                          ],
                          1
                        )
                      : _vm._e(),
                  ])
                }),
                0
              ),
            ]
          ),
          _vm._v(" "),
          _c("van-collapse-item", { attrs: { title: "待下载", name: "2" } }, [
            _c(
              "div",
              { attrs: { id: "downlist" } },
              _vm._l(_vm.queue.list, function (item, index) {
                return _c(
                  "div",
                  { key: index, staticClass: "downitem" },
                  [
                    _c("div", { staticClass: "itemname" }, [
                      _c("span", { staticClass: "custom-title" }, [
                        _vm._v(_vm._s(item.downChapterName)),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("van-divider", {
                      style: {
                        margin: "8px 0px",
                        padding: "0 0px",
                        height: "1px",
                      },
                    }),
                  ],
                  1
                )
              }),
              0
            ),
          ]),
          _vm._v(" "),
          _c(
            "van-collapse-item",
            {
              attrs: { name: "3" },
              scopedSlots: _vm._u([
                {
                  key: "title",
                  fn: function () {
                    return [
                      _c(
                        "div",
                        { style: { display: "flex" } },
                        [
                          _c(
                            "span",
                            { attrs: { title: _vm.currentDomain } },
                            [
                              _vm._v("\n            下载记录\n            "),
                              _c("van-icon", {
                                attrs: { name: "info-o", color: "#adadad" },
                              }),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("van-icon", {
                            staticStyle: {
                              "line-height": "25px",
                              "margin-left": "10px",
                            },
                            attrs: {
                              name: "delete-o",
                              color: "#EE0000",
                              size: "20",
                            },
                            on: {
                              click: function ($event) {
                                $event.stopPropagation()
                                return _vm.deleteAllHistoryData.apply(
                                  null,
                                  arguments
                                )
                              },
                            },
                          }),
                        ],
                        1
                      ),
                    ]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c(
                "div",
                { attrs: { id: "downlist" } },
                _vm._l(_vm.historyData, function (item, index) {
                  return _c(
                    "div",
                    { key: index, staticClass: "downitem" },
                    [
                      _c(
                        "div",
                        { staticClass: "itemname" },
                        [
                          _c(
                            "div",
                            { staticStyle: { display: "flex" } },
                            [
                              _c(
                                "van-tag",
                                {
                                  staticClass: "comicnametag",
                                  attrs: { title: item.comicName },
                                  on: {
                                    click: function ($event) {
                                      return _vm.jump(item.comicPageUrl)
                                    },
                                  },
                                },
                                [_vm._v(_vm._s(item.comicName))]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass: "custom-title chapterspan",
                                  class: { hasError: item.hasError },
                                },
                                [_vm._v(_vm._s(item.downChapterName))]
                              ),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("van-icon", {
                            style: { cursor: "pointer" },
                            attrs: { name: "delete-o", size: "18px" },
                            on: {
                              click: function ($event) {
                                return _vm.deleteHistoryData(index, item.id)
                              },
                            },
                          }),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("van-divider", {
                        style: {
                          margin: "8px 0px",
                          padding: "0 0px",
                          height: "1px",
                        },
                      }),
                    ],
                    1
                  )
                }),
                0
              ),
            ]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var downvue_type_template_id_1e855a88_scoped_true_staticRenderFns = []
downvue_type_template_id_1e855a88_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/down.vue?vue&type=template&id=1e855a88&scoped=true&

;// CONCATENATED MODULE: external "JSZip"
const external_JSZip_namespaceObject = JSZip;
var external_JSZip_default = /*#__PURE__*/__webpack_require__.n(external_JSZip_namespaceObject);
;// CONCATENATED MODULE: ./src/utils/queue.js







const challengeResponseReg = /challenge-platform|cf-browser-verification|cf-chl-|cf-turnstile|cf-challenge|cf-wrapper|verify you are human|attention required|checking if the site connection is secure|security check to access|just a moment\.\.\.|why do i have to complete a captcha/i

// 多个任务并行执行的队列
// https://juejin.cn/post/6844903961728647181

class Queue {
  constructor(workerLen, maxPictureNum, imgIndexBitNum, vue) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.pictureNum = maxPictureNum || 2 // 章节最大下载图片数量
    this.list = [] // 任务队列
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerDownInfo = new Array(this.workerLen) // 存储下载信息
    this.imgIndexBitNum = imgIndexBitNum // 图片序号位数
    this.seriesJsonCache = new Set()
    this.seriesCoverCache = new Set()
    this.Vue = vue
  }

  // 压缩下载方式
  async downloadFile(fileName, content) {
    const url = window.URL.createObjectURL(content)
    let result = await (0,utils/* downFile */.zd)(url, fileName)
    if (!result) {
      result = await this.downloadFileByAnchor(url, fileName)
    }
    window.URL.revokeObjectURL(url)
    return result
  }

  async downloadRemoteFile(fileName, url) {
    if (!url) {
      return false
    }
    return (0,utils/* downFile */.zd)({ url, name: fileName })
  }

  async downloadFileByAnchor(url, fileName) {
    if (!url || !fileName) {
      return false
    }
    try {
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName.split('\\').pop() || fileName
      anchor.rel = 'noopener'
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      return true
    } catch (error) {
      console.log('downloadFileByAnchorError: ', error)
      return false
    }
  }

  getCoverFileName(url) {
    const match = String(url || '').match(/\.(jpg|jpeg|webp|png|gif|bmp)(?:$|[?#])/i)
    const suffix = match ? match[1].toLowerCase() : 'jpg'
    return `cover.${suffix === 'jpeg' ? 'jpg' : suffix}`
  }

  normalizeImageExtension(suffix) {
    if (!suffix) {
      return 'jpg'
    }
    return suffix.toLowerCase() === 'jpeg' ? 'jpg' : suffix.toLowerCase()
  }

  getCoverExtensionByMimeType(mimeType) {
    if (!mimeType) {
      return 'jpg'
    }
    if (mimeType.includes('png')) return 'png'
    if (mimeType.includes('webp')) return 'webp'
    if (mimeType.includes('gif')) return 'gif'
    if (mimeType.includes('bmp')) return 'bmp'
    return 'jpg'
  }

  dataUrlToBlob(dataUrl) {
    const group = String(dataUrl || '').split(',')
    if (group.length < 2) {
      return null
    }
    const mimeType = (group[0].match(/data:(.*?);base64/) || [])[1] || 'image/jpeg'
    const binary = atob(group[1])
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return {
      blob: new Blob([bytes], { type: mimeType }),
      extension: this.getCoverExtensionByMimeType(mimeType)
    }
  }

  buildImageHeaders(workerId, headers) {
    const defaultHeaders = {
      referer: this.worker[workerId].url
    }
    if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
      return defaultHeaders
    }
    const nextHeaders = {
      ...defaultHeaders,
      ...headers
    }
    if (!nextHeaders.referer) {
      nextHeaders.referer = defaultHeaders.referer
    }
    return nextHeaders
  }

  updateProgress(workerId, isSuccess = false) {
    if (isSuccess) {
      this.worker[workerId].successNum = this.worker[workerId].successNum + 1
    }
    this.worker[workerId].progress = parseInt(this.worker[workerId].imgIndex / this.worker[workerId].totalNumber * 100)
    this.refresh()
  }

  getResponseHeaderValue(responseHeaders = '', headerName = '') {
    const reg = new RegExp(`^${String(headerName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'im')
    return String(responseHeaders || '').match(reg)?.[1]?.trim() || ''
  }

  async blobToText(blob) {
    if (!blob) {
      return ''
    }
    if (typeof blob.text === 'function') {
      try {
        return await blob.text()
      } catch (error) {
        return ''
      }
    }
    return new Promise((resolve) => {
      try {
        const reader = new FileReader()
        reader.onload = function() {
          resolve(String(reader.result || ''))
        }
        reader.onerror = function() {
          resolve('')
        }
        reader.readAsText(blob)
      } catch (error) {
        resolve('')
      }
    })
  }

  openVerifyPageOnce(workerId, url) {
    if (!this.worker[workerId] || this.worker[workerId].verifyPromptShown) {
      return
    }
    this.worker[workerId].verifyPromptShown = true
    ;(0,utils/* openVerifyPage */.XB)(url || this.worker[workerId].url)
  }

  createChallengeError() {
    return new Error('检测到 Cloudflare 验证，已打开验证页面，请手动通过后重试下载')
  }

  async waitForManualVerification() {
    return new Promise((resolve) => {
      setTimeout(resolve, 12 * 1000)
    })
  }

  async isChallengeResponse(workerId, requestUrl, response) {
    if (!response || response === 'onerror' || response === 'timeout' || !response.response) {
      return false
    }

    const finalUrl = String(response.finalUrl || requestUrl || '')
    const responseHeaders = String(response.responseHeaders || '')
    const contentType = (this.getResponseHeaderValue(responseHeaders, 'content-type') || response.response?.type || '').toLowerCase()
    const maybeChallengeUrl = challengeResponseReg.test(finalUrl) || /\/cdn-cgi\//i.test(finalUrl)
    const shouldReadText = maybeChallengeUrl || !contentType.includes('image/')

    if (!shouldReadText) {
      return false
    }

    let responseText = ''
    if (typeof response.responseText === 'string' && response.responseText) {
      responseText = response.responseText
    } else if (typeof response.response === 'string') {
      responseText = response.response
    } else if (response.response instanceof Blob) {
      responseText = await this.blobToText(response.response)
    }

    if (!maybeChallengeUrl && !challengeResponseReg.test(String(responseText || ''))) {
      return false
    }

    this.openVerifyPageOnce(workerId, requestUrl)
    return true
  }

  async handleChallengeAndRetry(task, workerId, retryCount = 0) {
    if (retryCount >= 1) {
      this.worker[workerId].hasError = true
      throw this.createChallengeError()
    }
    await this.waitForManualVerification()
    return task(retryCount + 1)
  }

  async fetchImageBlob(workerId, url) {
    if (!url) {
      return null
    }
    const headers = this.buildImageHeaders(workerId, this.worker[workerId].downHeaders)
    const response = await (0,utils/* request */.WY)({
      method: 'get',
      url,
      responseType: 'blob',
      headers,
      timeout: 60 * 1000
    })
    if (!response || response === 'onerror' || response === 'timeout' || !response.response) {
      return null
    }
    if (await this.isChallengeResponse(workerId, url, response)) {
      return null
    }
    return {
      blob: response.response,
      suffix: this.getSuffix(response.finalUrl || url)
    }
  }

  async writeBookCoverFile(workerId, archiveBasePath) {
    const coverOption = this.worker[workerId].coverOption
    if (!coverOption || coverOption.type === 'first') {
      return
    }

    if (coverOption.type === 'upload' && coverOption.dataUrl) {
      const result = this.dataUrlToBlob(coverOption.dataUrl)
      if (result?.blob) {
        await this.downloadFile(`${archiveBasePath}.${result.extension}`, result.blob)
      }
      return
    }

    if (coverOption.type === 'chapter' && coverOption.imageUrl) {
      let coverData = this.workerDownInfo[workerId].find(item => item.imgurl === coverOption.imageUrl && item.blob !== 1 && item.blob !== 0)
      if (!coverData) {
        coverData = await this.fetchImageBlob(workerId, coverOption.imageUrl)
      }
      if (coverData?.blob) {
        const coverExt = this.normalizeImageExtension(coverData.suffix)
        await this.downloadFile(`${archiveBasePath}.${coverExt}`, coverData.blob)
      }
      return
    }

    if (coverOption.type === 'bangumi' && coverOption.imageUrl) {
      const coverExt = this.normalizeImageExtension(this.getSuffix(coverOption.imageUrl))
      await this.downloadRemoteFile(`${archiveBasePath}.${coverExt}`, coverOption.imageUrl)
    }
  }

  getSeriesCacheKey(worker) {
    return `${worker.webName || ''}_${worker.comicName || ''}`
  }

  shouldPrepareMetadata(worker) {
    const { enableBangumiScrape, enableComicInfoXml, enableSeriesJson, enableSeriesCover } = getMetadataFileFlags()
    if (!enableBangumiScrape) {
      return false
    }
    if (worker.downType === 1 && enableComicInfoXml) {
      return true
    }
    return enableSeriesJson || enableSeriesCover
  }

  prepareWorkerMetadata(worker) {
    if (!this.shouldPrepareMetadata(worker)) {
      return Promise.resolve(null)
    }
    return getBangumiMetadata(worker).catch((error) => {
      console.log('bangumiMetadataError: ', error)
      return null
    })
  }

  async getWorkerMetadata(worker) {
    if (!worker) {
      return null
    }
    if (!worker.metadataPromise) {
      worker.metadataPromise = this.prepareWorkerMetadata(worker)
    }
    return worker.metadataPromise
  }

  async writeSeriesMetadata(worker) {
    const { enableSeriesJson, enableSeriesCover } = getMetadataFileFlags()
    const metadataKey = this.getSeriesCacheKey(worker)
    if (!enableSeriesJson && !enableSeriesCover) {
      return
    }
    const externalMetadata = await this.getWorkerMetadata(worker)

    if (enableSeriesJson && !this.seriesJsonCache.has(metadataKey)) {
      const seriesJson = buildSeriesJson(worker, externalMetadata)
      const jsonBlob = new Blob([seriesJson], { type: 'application/json' })
      await this.downloadFile(this.getComicFolderPath(worker) + '\\series.json', jsonBlob)
      this.seriesJsonCache.add(metadataKey)
    }

    if (enableSeriesCover && externalMetadata?.coverUrl && !this.seriesCoverCache.has(metadataKey)) {
      const coverFileName = this.getCoverFileName(externalMetadata.coverUrl)
      const result = await this.downloadRemoteFile(this.getComicFolderPath(worker) + '\\' + coverFileName, externalMetadata.coverUrl)
      if (result) {
        this.seriesCoverCache.add(metadataKey)
      }
    }
  }

  /**
     * 执行一个任务
     * @param { number } index
     */
  async * exeDown(index) {
    const { readtype, downChapterName } = this.worker[index]
    const _this = this

    async function afterDown(index) {
      const { comicName, hasError, comicPageUrl, followItemId, url } = _this.worker[index]
      await _this.writeSeriesMetadata(_this.worker[index])
      if (followItemId && !hasError) {
        clearPendingChapters(followItemId, [url])
      }
      let historyData = localStorage.getItem('ylComicDownHistory') || '[]'
      historyData = JSON.parse(historyData)
      const id = (new Date()).getTime()
      historyData.unshift({ id, comicName, downChapterName, comicPageUrl: comicPageUrl || window.location.href, hasError })
      historyData = JSON.stringify(historyData)
      localStorage.setItem('ylComicDownHistory', historyData)
      _this.Vue.getHistoryData()
      _this.Vue.$bus.$emit('refreshFollowList')
      _this.worker[index] = undefined
      // 休息下？
      setTimeout(() => {
        _this.run()
      }, 2000)
    }

    if (readtype === 1) {
      const { url, isPay, imageSource } = this.worker[index]
      const processData = { url, isPay, imageSource }
      let imgs = []
      try {
        imgs = await (0,utils/* getImage */.gJ)(processData)
        const imgDownRange = (0,setup/* getStorage */.cF)('imgDownRange') || [1, -1]
        const start = parseInt(imgDownRange[0])
        const end = parseInt(imgDownRange[1])
        if (end === -1) {
          imgs = imgs.slice(start - 1)
        } else {
          imgs = imgs.slice(start - 1, end + 1)
        }
        if (!Array.isArray(imgs) || imgs.length === 0) {
          this.worker[index].hasError = true
          await afterDown(index)
          return
        }
        this.worker[index].imgs = imgs
        this.worker[index].totalNumber = imgs.length
      } catch (error) {
        this.worker[index].hasError = true
        console.log('getImageError: ', error)
        await afterDown(index)
        return
      }
      yield this.down(index)
        .then(function() {
          afterDown(index)
        })
        .catch(function(error) {
          _this.worker[index].hasError = true
          console.log('down-e: ', error)
          return afterDown(index)
        })
        //
    } else {
      yield this.down2(index)
        .then(function() {
          afterDown(index)
        })
        .catch(function(error) {
          _this.worker[index].hasError = true
          console.log('down2-e: ', error)
          return afterDown(index)
        })
    }
  }

  /**
     * 添加到任务队列
     * @param { Array<Array<any>> } list: 任务队列
     */
  addList(list) {
    for (const item of list) {
      this.list.unshift(item)
    }
  }

  refresh() {
    this.worker.splice(0, 0)
  }

  isArchiveDownloadType(downType) {
    return downType === 1
  }

  isSpliceDownloadType(downType) {
    return downType === 2
  }

  isBufferDownloadType(downType) {
    return this.isArchiveDownloadType(downType) || this.isSpliceDownloadType(downType)
  }

  sanitizePathSegment(value, fallback = 'untitled') {
    const text = String(value || '')
      .replace(/[\\/:*?"<>|]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/[. ]+$/g, '')
      .trim()
    return text || fallback
  }

  trimFileNameLength(fileName, maxLength = 180) {
    const text = String(fileName || '')
    if (text.length <= maxLength) {
      return text
    }
    const extMatch = text.match(/(\.[^./\\]+)$/)
    const ext = extMatch?.[1] || ''
    const baseName = ext ? text.slice(0, -ext.length) : text
    const keepLength = Math.max(24, maxLength - ext.length)
    return baseName.slice(0, keepLength).replace(/[. ]+$/g, '') + ext
  }

  getBatchFolderPrefix() {
    const value = (0,setup/* getStorage */.cF)('batchFolderPrefix')
    if (value === undefined || value === null) {
      return '#'
    }
    return String(value)
  }

  getBatchFolderIndex(worker = {}) {
    const batchFolderIndex = parseInt(worker.batchFolderIndex, 10)
    if (Number.isInteger(batchFolderIndex) && batchFolderIndex > 0) {
      return batchFolderIndex
    }
    const chapterIndex = parseInt(worker.chapterIndex, 10)
    if (Number.isInteger(chapterIndex) && chapterIndex > 0) {
      return chapterIndex
    }
    return 1
  }

  getChapterFolderName(worker) {
    if (worker.downType === 3) {
      const folderNum = (0,utils/* addZeroForNum */.xo)(this.getBatchFolderIndex(worker), this.imgIndexBitNum)
      return this.sanitizePathSegment(`${this.getBatchFolderPrefix()}${folderNum}`, `chapter-${folderNum}`)
    }
    return this.sanitizePathSegment(worker.downChapterName, 'chapter')
  }

  getComicFolderPath(worker) {
    return this.sanitizePathSegment(worker.comicName, 'comic')
  }

  getChapterFolderPath(worker) {
    return this.getComicFolderPath(worker) + '\\' + this.getChapterFolderName(worker)
  }

  // 直接下载图片 Promise
  addImgDownPromise(index, imgurl, imgIndex, newHeaders, retryTimes, challengeRetryCount = 0) {
    const headers = this.buildImageHeaders(index, newHeaders)
    return new Promise((resolve, reject) => {
      const _this = this
      if (!imgurl) {
        _this.updateProgress(index)
        resolve(false)
        return
      }

      (0,utils/* request */.WY)({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers,
        timeout: 60 * 1000
      }).then(async(res) => {
        const name = this.getChapterFolderPath(this.worker[index]) + '\\' + (0,utils/* addZeroForNum */.xo)(imgIndex, this.imgIndexBitNum) + '.'
        let suffix = this.getSuffix(res?.finalUrl || imgurl)

        let newurl = ''
        if (res === 'onerror' || res === 'timeout') {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgDownPromise(index, imgurl, imgIndex, newHeaders, ++retryTimes, challengeRetryCount))
          }

          _this.worker[index].hasError = true
          suffix = 'txt'
          const newBlob = new Blob([imgurl], { type: 'text/plain' })
          newurl = window.URL.createObjectURL(newBlob)
        } else {
          if (await _this.isChallengeResponse(index, imgurl, res)) {
            resolve(_this.handleChallengeAndRetry((nextChallengeRetryCount) => {
              return _this.addImgDownPromise(index, imgurl, imgIndex, newHeaders, retryTimes, nextChallengeRetryCount)
            }, index, challengeRetryCount))
            return
          }
          _this.updateProgress(index, true)
          newurl = window.URL.createObjectURL(res.response)
        }
        if (res === 'onerror' || res === 'timeout') {
          _this.updateProgress(index)
        }
        (0,utils/* downFile */.zd)(newurl, name + suffix).then((downRes) => {
          if (downRes) {
            resolve(true)
          } else {
            _this.worker[index].hasError = true
            resolve(false)
          }
        })
      })
    })
  }

  // 请求图片Blob Promise (后用于压缩)
  addImgPromise(index, imgurl, newHeaders, retryTimes, challengeRetryCount = 0) {
    const headers = this.buildImageHeaders(index, newHeaders)
    return new Promise((resolve, reject) => {
      const _this = this
      if (imgurl === '' || imgurl === undefined) {
        _this.worker[index].hasError = true
        _this.updateProgress(index)
        return resolve({
          blob: 1,
          imgurl,
          suffix: '' })
      }

      const suffix = this.getSuffix(imgurl)
      ;(0,utils/* request */.WY)({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers,
        timeout: 60 * 1000,
        onload: async function(gmRes) {
          if (await _this.isChallengeResponse(index, imgurl, gmRes)) {
            resolve(_this.handleChallengeAndRetry((nextChallengeRetryCount) => {
              return _this.addImgPromise(index, imgurl, newHeaders, retryTimes, nextChallengeRetryCount)
            }, index, challengeRetryCount))
            return
          }
          _this.updateProgress(index, true)
          resolve({
            blob: gmRes.response,
            imgurl,
            suffix: suffix })
        },
        onerror: function(e) {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes, challengeRetryCount))
          }
          _this.worker[index].hasError = true
          _this.updateProgress(index)
          resolve({
            blob: 1,
            imgurl,
            suffix: '' })
        },
        ontimeout: function() {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes, challengeRetryCount))
          }
          _this.worker[index].hasError = true
          _this.updateProgress(index)
          resolve({
            blob: 0,
            imgurl,
            suffix: '' })
        }
      })
    })
  }

  /**
     * 下载图片
     * @param { workerId } workerId: 任务id
     */

  // 网站翻页阅读
  async down2(workerId) {
    const { url, downType, totalNumber, isPay, imgIndex, downHeaders, imageSource } = this.worker[workerId]

    const processData = { url, imgIndex, totalNumber, isPay, imageSource }
    processData.otherData = this.worker[workerId].otherData

    const { imgUrlArr, nextPageUrl, imgCount, otherData } = await (0,utils/* getImage */.gJ)(processData)
    this.worker[workerId].otherData = otherData

    this.worker[workerId].totalNumber = parseInt(imgCount)
    const beforeDownLen = imgUrlArr.length
    // console.log('下载前', beforeDownLen, imgIndex, totalNumber)

    while (imgUrlArr.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrlArr[0] === undefined) {
          break
        }
        const imgIndex = ++this.worker[workerId].imgIndex
        if (this.isBufferDownloadType(downType)) {
          promise.push(this.addImgPromise(workerId, imgUrlArr[0], downHeaders))
        } else {
          promise.push(this.addImgDownPromise(workerId, imgUrlArr[0], imgIndex, downHeaders))
        }
        imgUrlArr.shift()
      }

      const res = await Promise.all(promise)
      res.forEach(element => {
        this.workerDownInfo[workerId].push(element)
      })
    }

    const newImgIndex = this.worker[workerId].imgIndex
    if (beforeDownLen !== 0 && nextPageUrl !== '' && newImgIndex < parseInt(imgCount)) {
      this.worker[workerId].url = nextPageUrl
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down2(workerId))
        }, 1000)
      })
    } else {
      // 压缩
      if (this.isArchiveDownloadType(downType)) {
        const result = await this.makeZip(workerId)
        return new Promise((resolve, reject) => {
          resolve(result)
        })
      } else if (this.isSpliceDownloadType(downType)) { // 拼接
        await this.combineImages(workerId)
        return new Promise((resolve, reject) => {
          resolve()
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(1)
        })
      }
    }
  }

  // 网站卷轴阅读
  async down(workerId) {
    const { imgs, downType, downHeaders } = this.worker[workerId]
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum

    while (pictureNum-- && len > 0) {
      // 是否压缩
      const imgIndex = ++this.worker[workerId].imgIndex
      if (this.isBufferDownloadType(downType)) {
        promise.push(this.addImgPromise(workerId, imgs[0], downHeaders))
      } else {
        promise.push(this.addImgDownPromise(workerId, imgs[0], imgIndex, downHeaders))
      }
      this.worker[workerId].imgs.shift()
      len--
    }

    const res = await Promise.all(promise)

    res.forEach(element => {
      this.workerDownInfo[workerId].push(element)
    })

    if (this.worker[workerId].imgs.length > 0) {
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down(workerId))
        }, 1000)
      })
    }

    // 压缩
    if (this.isArchiveDownloadType(downType)) {
      const result = await this.makeZip(workerId)
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    } else if (this.isSpliceDownloadType(downType)) { // 拼接
      await this.combineImages(workerId)
      return new Promise((resolve, reject) => {
        resolve()
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(1)
      })
    }
  }

  // 分配并执行任务
  async run() {
    const runIndex = []
    for (let i = 0; i < this.workerLen; i++) {
      const len = this.list.length
      if (!this.worker[i] && len > 0) {
        // 需要执行的任务
        const item = this.list[len - 1]

        const worker = {
          comicName: item.comicName,
          authorName: item.authorName,
          webName: item.webName,
          comicPageUrl: item.comicPageUrl,
          chapterIndex: item.chapterIndex,
          chapterName: item.chapterName,
          chapterNumStr: item.chapterNumStr,
          downChapterName: item.downChapterName,
          batchFolderIndex: item.batchFolderIndex,
          url: item.url,
          isPay: item.isPay, // 是否付费章节
          imgIndex: 0, // 图片序号
          successNum: 0, // 下载成功数量
          totalNumber: 0, // 图片总数
          imgs: [],
          progress: 0, // 进度百分比
          readtype: item.readtype, // 阅读(下载)方式类型
          func: this.exeDown(i),
          downType: item.downType, // 下载方式 0：直接  1：压缩  2：拼接  3：批量
          hasError: false,
          verifyPromptShown: false,
          imageSource: item.imageSource,
          downHeaders: item.downHeaders,
          otherData: undefined, // 自定义存储其他下载数据
          seriesChapterCount: item.seriesChapterCount,
          followItemId: item.followItemId,
          coverOption: item.coverOption,
          metadataOverride: item.metadataOverride,
          metadataPromise: undefined
        }
        worker.metadataPromise = this.prepareWorkerMetadata(worker)
        this.worker[i] = worker
        this.workerDownInfo[i] = []
        this.list.pop()
        runIndex.push(i)
      }
    }
    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }

  getSuffix(url) {
    if (url) {
      const testurl = url.toLowerCase()
      const imgtype = ['jpg', 'jpeg', 'webp', 'png', 'gif', 'bmp', 'tiff', 'svg', 'ico']
      for (let i = 0; i < imgtype.length; i++) {
        const a = testurl.search(imgtype[i])
        if (a !== -1) {
          return imgtype[i]
        }
      }
      // 可能网址没有图片后缀
      return 'jpg'
    }
    return false
  }

  // 压缩
  async makeZip(workerId) {
    const { comicName } = this.worker[workerId]
    const zip = new (external_JSZip_default())()
    const { enableComicInfoXml } = getMetadataFileFlags()
    const externalMetadata = await this.getWorkerMetadata(this.worker[workerId])
    this.workerDownInfo[workerId].forEach((item, index) => {
      const imgblob = item.blob
      const suffix = item.suffix
      if (imgblob === 1 || imgblob === 0) {
        const txtBlob = new Blob([item.imgurl], { type: 'text/plain' })
        zip.file((0,utils/* addZeroForNum */.xo)(index + 1, this.imgIndexBitNum) + '.txt', txtBlob, { blob: true })
        return
      }
      zip.file((0,utils/* addZeroForNum */.xo)(index + 1, this.imgIndexBitNum) + '.' + suffix, imgblob, { blob: true })
    })
    if (enableComicInfoXml) {
      zip.file('ComicInfo.xml', buildComicInfoXml(this.worker[workerId], this.worker[workerId].totalNumber, externalMetadata))
    }

    const zipblob = await zip.generateAsync({
      type: 'blob',
      compression: 'STORE',
      compressionOptions: {
        level: 0
      }
    })
    const archiveName = buildArchiveName(this.worker[workerId], this.worker[workerId].totalNumber)
    const archiveBasePath = this.getComicFolderPath(this.worker[workerId]) + '\\' + archiveName
    const archiveFileName = this.trimFileNameLength(archiveBasePath + '.cbz')
    const archiveDownloaded = await this.downloadFile(archiveFileName, zipblob)
    if (!archiveDownloaded) {
      this.worker[workerId].hasError = true
      throw new Error('压缩包下载失败')
    }
    await this.writeBookCoverFile(workerId, this.trimFileNameLength(archiveBasePath))
    return true
  }

  async combineImages(workerId) {
    const maxSplicingHeight = (0,setup/* getStorage */.cF)('maxSplicingHeight')
    const chapterFolderPath = this.getChapterFolderPath(this.worker[workerId])
    let imgNum = 0
    let curHeight = 0
    let totalHeight = 0
    const saveImg = []
    const _this = this

    async function asyncLoadImg(src) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          const error = new Error(`图片加载失败，url：${src}`)
          console.log('combineImages-e: ', error)
          reject('')
        }
        img.src = src
      })
    }

    async function asyncCanvas(canvas, name) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(async function(imgblob) {
          await _this.downloadFile(name, imgblob)
          resolve()
        }, 'image/jpeg', 0.8)
      })
    }

    for (let index = 0; index < this.workerDownInfo[workerId].length; index++) {
      const data = this.workerDownInfo[workerId][index]
      // 去除不是图片类型
      if (data.blob === 1 || data.blob === 0 || !data.blob.type.includes('image')) {
        this.worker[workerId].hasError = true
        const error_name = chapterFolderPath + '\\error_' + (0,utils/* addZeroForNum */.xo)(index + 1, this.imgIndexBitNum) + '.txt'
        const imgurl = this.workerDownInfo[workerId][index].imgurl
        const newBlob = new Blob([imgurl], { type: 'text/plain' })
        _this.downloadFile(error_name, newBlob)
        continue
      }

      const newurl = window.URL.createObjectURL(data.blob)
      const image = await asyncLoadImg(newurl)
      if (image === '') {
        continue
      }
      if (totalHeight === 0) {
        const obj = { num: imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        totalHeight += image.height
        saveImg.push(obj)
        continue
      }
      if (curHeight + image.height > maxSplicingHeight) {
        const newobj = { num: ++imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        saveImg.push(newobj)
      } else {
        curHeight += image.height
        saveImg[imgNum].height += image.height
        saveImg[imgNum].img.push(image)
      }
      totalHeight += image.height
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    let offsetY = 0
    for (let i = 0; i < saveImg.length; i++) {
      const item = saveImg[i]
      canvas.width = item.width
      canvas.height = item.height
      offsetY = 0

      for (let len = 0; len < item.img.length; len++) {
        const element = item.img[len]
        context.drawImage(element, 0, offsetY, element.width, element.height)
        offsetY = offsetY + parseInt(element.height)
      }
      const name = chapterFolderPath + '\\' + (0,utils/* addZeroForNum */.xo)(item.num + 1, this.imgIndexBitNum) + '.jpg'
      await asyncCanvas(canvas, name)
    }

    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
}

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ const downvue_type_script_lang_js_ = ({
  name: 'Down',
  data() {
    return {
      collapseActiveName: ['1', '2', '3'],
      comicName: null,
      currentDomain: '当前记录 ' + (0,utils/* getdomain */.m1)(),
      queue: {
        'worker': '',
        'list': '',
        'workeredList': ''
      },
      maxChapterNum: 3,
      maxPictureNum: 2,
      imgIndexBitNum: 3,
      historyData: []
    }
  },
  watch: {

  },
  mounted() {
    console.clear()
    this.$bus.$on('selectDown', this.downInit)
  },
  created() {
    this.$bus.$on('getComicName', this.getComicName)
    this.getHistoryData()
  },
  methods: {
    getComicName(value) {
      if (value !== '------') { this.comicName = value }
    },
    normalizeBatchDownloadItems(list = []) {
      const groupCounterMap = new Map()
      return list.map((item) => {
        if (item?.downType !== 3) {
          return item
        }
        const groupKey = `${item.webName || ''}__${item.comicPageUrl || item.comicName || ''}`
        const nextIndex = (groupCounterMap.get(groupKey) || 0) + 1
        groupCounterMap.set(groupKey, nextIndex)
        const chapterIndex = parseInt(item.chapterIndex, 10)
        return {
          ...item,
          batchFolderIndex: Number.isInteger(chapterIndex) && chapterIndex > 0 ? chapterIndex : nextIndex
        }
      })
    },
    downInit(arr) {
      const downloadItems = this.normalizeBatchDownloadItems((arr || []).map(item => ({
        originTab: item?.originTab ?? 3,
        ...item
      })))
      if (shouldPreviewMetadataForItems(downloadItems)) {
        this.$bus.$emit('openMetadataPreview', downloadItems)
        this.$bus.$emit('changTab', 6)
        return
      }
      if (this.queue.worker === '') {
        this.maxChapterNum = (0,setup/* getStorage */.cF)('maxChapterNum')
        this.maxPictureNum = (0,setup/* getStorage */.cF)('maxPictureNum')
        this.imgIndexBitNum = (0,setup/* getStorage */.cF)('imgIndexBitNum')
        this.queue = new Queue(this.maxChapterNum, this.maxPictureNum, this.imgIndexBitNum, this)
      }
      this.queue.addList(downloadItems)
      this.queue.run()
    },
    getHistoryData() {
      const data = localStorage.getItem('ylComicDownHistory')
      this.historyData = JSON.parse(data || '[]')
    },
    deleteHistoryData(index, id) {
      this.historyData.splice(index, 1)
      let data = localStorage.getItem('ylComicDownHistory')
      let historyData = JSON.parse(data || '[]')
      historyData = historyData.filter((item) => item.id !== id)
      data = JSON.stringify(historyData)
      localStorage.setItem('ylComicDownHistory', data)
    },
    deleteAllHistoryData() {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: '确认全部删除'
      })
        .then(() => {
          this.historyData.splice(0, this.historyData.length)
          localStorage.setItem('ylComicDownHistory', '[]')
        })
        .catch(() => {
          // on cancel
        })
    },
    jump(url) {
      window.open(url, '_blank')
      // window.location.href = url
    }
  }
});

;// CONCATENATED MODULE: ./src/views/down.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_downvue_type_script_lang_js_ = (downvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=style&index=0&id=1e855a88&lang=less&scoped=true&
var downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_ = __webpack_require__(3240);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/down.vue?vue&type=style&index=0&id=1e855a88&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options = {};

downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default */.Z, downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_options);




       /* harmony default export */ const views_downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_ = (downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default */.Z && downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default.locals */.Z.locals ? downvue_type_style_index_0_id_1e855a88_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/down.vue?vue&type=style&index=0&id=1e855a88&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/down.vue



;


/* normalize component */

var down_component = normalizeComponent(
  views_downvue_type_script_lang_js_,
  downvue_type_template_id_1e855a88_scoped_true_render,
  downvue_type_template_id_1e855a88_scoped_true_staticRenderFns,
  false,
  null,
  "1e855a88",
  null
  
)

/* hot reload */
if (false) { var down_api; }
down_component.options.__file = "src/views/down.vue"
/* harmony default export */ const down = (down_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=template&id=2da631cb&scoped=true&
var followvue_type_template_id_2da631cb_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "follow-page" },
    [
      _c(
        "div",
        { staticClass: "follow-toolbar" },
        [
          _c(
            "van-button",
            {
              attrs: {
                size: "small",
                round: "",
                type: "primary",
                loading: _vm.checking,
              },
              on: { click: _vm.checkAll },
            },
            [_vm._v("检查全部")]
          ),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: {
                size: "small",
                round: "",
                disabled: !_vm.hasPendingChapters,
              },
              on: { click: _vm.downloadAllPending },
            },
            [_vm._v("下载全部更新")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "follow-keyword-toolbar" },
        [
          _c("van-field", {
            attrs: {
              size: "small",
              placeholder: "输入漫画名，按选中站点搜索追更",
            },
            nativeOn: {
              keyup: function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                return _vm.searchByKeyword.apply(null, arguments)
              },
            },
            model: {
              value: _vm.keywordFollowName,
              callback: function ($$v) {
                _vm.keywordFollowName = $$v
              },
              expression: "keywordFollowName",
            },
          }),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: {
                size: "small",
                round: "",
                type: "info",
                loading: _vm.addingKeywordFollow,
              },
              on: { click: _vm.searchByKeyword },
            },
            [_vm._v("开始搜索")]
          ),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: { size: "small", round: "", plain: "" },
              on: { click: _vm.toggleScanSitePanel },
            },
            [_vm._v(_vm._s(_vm.showScanSitePanel ? "收起站点" : "扫描站点"))]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _vm.showScanSitePanel
        ? _c(
            "div",
            { staticClass: "follow-site-panel" },
            [
              _c("div", { staticClass: "follow-panel-header" }, [
                _c("span", [_vm._v("扫描站点")]),
                _vm._v(" "),
                _c("span", [
                  _vm._v(
                    _vm._s(_vm.selectedScanWebNames.length) +
                      "/" +
                      _vm._s(_vm.searchableWebOptions.length)
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "follow-site-actions" },
                [
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.selectAllScanSites },
                    },
                    [_vm._v("全选")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.clearScanSites },
                    },
                    [_vm._v("清空")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "van-checkbox-group",
                {
                  on: { change: _vm.saveScanSites },
                  model: {
                    value: _vm.selectedScanWebNames,
                    callback: function ($$v) {
                      _vm.selectedScanWebNames = $$v
                    },
                    expression: "selectedScanWebNames",
                  },
                },
                [
                  _c(
                    "div",
                    { staticClass: "follow-site-grid" },
                    _vm._l(_vm.searchableWebOptions, function (item) {
                      return _c(
                        "van-checkbox",
                        {
                          key: item.webName,
                          staticClass: "follow-site-check",
                          attrs: { name: item.webName },
                        },
                        [
                          _vm._v(
                            "\n          " + _vm._s(item.webName) + "\n        "
                          ),
                        ]
                      )
                    }),
                    1
                  ),
                ]
              ),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.searchCandidates.length > 0
        ? _c(
            "div",
            { staticClass: "follow-result-panel" },
            [
              _c("div", { staticClass: "follow-panel-header" }, [
                _c("span", [_vm._v("匹配结果")]),
                _vm._v(" "),
                _c("span", [
                  _vm._v(
                    _vm._s(_vm.selectedCandidateKeys.length) +
                      "/" +
                      _vm._s(_vm.searchCandidates.length)
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "follow-site-actions" },
                [
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.selectAllCandidates },
                    },
                    [_vm._v("全选")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini" },
                      on: { click: _vm.clearCandidateSelection },
                    },
                    [_vm._v("清空")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini", type: "primary" },
                      on: { click: _vm.addSelectedCandidates },
                    },
                    [_vm._v("加入选中站点")]
                  ),
                  _vm._v(" "),
                  _c(
                    "van-button",
                    {
                      attrs: { size: "mini", plain: "" },
                      on: { click: _vm.clearSearchCandidates },
                    },
                    [_vm._v("取消结果")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "van-checkbox-group",
                {
                  model: {
                    value: _vm.selectedCandidateKeys,
                    callback: function ($$v) {
                      _vm.selectedCandidateKeys = $$v
                    },
                    expression: "selectedCandidateKeys",
                  },
                },
                [
                  _c(
                    "van-cell-group",
                    { attrs: { inset: "" } },
                    _vm._l(_vm.searchCandidates, function (item) {
                      return _c("van-cell", {
                        key: item.key,
                        staticClass: "candidate-cell",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "title",
                              fn: function () {
                                return [
                                  _c(
                                    "van-checkbox",
                                    { attrs: { name: item.key } },
                                    [_vm._v(_vm._s(item.webName))]
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                            {
                              key: "label",
                              fn: function () {
                                return [
                                  _c(
                                    "div",
                                    { staticClass: "candidate-label" },
                                    [_vm._v(_vm._s(item.comicName))]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "candidate-label candidate-label--sub",
                                    },
                                    [
                                      _vm._v(
                                        "\n              " +
                                          _vm._s(
                                            _vm.formatSeriesCount(
                                              item.seriesChapterCount
                                            )
                                          ) +
                                          "\n            "
                                      ),
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "candidate-label candidate-label--sub",
                                    },
                                    [
                                      _vm._v(
                                        "\n              最新: " +
                                          _vm._s(
                                            _vm.formatLatestChapterName(
                                              item.latestChapterName
                                            )
                                          ) +
                                          "\n            "
                                      ),
                                    ]
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                            {
                              key: "right-icon",
                              fn: function () {
                                return [
                                  _c(
                                    "div",
                                    { staticClass: "candidate-actions" },
                                    [
                                      _c(
                                        "van-button",
                                        {
                                          attrs: { size: "mini", plain: "" },
                                          on: {
                                            click: function ($event) {
                                              $event.stopPropagation()
                                              return _vm.openComic(
                                                item.comicPageUrl
                                              )
                                            },
                                          },
                                        },
                                        [_vm._v("详情")]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "van-button",
                                        {
                                          attrs: {
                                            size: "mini",
                                            plain: "",
                                            type: "primary",
                                          },
                                          on: {
                                            click: function ($event) {
                                              $event.stopPropagation()
                                              return _vm.openLatestChapter(item)
                                            },
                                          },
                                        },
                                        [_vm._v("最新章")]
                                      ),
                                    ],
                                    1
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      })
                    }),
                    1
                  ),
                ],
                1
              ),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.followList.length === 0
        ? _c("van-empty", { attrs: { description: "追更列表为空" } }, [
            _c("p", { staticClass: "follow-hint" }, [
              _vm._v("在“加载”页点击“加入追更”即可收藏当前漫画。"),
            ]),
          ])
        : _c(
            "div",
            { staticClass: "follow-list" },
            _vm._l(_vm.followList, function (item) {
              return _c(
                "van-cell-group",
                {
                  key: item.id,
                  staticClass: "follow-card",
                  attrs: { inset: "" },
                },
                [
                  _c("van-cell", {
                    attrs: { title: item.comicName, label: item.webName },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "right-icon",
                          fn: function () {
                            return [
                              _c(
                                "van-tag",
                                {
                                  attrs: {
                                    type:
                                      item.pendingChapters.length > 0
                                        ? "danger"
                                        : "primary",
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n            " +
                                      _vm._s(item.pendingChapters.length) +
                                      " 更\n          "
                                  ),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      true
                    ),
                  }),
                  _vm._v(" "),
                  _c("van-field", {
                    attrs: { label: "作者", placeholder: "可手动补充作者名" },
                    on: {
                      blur: function ($event) {
                        return _vm.saveAuthor(item)
                      },
                    },
                    model: {
                      value: item.authorName,
                      callback: function ($$v) {
                        _vm.$set(item, "authorName", $$v)
                      },
                      expression: "item.authorName",
                    },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: {
                      title: "漫画页",
                      "is-link": "",
                      value: _vm.formatCheckTime(item.lastCheckedAt),
                    },
                    on: {
                      click: function ($event) {
                        return _vm.openComic(item.comicPageUrl)
                      },
                    },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: {
                      title: "总章节",
                      value: _vm.formatSeriesCount(item.seriesChapterCount),
                    },
                  }),
                  _vm._v(" "),
                  _c("van-cell", {
                    attrs: {
                      title: "最新章节",
                      "is-link": "",
                      value: _vm.formatLatestChapterName(
                        item.latestChapterName
                      ),
                    },
                    on: {
                      click: function ($event) {
                        return _vm.openLatestChapter(item)
                      },
                    },
                  }),
                  _vm._v(" "),
                  item.lastError
                    ? _c("van-cell", {
                        attrs: { title: "检查失败: " + item.lastError },
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  item.pendingChapters.length > 0
                    ? _c(
                        "div",
                        { staticClass: "pending-list" },
                        _vm._l(item.pendingChapters, function (chapter) {
                          return _c(
                            "div",
                            { key: chapter.url, staticClass: "pending-item" },
                            [
                              _vm._v(
                                "\n          " +
                                  _vm._s(chapter.chapterName) +
                                  "\n        "
                              ),
                            ]
                          )
                        }),
                        0
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "follow-actions" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: { size: "mini" },
                          on: {
                            click: function ($event) {
                              return _vm.checkOne(item)
                            },
                          },
                        },
                        [_vm._v("检查")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: {
                            size: "mini",
                            type: "primary",
                            disabled: item.pendingChapters.length === 0,
                          },
                          on: {
                            click: function ($event) {
                              return _vm.downloadPending(item)
                            },
                          },
                        },
                        [_vm._v("下载更新")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: {
                            size: "mini",
                            disabled: item.pendingChapters.length === 0,
                          },
                          on: {
                            click: function ($event) {
                              return _vm.markHandled(item)
                            },
                          },
                        },
                        [_vm._v("标记已处理")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: { size: "mini", type: "danger", plain: "" },
                          on: {
                            click: function ($event) {
                              return _vm.removeItem(item)
                            },
                          },
                        },
                        [_vm._v("删除")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              )
            }),
            1
          ),
    ],
    1
  )
}
var followvue_type_template_id_2da631cb_scoped_true_staticRenderFns = []
followvue_type_template_id_2da631cb_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/follow.vue?vue&type=template&id=2da631cb&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const followvue_type_script_lang_js_ = ({
  name: 'Follow',
  data() {
    return {
      followList: [],
      checking: false,
      keywordFollowName: '',
      addingKeywordFollow: false,
      showScanSitePanel: false,
      searchableWebOptions: [],
      selectedScanWebNames: [],
      searchCandidates: [],
      selectedCandidateKeys: [],
      lastSkippedSiteCount: 0
    }
  },
  computed: {
    hasPendingChapters() {
      return this.followList.some(item => item.pendingChapters.length > 0)
    }
  },
  mounted() {
    this.refreshList()
    this.initSearchableWebOptions()
    this.$bus.$on('refreshFollowList', this.refreshList)
    this.$bus.$on('getComicName', (comicName) => {
      if (!this.keywordFollowName && comicName && comicName !== '------') {
        this.keywordFollowName = comicName
      }
    })
    if (canAutoCheckFollow()) {
      this.autoCheckOnLoad()
    }
  },
  methods: {
    refreshList() {
      this.followList = getFollowList()
    },
    initSearchableWebOptions() {
      this.searchableWebOptions = (0,comics/* getSearchableWebList */.EQ)().map(item => ({
        webName: item.webName
      }))
      const savedWebNames = (0,setup/* getStorage */.cF)('followSearchWebNames') || []
      const defaultWebNames = this.searchableWebOptions.map(item => item.webName)
      const matchedWebNames = defaultWebNames.filter(webName => savedWebNames.includes(webName))
      this.selectedScanWebNames = matchedWebNames.length > 0 ? matchedWebNames : defaultWebNames
      this.saveScanSites()
    },
    saveScanSites() {
      (0,setup/* setStorage */.po)('followSearchWebNames', this.selectedScanWebNames)
    },
    toggleScanSitePanel() {
      this.showScanSitePanel = !this.showScanSitePanel
    },
    selectAllScanSites() {
      this.selectedScanWebNames = this.searchableWebOptions.map(item => item.webName)
      this.saveScanSites()
    },
    clearScanSites() {
      this.selectedScanWebNames = []
      this.saveScanSites()
    },
    formatCheckTime(time) {
      if (!time) {
        return '未检查'
      }
      const date = new Date(time)
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}`
    },
    formatSeriesCount(count) {
      if (!count || count < 0) {
        return '章节数未知'
      }
      return `共 ${count} 话`
    },
    formatLatestChapterName(name) {
      return name || '未识别到最新章节'
    },
    async autoCheckOnLoad() {
      await this.checkAll(true)
    },
    async searchByKeyword() {
      const keyword = (this.keywordFollowName || '').trim()
      if (keyword.length < 2) {
        (0,external_vant_.Toast)({
          message: '漫画名至少2个字符',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.selectedScanWebNames.length === 0) {
        (0,external_vant_.Toast)({
          message: '请先选择要扫描的站点',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      this.addingKeywordFollow = true
      try {
        const result = await searchFollowCandidatesByKeyword(keyword, this.selectedScanWebNames)
        this.searchCandidates = result.candidates
        this.selectedCandidateKeys = result.candidates.map(item => item.key)
        this.lastSkippedSiteCount = result.skippedSites.length
        const matchCount = result.candidates.length
        const skipCount = result.skippedSites.length
        ;(0,external_vant_.Toast)({
          message: matchCount > 0
            ? `找到 ${matchCount} 个候选站点${skipCount > 0 ? `，未命中 ${skipCount} 个站点` : ''}`
            : '没有找到可加入追更的站点',
          getContainer: '.card',
          position: 'bottom'
        })
      } finally {
        this.addingKeywordFollow = false
      }
    },
    selectAllCandidates() {
      this.selectedCandidateKeys = this.searchCandidates.map(item => item.key)
    },
    clearCandidateSelection() {
      this.selectedCandidateKeys = []
    },
    clearSearchCandidates() {
      this.searchCandidates = []
      this.selectedCandidateKeys = []
      this.lastSkippedSiteCount = 0
    },
    addSelectedCandidates() {
      const selectedCandidates = this.searchCandidates.filter(item => this.selectedCandidateKeys.includes(item.key))
      if (selectedCandidates.length === 0) {
        (0,external_vant_.Toast)({
          message: '请先勾选要保留的站点',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      const skippedSiteCount = this.lastSkippedSiteCount
      const addedItems = addFollowCandidates(selectedCandidates)
      this.refreshList()
      this.clearSearchCandidates()
      ;(0,external_vant_.Toast)({
        message: `已加入 ${addedItems.length} 个站点${skippedSiteCount > 0 ? `，未命中 ${skippedSiteCount} 个站点` : ''}`,
        getContainer: '.card',
        position: 'bottom'
      })
    },
    async checkAll(silent = false) {
      this.checking = true
      try {
        const list = await checkAllFollowItems()
        this.followList = list
        const updateCount = list.reduce((sum, item) => sum + item.pendingChapters.length, 0)
        if (!silent || updateCount > 0) {
          (0,external_vant_.Toast)({
            message: updateCount > 0 ? `发现 ${updateCount} 个待处理章节` : '追更检查完成',
            getContainer: '.card',
            position: 'bottom'
          })
        }
      } finally {
        this.checking = false
      }
    },
    async checkOne(item) {
      const nextItem = await checkFollowItem(item.id)
      this.followList = this.followList.map(current => current.id === item.id ? nextItem : current)
      ;(0,external_vant_.Toast)({
        message: nextItem.pendingChapters.length > 0 ? `发现 ${nextItem.pendingChapters.length} 个更新` : '暂无更新',
        getContainer: '.card',
        position: 'bottom'
      })
    },
    saveAuthor(item) {
      updateFollowItem(item.id, (current) => {
        current.authorName = item.authorName || ''
        return current
      })
      this.refreshList()
    },
    buildDownloadItems(item) {
      const downType = (0,setup/* getStorage */.cF)('downType')
      return item.pendingChapters.map((chapter) => {
        const webRule = (0,comics/* findWebByUrl */.jL)(chapter.url || item.comicPageUrl)
        const downChapterName = chapter.chapterNumStr
          ? `${chapter.chapterNumStr}${chapter.chapterName ? '-' + chapter.chapterName : ''}`
          : chapter.chapterName
        return {
          ...chapter,
          originTab: 4,
          comicName: item.comicName,
          authorName: item.authorName || chapter.authorName || '',
          webName: item.webName,
          comicPageUrl: item.comicPageUrl,
          seriesChapterCount: item.seriesChapterCount,
          followItemId: item.id,
          downChapterName,
          downType,
          imageSource: chapter.imageSource || webRule?.defaultImageSource || '',
          downHeaders: webRule?.downHeaders
        }
      })
    },
    downloadPending(item) {
      const downloadItems = this.buildDownloadItems(item)
      if (downloadItems.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', downloadItems)
      this.$bus.$emit('changTab', 3)
    },
    downloadAllPending() {
      const allDownloads = this.followList.flatMap(item => this.buildDownloadItems(item))
      if (allDownloads.length === 0) {
        return
      }
      this.$bus.$emit('selectDown', allDownloads)
      this.$bus.$emit('changTab', 3)
    },
    markHandled(item) {
      clearPendingChapters(item.id)
      this.refreshList()
    },
    removeItem(item) {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: `确认删除 ${item.comicName} ？`
      }).then(() => {
        removeFollowItem(item.id)
        this.refreshList()
      }).catch(() => {})
    },
    openLatestChapter(item) {
      this.openComic(item.latestChapterUrl || item.comicPageUrl)
    },
    openComic(url) {
      if (!url) {
        return
      }
      window.open(url, '_blank')
    }
  }
});

;// CONCATENATED MODULE: ./src/views/follow.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_followvue_type_script_lang_js_ = (followvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=style&index=0&id=2da631cb&lang=less&scoped=true&
var followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_ = __webpack_require__(386);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/follow.vue?vue&type=style&index=0&id=2da631cb&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options = {};

followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default */.Z, followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_options);




       /* harmony default export */ const views_followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_ = (followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default */.Z && followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default.locals */.Z.locals ? followvue_type_style_index_0_id_2da631cb_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/follow.vue?vue&type=style&index=0&id=2da631cb&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/follow.vue



;


/* normalize component */

var follow_component = normalizeComponent(
  views_followvue_type_script_lang_js_,
  followvue_type_template_id_2da631cb_scoped_true_render,
  followvue_type_template_id_2da631cb_scoped_true_staticRenderFns,
  false,
  null,
  "2da631cb",
  null
  
)

/* hot reload */
if (false) { var follow_api; }
follow_component.options.__file = "src/views/follow.vue"
/* harmony default export */ const follow = (follow_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=template&id=234d1526&scoped=true&
var settingvue_type_template_id_234d1526_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "setindex" },
    [
      _c(
        "van-swipe",
        {
          ref: "swipe2",
          staticClass: "my-swipe",
          staticStyle: { cursor: "default" },
          attrs: { "initial-swipe": 0, duration: 5, "show-indicators": false },
        },
        [
          _c("van-swipe-item", { staticClass: "swipeitem" }, [
            _c(
              "div",
              { attrs: { id: "setpart" } },
              [
                _c(
                  "van-cell-group",
                  { attrs: { id: "app-loadset", title: "app加载", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("随网页加载UI界面"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right-start",
                                    "get-container": "#app-loadset",
                                    offset: [-2, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.showUiPopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.showUiPopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.showUiPopover,
                                    callback: function ($$v) {
                                      _vm.showUiPopover = $$v
                                    },
                                    expression: "showUiPopover",
                                  },
                                },
                                [
                                  _c("code", { staticClass: "popovertext" }, [
                                    _vm._v("关闭后可通过快捷键唤起"),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "appLoadDefault",
                                      _vm.appLoadDefault.isShowUI,
                                      "isShowUI"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.appLoadDefault.isShowUI,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.appLoadDefault,
                                      "isShowUI",
                                      $$v
                                    )
                                  },
                                  expression: "appLoadDefault.isShowUI",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("加载界面快捷键"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("div", [
                                _c("code", { staticStyle: { width: "35px" } }, [
                                  _vm._v("Alt + "),
                                ]),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.appLoadDefault.loadHotKey,
                                      expression: "appLoadDefault.loadHotKey",
                                    },
                                  ],
                                  staticClass: "rightbutton",
                                  attrs: { id: "hot-key-input" },
                                  domProps: {
                                    value: _vm.appLoadDefault.loadHotKey,
                                  },
                                  on: {
                                    input: [
                                      function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.$set(
                                          _vm.appLoadDefault,
                                          "loadHotKey",
                                          $event.target.value
                                        )
                                      },
                                      _vm.loadHotKeyChange,
                                    ],
                                  },
                                }),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("右边大小缩放(%)"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-stepper", {
                                staticClass: "rightbutton",
                                attrs: {
                                  min: "75",
                                  max: "125",
                                  "default-value": 100,
                                  step: "1",
                                  integer: "",
                                  "button-size": "20px",
                                },
                                on: {
                                  change: function ($event) {
                                    return _vm.changeRightSize(_vm.appRightSize)
                                  },
                                },
                                model: {
                                  value: _vm.appRightSize,
                                  callback: function ($$v) {
                                    _vm.appRightSize = $$v
                                  },
                                  expression: "appRightSize",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("中间大小缩放(%)"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-stepper", {
                                staticClass: "rightbutton",
                                attrs: {
                                  min: "75",
                                  max: "125",
                                  "default-value": 100,
                                  step: "1",
                                  integer: "",
                                  "button-size": "20px",
                                },
                                on: {
                                  change: function ($event) {
                                    return _vm.changeCenterSize(
                                      _vm.appCenterSize
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.appCenterSize,
                                  callback: function ($$v) {
                                    _vm.appCenterSize = $$v
                                  },
                                  expression: "appCenterSize",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { id: "downpart", title: "下载", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: { label: "*下载前生效", center: "" },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c(
                                "span",
                                {
                                  staticClass: "custom-title",
                                  staticStyle: { width: "300px" },
                                },
                                [_vm._v("最大下载章节数")]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c(
                                "div",
                                { staticStyle: { display: "flex" } },
                                [
                                  _vm._v(
                                    "\n                1 \n                "
                                  ),
                                  _c("van-slider", {
                                    staticClass: "rightslider",
                                    attrs: { min: 1, max: 3 },
                                    on: {
                                      change: function ($event) {
                                        return _vm.onChangeData(
                                          "maxChapterNum",
                                          _vm.maxChapterNum
                                        )
                                      },
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "button",
                                        fn: function () {
                                          return [
                                            _c(
                                              "div",
                                              { staticClass: "custom-button" },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.maxChapterNum)
                                                ),
                                              ]
                                            ),
                                          ]
                                        },
                                        proxy: true,
                                      },
                                    ]),
                                    model: {
                                      value: _vm.maxChapterNum,
                                      callback: function ($$v) {
                                        _vm.maxChapterNum = $$v
                                      },
                                      expression: "maxChapterNum",
                                    },
                                  }),
                                  _vm._v(" 3\n              "),
                                ],
                                1
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: { label: "*下载前生效", center: "" },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c(
                                "span",
                                {
                                  staticClass: "custom-title",
                                  staticStyle: { width: "300px" },
                                },
                                [_vm._v("每章最大下载图片数")]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c(
                                "div",
                                { staticStyle: { display: "flex" } },
                                [
                                  _vm._v(
                                    "\n                1 \n                "
                                  ),
                                  _c("van-slider", {
                                    staticClass: "rightslider",
                                    attrs: { min: 1, max: 5 },
                                    on: {
                                      change: function ($event) {
                                        return _vm.onChangeData(
                                          "maxPictureNum",
                                          _vm.maxPictureNum
                                        )
                                      },
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "button",
                                        fn: function () {
                                          return [
                                            _c(
                                              "div",
                                              { staticClass: "custom-button" },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.maxPictureNum)
                                                ),
                                              ]
                                            ),
                                          ]
                                        },
                                        proxy: true,
                                      },
                                    ]),
                                    model: {
                                      value: _vm.maxPictureNum,
                                      callback: function ($$v) {
                                        _vm.maxPictureNum = $$v
                                      },
                                      expression: "maxPictureNum",
                                    },
                                  }),
                                  _vm._v(" 5\n              "),
                                ],
                                1
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "*本次默认设置，修改后下次启动默认生效",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("下载方式"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-8, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.downTypePopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.downTypePopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.downTypePopover,
                                    callback: function ($$v) {
                                      _vm.downTypePopover = $$v
                                    },
                                    expression: "downTypePopover",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v(
                                        "* 如需保存在文件夹需要设置油猴下载模式为浏览器API"
                                      ),
                                    ]),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c(
                                "div",
                                {
                                  staticClass: "dropdown",
                                  on: {
                                    mouseover: function ($event) {
                                      _vm.showDropDown = true
                                    },
                                    mouseleave: function ($event) {
                                      _vm.showDropDown = false
                                    },
                                  },
                                },
                                [
                                  _c("button", { staticClass: "dropbtn" }, [
                                    _vm._v(
                                      _vm._s(_vm.dropItem[_vm.downType].Text)
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: _vm.showDropDown,
                                          expression: "showDropDown",
                                        },
                                      ],
                                      staticClass: "dropdown-content",
                                      attrs: { id: "myDropdown" },
                                    },
                                    _vm._l(
                                      _vm.dropItem,
                                      function (item, index) {
                                        return _c(
                                          "a",
                                          {
                                            key: index,
                                            attrs: { href: "#" },
                                            on: {
                                              click: function ($event) {
                                                return _vm.changeDownType(
                                                  item.value
                                                )
                                              },
                                            },
                                          },
                                          [
                                            _c(
                                              "div",
                                              { attrs: { title: item.hint } },
                                              [
                                                _vm._v(
                                                  "\n                      " +
                                                    _vm._s(item.Text) +
                                                    "\n                      "
                                                ),
                                                _c("van-icon", {
                                                  directives: [
                                                    {
                                                      name: "show",
                                                      rawName: "v-show",
                                                      value: item.hint,
                                                      expression: "item.hint",
                                                    },
                                                  ],
                                                  attrs: {
                                                    name: "info-o",
                                                    color: "red",
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ]
                                        )
                                      }
                                    ),
                                    0
                                  ),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "*下载拼接前生效",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("拼接图片最大高度"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-8, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.splicingHeightPopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.splicingHeightPopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.splicingHeightPopover,
                                    callback: function ($$v) {
                                      _vm.splicingHeightPopover = $$v
                                    },
                                    expression: "splicingHeightPopover",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v("* chrome和Edge 最大不超过 65530"),
                                    ]),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("div", [
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.maxSplicingHeight,
                                      expression: "maxSplicingHeight",
                                    },
                                  ],
                                  staticClass: "rightbutton",
                                  attrs: {
                                    id: "max-splicing-height-input",
                                    type: "number",
                                    min: 10000,
                                    max: 65530,
                                    onkeyup:
                                      "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                  },
                                  domProps: { value: _vm.maxSplicingHeight },
                                  on: {
                                    blur: _vm.splicingHeightBlur,
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.maxSplicingHeight =
                                        $event.target.value
                                    },
                                  },
                                }),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "*本次启动默认设置,修改刷新生效",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("图片序号最少位数"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-5, 5],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.addZeroHint = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.addZeroHint = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.addZeroHint,
                                    callback: function ($$v) {
                                      _vm.addZeroHint = $$v
                                    },
                                    expression: "addZeroHint",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v('* 不足则向前补充"0"'),
                                    ]),
                                    _c("br"),
                                    _vm._v(" "),
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v("* 选择1，则默认数字序号"),
                                    ]),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-stepper", {
                                staticClass: "rightbutton",
                                attrs: {
                                  max: "5",
                                  integer: "",
                                  "button-size": "20px",
                                },
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "imgIndexBitNum",
                                      _vm.imgIndexBitNum
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.imgIndexBitNum,
                                  callback: function ($$v) {
                                    _vm.imgIndexBitNum = $$v
                                  },
                                  expression: "imgIndexBitNum",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "*批量下载章节子文件夹会生成成 #001 / Vol.001 这种格式",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("批量文件夹前缀"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.batchFolderPrefix,
                                    expression: "batchFolderPrefix",
                                  },
                                ],
                                staticClass: "rightbutton",
                                attrs: { type: "text", maxlength: "12" },
                                domProps: { value: _vm.batchFolderPrefix },
                                on: {
                                  blur: _vm.batchFolderPrefixBlur,
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.batchFolderPrefix = $event.target.value
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "原默认设置 1至-1",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("图片下载范围"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right",
                                    "get-container": "#downpart",
                                    offset: [-5, 5],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.imgDownRangeHint = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.imgDownRangeHint = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.imgDownRangeHint,
                                    callback: function ($$v) {
                                      _vm.imgDownRangeHint = $$v
                                    },
                                    expression: "imgDownRangeHint",
                                  },
                                },
                                [
                                  _c("div", [
                                    _c("code", { staticClass: "popovertext" }, [
                                      _vm._v(
                                        "*1至-1 代表从第一张图片下载至最后一张"
                                      ),
                                    ]),
                                    _c("br"),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("div", [
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.imgDownRange[0],
                                      expression: "imgDownRange[0]",
                                    },
                                  ],
                                  staticClass: "img-down-range-input",
                                  attrs: {
                                    type: "number",
                                    min: "1",
                                    onkeyup:
                                      "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                  },
                                  domProps: { value: _vm.imgDownRange[0] },
                                  on: {
                                    blur: _vm.imgDownRangeBlur,
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.imgDownRange,
                                        0,
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                                _vm._v(" "),
                                _c("code", { staticStyle: { width: "10px" } }, [
                                  _vm._v(" - "),
                                ]),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.imgDownRange[1],
                                      expression: "imgDownRange[1]",
                                    },
                                  ],
                                  staticClass: "img-down-range-input",
                                  attrs: {
                                    type: "number",
                                    max: "-1",
                                    onkeyup:
                                      "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                  },
                                  domProps: { value: _vm.imgDownRange[1] },
                                  on: {
                                    blur: _vm.imgDownRangeBlur,
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.imgDownRange,
                                        1,
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "压缩包与元数据", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "可用占位符: [站点名字][作者名][漫画名称][章节名称][章节序号][多少P]",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("压缩包命名模板"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.zipNameTemplate,
                                    expression: "zipNameTemplate",
                                  },
                                ],
                                staticClass: "long-input",
                                attrs: { type: "text" },
                                domProps: { value: _vm.zipNameTemplate },
                                on: {
                                  blur: function ($event) {
                                    return _vm.onChangeData(
                                      "zipNameTemplate",
                                      _vm.zipNameTemplate
                                    )
                                  },
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.zipNameTemplate = $event.target.value
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("写入 ComicInfo.xml"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableComicInfoXml,
                                      "enableComicInfoXml"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.enableComicInfoXml,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableComicInfoXml",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableComicInfoXml",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "输出到漫画目录下，便于 Komga 识别系列信息",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("生成 series.json"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableSeriesJson,
                                      "enableSeriesJson"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.metadataSettings.enableSeriesJson,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableSeriesJson",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableSeriesJson",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "下载系列封面到漫画目录下的 cover.jpg",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("生成系列封面"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableSeriesCover,
                                      "enableSeriesCover"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.metadataSettings.enableSeriesCover,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableSeriesCover",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableSeriesCover",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "下载前尝试从网页解析元数据，先预览并允许手动修改",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("下载前预览元数据"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings
                                        .enableMetadataPreview,
                                      "enableMetadataPreview"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.enableMetadataPreview,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableMetadataPreview",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableMetadataPreview",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "下载前自动用 Bangumi 检索并补全元数据",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("启用 Bangumi 刮削"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.enableBangumiScrape,
                                      "enableBangumiScrape"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.enableBangumiScrape,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "enableBangumiScrape",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.enableBangumiScrape",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "开启后会尝试匹配 NSFW 条目，建议配合 Access Token 使用",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("允许 NSFW 条目"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.bangumiIncludeNsfw,
                                      "bangumiIncludeNsfw"
                                    )
                                  },
                                },
                                model: {
                                  value:
                                    _vm.metadataSettings.bangumiIncludeNsfw,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "bangumiIncludeNsfw",
                                      $$v
                                    )
                                  },
                                  expression:
                                    "metadataSettings.bangumiIncludeNsfw",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label:
                          "可选。填写后可提高 Bangumi API 的稳定性与权限范围",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("Bangumi Access Token"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.metadataSettings.bangumiAccessToken,
                                    expression:
                                      "metadataSettings.bangumiAccessToken",
                                  },
                                ],
                                staticClass: "long-input",
                                attrs: { type: "text" },
                                domProps: {
                                  value:
                                    _vm.metadataSettings.bangumiAccessToken,
                                },
                                on: {
                                  blur: _vm.bangumiTokenBlur,
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "bangumiAccessToken",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("语言 ISO"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.metadataSettings.languageISO,
                                    expression: "metadataSettings.languageISO",
                                  },
                                ],
                                staticClass: "rightbutton",
                                attrs: { type: "text" },
                                domProps: {
                                  value: _vm.metadataSettings.languageISO,
                                },
                                on: {
                                  blur: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.languageISO || "zh",
                                      "languageISO"
                                    )
                                  },
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "languageISO",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("出版社"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.metadataSettings.publisher,
                                    expression: "metadataSettings.publisher",
                                  },
                                ],
                                staticClass: "long-input",
                                attrs: { type: "text" },
                                domProps: {
                                  value: _vm.metadataSettings.publisher,
                                },
                                on: {
                                  blur: function ($event) {
                                    return _vm.onChangeData(
                                      "metadataSettings",
                                      _vm.metadataSettings.publisher,
                                      "publisher"
                                    )
                                  },
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.metadataSettings,
                                      "publisher",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "追更", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("打开页面自动检查"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "followSettings",
                                      _vm.followSettings.autoCheckOnLoad,
                                      "autoCheckOnLoad"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.followSettings.autoCheckOnLoad,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.followSettings,
                                      "autoCheckOnLoad",
                                      $$v
                                    )
                                  },
                                  expression: "followSettings.autoCheckOnLoad",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "避免频繁请求，单位分钟",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("检查冷却时间"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.followSettings.checkCooldownMinutes,
                                    expression:
                                      "followSettings.checkCooldownMinutes",
                                  },
                                ],
                                staticClass: "rightbutton",
                                attrs: {
                                  type: "number",
                                  min: "0",
                                  onkeyup:
                                    "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                },
                                domProps: {
                                  value:
                                    _vm.followSettings.checkCooldownMinutes,
                                },
                                on: {
                                  blur: _vm.followCooldownBlur,
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.followSettings,
                                      "checkCooldownMinutes",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  {
                    attrs: {
                      id: "webpart",
                      title: "原网站阅读样式修改",
                      inset: "",
                    },
                  },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "去除部分漫画网站图片上下间隔",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("图片拼接"),
                              ]),
                              _vm._v(" "),
                              _c(
                                "van-popover",
                                {
                                  attrs: {
                                    placement: "right-start",
                                    "get-container": "#webpart",
                                    offset: [0, 10],
                                    "close-on-click-outside": true,
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "reference",
                                      fn: function () {
                                        return [
                                          _c("van-icon", {
                                            attrs: {
                                              name: "info-o",
                                              color: "red",
                                            },
                                            on: {
                                              mouseover: function ($event) {
                                                _vm.showPopover = true
                                              },
                                              mouseleave: function ($event) {
                                                _vm.showPopover = false
                                              },
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                  model: {
                                    value: _vm.showPopover,
                                    callback: function ($$v) {
                                      _vm.showPopover = $$v
                                    },
                                    expression: "showPopover",
                                  },
                                },
                                [
                                  _c("code", { staticClass: "popovertext" }, [
                                    _vm._v("建议浏览长条漫画时开启"),
                                  ]),
                                ]
                              ),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: { change: _vm.webImgSplicing },
                                model: {
                                  value: _vm.imgSplicingFlag,
                                  callback: function ($$v) {
                                    _vm.imgSplicingFlag = $$v
                                  },
                                  expression: "imgSplicingFlag",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "自定义规则", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "导入规则",
                        "is-link": "",
                        center: "",
                      },
                      on: {
                        click: function ($event) {
                          return _vm.changeSwipe(1)
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "清空导入的规则",
                        "is-link": "",
                        center: "",
                      },
                      on: {
                        click: function ($event) {
                          return _vm.deleteAllUserWeb()
                        },
                      },
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { title: "脚本更新", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("启动时自动检查更新"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("van-checkbox", {
                                staticClass: "rightbutton",
                                on: {
                                  change: function ($event) {
                                    return _vm.onChangeData(
                                      "updateSettings",
                                      _vm.updateSettings.autoCheckOnLoad,
                                      "autoCheckOnLoad"
                                    )
                                  },
                                },
                                model: {
                                  value: _vm.updateSettings.autoCheckOnLoad,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      _vm.updateSettings,
                                      "autoCheckOnLoad",
                                      $$v
                                    )
                                  },
                                  expression: "updateSettings.autoCheckOnLoad",
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: "单位：小时；检查失败后会在较短时间内自动重试",
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("检查间隔"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.updateSettings.checkIntervalHours,
                                    expression:
                                      "updateSettings.checkIntervalHours",
                                  },
                                ],
                                staticClass: "rightbutton",
                                attrs: {
                                  type: "number",
                                  min: "1",
                                  onkeyup:
                                    "value=value.replace(/^(0+)|[^\\d]+/g,'')",
                                },
                                domProps: {
                                  value: _vm.updateSettings.checkIntervalHours,
                                },
                                on: {
                                  blur: _vm.updateIntervalBlur,
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.updateSettings,
                                      "checkIntervalHours",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        label: _vm.getUpdateStatusLabel(),
                        center: "",
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "title",
                          fn: function () {
                            return [
                              _c("span", { staticClass: "custom-title" }, [
                                _vm._v("最近检查状态"),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                        {
                          key: "default",
                          fn: function () {
                            return [
                              _c("span", [
                                _vm._v(_vm._s(_vm.getUpdateStatusText())),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    }),
                    _vm._v(" "),
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "立即检查更新",
                        "is-link": "",
                        center: "",
                      },
                      on: { click: _vm.checkScriptUpdate },
                    }),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "van-cell-group",
                  { attrs: { id: "otherpart", title: "其他", inset: "" } },
                  [
                    _c("van-cell", {
                      attrs: {
                        "title-class": "cellleftvalue",
                        "value-class": "cellrightvalue",
                        title: "脚本反馈/评分",
                        "is-link": "",
                        center: "",
                      },
                      on: {
                        click: function ($event) {
                          return _vm.jump(
                            "https://greasyfork.org/zh-CN/scripts/447819/feedback"
                          )
                        },
                      },
                    }),
                  ],
                  1
                ),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { attrs: { id: "set-bottom" } },
              [
                _c(
                  "van-button",
                  {
                    style: {
                      width: "120px",
                      background: "#ee000055 !important",
                    },
                    attrs: { size: "small", round: "" },
                    on: { click: _vm.allInit },
                  },
                  [_vm._v("全部重置")]
                ),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c(
            "van-swipe-item",
            {
              staticClass: "swipeitem",
              style: { marginBottom: "15px", cursor: "pointer", flex: 1 },
            },
            [
              _c(
                "div",
                [
                  _c(
                    "div",
                    {
                      attrs: { id: "setup-return" },
                      on: {
                        click: function ($event) {
                          return _vm.changeSwipe(0)
                        },
                      },
                    },
                    [
                      _c("van-icon", { attrs: { name: "arrow-left" } }),
                      _vm._v(" 返回\n        "),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.setupOtherPage === 1 ? _c("import-page") : _vm._e(),
                ],
                1
              ),
            ]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var settingvue_type_template_id_234d1526_scoped_true_staticRenderFns = []
settingvue_type_template_id_234d1526_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/setting.vue?vue&type=template&id=234d1526&scoped=true&

// EXTERNAL MODULE: ./src/config/index.js
var config = __webpack_require__(6758);
;// CONCATENATED MODULE: ./src/utils/updater.js
/* eslint-disable no-undef */



const updateSettingsDefault = {
  autoCheckOnLoad: true,
  checkIntervalHours: 12
}

const updateRetryIntervalMinutes = 30

const updateCheckStateDefault = {
  lastCheckAt: 0,
  lastSuccessCheckAt: 0,
  lastFailureCheckAt: 0,
  lastPromptVersion: '',
  lastPromptReleaseKey: '',
  latestVersion: '',
  latestBuildId: '',
  latestDownloadUrl: '',
  latestUpdateUrl: '',
  lastResult: 'idle',
  lastReason: '',
  lastSourceUrl: ''
}

const normalizeString = (value) => typeof value === 'string' ? value.trim() : ''

const uniqueStrings = (values) => {
  const result = []
  const seen = new Set()

  values.forEach((value) => {
    const normalized = normalizeString(value)
    if (!normalized || seen.has(normalized)) {
      return
    }
    seen.add(normalized)
    result.push(normalized)
  })

  return result
}

const getStoredUpdateSettings = () => ({
  ...updateSettingsDefault,
  ...((0,setup/* getStorage */.cF)('updateSettings') || {})
})

const getStoredUpdateCheckState = () => ({
  ...updateCheckStateDefault,
  ...((0,setup/* getStorage */.cF)('updateCheckState') || {})
})

const withCacheBust = (url) => {
  if (!url) {
    return ''
  }
  const joiner = url.includes('?') ? '&' : '?'
  return `${url}${joiner}_=${Date.now()}`
}

const getScriptInfo = () => {
  let scriptInfo = {}
  try {
    scriptInfo = GM_info?.script || {}
  } catch (error) {
    scriptInfo = {}
  }

  return {
    version: normalizeString(scriptInfo.version) || normalizeString(config/* AppReleaseVersion */.W1) || normalizeString(config/* AppVersion */.bF),
    buildId: normalizeString(scriptInfo.build) || normalizeString(scriptInfo.buildId) || normalizeString(config/* AppBuildId */.YQ),
    updateUrl: normalizeString(scriptInfo.updateURL) || normalizeString(scriptInfo.updateUrl) || normalizeString(config/* AppUpdateUrl */.QW),
    downloadUrl: normalizeString(scriptInfo.downloadURL) || normalizeString(scriptInfo.downloadUrl) || normalizeString(config/* AppDownloadUrl */.Hi),
    homepageUrl: normalizeString(scriptInfo.homepageURL) || normalizeString(scriptInfo.homepageUrl) || normalizeString(config/* AppHomepageUrl */.x5),
    supportUrl: normalizeString(scriptInfo.supportURL) || normalizeString(scriptInfo.supportUrl) || normalizeString(config/* AppSupportUrl */.KR)
  }
}

const requestText = (url) => {
  if (!url) {
    return Promise.resolve({
      responseText: '',
      finalUrl: ''
    })
  }

  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: withCacheBust(url),
      timeout: 10 * 1000,
      headers: {
        pragma: 'no-cache',
        'cache-control': 'no-cache'
      },
      onload: (response) => {
        resolve({
          responseText: response?.responseText || '',
          finalUrl: response?.finalUrl || response?.responseURL || url
        })
      },
      onerror: () => resolve({
        responseText: '',
        finalUrl: url
      }),
      ontimeout: () => resolve({
        responseText: '',
        finalUrl: url
      })
    })
  })
}

const parseUserscriptMeta = (content) => {
  const meta = {}
  const lines = String(content || '').split(/\r?\n/)

  for (const line of lines) {
    const matched = line.match(/^\/\/\s*@([^\s]+)\s+(.+?)\s*$/)
    if (matched) {
      meta[matched[1]] = matched[2]
    }
    if (line.includes('// ==/UserScript==')) {
      break
    }
  }

  return meta
}

const toVersionParts = (version) => {
  return normalizeString(version)
    .split(/[.-]/)
    .map((part) => {
      const num = parseInt(part, 10)
      return Number.isNaN(num) ? 0 : num
    })
}

const compareVersions = (currentVersion, nextVersion) => {
  const currentParts = toVersionParts(currentVersion)
  const nextParts = toVersionParts(nextVersion)
  const maxLength = Math.max(currentParts.length, nextParts.length)

  for (let index = 0; index < maxLength; index += 1) {
    const currentPart = currentParts[index] || 0
    const nextPart = nextParts[index] || 0

    if (currentPart < nextPart) {
      return -1
    }
    if (currentPart > nextPart) {
      return 1
    }
  }

  return 0
}

const compareReleaseVersions = (currentVersion, nextVersion, currentBuildId = '', nextBuildId = '') => {
  const versionCompareResult = compareVersions(currentVersion, nextVersion)
  if (versionCompareResult !== 0) {
    return versionCompareResult
  }

  const normalizedCurrentBuildId = normalizeString(currentBuildId)
  const normalizedNextBuildId = normalizeString(nextBuildId)

  if (!normalizedCurrentBuildId || !normalizedNextBuildId) {
    return 0
  }

  return compareVersions(normalizedCurrentBuildId, normalizedNextBuildId)
}

const buildReleaseKey = (version, buildId = '') => {
  const parts = [normalizeString(version), normalizeString(buildId)].filter(Boolean)
  return parts.join('#')
}

const formatReleaseVersion = (version, buildId = '') => {
  const normalizedVersion = normalizeString(version)
  const normalizedBuildId = normalizeString(buildId)

  if (!normalizedVersion) {
    return ''
  }

  if (!normalizedBuildId || normalizedVersion.endsWith(`.${normalizedBuildId}`)) {
    return normalizedVersion
  }

  return `${normalizedVersion}.${normalizedBuildId}`
}

const saveUpdateCheckState = (nextState) => {
  const currentState = getStoredUpdateCheckState()
  ;(0,setup/* setStorage */.po)('updateCheckState', {
    ...currentState,
    ...nextState
  })
}

const rawGithubToJsdelivr = (url) => {
  const matched = normalizeString(url).match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/i)
  if (!matched) {
    return ''
  }

  const [, owner, repo, branch, filePath] = matched
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`
}

const jsdelivrToRawGithub = (url) => {
  const matched = normalizeString(url).match(/^https:\/\/(?:cdn|fastly)\.jsdelivr\.net\/gh\/([^/]+)\/([^@/]+)@([^/]+)\/(.+)$/i)
  if (!matched) {
    return ''
  }

  const [, owner, repo, branch, filePath] = matched
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
}

const swapMetaToUserScriptUrl = (url) => {
  const normalized = normalizeString(url)
  if (!normalized) {
    return ''
  }

  if (/\.meta\.js(?:[?#].*)?$/i.test(normalized)) {
    return normalized.replace(/\.meta\.js(?=($|[?#]))/i, '.user.js')
  }

  return normalized
}

const buildUrlVariants = (url) => uniqueStrings([
  normalizeString(url),
  rawGithubToJsdelivr(url),
  jsdelivrToRawGithub(url)
])

const buildRequestUrlCandidates = (scriptInfo) => uniqueStrings([
  ...buildUrlVariants(scriptInfo.updateUrl),
  ...buildUrlVariants(scriptInfo.downloadUrl)
])

const buildInstallUrlCandidates = (downloadUrl, updateUrl, sourceUrl, homepageUrl) => uniqueStrings([
  ...buildUrlVariants(downloadUrl),
  ...buildUrlVariants(swapMetaToUserScriptUrl(updateUrl)),
  ...buildUrlVariants(swapMetaToUserScriptUrl(sourceUrl)),
  normalizeString(homepageUrl)
])

const fetchMetaFromCandidates = async(candidates) => {
  const triedUrls = []
  let lastReason = 'missing-url'

  for (const candidate of candidates) {
    triedUrls.push(candidate)
    const response = await requestText(candidate)
    const content = normalizeString(response.responseText)

    if (!content) {
      lastReason = 'empty-response'
      continue
    }

    const meta = parseUserscriptMeta(content)
    const latestVersion = normalizeString(meta.version)
    if (!latestVersion) {
      lastReason = 'missing-version'
      continue
    }

    return {
      ok: true,
      meta,
      sourceUrl: candidate,
      finalUrl: response.finalUrl,
      triedUrls
    }
  }

  return {
    ok: false,
    reason: lastReason,
    triedUrls
  }
}

const getMetaField = (meta, fieldName) => {
  const aliasFieldName = fieldName.replace(/URL$/, 'Url')
  return normalizeString(meta[fieldName]) || normalizeString(meta[aliasFieldName])
}

const getPrimaryInstallUrl = (installUrlCandidates, fallbackUrl) => installUrlCandidates[0] || normalizeString(fallbackUrl) || ''

const getRequestFailureMessage = (reason) => {
  const reasonMap = {
    'missing-url': '未配置更新地址',
    'empty-response': '更新源没有返回内容',
    'missing-version': '更新源里没有解析到版本号'
  }

  return reasonMap[reason] || '未知错误'
}

const getAutoCheckSkipReason = (state, intervalMs, retryIntervalMs) => {
  const rawLastCheckAt = Number(state.lastCheckAt || 0)
  const lastFailureCheckAt = Number(state.lastFailureCheckAt || (state.lastResult === 'error' ? rawLastCheckAt : 0))
  const lastSuccessCheckAt = Number(state.lastSuccessCheckAt || (lastFailureCheckAt > 0 ? 0 : rawLastCheckAt))
  const now = Date.now()

  if (lastFailureCheckAt > lastSuccessCheckAt && now - lastFailureCheckAt < retryIntervalMs) {
    return 'retry-cooldown'
  }

  if (lastSuccessCheckAt > 0 && now - lastSuccessCheckAt < intervalMs) {
    return 'cooldown'
  }

  return ''
}

const openUpdatePage = (urls) => {
  const candidates = Array.isArray(urls) ? urls : [urls]
  const targetUrl = candidates.find(url => normalizeString(url))

  if (!targetUrl) {
    return null
  }

  try {
    if (typeof GM_openInTab !== 'undefined') {
      return GM_openInTab(targetUrl, {
        active: true,
        insert: true,
        setParent: true
      })
    }
  } catch (error) {
    console.log('openUpdatePageError: ', error)
  }

  return window.open(targetUrl, '_blank')
}

const fetchLatestScriptVersion = async() => {
  const scriptInfo = getScriptInfo()
  const requestCandidates = buildRequestUrlCandidates(scriptInfo)
  const currentVersion = scriptInfo.version || config/* AppReleaseVersion */.W1 || config/* AppVersion */.bF
  const currentBuildId = scriptInfo.buildId || config/* AppBuildId */.YQ

  if (requestCandidates.length === 0) {
    return {
      ok: false,
      reason: 'missing-url',
      currentVersion,
      currentBuildId,
      triedUrls: []
    }
  }

  const metaResult = await fetchMetaFromCandidates(requestCandidates)
  if (!metaResult.ok) {
    return {
      ok: false,
      reason: metaResult.reason,
      currentVersion,
      currentBuildId,
      triedUrls: metaResult.triedUrls || []
    }
  }

  const meta = metaResult.meta
  const latestVersion = normalizeString(meta.version)
  const latestBuildId = getMetaField(meta, 'build') || getMetaField(meta, 'buildId')
  const updateUrl = getMetaField(meta, 'updateURL') || scriptInfo.updateUrl || metaResult.sourceUrl
  const downloadUrl = getMetaField(meta, 'downloadURL') || scriptInfo.downloadUrl || swapMetaToUserScriptUrl(updateUrl) || metaResult.sourceUrl
  const homepageUrl = getMetaField(meta, 'homepageURL') || scriptInfo.homepageUrl
  const supportUrl = getMetaField(meta, 'supportURL') || scriptInfo.supportUrl
  const installUrlCandidates = buildInstallUrlCandidates(downloadUrl, updateUrl, metaResult.sourceUrl, homepageUrl)
  const releaseCompareResult = compareReleaseVersions(currentVersion, latestVersion, currentBuildId, latestBuildId)

  return {
    ok: true,
    currentVersion,
    currentBuildId,
    currentDisplayVersion: formatReleaseVersion(currentVersion, currentBuildId),
    latestVersion,
    latestBuildId,
    latestDisplayVersion: formatReleaseVersion(latestVersion, latestBuildId),
    hasUpdate: releaseCompareResult < 0,
    releaseKey: buildReleaseKey(latestVersion, latestBuildId),
    updateUrl,
    downloadUrl,
    homepageUrl,
    supportUrl,
    sourceUrl: metaResult.sourceUrl || metaResult.finalUrl || '',
    triedUrls: metaResult.triedUrls || requestCandidates,
    installUrlCandidates,
    installUrl: getPrimaryInstallUrl(installUrlCandidates, downloadUrl || updateUrl || homepageUrl || supportUrl)
  }
}

const notifyLatestVersion = (currentVersion) => {
  window.alert(`${config/* AppName */.lW} 当前已是最新版本（${currentVersion}）。`)
}

const confirmUpdate = (currentVersion, latestVersion) => {
  return window.confirm(
    `${config/* AppName */.lW} 检测到新版本。\n\n当前版本：${currentVersion}\n最新版本：${latestVersion}\n\n是否现在前往更新？`
  )
}

const runScriptUpdateCheck = async({ manual = false } = {}) => {
  if (config/* isDev */.r8) {
    if (manual) {
      window.alert('开发环境下不检查更新。')
    }
    return {
      ok: false,
      skipped: true,
      reason: 'development'
    }
  }

  const settings = getStoredUpdateSettings()
  const state = getStoredUpdateCheckState()
  const intervalHours = Math.max(1, Number(settings.checkIntervalHours) || updateSettingsDefault.checkIntervalHours)
  const intervalMs = intervalHours * 60 * 60 * 1000
  const retryIntervalMs = updateRetryIntervalMinutes * 60 * 1000

  if (!manual) {
    if (!settings.autoCheckOnLoad) {
      return {
        ok: false,
        skipped: true,
        reason: 'disabled'
      }
    }

    const skipReason = getAutoCheckSkipReason(state, intervalMs, retryIntervalMs)
    if (skipReason) {
      return {
        ok: false,
        skipped: true,
        reason: skipReason
      }
    }
  }

  const checkedAt = Date.now()
  const result = await fetchLatestScriptVersion()

  if (!result.ok) {
    saveUpdateCheckState({
      lastCheckAt: checkedAt,
      lastFailureCheckAt: checkedAt,
      lastResult: 'error',
      lastReason: result.reason || '',
      lastSourceUrl: (result.triedUrls && result.triedUrls[0]) || ''
    })

    if (manual) {
      const triedUrlsText = (result.triedUrls || []).slice(0, 3).join('\n')
      const triedSuffix = triedUrlsText ? `\n\n已尝试：\n${triedUrlsText}` : ''
      window.alert(`检查更新失败：${getRequestFailureMessage(result.reason)}。${triedSuffix}`)
    }
    return result
  }

  saveUpdateCheckState({
    lastCheckAt: checkedAt,
    lastSuccessCheckAt: checkedAt,
    lastFailureCheckAt: 0,
    latestVersion: result.latestDisplayVersion || result.latestVersion || '',
    latestBuildId: result.latestBuildId || '',
    latestDownloadUrl: result.downloadUrl || '',
    latestUpdateUrl: result.updateUrl || '',
    lastResult: result.hasUpdate ? 'update-available' : 'up-to-date',
    lastReason: '',
    lastSourceUrl: result.sourceUrl || ''
  })

  if (!result.hasUpdate) {
    if (manual) {
      notifyLatestVersion(result.currentDisplayVersion || result.currentVersion)
    }
    return result
  }

  const latestReleaseKey = result.releaseKey || buildReleaseKey(result.latestVersion, result.latestBuildId)
  const lastPromptReleaseKey = state.lastPromptReleaseKey || state.lastPromptVersion

  if (!manual && lastPromptReleaseKey === latestReleaseKey) {
    return {
      ...result,
      skipped: true,
      reason: 'already-prompted'
    }
  }

  saveUpdateCheckState({
    lastPromptVersion: result.latestVersion,
    lastPromptReleaseKey: latestReleaseKey
  })

  const accepted = confirmUpdate(
    result.currentDisplayVersion || result.currentVersion,
    result.latestDisplayVersion || result.latestVersion
  )
  if (accepted) {
    openUpdatePage(result.installUrlCandidates || [result.installUrl || result.downloadUrl || result.updateUrl || result.homepageUrl || result.supportUrl])
  }

  return {
    ...result,
    accepted
  }
}



;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=template&id=3e5333e4&scoped=true&
var importPagevue_type_template_id_3e5333e4_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "import-page" },
    [
      _c("textarea", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.codeText,
            expression: "codeText",
          },
        ],
        ref: "codeTextarea",
        staticStyle: { resize: "none" },
        style: { width: "97%", height: "92%" },
        attrs: { id: "codeTextarea" },
        domProps: { value: _vm.codeText },
        on: {
          input: function ($event) {
            if ($event.target.composing) {
              return
            }
            _vm.codeText = $event.target.value
          },
        },
      }),
      _vm._v(" "),
      _c(
        "van-button",
        { attrs: { size: "mini" }, on: { click: _vm.getCode } },
        [_vm._v("确定")]
      ),
    ],
    1
  )
}
var importPagevue_type_template_id_3e5333e4_scoped_true_staticRenderFns = []
importPagevue_type_template_id_3e5333e4_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/importPage.vue?vue&type=template&id=3e5333e4&scoped=true&

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=script&lang=js&
var importPagevue_type_script_lang_js_ = __webpack_require__(555);
;// CONCATENATED MODULE: ./src/components/importPage.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_importPagevue_type_script_lang_js_ = (importPagevue_type_script_lang_js_/* default */.Z); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=style&index=0&id=3e5333e4&lang=less&scoped=true&
var importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_ = __webpack_require__(9322);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/importPage.vue?vue&type=style&index=0&id=3e5333e4&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options = {};

importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default */.Z, importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_options);




       /* harmony default export */ const components_importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_ = (importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default */.Z && importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default.locals */.Z.locals ? importPagevue_type_style_index_0_id_3e5333e4_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/importPage.vue?vue&type=style&index=0&id=3e5333e4&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/components/importPage.vue



;


/* normalize component */

var importPage_component = normalizeComponent(
  components_importPagevue_type_script_lang_js_,
  importPagevue_type_template_id_3e5333e4_scoped_true_render,
  importPagevue_type_template_id_3e5333e4_scoped_true_staticRenderFns,
  false,
  null,
  "3e5333e4",
  null
  
)

/* hot reload */
if (false) { var importPage_api; }
importPage_component.options.__file = "src/components/importPage.vue"
/* harmony default export */ const importPage = (importPage_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable no-undef */










/* harmony default export */ const settingvue_type_script_lang_js_ = ({
  name: 'Setting',
  components: {
    importPage: importPage
  },
  data() {
    return {
      appLoadDefault: {
        isShowUI: true,
        loadHotKey: '',
        rightSize: 100,
        centerSize: 100
      },
      appRightSize: 100,
      appCenterSize: 100,
      maxChapterNum: 1,
      maxPictureNum: 2,
      imgIndexBitNum: 3,
      batchFolderPrefix: '#',
      imgDownRange: [1, -1],
      zipNameTemplate: '',
      metadataSettings: { ...metadataSettingsDefault },
      followSettings: {
        autoCheckOnLoad: true,
        checkCooldownMinutes: 30
      },
      updateSettings: {
        autoCheckOnLoad: true,
        checkIntervalHours: 12
      },
      updateCheckState: {
        lastCheckAt: 0,
        lastSuccessCheckAt: 0,
        lastFailureCheckAt: 0,
        lastPromptVersion: '',
        lastPromptReleaseKey: '',
        latestVersion: '',
        latestBuildId: '',
        latestDownloadUrl: '',
        latestUpdateUrl: '',
        lastResult: 'idle',
        lastReason: '',
        lastSourceUrl: ''
      },
      imgSplicingFlag: false,
      //
      downTypePopover: false,
      addZeroHint: false,
      imgDownRangeHint: false,
      showPopover: false,
      showUiPopover: false,
      setupOtherPage: 0,

      showDropDown: false,
      downType: 0,
      maxSplicingHeight: 20000,
      splicingHeightPopover: false,
      dropItem: [
        { Text: '直接下载', value: 0 },
        { Text: '压缩下载', value: 1 },
        { Text: '拼接下载', value: 2, hint: '拼接后单张高度不超过 10000 像素' },
        { Text: '批量下载', value: 3, hint: '创建漫画总文件夹，并在里面按章节生成子文件夹' }
      ]

    }
  },
  mounted() {
    this.getAllData()
    this.$bus.$on('changeSetupFirstPage', () => { this.changeSwipe(0) })
  },
  methods: {
    jump(url) {
      window.open(url, '_blank')
    },
    onChangeData(key, value, key2) {
      (0,setup/* setStorage */.po)(key, value, key2)
    },
    changeRightSize(num) {
      if (num === undefined) {
        num = 100
      }
      const appRightDom = document.getElementById('app-right')
      appRightDom.style.scale = num / 100
      this.onChangeData('appLoadDefault', num, 'rightSize')
    },
    changeCenterSize(num) {
      if (num === undefined) {
        num = 100
      }
      const appRightDom = document.getElementById('search-page')
      appRightDom.style.scale = num / 100
      this.onChangeData('appLoadDefault', num, 'centerSize')
    },
    loadHotKeyChange(obj) {
      if (obj.data) {
        this.appLoadDefault.loadHotKey = obj.data.toUpperCase()
        this.onChangeData('appLoadDefault', this.appLoadDefault.loadHotKey, 'loadHotKey')
      }
    },
    webImgSplicing(value) {
      const splicingimgstyle = document.getElementById('splicingimgstyle')
      if (value === true && comics/* currentComics */.Po && comics/* currentComics.readCssText */.Po.readCssText !== undefined) {
        if (splicingimgstyle) {
          splicingimgstyle.innerText = comics/* currentComics.readCssText */.Po.readCssText
        } else {
          (0,utils/* loadStyle */.Xr)('', 'splicingimgstyle', comics/* currentComics.readCssText */.Po.readCssText)
        }
      } else {
        if (splicingimgstyle) {
          splicingimgstyle.innerText = ''
        }
      }
      this.onChangeData('imgSplicingFlag', value)
    },
    changeSwipe(val) {
      console.log('val: ', val)
      this.$refs.swipe2.swipeTo(val)
      this.setupOtherPage = val
    },
    changeDownType(val) {
      if (this.downType !== val) {
        this.downType = val
        this.onChangeData('downType', val)
      }
    },
    splicingHeightBlur(event) {
      const val = event.currentTarget.value
      if (val < 10000) this.maxSplicingHeight = 10000
      if (val > 65530) this.maxSplicingHeight = 65530
      this.onChangeData('maxSplicingHeight', this.maxSplicingHeight)
    },
    batchFolderPrefixBlur() {
      this.batchFolderPrefix = String(this.batchFolderPrefix || '').trim() || '#'
      this.onChangeData('batchFolderPrefix', this.batchFolderPrefix)
    },
    imgDownRangeBlur() {
      if (this.imgDownRange[0] < 1) this.imgDownRange[0] = 1
      if (this.imgDownRange[1] > -1) this.imgDownRange[1] = -1
      this.imgDownRange = JSON.parse(JSON.stringify(this.imgDownRange))
      this.onChangeData('imgDownRange', this.imgDownRange)
    },
    followCooldownBlur() {
      let value = parseInt(this.followSettings.checkCooldownMinutes || 0)
      if (Number.isNaN(value) || value < 0) {
        value = 0
      }
      this.followSettings.checkCooldownMinutes = value
      this.onChangeData('followSettings', value, 'checkCooldownMinutes')
    },
    updateIntervalBlur() {
      let value = parseInt(this.updateSettings.checkIntervalHours || 0)
      if (Number.isNaN(value) || value < 1) {
        value = 1
      }
      this.updateSettings.checkIntervalHours = value
      this.onChangeData('updateSettings', value, 'checkIntervalHours')
    },
    bangumiTokenBlur() {
      this.metadataSettings.bangumiAccessToken = (this.metadataSettings.bangumiAccessToken || '').trim()
      this.onChangeData('metadataSettings', this.metadataSettings.bangumiAccessToken, 'bangumiAccessToken')
    },
    async checkScriptUpdate() {
      await runScriptUpdateCheck({ manual: true })
      this.syncUpdateCheckState()
    },
    syncUpdateCheckState() {
      this.updateCheckState = {
        ...this.updateCheckState,
        ...getStoredUpdateCheckState()
      }
    },
    formatUpdateTime(timestamp) {
      const value = Number(timestamp || 0)
      if (!value) {
        return '未检查'
      }

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return '未检查'
      }

      const pad = (num) => String(num).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    },
    getUpdateReasonText(reason) {
      const reasonMap = {
        'missing-url': '未配置更新地址',
        'empty-response': '更新源没有返回内容',
        'missing-version': '更新源里没有解析到版本号'
      }

      return reasonMap[reason] || '未知错误'
    },
    getUpdateStatusText() {
      const state = this.updateCheckState || {}

      if (state.lastResult === 'update-available' && state.latestVersion) {
        return `发现新版本 ${state.latestVersion}`
      }

      if (state.lastResult === 'up-to-date') {
        return state.latestVersion ? `已是最新版本 ${state.latestVersion}` : '已是最新版本'
      }

      if (state.lastResult === 'error') {
        return '检查失败'
      }

      return '未检查'
    },
    getUpdateStatusLabel() {
      const state = this.updateCheckState || {}
      const checkedAtText = this.formatUpdateTime(state.lastCheckAt)

      if (state.lastResult === 'error') {
        return `上次检查：${checkedAtText}；失败原因：${this.getUpdateReasonText(state.lastReason)}`
      }

      return `上次检查：${checkedAtText}`
    },
    exeFun(flag, basic) {
      let rightSize = 100; let centerSize = 100
      basic.rightSize ? rightSize = basic.rightSize : ''
      basic.rightSize ? this.appRightSize = basic.rightSize : ''
      this.changeRightSize(rightSize)

      basic.centerSize ? centerSize = basic.centerSize : ''
      basic.centerSize ? this.appCenterSize = basic.centerSize : ''
      this.changeCenterSize(centerSize)

      this.webImgSplicing(flag)
    },
    getAllData() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum') ?? this.maxChapterNum
        this.maxPictureNum = GM_getValue('maxPictureNum') ?? this.maxPictureNum
        this.downType = GM_getValue('downType') ?? this.downType
        this.maxSplicingHeight = GM_getValue('maxSplicingHeight') ?? this.maxSplicingHeight
        this.imgIndexBitNum = GM_getValue('imgIndexBitNum') ?? this.imgIndexBitNum
        this.batchFolderPrefix = GM_getValue('batchFolderPrefix') ?? this.batchFolderPrefix
        this.imgSplicingFlag = GM_getValue('imgSplicingFlag') ?? this.imgSplicingFlag

        this.imgDownRange = GM_getValue('imgDownRange') ?? this.imgDownRange
        this.zipNameTemplate = GM_getValue('zipNameTemplate') ?? this.zipNameTemplate
        if (this.zipNameTemplate === '[站点名字][作者名][漫画名称][章节名称][多少P]P') {
          this.zipNameTemplate = defaultZipNameTemplate
          this.onChangeData('zipNameTemplate', this.zipNameTemplate)
        }
        this.metadataSettings = {
          ...this.metadataSettings,
          ...(GM_getValue('metadataSettings') || {})
        }
        this.followSettings = {
          ...this.followSettings,
          ...(GM_getValue('followSettings') || {})
        }
        this.updateSettings = {
          ...this.updateSettings,
          ...(GM_getValue('updateSettings') || {})
        }
        this.syncUpdateCheckState()
        //
        this.appLoadDefault = {
          ...this.appLoadDefault,
          ...(GM_getValue('appLoadDefault') || {})
        }
      // eslint-disable-next-line no-empty
      } catch (error) {}
      // 获取数据后执行其他方法
      this.exeFun(this.imgSplicingFlag, this.appLoadDefault)
    },
    async allInit() {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: '确认重置'
      })
        .then(() => {
          (0,setup/* setinit */.zU)().then((result) => {
            this.getAllData()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    deleteAllUserWeb() {
      external_vant_.Dialog.confirm({
        getContainer: '.card',
        message: '确认清空'
      })
        .then(() => {
          (0,setup/* setStorage */.po)('userWebInfo', [])
          this.$bus.$emit('getWeb')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
});

;// CONCATENATED MODULE: ./src/views/setting.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_settingvue_type_script_lang_js_ = (settingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=style&index=0&id=234d1526&lang=less&scoped=true&
var settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_ = __webpack_require__(9082);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/setting.vue?vue&type=style&index=0&id=234d1526&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options = {};

settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default */.Z, settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_options);




       /* harmony default export */ const views_settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_ = (settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default */.Z && settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default.locals */.Z.locals ? settingvue_type_style_index_0_id_234d1526_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/setting.vue?vue&type=style&index=0&id=234d1526&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/setting.vue



;


/* normalize component */

var setting_component = normalizeComponent(
  views_settingvue_type_script_lang_js_,
  settingvue_type_template_id_234d1526_scoped_true_render,
  settingvue_type_template_id_234d1526_scoped_true_staticRenderFns,
  false,
  null,
  "234d1526",
  null
  
)

/* hot reload */
if (false) { var setting_api; }
setting_component.options.__file = "src/views/setting.vue"
/* harmony default export */ const setting = (setting_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/metadata.vue?vue&type=template&id=78dd89c9&scoped=true&
var metadatavue_type_template_id_78dd89c9_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "metadata-page" },
    [
      _vm.viewMode === "preview"
        ? [
            _vm.loading
              ? _c(
                  "van-loading",
                  { staticClass: "metadata-loading", attrs: { size: "24px" } },
                  [_vm._v("\n      正在解析网页并整理元数据...\n    ")]
                )
              : _vm.pendingGroups.length === 0
              ? _c(
                  "van-empty",
                  { attrs: { description: "暂无待确认的元数据" } },
                  [
                    _c("p", { staticClass: "metadata-hint" }, [
                      _vm._v(
                        "开启“下载前预览并编辑元数据”后，开始下载时会先进入这里。"
                      ),
                    ]),
                  ]
                )
              : [
                  _c("div", { staticClass: "metadata-top" }, [
                    _c("div", { staticClass: "metadata-top__title" }, [
                      _vm._v(
                        "待确认系列 " + _vm._s(_vm.pendingGroups.length) + " 个"
                      ),
                    ]),
                    _vm._v(" "),
                    _vm.showComicInfoPreview
                      ? _c("div", { staticClass: "metadata-top__desc" }, [
                          _vm._v(
                            "\n          `ComicInfo.xml` 中的 `PageCount` 会在实际下载图片后自动填充，这里先展示其它字段。\n        "
                          ),
                        ])
                      : _vm._e(),
                  ]),
                  _vm._v(" "),
                  _c(
                    "van-collapse",
                    {
                      model: {
                        value: _vm.activeNames,
                        callback: function ($$v) {
                          _vm.activeNames = $$v
                        },
                        expression: "activeNames",
                      },
                    },
                    _vm._l(_vm.pendingGroups, function (group) {
                      return _c(
                        "van-collapse-item",
                        {
                          key: group.key,
                          attrs: { name: group.key },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "title",
                                fn: function () {
                                  return [
                                    _c(
                                      "div",
                                      { staticClass: "metadata-group-title" },
                                      [
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "metadata-group-title__main",
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(group.baseItem.comicName)
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "metadata-group-title__side",
                                          },
                                          [
                                            _c(
                                              "van-tag",
                                              { attrs: { type: "primary" } },
                                              [
                                                _vm._v(
                                                  _vm._s(group.items.length) +
                                                    " 章"
                                                ),
                                              ]
                                            ),
                                          ],
                                          1
                                        ),
                                      ]
                                    ),
                                  ]
                                },
                                proxy: true,
                              },
                            ],
                            null,
                            true
                          ),
                        },
                        [
                          _vm._v(" "),
                          _c(
                            "van-cell-group",
                            { attrs: { inset: "" } },
                            [
                              _c("van-cell", {
                                attrs: {
                                  title: "站点",
                                  value: group.baseItem.webName,
                                },
                              }),
                              _vm._v(" "),
                              _c("van-cell", {
                                attrs: {
                                  title: "样例章节",
                                  value:
                                    group.baseItem.downChapterName ||
                                    group.baseItem.chapterName,
                                },
                              }),
                              _vm._v(" "),
                              _c("van-cell", {
                                attrs: {
                                  title: "来源",
                                  value: group.sourceText || "基础信息",
                                },
                              }),
                              _vm._v(" "),
                              group.error
                                ? _c("van-cell", {
                                    attrs: {
                                      title: "解析提示",
                                      value: group.error,
                                    },
                                  })
                                : _vm._e(),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "metadata-card" },
                            [
                              _c("van-field", {
                                attrs: {
                                  label: "系列名",
                                  placeholder: "系列名",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.seriesTitle,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "seriesTitle", $$v)
                                  },
                                  expression: "group.form.seriesTitle",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: { label: "原标题", placeholder: "可选" },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.originalTitle,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "originalTitle", $$v)
                                  },
                                  expression: "group.form.originalTitle",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  label: "作者",
                                  placeholder: "多个作者用逗号分隔",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.writersText,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "writersText", $$v)
                                  },
                                  expression: "group.form.writersText",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  label: "画师",
                                  placeholder: "多个画师用逗号分隔",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.illustratorsText,
                                  callback: function ($$v) {
                                    _vm.$set(
                                      group.form,
                                      "illustratorsText",
                                      $$v
                                    )
                                  },
                                  expression: "group.form.illustratorsText",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  label: "标签",
                                  placeholder: "多个标签用逗号分隔",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.tagsText,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "tagsText", $$v)
                                  },
                                  expression: "group.form.tagsText",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: { label: "出版社", placeholder: "可选" },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.publisher,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "publisher", $$v)
                                  },
                                  expression: "group.form.publisher",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  type: "number",
                                  label: "总话数",
                                  placeholder: "可选",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.issueCount,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "issueCount", $$v)
                                  },
                                  expression: "group.form.issueCount",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  label: "发布日期",
                                  placeholder: "例如 2024-05-01",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.releaseDate,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "releaseDate", $$v)
                                  },
                                  expression: "group.form.releaseDate",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  label: "状态",
                                  placeholder: "例如 continuing / ended",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.status,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "status", $$v)
                                  },
                                  expression: "group.form.status",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: { label: "分级", placeholder: "可选" },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.ageRating,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "ageRating", $$v)
                                  },
                                  expression: "group.form.ageRating",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  label: "语言",
                                  placeholder: "例如 zh",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.languageISO,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "languageISO", $$v)
                                  },
                                  expression: "group.form.languageISO",
                                },
                              }),
                              _vm._v(" "),
                              _c("van-field", {
                                attrs: {
                                  type: "textarea",
                                  rows: "4",
                                  autosize: "",
                                  label: "简介",
                                  placeholder: "可手动编辑简介",
                                },
                                on: {
                                  input: function ($event) {
                                    return _vm.syncGroupPreview(group)
                                  },
                                },
                                model: {
                                  value: group.form.summary,
                                  callback: function ($$v) {
                                    _vm.$set(group.form, "summary", $$v)
                                  },
                                  expression: "group.form.summary",
                                },
                              }),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("div", { staticClass: "metadata-preview-stack" }, [
                            _vm.showComicInfoPreview
                              ? _c("div", { staticClass: "metadata-card" }, [
                                  _c(
                                    "div",
                                    { staticClass: "metadata-preview-title" },
                                    [_vm._v("ComicInfo.xml 预览")]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "metadata-preview-note" },
                                    [
                                      _vm._v(
                                        "这里展示样例章节，章节名和章节序号仍会按各自下载项写入。"
                                      ),
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "pre",
                                    { staticClass: "metadata-preview" },
                                    [_vm._v(_vm._s(group.preview.comicInfoXml))]
                                  ),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.showSeriesJsonPreview
                              ? _c("div", { staticClass: "metadata-card" }, [
                                  _c(
                                    "div",
                                    { staticClass: "metadata-preview-title" },
                                    [_vm._v("series.json 预览")]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "pre",
                                    { staticClass: "metadata-preview" },
                                    [_vm._v(_vm._s(group.preview.seriesJson))]
                                  ),
                                ])
                              : _vm._e(),
                          ]),
                        ],
                        1
                      )
                    }),
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "metadata-bottom" },
                    [
                      _c(
                        "van-button",
                        {
                          attrs: { round: "" },
                          on: { click: _vm.cancelPreview },
                        },
                        [_vm._v("返回")]
                      ),
                      _vm._v(" "),
                      _c(
                        "van-button",
                        {
                          attrs: {
                            round: "",
                            type: "primary",
                            loading: _vm.submitting,
                          },
                          on: { click: _vm.confirmPreview },
                        },
                        [_vm._v("继续下载")]
                      ),
                    ],
                    1
                  ),
                ],
          ]
        : [
            _vm.standaloneLoading
              ? _c(
                  "van-loading",
                  { staticClass: "metadata-loading", attrs: { size: "24px" } },
                  [_vm._v("\n      正在识别当前页面并生成元数据草稿...\n    ")]
                )
              : !_vm.standaloneContext
              ? _c(
                  "van-empty",
                  {
                    attrs: {
                      description:
                        _vm.standaloneError || "当前页面暂不支持独立生成元数据",
                    },
                  },
                  [
                    _c("p", { staticClass: "metadata-hint" }, [
                      _vm._v(
                        "目前支持 Bangumi 漫画页、BookWalker 单本页，以及 BookWalker 系列页。"
                      ),
                    ]),
                    _vm._v(" "),
                    _c(
                      "van-button",
                      {
                        staticClass: "metadata-empty-btn",
                        attrs: { size: "small", round: "", type: "primary" },
                        on: { click: _vm.refreshStandaloneContext },
                      },
                      [_vm._v("\n        重新识别\n      ")]
                    ),
                  ],
                  1
                )
              : [
                  _c("div", { staticClass: "metadata-top" }, [
                    _c("div", { staticClass: "metadata-top__title" }, [
                      _vm._v("独立生成元数据"),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "metadata-top__desc" }, [
                      _vm._v(
                        _vm._s(_vm.standaloneContext.siteName) +
                          " / " +
                          _vm._s(_vm.getStandalonePageTypeText())
                      ),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c(
                    "van-cell-group",
                    { attrs: { inset: "" } },
                    [
                      _c("van-cell", {
                        attrs: {
                          title: "站点",
                          value: _vm.standaloneContext.siteName,
                        },
                      }),
                      _vm._v(" "),
                      _c("van-cell", {
                        attrs: {
                          title: "页面",
                          value: _vm.standaloneContext.pageTitle,
                        },
                      }),
                      _vm._v(" "),
                      _c("van-cell", {
                        attrs: {
                          title: "链接",
                          value: _vm.standaloneContext.pageUrl,
                        },
                      }),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  !_vm.standalonePrepared
                    ? [
                        _c(
                          "div",
                          { staticClass: "metadata-card" },
                          [
                            _c(
                              "div",
                              { staticClass: "metadata-preview-title" },
                              [_vm._v("生成模式")]
                            ),
                            _vm._v(" "),
                            _c(
                              "van-radio-group",
                              {
                                model: {
                                  value: _vm.standaloneSelectedMode,
                                  callback: function ($$v) {
                                    _vm.standaloneSelectedMode = $$v
                                  },
                                  expression: "standaloneSelectedMode",
                                },
                              },
                              _vm._l(
                                _vm.standaloneContext.modeOptions,
                                function (option) {
                                  return _c("van-cell", {
                                    key: option.value,
                                    attrs: {
                                      clickable: "",
                                      title: option.label,
                                      label: option.description,
                                    },
                                    on: {
                                      click: function ($event) {
                                        _vm.standaloneSelectedMode =
                                          option.value
                                      },
                                    },
                                    scopedSlots: _vm._u(
                                      [
                                        {
                                          key: "right-icon",
                                          fn: function () {
                                            return [
                                              _c("van-radio", {
                                                attrs: { name: option.value },
                                              }),
                                            ]
                                          },
                                          proxy: true,
                                        },
                                      ],
                                      null,
                                      true
                                    ),
                                  })
                                }
                              ),
                              1
                            ),
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "metadata-bottom" },
                          [
                            _c(
                              "van-button",
                              {
                                attrs: { round: "" },
                                on: { click: _vm.refreshStandaloneContext },
                              },
                              [_vm._v("刷新页面")]
                            ),
                            _vm._v(" "),
                            _c(
                              "van-button",
                              {
                                attrs: { round: "", type: "primary" },
                                on: { click: _vm.prepareStandalonePreview },
                              },
                              [_vm._v("预览生成")]
                            ),
                          ],
                          1
                        ),
                      ]
                    : [
                        _c(
                          "div",
                          { staticClass: "metadata-card" },
                          [
                            _vm.showStandaloneEntryFields
                              ? _c("van-field", {
                                  attrs: {
                                    label: "条目名",
                                    placeholder: "单本标题",
                                  },
                                  on: { input: _vm.syncStandalonePreview },
                                  model: {
                                    value: _vm.standaloneForm.entryTitle,
                                    callback: function ($$v) {
                                      _vm.$set(
                                        _vm.standaloneForm,
                                        "entryTitle",
                                        $$v
                                      )
                                    },
                                    expression: "standaloneForm.entryTitle",
                                  },
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.showStandaloneEntryFields
                              ? _c("van-field", {
                                  attrs: {
                                    label: "册号",
                                    placeholder: "例如 06",
                                  },
                                  on: { input: _vm.syncStandalonePreview },
                                  model: {
                                    value: _vm.standaloneForm.entryNumber,
                                    callback: function ($$v) {
                                      _vm.$set(
                                        _vm.standaloneForm,
                                        "entryNumber",
                                        $$v
                                      )
                                    },
                                    expression: "standaloneForm.entryNumber",
                                  },
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: { label: "系列名", placeholder: "系列名" },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.seriesTitle,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "seriesTitle",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.seriesTitle",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: { label: "原标题", placeholder: "可选" },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.originalTitle,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "originalTitle",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.originalTitle",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                label: "作者",
                                placeholder: "多个作者用逗号分隔",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.writersText,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "writersText",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.writersText",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                label: "画师",
                                placeholder: "多个画师用逗号分隔",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.illustratorsText,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "illustratorsText",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.illustratorsText",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                label: "标签",
                                placeholder: "多个标签用逗号分隔",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.tagsText,
                                callback: function ($$v) {
                                  _vm.$set(_vm.standaloneForm, "tagsText", $$v)
                                },
                                expression: "standaloneForm.tagsText",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: { label: "出版社", placeholder: "可选" },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.publisher,
                                callback: function ($$v) {
                                  _vm.$set(_vm.standaloneForm, "publisher", $$v)
                                },
                                expression: "standaloneForm.publisher",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                type: "number",
                                label: "总册数",
                                placeholder: "可选",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.issueCount,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "issueCount",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.issueCount",
                              },
                            }),
                            _vm._v(" "),
                            _vm.showStandalonePageCountField
                              ? _c("van-field", {
                                  attrs: {
                                    type: "number",
                                    label: "页数",
                                    placeholder: "可选",
                                  },
                                  on: { input: _vm.syncStandalonePreview },
                                  model: {
                                    value: _vm.standaloneForm.pageCount,
                                    callback: function ($$v) {
                                      _vm.$set(
                                        _vm.standaloneForm,
                                        "pageCount",
                                        $$v
                                      )
                                    },
                                    expression: "standaloneForm.pageCount",
                                  },
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.showStandaloneIsbnField
                              ? _c("van-field", {
                                  attrs: { label: "ISBN", placeholder: "可选" },
                                  on: { input: _vm.syncStandalonePreview },
                                  model: {
                                    value: _vm.standaloneForm.isbn,
                                    callback: function ($$v) {
                                      _vm.$set(_vm.standaloneForm, "isbn", $$v)
                                    },
                                    expression: "standaloneForm.isbn",
                                  },
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                label: "发布日期",
                                placeholder: "例如 2026-05-07",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.releaseDate,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "releaseDate",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.releaseDate",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                label: "状态",
                                placeholder: "例如 continuing / ended",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.status,
                                callback: function ($$v) {
                                  _vm.$set(_vm.standaloneForm, "status", $$v)
                                },
                                expression: "standaloneForm.status",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: { label: "分级", placeholder: "可选" },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.ageRating,
                                callback: function ($$v) {
                                  _vm.$set(_vm.standaloneForm, "ageRating", $$v)
                                },
                                expression: "standaloneForm.ageRating",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: { label: "语言", placeholder: "例如 zh" },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.languageISO,
                                callback: function ($$v) {
                                  _vm.$set(
                                    _vm.standaloneForm,
                                    "languageISO",
                                    $$v
                                  )
                                },
                                expression: "standaloneForm.languageISO",
                              },
                            }),
                            _vm._v(" "),
                            _c("van-field", {
                              attrs: {
                                type: "textarea",
                                rows: "5",
                                autosize: "",
                                label: "简介",
                                placeholder: "可手动编辑简介",
                              },
                              on: { input: _vm.syncStandalonePreview },
                              model: {
                                value: _vm.standaloneForm.summary,
                                callback: function ($$v) {
                                  _vm.$set(_vm.standaloneForm, "summary", $$v)
                                },
                                expression: "standaloneForm.summary",
                              },
                            }),
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "metadata-preview-stack" },
                          _vm._l(_vm.standalonePreviewFiles, function (file) {
                            return _c(
                              "div",
                              { key: file.key, staticClass: "metadata-card" },
                              [
                                _c(
                                  "div",
                                  { staticClass: "metadata-preview-title" },
                                  [_vm._v(_vm._s(file.name) + " 预览")]
                                ),
                                _vm._v(" "),
                                _c("pre", { staticClass: "metadata-preview" }, [
                                  _vm._v(_vm._s(file.content)),
                                ]),
                              ]
                            )
                          }),
                          0
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "metadata-bottom" },
                          [
                            _c(
                              "van-button",
                              {
                                attrs: { round: "" },
                                on: {
                                  click: function ($event) {
                                    _vm.standalonePrepared = false
                                  },
                                },
                              },
                              [_vm._v("返回")]
                            ),
                            _vm._v(" "),
                            _c(
                              "van-button",
                              {
                                attrs: {
                                  round: "",
                                  type: "primary",
                                  loading: _vm.standaloneSubmitting,
                                },
                                on: { click: _vm.generateStandaloneFiles },
                              },
                              [_vm._v("生成文件")]
                            ),
                          ],
                          1
                        ),
                      ],
                ],
          ],
    ],
    2
  )
}
var metadatavue_type_template_id_78dd89c9_scoped_true_staticRenderFns = []
metadatavue_type_template_id_78dd89c9_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/metadata.vue?vue&type=template&id=78dd89c9&scoped=true&

;// CONCATENATED MODULE: ./src/utils/siteMetadata.js



const multiValueSplitReg = /[,\uff0c/\u3001|]/g
const statusFinishedReg = /(完结|完結|已完结|已完結|finished|completed|complete)/i
const statusOngoingReg = /(连载|連載|连载中|連載中|ongoing|seriali[sz]ing)/i

const siteMetadata_uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const siteMetadata_toText = (value) => {
  if (value === undefined || value === null) {
    return ''
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return (0,utils/* trimSpecial */.Sc)(String(value)).trim()
  }
  if (Array.isArray(value)) {
    return value.map(item => siteMetadata_toText(item)).filter(Boolean).join(' / ')
  }
  if (typeof value === 'object') {
    return siteMetadata_toText(value.name || value.text || value.value || value['@value'] || '')
  }
  return ''
}

const getDomText = (root, selector) => {
  try {
    const dom = root.querySelector(selector)
    if (!dom) {
      return ''
    }
    return (0,utils/* trimSpecial */.Sc)((dom.innerText || dom.textContent || '').trim())
  } catch (error) {
    return ''
  }
}

const getMetaContent = (root, selectors = []) => {
  for (let i = 0; i < selectors.length; i++) {
    const value = getDomText(root, selectors[i])
    if (value) {
      return value
    }
    try {
      const dom = root.querySelector(selectors[i])
      const content = (0,utils/* trimSpecial */.Sc)(dom?.getAttribute('content') || '').trim()
      if (content) {
        return content
      }
    } catch (error) {
      //
    }
  }
  return ''
}

const safeParseJson = (text) => {
  try {
    return JSON.parse(text)
  } catch (error) {
    return null
  }
}

const flattenJsonLd = (value) => {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value.flatMap(item => flattenJsonLd(item))
  }
  if (typeof value === 'object' && Array.isArray(value['@graph'])) {
    return flattenJsonLd(value['@graph'])
  }
  if (typeof value === 'object') {
    return [value]
  }
  return []
}

const getJsonLdNodes = (root) => {
  const nodeList = []
  try {
    root.querySelectorAll('script[type="application/ld+json"]').forEach((item) => {
      const parsed = safeParseJson(item.textContent || item.innerText || '')
      nodeList.push(...flattenJsonLd(parsed))
    })
  } catch (error) {
    //
  }
  return nodeList
}

const pickJsonLdField = (root, fieldNames = []) => {
  const nodeList = getJsonLdNodes(root)
  for (let i = 0; i < nodeList.length; i++) {
    const item = nodeList[i]
    for (let j = 0; j < fieldNames.length; j++) {
      const value = siteMetadata_toText(item?.[fieldNames[j]])
      if (value) {
        return value
      }
    }
  }
  return ''
}

const parseListText = (value) => {
  if (Array.isArray(value)) {
    return siteMetadata_uniqList(value.map(item => (0,utils/* trimSpecial */.Sc)(String(item || '')).trim()).filter(Boolean))
  }
  return siteMetadata_uniqList(String(value || '')
    .split(multiValueSplitReg)
    .map(item => (0,utils/* trimSpecial */.Sc)(item).trim())
    .filter(Boolean))
}

const stripLabelPrefix = (value, labels = []) => {
  let text = (0,utils/* trimSpecial */.Sc)(String(value || '')).trim()
  labels.forEach((label) => {
    const reg = new RegExp(`^${label}\\s*[：:|/-]?\\s*`, 'i')
    text = text.replace(reg, '')
  })
  return text.trim()
}

const getCandidateTextList = (root) => {
  const result = []
  try {
    root.querySelectorAll('p, div, span, li, dd, dt, td, th, strong').forEach((item) => {
      const text = (0,utils/* trimSpecial */.Sc)((item.innerText || item.textContent || '').trim())
      if (!text || text.length < 2 || text.length > 300) {
        return
      }
      result.push(text)
    })
  } catch (error) {
    //
  }
  return siteMetadata_uniqList(result)
}

const findLabeledValue = (root, labels = []) => {
  const textList = getCandidateTextList(root)
  for (let i = 0; i < textList.length; i++) {
    const line = textList[i]
    for (let j = 0; j < labels.length; j++) {
      const label = labels[j]
      const exactReg = new RegExp(`^${label}\\s*[：:|/-]?\\s*(.+)$`, 'i')
      const match = line.match(exactReg)
      if (match?.[1]) {
        return (0,utils/* trimSpecial */.Sc)(match[1]).trim()
      }
    }
  }
  return ''
}

const pickLongText = (root, selectors = []) => {
  for (let i = 0; i < selectors.length; i++) {
    const text = getDomText(root, selectors[i])
    if (text && text.length >= 12) {
      return text
    }
  }
  return ''
}

const normalizeStatus = (value) => {
  const text = (0,utils/* trimSpecial */.Sc)(String(value || '')).trim()
  if (!text) {
    return ''
  }
  if (statusFinishedReg.test(text)) {
    return 'ended'
  }
  if (statusOngoingReg.test(text)) {
    return 'continuing'
  }
  return text
}

const normalizeDateText = (value) => {
  const text = (0,utils/* trimSpecial */.Sc)(String(value || '')).trim()
  if (!text) {
    return ''
  }
  const match = text.match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return ''
  }
  const year = match[1]
  const month = match[2] ? String(parseInt(match[2])) : ''
  const day = match[3] ? String(parseInt(match[3])) : ''
  return [year, month, day].filter(Boolean).join('-')
}

const guessLanguageISO = (root) => {
  const langText = (0,utils/* trimSpecial */.Sc)(root?.documentElement?.lang || root?.lang || '').trim().toLowerCase()
  if (!langText) {
    return ''
  }
  const match = langText.match(/[a-z]{2,3}/)
  return match ? match[0] : ''
}

const getSummary = (root) => {
  const selectorValue = pickLongText(root, [
    '[itemprop="description"]',
    '[property="og:description"]',
    '[name="description"]',
    '[name="twitter:description"]',
    '[class*="summary" i]',
    '[id*="summary" i]',
    '[class*="intro" i]',
    '[id*="intro" i]',
    '[class*="description" i]',
    '[id*="description" i]'
  ])
  if (selectorValue) {
    return stripLabelPrefix(selectorValue, ['简介', '簡介', 'description', 'summary', 'intro'])
  }
  const metaValue = getMetaContent(root, [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]'
  ])
  if (metaValue) {
    return metaValue
  }
  const labeledValue = findLabeledValue(root, ['简介', '簡介', 'description', 'summary', 'intro'])
  return stripLabelPrefix(labeledValue, ['简介', '簡介', 'description', 'summary', 'intro'])
}

const getTags = (root) => {
  const keywordText = getMetaContent(root, [
    'meta[name="keywords"]',
    'meta[property="book:tag"]'
  ])
  if (keywordText) {
    const list = parseListText(keywordText).filter(item => item.length <= 20)
    if (list.length > 0) {
      return list
    }
  }

  const taggedValue = findLabeledValue(root, ['标签', '標籤', '题材', '題材', '类型', '類型', '分类', '分類', 'genre', 'tag'])
  if (taggedValue) {
    return parseListText(taggedValue)
  }

  const jsonLdGenre = pickJsonLdField(root, ['genre', 'keywords'])
  return parseListText(jsonLdGenre)
}

const siteMetadata_getPublisher = (root) => {
  return findLabeledValue(root, ['出版社', '连载杂志', '連載雜誌', 'label', 'publisher']) ||
    pickJsonLdField(root, ['publisher'])
}

const getStatus = (root) => {
  const labeledStatus = findLabeledValue(root, ['状态', '狀態', '连载状态', '連載狀態', 'status'])
  if (labeledStatus) {
    return normalizeStatus(labeledStatus)
  }
  const textList = getCandidateTextList(root)
  const joinedText = textList.slice(0, 80).join(' ')
  const inferredStatus = normalizeStatus(joinedText)
  if (inferredStatus === 'ended' || inferredStatus === 'continuing') {
    return inferredStatus
  }
  return ''
}

const getReleaseDate = (root) => {
  const metaDate = getMetaContent(root, [
    'meta[property="article:published_time"]',
    'meta[property="og:novel:update_time"]',
    'meta[itemprop="datePublished"]'
  ])
  if (metaDate) {
    return normalizeDateText(metaDate)
  }

  const labeledValue = findLabeledValue(root, ['年份', '出版日期', '发布时间', '發佈時間', 'date', 'year'])
  if (labeledValue) {
    return normalizeDateText(labeledValue)
  }

  const jsonLdDate = pickJsonLdField(root, ['datePublished', 'dateCreated', 'dateModified'])
  return normalizeDateText(jsonLdDate)
}

const extractWebMetadataFromRoot = (root, webRule, pageUrl, downloadItem = {}) => {
  const { comicName, authorName } = (0,comics/* getCurrentComicMeta */.lb)(webRule, root)
  const jsonLdAuthor = pickJsonLdField(root, ['author', 'creator'])
  const summary = getSummary(root)
  const tags = getTags(root)
  const publisher = siteMetadata_getPublisher(root)
  const status = getStatus(root)
  const releaseDate = getReleaseDate(root)
  const languageISO = guessLanguageISO(root)

  return {
    source: 'WebPage',
    seriesTitle: comicName || downloadItem.comicName || '',
    originalTitle: comicName || downloadItem.comicName || '',
    summary,
    writers: siteMetadata_uniqList([authorName, jsonLdAuthor].filter(Boolean)),
    illustrators: [],
    tags,
    publisher,
    issueCount: downloadItem.seriesChapterCount || undefined,
    releaseDate,
    status,
    ageRating: '',
    languageISO,
    subjectUrl: pageUrl || downloadItem.comicPageUrl || downloadItem.url || ''
  }
}

const getWebMetadata = async(downloadItem) => {
  const pageUrl = downloadItem?.comicPageUrl || downloadItem?.url || window.location.href
  const webRule = (0,comics/* findWebByUrl */.jL)(pageUrl)
  if (!pageUrl || !webRule) {
    return null
  }

  if (typeof webRule.getMetadata === 'function') {
    try {
      const metadata = await webRule.getMetadata(downloadItem)
      if (metadata) {
        return metadata
      }
    } catch (error) {
      console.log('getWebMetadata-custom-e: ', error)
    }
  }

  if (window.location.href === pageUrl) {
    return extractWebMetadataFromRoot(document, webRule, pageUrl, downloadItem)
  }

  /*
  /*
  /*
  const responseText = await requestTextWithGuard({
    method: 'get',
    url: pageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule.webName || 'Web'} 页面元数据`
  })
  const root = parseToDOM(responseText)
  return extractWebMetadataFromRoot(root, webRule, pageUrl, downloadItem)
  */
  /*
  const responseText = await requestTextWithGuard({
    method: 'get',
    url: pageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule.webName || 'Web'} 页面元数据`
  })
  const root = parseToDOM(responseText)
  return extractWebMetadataFromRoot(root, webRule, pageUrl, downloadItem)
  */
  const responseText = await (0,comics/* requestTextWithGuard */.HN)({
    method: 'get',
    url: pageUrl,
    headers: webRule.headers || '',
    purpose: `${webRule.webName || 'Web'} metadata`
  })
  const root = (0,utils/* parseToDOM */.U3)(responseText)
  return extractWebMetadataFromRoot(root, webRule, pageUrl, downloadItem)
}

;// CONCATENATED MODULE: ./src/utils/standaloneMetadata.js



const bangumiHostReg = /(^|\.)((bgm|bangumi)\.tv|chii\.in)$/i
const bookwalkerHostReg = /(^|\.)bookwalker\.com\.tw$/i
const bookwalkerProductPathReg = /^\/product\/\d+/i
const bookwalkerSearchPathReg = /^\/search/i

const modeMetaMap = {
  'bangumi-single': {
    value: 'bangumi-single',
    label: 'Bangumi 单本元数据',
    description: '生成 ComicInfo.xml',
    outputText: 'ComicInfo.xml'
  },
  'bookwalker-book': {
    value: 'bookwalker-book',
    label: 'BookWalker 单本元数据',
    description: '生成 ComicInfo.xml',
    outputText: 'ComicInfo.xml'
  },
  'bookwalker-series': {
    value: 'bookwalker-series',
    label: 'BookWalker 系列元数据',
    description: '生成 Komga `series.json`，并额外生成 `comic.xml`',
    outputText: 'series.json + comic.xml'
  }
}

const standaloneMetadata_normalizeText = (value) => {
  return (0,utils/* trimSpecial */.Sc)(String(value || ''))
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const escapeReg = (value = '') => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const standaloneMetadata_uniqList = (list = []) => {
  return [...new Set((list || []).filter(Boolean))]
}

const toTextList = (value) => {
  if (Array.isArray(value)) {
    return standaloneMetadata_uniqList(value.map(item => standaloneMetadata_normalizeText(item)).filter(Boolean))
  }
  return standaloneMetadata_uniqList(String(value || '')
    .split(/[、,，/／|｜\n]+/g)
    .map(item => standaloneMetadata_normalizeText(item))
    .filter(Boolean))
}

const standaloneMetadata_parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const match = String(value).match(/(\d+(?:\.\d+)?)/)
  if (!match) {
    return undefined
  }
  const numberValue = Number(match[1])
  return Number.isFinite(numberValue) ? numberValue : undefined
}

const standaloneMetadata_normalizeDateText = (value) => {
  const text = standaloneMetadata_normalizeText(value)
  if (!text) {
    return ''
  }
  const match = text.match(/(\d{4})(?:[-/.年](\d{1,2}))?(?:[-/.月](\d{1,2}))?/)
  if (!match) {
    return ''
  }
  const year = match[1]
  const month = match[2] ? String(parseInt(match[2], 10)).padStart(2, '0') : ''
  const day = match[3] ? String(parseInt(match[3], 10)).padStart(2, '0') : ''
  return [year, month, day].filter(Boolean).join('-')
}

const stripCountSuffix = (value) => {
  return standaloneMetadata_normalizeText(String(value || '').replace(/\s*\(\d+\)\s*$/, ''))
}

const parseCountSuffix = (value) => {
  const match = String(value || '').match(/\((\d+)\)\s*$/)
  return match ? parseInt(match[1], 10) : undefined
}

const getText = (root, selector) => {
  try {
    const node = root?.querySelector(selector)
    return standaloneMetadata_normalizeText(node?.innerText || node?.textContent || '')
  } catch (error) {
    return ''
  }
}

const getTextList = (root, selector) => {
  try {
    return standaloneMetadata_uniqList([...root.querySelectorAll(selector)]
      .map(node => standaloneMetadata_normalizeText(node?.innerText || node?.textContent || ''))
      .filter(Boolean))
  } catch (error) {
    return []
  }
}

const getCanonicalUrl = (root, pageUrl) => {
  const canonicalUrl = root?.querySelector?.('link[rel="canonical"]')?.getAttribute('href') || ''
  return canonicalUrl || pageUrl || window.location.href
}

const getHostname = (pageUrl = '') => {
  try {
    return new URL(pageUrl || window.location.href).hostname
  } catch (error) {
    return window.location.hostname
  }
}

const getPathname = (pageUrl = '') => {
  try {
    return new URL(pageUrl || window.location.href).pathname
  } catch (error) {
    return window.location.pathname
  }
}

const getSearchParam = (pageUrl = '', key = '') => {
  try {
    return new URL(pageUrl || window.location.href).searchParams.get(key) || ''
  } catch (error) {
    return ''
  }
}

const getBookwalkerEntryNumber = (entryTitle = '', seriesTitle = '') => {
  const titleText = standaloneMetadata_normalizeText(entryTitle)
  const seriesText = standaloneMetadata_normalizeText(seriesTitle)
  const shortTitle = seriesText ? titleText.replace(seriesText, '').trim() : titleText
  const regList = [
    /(?:\(|（|第)\s*(\d+(?:\.\d+)?)\s*(?:\)|）|冊|卷|巻|集)/,
    /(\d+(?:\.\d+)?)(?!.*\d)/
  ]

  for (let i = 0; i < regList.length; i++) {
    const match = shortTitle.match(regList[i]) || titleText.match(regList[i])
    if (match?.[1]) {
      return match[1]
    }
  }
  return ''
}

const getBookwalkerFieldMap = (root) => {
  const map = {}
  root.querySelectorAll('.product-detail-info-item, .product-basic-info-item').forEach((item) => {
    const key = standaloneMetadata_normalizeText(
      item.querySelector('.product-detail-info-item-title, .product-basic-info-item-title')?.textContent || ''
    )
    if (!key) {
      return
    }

    let value = ''
    if (/標籤/.test(key)) {
      value = getTextList(item, '.label-text').join(', ')
    } else {
      value = standaloneMetadata_normalizeText(
        item.querySelector('.product-detail-info-item-value, .product-basic-info-item-string, .product-basic-info-item-label')?.innerText ||
        item.querySelector('.product-detail-info-item-value, .product-basic-info-item-string, .product-basic-info-item-label')?.textContent ||
        ''
      )
    }

    if (value && !map[key]) {
      map[key] = value
    }
  })
  return map
}

const getBookwalkerSeriesCount = (root) => {
  const subtitleText = getText(root, '.product-series-subtitle')
  const subtitleCount = standaloneMetadata_parseOptionalNumber(subtitleText)
  if (subtitleCount) {
    return subtitleCount
  }

  const cardCount = getTextList(root, '.product-card-name').length
  if (cardCount > 0) {
    return cardCount
  }

  return undefined
}

const getBookwalkerSeriesTitles = (root) => {
  return getTextList(root, '.product-card-name')
}

const getBookwalkerSeriesSubjectUrl = (root, pageUrl) => {
  const breadcrumbUrl = root.querySelector('.breadcrumb a[href*="series="]')?.getAttribute('href') || ''
  return breadcrumbUrl || getCanonicalUrl(root, pageUrl)
}

const buildBookwalkerProductBookDraft = (root, pageUrl) => {
  const fieldMap = getBookwalkerFieldMap(root)
  const entryTitle = getText(root, '.product-basic-info-name') || standaloneMetadata_normalizeText(document.title)
  const seriesTitle = fieldMap['系列'] || entryTitle
  const summary = getText(root, '#product-content .product-content-introduction')

  return normalizeStandaloneMetadataDraft({
    source: 'BookWalker',
    seriesTitle,
    originalTitle: seriesTitle,
    entryTitle,
    entryNumber: getBookwalkerEntryNumber(entryTitle, seriesTitle),
    summary,
    writers: toTextList(fieldMap['作者']),
    illustrators: toTextList(fieldMap['插畫']),
    tags: getTextList(root, '.product-basic-info-item-label .label-text'),
    publisher: fieldMap['出版社'] || '',
    issueCount: getBookwalkerSeriesCount(root),
    releaseDate: standaloneMetadata_normalizeDateText(fieldMap['發售日']),
    languageISO: 'zh',
    subjectUrl: getCanonicalUrl(root, pageUrl),
    pageCount: standaloneMetadata_parseOptionalNumber(fieldMap['頁數']),
    isbn: fieldMap.ISBN || ''
  })
}

const buildBookwalkerProductSeriesDraft = (root, pageUrl) => {
  const fieldMap = getBookwalkerFieldMap(root)
  const seriesTitle = fieldMap['系列'] || getText(root, '.product-series-title') || getText(root, '.product-basic-info-name')
  const summary = getText(root, '#product-content .product-content-introduction')

  return normalizeStandaloneMetadataDraft({
    source: 'BookWalker',
    seriesTitle,
    originalTitle: seriesTitle,
    summary,
    writers: toTextList(fieldMap['作者']),
    illustrators: toTextList(fieldMap['插畫']),
    tags: getTextList(root, '.product-basic-info-item-label .label-text'),
    publisher: fieldMap['出版社'] || '',
    issueCount: getBookwalkerSeriesCount(root) || getBookwalkerSeriesTitles(root).length,
    releaseDate: standaloneMetadata_normalizeDateText(fieldMap['發售日']),
    languageISO: 'zh',
    subjectUrl: getBookwalkerSeriesSubjectUrl(root, pageUrl)
  })
}

const getBookwalkerSearchSeriesAnchor = (root, pageUrl) => {
  const currentSeriesId = getSearchParam(pageUrl, 'series')
  const anchorList = [...root.querySelectorAll('#search_series_ten a[href*="series="], #series_get_more a[href*="series="]')]
  if (currentSeriesId) {
    const matchedAnchor = anchorList.find(anchor => String(anchor.getAttribute('href') || '').includes(`series=${currentSeriesId}`))
    if (matchedAnchor) {
      return matchedAnchor
    }
  }
  return anchorList[0] || null
}

const buildBookwalkerSearchSeriesDraft = (root, pageUrl) => {
  const seriesAnchor = getBookwalkerSearchSeriesAnchor(root, pageUrl)
  const seriesText = standaloneMetadata_normalizeText(seriesAnchor?.innerText || '')
  const seriesTitle = stripCountSuffix(seriesText) || standaloneMetadata_normalizeText(getSearchParam(pageUrl, 'w'))
  const firstAuthorText = getText(root, '.booknamesub')
  const categoryList = getTextList(root, '.cat-label')

  return normalizeStandaloneMetadataDraft({
    source: 'BookWalker Search',
    seriesTitle,
    originalTitle: seriesTitle,
    summary: '',
    writers: getTextList(root, '#search_author_ten a, #author_get_more a').map(stripCountSuffix).filter(Boolean).length > 0
      ? getTextList(root, '#search_author_ten a, #author_get_more a').map(stripCountSuffix).filter(Boolean)
      : toTextList(firstAuthorText),
    illustrators: [],
    tags: categoryList,
    publisher: stripCountSuffix(getText(root, '#search_vendor_ten a, #vendor_get_more a')),
    issueCount: parseCountSuffix(seriesText) || getTextList(root, '.bookitem .bookname').length || undefined,
    releaseDate: '',
    languageISO: 'zh',
    subjectUrl: seriesAnchor?.getAttribute('href') || getCanonicalUrl(root, pageUrl)
  })
}

const getBangumiInfoboxMap = (root) => {
  const map = {}
  root.querySelectorAll('#infobox li').forEach((item) => {
    const keyText = standaloneMetadata_normalizeText(item.querySelector('.tip')?.textContent || '').replace(/[:：]\s*$/, '')
    if (!keyText) {
      return
    }
    const rawText = standaloneMetadata_normalizeText(item.innerText || item.textContent || '')
    const valueText = standaloneMetadata_normalizeText(rawText.replace(new RegExp(`^${escapeReg(keyText)}\\s*[:：]?\\s*`), ''))
    if (!valueText) {
      return
    }
    if (!map[keyText]) {
      map[keyText] = []
    }
    map[keyText].push(valueText)
  })
  return map
}

const getBangumiInfoboxValue = (infoboxMap, keys = []) => {
  for (let i = 0; i < keys.length; i++) {
    const list = infoboxMap[keys[i]]
    if (Array.isArray(list) && list.length > 0) {
      return list[0]
    }
  }
  return ''
}

const getBangumiReleaseDate = (infoboxMap) => {
  const keyList = ['发售日', '發售日', '其他发售日', '其他發售日']
  for (let i = 0; i < keyList.length; i++) {
    const valueList = infoboxMap[keyList[i]] || []
    for (let j = 0; j < valueList.length; j++) {
      const dateText = standaloneMetadata_normalizeDateText(valueList[j])
      if (dateText) {
        return dateText
      }
    }
  }
  return ''
}

const buildBangumiSingleDraft = (root, pageUrl) => {
  const infoboxMap = getBangumiInfoboxMap(root)
  const originalTitle = getText(root, '#headerSubject h1 a') || getText(root, '.nameSingle a') || standaloneMetadata_normalizeText(document.title)
  const seriesTitle = getBangumiInfoboxValue(infoboxMap, ['中文名']) || originalTitle
  const tagList = standaloneMetadata_uniqList(
    [...root.querySelectorAll('.subject_tag_section .inner a')]
      .map(item => standaloneMetadata_normalizeText(item.querySelector('span')?.textContent || item.textContent || ''))
      .filter(Boolean)
  )

  return normalizeStandaloneMetadataDraft({
    source: 'Bangumi',
    seriesTitle,
    originalTitle,
    entryTitle: originalTitle || seriesTitle,
    summary: getText(root, '#subject_summary'),
    writers: toTextList(getBangumiInfoboxValue(infoboxMap, ['作者'])),
    illustrators: toTextList(getBangumiInfoboxValue(infoboxMap, ['作画', '作畫', '绘师', '繪師'])),
    tags: tagList,
    publisher: getBangumiInfoboxValue(infoboxMap, ['出版社']),
    issueCount: standaloneMetadata_parseOptionalNumber(getBangumiInfoboxValue(infoboxMap, ['话数', '話數'])),
    releaseDate: getBangumiReleaseDate(infoboxMap),
    status: tagList.includes('已完结') ? 'ended' : '',
    languageISO: '',
    subjectUrl: getCanonicalUrl(root, pageUrl)
  })
}

const getStandaloneMetadataModeMeta = (mode) => {
  return modeMetaMap[mode] || null
}

const getStandaloneMetadataContext = (root = document, pageUrl = window.location.href) => {
  const hostname = getHostname(pageUrl)
  const pathname = getPathname(pageUrl)

  if (bangumiHostReg.test(hostname) && /\/subject\/\d+/i.test(pathname)) {
    const draft = buildBangumiSingleDraft(root, pageUrl)
    return {
      site: 'bangumi',
      siteName: 'Bangumi',
      pageType: 'subject',
      pageTitle: draft.seriesTitle || draft.entryTitle || 'Bangumi',
      pageUrl: getCanonicalUrl(root, pageUrl),
      modeOptions: [modeMetaMap['bangumi-single']],
      defaultMode: 'bangumi-single'
    }
  }

  if (bookwalkerHostReg.test(hostname) && bookwalkerProductPathReg.test(pathname)) {
    const bookDraft = buildBookwalkerProductBookDraft(root, pageUrl)
    return {
      site: 'bookwalker',
      siteName: 'BookWalker',
      pageType: 'product',
      pageTitle: bookDraft.entryTitle || bookDraft.seriesTitle || 'BookWalker',
      pageUrl: getCanonicalUrl(root, pageUrl),
      modeOptions: [modeMetaMap['bookwalker-book'], modeMetaMap['bookwalker-series']],
      defaultMode: 'bookwalker-book'
    }
  }

  if (bookwalkerHostReg.test(hostname) && bookwalkerSearchPathReg.test(pathname) && getBookwalkerSearchSeriesAnchor(root, pageUrl)) {
    const seriesDraft = buildBookwalkerSearchSeriesDraft(root, pageUrl)
    return {
      site: 'bookwalker',
      siteName: 'BookWalker',
      pageType: 'series-search',
      pageTitle: seriesDraft.seriesTitle || 'BookWalker',
      pageUrl: getCanonicalUrl(root, pageUrl),
      modeOptions: [modeMetaMap['bookwalker-series']],
      defaultMode: 'bookwalker-series'
    }
  }

  return null
}

const buildStandaloneMetadataDraft = (mode, root = document, pageUrl = window.location.href) => {
  switch (mode) {
    case 'bangumi-single':
      return buildBangumiSingleDraft(root, pageUrl)
    case 'bookwalker-book':
      return buildBookwalkerProductBookDraft(root, pageUrl)
    case 'bookwalker-series':
      if (bookwalkerProductPathReg.test(getPathname(pageUrl))) {
        return buildBookwalkerProductSeriesDraft(root, pageUrl)
      }
      return buildBookwalkerSearchSeriesDraft(root, pageUrl)
    default:
      return normalizeStandaloneMetadataDraft()
  }
}

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/metadata.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









const metadatavue_type_script_lang_js_cloneData = (value) => {
  return JSON.parse(JSON.stringify(value))
}

/* harmony default export */ const metadatavue_type_script_lang_js_ = ({
  name: 'Metadata',
  data() {
    return {
      viewMode: 'standalone',
      loading: false,
      submitting: false,
      pendingItems: [],
      pendingGroups: [],
      activeNames: [],
      returnTab: 3,
      showComicInfoPreview: false,
      showSeriesJsonPreview: false,
      enableBangumiScrape: false,
      standaloneLoading: false,
      standaloneSubmitting: false,
      standaloneContext: null,
      standaloneSelectedMode: '',
      standalonePrepared: false,
      standaloneDraft: normalizeStandaloneMetadataDraft(),
      standaloneForm: {},
      standalonePreviewFiles: [],
      standaloneError: ''
    }
  },
  computed: {
    showStandaloneEntryFields() {
      return ['bangumi-single', 'bookwalker-book'].includes(this.standaloneSelectedMode)
    },
    showStandalonePageCountField() {
      return this.standaloneSelectedMode === 'bookwalker-book'
    },
    showStandaloneIsbnField() {
      return this.standaloneSelectedMode === 'bookwalker-book'
    }
  },
  mounted() {
    this.$bus.$on('openMetadataPreview', this.openMetadataPreview)
    this.refreshStandaloneContext()
  },
  methods: {
    buildGroupKey(item) {
      return `${item.webName || ''}__${item.comicPageUrl || item.comicName || ''}`
    },
    createFormFromDraft(draft) {
      return {
        seriesTitle: draft.seriesTitle || '',
        originalTitle: draft.originalTitle || '',
        summary: draft.summary || '',
        writersText: (draft.writers || []).join(', '),
        illustratorsText: (draft.illustrators || []).join(', '),
        tagsText: (draft.tags || []).join(', '),
        publisher: draft.publisher || '',
        issueCount: draft.issueCount ?? '',
        releaseDate: draft.releaseDate || '',
        status: draft.status || '',
        ageRating: draft.ageRating || '',
        languageISO: draft.languageISO || ''
      }
    },
    buildDraftFromForm(form, currentDraft = {}) {
      return normalizeMetadataDraft({
        seriesTitle: form.seriesTitle,
        originalTitle: form.originalTitle,
        summary: form.summary,
        writers: form.writersText,
        illustrators: form.illustratorsText,
        tags: form.tagsText,
        publisher: form.publisher,
        issueCount: form.issueCount,
        releaseDate: form.releaseDate,
        status: form.status,
        ageRating: form.ageRating,
        languageISO: form.languageISO,
        subjectUrl: currentDraft.subjectUrl || '',
        source: currentDraft.source || ''
      })
    },
    syncGroupPreview(group) {
      group.draft = this.buildDraftFromForm(group.form, group.draft || {})
      const previewItem = {
        ...metadatavue_type_script_lang_js_cloneData(group.baseItem),
        metadataOverride: metadatavue_type_script_lang_js_cloneData(group.draft)
      }
      group.preview = buildMetadataPreviewFiles(previewItem, 0)
    },
    buildGroups(items) {
      const groupMap = new Map()
      items.forEach((item) => {
        const key = this.buildGroupKey(item)
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            key,
            items: [],
            baseItem: metadatavue_type_script_lang_js_cloneData(item),
            draft: buildDefaultMetadataDraft(item),
            form: {},
            preview: {
              comicInfoXml: '',
              seriesJson: ''
            },
            sourceText: '',
            error: ''
          })
        }
        groupMap.get(key).items.push(metadatavue_type_script_lang_js_cloneData(item))
      })
      return [...groupMap.values()]
    },
    async prepareGroup(group) {
      const sourceList = []
      const metadataSources = [buildDefaultMetadataDraft(group.baseItem)]

      try {
        const webMetadata = await getWebMetadata(group.baseItem)
        if (webMetadata) {
          metadataSources.push(webMetadata)
          sourceList.push('网页解析')
        }
      } catch (error) {
        group.error = '网页解析失败，可手动修正'
      }

      if (this.enableBangumiScrape) {
        try {
          const bangumiMetadata = await getBangumiMetadata(group.baseItem, { force: true })
          if (bangumiMetadata) {
            metadataSources.push(bangumiMetadata)
            sourceList.push('Bangumi')
          }
        } catch (error) {
          group.error = group.error || 'Bangumi 补全失败，可手动修正'
        }
      }

      group.draft = mergeMetadataSources(...metadataSources, group.baseItem.metadataOverride)
      if (!group.draft.issueCount && group.baseItem.seriesChapterCount) {
        group.draft.issueCount = group.baseItem.seriesChapterCount
      }
      group.sourceText = sourceList.length > 0 ? sourceList.join(' + ') : '基础信息'
      group.form = this.createFormFromDraft(group.draft)
      this.syncGroupPreview(group)
    },
    async openMetadataPreview(items = []) {
      const list = metadatavue_type_script_lang_js_cloneData(items || [])
      const flags = getMetadataFileFlags()
      this.viewMode = 'preview'
      this.pendingItems = list
      this.pendingGroups = this.buildGroups(list)
      this.returnTab = list[0]?.originTab ?? 3
      this.showComicInfoPreview = flags.enableComicInfoXml && list.some(item => item.downType === 1)
      this.showSeriesJsonPreview = flags.enableSeriesJson === true
      this.enableBangumiScrape = flags.enableBangumiScrape === true
      this.activeNames = this.pendingGroups.length > 0 ? [this.pendingGroups[0].key] : []
      this.loading = true

      for (let i = 0; i < this.pendingGroups.length; i++) {
        await this.prepareGroup(this.pendingGroups[i])
      }

      this.loading = false
    },
    resetPreviewState() {
      this.viewMode = 'standalone'
      this.loading = false
      this.submitting = false
      this.pendingItems = []
      this.pendingGroups = []
      this.activeNames = []
      this.showComicInfoPreview = false
      this.showSeriesJsonPreview = false
      this.refreshStandaloneContext(true)
    },
    cancelPreview() {
      this.resetPreviewState()
      this.$bus.$emit('changTab', this.returnTab || 3)
    },
    confirmPreview() {
      if (this.pendingGroups.length === 0) {
        return
      }
      this.submitting = true
      const draftMap = new Map(this.pendingGroups.map(group => [group.key, metadatavue_type_script_lang_js_cloneData(group.draft)]))
      const nextItems = this.pendingItems.map((item) => {
        const key = this.buildGroupKey(item)
        return {
          ...metadatavue_type_script_lang_js_cloneData(item),
          metadataOverride: draftMap.get(key) || null,
          metadataConfirmed: true
        }
      })
      if (nextItems.length === 0) {
        (0,external_vant_.Toast)({
          message: '没有可下载的条目',
          getContainer: '.card',
          position: 'bottom'
        })
        this.submitting = false
        return
      }
      this.$bus.$emit('selectDown', nextItems)
      this.$bus.$emit('changTab', 3)
      this.submitting = false
      this.resetPreviewState()
    },
    createStandaloneFormFromDraft(draft) {
      return {
        entryTitle: draft.entryTitle || '',
        entryNumber: draft.entryNumber || '',
        seriesTitle: draft.seriesTitle || '',
        originalTitle: draft.originalTitle || '',
        summary: draft.summary || '',
        writersText: (draft.writers || []).join(', '),
        illustratorsText: (draft.illustrators || []).join(', '),
        tagsText: (draft.tags || []).join(', '),
        publisher: draft.publisher || '',
        issueCount: draft.issueCount ?? '',
        pageCount: draft.pageCount ?? '',
        isbn: draft.isbn || '',
        releaseDate: draft.releaseDate || '',
        status: draft.status || '',
        ageRating: draft.ageRating || '',
        languageISO: draft.languageISO || ''
      }
    },
    buildStandaloneDraftFromForm(form, currentDraft = {}) {
      return normalizeStandaloneMetadataDraft({
        ...currentDraft,
        entryTitle: form.entryTitle,
        entryNumber: form.entryNumber,
        seriesTitle: form.seriesTitle,
        originalTitle: form.originalTitle,
        summary: form.summary,
        writers: form.writersText,
        illustrators: form.illustratorsText,
        tags: form.tagsText,
        publisher: form.publisher,
        issueCount: form.issueCount,
        pageCount: form.pageCount,
        isbn: form.isbn,
        releaseDate: form.releaseDate,
        status: form.status,
        ageRating: form.ageRating,
        languageISO: form.languageISO,
        subjectUrl: currentDraft.subjectUrl || '',
        source: currentDraft.source || ''
      })
    },
    async refreshStandaloneContext(preserveSelection = false) {
      if (this.viewMode === 'preview') {
        return
      }
      this.standaloneLoading = true
      this.standaloneError = ''
      try {
        const context = getStandaloneMetadataContext(document, window.location.href)
        this.standaloneContext = context
        if (context?.modeOptions?.length) {
          const currentSelectionValid = preserveSelection && context.modeOptions.some(item => item.value === this.standaloneSelectedMode)
          this.standaloneSelectedMode = currentSelectionValid
            ? this.standaloneSelectedMode
            : (context.defaultMode || context.modeOptions[0].value)
        } else {
          this.standaloneSelectedMode = ''
        }
        this.standalonePrepared = false
        this.standaloneDraft = normalizeStandaloneMetadataDraft()
        this.standaloneForm = this.createStandaloneFormFromDraft(this.standaloneDraft)
        this.standalonePreviewFiles = []
      } catch (error) {
        this.standaloneContext = null
        this.standaloneSelectedMode = ''
        this.standalonePrepared = false
        this.standalonePreviewFiles = []
        this.standaloneError = '当前页面识别失败，请刷新页面后重试'
      } finally {
        this.standaloneLoading = false
      }
    },
    getStandalonePageTypeText() {
      switch (this.standaloneContext?.pageType) {
        case 'subject':
          return '漫画条目页'
        case 'product':
          return '单本详情页'
        case 'series-search':
          return '系列检索页'
        default:
          return '当前页面'
      }
    },
    prepareStandalonePreview() {
      if (!this.standaloneSelectedMode) {
        return
      }
      try {
        const draft = buildStandaloneMetadataDraft(this.standaloneSelectedMode, document, window.location.href)
        this.standaloneDraft = normalizeStandaloneMetadataDraft(draft)
        this.standaloneForm = this.createStandaloneFormFromDraft(this.standaloneDraft)
        this.standalonePrepared = true
        this.syncStandalonePreview()
      } catch (error) {
        (0,external_vant_.Toast)({
          message: '当前页面元数据解析失败',
          getContainer: '.card',
          position: 'bottom'
        })
      }
    },
    syncStandalonePreview() {
      this.standaloneDraft = this.buildStandaloneDraftFromForm(this.standaloneForm, this.standaloneDraft || {})
      this.standalonePreviewFiles = buildStandaloneMetadataFiles(this.standaloneSelectedMode, this.standaloneDraft)
    },
    async downloadStandaloneFile(file) {
      const blob = new Blob([file.content], {
        type: `${file.type || 'text/plain'};charset=utf-8`
      })
      const url = window.URL.createObjectURL(blob)
      const result = await (0,utils/* downFile */.zd)(url, file.name)
      window.URL.revokeObjectURL(url)
      return result
    },
    async generateStandaloneFiles() {
      if (!this.standalonePrepared) {
        return
      }
      this.standaloneSubmitting = true
      this.syncStandalonePreview()
      const files = metadatavue_type_script_lang_js_cloneData(this.standalonePreviewFiles)
      if (files.length === 0) {
        this.standaloneSubmitting = false
        return
      }

      let successCount = 0
      for (let i = 0; i < files.length; i++) {
        const result = await this.downloadStandaloneFile(files[i])
        if (result) {
          successCount += 1
        }
      }

      (0,external_vant_.Toast)({
        message: successCount === files.length ? `已生成 ${successCount} 个文件` : `成功 ${successCount} 个，失败 ${files.length - successCount} 个`,
        getContainer: '.card',
        position: 'bottom'
      })
      this.standaloneSubmitting = false
    }
  }
});

;// CONCATENATED MODULE: ./src/views/metadata.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_metadatavue_type_script_lang_js_ = (metadatavue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/metadata.vue?vue&type=style&index=0&id=78dd89c9&lang=less&scoped=true&
var metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_ = __webpack_require__(757);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/metadata.vue?vue&type=style&index=0&id=78dd89c9&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options = {};

metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_/* default */.Z, metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_options);




       /* harmony default export */ const views_metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_ = (metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_/* default */.Z && metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_/* default.locals */.Z.locals ? metadatavue_type_style_index_0_id_78dd89c9_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/metadata.vue?vue&type=style&index=0&id=78dd89c9&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/metadata.vue



;


/* normalize component */

var metadata_component = normalizeComponent(
  views_metadatavue_type_script_lang_js_,
  metadatavue_type_template_id_78dd89c9_scoped_true_render,
  metadatavue_type_template_id_78dd89c9_scoped_true_staticRenderFns,
  false,
  null,
  "78dd89c9",
  null
  
)

/* hot reload */
if (false) { var metadata_api; }
metadata_component.options.__file = "src/views/metadata.vue"
/* harmony default export */ const metadata = (metadata_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/pan.vue?vue&type=template&id=27ff97f3&scoped=true&
var panvue_type_template_id_27ff97f3_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pan-page" }, [
    _c(
      "div",
      { staticClass: "pan-card" },
      [
        _c("div", { staticClass: "pan-card__title" }, [_vm._v("网盘类型")]),
        _vm._v(" "),
        _c("div", { staticClass: "pan-card__hint" }, [
          _vm._v(
            "\n      目前已支持夸克网盘与 UC 网盘。Cookie、目标目录和待转存链接都会分别保留，不会互相覆盖。\n    "
          ),
        ]),
        _vm._v(" "),
        _c(
          "van-radio-group",
          {
            staticClass: "pan-provider-group",
            attrs: { direction: "horizontal" },
            on: { change: _vm.handleProviderChange },
            model: {
              value: _vm.panSettings.activeProvider,
              callback: function ($$v) {
                _vm.$set(_vm.panSettings, "activeProvider", $$v)
              },
              expression: "panSettings.activeProvider",
            },
          },
          _vm._l(_vm.providerList, function (item) {
            return _c(
              "van-radio",
              {
                key: item.key,
                staticClass: "pan-provider-radio",
                attrs: { name: item.key },
              },
              [_vm._v("\n        " + _vm._s(item.label) + "\n      ")]
            )
          }),
          1
        ),
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "pan-card" },
      [
        _c("div", { staticClass: "pan-card__title" }, [
          _vm._v(_vm._s(_vm.currentProvider.label) + " 配置"),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pan-card__hint" }, [
          _vm._v(
            "\n      " + _vm._s(_vm.currentProvider.cookieHint) + "\n    "
          ),
        ]),
        _vm._v(" "),
        _c("van-field", {
          attrs: {
            type: "textarea",
            rows: "4",
            autosize: "",
            label: "Cookie",
            placeholder: _vm.currentProvider.cookiePlaceholder,
          },
          model: {
            value: _vm.currentCookie,
            callback: function ($$v) {
              _vm.currentCookie = $$v
            },
            expression: "currentCookie",
          },
        }),
        _vm._v(" "),
        _c("van-field", {
          attrs: { label: "目标 fid", placeholder: "默认 0" },
          model: {
            value: _vm.currentTargetDirId,
            callback: function ($$v) {
              _vm.currentTargetDirId = $$v
            },
            expression: "currentTargetDirId",
          },
        }),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pan-actions" },
          [
            _c(
              "van-button",
              {
                attrs: { size: "small", round: "", type: "primary" },
                on: { click: _vm.saveSettings },
              },
              [_vm._v(_vm._s(_vm.currentProvider.shortName) + " 配置保存")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                attrs: { size: "small", round: "", loading: _vm.testingCookie },
                on: { click: _vm.testCookie },
              },
              [_vm._v("测试 Cookie")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                attrs: { size: "small", round: "", plain: "" },
                on: { click: _vm.useRootFolder },
              },
              [_vm._v("使用根目录")]
            ),
          ],
          1
        ),
        _vm._v(" "),
        _vm.currentAccountLabel
          ? _c("div", { staticClass: "pan-inline-note" }, [
              _vm._v(
                "\n      当前 Cookie: " +
                  _vm._s(_vm.currentAccountLabel) +
                  "\n    "
              ),
            ])
          : _vm._e(),
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "pan-card" }, [
      _c("div", { staticClass: "pan-card__title" }, [_vm._v("目录浏览")]),
      _vm._v(" "),
      _c("div", { staticClass: "pan-card__hint" }, [
        _vm._v(
          "\n      当前目标 fid: " +
            _vm._s(_vm.currentTargetDirId) +
            "。点“浏览当前目录”后，可直接点击下方文件夹把它设成新的目标目录。\n    "
        ),
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "pan-actions" },
        [
          _c(
            "van-button",
            {
              attrs: { size: "small", round: "", loading: _vm.browsingFolder },
              on: { click: _vm.browseTargetFolder },
            },
            [_vm._v("浏览当前目录")]
          ),
          _vm._v(" "),
          _c(
            "van-button",
            {
              attrs: { size: "small", round: "", plain: "" },
              on: { click: _vm.clearFolderList },
            },
            [_vm._v("清空目录列表")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _vm.folderList.length > 0
        ? _c(
            "div",
            { staticClass: "pan-folder-list" },
            [
              _c(
                "van-cell-group",
                { attrs: { inset: "" } },
                _vm._l(_vm.folderList, function (item) {
                  return _c("van-cell", {
                    key: item.fid,
                    attrs: {
                      "is-link": "",
                      title: item.file_name || item.title || item.fid,
                      label: "fid: " + item.fid,
                    },
                    on: {
                      click: function ($event) {
                        return _vm.selectFolder(item)
                      },
                    },
                  })
                }),
                1
              ),
            ],
            1
          )
        : _c("div", { staticClass: "pan-empty-hint" }, [
            _vm._v(
              "\n      暂无目录列表。可以先测试 Cookie，再浏览当前目标目录。\n    "
            ),
          ]),
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "pan-card" },
      [
        _c("div", { staticClass: "pan-card__title" }, [_vm._v("手动转存")]),
        _vm._v(" "),
        _c("div", { staticClass: "pan-card__hint" }, [
          _vm._v("\n      " + _vm._s(_vm.currentProvider.shareHint) + "\n    "),
        ]),
        _vm._v(" "),
        _c("van-field", {
          attrs: {
            type: "textarea",
            rows: "5",
            autosize: "",
            label: "分享链接",
            placeholder: _vm.currentProvider.sharePlaceholder,
          },
          model: {
            value: _vm.currentShareInput,
            callback: function ($$v) {
              _vm.currentShareInput = $$v
            },
            expression: "currentShareInput",
          },
        }),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pan-actions" },
          [
            _c(
              "van-button",
              {
                attrs: {
                  size: "small",
                  round: "",
                  type: "primary",
                  loading: _vm.transferring,
                },
                on: { click: _vm.startTransfer },
              },
              [_vm._v("开始转存")]
            ),
            _vm._v(" "),
            _c(
              "van-button",
              {
                attrs: { size: "small", round: "", plain: "" },
                on: { click: _vm.clearShareInput },
              },
              [_vm._v("清空链接")]
            ),
          ],
          1
        ),
        _vm._v(" "),
        _vm.transferSummary
          ? _c("div", { staticClass: "pan-inline-note" }, [
              _vm._v("\n      " + _vm._s(_vm.transferSummary) + "\n    "),
            ])
          : _vm._e(),
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "pan-card pan-card--logs" }, [
      _c("div", { staticClass: "pan-card__title" }, [_vm._v("运行日志")]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "pan-actions" },
        [
          _c(
            "van-button",
            {
              attrs: { size: "small", round: "", plain: "" },
              on: { click: _vm.clearLogs },
            },
            [_vm._v("清空日志")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _vm.logList.length === 0
        ? _c("div", { staticClass: "pan-empty-hint" }, [
            _vm._v(
              "\n      这里会显示 Cookie 校验、目录浏览和转存过程日志。\n    "
            ),
          ])
        : _c(
            "div",
            { staticClass: "pan-log-list" },
            _vm._l(_vm.logList, function (item) {
              return _c(
                "div",
                {
                  key: item.id,
                  staticClass: "pan-log-item",
                  class: "pan-log-item--" + item.type,
                },
                [
                  _c("span", { staticClass: "pan-log-time" }, [
                    _vm._v(_vm._s(item.time)),
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "pan-log-text" }, [
                    _vm._v(_vm._s(item.message)),
                  ]),
                ]
              )
            }),
            0
          ),
    ]),
  ])
}
var panvue_type_template_id_27ff97f3_scoped_true_staticRenderFns = []
panvue_type_template_id_27ff97f3_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/views/pan.vue?vue&type=template&id=27ff97f3&scoped=true&

;// CONCATENATED MODULE: ./src/utils/pan.js


const DEFAULT_PAN_PROVIDER = 'quark'

const createQuarkFamilyProvider = ({
  key,
  label,
  shortName,
  cookieKey,
  targetDirKey,
  hosts,
  origin,
  homeReferer,
  sharePageBaseUrl,
  shareUrlPattern,
  shareIdPattern,
  commonParams,
  cookieHint,
  cookiePlaceholder,
  shareHint,
  sharePlaceholder,
  shareExample
}) => ({
  family: 'quark',
  key,
  label,
  shortName,
  cookieKey,
  targetDirKey,
  hosts,
  origin,
  homeReferer,
  sharePageBaseUrl,
  shareUrlPattern,
  shareIdPattern,
  shareDirPattern: /#\/list\/share\/([^/?#]+)/i,
  commonParams,
  accountInfoPath: '/account/info',
  accountInfoParams: {
    platform: 'pc',
    fr: 'pc'
  },
  cookieHint,
  cookiePlaceholder,
  shareHint,
  sharePlaceholder,
  shareExample
})

const PAN_PROVIDER_MAP = {
  quark: createQuarkFamilyProvider({
    key: 'quark',
    label: '夸克网盘',
    shortName: '夸克',
    cookieKey: 'quarkCookie',
    targetDirKey: 'quarkTargetDirId',
    hosts: {
      account: 'https://pan.quark.cn',
      drivePc: 'https://drive-pc.quark.cn',
      driveShare: 'https://drive-h.quark.cn'
    },
    origin: 'https://pan.quark.cn',
    homeReferer: 'https://pan.quark.cn/',
    sharePageBaseUrl: 'https://pan.quark.cn/s/',
    shareUrlPattern: /https?:\/\/pan\.quark\.cn\/s\/[A-Za-z0-9]+(?:[^\s]*)?/i,
    shareIdPattern: /pan\.quark\.cn\/s\/([A-Za-z0-9]+)/i,
    commonParams: {
      pr: 'ucpro',
      fr: 'pc',
      uc_param_str: ''
    },
    cookieHint: '建议从夸克网页请求头里复制完整 Cookie。根目录 fid 为 `0`，不填时默认转存到根目录。',
    cookiePlaceholder: '粘贴夸克请求头里的完整 Cookie',
    shareHint: '每行一个夸克分享链接，支持在同一行附带提取码，例如 `https://pan.quark.cn/s/xxxx 提取码: abcd`。',
    sharePlaceholder: '每行一个夸克分享链接',
    shareExample: 'https://pan.quark.cn/s/xxxx 提取码: abcd'
  }),
  uc: createQuarkFamilyProvider({
    key: 'uc',
    label: 'UC 网盘',
    shortName: 'UC',
    cookieKey: 'ucCookie',
    targetDirKey: 'ucTargetDirId',
    hosts: {
      account: 'https://drive.uc.cn',
      drivePc: 'https://pc-api.uc.cn',
      driveShare: 'https://pc-api.uc.cn'
    },
    origin: 'https://drive.uc.cn',
    homeReferer: 'https://drive.uc.cn/',
    sharePageBaseUrl: 'https://drive.uc.cn/s/',
    shareUrlPattern: /https?:\/\/drive\.uc\.cn\/s\/[A-Za-z0-9]+(?:[^\s]*)?/i,
    shareIdPattern: /drive\.uc\.cn\/s\/([A-Za-z0-9]+)/i,
    commonParams: {
      pr: 'UCBrowser',
      fr: 'pc'
    },
    cookieHint: '建议从 UC 网盘网页请求头里复制完整 Cookie。根目录 fid 为 `0`，不填时默认转存到根目录。',
    cookiePlaceholder: '粘贴 UC 网盘请求头里的完整 Cookie',
    shareHint: '每行一个 UC 网盘分享链接，支持在同一行附带提取码，例如 `https://drive.uc.cn/s/xxxx 提取码: abcd`。',
    sharePlaceholder: '每行一个 UC 网盘分享链接',
    shareExample: 'https://drive.uc.cn/s/xxxx 提取码: abcd'
  }),
  pan123: {
    family: 'pan123',
    key: 'pan123',
    label: '123 云盘',
    shortName: '123',
    cookieKey: 'pan123Cookie',
    targetDirKey: 'pan123TargetDirId',
    hosts: {
      account: 'https://www.123pan.com',
      drivePc: 'https://www.123pan.com',
      driveShare: 'https://www.123pan.com'
    },
    origin: 'https://www.123pan.com',
    homeReferer: 'https://www.123pan.com/',
    sharePageBaseUrl: 'https://www.123pan.com/s/',
    shareUrlPattern: /https?:\/\/(?:www\.)?123pan\.com\/s\/[A-Za-z0-9_-]+(?:\.html)?(?:[^\s]*)?/i,
    shareIdPattern: /123pan\.com\/s\/([A-Za-z0-9_-]+)(?:\.html)?/i,
    shareDirPattern: /[?&](?:parentFileId|ParentFileId)=([^&#]+)/i,
    cookieHint: '建议从 123 云盘网页请求头里复制完整 Cookie。脚本会自动从其中提取 `sso-token` 作为鉴权令牌。',
    cookiePlaceholder: '粘贴 123 云盘请求头里的完整 Cookie',
    shareHint: '每行一个 123 云盘分享链接，支持同一行附带提取码，例如 `https://www.123pan.com/s/xxxx-xxxx.html 提取码: abcd`。',
    sharePlaceholder: '每行一个 123 云盘分享链接',
    shareExample: 'https://www.123pan.com/s/xxxx-xxxx.html 提取码: abcd'
  }
}

const PAN_PROVIDER_LIST = Object.values(PAN_PROVIDER_MAP).map((provider) => ({
  key: provider.key,
  label: provider.label,
  shortName: provider.shortName,
  cookieKey: provider.cookieKey,
  targetDirKey: provider.targetDirKey,
  cookieHint: provider.cookieHint,
  cookiePlaceholder: provider.cookiePlaceholder,
  shareHint: provider.shareHint,
  sharePlaceholder: provider.sharePlaceholder,
  shareExample: provider.shareExample
}))

const SHARE_PAGE_SIZE = 100
const SAVE_BATCH_SIZE = 100
const TASK_POLL_INTERVAL_SECONDS = 1.2
const TASK_MAX_ATTEMPTS = 60

const PAN123_SERVER_TIME_TTL = 55 * 1000
const PAN123_DYKEY_ERROR = 'dykey illegality 1001'
const PAN123_DATE_LETTER_MAP = ['a', 'd', 'e', 'f', 'g', 'h', 'l', 'm', 'y', 'i']

const pan123RuntimeState = {
  loginUuid: '',
  serverTimestamp: '',
  serverFetchedAt: 0,
  serverPromise: null
}

const normalizePanProviderKey = (providerKey = '') => {
  return PAN_PROVIDER_MAP[providerKey] ? providerKey : DEFAULT_PAN_PROVIDER
}

const getPanProvider = (providerKey = '') => {
  if (providerKey && typeof providerKey === 'object' && providerKey.key && PAN_PROVIDER_MAP[providerKey.key]) {
    return PAN_PROVIDER_MAP[providerKey.key]
  }
  return PAN_PROVIDER_MAP[normalizePanProviderKey(providerKey)]
}

const buildCommonParams = (provider, params = {}) => {
  if (provider.family === 'pan123') {
    return {
      ...params
    }
  }

  return {
    ...provider.commonParams,
    __dt: Math.floor(Math.random() * 9000) + 1000,
    __t: Date.now(),
    ...params
  }
}

const buildUrl = (provider, host, path, params = {}) => {
  const url = new URL(`${host}${path}`)
  const query = buildCommonParams(provider, params)
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, String(value))
  })
  return url.toString()
}

const normalizeCookie = (cookie = '') => {
  return String(cookie || '')
    .replace(/\r?\n+/g, ' ')
    .trim()
}

const getCookieValue = (cookie = '', name = '') => {
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie || !name) {
    return ''
  }

  const pair = normalizedCookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${name}=`))

  return pair ? pair.slice(name.length + 1).trim() : ''
}

const createFormBody = (payload = {}) => {
  const body = new URLSearchParams()
  Object.keys(payload).forEach((key) => {
    const value = payload[key]
    if (value === undefined || value === null || value === '') {
      return
    }
    if (Array.isArray(value) || typeof value === 'object') {
      body.set(key, JSON.stringify(value))
      return
    }
    body.set(key, String(value))
  })
  return body.toString()
}

const createHeaders = (provider, referer, isPost = false) => {
  const headers = {
    accept: 'application/json, text/plain, */*',
    origin: provider.origin,
    referer
  }

  if (isPost) {
    headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  return headers
}

const parseJsonResponse = (provider, response) => {
  if (!response || response === 'onerror' || response === 'timeout') {
    throw new Error(`${provider.shortName} 请求失败，请稍后重试`)
  }

  if (response.status && response.status >= 400) {
    throw new Error(`${provider.shortName} 请求失败 (${response.status})`)
  }

  const payload = response.response ?? response.responseText ?? response
  if (typeof payload === 'string') {
    return JSON.parse(payload)
  }
  return payload
}

const unwrapResponseData = (provider, payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error(`${provider.shortName} 返回了无效数据`)
  }

  const status = payload.status
  if (typeof status === 'number' && status !== 200) {
    throw new Error(payload.message || `${provider.shortName} 请求失败 (${status})`)
  }

  const code = payload.code
  if (typeof code === 'number' && code !== 0) {
    throw new Error(payload.message || `${provider.shortName} 接口返回错误 (${code})`)
  }

  return payload.data ?? payload
}

const requestWithCookie = async({
  provider,
  method = 'GET',
  host,
  path,
  params = {},
  data = null,
  cookie = '',
  referer
}) => {
  const normalizedProvider = getPanProvider(provider)
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie) {
    throw new Error(`请先填写${normalizedProvider.shortName} Cookie`)
  }

  const upperMethod = method.toUpperCase()
  const response = await (0,utils/* request */.WY)({
    method: upperMethod,
    url: buildUrl(normalizedProvider, host || normalizedProvider.hosts.drivePc, path, params),
    data: upperMethod === 'GET' || !data ? null : createFormBody(data),
    headers: createHeaders(normalizedProvider, referer || normalizedProvider.homeReferer, upperMethod !== 'GET'),
    cookie: normalizedCookie,
    timeout: 60 * 1000
  })
  return unwrapResponseData(normalizedProvider, parseJsonResponse(normalizedProvider, response))
}

const createUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16)
    const value = char === 'x' ? random : ((random & 0x3) | 0x8)
    return value.toString(16)
  })
}

const getPan123LoginUuid = () => {
  if (!pan123RuntimeState.loginUuid) {
    pan123RuntimeState.loginUuid = createUuid()
  }
  return pan123RuntimeState.loginUuid
}

const getPan123Token = (cookie = '') => {
  return getCookieValue(cookie, 'sso-token') || getCookieValue(cookie, 'authorToken')
}

const createPan123Headers = (provider, referer, cookie, contentType = '') => {
  const token = getPan123Token(cookie)
  if (!token) {
    throw new Error('123 云盘 Cookie 中未找到 sso-token，请从网页请求头复制完整 Cookie')
  }

  const headers = {
    accept: 'application/json, text/plain, */*',
    origin: provider.origin,
    referer: referer || provider.homeReferer,
    platform: 'web',
    'App-Version': '3',
    LoginUuid: getPan123LoginUuid(),
    Authorization: `Bearer ${token}`
  }

  if (contentType === 'json') {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
  } else if (contentType === 'form') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  return headers
}

const crc32 = (text, radix = 10) => {
  const table = new Array(256).fill(0).map((_, index) => {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1)
    }
    return value >>> 0
  })

  const utf8Text = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code < 128) {
        return String.fromCharCode(code)
      }
      if (code < 2048) {
        return `${String.fromCharCode((code >> 6) | 192)}${String.fromCharCode((code & 63) | 128)}`
      }
      return `${String.fromCharCode((code >> 12) | 224)}${String.fromCharCode(((code >> 6) & 63) | 128)}${String.fromCharCode((code & 63) | 128)}`
    })
    .join('')

  let result = -1
  for (let index = 0; index < utf8Text.length; index += 1) {
    result = (result >>> 8) ^ table[(result ^ utf8Text.charCodeAt(index)) & 255]
  }

  return ((-1 ^ result) >>> 0).toString(radix)
}

const getPan123MinuteDiff = (currentSeconds, serverSeconds) => {
  return Math.abs((Number(currentSeconds) * 1000) - (Number(serverSeconds) * 1000)) / 1000 / 60
}

const getPan123BeijingSeconds = () => {
  return Math.round((Date.now() + (60 * new Date().getTimezoneOffset() * 1000) + 28800000) / 1000)
}

const formatPan123BeijingParts = (timestampSeconds) => {
  const rawValue = String(timestampSeconds || '').length === 10
    ? Number.parseInt(timestampSeconds, 10) * 1000
    : Number(timestampSeconds)

  const date = new Date(rawValue + (new Date(rawValue).getTimezoneOffset() * 60000) + 28800000)

  return {
    y: String(date.getFullYear()),
    m: String(date.getMonth() + 1).padStart(2, '0'),
    d: String(date.getDate()).padStart(2, '0'),
    h: String(date.getHours()).padStart(2, '0'),
    f: String(date.getMinutes()).padStart(2, '0')
  }
}

const buildPan123DyKey = (pathWithQuery = '') => {
  const randomValue = Math.round(10000000 * Math.random())
  const localSeconds = String(getPan123BeijingSeconds())
  const timestamp = pan123RuntimeState.serverTimestamp &&
    getPan123MinuteDiff(localSeconds, pan123RuntimeState.serverTimestamp) >= 20
    ? String(pan123RuntimeState.serverTimestamp)
    : localSeconds

  const timeParts = formatPan123BeijingParts(timestamp)
  const timeText = [timeParts.y, timeParts.m, timeParts.d, timeParts.h, timeParts.f].join('')
  const mappedText = timeText
    .split('')
    .map(digit => PAN123_DATE_LETTER_MAP[Number(digit)] || digit)
    .join('')

  const dynamicKey = crc32(mappedText)
  const dynamicValueCrc = crc32(`${timestamp}|${randomValue}|${pathWithQuery}|web|3|${dynamicKey}`)

  return [dynamicKey, `${timestamp}-${randomValue}-${dynamicValueCrc}`]
}

const buildPan123Path = (path = '') => {
  if (/^https?:\/\//i.test(path) || path.startsWith('/b/api')) {
    return path
  }
  return `/b/api${path}`
}

const buildPan123Url = (provider, host, path, params = {}, skipDyKey = false) => {
  const normalizedPath = buildPan123Path(path)
  const url = new URL(/^https?:\/\//i.test(normalizedPath) ? normalizedPath : `${host || provider.hosts.drivePc}${normalizedPath}`)

  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, String(value))
  })

  if (!skipDyKey && !url.pathname.includes('/get/server/time')) {
    const [dynamicKey, dynamicValue] = buildPan123DyKey(`${url.pathname}${url.search}`)
    url.searchParams.set(dynamicKey, dynamicValue)
  }

  return url.toString()
}

const createPan123RequestBody = (data = null, contentType = 'json') => {
  if (!data) {
    return null
  }
  if (contentType === 'json') {
    return JSON.stringify(data)
  }
  if (contentType === 'form') {
    return createFormBody(data)
  }
  return data
}

const fetchPan123ServerTimestamp = async(provider, cookie) => {
  if (pan123RuntimeState.serverPromise) {
    return pan123RuntimeState.serverPromise
  }

  pan123RuntimeState.serverPromise = (async() => {
    const response = await (0,utils/* request */.WY)({
      method: 'GET',
      url: buildPan123Url(provider, provider.hosts.drivePc, '/get/server/time', {}, true),
      headers: createPan123Headers(provider, provider.homeReferer, cookie),
      cookie: normalizeCookie(cookie),
      timeout: 60 * 1000
    })

    const payload = parseJsonResponse(provider, response)
    const data = unwrapResponseData(provider, payload)
    const timestamp = data?.timestamp
    if (!timestamp) {
      throw new Error('123 云盘时间接口未返回有效时间戳')
    }

    pan123RuntimeState.serverTimestamp = String(timestamp)
    pan123RuntimeState.serverFetchedAt = Date.now()
    return pan123RuntimeState.serverTimestamp
  })()

  try {
    return await pan123RuntimeState.serverPromise
  } finally {
    pan123RuntimeState.serverPromise = null
  }
}

const ensurePan123ServerTimestamp = async(provider, cookie, force = false) => {
  const cacheValid = pan123RuntimeState.serverTimestamp &&
    (Date.now() - pan123RuntimeState.serverFetchedAt) < PAN123_SERVER_TIME_TTL

  if (!force && cacheValid) {
    return pan123RuntimeState.serverTimestamp
  }

  try {
    return await fetchPan123ServerTimestamp(provider, cookie)
  } catch (error) {
    return pan123RuntimeState.serverTimestamp || ''
  }
}

const isPan123DyKeyError = (payload) => {
  return payload?.code === -3 && String(payload?.message || '').includes(PAN123_DYKEY_ERROR)
}

const pan123Request = async({
  provider,
  method = 'GET',
  host,
  path,
  params = {},
  data = null,
  cookie = '',
  referer,
  contentType = 'json',
  skipDyKey = false,
  retryCount = 0
}) => {
  const normalizedProvider = getPanProvider(provider)
  const normalizedCookie = normalizeCookie(cookie)
  if (!normalizedCookie) {
    throw new Error(`请先填写${normalizedProvider.shortName} Cookie`)
  }

  if (!skipDyKey && !String(path).includes('/get/server/time')) {
    await ensurePan123ServerTimestamp(normalizedProvider, normalizedCookie)
  }

  const upperMethod = method.toUpperCase()
  const response = await (0,utils/* request */.WY)({
    method: upperMethod,
    url: buildPan123Url(
      normalizedProvider,
      host || normalizedProvider.hosts.drivePc,
      path,
      params,
      skipDyKey
    ),
    data: upperMethod === 'GET' || !data ? null : createPan123RequestBody(data, contentType),
    headers: createPan123Headers(
      normalizedProvider,
      referer || normalizedProvider.homeReferer,
      normalizedCookie,
      upperMethod === 'GET' ? '' : contentType
    ),
    cookie: normalizedCookie,
    timeout: 60 * 1000
  })

  const payload = parseJsonResponse(normalizedProvider, response)
  if (isPan123DyKeyError(payload) && retryCount < 1) {
    await ensurePan123ServerTimestamp(normalizedProvider, normalizedCookie, true)
    return pan123Request({
      provider: normalizedProvider,
      method,
      host,
      path,
      params,
      data,
      cookie: normalizedCookie,
      referer,
      contentType,
      skipDyKey,
      retryCount: retryCount + 1
    })
  }

  return unwrapResponseData(normalizedProvider, payload)
}

const panRequest = async(options) => {
  const provider = getPanProvider(options.provider)
  if (provider.family === 'pan123') {
    return pan123Request({
      ...options,
      provider
    })
  }
  return requestWithCookie({
    ...options,
    provider
  })
}

const isQuarkFamilyFolderItem = (item) => {
  return item?.dir === true || item?.file_type === 0 || item?.obj_category === 'dir'
}

const chunkItems = (items, size) => {
  const list = []
  for (let index = 0; index < items.length; index += size) {
    list.push(items.slice(index, index + size))
  }
  return list
}

const extractShareUrl = (provider, text = '') => {
  const match = String(text).match(provider.shareUrlPattern)
  return match ? match[0] : ''
}

const extractPasscode = (text = '', url = '') => {
  if (url) {
    try {
      const parsedUrl = new URL(url)
      const urlPasscode = parsedUrl.searchParams.get('pwd') || parsedUrl.searchParams.get('passcode')
      if (urlPasscode) {
        return urlPasscode.trim()
      }
    } catch (error) {
      //
    }
  }

  const match = String(text).match(/(?:提取码|密码|passcode|pwd)[：:\s=]*([A-Za-z0-9]{2,8})/i)
  return match ? match[1] : ''
}

const parsePanShareLine = (providerKey = DEFAULT_PAN_PROVIDER, line = '') => {
  const provider = getPanProvider(providerKey)
  const raw = String(line || '').trim()
  if (!raw) {
    return null
  }

  const shareUrl = extractShareUrl(provider, raw)
  const url = shareUrl || raw
  const urlMatch = url.match(provider.shareIdPattern)
  if (!urlMatch) {
    throw new Error(`未识别到${provider.shortName}分享链接: ${raw}`)
  }

  const hashMatch = provider.shareDirPattern ? url.match(provider.shareDirPattern) : null
  return {
    raw,
    url,
    shareId: urlMatch[1],
    passcode: extractPasscode(raw, shareUrl),
    pdirFid: hashMatch?.[1] || '0'
  }
}

const parsePanShareInput = (providerKey = DEFAULT_PAN_PROVIDER, text = '') => {
  const provider = getPanProvider(providerKey)
  const lineList = String(text || '')
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)

  if (lineList.length === 0) {
    throw new Error(`请先输入${provider.shortName}分享链接`)
  }

  return lineList
    .map(line => parsePanShareLine(provider.key, line))
    .filter(Boolean)
}

const getQuarkFamilyShareToken = async(provider, cookie, shareId, passcode = '') => {
  const data = await panRequest({
    provider,
    method: 'POST',
    host: provider.hosts.driveShare,
    path: '/1/clouddrive/share/sharepage/token',
    data: {
      pwd_id: shareId,
      passcode
    },
    cookie,
    referer: `${provider.sharePageBaseUrl}${shareId}`
  })

  const stoken = data.stoken || data.share_token || data.token
  if (!stoken) {
    throw new Error(`未拿到${provider.shortName}分享令牌，Cookie 可能失效或分享链接需要验证`)
  }

  return {
    ...data,
    stoken
  }
}

const getQuarkFamilyShareDetailPage = async(provider, cookie, share, stoken, page = 1) => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.driveShare,
    path: '/1/clouddrive/share/sharepage/detail',
    params: {
      pwd_id: share.shareId,
      stoken,
      pdir_fid: share.pdirFid || '0',
      _page: page,
      _size: SHARE_PAGE_SIZE,
      _fetch_total: 1,
      _fetch_banner: 0,
      _fetch_share: 1,
      _sort: 'file_type:asc,file_name:asc'
    },
    cookie,
    referer: `${provider.sharePageBaseUrl}${share.shareId}`
  })
}

const getQuarkFamilyTaskResult = async(provider, cookie, taskId, retryIndex = 0) => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.drivePc,
    path: '/1/clouddrive/task',
    params: {
      task_id: taskId,
      retry_index: retryIndex
    },
    cookie,
    referer: provider.homeReferer
  })
}

const waitForQuarkFamilyTask = async(provider, cookie, taskId) => {
  for (let retryIndex = 0; retryIndex < TASK_MAX_ATTEMPTS; retryIndex += 1) {
    const task = await getQuarkFamilyTaskResult(provider, cookie, taskId, retryIndex)
    const status = Number(task?.status)

    if (status === 2) {
      return task
    }

    if ([3, 4, -1].includes(status)) {
      throw new Error(task?.message || task?.title || `${provider.shortName} 转存任务失败`)
    }

    await (0,utils/* delay */.gw)(TASK_POLL_INTERVAL_SECONDS)
  }

  throw new Error(`${provider.shortName} 转存任务超时，请稍后去网盘确认结果`)
}

const getQuarkFamilyShareItems = async(provider, cookie, share, onProgress = null) => {
  const tokenData = await getQuarkFamilyShareToken(provider, cookie, share.shareId, share.passcode)
  const stoken = tokenData.stoken
  const itemList = []
  let page = 1
  let shareInfo = tokenData.share || null

  while (true) {
    const detailData = await getQuarkFamilyShareDetailPage(provider, cookie, share, stoken, page)
    const currentList = Array.isArray(detailData?.list) ? detailData.list : []
    if (detailData?.share) {
      shareInfo = detailData.share
    }
    itemList.push(...currentList)

    if (typeof onProgress === 'function') {
      onProgress(`已读取分享目录，第 ${page} 页，累计 ${itemList.length} 项`)
    }

    if (currentList.length < SHARE_PAGE_SIZE) {
      break
    }
    page += 1
  }

  if (itemList.length === 0) {
    throw new Error('分享目录为空，或当前子目录下没有可转存的项目')
  }

  return {
    shareInfo,
    stoken,
    items: itemList
  }
}

const normalizePan123ListItem = (item = {}) => {
  return {
    ...item,
    fid: String(item.FileId ?? item.fid ?? ''),
    file_name: item.FileName || item.file_name || item.title || ''
  }
}

const listPan123DirectoryPage = async(provider, cookie, pdirFid = '0', page = 1, next = '0') => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.drivePc,
    path: '/file/list/new',
    params: {
      driveId: 0,
      limit: SHARE_PAGE_SIZE,
      next,
      parentFileId: String(pdirFid || '0'),
      parentFileName: '0',
      trashed: false,
      Page: page,
      FileType: 1,
      orderBy: 'file_name',
      orderDirection: 'asc'
    },
    cookie,
    referer: provider.homeReferer
  })
}

const listPan123DirectoryFolders = async(provider, cookie, pdirFid = '0') => {
  let page = 1
  let next = '0'
  const folderList = []

  while (true) {
    const data = await listPan123DirectoryPage(provider, cookie, pdirFid, page, next)
    const currentList = Array.isArray(data?.InfoList) ? data.InfoList : []
    folderList.push(
      ...currentList
        .filter(item => Number(item?.Type) === 1)
        .map(normalizePan123ListItem)
    )

    const nextValue = String(data?.Next ?? '-1')
    if (nextValue === '-1' || currentList.length < SHARE_PAGE_SIZE) {
      break
    }

    next = nextValue
    page += 1
  }

  return folderList
}

const getPan123ShareItems = async(provider, cookie, share, onProgress = null) => {
  let page = 1
  let next = '0'
  const itemList = []

  while (true) {
    const data = await panRequest({
      provider,
      method: 'GET',
      host: provider.hosts.driveShare,
      path: '/share/get',
      params: {
        shareKey: share.shareId,
        limit: SHARE_PAGE_SIZE,
        next,
        ParentFileId: String(share.pdirFid || '0'),
        Page: page,
        orderBy: 'file_name',
        orderDirection: 'asc',
        SharePwd: share.passcode || undefined
      },
      cookie,
      referer: `${provider.sharePageBaseUrl}${share.shareId}.html`
    })

    const currentList = Array.isArray(data?.InfoList) ? data.InfoList : []
    itemList.push(...currentList)

    if (typeof onProgress === 'function') {
      onProgress(`已读取分享目录，第 ${page} 页，累计 ${itemList.length} 项`)
    }

    const nextValue = String(data?.Next ?? '-1')
    if (nextValue === '-1' || currentList.length < SHARE_PAGE_SIZE) {
      break
    }

    next = nextValue
    page += 1
  }

  if (itemList.length === 0) {
    throw new Error('分享目录为空，或当前子目录下没有可转存的项目')
  }

  return {
    shareInfo: null,
    items: itemList
  }
}

const buildPan123SaveFile = (item, parentFileId) => {
  return {
    fileID: Number(item?.FileId ?? item?.fid ?? 0),
    size: Number(item?.Size ?? item?.size ?? 0),
    etag: item?.Etag ?? item?.etag ?? '',
    type: Number(item?.Type ?? item?.type ?? 0),
    parentFileID: Number(parentFileId || 0),
    fileName: item?.FileName || item?.file_name || '',
    driveID: 0
  }
}

const getPan123TaskResult = async(provider, cookie, taskId) => {
  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.drivePc,
    path: '/restful/goapi/v1/file/copy/save/get',
    params: {
      taskID: taskId
    },
    cookie,
    referer: provider.homeReferer
  })
}

const waitForPan123Task = async(provider, cookie, taskId) => {
  for (let retryIndex = 0; retryIndex < TASK_MAX_ATTEMPTS; retryIndex += 1) {
    const task = await getPan123TaskResult(provider, cookie, taskId)
    const status = Number(task?.status)

    if (status === 2) {
      return task
    }

    if (status !== 0 && status !== 1) {
      throw new Error(task?.reason || task?.message || `${provider.shortName} 转存任务失败`)
    }

    await (0,utils/* delay */.gw)(TASK_POLL_INTERVAL_SECONDS)
  }

  throw new Error(`${provider.shortName} 转存任务超时，请稍后去网盘确认结果`)
}

const verifyPan123Cookie = async(provider, cookie) => {
  try {
    const visitorData = await panRequest({
      provider,
      method: 'GET',
      host: provider.hosts.account,
      path: '/share/visitor/info',
      cookie,
      referer: provider.homeReferer
    })

    if (visitorData && typeof visitorData === 'object') {
      return visitorData
    }
  } catch (firstError) {
    await listPan123DirectoryPage(provider, cookie, '0', 1, '0')
    return {
      user_name: '已登录用户'
    }
  }

  return {
    user_name: '已登录用户'
  }
}

const verifyPanCookie = async(providerKey = DEFAULT_PAN_PROVIDER, cookie = '') => {
  const provider = getPanProvider(providerKey)

  if (provider.family === 'pan123') {
    return verifyPan123Cookie(provider, cookie)
  }

  return panRequest({
    provider,
    method: 'GET',
    host: provider.hosts.account,
    path: provider.accountInfoPath,
    params: provider.accountInfoParams,
    cookie,
    referer: provider.homeReferer
  })
}

const listPanDirectoryFolders = async(providerKey = DEFAULT_PAN_PROVIDER, cookie = '', pdirFid = '0') => {
  const provider = getPanProvider(providerKey)

  if (provider.family === 'pan123') {
    return listPan123DirectoryFolders(provider, cookie, pdirFid)
  }

  let page = 1
  const folderList = []

  while (true) {
    const data = await panRequest({
      provider,
      method: 'GET',
      host: provider.hosts.drivePc,
      path: '/1/clouddrive/file/sort',
      params: {
        pdir_fid: String(pdirFid || '0'),
        _page: page,
        _size: SHARE_PAGE_SIZE,
        _fetch_total: 1,
        _fetch_sub_dirs: 0,
        _sort: 'file_type:asc,updated_at:desc'
      },
      cookie,
      referer: provider.homeReferer
    })

    const currentList = Array.isArray(data?.list) ? data.list : []
    folderList.push(...currentList.filter(isQuarkFamilyFolderItem))

    if (currentList.length < SHARE_PAGE_SIZE) {
      break
    }
    page += 1
  }

  return folderList
}

const transferQuarkFamilyShare = async({
  provider,
  cookie,
  share,
  toPdirFid = '0',
  onProgress = null
}) => {
  const { shareInfo, stoken, items } = await getQuarkFamilyShareItems(provider, cookie, share, onProgress)
  const batches = chunkItems(items, SAVE_BATCH_SIZE)

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index]
    const fidList = batch.map(item => item.fid).filter(Boolean)
    const fidTokenList = batch.map(item => item.share_fid_token || item.fid_token).filter(Boolean)

    if (fidList.length === 0 || fidList.length !== fidTokenList.length) {
      throw new Error('分享目录缺少必要的 fid_token，暂时无法转存')
    }

    if (typeof onProgress === 'function') {
      onProgress(`正在转存第 ${index + 1}/${batches.length} 批，共 ${batch.length} 项`)
    }

    const saveData = await panRequest({
      provider,
      method: 'POST',
      host: provider.hosts.drivePc,
      path: '/1/clouddrive/share/sharepage/save',
      data: {
        pwd_id: share.shareId,
        stoken,
        pdir_fid: share.pdirFid || '0',
        to_pdir_fid: String(toPdirFid || '0'),
        scene: 'link',
        fid_list: fidList,
        fid_token_list: fidTokenList
      },
      cookie,
      referer: `${provider.sharePageBaseUrl}${share.shareId}`
    })

    const taskId = saveData?.task_id
    if (taskId) {
      await waitForQuarkFamilyTask(provider, cookie, taskId)
    }
  }

  return {
    providerKey: provider.key,
    share,
    shareInfo,
    itemCount: items.length,
    batchCount: batches.length,
    title: shareInfo?.title || shareInfo?.share_title || shareInfo?.file_name || share.url
  }
}

const transferPan123Share = async({
  provider,
  cookie,
  share,
  toPdirFid = '0',
  onProgress = null
}) => {
  const { shareInfo, items } = await getPan123ShareItems(provider, cookie, share, onProgress)
  const batches = chunkItems(items, SAVE_BATCH_SIZE)
  const currentLevel = share.pdirFid && share.pdirFid !== '0' ? 1 : 0

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index]
    if (typeof onProgress === 'function') {
      onProgress(`正在转存第 ${index + 1}/${batches.length} 批，共 ${batch.length} 项`)
    }

    const saveData = await panRequest({
      provider,
      method: 'POST',
      host: provider.hosts.drivePc,
      path: '/restful/goapi/v1/file/copy/save',
      data: {
        fileList: batch.map(item => buildPan123SaveFile(item, share.pdirFid || '0')),
        shareKey: share.shareId,
        sharePwd: share.passcode || null,
        currentLevel,
        superAdmin: null
      },
      cookie,
      referer: `${provider.sharePageBaseUrl}${share.shareId}.html`,
      contentType: 'json'
    })

    const taskId = saveData?.taskID || saveData?.taskId
    if (taskId) {
      await waitForPan123Task(provider, cookie, taskId)
    }
  }

  const firstItem = items[0] || {}

  return {
    providerKey: provider.key,
    share,
    shareInfo,
    itemCount: items.length,
    batchCount: batches.length,
    title: shareInfo?.ShareName || shareInfo?.title || firstItem.FileName || share.url
  }
}

const transferPanShare = async({
  providerKey = DEFAULT_PAN_PROVIDER,
  cookie,
  shareInput,
  toPdirFid = '0',
  onProgress = null
}) => {
  const provider = getPanProvider(providerKey)
  const share = typeof shareInput === 'string' ? parsePanShareLine(provider.key, shareInput) : shareInput
  if (!share) {
    throw new Error(`请先输入${provider.shortName}分享链接`)
  }

  if (typeof onProgress === 'function') {
    onProgress(`开始处理分享 ${share.shareId}`)
  }

  if (provider.family === 'pan123') {
    return transferPan123Share({
      provider,
      cookie,
      share,
      toPdirFid,
      onProgress
    })
  }

  return transferQuarkFamilyShare({
    provider,
    cookie,
    share,
    toPdirFid,
    onProgress
  })
}

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/pan.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






const createToast = (message) => {
  (0,external_vant_.Toast)({
    message,
    getContainer: () => document.querySelector('.card') || document.body,
    position: 'bottom'
  })
}

const normalizeCookieInput = (value) => {
  return String(value || '')
    .replace(/\r?\n+/g, ' ')
    .trim()
}

const normalizeTargetDirId = (value) => {
  return String(value || '0').trim() || '0'
}

const buildProviderStateMap = (initialValue = '') => {
  return PAN_PROVIDER_LIST.reduce((result, provider) => {
    result[provider.key] = initialValue
    return result
  }, {})
}

/* harmony default export */ const panvue_type_script_lang_js_ = ({
  name: 'Pan',
  data() {
    return {
      panSettings: { ...setup/* defaultPanSettings */.z1 },
      shareInputMap: buildProviderStateMap(''),
      accountLabelMap: buildProviderStateMap(''),
      folderList: [],
      testingCookie: false,
      browsingFolder: false,
      transferring: false,
      transferSummary: '',
      logList: []
    }
  },
  computed: {
    providerList() {
      return PAN_PROVIDER_LIST
    },
    currentProviderKey() {
      return normalizePanProviderKey(this.panSettings.activeProvider)
    },
    currentProvider() {
      return getPanProvider(this.currentProviderKey)
    },
    currentCookie: {
      get() {
        return this.panSettings[this.currentProvider.cookieKey] || ''
      },
      set(value) {
        this.$set(this.panSettings, this.currentProvider.cookieKey, value)
      }
    },
    currentTargetDirId: {
      get() {
        return normalizeTargetDirId(this.panSettings[this.currentProvider.targetDirKey])
      },
      set(value) {
        this.$set(this.panSettings, this.currentProvider.targetDirKey, normalizeTargetDirId(value))
      }
    },
    currentShareInput: {
      get() {
        return this.shareInputMap[this.currentProviderKey] || ''
      },
      set(value) {
        this.$set(this.shareInputMap, this.currentProviderKey, value)
      }
    },
    currentAccountLabel() {
      return this.accountLabelMap[this.currentProviderKey] || ''
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      const storedSettings = (0,setup/* getStorage */.cF)('panSettings') || {}
      const panSettings = {
        ...setup/* defaultPanSettings */.z1,
        ...storedSettings
      }

      panSettings.activeProvider = normalizePanProviderKey(panSettings.activeProvider)
      this.providerList.forEach((provider) => {
        panSettings[provider.cookieKey] = normalizeCookieInput(panSettings[provider.cookieKey])
        panSettings[provider.targetDirKey] = normalizeTargetDirId(panSettings[provider.targetDirKey])
      })

      this.panSettings = panSettings
    },
    saveSettings(showToast = true) {
      const nextSettings = {
        ...this.panSettings,
        activeProvider: this.currentProviderKey
      }

      this.providerList.forEach((provider) => {
        nextSettings[provider.cookieKey] = normalizeCookieInput(nextSettings[provider.cookieKey])
        nextSettings[provider.targetDirKey] = normalizeTargetDirId(nextSettings[provider.targetDirKey])
      })

      this.panSettings = nextSettings
      ;(0,setup/* setStorage */.po)('panSettings', nextSettings)
      if (showToast) {
        createToast(`${this.currentProvider.label} 配置已保存`)
      }
    },
    appendLog(message, type = 'info') {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      this.logList.unshift({
        id: `${Date.now()}_${Math.random()}`,
        time,
        type,
        message
      })
      this.logList = this.logList.slice(0, 200)
    },
    handleProviderChange(value) {
      this.panSettings.activeProvider = normalizePanProviderKey(value)
      this.folderList = []
      this.transferSummary = ''
      this.saveSettings(false)
      this.appendLog(`已切换到 ${this.currentProvider.label}`, 'success')
    },
    ensureCookieReady() {
      this.saveSettings(false)
      if (!this.currentCookie) {
        createToast(`请先填写${this.currentProvider.shortName} Cookie`)
        return false
      }
      return true
    },
    useRootFolder() {
      this.currentTargetDirId = '0'
      this.saveSettings(false)
      this.appendLog(`已切换到 ${this.currentProvider.label} 根目录 fid: 0`)
    },
    clearFolderList() {
      this.folderList = []
    },
    clearShareInput() {
      this.currentShareInput = ''
    },
    clearLogs() {
      this.logList = []
    },
    async testCookie() {
      if (!this.ensureCookieReady()) {
        return
      }

      this.testingCookie = true
      this.appendLog(`开始校验 ${this.currentProvider.label} Cookie`)
      try {
        const data = await verifyPanCookie(this.currentProviderKey, this.currentCookie)
        const accountLabel = data.nickname || data.name || data.mobile || data.user_name || data.uid || '已登录用户'
        this.$set(this.accountLabelMap, this.currentProviderKey, accountLabel)
        this.appendLog(`Cookie 校验成功: ${accountLabel}`, 'success')
        createToast('Cookie 可用')
      } catch (error) {
        this.$set(this.accountLabelMap, this.currentProviderKey, '')
        this.appendLog(`Cookie 校验失败: ${error.message || error}`, 'error')
        createToast(error.message || 'Cookie 校验失败')
      } finally {
        this.testingCookie = false
      }
    },
    async browseTargetFolder() {
      if (!this.ensureCookieReady()) {
        return
      }

      this.browsingFolder = true
      this.appendLog(`开始读取 ${this.currentProvider.label} 目录 ${this.currentTargetDirId}`)
      try {
        const folderList = await listPanDirectoryFolders(this.currentProviderKey, this.currentCookie, this.currentTargetDirId)
        this.folderList = folderList
        this.appendLog(`目录 ${this.currentTargetDirId} 读取成功，找到 ${folderList.length} 个子文件夹`, 'success')
        if (folderList.length === 0) {
          createToast('读取成功，该目录下暂时无子文件夹')
        } else {
          createToast(`读取到 ${folderList.length} 个文件夹`)
        }
      } catch (error) {
        this.appendLog(`目录读取失败: ${error.message || error}`, 'error')
        createToast(error.message || '目录读取失败')
      } finally {
        this.browsingFolder = false
      }
    },
    selectFolder(item) {
      this.currentTargetDirId = String(item.fid)
      this.saveSettings(false)
      this.appendLog(`已选择目录: ${item.file_name || item.title || item.fid} (${item.fid})`, 'success')
    },
    async startTransfer() {
      if (!this.ensureCookieReady()) {
        return
      }

      let shareList = []
      try {
        shareList = parsePanShareInput(this.currentProviderKey, this.currentShareInput)
      } catch (error) {
        createToast(error.message || '分享链接格式不正确')
        return
      }

      this.transferring = true
      this.transferSummary = ''
      let successCount = 0
      let failedCount = 0

      this.appendLog(`准备开始转存 ${this.currentProvider.label} 链接，共 ${shareList.length} 条，目标目录 fid: ${this.currentTargetDirId}`)

      for (let index = 0; index < shareList.length; index += 1) {
        const share = shareList[index]
        const prefix = `[${index + 1}/${shareList.length}]`
        this.appendLog(`${prefix} 开始处理 ${share.url}`)
        try {
          const result = await transferPanShare({
            providerKey: this.currentProviderKey,
            cookie: this.currentCookie,
            shareInput: share,
            toPdirFid: this.currentTargetDirId,
            onProgress: (message) => {
              this.appendLog(`${prefix} ${message}`)
            }
          })
          successCount += 1
          this.appendLog(`${prefix} 转存完成: ${result.title}，共 ${result.itemCount} 项`, 'success')
        } catch (error) {
          failedCount += 1
          this.appendLog(`${prefix} 转存失败: ${error.message || error}`, 'error')
        }
      }

      this.transferSummary = `${this.currentProvider.label} 本次转存结束: 成功 ${successCount} 条，失败 ${failedCount} 条`
      this.appendLog(this.transferSummary, failedCount > 0 ? 'error' : 'success')
      createToast(this.transferSummary)
      this.transferring = false
    }
  }
});

;// CONCATENATED MODULE: ./src/views/pan.vue?vue&type=script&lang=js&
 /* harmony default export */ const views_panvue_type_script_lang_js_ = (panvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/pan.vue?vue&type=style&index=0&id=27ff97f3&lang=less&scoped=true&
var panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_ = __webpack_require__(6018);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/pan.vue?vue&type=style&index=0&id=27ff97f3&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options = {};

panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_/* default */.Z, panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_options);




       /* harmony default export */ const views_panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_ = (panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_/* default */.Z && panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_/* default.locals */.Z.locals ? panvue_type_style_index_0_id_27ff97f3_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/views/pan.vue?vue&type=style&index=0&id=27ff97f3&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/views/pan.vue



;


/* normalize component */

var pan_component = normalizeComponent(
  views_panvue_type_script_lang_js_,
  panvue_type_template_id_27ff97f3_scoped_true_render,
  panvue_type_template_id_27ff97f3_scoped_true_staticRenderFns,
  false,
  null,
  "27ff97f3",
  null
  
)

/* hot reload */
if (false) { var pan_api; }
pan_component.options.__file = "src/views/pan.vue"
/* harmony default export */ const pan = (pan_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=template&id=4ad41bb8&scoped=true&
var searchvue_type_template_id_4ad41bb8_scoped_true_render = function () {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showSearchPage,
          expression: "showSearchPage",
        },
      ],
      attrs: { id: "search-page" },
    },
    [
      _c(
        "div",
        { attrs: { id: "search-page-top" } },
        [
          _c("van-sticky", [
            _c(
              "div",
              { staticClass: "search-input-btn" },
              [
                _c("van-loading", {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.showSearchLoad,
                      expression: "showSearchLoad",
                    },
                  ],
                  attrs: { color: "#ee0000", type: "spinner", size: "25" },
                }),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.inputSeachword,
                      expression: "inputSeachword",
                    },
                  ],
                  attrs: { type: "text", name: "searchword" },
                  domProps: { value: _vm.inputSeachword },
                  on: {
                    keyup: function ($event) {
                      if (
                        !$event.type.indexOf("key") &&
                        _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                      ) {
                        return null
                      }
                      return _vm.search(_vm.inputSeachword)
                    },
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.inputSeachword = $event.target.value
                    },
                  },
                }),
                _vm._v(" "),
                _c(
                  "van-button",
                  {
                    attrs: { size: "small" },
                    on: {
                      click: function ($event) {
                        return _vm.search(_vm.inputSeachword)
                      },
                    },
                  },
                  [_vm._v("搜索")]
                ),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c("van-icon", {
            attrs: { id: "close-search-btn", name: "close", color: "#66ccff" },
            on: {
              click: function () {
                this$1.showSearchPage = !this$1.showSearchPage
              },
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { id: "search-page-bottom" } },
        [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.showResult.length !== 0,
                  expression: "showResult.length !== 0",
                },
              ],
            },
            [
              _c(
                "van-collapse",
                {
                  model: {
                    value: _vm.activeNames,
                    callback: function ($$v) {
                      _vm.activeNames = $$v
                    },
                    expression: "activeNames",
                  },
                },
                _vm._l(_vm.showResult, function (item, index) {
                  return _c(
                    "van-collapse-item",
                    {
                      key: index,
                      staticClass: "origin-list",
                      attrs: { title: item.webName, name: index },
                    },
                    [
                      _c(
                        "van-cell-group",
                        {
                          style: {
                            textAlign: "left",
                            background: "rgb(245 245 245 / 33%)",
                            padding: "2px 0",
                          },
                        },
                        _vm._l(item.findres, function (item2, index2) {
                          return _c(
                            "div",
                            {
                              key: index2,
                              staticClass: "origin-image-list",
                              attrs: { title: item2.name },
                              on: {
                                click: function ($event) {
                                  return _vm.toResultWeb(item2.url)
                                },
                              },
                            },
                            [
                              _c("van-image", {
                                attrs: {
                                  width: "100",
                                  height: "150",
                                  src: item2.imageUrl,
                                },
                                on: {
                                  error: function ($event) {
                                    return _vm.loadImgError(item2, item.webName)
                                  },
                                },
                                scopedSlots: _vm._u(
                                  [
                                    {
                                      key: "loading",
                                      fn: function () {
                                        return [
                                          _c("van-loading", {
                                            attrs: {
                                              type: "spinner",
                                              size: "25",
                                            },
                                          }),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ],
                                  null,
                                  true
                                ),
                              }),
                              _vm._v(" "),
                              _c("p", [_vm._v(_vm._s(item2.name))]),
                            ],
                            1
                          )
                        }),
                        0
                      ),
                    ],
                    1
                  )
                }),
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("van-empty", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.showResult.length === 0,
                expression: "showResult.length === 0",
              },
            ],
            attrs: { description: "搜索内容" },
          }),
        ],
        1
      ),
    ]
  )
}
var searchvue_type_template_id_4ad41bb8_scoped_true_staticRenderFns = []
searchvue_type_template_id_4ad41bb8_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/search.vue?vue&type=template&id=4ad41bb8&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const searchvue_type_script_lang_js_ = ({
  name: 'SearchPage',
  data() {
    return {
      showSearchPage: false,
      inputSeachword: '',
      showSearchLoad: false,
      searchTime: 0,
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      searcKey: '',
      searchInfo: [],
      showResult: [],
      showSearchPart: false
    }
  },
  watch: {
    'searchInfo.length': {
      handler(newLen, oldLen) {
        if (newLen !== oldLen) {
          this.getSearchContent(newLen)
        }
      }
    }
  },
  mounted() {
    this.$bus.$on('showSearchPage', () => { this.showSearchPage = !this.showSearchPage })
  },
  methods: {
    toResultWeb(url) {
      window.open(url, '_blank')
    },
    async loadImgError(item, name) {
      const url = item.imageUrl
      item.imgErrorTime === undefined ? item.imgErrorTime = 0 : ''

      if (item.imgErrorTime !== 1) {
        const blob = await (0,utils/* request */.WY)({
          method: 'get',
          url,
          responseType: 'blob',
          headers: item.headers || '',
          timeout: 10000 })
        const newUrl = window.URL.createObjectURL(blob.response)
        item.imgErrorTime++
        item.imageUrl = newUrl
      }
    },
    getSearchContent(len) {
      const oneWebInfo = this.searchInfo[len - 1]
      this.showResult.push(oneWebInfo)
    },
    async search(keyword) {
      if (keyword.length < 2) {
        (0,external_vant_.Toast)({
          message: '至少2个字符',
          getContainer: '#search-page',
          position: 'center'
        })
        return
      }
      this.searchTime++
      const currentSearchTime = this.searchTime
      this.showSearchLoad = true
      this.showResult = []
      for (let i = 0; i < comics/* comicsWebInfo.length */.Os.length; i++) {
        const item = comics/* comicsWebInfo */.Os[i]
        if (!item.searchTemplate_1 && !item.searchFun) {
          continue
        }

        let findres = []
        if (item.searchTemplate_1) {
          try {
            findres = await (0,comics/* searchFunTemplate_1 */.Ni)(item, keyword)
          } catch (error) {
            (0,external_vant_.Toast)({
              message: item.webName + '\n' + error,
              getContainer: '#search-page',
              position: 'center'
            })
          }
        }

        if (!item.searchTemplate_1 && item.searchFun) {
          try {
            findres = await item.searchFun(keyword)
          } catch (error) {
            (0,external_vant_.Toast)({
              message: item.webName + '\n' + error,
              getContainer: '#search-page',
              position: 'center'
            })
          }
        }

        if (currentSearchTime === this.searchTime) {
          let showLen
          findres.length > 8 ? showLen = 8 : showLen = findres.length
          this.searchInfo.push({
            webName: item.webName,
            findres: findres.slice(0, showLen)
          })
        }
      }
      this.showSearchLoad = false
    }
  }
});

;// CONCATENATED MODULE: ./src/components/search.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=style&index=0&id=4ad41bb8&lang=less&scoped=true&
var searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_ = __webpack_require__(3655);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/search.vue?vue&type=style&index=0&id=4ad41bb8&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options = {};

searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default */.Z, searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_options);




       /* harmony default export */ const components_searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_ = (searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default */.Z && searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default.locals */.Z.locals ? searchvue_type_style_index_0_id_4ad41bb8_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/components/search.vue?vue&type=style&index=0&id=4ad41bb8&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/components/search.vue



;


/* normalize component */

var search_component = normalizeComponent(
  components_searchvue_type_script_lang_js_,
  searchvue_type_template_id_4ad41bb8_scoped_true_render,
  searchvue_type_template_id_4ad41bb8_scoped_true_staticRenderFns,
  false,
  null,
  "4ad41bb8",
  null
  
)

/* hot reload */
if (false) { var search_api; }
search_component.options.__file = "src/components/search.vue"
/* harmony default export */ const search = (search_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//














/* harmony default export */ const appvue_type_script_lang_js_ = ({
  name: 'App',
  components: {
    Home: home,
    Table: table,
    Cover: cover,
    Down: down,
    Follow: follow,
    Setting: setting,
    Metadata: metadata,
    Pan: pan,
    Search: search
  },
  data() {
    return {
      isHide: true,
      showSearchPage: false,
      active: 1,
      titles: ['漫画网站', '加载', '封面', '下载', '追更', '设置', '元数据', '网盘'],
      comicInfo: {}
    }
  },
  computed: {
    current() {
      return this.active
    }
  },
  watch: {
    active(val) {
      this.$refs.swipe.swipeTo(val)
    }
  },
  created() {
    this.Init()
  },
  mounted() {
    this.$bus.$on('changTab', (val) => { this.active = val })
  },
  methods: {
    hide() {
      this.isHide = !this.isHide
    },
    async Init() {
      (0,comics/* matchWeb */.HL)(window.location.href)
    }
  }
});

;// CONCATENATED MODULE: ./src/app.vue?vue&type=script&lang=js&
 /* harmony default export */ const src_appvue_type_script_lang_js_ = (appvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=less&scoped=true&
var appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_ = __webpack_require__(4871);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options = {};

appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default */.Z, appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_options);




       /* harmony default export */ const lib_vue_loader_options_src_appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_ = (appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default */.Z && appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals ? appvue_type_style_index_0_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=less&scoped=true&

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=1&id=5ef48958&lang=less&scoped=true&
var appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_ = __webpack_require__(3502);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=1&id=5ef48958&lang=less&scoped=true&

      
      
      
      
      
      
      
      
      

var appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options = {};

appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.styleTagTransform = (styleTagTransform_default());
appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.setAttributes = (setAttributesWithoutAttributes_default());

      appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.insert = insertBySelector_default().bind(null, "head");
    
appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.domAPI = (styleDomAPI_default());
appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options.insertStyleElement = (insertStyleElement_default());

var appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_update = injectStylesIntoStyleTag_default()(appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default */.Z, appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_options);




       /* harmony default export */ const lib_vue_loader_options_src_appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_ = (appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default */.Z && appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals ? appvue_type_style_index_1_id_5ef48958_lang_less_scoped_true_/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/app.vue?vue&type=style&index=1&id=5ef48958&lang=less&scoped=true&

;// CONCATENATED MODULE: ./src/app.vue



;



/* normalize component */

var app_component = normalizeComponent(
  src_appvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "5ef48958",
  null
  
)

/* hot reload */
if (false) { var app_api; }
app_component.options.__file = "src/app.vue"
/* harmony default export */ const app = (app_component.exports);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./src/styles/global_scss.less
var global_scss = __webpack_require__(2213);
;// CONCATENATED MODULE: ./src/styles/global_scss.less

      
      
      
      
      
      
      
      
      

var global_scss_options = {};

global_scss_options.styleTagTransform = (styleTagTransform_default());
global_scss_options.setAttributes = (setAttributesWithoutAttributes_default());

      global_scss_options.insert = insertBySelector_default().bind(null, "head");
    
global_scss_options.domAPI = (styleDomAPI_default());
global_scss_options.insertStyleElement = (insertStyleElement_default());

var global_scss_update = injectStylesIntoStyleTag_default()(global_scss/* default */.Z, global_scss_options);




       /* harmony default export */ const styles_global_scss = (global_scss/* default */.Z && global_scss/* default.locals */.Z.locals ? global_scss/* default.locals */.Z.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[2]!./src/styles/global.less
var global = __webpack_require__(8217);
;// CONCATENATED MODULE: ./src/styles/global.less

      
      
      
      
      
      
      
      
      

var global_options = {};

global_options.styleTagTransform = (styleTagTransform_default());
global_options.setAttributes = (setAttributesWithoutAttributes_default());

      global_options.insert = insertBySelector_default().bind(null, "head");
    
global_options.domAPI = (styleDomAPI_default());
global_options.insertStyleElement = (insertStyleElement_default());

var global_update = injectStylesIntoStyleTag_default()(global/* default */.Z, global_options);




       /* harmony default export */ const styles_global = (global/* default */.Z && global/* default.locals */.Z.locals ? global/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/main.js
/* eslint-disable no-undef */













var id = null
var appVm = null
var appLoadDefault = null
var tryLoadTimes = 0
var hasStartedFollowCheck = false
var hasStartedUpdateCheck = false
loadMenu(tryLoadTimes)

function loadMenu() {
  tryLoadTimes += 1
  try {
    if (!config/* isDev */.r8) {
      (0,setup/* appLoadinit */.Iq)()
    }
    appLoadDefault = (0,setup/* getStorage */.cF)('appLoadDefault')
    GM_registerMenuCommand(`加载UI (Alt + ${appLoadDefault.loadHotKey})`, openUI)
    GM_registerMenuCommand(`重置所有数据`, setup/* setinit */.zU)
    GM_registerMenuCommand('检查脚本更新', () => runScriptUpdateCheck({ manual: true }))
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toUpperCase() === appLoadDefault.loadHotKey.toUpperCase()) {
        openUI(0)
      }
    })
    if (appLoadDefault.isShowUI) {
      openUI(0)
    }
    setTimeout(() => {
      runUpdateCheck()
      runFollowCheck()
    }, 0)
  } catch (error) {
    console.log('loadError: ', error)
    openUI(tryLoadTimes)
  }
}

async function runUpdateCheck() {
  if (hasStartedUpdateCheck || config/* isDev */.r8) {
    return
  }

  hasStartedUpdateCheck = true
  try {
    await runScriptUpdateCheck()
  } catch (error) {
    console.log('updateCheckError: ', error)
  }
}

async function runFollowCheck() {
  if (hasStartedFollowCheck || config/* isDev */.r8) {
    return
  }
  if (!(0,comics/* findWebByUrl */.jL)(window.location.href)) {
    return
  }
  if (!canAutoCheckFollow()) {
    return
  }
  hasStartedFollowCheck = true
  try {
    await checkAllFollowItems()
  } catch (error) {
    console.log('followCheckError: ', error)
  }
}

async function openUI(times = 0) {
  if (appVm !== null) {
    appVm.isHide = false
    return appVm
  }
  const vm = await loadUI(times)
  if (vm) {
    vm.isHide = false
    appVm = vm
  }
  return vm
}

async function loadUI(times) {
  if (appVm !== null) {
    return appVm
  }

  if (!config/* isDev */.r8) {
    // 首次运行脚本无存储数据，无加载菜单， 重新载入
    if (times === 1) {
      loadMenu()
      return null
    }
  }

  var Vant = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 8871, 23))
  // import ('vant/lib/index.css')
  external_Vue_default().use(Vant)

  id = `app_vue_${Date.now()}`
  const root = document.createElement('div')
  root.id = id
  document.body.appendChild(root)
  ;(external_Vue_default()).prototype.$bus = new (external_Vue_default())()
  ;(external_Vue_default()).prototype.$getType = utils/* getType */.oL

  if (config/* isDev */.r8) {
    await (0,utils/* loadStyle2 */.HM)('https://unpkg.com/vant@2.12/lib/index.css')
    return new (external_Vue_default())({
      el: `#${id}`,
      render: h => h(app)
    })
  } else {
  // eslint-disable-next-line no-undef
    GM_addStyle(GM_getResourceText('vantcss'))
    return new (external_Vue_default())({
      el: `#${id}`,
      render: h => h(app)
    })
  }
}

})();

/******/ })()
;