// 图片上传 API
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const tags = formData.get('tags') || '';
    const folder = formData.get('folder') || 'default';

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: '没有文件' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ success: false, error: '只支持图片文件' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取配置
    const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return new Response(JSON.stringify({ success: false, error: '配置错误：缺少 Bot Token 或 Chat ID' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 上传到 Telegram
    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', CHAT_ID);
    telegramFormData.append('photo', file);

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: telegramFormData
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Telegram 上传失败：' + (telegramResult.description || '未知错误')
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取图片信息
    const photo = telegramResult.result.photo;
    const largestPhoto = photo[photo.length - 1];
    const fileId = largestPhoto.file_id;

    // 获取文件路径
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileResult = await fileResponse.json();

    if (!fileResult.ok) {
      return new Response(JSON.stringify({ success: false, error: '获取文件信息失败' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileResult.result.file_path}`;

    // 生成唯一 ID
    const imageId = generateId();
    const timestamp = Date.now();

    // 保存到 KV
    const imageData = {
      id: imageId,
      url: fileUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      telegramFileId: fileId,
      uploadTime: timestamp,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      folder: folder
    };

    await env.IMAGE_DB.put(imageId, JSON.stringify(imageData));

    return new Response(JSON.stringify({ 
      success: true, 
      data: imageData 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}
