<template>
  <div style="margin-bottom: 16px">可编辑计算公式 {{ defaultValue }}</div>
  <div class="edit-tag-textarea" ref="textareaRef">
    <div class="edit-tag-textarea__header">
      <el-button size="small" type="primary" @click="addData">添加</el-button>
    </div>
    <!-- 这里是编辑区域 -->
    <div
      class="edit-tag-textarea_input"
      ref="textareaContentRef"
      :id="contentId"
      @click="onClick($event)"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.delete="handleDelete"
      @input="handleInput"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// const props = defineProps([
//   'defaultValue',
//   'modelValue',
//   {
//     contentId: {
//       type: String,
//       default: 'contentId',
//     },
//   },
// ])
const props = defineProps({
  contentId: {
    type: String,
    default: 'contentId',
  },
  defaultValue: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const textareaRef = ref(null)
const textareaContentRef = ref(null)
const savedRange = ref(null)
const isLocked = ref(false)
const currentText = ref('')
const onFocus = function (e) {
  isLocked.value = true
}
const onBlur = function (e) {
  isLocked.value = false
}
const onClick = function (e) {
  isLocked.value = true
}
const handleDelete = function () {
  console.log('handleDelete')
}
const handleInput = function (e) {}

const addData = () => {
  // this.updateData(target.innerHTML)
  addTag('我们', { customId: '12', customType: 'applet', class: 'custom-tag' })
}

const addTag = (text, option) => {
  // 创建模版标签
  let node = document.createElement('tag')
  node.innerHTML = text
  // 添加id便于删除

  Object.entries(option).forEach((el) => {
    node.setAttribute(el[0], el[1])
  })

  // node.id = data.id
  // node.setAttribute('data', JSON.stringify(data));
  if (!savedRange.value) {
    // 聚焦移动到末尾
    textareaContentRef.value.focus()
    let range = document.createRange()
    range.selectNodeContents(textareaContentRef.value)
    range.collapse(false)
    let sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    setTimeout(() => {
      insertNode(node)
    }, 100)
  } else {
    insertNode(node)
  }
}
// 插入标签
const insertNode = (node) => {
  // 在内容中插入标签
  // 删掉选中的内容（如有）
  savedRange.value.deleteContents()
  // 插入node
  savedRange.value.insertNode(node)
  // 插入后焦点重新移动到对应的位置
  let movePosition = savedRange.value.endOffset
  window.getSelection().collapse(textareaContentRef.value, movePosition)
}

function getGuid() {
  // 生成随机ID
  return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
}

function selectHandler() {
  // 监听选定文本的变动
  let sel = window.getSelection()
  let range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null

  if (range && range.commonAncestorContainer.ownerDocument.activeElement.id === props.contentId) {
    console.log('selectHandler', range.commonAncestorContainer.ownerDocument.activeElement.id)
    savedRange.value = range
  } else {
    savedRange.value = null
  }
}

onMounted(() => {
  if (props.modelValue) {
    textareaContentRef.value.innerHTML = props.modelValue
  }
  document.addEventListener('selectionchange', selectHandler)
})

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', selectHandler)
})
</script>

<style lang="scss">
.title {
  text-align: center;
}

.edit-tag-textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid rgba($color: #000000, $alpha: 0.9);
  position: relative;
  &__header {
    height: 36px;
    background: rgba($color: #000000, $alpha: 0.03);
    display: flex;
    align-items: center;
    color: rgba($color: #000000, $alpha: 0.6);
    padding: 0 16px;
    .add-item {
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      .icon {
        margin-right: 4px;
        color: rgba($color: #000000, $alpha: 0.3);
        &.insertImg {
          width: 16px;
          height: 16px;
          display: inline-block;
          background: url('~@/assets/images/message/insert.svg') no-repeat;
          opacity: 0.6;
        }
      }
      .fangxiang {
        margin-left: 4px;
        color: rgba($color: #000000, $alpha: 0.3);
      }
    }
    .add-variable {
      padding-right: 16px;
      border-right: 1px solid rgba($color: #000000, $alpha: 0.05);
      position: relative;
      display: flex;
      align-items: center;
      .batch-export-box {
        position: absolute;
        padding-top: 8px;
        width: 360px;
        height: 248px;
        bottom: 30px;
        left: 100px;
        background: #ffffff;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        &__title {
          border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
          height: 34px;
          line-height: 34px;
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.6);
          padding: 0px 16px;
        }
        &__word {
          padding: 16px;
          font-size: 14px;
          color: var(--el-color-primary);
          display: flex;
          > span {
            margin-right: 16px;
          }
          span:last-child {
            margin-right: 0px;
          }
        }
        &__desc {
          padding: 16px;
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.3);
          border-top: 1px solid rgba($color: #000000, $alpha: 0.05);
        }
      }
    }
    .add-link {
      margin-left: 16px;
      display: flex;
      align-items: center;
    }
  }
  &__footer {
    height: 26px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    font-size: 12px;

    .label {
      color: rgba($color: #000000, $alpha: 0.3);
    }
    .num {
      // font-family: 'Rubik';
      margin-right: 4px;
      color: rgba($color: #000000, $alpha: 0.8);
    }
    .right-icon {
      position: absolute;
      bottom: 0px;
      right: 0px;
      cursor: pointer;
    }
  }
  &_input {
    width: 100%;
    min-height: 200px;
    box-sizing: border-box;
    padding: 8px;
    line-height: 1.5;
    word-break: break-all;
    color: rgba($color: #000000, $alpha: 0.8);
    // 允许编辑，禁止富文本
    -webkit-user-modify: read-write-plaintext-only;
    &:focus {
      outline: none;
    }
  }
}

.edit-tag-textarea {
  &.is-disabled {
    background: #f7f7f7;
    .edit-tag-textarea_input {
      -webkit-user-modify: read-only;
    }
    .edit-tag-textarea__footer {
      .num {
        color: var(--el-color-error);
      }
    }
  }
}
.edit-tag-textarea {
  tag {
    color: #fff;
    background: var(--el-color-primary);
    padding: 0 2px;
    margin: 0 2px;
    white-space: nowrap;
    border-radius: 2px;
    cursor: default;
    -webkit-user-modify: read-only !important;
  }
  .active {
    background: #dcdfe6;
  }
}
</style>
