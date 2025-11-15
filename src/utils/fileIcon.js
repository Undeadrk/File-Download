import { DIR_TYPE, TXT_TYPE, PDF_TYPE, WORD_TYPE, EXCEL_TYPE, PPT_TYPE, VIDEO_TYPE, Image_TYPE, ZIP_TYPE, OTHER_TYPE, HTML_TYPE, EXE_TYPE, IPA_TYPE, ISO_TYPE, APK_TYPE } from '@/constants/file_type'
import dirIcon from '@/assets/icons/dir.svg?url'
import txtIcon from '@/assets/icons/txt.svg?url'
import pdfIcon from '@/assets/icons/pdf.svg?url'
import wordIcon from '@/assets/icons/word.svg?url'
import zipIcon from '@/assets/icons/zip.svg?url'
import excelIcon from '@/assets/icons/excel.svg?url'
import pptIcon from '@/assets/icons/ppt.svg?url'
import videoIcon from '@/assets/icons/video.svg?url'
import imageIcon from '@/assets/icons/image.svg?url'
import otherIcon from '@/assets/icons/other.svg?url'
import htmlIcon from '@/assets/icons/html.svg?url'
import exeIcon from '@/assets/icons/exe.svg?url'
import ipaIcon from '@/assets/icons/ipa.svg?url'
import isoIcon from '@/assets/icons/iso.svg?url'
import apkIcon from '@/assets/icons/apk.svg?url'
import audioIcon from '@/assets/icons/audio.svg?url'
import mdIcon from '@/assets/icons/md.svg?url'



// 根据文件类型获取图标
export function getFileIcon(type) {
  switch (type) {
    case DIR_TYPE:
      return dirIcon
    case TXT_TYPE:
      return txtIcon
    case PDF_TYPE:
      return pdfIcon
    case WORD_TYPE:
      return wordIcon
    case ZIP_TYPE:
      return zipIcon
    case EXCEL_TYPE:
      return excelIcon
    case PPT_TYPE:
      return pptIcon
    case VIDEO_TYPE:
      return videoIcon
    case Image_TYPE:
      return imageIcon
    case HTML_TYPE:
      return htmlIcon
    case EXE_TYPE:
      return exeIcon
    case IPA_TYPE:
      return ipaIcon
    case ISO_TYPE:
      return isoIcon
    case APK_TYPE:
      return apkIcon
    case OTHER_TYPE:
      return otherIcon
    default:
      // 未知类型，返回默认图标
      return otherIcon
  }
}

// 根据文件类型获取类型名称
export function getFileTypeName(type) {
  switch (type) {
    case DIR_TYPE:
      return '文件夹'
    case PDF_TYPE:
      return 'PDF'
    case WORD_TYPE:
      return 'Word'
    case ZIP_TYPE:
      return 'ZIP'
    case EXCEL_TYPE:
      return 'Excel'
    case PPT_TYPE:
      return 'PPT'
    case VIDEO_TYPE:
      return '视频'
    case Image_TYPE:
      return '图片'
    case OTHER_TYPE:
      return '其他'
    default:
      return '其他'
  }
}

// 判断是否为目录
export function isDirectory(type) {
  return type === DIR_TYPE
}

// 映射文件扩展名到图标类型常量
const EXTENSION_TO_ICON_KEY = {
  // 文档类型
  'pdf': 'pdf',
  'txt': 'txt',
  'doc': 'word',
  'docx': 'word',
  'xls': 'excel',
  'xlsx': 'excel',
  'ppt': 'ppt',
  'pptx': 'ppt',
  'md': 'md',
  // 媒体类型
  'mp4': 'video',
  'avi': 'video',
  'mov': 'video',
  'wmv': 'video',
  'flv': 'video',
  'mkv': 'video',
  'mp3': 'audio',
  'wav': 'audio',
  'ogg': 'audio',
  'flac': 'audio',
  'aac': 'audio',
  // 图片类型
  'jpg': 'image',
  'jpeg': 'image',
  'png': 'image',
  'gif': 'image',
  'bmp': 'image',
  'svg': 'image',
  'webp': 'image',
  // 压缩文件
  'zip': 'zip',
  'rar': 'zip',
  '7z': 'zip',
  'tar': 'zip',
  'gz': 'zip',
  'tgz': 'zip',
  // 其他常见类型
  'html': 'html',
  'htm': 'html',
  'exe': 'exe',
  'ipa': 'ipa',
  'iso': 'iso',
  'apk': 'apk'
};

// 映射图标类型到图标URL常量
const ICON_KEY_TO_ICON = {
  'folder': dirIcon,
  'pdf': pdfIcon,
  'txt': txtIcon,
  'word': wordIcon,
  'excel': excelIcon,
  'ppt': pptIcon,
  'video': videoIcon,
  'image': imageIcon,
  'zip': zipIcon,
  'html': htmlIcon,
  'exe': exeIcon,
  'ipa': ipaIcon,
  'iso': isoIcon,
  'apk': apkIcon,
  'audio': audioIcon,
  'md': mdIcon,
  'file': otherIcon
};

// 根据icon字符串获取图标URL
export function getIconByString(iconStr) {
  return ICON_KEY_TO_ICON[iconStr] || otherIcon;
}
/*
  根据文件名获取图标URL
  @param {string} name - 文件名
  @returns {string} - svg图标 url
*/
export function getIcon(file) {
  if (!file) return otherIcon;
  
  // 文件夹类型直接返回文件夹图标
  if (file.type === 'folder') {
    return dirIcon;
  }
  
  // 文件类型根据扩展名判断图标
  if (file.type === 'file') {
    const fileName = file.name || '';
    const lastDotIndex = fileName.lastIndexOf('.');
    
    // 无扩展名的文件返回其他类型图标
    if (lastDotIndex === -1) {
      return otherIcon;
    }
    
    const extension = fileName.slice(lastDotIndex + 1).toLowerCase();
    const iconKey = EXTENSION_TO_ICON_KEY[extension];
    
    return ICON_KEY_TO_ICON[iconKey] || otherIcon;
  }
  
  // 未知类型返回其他图标
  return otherIcon;
}

