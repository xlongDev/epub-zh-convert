import { convertFile } from '../../utils/zipUtils';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // 禁用默认的 bodyParser，使用 formidable 处理文件上传
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('文件解析失败:', err);
        return res.status(500).json({ error: '文件解析失败' });
      }

      try {
        console.log('上传的文件:', files);
        console.log('转换方向:', fields.direction);

        const direction = fields.direction;

        // 确保 files.files 是数组
        const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];

        if (!uploadedFiles || uploadedFiles.length === 0) {
          return res.status(400).json({ error: '未上传文件或文件格式不正确' });
        }

        const results = [];
        const abortController = new AbortController(); // 创建 AbortController

        for (const file of uploadedFiles) {
          const filePath = file.filepath;
          const fileName = file.originalFilename;

          if (!filePath || !fileName) {
            console.error('文件路径或文件名未定义:', file);
            continue; // 跳过无效文件
          }

          console.log('正在处理文件:', fileName);

          try {
            const fileBuffer = fs.readFileSync(filePath);
            const fileObj = {
              name: fileName,
              arrayBuffer: () => Promise.resolve(fileBuffer),
              type: file.mimetype,
            };

            console.log('文件内容已读取，开始转换...');

            const result = await convertFile(
              fileObj,
              (progress) => {
                console.log(`文件 ${fileName} 转换进度: ${progress}%`);
              },
              abortController.signal, // 传递有效的 AbortSignal
              direction
            );

            console.log('文件转换成功:', result);
            results.push(result);
            fs.unlinkSync(filePath); // 删除临时文件
          } catch (error) {
            console.error(`文件 ${fileName} 转换失败:`, error);
          }
        }

        console.log('转换结果:', results);
        res.status(200).json(results);
      } catch (error) {
        console.error('文件转换失败:', error);
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}