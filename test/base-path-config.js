/**
 * Base Path Configuration System
 * 统一的基路径管理系统
 */

// 环境配置
const BASE_PATH_CONFIG = {
    // 开发环境 - 本地文件
    development: {
        base: './',
        assets: './',
        games: './'
    },
    
    // 测试环境 - 相对路径
    testing: {
        base: '/miaoda-games-demo/test/',
        assets: '/miaoda-games-demo/test/',
        games: '/miaoda-games-demo/test/'
    },
    
    // 生产环境 - CDN
    production: {
        base: 'https://cdn.example.com/games/',
        assets: 'https://cdn.example.com/assets/',
        games: 'https://games.example.com/'
    },
    
    // GitHub Pages
    'github-pages': {
        base: '/miaoda-games-demo/',
        assets: '/miaoda-games-demo/assets/',
        games: '/miaoda-games-demo/games/'
    }
};

/**
 * 获取当前环境的基路径配置
 */
function getBasePathConfig() {
    // 检测当前环境
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return BASE_PATH_CONFIG.development;
    } else if (hostname.includes('github.io')) {
        return BASE_PATH_CONFIG['github-pages'];
    } else if (protocol === 'file:') {
        return BASE_PATH_CONFIG.development;
    } else {
        return BASE_PATH_CONFIG.production;
    }
}

/**
 * 动态设置 base 标签
 */
function setBasePath(customPath = null) {
    const config = customPath ? { base: customPath } : getBasePathConfig();
    
    // 移除现有的 base 标签
    const existingBase = document.querySelector('base');
    if (existingBase) {
        existingBase.remove();
    }
    
    // 创建新的 base 标签
    const baseTag = document.createElement('base');
    baseTag.href = config.base;
    
    // 插入到 head 的开始位置
    document.head.insertBefore(baseTag, document.head.firstChild);
    
    console.log('Base path set to:', config.base);
    return config;
}

/**
 * 构建资源路径
 */
function buildAssetPath(relativePath, type = 'assets') {
    const config = getBasePathConfig();
    const basePath = config[type] || config.base;
    
    // 确保路径正确拼接
    const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    
    return cleanBase + cleanPath;
}

// 自动初始化（可选）
if (typeof window !== 'undefined') {
    // 页面加载完成后自动设置
    document.addEventListener('DOMContentLoaded', function() {
        if (window.AUTO_SET_BASE_PATH !== false) {
            setBasePath();
        }
    });
}

// 导出函数供全局使用
window.BasePathManager = {
    setBasePath,
    getBasePathConfig,
    buildAssetPath,
    config: BASE_PATH_CONFIG
};