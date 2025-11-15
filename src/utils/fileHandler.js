/**
 * 文件处理工具函数
 */

import { 
  PDF_TYPE, 
  WORD_TYPE, 
  EXCEL_TYPE, 
  PPT_TYPE, 
  VIDEO_TYPE, 
  Image_TYPE, 
  ZIP_TYPE, 
  OTHER_TYPE 
} from '@/constants/file_type'

// 可以在浏览器中打开的文件扩展名
const BROWSER_OPENABLE_EXTENSIONS = [
  // 图片
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico',
  // PDF
  'pdf',
  // 视频
  'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv',
  // 音频
  'mp3', 'wav', 'ogg', 'm4a', 'aac',
  // 文本
  'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'vue', 'jsx', 'tsx',
  // 代码文件
  'py', 'java', 'cpp', 'c', 'h', 'hpp', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt',
  'sh', 'bash', 'ps1', 'bat', 'cmd',
  // 其他
  'csv', 'log', 'yml', 'yaml', 'toml', 'ini', 'conf', 'config'
]

// 不支持在浏览器中打开的文件扩展名
const UNSUPPORTED_EXTENSIONS = [
  'dll', 'exe', 'msi', 'deb', 'rpm', 'pkg', 'dmg',
  'bin', 'iso', 'img', 'vhd', 'vhdx',
  'sys', 'drv', 'ocx', 'cab'
]

/**
 * 从文件名获取扩展名
 */
export function getFileExtension(filename) {
  if (!filename) return ''
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return ''
  return filename.substring(lastDot + 1).toLowerCase()
}

/**
 * 判断文件是否可以在浏览器中打开
 */
export function canOpenInBrowser(file) {
  if (!file || !file.name) return false
  
  const ext = getFileExtension(file.name)
  
  // 如果不支持的文件类型，直接返回 false
  if (UNSUPPORTED_EXTENSIONS.includes(ext)) {
    return false
  }
  
  // 根据文件类型判断
  switch (file.type) {
    case PDF_TYPE:
    case Image_TYPE:
    case VIDEO_TYPE:
      return true
    case WORD_TYPE:
    case EXCEL_TYPE:
    case PPT_TYPE:
      // Office 文件需要在线预览服务支持，这里假设有 URL 就可以打开
      return !!file.url
    case ZIP_TYPE:
      // ZIP 文件通常不支持直接在浏览器打开
      return false
    case OTHER_TYPE:
      // 其他类型根据扩展名判断
      return BROWSER_OPENABLE_EXTENSIONS.includes(ext)
    default:
      return BROWSER_OPENABLE_EXTENSIONS.includes(ext)
  }
}

/**
 * 获取文件的 MIME 类型
 */
export function getFileMimeType(filename) {
  const ext = getFileExtension(filename)
  const mimeTypes = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    // PDF
    pdf: 'application/pdf',
    // 视频
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    // 音频
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    // 文本
    txt: 'text/plain',
    md: 'text/markdown',
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ts: 'application/typescript',
    // Office (需要在线预览)
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

