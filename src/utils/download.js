import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { DIR_TYPE } from '@/constants/file_type'

/**
 * 下载文件并返回Blob
 * @param {string} url - 文件URL
 * @param {string} fileName - 文件名
 * @param {number} timeout - 超时时间(毫秒)
 * @returns {Promise<Blob>}
 */
export const downloadFileFromUrl = async (url, fileName, timeout = 30000) => {
    // 检查URL是否有效
    if (!url || !url.startsWith('http')) {
      throw new Error('无效的文件URL')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`)
    }
    
    const blob = await response.blob()
    return blob

}

/**
 * 递归处理文件夹和文件
 * @param {Object} element - 文件或文件夹元素
 * @param {JSZip} zipFolder - JSZip文件夹实例
 * @param {string} path - 当前路径
 * @returns {Promise<void>}
 */
export const processElement = async (element, zipFolder, path = '') => {
  if (!element) return
  
  const currentPath = path ? `${path}/` : ''
  
  if (element.type === DIR_TYPE) {
    // 处理文件夹
    const folderName = element.name || '未命名文件夹'
    const subFolder = zipFolder.folder(folderName)
    
    if (element.children && typeof element.children === 'object') {
      // 遍历子元素
      const processPromises = []
      for (const key in element.children) {
        if (element.children.hasOwnProperty(key)) {
          processPromises.push(
            processElement(element.children[key], subFolder, `${currentPath}${folderName}`)
          )
        }
      }
      // 并行处理所有子元素
      await Promise.all(processPromises)
    }
  } else {
    // 处理文件
    const fileName = element.name || '未命名文件'
    const fileExt = element.ext && element.ext !== '???' ? `.${element.ext}` : ''
    const fullFileName = `${fileName}${fileExt}`
    

    let fileContent
    
    if (element.url && element.url.startsWith('http')) {
    // 下载远程文件
    fileContent = await downloadFileFromUrl(element.url, fullFileName)
    } else {
    // 创建本地文件或占位文件
    const content = element.url || `这是一个占位文件\n文件名: ${fileName}\n创建时间: ${new Date().toLocaleString()}`
    fileContent = new Blob([content], { type: 'text/plain' })
    }
    
    zipFolder.file(fullFileName, fileContent)
  }
}



/**
 * 下载选中的文件为ZIP
 * @param {Array} selectedFiles - 选中的文件数组
 * @param {string} zipName - ZIP文件名(可选)
 * @returns {Promise<boolean>} 是否下载成功
 */
export const downloadSelectedFilesAsZip = async (selectedFiles, zipName = null) => {
  if (!selectedFiles || selectedFiles.length === 0) {
    ElMessage.warning('请选择要下载的文件')
    return false
  }

  try {
    console.log('🚀 开始创建选中文件的ZIP...')
    const zip = new JSZip()
    
    // 处理选中的文件
    const processPromises = selectedFiles.map(element => 
      processElement(element, zip)
    )
    
    await Promise.all(processPromises)
    
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
    
    const defaultZipName = `选中文件_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`
    const finalZipName = zipName || defaultZipName
    
    saveAs(content, finalZipName)
    console.log('✅ 选中文件ZIP下载完成:', finalZipName)
    return true
    
  } catch (error) {
    throw new Error(`创建选中文件ZIP时出错: ${error.message}`)
  }
}

/**
 * 获取下载进度信息（如果需要显示进度条可以使用）
 * @param {Array} elements - 所有要下载的元素
 * @returns {Object} 进度信息
 */
export const getDownloadStats = (elements) => {
  let totalFiles = 0
  let totalFolders = 0
  
  const countElements = (element) => {
    if (element.type === DIR_TYPE) {
      totalFolders++
      if (element.children) {
        for (const key in element.children) {
          countElements(element.children[key])
        }
      }
    } else {
      totalFiles++
    }
  }
  
  if (Array.isArray(elements)) {
    elements.forEach(countElements)
  } else if (typeof elements === 'object') {
    for (const key in elements) {
      countElements(elements[key])
    }
  }
  
  return {
    totalFiles,
    totalFolders,
    totalElements: totalFiles + totalFolders
  }
}

export default {
  downloadSelectedFilesAsZip,
  getDownloadStats
}