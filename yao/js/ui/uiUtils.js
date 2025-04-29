// js/ui/uiUtils.js

/**
 * 清空指定容器元素的所有子节点
 * @param {HTMLElement} containerElement - 需要清空的容器元素
 */
export function clearContainer(containerElement) {
    if (containerElement) {
        containerElement.innerHTML = '';
    }
}

// 后续可以在这里添加其他通用的 UI 工具函数
// 例如： createElement(tag, attributes, children), showLoading(), hideLoading() 等