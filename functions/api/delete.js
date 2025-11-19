// 删除图片 API
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: '缺少图片 ID' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从 KV 删除
    await env.IMAGE_DB.delete(id);

    return new Response(JSON.stringify({ success: true }), {
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
