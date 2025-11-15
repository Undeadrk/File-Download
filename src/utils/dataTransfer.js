import { Response } from "@/types/response";
import { FileItem } from "@/types/fileDTO";




// formatFileSize 格式化文件大小
export function formatFileSize(size) {
  if (size === 0 || !size) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}



export function fileItemTransfer(res) {
  // 首先验证响应格式
  if (!(res instanceof Response)) {
    throw new Error('响应数据格式错误');
  }
  // 响应正确与否已经在api中验证过完毕,此处无需验证
  let fileList = []
  for(let item of res.data.list){
    let fileItem = new FileItem(
      item.id,
      item.name,
      item.type,
      item.parent_id,
      item.need_input,
      item.level,
      item.status,
      item.createtime,
      item.updatetime,
      item.file_url,
    )
    fileList.push(fileItem)
  }
  return fileList
}
