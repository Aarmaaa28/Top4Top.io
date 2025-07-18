import axios from 'axios'
import FormData from 'form-data'
import { load } from 'cheerio'

export async function uploadTop4Top(buffer, filename) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new TypeError('Invalid buffer: must be a non-empty Buffer')
  }
  if (buffer.length > 30 * 1024 * 1024) {
    throw new RangeError('File too large: maximum size is 30MB')
  }
  
  const form = new FormData()
  form.append('file_0_', buffer, {
    filename: filename
  })
  form.append('submitr', '[ رفع الملفات ]')

  const { data } = await axios.post('https://top4top.io/index.php', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://top4top.io/',
      'Origin': 'https://top4top.io',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    },
    maxBodyLength: Infinity
  })

  const url = load(data)('input.all_boxes').attr('value')
  if (!url || !/^https:\/\/\w+\.top4top\.io\/.+$/.test(url)) {
    throw new Error('Upload failed: unable to retrieve download link from Top4Top')
  }
  return url
}