// 全局变量
let images = [];
const API_BASE = '';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initUpload();
    loadImages();
    initPaste();
});

// 初始化上传功能
function initUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    // 点击上传
    dropZone.addEventListener('click', () => fileInput.click());

    // 文件选择
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 拖拽上传
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0088cc';
        dropZone.style.background = 'rgba(0, 136, 204, 0.05)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#e2e8f0';
        dropZone.style.background = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#e2e8f0';
        dropZone.style.background = '';
        handleFiles(e.dataTransfer.files);
    });
}

// 初始化粘贴上传
function initPaste() {
    document.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                handleFiles([file]);
            }
        }
    });
}

// 处理文件上传
async function handleFiles(files) {
    const tags = document.getElementById('tagsInput').value;
    const folder = document.getElementById('folderInput').value || 'default';

    for (let file of files) {
        if (!file.type.startsWith('image/')) {
            alert('只能上传图片文件');
            continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', tags);
        formData.append('folder', folder);

        try {
            showLoading('上传中...');
            const response = await fetch(`${API_BASE}/api/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                showSuccess('上传成功！');
                await loadImages();
                showLinkModal(result.data);
            } else {
                showError(result.error || '上传失败');
            }
        } catch (error) {
            showError('上传失败: ' + error.message);
        }
    }
}

// 从URL上传
async function uploadFromURL() {
    const url = document.getElementById('urlInput').value;
    const tags = document.getElementById('tagsInput').value;
    const folder = document.getElementById('folderInput').value || 'default';

    if (!url) {
        alert('请输入图片URL');
        return;
    }

    try {
        showLoading('下载并上传中...');
        const response = await fetch(`${API_BASE}/api/upload-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, tags, folder })
        });

        const result = await response.json();
        
        if (result.success) {
            showSuccess('上传成功！');
            document.getElementById('urlInput').value = '';
            await loadImages();
            showLinkModal(result.data);
        } else {
            showError(result.error || '上传失败');
        }
    } catch (error) {
        showError('上传失败: ' + error.message);
    }
}

// 加载图片列表
async function loadImages(folder = '', tag = '') {
    try {
        let url = `${API_BASE}/api/images?limit=100`;
        if (folder) url += `&folder=${folder}`;
        if (tag) url += `&tag=${tag}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            images = result.data;
            renderGallery(images);
        }
    } catch (error) {
        showError('加载失败: ' + error.message);
    }
}

// 渲染图片画廊
function renderGallery(imageList) {
    const gallery = document.getElementById('imageGallery');
    
    if (imageList.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">暂无图片</p>';
        return;
    }

    gallery.innerHTML = imageList.map(img => `
        <div class="image-card">
            <img src="${img.url}" alt="${img.filename}" onclick="showImageDetail('${img.id}')">
            <div class="image-info">
                <div style="font-weight: 500; margin-bottom: 5px;">${img.filename}</div>
                <div style="font-size: 12px; color: #64748b;">
                    ${formatFileSize(img.size)} · ${formatDate(img.uploadTime)}
                </div>
                ${img.tags.length > 0 ? `
                    <div style="margin-top: 8px;">
                        ${img.tags.map(tag => `<span style="background: #e0f2fe; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px;">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="image-actions">
                <button class="btn" onclick="copyLink('${img.url}')" style="flex: 1;">复制链接</button>
                <button class="btn" onclick="showLinkModal(${JSON.stringify(img).replace(/"/g, '&quot;')})" style="flex: 1;">更多</button>
                <button class="btn" onclick="deleteImage('${img.id}')" style="background: #ef4444; color: white;">删除</button>
            </div>
        </div>
    `).join('');
}

// 搜索图片
async function searchImages() {
    const query = document.getElementById('searchInput').value;
    
    if (!query) {
        loadImages();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
        const result = await response.json();

        if (result.success) {
            images = result.data;
            renderGallery(images);
        }
    } catch (error) {
        showError('搜索失败: ' + error.message);
    }
}

// 显示链接模态框
function showLinkModal(image) {
    const formats = {
        'URL': image.url,
        'Markdown': `![${image.filename}](${image.url})`,
        'HTML': `<img src="${image.url}" alt="${image.filename}">`,
        'BBCode': `[img]${image.url}[/img]`
    };

    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%;">
            <h3 style="margin-bottom: 20px;">图片链接</h3>
            ${Object.entries(formats).map(([name, value]) => `
                <div style="margin-bottom: 15px;">
                    <strong>${name}:</strong>
                    <div class="link-output" onclick="copyText('${value.replace(/'/g, "\\'")}')">
                        ${value}
                    </div>
                </div>
            `).join('')}
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()" style="width: 100%; margin-top: 20px;">关闭</button>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
}

// 删除图片
async function deleteImage(id) {
    if (!confirm('确定要删除这张图片吗？')) return;

    const password = prompt('请输入管理员密码（如果设置了）：');

    try {
        const response = await fetch(`${API_BASE}/api/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('删除成功');
            loadImages();
        } else {
            showError(result.error || '删除失败');
        }
    } catch (error) {
        showError('删除失败: ' + error.message);
    }
}

// 复制链接
function copyLink(url) {
    copyText(url);
}

// 复制文本
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('已复制到剪贴板');
    }).catch(() => {
        showError('复制失败');
    });
}

// 工具函数
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN');
}

function showLoading(msg) {
    // 简单的加载提示
    console.log('Loading:', msg);
}

function showSuccess(msg) {
    alert('✅ ' + msg);
}

function showError(msg) {
    alert('❌ ' + msg);
}
